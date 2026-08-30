"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/Breadcrumb/Breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
import type { StatusBox } from "@/components/crm/AccountContextPanel";
import type { Account } from "@/types/crm";

/** Darkest navy — seamless header + nav block (shared with the Glass demos) */
const DARKEST_NAVY = "#161B2E";
/** Dark navy — search field on the chrome */
const DARK_NAVY = "#212946";

/* ========== Glass pane + card surfaces ========== */
const PANE_LIGHT = "bg-gray-100";
const PANE_DARK = "dark:bg-gray-900";
const GLASS_CARD_LIGHT =
  "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40";
const GLASS_CARD_DARK =
  "dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border-white/[0.12] dark:shadow-none";

/* ========== Tally+ Small Market brand palette ========== */
/** Brand primary — buttons, avatars, light-mode accents */
const BRAND_PRIMARY = "#006180";
/** Brand accent on dark chrome — nav active text, indicators, focus rings */
const BRAND_ON_DARK = "#80E0FF";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard", label: "Dashboard", icon: "home",
    children: [
      { id: "dashboard-overview", label: "Overview" },
      { id: "dashboard-exceptions", label: "Exceptions" },
    ],
  },
  {
    id: "tasks", label: "Tasks & Exceptions", icon: "notifications",
    children: [
      { id: "tasks-queue", label: "Task Queue" },
      { id: "tasks-exceptions", label: "Exceptions" },
    ],
  },
  {
    id: "market", label: "Market", icon: "store",
    children: [
      { id: "market-change-requests", label: "Change Requests" },
      { id: "market-transactions", label: "Transactions" },
    ],
  },
  { id: "adjustments", label: "Adjustments", icon: "tune", children: [] },
  {
    id: "metering", label: "Metering Services Registry", icon: "table_chart",
    children: [
      { id: "metering-meters", label: "Meters" },
      { id: "metering-reads", label: "Meter Reads" },
    ],
  },
  {
    id: "reports", label: "Reports", icon: "assessment",
    children: [
      { id: "reports-standard", label: "Standard Reports" },
      { id: "reports-scheduled", label: "Scheduled Reports" },
    ],
  },
  { id: "products", label: "Products", icon: "inventory_2", children: [] },
  { id: "maintenance", label: "Maintenance", icon: "build", children: [] },
];

const TAB_CONFIG: { value: string; label: string; badge?: number }[] = [
  { value: "details", label: "Details" },
  { value: "pricing", label: "Pricing" },
  { value: "financial", label: "Financial" },
  { value: "utility", label: "Utility" },
  { value: "usage", label: "Usage" },
  { value: "market", label: "Market" },
  { value: "interaction", label: "Interaction" },
  { value: "timeline", label: "Timeline" },
  { value: "tasks-exceptions", label: "Tasks & Exceptions", badge: 1 },
  { value: "recurring-events", label: "Recurring Events" },
];

const DETAILS_CARD_TITLES = [
  "Account Summary",
  "Billing Configuration",
  "Payment Details",
  "Contact Information",
  "Service Address",
] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  DETAILS_CARD_TITLES.map((title) => [title, true])
);

const RECENT_BILLS = [
  { id: "INV-2025-05", date: "27 Apr 2025", amount: "$142.50", status: "paid", dueDate: "12 May 2025" },
  { id: "INV-2025-04", date: "27 Mar 2025", amount: "$138.20", status: "paid", dueDate: "11 Apr 2025" },
  { id: "INV-2025-03", date: "27 Feb 2025", amount: "$156.80", status: "paid", dueDate: "14 Mar 2025" },
  { id: "INV-2025-02", date: "27 Jan 2025", amount: "$145.30", status: "paid", dueDate: "11 Feb 2025" },
];

const USAGE_DATA = [
  { period: "May 2025", electricity: "285 kWh", gas: "45 GJ", cost: "$142.50" },
  { period: "Apr 2025", electricity: "268 kWh", gas: "42 GJ", cost: "$138.20" },
  { period: "Mar 2025", electricity: "312 kWh", gas: "48 GJ", cost: "$156.80" },
  { period: "Feb 2025", electricity: "290 kWh", gas: "44 GJ", cost: "$145.30" },
];

const SM_ACCOUNT: Account = {
  id: "sm-001",
  name: "Ronald Thomas",
  accountNumber: "104063774",
  type: "Commercial",
  status: "Active",
  nmis: ["6305194250"],
  energyType: "Electricity",
  primaryContact: {
    id: "sm-con-001",
    name: "Ronald Thomas",
    role: "Account Holder",
    email: "ronald.thomas@email.com",
    phone: "0464 464 646",
    isPrimary: true,
  },
  contacts: [
    {
      id: "sm-con-001",
      name: "Ronald Thomas",
      role: "Account Holder",
      email: "shirley.anderson@email.com",
      phone: "0491 579 760",
      isPrimary: true,
    },
  ],
  address: "1 Lee Walk, Cranbourne, VIC 3977",
  annualConsumption: "3,420 kWh",
  accountBalance: "$0.00",
  lastPaymentDate: "27/04/2025",
  lastPaymentAmount: "$142.50",
  contractEndDate: "15/04/2026",
  orgId: "org-sm-001",
  legalBusinessName: "Ronald Thomas",
  customerType: "Residential",
  accountStatus: "Open",
  isClosed: false,
  accountSyncStatus: true,
  consolidateToParent: false,
  isDirectDebit: true,
  terms: "Standard",
  serviceReferenceNumber: "SR-104063774",
  lifeSupport: false,
};

const PANEL_TABS = ["Control Panel", "X-Sell"] as const;
const PANEL_TAB_ICONS: Record<(typeof PANEL_TABS)[number], string> = {
  "Control Panel": "tune",
  "X-Sell": "sell",
};

const TASK_CATEGORIES = [
  { name: "Account Tasks", count: null, icon: "group" as const, hot: false },
  { name: "Financial Tasks", count: 26, icon: "attach_money" as const, hot: true },
  { name: "Supply Tasks", count: 3, icon: "bolt" as const, hot: false },
  { name: "Interaction Tasks", count: 5, icon: "chat_bubble_outline" as const, hot: false },
  { name: "Utility Tasks", count: 17, icon: "monitoring" as const, hot: false },
  { name: "Credit Tasks", count: 29, icon: "credit_card" as const, hot: true },
  { name: "Customer Tasks", count: 15, icon: "group" as const, hot: false },
  { name: "No Contact Tasks", count: 6, icon: "power_settings_new" as const, hot: false },
];

const ACCOUNT_STATUS_BOXES: StatusBox[] = [
  { label: "$0.00 In Credit", value: "Nothing Overdue" },
  { label: "Open", value: "No Churn Activity" },
  { label: "Monthly Billing", value: "Not Billed" },
  { label: "Account Commence", value: "15 Apr 2025" },
];

function DataCell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-density-xs", className)}>
      <span className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-sm)" }}>{label}</span>
      <span className="text-foreground" style={{ fontSize: "var(--tally-font-size-sm)" }}>{value || "—"}</span>
    </div>
  );
}

export default function SmallMarketV15Page() {
  const [tabValue, setTabValue] = useState("details");
  const tabsScrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollArrows = React.useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  React.useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const check = () => updateScrollArrows();
    const raf = requestAnimationFrame(() => {
      check();
      requestAnimationFrame(check);
    });
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro.disconnect();
    };
  }, [updateScrollArrows]);

  const scrollTabs = (dir: "left" | "right") => {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const [activeNavId, setActiveNavId] = useState("dashboard-overview");
  const [openParentId, setOpenParentId] = useState<string | null>("dashboard");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [navCollapsed, setNavCollapsed] = useState(!isLg);
  const [isExpanded, setIsExpanded] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(true);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);
  // Anchored with fixed coords because the nav clips overflow during its width transition
  const [displayOptionsPos, setDisplayOptionsPos] = useState<{ bottom: number; left: number } | null>(null);

  const toggleDisplayOptions = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDisplayOptionsPos({ bottom: window.innerHeight - rect.bottom, left: rect.right + 12 });
    setDisplayOptionsOpen((v) => !v);
  };
  const [activePanelTab, setActivePanelTab] = useState<(typeof PANEL_TABS)[number]>("Control Panel");

  React.useEffect(() => {
    setNavCollapsed(!isLg);
  }, [isLg]);

  const [flyoutParentId, setFlyoutParentId] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFlyout = (e: React.MouseEvent, itemId: string) => {
    if (!navCollapsed) return;
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 8 });
    setFlyoutParentId(itemId);
  };
  const hideFlyout = () => {
    flyoutTimeout.current = setTimeout(() => {
      setFlyoutPos(null);
      setFlyoutParentId(null);
    }, 100);
  };
  const cancelHideFlyout = () => {
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
  };

  const handleParentClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      setOpenParentId((prev) => (prev === item.id ? null : item.id));
    } else {
      setActiveNavId(item.id);
    }
  };

  const isParentActive = (item: NavItem) => {
    if (activeNavId === item.id) return true;
    return item.children?.some((c) => c.id === activeNavId) ?? false;
  };

  const allCardsOpen = DETAILS_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(DETAILS_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(DETAILS_CARD_TITLES.map((t) => [t, false])));

  React.useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) {
      sidebar.style.display = isExpanded ? "none" : "";
    }
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, [isExpanded]);

  const glassCard = cn(GLASS_CARD_LIGHT, GLASS_CARD_DARK);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: DARKEST_NAVY }}
    >
      {/* Seamless chrome: header + nav as one dark block (no border between them) */}
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          {/* Left: Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/pages/small-market-v1-5" className="flex items-center">
              <Image
                src="/foundation/brands/tally-plus-small-market/TallyPlusSMLogoReversed.svg"
                alt="Tally+ Small Market"
                width={140}
                height={28}
                className="h-8 w-auto"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Icon
                name="search"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                placeholder="Search Tally+ Small Market…"
                className="h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#80E0FF]/50"
                style={{ backgroundColor: DARK_NAVY }}
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-gray-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Switch app"
            >
              <Icon name="grid_view" size={20} />
            </button>
            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Icon name="notifications" size={22} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E8560A]" aria-hidden />
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white ring-2 ring-[#80E0FF]/30"
              style={{ backgroundColor: BRAND_PRIMARY }}
            >
              SA
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Left navigation — same dark block as the header, no seam */}
          <aside
            className={cn(
              "flex min-h-0 shrink-0 flex-col overflow-hidden transition-[width] duration-300",
              navCollapsed ? "w-16" : "w-64"
            )}
          >
            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
              <nav className={cn("flex flex-col gap-0.5", navCollapsed ? "items-center p-2" : "p-2")}>
                {LEFT_NAV_ITEMS.map((item) => {
                  const hasChildren = (item.children?.length ?? 0) > 0;
                  const isOpen = openParentId === item.id;
                  const parentActive = isParentActive(item);

                  if (navCollapsed) {
                    return (
                      <div key={item.id} className="relative flex w-full justify-center">
                        {parentActive && (
                          <span
                            className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                            style={{ backgroundColor: BRAND_ON_DARK }}
                            aria-hidden
                          />
                        )}
                        <div
                          role="button"
                          tabIndex={0}
                          onMouseEnter={(e) => {
                            if (hasChildren) { cancelHideFlyout(); showFlyout(e, item.id); }
                          }}
                          onMouseLeave={() => { if (hasChildren) hideFlyout(); }}
                          onClick={() => { if (!hasChildren) setActiveNavId(item.id); }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              if (hasChildren) setFlyoutParentId(item.id);
                              else setActiveNavId(item.id);
                            }
                          }}
                          title={!hasChildren ? item.label : undefined}
                          className={cn(
                            "group flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80E0FF]/50",
                            parentActive
                              ? "bg-[#006180]/35 text-[#80E0FF]"
                              : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                          )}
                        >
                          <Icon
                            name={item.icon as "home"}
                            size={20}
                            className={cn(
                              "shrink-0",
                              parentActive ? "text-[#80E0FF]" : "text-gray-400 group-hover:text-gray-100"
                            )}
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="relative">
                      {parentActive && (
                        <span
                          className="absolute left-0 top-5 h-5 w-0.5 -translate-y-1/2 rounded-r"
                          style={{ backgroundColor: BRAND_ON_DARK }}
                          aria-hidden
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleParentClick(item)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80E0FF]/50",
                          parentActive || isOpen
                            ? "bg-[#006180]/35 text-[#80E0FF]"
                            : "text-gray-300 hover:bg-white/10 hover:text-gray-100"
                        )}
                      >
                        <Icon
                          name={item.icon as "home"}
                          size={20}
                          className={cn(
                            "shrink-0",
                            parentActive || isOpen
                              ? "text-[#80E0FF]"
                              : "text-gray-400 group-hover:text-gray-100"
                          )}
                        />
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {hasChildren && (
                          <Icon
                            name={isOpen ? "expand_less" : "expand_more"}
                            size={20}
                            className="shrink-0 text-gray-500"
                          />
                        )}
                      </button>
                      {hasChildren && isOpen && (
                        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                          {item.children!.map((child) => (
                            <li key={child.id}>
                              <button
                                type="button"
                                onClick={() => setActiveNavId(child.id)}
                                className={cn(
                                  "flex w-full items-center rounded-lg py-2 pl-2 pr-3 text-left text-sm font-normal transition-colors",
                                  activeNavId === child.id
                                    ? "bg-[#006180]/35 font-medium text-[#80E0FF]"
                                    : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                                )}
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
            <div className="shrink-0 border-t border-white/10">
              {navCollapsed ? (
                <div className="flex flex-col items-center gap-1 p-2">
                  <button
                    type="button"
                    onClick={toggleDisplayOptions}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 hover:text-gray-100",
                      displayOptionsOpen ? "bg-[#006180]/35 text-[#80E0FF]" : "text-gray-400"
                    )}
                    aria-label="Display options"
                    aria-expanded={displayOptionsOpen}
                  >
                    <Icon name="display_settings" size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpanded((v) => !v)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                    aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
                  >
                    <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setNavCollapsed(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                    aria-label="Expand navigation"
                  >
                    <Icon name="chevron_right" size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={toggleDisplayOptions}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10 hover:text-gray-100",
                        displayOptionsOpen ? "bg-[#006180]/35 text-[#80E0FF]" : "text-gray-400"
                      )}
                      aria-label="Display options"
                      aria-expanded={displayOptionsOpen}
                    >
                      <Icon name="display_settings" size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExpanded((v) => !v)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                      aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
                    >
                      <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={18} />
                    </button>
                    <Image
                      src="/PoweredByTallyBadgeREV.svg"
                      alt="Powered by Tally"
                      width={120}
                      height={29}
                      className="h-auto w-[120px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setNavCollapsed(true)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                    aria-label="Collapse navigation"
                  >
                    <Icon name="chevron_left" size={20} />
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Display options — density & theme */}
          {displayOptionsOpen && displayOptionsPos && (
            <>
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Close display options"
                onClick={() => setDisplayOptionsOpen(false)}
              />
              <div
                className={cn("fixed z-50 w-56 rounded-xl p-4 shadow-2xl", glassCard)}
                style={{ bottom: displayOptionsPos.bottom, left: displayOptionsPos.left }}
              >
                <p className="mb-3 text-xs font-semibold text-gray-900 dark:text-slate-100">Display options</p>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Density</p>
                    <DensityModeSwitch />
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Theme</p>
                    <ThemeModeSwitch />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Collapsed flyout for parent items with children */}
          {navCollapsed && flyoutParentId && flyoutPos && (() => {
            const parentItem = LEFT_NAV_ITEMS.find((i) => i.id === flyoutParentId);
            if (!parentItem?.children?.length) return null;
            return (
              <div
                className="fixed z-[100] min-w-[180px] rounded-xl border border-white/10 py-2 shadow-2xl"
                style={{
                  top: flyoutPos.top,
                  left: flyoutPos.left,
                  backgroundColor: DARK_NAVY,
                }}
                onMouseEnter={() => cancelHideFlyout()}
                onMouseLeave={() => hideFlyout()}
              >
                <div className="px-4 pb-1 pt-1.5 text-sm font-normal text-gray-300">
                  {parentItem.label}
                </div>
                <div className="relative ml-4 border-l border-white/10">
                  {parentItem.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        setActiveNavId(child.id);
                        setOpenParentId(parentItem.id);
                        hideFlyout();
                      }}
                      className={cn(
                        "flex w-full items-center py-2 pl-3 pr-4 text-left text-sm font-normal transition-colors",
                        activeNavId === child.id
                          ? "mx-2 rounded-lg bg-[#006180]/35 font-medium text-[#80E0FF]"
                          : "text-gray-400 hover:text-gray-100"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Main content — light (default) / dark pane with glass panels */}
          <main
            className={cn(
              "flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem]",
              !controlPanelOpen && "rounded-tr-[1.5rem]",
              PANE_LIGHT,
              PANE_DARK
            )}
          >
            <AccountContextPanel
              account={SM_ACCOUNT}
              statusBoxes={ACCOUNT_STATUS_BOXES}
              collapsible
              defaultCollapsed
              className={cn("rounded-2xl", glassCard)}
            />

            <div className="@container min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[1600px] px-density-lg py-density-lg">
                {/* Breadcrumb + Glass logo */}
                <div className="mb-density-lg flex items-center justify-between gap-density-sm">
                  <Breadcrumb className="min-w-0">
                    <BreadcrumbList className="flex-nowrap items-center gap-density-sm text-gray-700 dark:text-slate-300" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                      <BreadcrumbItem className="shrink-0">
                        <BreadcrumbLink asChild>
                          <Link
                            href="/"
                            className="flex items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
                          >
                            <Icon name="home" size={18} className="text-gray-600 dark:text-slate-400" />
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="shrink-0 text-gray-400 [&>svg]:size-4" />
                      {/* Middle items — collapse to ellipsis on narrow widths */}
                      <BreadcrumbItem className="hidden @lg:flex">
                        <BreadcrumbLink asChild>
                          <Link
                            href="/pages"
                            className="whitespace-nowrap text-gray-700 transition-colors hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
                          >
                            Customers
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden shrink-0 text-gray-400 @lg:flex [&>svg]:size-4" />
                      <BreadcrumbItem className="hidden @xl:flex">
                        <BreadcrumbLink asChild>
                          <Link
                            href="/pages/small-market-v1-5"
                            className="whitespace-nowrap text-gray-700 transition-colors hover:text-[#006180] dark:text-slate-300 dark:hover:text-[#80E0FF]"
                          >
                            Tally+ Small Market Accounts
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden shrink-0 text-gray-400 @xl:flex [&>svg]:size-4" />
                      {/* Ellipsis shown when middle items are hidden */}
                      <BreadcrumbItem className="@xl:hidden">
                        <BreadcrumbEllipsis className="text-gray-400" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="shrink-0 text-gray-400 @xl:hidden [&>svg]:size-4" />
                      <BreadcrumbItem className="min-w-0">
                        <BreadcrumbPage className="truncate rounded bg-[#E6F7FF] px-2.5 py-1 font-normal text-[#006180] dark:bg-[#006180]/25 dark:text-[#80E0FF]">
                          104063774 - Ronald Thomas
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <Link
                    href="/pages/glass-vision-demo-v2?expanded=true"
                    className={cn(
                      "flex shrink-0 items-center rounded-lg p-1.5 transition-colors hover:bg-[#E6F7FF] dark:hover:bg-[#006180]/25",
                      glassCard
                    )}
                    title="Open Tally Glass Vision"
                  >
                    <Image
                      src="/GlassLogoTest.svg"
                      alt="Tally Glass"
                      width={80}
                      height={24}
                      className="h-5 w-auto dark:hidden"
                    />
                    <Image
                      src="/GlassLogoTest_darkmode.svg"
                      alt="Tally Glass"
                      width={80}
                      height={24}
                      className="hidden h-5 w-auto dark:block"
                    />
                  </Link>
                </div>

                {/* Tabs — underline variant (baseline + active indicator) */}
                <Tabs value={tabValue} onValueChange={setTabValue} className="mb-density-xl">
                  <div className="relative mb-density-xl flex items-center">
                    <button
                      type="button"
                      onClick={() => scrollTabs("left")}
                      className={cn(
                        "absolute left-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-r from-gray-100 via-gray-100/90 to-transparent transition-opacity dark:from-gray-900 dark:via-gray-900/90",
                        canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
                      )}
                      aria-label="Scroll tabs left"
                      tabIndex={canScrollLeft ? 0 : -1}
                    >
                      <Icon name="chevron_left" size={18} className="text-gray-500 dark:text-slate-400" />
                    </button>
                    <TabsList
                      ref={tabsScrollRef}
                      className="flex h-auto w-full flex-nowrap justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 text-gray-500 scrollbar-none dark:border-gray-700 dark:bg-transparent dark:text-slate-400"
                    >
                      {TAB_CONFIG.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className="-mb-px shrink-0 rounded-none bg-transparent px-5 py-2.5 text-sm font-medium shadow-none transition-all hover:bg-transparent hover:text-gray-700 data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#006180] data-[state=active]:shadow-none dark:hover:text-slate-200 dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-[#80E0FF] border-b-2 border-transparent data-[state=active]:border-[#006180] dark:data-[state=active]:border-[#80E0FF]"
                        >
                          {tab.label}
                          {tab.badge != null && (
                            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-[10px] font-semibold text-gray-600 dark:border-white/20 dark:text-slate-300">
                              {tab.badge}
                            </span>
                          )}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <button
                      type="button"
                      onClick={() => scrollTabs("right")}
                      className={cn(
                        "absolute right-0 z-10 flex h-full w-8 items-center justify-center bg-gradient-to-l from-gray-100 via-gray-100/90 to-transparent transition-opacity dark:from-gray-900 dark:via-gray-900/90",
                        canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
                      )}
                      aria-label="Scroll tabs right"
                      tabIndex={canScrollRight ? 0 : -1}
                    >
                      <Icon name="chevron_right" size={18} className="text-gray-500 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Details Tab */}
                  <TabsContent value="details" className="mt-0">
                    <div className="mb-density-lg flex flex-wrap items-center gap-density-md">
                      <h2 className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>Account Details</h2>
                      <button
                        type="button"
                        onClick={allCardsOpen ? collapseAll : expandAll}
                        className="inline-flex items-center gap-density-sm font-medium text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
                        style={{ fontSize: "var(--tally-font-size-sm)" }}
                        aria-label={allCardsOpen ? "Collapse all" : "Expand all"}
                      >
                        {allCardsOpen ? (
                          <>
                            <Icon name="unfold_less" size={18} />
                            Collapse all
                          </>
                        ) : (
                          <>
                            <Icon name="unfold_more" size={18} />
                            Expand all
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-density-xl">
                      <CollapsibleCard
                        title="Account Summary"
                        open={cardOpenState["Account Summary"]}
                        onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account Summary": open }))}
                        className={cn("rounded-2xl", glassCard)}
                      >
                        <div className="grid grid-cols-1 gap-density-xl sm:grid-cols-2 lg:grid-cols-3">
                          <DataCell label="Account Type" value="Residential" />
                          <DataCell label="Protection Classification" value="Tally+ Small Market" />
                          <DataCell label="Journal Segment" value="Residential" />
                          <DataCell label="Credit Status" value="Standard" />
                          <DataCell label="Account Status" value="Open" />
                          <DataCell label="Commence Date" value="15 Apr 2025" />
                          <DataCell label="Move In Date" value="15 Apr 2025" />
                          <DataCell label="Occupancy Type" value="Owner Occupied" />
                          <DataCell label="Life Support" value="No" />
                        </div>
                      </CollapsibleCard>

                      <CollapsibleCard
                        title="Billing Configuration"
                        open={cardOpenState["Billing Configuration"]}
                        onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Billing Configuration": open }))}
                        className={cn("rounded-2xl", glassCard)}
                      >
                        <div className="space-y-density-lg">
                          <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2">
                            <Select label="Bill Group" defaultValue="monthly">
                              <option value="monthly">Monthly Bill Group</option>
                              <option value="quarterly">Quarterly Bill Group</option>
                            </Select>
                            <Input label="Invoice Due Days" type="number" defaultValue="15" />
                          </div>
                          <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2">
                            <Select label="Correspondence Delivery" defaultValue="email">
                              <option value="email">Email</option>
                              <option value="post">Post</option>
                              <option value="both">Both</option>
                            </Select>
                            <Input label="Invoice Template" defaultValue="Standard Residential" />
                          </div>
                          <div>
                            <label className="mb-density-sm block font-medium text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>
                              Custom Invoice Message
                            </label>
                            <textarea
                              className="w-full rounded-density-md border border-gray-200 bg-white/70 px-density-md py-density-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006180] focus-visible:ring-offset-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-100"
                              style={{ fontSize: "var(--tally-font-size-sm)" }}
                              rows={3}
                              defaultValue="The Australian Government and your State Government require us to provide you with information about energy rebates and concessions."
                            />
                          </div>
                          <div className="flex items-center gap-density-lg">
                            <Checkbox label="Override Due Days" />
                            <Checkbox label="Sensitive Load" />
                          </div>
                        </div>
                      </CollapsibleCard>

                      <CollapsibleCard
                        title="Payment Details"
                        open={cardOpenState["Payment Details"]}
                        onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Payment Details": open }))}
                        className={cn("rounded-2xl", glassCard)}
                      >
                        <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2">
                          <Select label="Payment Frequency" defaultValue="monthly">
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="yearly">Yearly</option>
                          </Select>
                          <Input label="Payment Method" defaultValue="Direct Debit" />
                          <Input label="Next Payment Date" type="date" defaultValue="2025-05-28" />
                          <Input label="Payment Amount" defaultValue="$142.50" />
                        </div>
                      </CollapsibleCard>

                      <CollapsibleCard
                        title="Contact Information"
                        open={cardOpenState["Contact Information"]}
                        onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Contact Information": open }))}
                        className={cn("rounded-2xl", glassCard)}
                      >
                        <div className="mb-density-lg flex items-center justify-between rounded-density-md border border-gray-200/80 bg-white/60 p-density-lg dark:border-white/10 dark:bg-white/[0.06]">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>Ronald Thomas</p>
                            <p className="mt-density-xs text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>Primary Contact since 14 Apr 2025</p>
                          </div>
                          <Badge variant="info">Primary</Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center gap-density-sm">
                            <Icon name="phone" size={18} className="text-gray-500 dark:text-slate-400" />
                            <span className="text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>0464 464 646</span>
                          </div>
                          <div className="flex items-center gap-density-sm">
                            <Icon name="email" size={18} className="text-gray-500 dark:text-slate-400" />
                            <span className="text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>ronald.thomas@email.com</span>
                          </div>
                          <div className="flex items-center gap-density-sm">
                            <Icon name="badge" size={18} className="text-gray-500 dark:text-slate-400" />
                            <span className="text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>31680432</span>
                          </div>
                        </div>
                      </CollapsibleCard>

                      <CollapsibleCard
                        title="Service Address"
                        open={cardOpenState["Service Address"]}
                        onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Service Address": open }))}
                        className={cn("rounded-2xl", glassCard)}
                      >
                        <div className="space-y-density-lg">
                          <div className="rounded-density-md border border-gray-200/80 bg-white/60 p-density-lg dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>Service Address</p>
                                <p className="mt-density-xs font-medium text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>1 Lee Walk</p>
                                <p className="text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>Cranbourne, VIC 3977</p>
                              </div>
                              <button className="text-[#006180] hover:text-[#004D66] dark:text-[#80E0FF] dark:hover:text-[#B3EDFF]">
                                <Icon name="edit" size={18} />
                              </button>
                            </div>
                          </div>
                          <div className="rounded-density-md border border-gray-200/80 bg-white/60 p-density-lg dark:border-white/10 dark:bg-white/[0.06]">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>Postal Address</p>
                                <p className="mt-density-xs font-medium text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>666-678 Lygon Street</p>
                                <p className="text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-sm)" }}>Carlton North, VIC 3054</p>
                              </div>
                              <button className="text-[#006180] hover:text-[#004D66] dark:text-[#80E0FF] dark:hover:text-[#B3EDFF]">
                                <Icon name="edit" size={18} />
                              </button>
                            </div>
                          </div>
                          <DataCell label="NMI - National Meter ID" value="6305194250" />
                        </div>
                      </CollapsibleCard>

                      <div className="flex items-center justify-end gap-density-md">
                        <Button variant="outline" className="border-[#006180] bg-white/60 text-[#006180] hover:bg-[#006180]/10 focus:ring-[#006180] dark:border-[#80E0FF] dark:bg-transparent dark:text-[#80E0FF] dark:hover:bg-[#80E0FF]/10">
                          Cancel
                        </Button>
                        <Button
                          className="!bg-[#006180] text-white hover:!bg-[#004D66] focus:ring-[#006180] dark:!bg-[#006180] dark:text-white dark:hover:!bg-[#004D66]"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Financial Tab */}
                  <TabsContent value="financial" className="mt-0">
                    <div className="space-y-density-xl">
                      <Card className={cn("overflow-hidden rounded-2xl", glassCard)}>
                        <CardHeader className="pb-density-lg">
                          <div className="flex items-center justify-between">
                            <CardTitle className="font-bold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-base)" }}>Recent Bills</CardTitle>
                            <Button variant="outline" size="sm" className="bg-white/60 dark:bg-transparent">
                              <Icon name="download" size={16} className="mr-1" />
                              Export
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/80 dark:bg-white/[0.06]">
                                <TableHead className="pl-6">Invoice ID</TableHead>
                                <TableHead>Issue Date</TableHead>
                                <TableHead>Due Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="pr-6">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {RECENT_BILLS.map((bill) => (
                                <TableRow key={bill.id}>
                                  <TableCell className="pl-6 font-medium text-gray-900 dark:text-slate-100">{bill.id}</TableCell>
                                  <TableCell>{bill.date}</TableCell>
                                  <TableCell>{bill.dueDate}</TableCell>
                                  <TableCell className="font-medium">{bill.amount}</TableCell>
                                  <TableCell className="pr-6">
                                    <Badge variant={bill.status === "paid" ? "success" : "warning"}>
                                      {bill.status === "paid" ? "Paid" : "Pending"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Usage Tab */}
                  <TabsContent value="usage" className="mt-0">
                    <div className="space-y-density-xl">
                      <Card className={cn("overflow-hidden rounded-2xl", glassCard)}>
                        <CardHeader className="pb-density-lg">
                          <CardTitle className="font-bold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-base)" }}>Usage History</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0 pb-0">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50/80 dark:bg-white/[0.06]">
                                <TableHead className="pl-6">Period</TableHead>
                                <TableHead>Electricity</TableHead>
                                <TableHead>Gas</TableHead>
                                <TableHead className="pr-6">Total Cost</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {USAGE_DATA.map((usage) => (
                                <TableRow key={usage.period}>
                                  <TableCell className="pl-6 font-medium text-gray-900 dark:text-slate-100">{usage.period}</TableCell>
                                  <TableCell>{usage.electricity}</TableCell>
                                  <TableCell>{usage.gas}</TableCell>
                                  <TableCell className="pr-6 font-medium">{usage.cost}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Other Tabs */}
                  {TAB_CONFIG.filter((t) => !["details", "financial", "usage"].includes(t.value)).map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0">
                      <div className={cn("rounded-2xl p-density-xxl text-center text-muted-foreground", glassCard)}>
                        <p className="capitalize">{tab.label} content would go here.</p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </div>
          </main>

          {/* Right-hand control panel — dark rail, collapses to an icon strip */}
          <aside
            className={cn(
              "dark shrink-0 overflow-hidden bg-[#161B2E] transition-[width,padding] duration-300 ease-in-out",
              controlPanelOpen ? "w-80 p-3" : "w-14 py-4"
            )}
            aria-label="Control panel"
          >
            {!controlPanelOpen ? (
              <div className="flex h-full flex-col items-center gap-2">
                {PANEL_TABS.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActivePanelTab(tab);
                      setControlPanelOpen(true);
                    }}
                    aria-label={`Open ${tab}`}
                    title={tab}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                      activePanelTab === tab
                        ? "bg-[#006180]/35 text-[#80E0FF]"
                        : "text-slate-400 hover:bg-white/10 hover:text-slate-100"
                    )}
                  >
                    <Icon name={PANEL_TAB_ICONS[tab] as "tune"} size={20} />
                  </button>
                ))}
              </div>
            ) : (
              <div className={cn("flex h-full min-w-[290px] flex-col overflow-hidden rounded-2xl", glassCard)}>
                <div className="flex flex-1 flex-col overflow-y-auto">
                  {/* Panel tabs */}
                  <div className="flex items-center gap-1 px-3 pb-2 pt-3">
                    <div className="flex flex-1 gap-1">
                      {PANEL_TABS.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActivePanelTab(tab)}
                          className={cn(
                            "whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                            activePanelTab === tab
                              ? "bg-[#006180]/25 text-[#80E0FF]"
                              : "text-slate-500 hover:text-slate-300"
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setControlPanelOpen(false)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
                      aria-label="Close control panel"
                    >
                      <Icon name="right_panel_close" size={16} />
                    </button>
                  </div>

                  {activePanelTab === "Control Panel" && (
                    <>
                      {/* Quick action buttons */}
                      <div className="flex gap-2 border-b border-white/[0.06] p-3.5">
                        {([
                          ["check_box", "Tasks", true],
                          ["add_comment", "New Interaction", false],
                          ["filter_alt", "Filter", false],
                          ["layers", "Work Items", false],
                        ] as const).map(([icon, label, active]) => (
                          <button
                            key={icon}
                            type="button"
                            aria-label={label}
                            className={cn(
                              "flex flex-1 items-center justify-center rounded-xl border px-1 py-2 backdrop-blur-lg transition-all hover:-translate-y-0.5",
                              active
                                ? "border-[#80E0FF]/30 bg-[#006180]/25 text-[#80E0FF]"
                                : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-[#80E0FF]/20 hover:bg-[#006180]/15 hover:text-[#80E0FF]"
                            )}
                          >
                            <Icon name={icon} size={17} />
                          </button>
                        ))}
                      </div>

                      {/* Create new task */}
                      <div className="px-3.5 pt-3.5">
                        <button
                          type="button"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#80E0FF]/25 bg-[#006180]/10 px-3 py-2.5 text-[13px] font-semibold text-[#80E0FF] transition-all hover:-translate-y-0.5 hover:border-[#80E0FF]/50 hover:bg-[#006180]/20"
                        >
                          <Icon name="add" size={16} />
                          Create new task
                          <span className="rounded bg-[#80E0FF] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#0B2430]">
                            New
                          </span>
                        </button>
                      </div>

                      {/* Account context + search */}
                      <div className="space-y-3 px-3.5 pt-3.5">
                        <div>
                          <p className="text-xs font-medium text-[#80E0FF]">
                            What Account Is The Task For?
                          </p>
                          <p className="mt-1.5 border-b border-white/10 pb-2 text-sm text-slate-100">
                            104063774 The Occupier
                          </p>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Search for a specific task"
                            className="w-full border-b-2 border-[#80E0FF] bg-transparent pb-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Task categories */}
                      <div className="flex-1 px-2 py-1.5">
                        {TASK_CATEGORIES.map((tc) => (
                          <button
                            key={tc.name}
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[#006180]/15"
                          >
                            <Icon name={tc.icon} size={17} className="shrink-0 text-slate-500" />
                            <span className="flex-1 text-left text-[13px] font-medium text-slate-300">
                              {tc.name}
                            </span>
                            <span
                              className={cn(
                                "min-w-[28px] rounded-full px-2 py-0.5 text-center font-mono text-[11.5px] font-medium",
                                tc.count === null
                                  ? "bg-white/[0.06] text-slate-500"
                                  : tc.hot
                                    ? "bg-red-500/15 text-red-300"
                                    : "bg-white/[0.06] text-slate-400"
                              )}
                            >
                              {tc.count ?? "—"}
                            </span>
                            <Icon name="chevron_right" size={15} className="shrink-0 text-slate-600" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {activePanelTab === "X-Sell" && (
                    <div className="flex-1 px-3.5 py-3.5">
                      <p className="text-sm text-slate-400">X-Sell content would go here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
