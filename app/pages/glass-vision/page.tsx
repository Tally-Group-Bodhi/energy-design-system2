"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ComposedChart,
  BarChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Card, CardContent } from "@/components/Card/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { secondaryColors } from "@/lib/tokens/colors";

/* ────────── Chart data & helpers ────────── */

const BILL_VS_PREVIOUS_DATA = [
  { month: "Jul", current: 142, previous: 130 },
  { month: "Aug", current: 135, previous: 148 },
  { month: "Sep", current: 148, previous: 145 },
  { month: "Oct", current: 132, previous: 138 },
  { month: "Nov", current: 105, previous: 130 },
  { month: "Dec", current: 78, previous: 126 },
  { month: "Jan", current: 55, previous: 118 },
  { month: "Feb", current: 28, previous: 105 },
];

const LOAD_DISAGG_DATA = [
  { category: "HVAC", kWh: 148, fill: "#6366F1" },
  { category: "Hot Water", kWh: 98, fill: "#F59E0B" },
  { category: "Lighting", kWh: 64, fill: "#06B6D4" },
  { category: "Appliances", kWh: 52, fill: "#00D2A2" },
  { category: "Cooking", kWh: 28, fill: "#EC4899" },
  { category: "Other", kWh: 22, fill: "#9CA3AF" },
];

const USAGE_DATA = [
  { month: "Jul", usage: 412 },
  { month: "Aug", usage: 385 },
  { month: "Sep", usage: 448 },
  { month: "Oct", usage: 392 },
  { month: "Nov", usage: 305 },
  { month: "Dec", usage: 228 },
  { month: "Jan", usage: 165 },
  { month: "Feb", usage: 98 },
];

const INSIGHT_USAGE_DATA = [
  { month: "Mar", kwh: 420, cost: 142 },
  { month: "Apr", kwh: 380, cost: 128 },
  { month: "May", kwh: 450, cost: 156 },
  { month: "Jun", kwh: 395, cost: 134 },
  { month: "Jul", kwh: 360, cost: 118 },
  { month: "Aug", kwh: 310, cost: 95 },
  { month: "Sep", kwh: 280, cost: 78 },
  { month: "Oct", kwh: 245, cost: 68 },
  { month: "Nov", kwh: 220, cost: 58 },
  { month: "Dec", kwh: 198, cost: 52 },
  { month: "Jan", kwh: 175, cost: 45 },
  { month: "Feb", kwh: 155, cost: 25 },
];

const COST_BREAKDOWN = [
  { name: "Supply", value: 38, color: "#2C365D" },
  { name: "Usage", value: 28, color: "#00C1FF" },
  { name: "Solar Credit", value: 18, color: "#4EEECA" },
  { name: "Demand", value: 10, color: "#FFD41E" },
  { name: "Fees", value: 6, color: "#B368E7" },
];

const DAILY_USAGE = [
  { day: 1, peak: 8.2, offpeak: 3.1, shoulder: 4.5 },
  { day: 2, peak: 6.5, offpeak: 2.8, shoulder: 5.2 },
  { day: 3, peak: 9.1, offpeak: 4.3, shoulder: 3.8 },
  { day: 4, peak: 7.3, offpeak: 1.9, shoulder: 6.1 },
  { day: 5, peak: 5.8, offpeak: 3.5, shoulder: 4.9 },
  { day: 6, peak: 10.2, offpeak: 2.2, shoulder: 3.2 },
  { day: 7, peak: 8.8, offpeak: 4.1, shoulder: 5.7 },
  { day: 8, peak: 6.1, offpeak: 3.7, shoulder: 4.3 },
  { day: 9, peak: 7.9, offpeak: 1.5, shoulder: 6.8 },
  { day: 10, peak: 9.5, offpeak: 2.9, shoulder: 3.5 },
  { day: 11, peak: 5.4, offpeak: 4.8, shoulder: 5.1 },
  { day: 12, peak: 8.6, offpeak: 3.3, shoulder: 4.7 },
  { day: 13, peak: 7.1, offpeak: 2.1, shoulder: 6.4 },
  { day: 14, peak: 10.8, offpeak: 3.9, shoulder: 3.1 },
  { day: 15, peak: 6.7, offpeak: 4.5, shoulder: 5.5 },
  { day: 16, peak: 9.3, offpeak: 1.7, shoulder: 4.2 },
  { day: 17, peak: 5.9, offpeak: 3.2, shoulder: 6.9 },
  { day: 18, peak: 8.4, offpeak: 2.6, shoulder: 3.7 },
  { day: 19, peak: 7.6, offpeak: 4.4, shoulder: 5.3 },
  { day: 20, peak: 10.1, offpeak: 3.8, shoulder: 4.1 },
  { day: 21, peak: 6.3, offpeak: 2.3, shoulder: 6.2 },
  { day: 22, peak: 9.7, offpeak: 1.8, shoulder: 3.9 },
  { day: 23, peak: 5.5, offpeak: 4.6, shoulder: 5.8 },
  { day: 24, peak: 8.1, offpeak: 3.4, shoulder: 4.6 },
  { day: 25, peak: 7.4, offpeak: 2.5, shoulder: 6.5 },
  { day: 26, peak: 10.5, offpeak: 4.2, shoulder: 3.4 },
  { day: 27, peak: 6.8, offpeak: 3.6, shoulder: 5.6 },
  { day: 28, peak: 9.2, offpeak: 1.4, shoulder: 4.8 },
];

const RADAR_DATA = [
  { metric: "Payment", value: 95 },
  { metric: "Usage Trend", value: 78 },
  { metric: "Engagement", value: 62 },
  { metric: "Loyalty", value: 88 },
  { metric: "Risk Score", value: 35 },
  { metric: "Satisfaction", value: 72 },
];

const PAYMENT_HISTORY = [
  { month: "Mar", paid: 142, onTime: true },
  { month: "Apr", paid: 128, onTime: true },
  { month: "May", paid: 156, onTime: true },
  { month: "Jun", paid: 134, onTime: false },
  { month: "Jul", paid: 118, onTime: true },
  { month: "Aug", paid: 95, onTime: true },
  { month: "Sep", paid: 78, onTime: true },
  { month: "Oct", paid: 68, onTime: true },
  { month: "Nov", paid: 58, onTime: true },
  { month: "Dec", paid: 52, onTime: true },
  { month: "Jan", paid: 45, onTime: true },
  { month: "Feb", paid: 25, onTime: true },
];

const INTERACTION_DATA = [
  { month: "Sep", calls: 3, emails: 5, web: 8 },
  { month: "Oct", calls: 2, emails: 3, web: 6 },
  { month: "Nov", calls: 1, emails: 4, web: 9 },
  { month: "Dec", calls: 4, emails: 2, web: 5 },
  { month: "Jan", calls: 2, emails: 6, web: 7 },
  { month: "Feb", calls: 1, emails: 3, web: 11 },
];

const COMBINED_FORECAST = [
  ...INSIGHT_USAGE_DATA.slice(-4).map((d) => ({ month: d.month, actual: d.cost, forecast: null as number | null, low: null as number | null, high: null as number | null })),
  { month: "Mar", actual: null as number | null, forecast: 22, low: 15, high: 30 },
  { month: "Apr", actual: null, forecast: 35, low: 25, high: 48 },
  { month: "May", actual: null, forecast: 52, low: 40, high: 65 },
  { month: "Jun", actual: null, forecast: 78, low: 60, high: 95 },
];

const PANEL_TABS = ["Adora", "Control Panel", "X-Sell"] as const;

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

const CHART_TEAL = "#00D2A2";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200/80 bg-white px-3 py-2 shadow-lg dark:border-white/10 dark:bg-slate-800">
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-slate-400">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-600 dark:text-slate-300">{entry.name}</span>
          <span className="ml-auto font-semibold text-gray-900 dark:text-slate-100">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Darkest navy — header & nav */
const DARKEST_NAVY = "#161B2E";
/** Dark navy for search input */
const DARK_NAVY = "#212946";

/* ========== Light mode (default) ========== */
const PANE_LIGHT = "bg-gray-100";
const GLASS_PANEL_LIGHT =
  "bg-white/80 backdrop-blur-xl border border-gray-200/90 shadow-xl shadow-gray-200/50";
const GLASS_CARD_LIGHT =
  "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40";

/* ========== Dark mode ========== */
const PANE_DARK = "dark:bg-gray-900";
const GLASS_PANEL_DARK =
  "dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border-white/[0.08] dark:shadow-[0_8px_32px_rgba(0,0,0,0.24)]";
const GLASS_CARD_DARK =
  "dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border-white/[0.12] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]";
const GLOW_ACCENT_DARK = "dark:shadow-[0_0_24px_rgba(0,210,162,0.15)]";

/* ========== NAV (Glass Vision: collapsed, style-guide hover, turquoise active) ========== */
const GLASS_NAV_ITEMS = [
  { id: "customers", label: "Customers", icon: "group" },
  { id: "dashboard", label: "Dashboard", icon: "grid_view" },
  { id: "tasks", label: "Tasks", icon: "check_box" },
  { id: "reports", label: "Reports", icon: "description" },
  { id: "analytics", label: "Analytics", icon: "bar_chart" },
  { id: "settings", label: "Settings", icon: "settings" },
] as const;

/* ========== DATA ========== */
type AccountRecord = {
  address: string;
  nmi: string;
  type: "Residential" | "Commercial" | "Small Business";
  fuel: string;
  status: string;
  balance: string;
  isCredit: boolean;
  plan?: string;
  planRef?: string;
  bestOffer?: string;
  billing?: string;
  billingTo?: string;
  commenced?: string;
  invoiceAmount?: string;
  allocated?: string;
  posted?: string;
  due?: string;
  charges?: string;
  washup?: string;
  demandCharge?: string;
  billVsPrevious?: string;
  billVsPreviousUp?: boolean;
  isClosed?: boolean;
  closedOn?: string;
  finalRead?: string;
  finalInvoice?: string;
};

const ACCOUNTS: AccountRecord[] = [
  {
    address: "1/123 Smith St, Fitzroy, VIC 3066",
    nmi: "1011 1521 6161 08",
    type: "Residential",
    fuel: "Electricity",
    status: "OPEN",
    balance: "−$144.74",
    isCredit: true,
    plan: "Home Plan",
    planRef: "20101203 013",
    bestOffer: "Currently on best",
    billing: "Quarter billing",
    billingTo: "To 05 Feb 2025",
    commenced: "04 May 2024",
    invoiceAmount: "$25.71",
    allocated: "Fully allocated",
    posted: "06 Feb 2025",
    due: "27 Feb 2025",
    charges: "−$170.45 CR",
    washup: "No days washed up",
    billVsPrevious: "72.58%",
    billVsPreviousUp: true,
  },
  {
    address: "42 Collins St, Melbourne, VIC 3000",
    nmi: "3022 4876 3190 45",
    type: "Commercial",
    fuel: "Electricity + Gas",
    status: "OPEN",
    balance: "$2,341.08",
    isCredit: false,
    plan: "Business Large",
    planRef: "30224876 001",
    bestOffer: "Review recommended",
    billing: "Monthly billing",
    billingTo: "To 28 Jan 2025",
    commenced: "15 Mar 2019",
    invoiceAmount: "$2,341.08",
    allocated: "Partially allocated",
    posted: "01 Feb 2025",
    due: "15 Feb 2025",
    charges: "$2,341.08",
    demandCharge: "$486.20",
    washup: "—",
    billVsPrevious: "12.3%",
    billVsPreviousUp: true,
  },
  {
    address: "7/88 Chapel St, Windsor, VIC 3181",
    nmi: "2019 8734 5620 17",
    type: "Small Business",
    fuel: "Electricity",
    status: "OPEN",
    balance: "−$67.30",
    isCredit: true,
    plan: "Small Biz Saver",
    planRef: "20198734 002",
    bestOffer: "Currently on best",
    billing: "Monthly billing",
    billingTo: "To 31 Jan 2025",
    commenced: "22 Aug 2021",
    invoiceAmount: "$282.15",
    allocated: "Fully allocated",
    posted: "03 Feb 2025",
    due: "18 Feb 2025",
    charges: "−$67.30 CR",
    washup: "2 days",
    billVsPrevious: "8.4%",
    billVsPreviousUp: false,
  },
  {
    address: "155 Queen St, Melbourne, VIC 3000",
    nmi: "4033 7652 1980 74",
    type: "Commercial",
    fuel: "Gas",
    status: "OPEN",
    balance: "$856.42",
    isCredit: false,
    plan: "Business Gas Plus",
    planRef: "40337652 001",
    bestOffer: "Better offer available",
    billing: "Monthly billing",
    billingTo: "To 31 Jan 2025",
    commenced: "10 Jan 2020",
    invoiceAmount: "$856.42",
    allocated: "Fully allocated",
    posted: "04 Feb 2025",
    due: "20 Feb 2025",
    charges: "$856.42",
    washup: "No days washed up",
    billVsPrevious: "5.1%",
    billVsPreviousUp: true,
  },
  {
    address: "28 Acacia Ave, Kew, VIC 3101",
    nmi: "1044 5623 1870 92",
    type: "Residential",
    fuel: "Electricity + Gas",
    status: "CLOSED",
    balance: "$0.00",
    isCredit: false,
    isClosed: true,
    plan: "Home Basic",
    planRef: "10445623 001",
    bestOffer: "N/A",
    billing: "Account closed",
    billingTo: "Final 12 Nov 2024",
    commenced: "08 Jun 2015",
    finalInvoice: "$0.00",
    allocated: "Fully allocated",
    posted: "15 Nov 2024",
    closedOn: "12 Nov 2024",
    finalRead: "Actual",
    washup: "Settled",
    billVsPrevious: "—",
  },
];

const CUSTOMER_SUMMARY =
  "Ronald is a long-standing customer since April 2008 with an excellent payment history (95th percentile). He holds 5 service accounts across residential, commercial, and small business premises. Energy usage has been declining steadily at his primary residence — down 63% over 12 months, likely due to solar. Commercial accounts at Collins St and Queen St show rising usage (+12.3% and +5.1%). Currently in net credit of $144.74 on the primary account. Multiple vulnerability flags are active. Recommended actions: Review commercial tariff rates, proactive hardship check-in, and solar feed-in review for residential.";

export default function GlassVisionPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeNavId, setActiveNavId] = useState("customers");
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(true);
  const [activePanelTab, setActivePanelTab] = useState<(typeof PANEL_TABS)[number]>("Control Panel");

  const handleAccountClick = useCallback((address: string) => {
    const isDeselecting = selectedAccountAddress === address;
    setSelectedAccountAddress(isDeselecting ? null : address);
    if (!isDeselecting) {
      requestAnimationFrame(() => {
        const el = document.getElementById(`account-${address.replace(/\W/g, "-")}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [selectedAccountAddress]);

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

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: DARKEST_NAVY, "--tally-radius-lg": "24px" } as React.CSSProperties}
    >
      {/* Seamless chrome: header + nav as one dark block (no border between them) */}
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/GlassLogoTest_darkmode.svg"
            alt="Tally Glass"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              placeholder="Search Tally..."
              className="h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2A2]/50"
            style={{ backgroundColor: DARK_NAVY }}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            className="relative rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={22} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E8560A]" aria-hidden />
          </button>
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border-2 border-[#00D2A2]/30">
              <AvatarFallback
                className="text-xs font-medium text-white"
                style={{ backgroundColor: secondaryColors.turquoise.hex }}
              >
                JS
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium text-white">John Smith</span>
              <span className="text-xs text-gray-400">Agent</span>
            </div>
          </div>
        </div>
      </header>

        <div className="flex flex-1 min-h-0">
          {/* Collapsed nav — same dark block as header, no seam */}
          <aside className="flex w-16 shrink-0 flex-col items-center min-h-0 py-4 transition-[width] duration-300">
          <nav className="flex flex-1 flex-col items-center gap-0.5 p-2 min-h-0 overflow-y-auto">
            {GLASS_NAV_ITEMS.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <div key={item.id} className="relative flex w-full justify-center">
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                      style={{ backgroundColor: secondaryColors.turquoise.hex }}
                      aria-hidden
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveNavId(item.id)}
                    className={cn(
                      "group flex h-10 w-10 shrink-0 items-center justify-center rounded-lg py-2 text-sm font-normal transition-colors focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2A2]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161B2E]",
                      isActive
                        ? "bg-white/10 text-[#00D2A2]"
                        : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                    )}
                    aria-label={item.label}
                    aria-pressed={isActive}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                      className={cn(
                        "shrink-0",
                        isActive
                          ? "text-[#00D2A2]"
                          : "text-gray-400 group-hover:text-gray-100"
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </nav>
          <div className="shrink-0 border-t border-white/10 p-2 flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="group flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2A2]/50"
              aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
            >
              <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
            </button>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
              role="presentation"
            >
              <span className="text-xs font-medium">JS</span>
            </div>
          </div>
          </aside>

          {/* Main content — light (default) / dark pane with glass panels */}
          <main
            className={cn(
              "flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem]",
              PANE_LIGHT,
              PANE_DARK
            )}
          >
            {/* Details panel — same background as main content */}
            <aside className={cn("flex w-72 shrink-0 flex-col overflow-y-auto px-3 py-4", PANE_LIGHT, PANE_DARK)}>
              <div className="space-y-2">
                {/* Profile header card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 rounded-full bg-amber-400/90 ring-2 ring-amber-400/40">
                          <AvatarFallback className="bg-transparent text-lg font-medium text-amber-950">RT</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                          <Icon name="check" size={10} className="text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">Ronald Thomas</h2>
                        <p className="text-sm text-gray-600 dark:text-slate-400">100 039 340</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">South Australia</p>
                      </div>
                    </div>
                    <div className="mt-3 flex w-full flex-wrap gap-2">
                      <span className="rounded-lg bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-500/20 dark:text-red-300">Vulnerable</span>
                      <span className="rounded-lg border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">Active Complaint</span>
                      <span className="rounded-lg bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">Ombudsman</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal details card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Personal details</p>
                    <div className="space-y-2.5 text-sm text-gray-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Icon name="calendar_today" size={18} className="text-gray-500 dark:text-slate-500" />
                        <span>01 Jun 1960</span>
                        <Badge variant="secondary" className="ml-auto border-gray-200 bg-gray-100 text-xs text-gray-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-300">65</Badge>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="mail" size={18} className="mt-0.5 shrink-0 text-gray-500 dark:text-slate-500" />
                        <span className="break-all">ronald_thomas12345@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="phone" size={18} className="text-gray-500 dark:text-slate-500" />
                        <span>0464 464 646</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact history card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Contact history</p>
                    <div className="space-y-2.5 text-sm text-gray-700 dark:text-slate-300">
                      {[
                        { icon: "chat_bubble_outline" as const, label: "Created", date: "05 Apr 2008" },
                        { icon: "call" as const, label: "Last call", date: "02 Feb 2025" },
                        { icon: "description" as const, label: "Last note", date: "04 Feb 2025" },
                        { icon: "computer" as const, label: "Last web", date: "04 Feb 2025" },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon name={row.icon} size={18} className="text-gray-500 dark:text-slate-500" />
                            <span>{row.label}</span>
                          </div>
                          <span className="text-gray-500 dark:text-slate-500">{row.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payer rating card */}
                <Card className={cn("overflow-hidden border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10")}>
                  <CardContent className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon name="star" size={20} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Payer Rating</span>
                    </div>
                    <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Excellent</span>
                  </CardContent>
                </Card>

                {/* Payment methods card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Payment methods</p>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded bg-indigo-600 text-[10px] font-bold text-white">VISA</div>
                        <div className="min-w-0 flex-1">
                          <div>.... 1234</div>
                          <div className="text-xs text-gray-500 dark:text-slate-500">Exp 06/2025</div>
                        </div>
                        <Badge variant="secondary" className="border-emerald-200 bg-emerald-50 text-xs text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300">Default</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded bg-red-600 text-[10px] font-bold text-white">MC</div>
                        <div className="min-w-0 flex-1">
                          <div>.... 1234</div>
                          <div className="text-xs text-gray-500 dark:text-slate-500">Exp 06/2025</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-10 shrink-0 items-center justify-center rounded bg-violet-600 text-[10px] font-bold text-white">DD</div>
                        <div className="min-w-0 flex-1">
                          <div>Direct Debit</div>
                          <div className="text-xs text-gray-500 dark:text-slate-500">Exp 06/2025</div>
                        </div>
                      </div>
                      <button type="button" className="flex w-full items-center gap-2 pt-1 text-sm font-medium text-gray-600 transition-colors hover:text-[#00D2A2] dark:text-slate-400 dark:hover:text-[#00D2A2]">
                        <Icon name="add" size={18} />
                        Add method
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>

            {/* Scrollable content — glass background */}
            <div className="relative min-w-0 flex-1 overflow-y-auto bg-transparent">
              {/* Control panel toggle (collapsed state) */}
              {!controlPanelOpen && (
                <button
                  type="button"
                  onClick={() => setControlPanelOpen(true)}
                  className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 shadow-lg backdrop-blur-xl border border-gray-200/80 text-gray-600 transition-all hover:bg-white hover:text-[#2C365D] hover:shadow-xl dark:bg-white/[0.08] dark:border-white/[0.12] dark:text-slate-400 dark:hover:bg-white/[0.12] dark:hover:text-[#00D2A2]"
                  aria-label="Open control panel"
                >
                  <Icon name="left_panel_open" size={20} />
                </button>
              )}
        <div className="min-h-full w-full px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="mb-6 flex justify-center">
              <TabsList className="h-10 flex-nowrap gap-1 rounded-xl bg-gray-100/90 p-1 backdrop-blur-md border border-gray-200/80 dark:bg-white/[0.06] dark:border-white/[0.08]">
                <TabsTrigger value="overview" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2] dark:data-[state=active]:shadow-[0_0_20px_rgba(0,210,162,0.2)]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="insights" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2] dark:data-[state=active]:shadow-[0_0_20px_rgba(0,210,162,0.2)]">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="bill-compare" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2] dark:data-[state=active]:shadow-[0_0_20px_rgba(0,210,162,0.2)]">
                  Bill Compare
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2] dark:data-[state=active]:shadow-[0_0_20px_rgba(0,210,162,0.2)]">
                  History
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-0">
          {/* Adora Customer Summary — light: warm tint; dark: turquoise glow */}
          <Card className={cn("mb-8 overflow-hidden border border-[#00D2A2]/20 dark:border-[#00D2A2]/15", GLASS_CARD_LIGHT, GLASS_CARD_DARK, "shadow-[0_0_30px_rgba(0,210,162,0.08)] dark:shadow-[0_0_40px_rgba(0,210,162,0.12)]")}>
            <CardContent className="p-6 pt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Image src="/Adora.svg" alt="Adora" width={80} height={36} className="h-6 w-auto" />
                  <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">
                    Customer Summary
                  </span>
                </div>
                <Badge className="border-[#00D2A2]/40 bg-[#00D2A2]/10 text-xs font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">
                  Auto-generated
                </Badge>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                Ronald is a <strong className="text-gray-900 dark:text-slate-100">long-standing customer</strong> since April 2008 with an <strong className="text-gray-900 dark:text-slate-100">excellent payment history</strong> (95th percentile). He holds <strong className="text-gray-900 dark:text-slate-100">5 service accounts</strong> across residential, commercial, and small business premises. Energy usage has been <strong className="text-gray-900 dark:text-slate-100">declining steadily</strong> at his primary residence — down 63% over 12 months, likely due to solar. Commercial accounts at Collins St and Queen St show rising usage (+12.3% and +5.1%). Currently in net credit of $144.74 on the primary account. Multiple vulnerability flags are active. <strong className="text-gray-900 dark:text-slate-100">Recommended actions:</strong> Review commercial tariff rates, proactive hardship check-in, and solar feed-in review for residential.
              </p>
            </CardContent>
          </Card>

          {/* Service Addresses */}
          <section>
            <div className="mb-4 flex items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                Service Addresses
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-500">5 accounts</p>
            </div>

            <div className="space-y-3">
              {ACCOUNTS.map((acc) => {
                const typeIcon = acc.type === "Residential" ? "home" : acc.type === "Commercial" ? "business" : "store";
                const typeIconBg =
                  acc.type === "Residential"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300"
                    : acc.type === "Commercial"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300";
                const balancePillGreen = acc.isCredit || acc.balance === "$0.00";
                const isSelected = selectedAccountAddress === acc.address;
                return (
                  <React.Fragment key={acc.address}>
                    <Card
                      id={`account-${acc.address.replace(/\W/g, "-")}`}
                      className={cn(
                        "scroll-mt-4 cursor-pointer overflow-hidden border-0 transition-all duration-200",
                        GLASS_CARD_LIGHT,
                        GLASS_CARD_DARK,
                        "hover:shadow-lg hover:shadow-[#00D2A2]/10 dark:hover:shadow-[0_0_28px_rgba(0,210,162,0.12)]",
                        isSelected && "ring-1 ring-[#00D2A2]/25 shadow-[0_0_20px_rgba(0,210,162,0.12)] dark:ring-[#00D2A2]/20 dark:shadow-[0_0_24px_rgba(0,210,162,0.15)]"
                      )}
                      onClick={() => handleAccountClick(acc.address)}
                    >
                      <CardContent className="px-5 py-4 pt-4">
                        <div className="flex items-center justify-between gap-3.5">
                          <div className="flex min-w-0 flex-1 items-center gap-3.5">
                            <div
                              className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]",
                                typeIconBg
                              )}
                            >
                              <Icon name={typeIcon} size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                {acc.address}
                              </p>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                                <span className="text-gray-500 dark:text-slate-500">
                                  NMI: {acc.nmi}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-lg px-2 py-0.5 font-medium",
                                    typeIconBg
                                  )}
                                >
                                  {acc.type}
                                </span>
                                <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-slate-600/40 dark:text-slate-400">
                                  {acc.fuel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span
                              className={cn(
                                "rounded-lg px-2 py-0.5 text-xs font-medium",
                                acc.status === "CLOSED"
                                  ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500"
                                  : "bg-gray-100 text-gray-600 dark:bg-slate-600/40 dark:text-slate-400"
                              )}
                            >
                              {acc.status}
                            </span>
                            <span
                              className={cn(
                                "rounded-lg px-2 py-1 text-sm font-medium",
                                balancePillGreen
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300"
                              )}
                            >
                              {acc.balance}
                            </span>
                            <Icon
                              name={isSelected ? "expand_less" : "chevron_right"}
                              size={20}
                              className="text-gray-500 dark:text-slate-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                      {isSelected && (
                        <div
                          className="space-y-6 border-t border-gray-200/80 px-5 pb-5 pt-5 dark:border-white/10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Plan</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.plan ?? "—"}</p>
                        {acc.planRef && <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">{acc.planRef}</p>}
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Best offer</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.bestOffer ?? "—"}</p>
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Billing</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.billing ?? "—"}</p>
                        {acc.billingTo && <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">{acc.billingTo}</p>}
                      </CardContent>
                    </Card>
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Commenced</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.commenced ?? "—"}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">Bill Information</h3>
                        <Tabs defaultValue="overview" className="mt-4">
                          <TabsList className="mb-4 h-10 gap-1 rounded-lg bg-gray-100/90 p-1 backdrop-blur-md border border-gray-200/80 dark:bg-white/[0.06] dark:border-white/[0.08]">
                            <TabsTrigger value="overview" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                              Overview
                            </TabsTrigger>
                            <TabsTrigger value="load" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                              Load Disagg
                            </TabsTrigger>
                            <TabsTrigger value="usage" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                              Usage
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent value="overview" className="mt-0">
                            <div className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
                              {acc.isClosed ? (
                                <>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Final invoice</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.finalInvoice ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Allocated</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.allocated ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Posted</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.posted ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Closed on</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.closedOn ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Final read</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.finalRead ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Washup</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.washup ?? "—"}</span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Invoice amount</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.invoiceAmount ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Allocated</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.allocated ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Posted</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.posted ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Due</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.due ?? "—"}</span>
                                  </div>
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Charges</span>
                                    <span
                                      className={cn(
                                        "font-medium",
                                        (acc.charges?.includes("−") || acc.charges?.includes("-")) && acc.charges?.includes("CR")
                                          ? "text-emerald-600 dark:text-emerald-400"
                                          : "text-gray-900 dark:text-slate-100"
                                      )}
                                    >
                                      {acc.charges ?? "—"}
                                    </span>
                                  </div>
                                  {acc.demandCharge && (
                                    <div className="flex justify-between gap-4">
                                      <span className="text-gray-500 dark:text-slate-500">Demand charge</span>
                                      <span className="font-medium text-gray-900 dark:text-slate-100">{acc.demandCharge}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between gap-4">
                                    <span className="text-gray-500 dark:text-slate-500">Washup</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100">{acc.washup ?? "—"}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="load" className="mt-0">
                            <p className="mb-3 text-xs text-gray-500 dark:text-slate-400">
                              Estimated breakdown by equipment category (kWh)
                            </p>
                            <div className="space-y-2.5">
                              {LOAD_DISAGG_DATA.map((item) => {
                                const maxKWh = LOAD_DISAGG_DATA[0].kWh;
                                const pct = Math.round((item.kWh / maxKWh) * 100);
                                return (
                                  <div key={item.category} className="group">
                                    <div className="mb-1 flex items-center justify-between text-xs">
                                      <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-slate-300">
                                        <span
                                          className="inline-block h-2 w-2 rounded-full"
                                          style={{ backgroundColor: item.fill }}
                                        />
                                        {item.category}
                                      </span>
                                      <span className="tabular-nums text-gray-500 dark:text-slate-400">
                                        {item.kWh} kWh
                                      </span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                                      <div
                                        className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                                        style={{
                                          width: `${pct}%`,
                                          backgroundColor: item.fill,
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-white/[0.06]">
                              <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Total estimated</span>
                              <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                                {LOAD_DISAGG_DATA.reduce((s, d) => s + d.kWh, 0)} kWh
                              </span>
                            </div>
                          </TabsContent>
                          <TabsContent value="usage" className="mt-0">
                            <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                              <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CHART_TEAL }} />
                              Monthly kWh
                            </div>
                            <div className="h-48 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  data={USAGE_DATA}
                                  margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
                                  barCategoryGap="25%"
                                >
                                  <defs>
                                    <linearGradient id="gradUsage" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.85} />
                                      <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.4} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
                                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
                                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
                                  <Tooltip
                                    content={<ChartTooltip />}
                                    cursor={{ fill: "rgba(0,210,162,0.06)", radius: 6 }}
                                  />
                                  <Bar
                                    dataKey="usage"
                                    name="Usage (kWh)"
                                    fill="url(#gradUsage)"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={800}
                                    animationEasing="ease-out"
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">Bill vs Previous</h3>
                          <button
                            type="button"
                            className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-[#00D2A2]/10 hover:text-[#008f6f] dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-[#00D2A2]/20 dark:hover:text-[#00D2A2]"
                          >
                            Latest bill
                          </button>
                        </div>
                        {acc.billVsPrevious && acc.billVsPrevious !== "—" ? (
                          <div
                            className={cn(
                              "mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium",
                              acc.billVsPreviousUp
                                ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                            )}
                          >
                            <Icon
                              name={acc.billVsPreviousUp ? "trending_up" : "trending_down"}
                              size={18}
                            />
                            {acc.billVsPrevious}
                          </div>
                        ) : null}
                        {/* Legend */}
                        <div className="mt-4 flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CHART_TEAL }} />
                            Current
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400">
                            <span className="inline-block h-2 w-2 rounded-full bg-gray-300 dark:bg-slate-500" />
                            Previous
                          </span>
                        </div>

                        <div className="mt-2 h-52 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                              data={BILL_VS_PREVIOUS_DATA}
                              margin={{ top: 12, right: 12, bottom: 4, left: -8 }}
                            >
                              <defs>
                                <linearGradient
                                  id={`bill-area-${acc.nmi.replace(/\s/g, "")}`}
                                  x1="0"
                                  y1="0"
                                  x2="0"
                                  y2="1"
                                >
                                  <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.25} />
                                  <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.02} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#E5E7EB"
                                strokeOpacity={0.5}
                                vertical={false}
                              />
                              <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                dy={6}
                              />
                              <YAxis
                                domain={[0, 160]}
                                ticks={[0, 80, 160]}
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                width={32}
                              />
                              <Tooltip
                                content={<ChartTooltip />}
                                cursor={{ stroke: "#00D2A2", strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.4 }}
                              />
                              <Area
                                type="natural"
                                dataKey="current"
                                name="Current"
                                stroke={CHART_TEAL}
                                strokeWidth={2.5}
                                fill={`url(#bill-area-${acc.nmi.replace(/\s/g, "")})`}
                                dot={false}
                                activeDot={{ r: 5, fill: CHART_TEAL, stroke: "#fff", strokeWidth: 2 }}
                                animationDuration={800}
                                animationEasing="ease-out"
                              />
                              <Line
                                type="natural"
                                dataKey="previous"
                                name="Previous"
                                stroke="#D1D5DB"
                                strokeWidth={1.5}
                                strokeDasharray="6 3"
                                dot={false}
                                activeDot={{ r: 4, fill: "#D1D5DB", stroke: "#fff", strokeWidth: 2 }}
                                animationDuration={800}
                                animationEasing="ease-out"
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                        </div>
                      )}
                    </Card>
                  </React.Fragment>
                );
              })}
            </div>
          </section>
            </TabsContent>
            <TabsContent value="insights" className="mt-0">
              {/* KPI Badges */}
              <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[
                  { icon: "trending_down" as const, label: "Usage Trend", value: "↓ 63% over 12 months", color: "#3BB89A" },
                  { icon: "payments" as const, label: "Avg Bill", value: "$93.42/quarter", color: "#0091BF" },
                  { icon: "star" as const, label: "Payment Score", value: "95/100 — Excellent", color: "#F59E0B" },
                  { icon: "shield" as const, label: "Risk Level", value: "Low", color: "#864EAD" },
                ].map((badge) => (
                  <Card key={badge.label} className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <CardContent className="flex items-center gap-3 p-4 pt-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${badge.color}18` }}
                      >
                        <Icon name={badge.icon} size={20} style={{ color: badge.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 dark:text-slate-500">{badge.label}</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{badge.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Adora Customer Summary */}
              <Card className={cn("mb-3 overflow-hidden border border-[#00D2A2]/20 dark:border-[#00D2A2]/15", GLASS_CARD_LIGHT, GLASS_CARD_DARK, "shadow-[0_0_30px_rgba(0,210,162,0.08)] dark:shadow-[0_0_40px_rgba(0,210,162,0.12)]")}>
                <CardContent className="p-4 pt-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Image src="/Adora.svg" alt="Adora" width={80} height={36} className="h-6 w-auto" />
                      <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">Customer Summary</h3>
                    </div>
                    <Badge className="border-[#00D2A2]/40 bg-[#00D2A2]/10 text-xs font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">Auto-generated</Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                    Ronald is a <strong className="text-gray-900 dark:text-slate-100">long-standing customer</strong> since April 2008 with an <strong className="text-gray-900 dark:text-slate-100">excellent payment history</strong> (95th percentile). Energy usage has been <strong className="text-gray-900 dark:text-slate-100">declining steadily</strong> — down 63% over the past 12 months, likely due to solar panel installation. Currently in credit of $144.74. Multiple vulnerability flags are active. The account shows strong engagement through digital channels with decreasing call center contact.<strong className="text-gray-900 dark:text-slate-100">Recommended action:</strong> Review solar feed-in tariff rates and consider proactive hardship check-in.
                  </p>
                </CardContent>
              </Card>

              {/* Row 1: Energy Usage Trend + Cost Breakdown */}
              <div className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Energy Usage Trend</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-500">kWh consumption — 12 month view</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        <Icon name="trending_down" size={14} /> 63.1%
                      </span>
                    </div>
                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={INSIGHT_USAGE_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                          <defs>
                            <linearGradient id="gInsightKwh" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00C1FF" stopOpacity={0.15} />
                              <stop offset="100%" stopColor="#00C1FF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} />
                          <Area yAxisId="left" type="monotone" dataKey="kwh" stroke="#0091BF" fill="url(#gInsightKwh)" strokeWidth={2} name="Usage (kWh)" />
                          <Bar yAxisId="right" dataKey="cost" fill="#E8EBED" radius={[4, 4, 0, 0]} name="Cost ($)" barSize={20} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100">Cost Breakdown</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-[55%]">
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={COST_BREAKDOWN} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" stroke="none">
                              {COST_BREAKDOWN.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        {COST_BREAKDOWN.map((c) => (
                          <div key={c.name} className="flex items-center gap-2 text-xs">
                            <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c.color }} />
                            <span className="flex-1 text-gray-600 dark:text-slate-400">{c.name}</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Row 2: Daily Usage Pattern + Customer Health */}
              <div className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Daily Usage Pattern</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-500">Peak, Off-peak & Shoulder (kWh) — Last 28 days</p>
                    </div>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DAILY_USAGE} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="offpeak" stackId="a" fill="#4EEECA" name="Off-peak" />
                          <Bar dataKey="shoulder" stackId="a" fill="#0091BF" name="Shoulder" />
                          <Bar dataKey="peak" stackId="a" fill="#2C365D" radius={[3, 3, 0, 0]} name="Peak" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100">Customer Health</h3>
                    <div className="h-52 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={RADAR_DATA} cx="50%" cy="50%" outerRadius={70}>
                          <PolarGrid stroke="#E8EBED" />
                          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#64748B" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Score" dataKey="value" stroke="#0091BF" fill="#0091BF" fillOpacity={0.15} strokeWidth={2} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Row 3: Payment History + Channel Mix */}
              <div className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <div className="mb-4 flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Payment History</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-500">12 month payment record — 11/12 on time</p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        91.7% on-time
                      </span>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={PAYMENT_HISTORY} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="paid" name="Amount Paid" radius={[5, 5, 0, 0]}>
                            {PAYMENT_HISTORY.map((entry, i) => (
                              <Cell key={i} fill={entry.onTime ? "#3BB89A" : "#FF5E00"} opacity={0.8} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-5 pt-5">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Channel Mix</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-500">Interaction channels — 6 months</p>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={INTERACTION_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                          <Tooltip content={<ChartTooltip />} />
                          <Bar dataKey="calls" fill="#FFD41E" radius={[3, 3, 0, 0]} name="Calls" barSize={12} />
                          <Bar dataKey="emails" fill="#0091BF" radius={[3, 3, 0, 0]} name="Emails" barSize={12} />
                          <Bar dataKey="web" fill="#4EEECA" radius={[3, 3, 0, 0]} name="Web" barSize={12} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bill Forecast — full width */}
              <Card className={cn("mb-3 overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                <CardContent className="p-5 pt-5">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Bill Forecast</h3>
                      <p className="text-xs text-gray-500 dark:text-slate-500">Predicted billing for next 4 months based on usage patterns & seasonality</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">
                      Predictive
                    </span>
                  </div>
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={COMBINED_FORECAST} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gForecast" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B368E7" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#B368E7" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gActualFc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00C1FF" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#00C1FF" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="high" stroke="none" fill="#B368E720" name="Upper bound" />
                        <Area type="monotone" dataKey="low" stroke="none" fill="#FFFFFF" name="Lower bound" />
                        <Area type="monotone" dataKey="actual" stroke="#0091BF" fill="url(#gActualFc)" strokeWidth={2} name="Actual" connectNulls={false} />
                        <Line type="monotone" dataKey="forecast" stroke="#B368E7" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "#B368E7", stroke: "white", strokeWidth: 2 }} name="Forecast" connectNulls={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bottom Summary Stats */}
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[
                  { num: "$1,121", label: "Total Billed (12mo)", change: "↓ 34% vs prior year", changeColor: "text-emerald-600 dark:text-emerald-400" },
                  { num: "2,988", label: "kWh Total Usage", change: "↓ 63% vs prior year", changeColor: "text-emerald-600 dark:text-emerald-400" },
                  { num: "4.2", label: "Avg Days Late", change: "↓ from 6.8 days", changeColor: "text-emerald-600 dark:text-emerald-400" },
                  { num: "16.8", label: "Years as Customer", change: "Since Apr 2008", changeColor: "text-[#0091BF] dark:text-[#00C1FF]" },
                ].map((stat) => (
                  <Card key={stat.label} className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <CardContent className="p-5 pt-5 text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stat.num}</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">{stat.label}</p>
                      <p className={cn("mt-1 text-xs font-medium", stat.changeColor)}>{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="bill-compare" className="mt-0">
              <div className="rounded-density-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
                <p>Bill Compare content would go here.</p>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <div className="rounded-density-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
                <p>History content would go here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
            </div>

            {/* Right-hand control panel */}
            <aside
              className={cn(
                "shrink-0 overflow-hidden py-4 pr-3 transition-[width,padding] duration-300 ease-in-out",
                controlPanelOpen ? "w-[306px]" : "w-0 pr-0"
              )}
            >
              <div
                className={cn(
                  "flex h-full min-w-[290px] flex-col overflow-hidden rounded-2xl",
                  GLASS_CARD_LIGHT,
                  GLASS_CARD_DARK
                )}
              >
              <div className="flex flex-1 flex-col overflow-y-auto">
                {/* Panel tabs */}
                <div className="flex items-center gap-1 px-3 pt-3 pb-2">
                  <div className="flex flex-1 gap-1">
                    {PANEL_TABS.map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActivePanelTab(tab)}
                        className={cn(
                          "whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                          activePanelTab === tab
                            ? "bg-gray-100 text-[#2C365D] dark:bg-white/[0.1] dark:text-[#00D2A2]"
                            : "text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400"
                        )}
                      >
                        {tab === "Adora" ? (
                          <span className="flex items-center gap-1">
                            <Image src="/AdoraDot.svg" alt="" width={16} height={16} className="h-3.5 w-3.5" />
                            Adora
                          </span>
                        ) : tab}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setControlPanelOpen(false)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-slate-300"
                    aria-label="Close control panel"
                  >
                    <Icon name="right_panel_close" size={16} />
                  </button>
                </div>

                {/* Quick action buttons */}
                <div className="flex gap-2 border-b border-gray-100/60 p-3.5 dark:border-white/[0.04]">
                  {([
                    ["edit", "Edit"],
                    ["download", "Export"],
                    ["filter_list", "Filter"],
                    ["settings", "Config"],
                  ] as const).map(([icon, label]) => (
                    <button
                      key={icon}
                      type="button"
                      className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-gray-200/60 bg-white/60 px-1 py-2.5 text-gray-500 backdrop-blur-lg transition-all hover:-translate-y-0.5 hover:border-[#4EEECA]/30 hover:bg-[#4EEECA]/8 hover:text-[#298268] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:hover:border-[#4EEECA]/20 dark:hover:bg-[#4EEECA]/10 dark:hover:text-[#4EEECA]"
                    >
                      <Icon name={icon} size={17} />
                      <span className="text-[10px] font-medium">{label}</span>
                    </button>
                  ))}
                </div>

                {/* Create new task */}
                <div className="px-3.5 pt-3.5">
                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#2C365D]/30 bg-[#2C365D]/4 px-3 py-2.5 text-[13px] font-semibold text-[#2C365D] transition-all hover:-translate-y-0.5 hover:border-[#2C365D] hover:bg-[#2C365D]/8 hover:shadow-md dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-white/40 dark:hover:bg-white/[0.06]"
                  >
                    <Icon name="add" size={16} />
                    Create new task
                    <span className="rounded bg-[#2C365D] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white dark:bg-[#00D2A2] dark:text-gray-900">
                      New
                    </span>
                  </button>
                </div>

                {/* Task categories */}
                <div className="flex-1 px-2 py-1.5">
                  {TASK_CATEGORIES.map((tc) => (
                    <button
                      key={tc.name}
                      type="button"
                      className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-white/[0.04]"
                    >
                      <Icon name={tc.icon} size={17} className="shrink-0 text-gray-400 dark:text-slate-500" />
                      <span className="flex-1 text-left text-[13px] font-medium text-gray-700 dark:text-slate-300">
                        {tc.name}
                      </span>
                      <span
                        className={cn(
                          "min-w-[28px] rounded-full px-2 py-0.5 text-center font-mono text-[11.5px] font-medium",
                          tc.count === null
                            ? "bg-gray-100/60 text-gray-400 dark:bg-white/[0.04] dark:text-slate-600"
                            : tc.hot
                              ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-gray-100/60 text-gray-500 dark:bg-white/[0.06] dark:text-slate-400"
                        )}
                      >
                        {tc.count ?? "—"}
                      </span>
                      <Icon name="chevron_right" size={15} className="shrink-0 text-gray-300 dark:text-slate-600" />
                    </button>
                  ))}
                </div>
              </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
