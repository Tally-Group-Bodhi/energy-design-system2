"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  /** Submenu items; parent may have no href */
  children?: NavigationItem[];
}

export interface EnvironmentOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  /** e.g. teal planet, red planet for branding */
  accent?: "default" | "teal" | "red";
}

export interface NavTopSection {
  /** Icon name (e.g. "public" for planet) or custom element */
  icon?: string;
  title: string;
  subtitle?: string;
  /** If provided, top section opens environment switcher flyout */
  environments?: EnvironmentOption[];
  currentEnvironmentId?: string;
  onEnvironmentChange?: (id: string) => void;
  onAddEnvironment?: () => void;
  /** Direction of the environment flyout. "right" (default) flies out to the right; "dropdown" opens below the button */
  flyoutDirection?: "right" | "dropdown";
}

/** Brand-specific active state colours. Each Tally product passes its own palette. */
export interface NavActiveColors {
  /** Active background class, e.g. "bg-[#E6F7FF]" */
  bg: string;
  /** Active text class, e.g. "text-[#006180]" */
  text: string;
  /** Dark-mode active background class, e.g. "dark:bg-[#006180]/20" */
  darkBg: string;
  /** Dark-mode active text class, e.g. "dark:text-[#80E0FF]" */
  darkText: string;
}

const defaultActiveColors: NavActiveColors = {
  bg: "bg-gray-100",
  text: "text-gray-900",
  darkBg: "dark:bg-gray-700",
  darkText: "dark:text-gray-100",
};

interface NavigationBarProps {
  /** Main nav items (can include children for submenus) */
  items: NavigationItem[];
  /** Persistent items at bottom (e.g. Help, Settings) */
  bottomItems?: NavigationItem[];
  /** Top branding/context block with optional environment switcher */
  topSection?: NavTopSection;
  defaultActiveId?: string;
  /** Initial collapsed state (icon-only strip) */
  collapsed?: boolean;
  /** Controlled collapsed; if undefined, internal state is used */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** When true, uses shorter height for inline examples */
  compact?: boolean;
  /** Expand on hover when collapsed (e.g. for docs). Default false = use toggle only */
  expandOnHover?: boolean;
  onItemClick?: (itemId: string) => void;
  /** Brand-specific active state colours. Defaults to neutral gray. */
  activeColors?: NavActiveColors;
  className?: string;
}

export default function NavigationBar({
  items,
  bottomItems = [],
  topSection,
  defaultActiveId,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  compact = false,
  expandOnHover = false,
  onItemClick,
  activeColors: activeColorsProp,
  className,
}: NavigationBarProps) {
  const ac = activeColorsProp ?? defaultActiveColors;
  const activeClass = `${ac.bg} ${ac.text} ${ac.darkBg} ${ac.darkText}`;
  const activeIconClass = `${ac.text} ${ac.darkText}`;
  const [internalCollapsed, setInternalCollapsed] = useState(controlledCollapsed ?? true);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = (value: boolean) => {
    if (onCollapsedChange) onCollapsedChange(value);
    else setInternalCollapsed(value);
  };

  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);
  const [openParentId, setOpenParentId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; label: string } | null>(null);
  const [envFlyoutOpen, setEnvFlyoutOpen] = useState(false);
  const [hoveredParentForFlyout, setHoveredParentForFlyout] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const envRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // Show a fixed-position tooltip to the right of the collapsed nav
  const showTooltip = (e: React.MouseEvent, label: string) => {
    if (!collapsed) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 8, label });
  };
  const hideTooltip = () => setTooltipPos(null);

  // Show a fixed-position flyout for parent items with children
  const showFlyout = (e: React.MouseEvent, itemId: string) => {
    if (!collapsed) return;
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 8 });
    setHoveredParentForFlyout(itemId);
  };
  const hideFlyout = () => {
    flyoutTimeout.current = setTimeout(() => {
      setFlyoutPos(null);
      setHoveredParentForFlyout(null);
    }, 100);
  };
  const cancelHideFlyout = () => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
  };

  // Close env flyout when clicking outside
  useEffect(() => {
    if (!envFlyoutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (envRef.current && !envRef.current.contains(e.target as Node)) setEnvFlyoutOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [envFlyoutOpen]);

  // Keep parent open when activeId is a child (e.g. from defaultActiveId or navigation)
  useEffect(() => {
    for (const item of items) {
      const hasMatch = item.children?.some((c) => c.id === activeId);
      if (hasMatch) {
        setOpenParentId(item.id);
        return;
      }
    }
  }, [activeId, items]);

  const handleItemClick = (item: NavigationItem) => {
    if (item.disabled) return;
    if (item.children?.length) {
      setOpenParentId((prev) => (prev === item.id ? null : item.id));
      return;
    }
    setActiveId(item.id);
    onItemClick?.(item.id);
  };

  const isParentOpen = (itemId: string) => openParentId === itemId;
  const isActive = (itemId: string) => activeId === itemId;

  const navWidth = collapsed ? "w-16" : "w-64";
  const paddingX = collapsed ? "px-3" : "px-4";

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 flex flex-col border-r border-border bg-white transition-[width] duration-300 dark:border-gray-700 dark:bg-gray-800",
        compact ? "max-h-[520px] min-h-[420px]" : "h-full",
        navWidth,
        className
      )}
      onMouseEnter={expandOnHover ? () => setCollapsed(false) : undefined}
      onMouseLeave={expandOnHover ? () => setCollapsed(true) : undefined}
    >
      {/* ----- Top section (branding / environment switcher) ----- */}
      {topSection && (
        <div ref={envRef} className="relative shrink-0 border-b border-border dark:border-gray-700">
          <button
            type="button"
            onClick={() =>
              topSection.environments ? setEnvFlyoutOpen((o) => !o) : undefined
            }
            className={cn(
              "flex w-full items-center gap-3 rounded-none border-0 bg-transparent text-left outline-none transition-colors focus:outline-none focus-visible:outline-none",
              paddingX,
              compact ? "py-3" : "py-4",
              "hover:bg-gray-100 dark:hover:bg-gray-700",
              collapsed ? "justify-center px-0" : ""
            )}
          >
            {topSection.icon && (
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14B69D]/20 text-[#14B69D] dark:bg-[#14B69D]/30",
                  collapsed && "mx-auto"
                )}
              >
                <Icon name={topSection.icon} size={20} />
              </div>
            )}
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {topSection.title}
                </div>
                {topSection.subtitle && (
                  <div className="truncate text-xs text-muted-foreground">
                    {topSection.subtitle}
                  </div>
                )}
              </div>
            )}
            {!collapsed && topSection.environments && (
              <Icon
                name={envFlyoutOpen ? "expand_less" : "expand_more"}
                size={20}
                className="shrink-0 text-gray-500 dark:text-gray-400"
              />
            )}
          </button>

          {/* Environment flyout */}
          {topSection.environments && envFlyoutOpen && (
            <div
              className={cn(
                "absolute z-50 min-w-[200px] border border-border bg-white py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800",
                topSection.flyoutDirection === "dropdown"
                  ? "left-0 top-full mt-0 w-full rounded-b-lg"
                  : "left-full top-0 ml-0 rounded-r-lg"
              )}
            >
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Environment
              </div>
              {topSection.environments.map((env) => (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => {
                    topSection.onEnvironmentChange?.(env.id);
                    setEnvFlyoutOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      env.accent === "teal" && "bg-[#14B69D]/20 text-[#14B69D]",
                      env.accent === "red" && "bg-red-500/20 text-red-600 dark:text-red-400",
                      (!env.accent || env.accent === "default") && "bg-gray-200 dark:bg-gray-600"
                    )}
                  >
                    {env.icon ? (
                      <Icon name={env.icon} size={16} />
                    ) : (
                      <span className="text-xs font-medium">{env.label.charAt(0)}</span>
                    )}
                  </span>
                  <span className="truncate">{env.label}</span>
                  {topSection.currentEnvironmentId === env.id && (
                    <Icon name="check" size={18} className="ml-auto text-green-600 dark:text-green-400" />
                  )}
                </button>
              ))}
              {topSection.onAddEnvironment && (
                <button
                  type="button"
                  onClick={() => {
                    topSection.onAddEnvironment?.();
                    setEnvFlyoutOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700",
                    ac.text, ac.darkText
                  )}
                >
                  <Icon name="add" size={20} />
                  Add environment
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ----- Main nav (scrollable) ----- */}
      <div className="flex-1 overflow-y-auto overflow-x-visible p-2">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const hasChildren = (item.children?.length ?? 0) > 0;
            const isOpen = isParentOpen(item.id);
            const active = isActive(item.id);

            return (
              <li key={item.id} className="relative">

                {/* Expanded: parent row + inline children when open */}
                {hasChildren && !collapsed ? (
                  <>
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredItemId(item.id)}
                      onMouseLeave={() => setHoveredItemId(null)}
                      onClick={() => handleItemClick(item)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg border-0 bg-transparent text-left outline-none transition-colors focus:outline-none focus-visible:outline-none",
                        paddingX,
                        "py-2 text-sm font-normal",
                        active || isOpen
                          ? activeClass
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                        item.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      {item.icon && (
                        <Icon
                          name={item.icon}
                          size={20}
                          className={cn(
                            "shrink-0",
                            (active || isOpen)
                              ? activeIconClass
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                          )}
                        />
                      )}
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <Icon
                        name={isOpen ? "expand_less" : "expand_more"}
                        size={20}
                        className="shrink-0 text-gray-500 dark:text-gray-400"
                      />
                    </button>
                    {isOpen && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2 dark:border-gray-600">
                        {(item.children ?? []).map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.href ?? "#"}
                              onClick={(e) => {
                                if (child.disabled) e.preventDefault();
                                else {
                                  setActiveId(child.id);
                                  onItemClick?.(child.id);
                                }
                              }}
                              className={cn(
                                "flex items-center gap-2 rounded-lg py-2 pr-3 pl-2 text-sm font-normal transition-colors focus:outline-none focus-visible:outline-none",
                                isActive(child.id)
                                  ? activeClass
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    {/* Leaf item or compact row (compact parent with children = button for flyout only) */}
                    {collapsed && hasChildren ? (
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseEnter={(e) => {
                        setHoveredItemId(item.id);
                        cancelHideFlyout();
                        showFlyout(e, item.id);
                        hideTooltip();
                      }}
                      onMouseLeave={() => {
                        setHoveredItemId(null);
                        hideFlyout();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setHoveredParentForFlyout(item.id);
                        }
                      }}
                      className={cn(
                        "group relative flex cursor-pointer items-center rounded-lg border-0 bg-transparent py-2 text-sm font-normal outline-none transition-colors focus:outline-none focus-visible:outline-none",
                        collapsed
                          ? "mx-auto h-10 w-10 justify-center px-0 gap-0"
                          : `${paddingX} text-left gap-3`,
                        active
                          ? activeClass
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                      )}
                    >
                      {item.icon && (
                        <Icon
                          name={item.icon}
                          size={20}
                          className={cn(
                            "shrink-0",
                            active
                              ? activeIconClass
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                          )}
                        />
                      )}
                    </div>
                    ) : (
                      <Link
                      href={item.href ?? "#"}
                      onMouseEnter={(e) => {
                        setHoveredItemId(item.id);
                        showTooltip(e, item.label);
                      }}
                      onMouseLeave={() => {
                        setHoveredItemId(null);
                        hideTooltip();
                      }}
                      onClick={(e) => {
                        if (item.disabled) e.preventDefault();
                        else handleItemClick(item);
                      }}
                      className={cn(
                        "group relative flex items-center rounded-lg py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:outline-none",
                        collapsed
                          ? "mx-auto h-10 w-10 justify-center px-0 gap-0"
                          : `${paddingX} gap-3`,
                        active
                          ? activeClass
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                        item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
                      )}
                    >
                      {item.icon && (
                        <Icon
                          name={item.icon}
                          size={20}
                          className={cn(
                            "shrink-0",
                            active
                              ? activeIconClass
                              : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                          )}
                        />
                      )}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    )}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* ----- Bottom section (Help, Settings, collapse toggle) ----- */}
      <div className="shrink-0 border-t border-border dark:border-gray-700">
        <div className="p-2">
          {bottomItems.map((item) => (
            <Link
              key={item.id}
              href={item.href ?? "#"}
              onMouseEnter={(e) => {
                setHoveredItemId(item.id);
                showTooltip(e, item.label);
              }}
              onMouseLeave={() => {
                setHoveredItemId(null);
                hideTooltip();
              }}
              onClick={(e) => {
                if (item.disabled) e.preventDefault();
                else {
                  setActiveId(item.id);
                  onItemClick?.(item.id);
                }
              }}
              className={cn(
                "group flex items-center rounded-lg py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:outline-none",
                collapsed
                  ? "mx-auto h-10 w-10 justify-center px-0 gap-0"
                  : `${paddingX} gap-3`,
                isActive(item.id)
                  ? activeClass
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
                item.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={20}
                  className={cn(
                    "shrink-0",
                    isActive(item.id)
                      ? activeIconClass
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                  )}
                />
              )}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </div>
        {/* Powered by Tally badge + collapse toggle */}
        {collapsed ? (
          <div className="flex items-center justify-center p-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
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
              onClick={() => setCollapsed(!collapsed)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              aria-label="Collapse navigation"
            >
              <Icon name="chevron_left" size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Fixed tooltip for collapsed state — rendered outside overflow containers */}
      {collapsed && tooltipPos && !hoveredParentForFlyout && (
        <div
          className="pointer-events-none fixed z-[100] flex items-center"
          style={{ top: tooltipPos.top, left: tooltipPos.left, transform: "translateY(-50%)" }}
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

      {/* Fixed flyout for collapsed parent items with children */}
      {collapsed && hoveredParentForFlyout && flyoutPos && (() => {
        const parentItem = items.find((i) => i.id === hoveredParentForFlyout);
        if (!parentItem?.children) return null;
        return (
          <div
            className="fixed z-[100] min-w-[180px] rounded-md border border-gray-200 bg-white py-2 dark:border-gray-600 dark:bg-gray-800"
            style={{
              top: flyoutPos.top,
              left: flyoutPos.left,
              boxShadow:
                "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
            }}
            onMouseEnter={() => { cancelHideFlyout(); setHoveredParentForFlyout(parentItem.id); }}
            onMouseLeave={() => hideFlyout()}
          >
            <div className="px-4 pb-1 pt-1.5 text-sm font-normal text-gray-600 dark:text-gray-300">
              {parentItem.label}
            </div>
            <div className="relative ml-4 border-l border-gray-200 dark:border-gray-600">
            {parentItem.children.map((child) => (
              <Link
                key={child.id}
                href={child.href ?? "#"}
                onClick={(e) => {
                  if (child.disabled) e.preventDefault();
                  else {
                    setActiveId(child.id);
                    onItemClick?.(child.id);
                    hideFlyout();
                  }
                }}
                className={cn(
                  "flex items-center py-2 pl-3 pr-4 text-sm font-normal transition-colors",
                  isActive(child.id)
                    ? "mx-2 rounded-lg bg-gray-100 font-medium text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                )}
              >
                {child.label}
              </Link>
            ))}
            </div>
          </div>
        );
      })()}
    </nav>
  );
}
