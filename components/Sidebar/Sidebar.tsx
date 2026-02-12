"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header/Header";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SidebarItem {
  label: string;
  href: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
}

const SECTION_LINKS: Record<string, string | undefined> = {
  Elements: "/foundation",
  Brands: "/foundation/brands",
  Components: "/components",
  Patterns: "/components",
  Templates: "/pages",
};

const SECTION_ICONS: Record<string, string> = {
  Elements: "palette",
  Brands: "diamond",
  Components: "widgets",
  Patterns: "dashboard",
  Templates: "web",
};

const STORAGE_KEY = "ds-sidebar-collapsed";
const SECTIONS_STORAGE_KEY = "ds-sidebar-sections";

export default function Sidebar({ sections }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  // Tooltip (simple label) for collapsed icons without flyout
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    label: string;
  } | null>(null);

  // Flyout (item list) for collapsed section icons
  const [hoveredSectionIndex, setHoveredSectionIndex] = useState<number | null>(
    null
  );
  const [flyoutPos, setFlyoutPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const flyoutTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);

    const storedSections = localStorage.getItem(SECTIONS_STORAGE_KEY);
    if (storedSections) {
      try {
        setCollapsedSections(JSON.parse(storedSections));
      } catch {
        // ignore malformed JSON
      }
    }

    setMounted(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  const toggleSection = useCallback((title: string) => {
    setCollapsedSections((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Simple tooltip (unused when flyout is showing)
  const showTooltip = (e: React.MouseEvent, label: string) => {
    if (!collapsed) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
      label,
    });
  };
  const hideTooltip = () => setTooltipPos(null);

  // Flyout for collapsed section icons
  const showFlyout = (e: React.MouseEvent, sectionIdx: number) => {
    if (!collapsed) return;
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 8 });
    setHoveredSectionIndex(sectionIdx);
    hideTooltip();
  };
  const hideFlyout = () => {
    flyoutTimeout.current = setTimeout(() => {
      setFlyoutPos(null);
      setHoveredSectionIndex(null);
    }, 100);
  };
  const cancelHideFlyout = () => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
  };

  const isCollapsed = collapsed && mounted;

  return (
    <>
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border bg-white transition-[width] duration-300 dark:border-gray-700 dark:bg-gray-800",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* ----- Header ----- */}
        <div
          className={cn(
            "flex h-[92px] min-h-[92px] shrink-0 items-center border-b border-border dark:border-gray-700",
            isCollapsed ? "justify-center" : "px-6"
          )}
        >
          {isCollapsed ? (
            <Link href="/" className="flex flex-col items-center gap-1">
              <Image
                src="/tDS_Logo_Compact.svg"
                alt="Tally Design System"
                width={41}
                height={18}
                className="h-[18px] w-auto"
                priority
              />
              <span className="text-xs font-medium text-muted-foreground">
                1.5.0
              </span>
            </Link>
          ) : (
            <Header />
          )}
        </div>

        {/* ----- Navigation (scrollable) ----- */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            isCollapsed ? "p-2" : "px-4 py-4"
          )}
        >
          {sections.map((section, sectionIndex) => {
            const sectionHref = SECTION_LINKS[section.title];
            const sectionIcon = SECTION_ICONS[section.title];
            const isSectionCollapsed = collapsedSections[section.title];

            /* ---- Collapsed: icon with flyout on hover ---- */
            if (isCollapsed) {
              return (
                <div
                  key={sectionIndex}
                  className={sectionIndex > 0 ? "mt-1" : ""}
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      cancelHideFlyout();
                      showFlyout(e, sectionIndex);
                    }}
                    onMouseLeave={() => {
                      hideFlyout();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setHoveredSectionIndex(sectionIndex);
                      }
                    }}
                    className="group mx-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  >
                    {sectionIcon && <Icon name={sectionIcon} size={20} />}
                  </div>
                </div>
              );
            }

            /* ---- Expanded: full section with collapsible items ---- */
            return (
              <div
                key={sectionIndex}
                className={sectionIndex > 0 ? "mt-2" : ""}
              >
                {/* Section header row — matches NavigationBar parent item styling */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm font-normal text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                >
                  {sectionIcon && (
                    <Icon
                      name={sectionIcon}
                      size={20}
                      className="shrink-0 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                    />
                  )}
                  {sectionHref ? (
                    <Link
                      href={sectionHref}
                      onClick={(e) => e.stopPropagation()}
                      className="min-w-0 flex-1 truncate transition-colors hover:text-[#2C365D] dark:hover:text-white"
                    >
                      {section.title}
                    </Link>
                  ) : (
                    <span className="min-w-0 flex-1 truncate">
                      {section.title}
                    </span>
                  )}
                  <Icon
                    name={isSectionCollapsed ? "expand_more" : "expand_less"}
                    size={20}
                    className="shrink-0 text-gray-500 dark:text-gray-400"
                  />
                </button>

                {/* Collapsible item list — matches NavigationBar child item styling */}
                <div
                  className="grid transition-[grid-template-rows] duration-200 ease-in-out"
                  style={{
                    gridTemplateRows: isSectionCollapsed ? "0fr" : "1fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2 dark:border-gray-600">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={item.href}
                            className="flex items-center truncate rounded-lg py-2 pl-2 pr-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* ----- Bottom section (badge + collapse toggle) ----- */}
        <div className="shrink-0 border-t border-border dark:border-gray-700">
          {isCollapsed ? (
            <div className="flex items-center justify-center p-2">
              <button
                type="button"
                onClick={toggle}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label="Expand navigation"
              >
                <Icon name="chevron_right" size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                <Image
                  src="/PoweredByTallyBadge.svg"
                  alt="Powered by Tally"
                  width={123}
                  height={26}
                  className="block dark:hidden"
                />
                <Image
                  src="/PoweredByTallyBadgeDark.svg"
                  alt="Powered by Tally"
                  width={123}
                  height={26}
                  className="hidden dark:block"
                />
              </div>
              <button
                type="button"
                onClick={toggle}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label="Collapse navigation"
              >
                <Icon name="chevron_left" size={20} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Fixed tooltip for collapsed state (only when no flyout is showing) */}
      {isCollapsed && tooltipPos && hoveredSectionIndex === null && (
        <div
          className="pointer-events-none fixed z-[100] flex items-center"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: "translateY(-50%)",
          }}
        >
          <span
            className="whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-normal text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
            style={{
              boxShadow:
                "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
            }}
          >
            {tooltipPos.label}
          </span>
        </div>
      )}

      {/* Fixed flyout for collapsed section icons — shows section title + item links */}
      {isCollapsed &&
        hoveredSectionIndex !== null &&
        flyoutPos &&
        (() => {
          const section = sections[hoveredSectionIndex];
          if (!section) return null;
          const sectionHref = SECTION_LINKS[section.title];
          return (
            <div
              className="fixed z-[100] min-w-[180px] rounded-md border border-gray-200 bg-white py-2 dark:border-gray-600 dark:bg-gray-800"
              style={{
                top: flyoutPos.top,
                left: flyoutPos.left,
                boxShadow:
                  "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
              }}
              onMouseEnter={() => {
                cancelHideFlyout();
              }}
              onMouseLeave={() => hideFlyout()}
            >
              {/* Section title */}
              {sectionHref ? (
                <Link
                  href={sectionHref}
                  className="block px-4 pb-1 pt-1.5 text-sm font-medium text-gray-900 transition-colors hover:text-[#2C365D] dark:text-gray-100 dark:hover:text-white"
                >
                  {section.title}
                </Link>
              ) : (
                <div className="px-4 pb-1 pt-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {section.title}
                </div>
              )}
              {/* Item links */}
              <div className="relative ml-4 border-l border-gray-200 dark:border-gray-600">
                {section.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.href}
                    className="flex items-center py-2 pl-3 pr-4 text-sm font-normal text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    onClick={() => hideFlyout()}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
    </>
  );
}
