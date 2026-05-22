"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import { Icon } from "@/components/ui/icon";
import { SURFACE_NEUTRAL } from "@/lib/tokens/surface-colours";
import { cn } from "@/lib/utils";
import {
  EOS_BOTTOM_NAV,
  EOS_FULL_NAV,
  getBrandForView,
} from "./eos-nav";
import type { EosBrand, EosViewId } from "./eos-types";

const BRAND_STYLES: Record<
  EosBrand,
  {
    accent: string;
    activeColors: {
      bg: string;
      text: string;
      darkBg: string;
      darkText: string;
    };
    surface: string;
  }
> = {
  "tally-plus": {
    accent: "#00D2A2",
    activeColors: {
      bg: "bg-[#E8FBF5]",
      text: "text-[#007A5E]",
      darkBg: "dark:bg-[#00D2A2]/15",
      darkText: "dark:text-[#00D2A2]",
    },
    surface: SURFACE_NEUTRAL,
  },
  eos: {
    accent: "#2C365D",
    activeColors: {
      bg: "bg-[#E8FBF5]",
      text: "text-[#007A5E]",
      darkBg: "dark:bg-[#00D2A2]/15",
      darkText: "dark:text-[#00D2A2]",
    },
    surface: SURFACE_NEUTRAL,
  },
};

interface EosShellProps {
  activeView: EosViewId;
  onViewChange: (viewId: EosViewId) => void;
  children: React.ReactNode;
}

export default function EosShell({
  activeView,
  onViewChange,
  children,
}: EosShellProps) {
  const brand = getBrandForView(activeView);
  const styles = BRAND_STYLES[brand];
  const [navCollapsed, setNavCollapsed] = React.useState(false);

  const navItems = EOS_FULL_NAV;

  React.useEffect(() => {
    setNavCollapsed(true);
  }, []);

  const handleNavClick = (itemId: string) => {
    const validViews: EosViewId[] = [
      "enrollment-search",
      "application-acceptance",
      "batch-enroll-payments",
      "new-enrollment",
      "customer-account-summary",
      "customer-billing-accounts",
      "work-queue-search",
    ];
    if (validViews.includes(itemId as EosViewId)) {
      onViewChange(itemId as EosViewId);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div
        className="h-1 shrink-0"
        style={{ backgroundColor: styles.accent }}
        aria-hidden
      />

      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-4 dark:border-gray-800 dark:bg-gray-950/90 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/pages/eos" className="flex shrink-0 items-center">
            <Image
              src="/TallyPlus.svg"
              alt="Tally+"
              width={120}
              height={32}
              className="h-7 w-auto dark:hidden"
              priority
              unoptimized
            />
            <Image
              src="/TallyPlus_Reversed.svg"
              alt="Tally+"
              width={120}
              height={32}
              className="hidden h-7 w-auto dark:block"
              unoptimized
            />
          </Link>
        </div>

        <div className="flex flex-1 justify-center px-2">
          <div className="relative hidden w-full max-w-md md:block">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder="Quick search — accounts, tasks, enrollments…"
              className="h-10 w-full rounded-lg border border-border bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#2C365D] focus:outline-none focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden items-center gap-1.5 rounded-lg border border-border px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex"
          >
            <span aria-hidden>🇺🇸</span>
            <span>English (US)</span>
            <Icon name="expand_more" size={16} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Icon name="notifications" size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C40000]" />
          </button>
          <div className="hidden h-9 items-center gap-2 rounded-full border border-border bg-white pl-1 pr-3 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 sm:flex">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: "#2C365D" }}
            >
              {brand === "tally-plus" ? "EU" : "MP"}
            </div>
            <span className="hidden lg:inline">
              {brand === "tally-plus" ? "ExtEOSMrbUatAdmin" : "MrbProdAdmin"}
            </span>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white sm:hidden"
            style={{ backgroundColor: "#2C365D" }}
          >
            {brand === "tally-plus" ? "EU" : "MP"}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        <NavigationBar
          items={navItems}
          bottomItems={EOS_BOTTOM_NAV}
          defaultActiveId={activeView}
          collapsed={navCollapsed}
          onCollapsedChange={setNavCollapsed}
          onItemClick={handleNavClick}
          activeColors={styles.activeColors}
        />

        <main className={cn("flex min-h-0 min-w-0 flex-1 flex-col", styles.surface)}>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </div>

          <footer className="shrink-0 border-t border-border bg-white/60 px-6 py-2.5 text-center text-xs text-muted-foreground dark:border-gray-800 dark:bg-gray-950/60">
            © 2026 Znalytics, LLC. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}
