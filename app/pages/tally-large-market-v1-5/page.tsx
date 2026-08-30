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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import AccountContextPanel from "@/components/crm/AccountContextPanel";
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

/* ========== Tally Digital / Large Market brand palette ========== */
/** Brand primary — buttons, avatars, light-mode accents */
const BRAND_PRIMARY = "#FF5E00";
/** Brand accent on dark chrome — nav active text, indicators, focus rings */
const BRAND_ON_DARK = "#FFCF99";

const TAB_LIST_CLASS =
  "flex h-auto w-full flex-nowrap justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 text-gray-500 scrollbar-none dark:border-gray-700 dark:bg-transparent dark:text-slate-400";
const TAB_TRIGGER_CLASS =
  "-mb-px shrink-0 rounded-none border-b-2 border-transparent bg-transparent px-5 py-2.5 text-sm font-medium shadow-none transition-all hover:bg-transparent hover:text-gray-700 data-[state=active]:border-[#FF5E00] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#FF5E00] data-[state=active]:shadow-none dark:hover:text-slate-200 dark:data-[state=active]:border-[#FFCF99] dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-[#FFCF99]";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  {
    id: "home", label: "Home", icon: "dashboard",
    children: [
      { id: "home-dashboard", label: "Dashboard" },
      { id: "home-exceptions", label: "Exceptions" },
    ],
  },
  {
    id: "sales", label: "Sales", icon: "trending_up",
    children: [
      { id: "sales-discovery", label: "Discovery" },
      { id: "sales-bulk-discovery", label: "Bulk Discovery" },
      { id: "sales-quotes", label: "Quotes" },
    ],
  },
  {
    id: "customers", label: "Customers", icon: "group",
    children: [
      { id: "customers-accounts", label: "Accounts" },
      { id: "customers-manual-creation", label: "Manual Account Creation" },
      { id: "customers-add-new", label: "Add New Accounts" },
      { id: "customers-import-results", label: "View Import Results" },
    ],
  },
  {
    id: "billing", label: "Billing", icon: "receipt",
    children: [
      { id: "billing-dashboard", label: "Dashboard" },
      { id: "billing-batch", label: "Batch" },
      { id: "billing-review", label: "Review" },
      { id: "billing-invoices", label: "Invoices" },
      { id: "billing-invoice-revisions", label: "Invoice Revisions" },
      { id: "billing-schedule", label: "Schedule" },
      { id: "billing-nuos", label: "NUOS" },
      { id: "billing-statements", label: "Statements" },
      { id: "billing-ad-charges", label: "Ad. Charges" },
      { id: "billing-bill-messages", label: "Bill Messages" },
    ],
  },
  {
    id: "payments", label: "Payments", icon: "credit_card",
    children: [
      { id: "payments-suspense", label: "Suspense Account" },
    ],
  },
  {
    id: "market", label: "Market", icon: "store",
    children: [
      { id: "market-change-requests", label: "Change Requests" },
      { id: "market-change-request-dashboard", label: "Change Request Dashboard" },
      { id: "market-transactions-dashboard", label: "Transactions Dashboard" },
      { id: "market-bulk-life-support", label: "Bulk Life Support Reconciliation" },
      { id: "market-life-support-notif", label: "Life Support Notification (No Account)" },
    ],
  },
  {
    id: "reporting", label: "Reporting", icon: "insights",
    children: [
      { id: "reporting-reports", label: "Reports" },
      { id: "reporting-scheduled", label: "Scheduled Reports" },
    ],
  },
  {
    id: "onboarding", label: "Onboarding", icon: "headset_mic",
    children: [
      { id: "onboarding-queue", label: "Onboarding Queue" },
      { id: "onboarding-templates", label: "Templates" },
    ],
  },
  { id: "audit", label: "Audit", icon: "fact_check", children: [] },
  { id: "products", label: "Products", icon: "inventory_2", children: [] },
  { id: "settings", label: "Settings", icon: "settings", children: [] },
  { id: "file-upload", label: "File Upload", icon: "upload_file", children: [] },
];

const TAB_CONFIG = [
  { value: "overview", label: "Overview" },
  { value: "contacts", label: "Contacts" },
  { value: "contracts", label: "Contracts" },
  { value: "dunning", label: "Dunning" },
  { value: "payment-plan", label: "Payment Plan" },
  { value: "corro-suppressions", label: "Corro Suppressions" },
  { value: "site", label: "Site" },
  { value: "usage", label: "Usage" },
  { value: "more", label: "more" },
];

const VISIBLE_TABS_BEFORE_MORE = 5;
const TABS_IN_MORE = TAB_CONFIG.slice(VISIBLE_TABS_BEFORE_MORE);
const TABS_VISIBLE_ON_MD = TAB_CONFIG.slice(0, VISIBLE_TABS_BEFORE_MORE);
const isTabInMore = (value: string) => TABS_IN_MORE.some((t) => t.value === value);

const OVERVIEW_CARD_TITLES = [
  "Snapshot",
  "Account details",
  "Business information",
  "Suppress dunning",
  "Primary contact",
  "Key dates",
  "Additional details",
  "Account options",
] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  OVERVIEW_CARD_TITLES.map((title) => [title, true])
);

const INTERACTIONS = [
  { id: 1, title: "Billing configuration changed", category: "Billing", user: "Alan Stones", time: "3 hours ago" },
  { id: 2, title: "Billing Hold Reason Removed", category: "Billing", user: "Alan Stones", time: "3 hours ago" },
  { id: 3, title: "Account set to Billing as of 29/03/2024 as per TSD-35353.", category: "Billing", user: "Alan Stones", time: "3 hours ago" },
  { id: 4, title: "Missing Start/End Dates", category: "Billing", user: "Alan Stones", time: "3 hours ago" },
];

const CONTACTS_DATA = [
  {
    id: 1,
    name: "Phoenix Baker",
    dob: "12/04/1990",
    badge: "Primary",
    badgeVariant: "default" as const,
    details: {
      contactType: "Primary",
      fullName: "Phoenix Barker",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Billing",
      preferredContactMethod: "Residential",
      landlinePhone: "03555506536",
      mobilePhone: "04123456789",
      verificationPassphrase: "Not Set",
      email: "Phoenixbarker12345@gmail.com",
      address: "29 - 35 Collingwood Road, Collingwood VIC 3066",
      customerNumber: "10953",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 2,
    name: "Ethan Chang",
    dob: "12/04/1990",
    badge: "Secondary",
    badgeVariant: "secondary" as const,
    details: {
      contactType: "Secondary",
      fullName: "Ethan Chang",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Email",
      landlinePhone: "03555509821",
      mobilePhone: "04198765432",
      verificationPassphrase: "Set",
      email: "ethan.chang@email.com",
      address: "15 Collins Street, Melbourne VIC 3000",
      customerNumber: "10954",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 3,
    name: "Olivia Johnson",
    dob: "12/04/1990",
    badge: "CDN",
    badgeVariant: "info" as const,
    details: {
      contactType: "CDN",
      fullName: "Olivia Johnson",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Business",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Phone",
      landlinePhone: "03555501234",
      mobilePhone: "04111222333",
      verificationPassphrase: "Not Set",
      email: "olivia.johnson@business.com",
      address: "42 Bourke Street, Melbourne VIC 3000",
      customerNumber: "10955",
      cdnContact: "Yes",
      externalRef: "Business",
    },
  },
  {
    id: 4,
    name: "Aiden Smith",
    dob: "12/04/1990",
    badge: "Additional",
    badgeVariant: "info" as const,
    details: {
      contactType: "Additional",
      fullName: "Aiden Smith",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Residential",
      landlinePhone: "03555507890",
      mobilePhone: "04155566777",
      verificationPassphrase: "Set",
      email: "aiden.smith@email.com",
      address: "8 Flinders Lane, Melbourne VIC 3000",
      customerNumber: "10956",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 5,
    name: "Luna Martinez",
    dob: "12/04/1990",
    badge: "Additional",
    badgeVariant: "info" as const,
    details: {
      contactType: "Additional",
      fullName: "Luna Martinez",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Billing",
      preferredContactMethod: "Email",
      landlinePhone: "03555504567",
      mobilePhone: "04188899000",
      verificationPassphrase: "Not Set",
      email: "luna.martinez@email.com",
      address: "103 Lygon Street, Carlton VIC 3053",
      customerNumber: "10957",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
];

const LM_ACCOUNT: Account = {
  id: "lm-001",
  name: "Masked_Name_44D550D62",
  accountNumber: "QB00171824",
  type: "Commercial",
  status: "Active",
  nmis: ["30125553846"],
  energyType: "Electricity",
  primaryContact: {
    id: "lm-con-001",
    name: "Justine Masked_Name_32BB",
    role: "Account Manager",
    email: "justine.masked@example.com",
    phone: "07 3555 0653",
    isPrimary: true,
  },
  contacts: [
    {
      id: "lm-con-001",
      name: "Justine Masked_Name_32BB",
      role: "Account Manager",
      email: "justine.masked@example.com",
      phone: "07 3555 0653",
      isPrimary: true,
    },
  ],
  address: "155 Queen St, Melbourne, VIC 3000",
  annualConsumption: "4,500 kWh",
  accountBalance: "-$200.58",
  lastPaymentDate: "07/06/2023",
  lastPaymentAmount: "$50.10",
  contractEndDate: "30/06/2025",
  orgId: "org-lm-001",
  legalBusinessName: "AMPOL FOODARY GUMLY GUMLY",
  parentAccountName: "Residential",
  customerType: "Commercial",
  accountStatus: "Billing",
  isClosed: false,
  accountSyncStatus: true,
  consolidateToParent: false,
  isDirectDebit: false,
  terms: "Standard",
  serviceReferenceNumber: "SR-QB00171824",
  lifeSupport: false,
};

const PANEL_TABS = ["Actions", "Exceptions", "Tasks"] as const;
const PANEL_TAB_ICONS: Record<(typeof PANEL_TABS)[number], string> = {
  Actions: "bolt",
  Exceptions: "warning",
  Tasks: "check_box",
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

const CARD_GRID_CLASS = "grid grid-cols-1 gap-x-4 gap-y-4 2xl:grid-cols-2";

function DataCell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}

function SnapshotDataCell({ label, primaryValue, secondaryDetail, className }: { label: string; primaryValue: React.ReactNode; secondaryDetail?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-base font-bold text-gray-900 dark:text-slate-100">{primaryValue}</span>
      {secondaryDetail != null && secondaryDetail !== "" && <span className="text-sm text-muted-foreground">{secondaryDetail}</span>}
    </div>
  );
}

export default function TallyLargeMarketV15Page() {
  const [tabValue, setTabValue] = useState("overview");
  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const [activeNavId, setActiveNavId] = useState("customers-accounts");
  const [openParentId, setOpenParentId] = useState<string | null>("customers");
  const [interactionsOpen, setInteractionsOpen] = useState(false);
  const showInteractionsInline = useMediaQuery("(min-width: 1280px)");
  const [selectedContactId, setSelectedContactId] = useState(1);
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
  const [activePanelTab, setActivePanelTab] = useState<(typeof PANEL_TABS)[number]>("Tasks");

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
  const currentTabLabel = TAB_CONFIG.find((t) => t.value === tabValue)?.label ?? "Overview";
  const selectedContact = CONTACTS_DATA.find((c) => c.id === selectedContactId) ?? CONTACTS_DATA[0];

  const allCardsOpen = OVERVIEW_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, false])));

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
            <Link href="/pages/tally-large-market-v1-5" className="flex items-center">
              <Image
                src="/TallyCIS_Test_Reversed.svg"
                alt="Tally CIS"
                width={140}
                height={40}
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
                placeholder="Search Tally CIS…"
                className="h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFCF99]/50"
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
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FF5E00]" aria-hidden />
            </button>
            <Avatar className="h-9 w-9 ring-2 ring-[#FFCF99]/30">
              <AvatarFallback className="text-xs text-white" style={{ backgroundColor: BRAND_PRIMARY }}>
                PA
              </AvatarFallback>
            </Avatar>
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
                            "group flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCF99]/50",
                            parentActive
                              ? "bg-[#802F00]/40 text-[#FFCF99]"
                              : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                          )}
                        >
                          <Icon
                            name={item.icon as "dashboard"}
                            size={20}
                            className={cn(
                              "shrink-0",
                              parentActive ? "text-[#FFCF99]" : "text-gray-400 group-hover:text-gray-100"
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
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCF99]/50",
                          parentActive || isOpen
                            ? "bg-[#802F00]/40 text-[#FFCF99]"
                            : "text-gray-300 hover:bg-white/10 hover:text-gray-100"
                        )}
                      >
                        <Icon
                          name={item.icon as "dashboard"}
                          size={20}
                          className={cn(
                            "shrink-0",
                            parentActive || isOpen
                              ? "text-[#FFCF99]"
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
                                    ? "bg-[#802F00]/40 font-medium text-[#FFCF99]"
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
                      displayOptionsOpen ? "bg-[#802F00]/40 text-[#FFCF99]" : "text-gray-400"
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
                        displayOptionsOpen ? "bg-[#802F00]/40 text-[#FFCF99]" : "text-gray-400"
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
                          ? "mx-2 rounded-lg bg-[#802F00]/40 font-medium text-[#FFCF99]"
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
              account={LM_ACCOUNT}
              className={cn("rounded-2xl", glassCard)}
            />

            <div className="@container min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[1600px] px-4 py-4 xl:px-6 xl:py-6">
                {/* Breadcrumb + Glass logo */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <Breadcrumb className="min-w-0">
                    <BreadcrumbList className="flex-nowrap items-center gap-1.5 text-gray-700 dark:text-slate-300" style={{ fontSize: "var(--tally-font-size-sm)" }}>
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
                            href="/pages/tally-large-market-v1-5"
                            className="whitespace-nowrap text-gray-700 transition-colors hover:text-[#FF5E00] dark:text-slate-300 dark:hover:text-[#FFCF99]"
                          >
                            Accounts
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden shrink-0 text-gray-400 @xl:flex [&>svg]:size-4" />
                      <BreadcrumbItem className="@xl:hidden">
                        <BreadcrumbEllipsis className="text-gray-400" />
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="shrink-0 text-gray-400 @xl:hidden [&>svg]:size-4" />
                      <BreadcrumbItem className="min-w-0">
                        <BreadcrumbPage className="truncate rounded bg-[#FFF3E6] px-2.5 py-1 font-normal text-[#802F00] dark:bg-[#802F00]/25 dark:text-[#FFCF99]">
                          QB00171824 - Masked_Name_44D550D62
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <Link
                    href="/pages/glass-vision-demo-v2?expanded=true"
                    className={cn(
                      "flex shrink-0 items-center rounded-lg p-1.5 transition-colors hover:bg-[#FFF3E6] dark:hover:bg-[#802F00]/25",
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

                <h1 className="mb-6 truncate text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
                  QB00171824 - Masked_Name_44D550D62
                </h1>

                <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
                  {/* Small screens only: dropdown (hide from md up) */}
                  <div className="mb-4 flex md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-border bg-white/80 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5E00] focus:ring-offset-2 dark:border-white/10 dark:bg-white/[0.06] dark:text-gray-200 dark:hover:bg-white/[0.1]">
                        <span>{currentTabLabel}</span>
                        <Icon name="expand_more" size={20} className="text-gray-500 dark:text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[12rem] max-h-[min(70vh,20rem)] overflow-y-auto">
                        {TAB_CONFIG.map((tab) => (
                          <DropdownMenuItem
                            key={tab.value}
                            onClick={() => setTabValue(tab.value)}
                            className={cn(tab.value === tabValue && "bg-[#FFF3E6] font-medium text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]")}
                          >
                            {tab.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {/* Md up to just below xl: 5 tabs + More (hidden on small and on xl+) */}
                  <div className="mb-4 hidden md:block xl:hidden">
                    <TabsList className={cn(TAB_LIST_CLASS, "overflow-visible")}>
                      {TABS_VISIBLE_ON_MD.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={TAB_TRIGGER_CLASS}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                      <DropdownMenu>
                        <div className="relative z-10">
                          <DropdownMenuTrigger
                            className={cn(
                              "-mb-px inline-flex items-center justify-center whitespace-nowrap rounded-none border-b-2 bg-transparent px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5E00] focus-visible:ring-offset-2",
                              isTabInMore(tabValue)
                                ? "border-[#FF5E00] font-semibold text-[#FF5E00] dark:border-[#FFCF99] dark:text-[#FFCF99]"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
                            )}
                            aria-label="More tabs"
                          >
                            More
                            <Icon name="expand_more" size={18} className="ml-0.5" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[12rem] max-h-[min(70vh,20rem)] overflow-y-auto">
                            {TABS_IN_MORE.map((tab) => (
                              <DropdownMenuItem
                                key={tab.value}
                                onClick={() => setTabValue(tab.value)}
                                className={cn(tab.value === tabValue && "bg-[#FFF3E6] font-medium text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]")}
                              >
                                {tab.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </div>
                      </DropdownMenu>
                    </TabsList>
                  </div>
                  {/* Xl and up only: all tabs (hidden below xl) */}
                  <div className="mb-4 hidden xl:block">
                    <TabsList className={TAB_LIST_CLASS}>
                      {TAB_CONFIG.map((tab) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={TAB_TRIGGER_CLASS}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="mt-0">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Overview</h2>
                      <button
                        type="button"
                        onClick={allCardsOpen ? collapseAll : expandAll}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
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
                    <div className="flex gap-6">
                      <div className="min-w-0 flex-1 space-y-6">
                        <CollapsibleCard
                          title="Snapshot"
                          open={cardOpenState["Snapshot"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, Snapshot: open }))}
                          className={cn("rounded-2xl", glassCard)}
                        >
                          <div className={CARD_GRID_CLASS}>
                            <SnapshotDataCell label="Account created" primaryValue="10/11/2022" secondaryDetail="7 months ago" />
                            <SnapshotDataCell label="Last invoice" primaryValue="$47.83" secondaryDetail="On 02/12/2022" />
                            <SnapshotDataCell label="Current invoice" primaryValue="$50.10" secondaryDetail="Since 02/12/2022" />
                            <SnapshotDataCell label="Last payment" primaryValue="$50.10" secondaryDetail="on 07/06/2023" />
                            <SnapshotDataCell label="Account balance" primaryValue="-$200.58" />
                          </div>
                        </CollapsibleCard>

                        <CollapsibleCard
                          title="Account details"
                          open={cardOpenState["Account details"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account details": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        >
                          <div className={CARD_GRID_CLASS}>
                            <DataCell label="Account type" value="Commercial" />
                            <DataCell label="Account status" value="Billing" />
                            <DataCell label="Parent account" value="Residential" />
                            <DataCell label="Site nickname" value="Residential" />
                            <DataCell label="Supply address" value="155 Queen St, Melbourne, VIC 3000" />
                            <DataCell label="NMI - National Meter ID" value="Commercial" />
                            <Checkbox label="Hardship" defaultChecked />
                            <Checkbox label="Ombudsman" defaultChecked />
                            <Checkbox label="CDR eligible" defaultChecked />
                          </div>
                        </CollapsibleCard>

                        <CollapsibleCard
                          title="Business information"
                          open={cardOpenState["Business information"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Business information": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        >
                          <div className={CARD_GRID_CLASS}>
                            <DataCell label="Business name" value="AMPOL FOODARY GUMLY GUMLY" />
                            <DataCell label="ABN/ACN" value="64000175342" />
                          </div>
                        </CollapsibleCard>

                        <CollapsibleCard
                          title="Suppress dunning"
                          open={cardOpenState["Suppress dunning"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Suppress dunning": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        >
                          <p className="text-sm text-muted-foreground">No active dunning present for this account</p>
                        </CollapsibleCard>

                        <CollapsibleCard
                          title="Primary contact"
                          open={cardOpenState["Primary contact"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Primary contact": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        >
                          <div className={CARD_GRID_CLASS}>
                            <DataCell label="Contact type" value="Primary" />
                            <DataCell label="Full name" value="Justine Masked_Name_32BB 8EED194" />
                            <DataCell label="Supply address" value="155 Queen St, Melbourne, VIC 3000" />
                          </div>
                        </CollapsibleCard>

                        <CollapsibleCard
                          title="Key dates"
                          open={cardOpenState["Key dates"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Key dates": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        />
                        <CollapsibleCard
                          title="Additional details"
                          open={cardOpenState["Additional details"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Additional details": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        />
                        <CollapsibleCard
                          title="Account options"
                          open={cardOpenState["Account options"]}
                          onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account options": open }))}
                          className={cn("rounded-2xl", glassCard)}
                        />
                      </div>

                      {/* Interactions — half of content when space allows, collapsible bar when narrow */}
                      {showInteractionsInline ? (
                        <div className="flex min-w-0 flex-1 flex-col">
                          <Card className={cn("flex w-full min-w-0 flex-col rounded-2xl shadow-none", glassCard)}>
                            <CardHeader className="w-full space-y-0 border-b border-border pb-4 dark:border-white/10">
                              <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Interactions</CardTitle>
                              <div className="mt-3 w-full">
                                <div className="relative flex w-full min-w-0 items-center overflow-visible rounded-lg border border-border bg-white dark:border-white/10 dark:bg-white/[0.06]">
                                  <div className="flex shrink-0 items-center py-2 pl-3 pr-4">
                                    <Icon name="search" size={20} className="text-gray-500 dark:text-gray-400" />
                                  </div>
                                  <Input
                                    placeholder="Search"
                                    className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent pl-0 pr-12 text-sm !border-0 shadow-none outline-none focus-visible:ring-0"
                                  />
                                  <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                                    title="Filter"
                                    aria-label="Filter"
                                  >
                                    <Icon name="tune" size={20} />
                                  </button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 pt-4">
                              {INTERACTIONS.map((item) => (
                                <div key={item.id} className="flex flex-col gap-3 rounded-lg bg-gray-100 p-4 dark:bg-white/[0.06]">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                                      <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">{item.category}</p>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 rounded-lg border-border bg-white font-normal text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/10"
                                      >
                                        <Icon name="add" size={16} className="mr-1" /> Add
                                      </Button>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end text-right">
                                      <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.user}</span>
                                      <span className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{item.time}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-end gap-2 border-t border-border pt-2 dark:border-white/10">
                                    <span className="text-sm font-medium text-gray-900 dark:text-slate-100">2 interactions</span>
                                    <span className="rounded bg-[#0074C4] px-2 py-0.5 text-xs font-medium text-white">11223344</span>
                                  </div>
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="flex shrink-0 flex-col">
                          <Card
                            className={cn(
                              "flex flex-col overflow-hidden rounded-2xl shadow-none transition-[width] duration-300",
                              glassCard,
                              interactionsOpen ? "w-[320px]" : "w-11"
                            )}
                          >
                            {interactionsOpen ? (
                              <>
                                <CardHeader className="w-full space-y-0 border-b border-border pb-4 dark:border-white/10">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-base font-bold text-gray-900 dark:text-slate-100">Interactions</CardTitle>
                                    <button
                                      type="button"
                                      onClick={() => setInteractionsOpen(false)}
                                      className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                                      aria-label="Collapse interactions"
                                    >
                                      <Icon name="chevron_right" size={18} />
                                    </button>
                                  </div>
                                  <div className="mt-3 w-full">
                                    <div className="relative flex w-full min-w-0 items-center overflow-visible rounded-lg border border-border bg-white dark:border-white/10 dark:bg-white/[0.06]">
                                      <div className="flex shrink-0 items-center py-2 pl-3 pr-4">
                                        <Icon name="search" size={20} className="text-gray-500 dark:text-gray-400" />
                                      </div>
                                      <Input
                                        placeholder="Search"
                                        className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent pl-0 pr-12 text-sm !border-0 shadow-none outline-none focus-visible:ring-0"
                                      />
                                      <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
                                        title="Filter"
                                        aria-label="Filter"
                                      >
                                        <Icon name="tune" size={20} />
                                      </button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-3 pt-4">
                                  {INTERACTIONS.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-3 rounded-lg bg-gray-100 p-4 dark:bg-white/[0.06]">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                          <p className="font-semibold text-gray-900 dark:text-slate-100">{item.title}</p>
                                          <p className="mt-0.5 text-sm text-gray-600 dark:text-slate-400">{item.category}</p>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-2 rounded-lg border-border bg-white font-normal text-gray-900 hover:bg-gray-50 dark:border-white/10 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/10"
                                          >
                                            <Icon name="add" size={16} className="mr-1" /> Add
                                          </Button>
                                        </div>
                                        <div className="flex shrink-0 flex-col items-end text-right">
                                          <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.user}</span>
                                          <span className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{item.time}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center justify-end gap-2 border-t border-border pt-2 dark:border-white/10">
                                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">2 interactions</span>
                                        <span className="rounded bg-[#0074C4] px-2 py-0.5 text-xs font-medium text-white">11223344</span>
                                      </div>
                                    </div>
                                  ))}
                                </CardContent>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setInteractionsOpen(true)}
                                className="flex h-full w-11 flex-col items-center gap-2 py-4 text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100"
                                aria-label="Expand interactions"
                              >
                                <Icon name="chevron_left" size={18} />
                                <span className="text-xs font-semibold tracking-wide [writing-mode:vertical-lr]">
                                  Interactions ({INTERACTIONS.length})
                                </span>
                              </button>
                            )}
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Contacts Tab */}
                  <TabsContent value="contacts" className="mt-0">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">Contacts</h2>
                    <div className="flex flex-col gap-6 2xl:flex-row">
                      {/* Left: Contact list */}
                      <div className="w-full shrink-0 2xl:w-[280px]">
                        <Card className={cn("rounded-2xl shadow-none", glassCard)}>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-4 pb-3 pt-3 dark:border-white/10">
                            <CardTitle className="text-sm font-semibold text-gray-900 dark:text-slate-100">Contact Name</CardTitle>
                            <button type="button" className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10">
                              <Icon name="add" size={20} />
                            </button>
                          </CardHeader>
                          <CardContent className="p-0">
                            {CONTACTS_DATA.map((contact) => (
                              <button
                                key={contact.id}
                                type="button"
                                onClick={() => setSelectedContactId(contact.id)}
                                className={cn(
                                  "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 dark:border-white/10",
                                  selectedContactId === contact.id
                                    ? "bg-[#FFF3E6] dark:bg-[#802F00]/20"
                                    : "hover:bg-gray-50 dark:hover:bg-white/[0.06]"
                                )}
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-white/10 dark:text-slate-400">
                                  <Icon name="person" size={24} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{contact.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-slate-400">{contact.dob}</p>
                                  <Badge variant={contact.badgeVariant} className="mt-1 text-[10px] px-2 py-0.5">
                                    {contact.badge}
                                  </Badge>
                                </div>
                              </button>
                            ))}
                          </CardContent>
                        </Card>
                      </div>

                      {/* Right: Contact details */}
                      <div className="min-w-0 flex-1">
                        <Card className={cn("rounded-2xl shadow-none", glassCard)}>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-4 dark:border-white/10">
                            <CardTitle className="text-lg font-bold text-gray-900 dark:text-slate-100">
                              {selectedContact.details.fullName}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <button type="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10" aria-label="Edit contact">
                                <Icon name="edit" size={20} />
                              </button>
                              <button type="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10" aria-label="Delete contact">
                                <Icon name="delete" size={20} />
                              </button>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 2xl:grid-cols-3">
                              <DataCell label="Contact Type" value={selectedContact.details.contactType} />
                              <DataCell label="Full name" value={selectedContact.details.fullName} />
                              <DataCell label="Date of birth" value={selectedContact.details.dateOfBirth} />
                              <DataCell label="Landline Service Comment" value={selectedContact.details.landlineServiceComment} />
                              <DataCell label="Mobile Service Comment" value={selectedContact.details.mobileServiceComment} />
                              <DataCell label="Preferred Contact Method" value={selectedContact.details.preferredContactMethod} />
                              <DataCell label="Landline Phone" value={selectedContact.details.landlinePhone} />
                              <DataCell label="Mobile Phone" value={selectedContact.details.mobilePhone} />
                              <DataCell label="Verification Passphrase" value={selectedContact.details.verificationPassphrase} />
                              <DataCell label="Email" value={selectedContact.details.email} />
                              <DataCell label="Address" value={selectedContact.details.address} className="sm:col-span-2 2xl:col-span-3" />
                              <DataCell label="Customer Number" value={selectedContact.details.customerNumber} />
                              <DataCell label="CDN Contact" value={selectedContact.details.cdnContact} />
                              <DataCell label="External Ref" value={selectedContact.details.externalRef} />
                            </div>

                            <div className="mt-8 border-t border-border pt-6 dark:border-white/10">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">Identification Documents</h3>
                              <p className="mt-3 text-sm text-muted-foreground">No Identification documents to display</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Remaining tab placeholders */}
                  {TAB_CONFIG.filter((t) => t.value !== "overview" && t.value !== "contacts").map((tab) => (
                    <TabsContent key={tab.value} value={tab.value} className="mt-0">
                      <div className={cn("rounded-2xl p-8 text-center text-muted-foreground", glassCard)}>
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
                        ? "bg-[#802F00]/40 text-[#FFCF99]"
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
                              ? "bg-[#802F00]/25 text-[#FFCF99]"
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

                  {activePanelTab === "Tasks" && (
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
                                ? "border-[#FFCF99]/30 bg-[#802F00]/25 text-[#FFCF99]"
                                : "border-white/[0.08] bg-white/[0.04] text-slate-400 hover:border-[#FFCF99]/20 hover:bg-[#802F00]/15 hover:text-[#FFCF99]"
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
                          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#FFCF99]/25 bg-[#802F00]/10 px-3 py-2.5 text-[13px] font-semibold text-[#FFCF99] transition-all hover:-translate-y-0.5 hover:border-[#FFCF99]/50 hover:bg-[#802F00]/20"
                        >
                          <Icon name="add" size={16} />
                          Create new task
                          <span className="rounded bg-[#FFCF99] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#161B2E]">
                            New
                          </span>
                        </button>
                      </div>

                      {/* Account context + search */}
                      <div className="space-y-3 px-3.5 pt-3.5">
                        <div>
                          <p className="text-xs font-medium text-[#FFCF99]">
                            What Account Is The Task For?
                          </p>
                          <p className="mt-1.5 border-b border-white/10 pb-2 text-sm text-slate-100">
                            QB00171824 The Occupier
                          </p>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Search for a specific task"
                            className="w-full border-b-2 border-[#FFCF99] bg-transparent pb-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Task categories */}
                      <div className="flex-1 px-2 py-1.5">
                        {TASK_CATEGORIES.map((tc) => (
                          <button
                            key={tc.name}
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-[#802F00]/15"
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

                  {activePanelTab === "Actions" && (
                    <div className="flex-1 px-3.5 py-3.5">
                      <p className="text-sm text-slate-400">Actions content would go here.</p>
                    </div>
                  )}

                  {activePanelTab === "Exceptions" && (
                    <div className="flex-1 px-3.5 py-3.5">
                      <p className="text-sm text-slate-400">Exceptions content would go here.</p>
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
