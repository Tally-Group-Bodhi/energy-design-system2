"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header/Header";
import { Icon } from "@/components/ui/icon";

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
  Foundation: "/foundation",
  Brands: "/foundation/brands",
  Pages: "/pages",
  Components: "/components",
};

const STORAGE_KEY = "ds-sidebar-collapsed";

export default function Sidebar({ sections }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setMounted(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, String(!prev));
      return !prev;
    });
  };

  const isCollapsed = collapsed && mounted;

  return (
    <>
      {/* Hamburger button — visible when sidebar is collapsed */}
      <button
        onClick={toggle}
        className={`fixed left-0 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-r-lg border border-l-0 border-border bg-white shadow-sm transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 ${
          isCollapsed ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
        aria-label="Open sidebar"
      >
        <Icon name="menu" size={20} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* Sidebar — uses negative margin to slide out of view */}
      <aside
        className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-white transition-[margin] duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800"
        style={{ marginLeft: isCollapsed ? "-256px" : "0px" }}
      >
        <div className="flex h-full w-64 flex-col">
          {/* Sticky header row with collapse button */}
          <div className="flex h-[92px] min-h-[92px] shrink-0 items-center justify-between border-b border-border px-6 dark:border-gray-700">
            <Header />
            <button
              onClick={toggle}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Collapse sidebar"
            >
              <Icon name="chevron_left" size={20} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-6">
            {sections.map((section, sectionIndex) => {
              const sectionHref = SECTION_LINKS[section.title];

              return (
                <div key={sectionIndex} className={sectionIndex > 0 ? "mt-8" : ""}>
                  {sectionHref ? (
                    <Link
                      href={sectionHref}
                      className="mb-3 inline-block whitespace-nowrap text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:text-[#2C365D] dark:text-gray-100 dark:hover:text-white"
                    >
                      {section.title}
                    </Link>
                  ) : (
                    <h2 className="mb-3 whitespace-nowrap text-sm font-bold uppercase tracking-wide text-gray-900 dark:text-gray-100">
                      {section.title}
                    </h2>
                  )}
                  <ul className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          href={item.href}
                          className="block whitespace-nowrap rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
