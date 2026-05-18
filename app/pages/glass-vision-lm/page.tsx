"use client";

import React, { Suspense, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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

/* ────────── Chart data ────────── */

const USAGE_DATA = [
  { month: "Jul", usage: 3820 },
  { month: "Aug", usage: 3640 },
  { month: "Sep", usage: 4120 },
  { month: "Oct", usage: 3950 },
  { month: "Nov", usage: 4280 },
  { month: "Dec", usage: 4510 },
  { month: "Jan", usage: 4680 },
  { month: "Feb", usage: 4320 },
];

const INSIGHT_USAGE_DATA = [
  { month: "Mar", kwh: 4200, cost: 1420 },
  { month: "Apr", kwh: 3800, cost: 1280 },
  { month: "May", kwh: 4500, cost: 1560 },
  { month: "Jun", kwh: 3950, cost: 1340 },
  { month: "Jul", kwh: 3600, cost: 1180 },
  { month: "Aug", kwh: 3100, cost: 950 },
  { month: "Sep", kwh: 2800, cost: 780 },
  { month: "Oct", kwh: 3450, cost: 1068 },
  { month: "Nov", kwh: 4200, cost: 1580 },
  { month: "Dec", kwh: 4980, cost: 1720 },
  { month: "Jan", kwh: 4750, cost: 1645 },
  { month: "Feb", kwh: 4550, cost: 1525 },
];

const COST_BREAKDOWN = [
  { name: "Usage", value: 42, color: "#2C365D" },
  { name: "Demand", value: 24, color: "#00C1FF" },
  { name: "Network", value: 18, color: "#4EEECA" },
  { name: "Environmental", value: 10, color: "#FFD41E" },
  { name: "Metering", value: 6, color: "#B368E7" },
];

const DAILY_USAGE = Array.from({ length: 28 }, (_, i) => ({
  day: i + 1,
  peak: 28 + Math.round(Math.random() * 14),
  offpeak: 8 + Math.round(Math.random() * 8),
  shoulder: 14 + Math.round(Math.random() * 10),
}));

const RADAR_DATA = [
  { metric: "Payment", value: 88 },
  { metric: "Usage Trend", value: 62 },
  { metric: "Engagement", value: 75 },
  { metric: "Loyalty", value: 92 },
  { metric: "Risk Score", value: 28 },
  { metric: "Satisfaction", value: 80 },
];

const PAYMENT_HISTORY = [
  { month: "Mar", paid: 1420, onTime: true },
  { month: "Apr", paid: 1280, onTime: true },
  { month: "May", paid: 1560, onTime: false },
  { month: "Jun", paid: 1340, onTime: true },
  { month: "Jul", paid: 1180, onTime: true },
  { month: "Aug", paid: 950, onTime: true },
  { month: "Sep", paid: 780, onTime: true },
  { month: "Oct", paid: 1068, onTime: true },
  { month: "Nov", paid: 1580, onTime: true },
  { month: "Dec", paid: 1720, onTime: false },
  { month: "Jan", paid: 1645, onTime: true },
  { month: "Feb", paid: 1525, onTime: true },
];

const INTERACTION_DATA = [
  { month: "Sep", calls: 5, emails: 8, web: 12 },
  { month: "Oct", calls: 3, emails: 6, web: 14 },
  { month: "Nov", calls: 4, emails: 5, web: 10 },
  { month: "Dec", calls: 6, emails: 3, web: 8 },
  { month: "Jan", calls: 2, emails: 7, web: 15 },
  { month: "Feb", calls: 3, emails: 4, web: 18 },
];

const COMBINED_FORECAST = [
  ...INSIGHT_USAGE_DATA.slice(-4).map((d) => ({
    month: d.month,
    actual: d.cost,
    forecast: null as number | null,
    low: null as number | null,
    high: null as number | null,
  })),
  { month: "Mar", actual: null as number | null, forecast: 1480, low: 1200, high: 1750 },
  { month: "Apr", actual: null, forecast: 1320, low: 1050, high: 1600 },
  { month: "May", actual: null, forecast: 1560, low: 1280, high: 1850 },
  { month: "Jun", actual: null, forecast: 1380, low: 1100, high: 1680 },
];

const LOAD_DISAGG_DATA = [
  { category: "HVAC", kWh: 1480, fill: "#6366F1" },
  { category: "Lighting", kWh: 840, fill: "#06B6D4" },
  { category: "Equipment", kWh: 620, fill: "#00D2A2" },
  { category: "Hot Water", kWh: 380, fill: "#F59E0B" },
  { category: "IT/Comms", kWh: 290, fill: "#EC4899" },
  { category: "Other", kWh: 220, fill: "#9CA3AF" },
];

const BILL_VS_PREVIOUS_DATA = [
  { month: "Jul", current: 1420, previous: 1300 },
  { month: "Aug", current: 1350, previous: 1480 },
  { month: "Sep", current: 1480, previous: 1450 },
  { month: "Oct", current: 1520, previous: 1380 },
  { month: "Nov", current: 1650, previous: 1530 },
  { month: "Dec", current: 1780, previous: 1560 },
  { month: "Jan", current: 1700, previous: 1580 },
  { month: "Feb", current: 1580, previous: 1420 },
];

/* ────────── Nav & panel data ────────── */

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "dashboard", children: [{ id: "home-dashboard", label: "Dashboard" }, { id: "home-exceptions", label: "Exceptions" }] },
  { id: "sales", label: "Sales", icon: "trending_up", children: [{ id: "sales-discovery", label: "Discovery" }, { id: "sales-quotes", label: "Quotes" }] },
  { id: "customers", label: "Customers", icon: "group", children: [{ id: "customers-accounts", label: "Accounts" }, { id: "customers-add-new", label: "Add New Accounts" }] },
  { id: "billing", label: "Billing", icon: "receipt", children: [{ id: "billing-dashboard", label: "Dashboard" }, { id: "billing-invoices", label: "Invoices" }] },
  { id: "payments", label: "Payments", icon: "credit_card", children: [{ id: "payments-suspense", label: "Suspense Account" }] },
  { id: "market", label: "Market", icon: "store", children: [{ id: "market-change-requests", label: "Change Requests" }] },
  { id: "reporting", label: "Reporting", icon: "insights", children: [{ id: "reporting-reports", label: "Reports" }] },
  { id: "settings", label: "Settings", icon: "settings", children: [] },
];

const PANEL_TABS = ["Adora", "Control Panel", "X-Sell"] as const;

const TASK_CATEGORIES = [
  { name: "Account Tasks", count: null, icon: "group" as const, hot: false },
  { name: "Financial Tasks", count: 42, icon: "attach_money" as const, hot: true },
  { name: "Supply Tasks", count: 8, icon: "bolt" as const, hot: false },
  { name: "Interaction Tasks", count: 12, icon: "chat_bubble_outline" as const, hot: false },
  { name: "Utility Tasks", count: 23, icon: "monitoring" as const, hot: false },
  { name: "Credit Tasks", count: 35, icon: "credit_card" as const, hot: true },
  { name: "Customer Tasks", count: 19, icon: "group" as const, hot: false },
  { name: "No Contact Tasks", count: 4, icon: "power_settings_new" as const, hot: false },
];

/* ────────── Service address accounts (Commercial + Small Business only) ────────── */

type AccountRecord = {
  address: string;
  nmi: string;
  type: "Commercial" | "Small Business";
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
    address: "L3/500 Bourke St, Melbourne, VIC 3000",
    nmi: "5044 8821 3470 61",
    type: "Commercial",
    fuel: "Electricity",
    status: "OPEN",
    balance: "$1,208.90",
    isCredit: false,
    plan: "Business Premium",
    planRef: "50448821 001",
    bestOffer: "Currently on best",
    billing: "Monthly billing",
    billingTo: "To 31 Jan 2025",
    commenced: "03 Sep 2022",
    invoiceAmount: "$1,208.90",
    allocated: "Fully allocated",
    posted: "05 Feb 2025",
    due: "22 Feb 2025",
    charges: "$1,208.90",
    demandCharge: "$312.45",
    washup: "No days washed up",
    billVsPrevious: "3.8%",
    billVsPreviousUp: true,
  },
  {
    address: "12 Hardware Ln, Melbourne, VIC 3000",
    nmi: "6055 9932 4580 38",
    type: "Small Business",
    fuel: "Electricity + Gas",
    status: "CLOSED",
    balance: "$0.00",
    isCredit: false,
    isClosed: true,
    plan: "Small Biz Basic",
    planRef: "60559932 001",
    bestOffer: "N/A",
    billing: "Account closed",
    billingTo: "Final 15 Dec 2024",
    commenced: "12 Jul 2018",
    finalInvoice: "$0.00",
    allocated: "Fully allocated",
    posted: "18 Dec 2024",
    closedOn: "15 Dec 2024",
    finalRead: "Actual",
    washup: "Settled",
    billVsPrevious: "—",
  },
];

const ACCOUNT_USAGE_SPARKLINES: Record<string, number[]> = {
  "42 Collins St, Melbourne, VIC 3000": [1820, 1940, 2010, 2150, 2080, 2210, 2340, 2460],
  "155 Queen St, Melbourne, VIC 3000": [680, 710, 695, 720, 740, 730, 750, 755],
  "7/88 Chapel St, Windsor, VIC 3181": [310, 295, 320, 305, 285, 270, 290, 275],
  "L3/500 Bourke St, Melbourne, VIC 3000": [980, 1020, 1060, 1040, 1090, 1120, 1150, 1180],
  "12 Hardware Ln, Melbourne, VIC 3000": [250, 240, 230, 210, 195, 180, 160, 0],
};

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
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-gray-600 dark:text-slate-300">{entry.name}</span>
          <span className="ml-auto font-semibold text-gray-900 dark:text-slate-100">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ────────── Theme constants ────────── */

const DARKEST_NAVY = "#161B2E";
const DARK_NAVY = "#212946";

const PANE_LIGHT = "bg-gray-100";
const GLASS_PANEL_LIGHT = "bg-white/80 backdrop-blur-xl border border-gray-200/90 shadow-xl shadow-gray-200/50";
const GLASS_CARD_LIGHT = "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40";

const PANE_DARK = "dark:bg-gray-900";
const GLASS_CARD_DARK = "dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border-white/[0.12] dark:shadow-none";

/* ────────── Adora text segments ────────── */

const ADORA_SEGMENTS = [
  { text: "Masked_Name_44D550D62 is a ", bold: false },
  { text: "high-value commercial customer", bold: true },
  { text: " (account QB00171824) with ", bold: false },
  { text: "strong payment reliability", bold: true },
  { text: " (88th percentile). The account covers a ", bold: false },
  { text: "multi-site commercial portfolio", bold: true },
  { text: " with energy consumption ", bold: false },
  { text: "trending upward +12.3%", bold: true },
  { text: " over the past 12 months. Demand charges represent 24% of total costs — ", bold: false },
  { text: "demand management opportunity", bold: true },
  { text: " identified. Contract expires 30 Jun 2025. ", bold: false },
  { text: "Recommended actions:", bold: true },
  { text: " Review demand tariff structure, initiate contract renewal discussions, and assess solar/battery feasibility for peak demand reduction.", bold: false },
];
const ADORA_TOTAL_CHARS = ADORA_SEGMENTS.reduce((sum, s) => sum + s.text.length, 0);

/* ────────── Component ────────── */

export default function GlassVisionLMPage() {
  return (
    <Suspense>
      <GlassVisionLMContent />
    </Suspense>
  );
}

function GlassVisionLMContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeNavId, setActiveNavId] = useState("customers-accounts");
  const [openParentId, setOpenParentId] = useState<string | null>("customers");
  const [isExpanded, setIsExpanded] = useState(searchParams.get("expanded") === "true");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [controlPanelOpen, setControlPanelOpen] = useState(true);
  const [activePanelTab, setActivePanelTab] = useState<(typeof PANEL_TABS)[number]>("Adora");
  const [adoraPhase, setAdoraPhase] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const [adoraCharCount, setAdoraCharCount] = useState(0);
  const adoraStarted = useRef(false);
  const [xSellView, setXSellView] = useState<string | null>(null);
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string | null>(null);
  const [serviceAddressView, setServiceAddressView] = useState<"list" | "card">("list");

  const [flyoutParentId, setFlyoutParentId] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showFlyout = (e: React.MouseEvent, itemId: string) => {
    if (!navCollapsed) return;
    if (flyoutTimeout.current) clearTimeout(flyoutTimeout.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutPos({ top: rect.top, left: rect.right + 8 });
    setFlyoutParentId(itemId);
  };
  const hideFlyout = () => {
    flyoutTimeout.current = setTimeout(() => { setFlyoutPos(null); setFlyoutParentId(null); }, 100);
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

  useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) {
      sidebar.style.display = isExpanded ? "none" : "";
    }
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, [isExpanded]);

  useEffect(() => {
    const floatingControls = document.querySelector(".fixed.bottom-6.right-6") as HTMLElement | null;
    if (floatingControls) floatingControls.style.display = "none";
    return () => {
      if (floatingControls) floatingControls.style.display = "";
    };
  }, []);

  useEffect(() => {
    if (activeTab === "overview" && !adoraStarted.current) {
      adoraStarted.current = true;
      setAdoraPhase("thinking");
      const t = setTimeout(() => setAdoraPhase("typing"), 1800);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  useEffect(() => {
    if (adoraPhase !== "typing") return;
    if (adoraCharCount >= ADORA_TOTAL_CHARS) {
      setAdoraPhase("done");
      return;
    }
    const t = setTimeout(() => setAdoraCharCount((c) => Math.min(c + 2, ADORA_TOTAL_CHARS)), 10);
    return () => clearTimeout(t);
  }, [adoraPhase, adoraCharCount]);

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

  const renderAdoraSegments = (charLimit: number) => {
    let remaining = charLimit;
    return ADORA_SEGMENTS.map((seg, i) => {
      if (remaining <= 0) return null;
      const visible = Math.min(remaining, seg.text.length);
      remaining -= visible;
      const text = seg.text.slice(0, visible);
      return seg.bold ? (
        <strong key={i} className="text-gray-900 dark:text-slate-100">{text}</strong>
      ) : (
        <span key={i}>{text}</span>
      );
    });
  };

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: DARKEST_NAVY }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ────── Header: Glass chrome with CIS/LM branding ────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image
                src="/GlassLogoTest_darkmode.svg"
                alt="Tally Glass"
                width={140}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <Link href="/pages/tally-large-market" className="flex items-center transition-opacity hover:opacity-80">
              <Image
                src="/TallyCIS_Test.svg"
                alt="Tally CIS"
                width={140}
                height={34}
                className="h-7 w-auto brightness-0 invert"
              />
            </Link>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search Tally..."
                className="h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2A2]/50"
                style={{ backgroundColor: DARK_NAVY }}
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-gray-400">⌘K</kbd>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => { setControlPanelOpen(true); setActivePanelTab("Adora"); }}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-all",
                activePanelTab === "Adora" && controlPanelOpen
                  ? "bg-orange-500 ring-2 ring-orange-300/40"
                  : "bg-orange-400 hover:bg-orange-500"
              )}
            >
              <Image src="/AdoraDot.svg" alt="" width={16} height={16} className="h-4 w-4" />
              Adora
            </button>
            <button type="button" className="relative rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Notifications">
              <Icon name="notifications" size={22} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E8560A]" aria-hidden />
            </button>
            <Avatar className="h-9 w-9 border-2 border-[#00D2A2]/30">
              <AvatarFallback className="text-xs font-medium text-white" style={{ backgroundColor: secondaryColors.turquoise.hex }}>PA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* ────── Left navigation (CIS-style items, Glass-style chrome) ────── */}
          <aside className={cn("flex shrink-0 flex-col items-center min-h-0 transition-[width] duration-300", navCollapsed ? "w-16" : "w-64")}>
            <nav className={cn("flex flex-1 flex-col min-h-0 overflow-y-auto", navCollapsed ? "items-center gap-0.5 p-2" : "p-2")}>
              {LEFT_NAV_ITEMS.map((item) => {
                const hasChildren = (item.children?.length ?? 0) > 0;
                const isOpen = openParentId === item.id;
                const parentActive = isParentActive(item);

                if (navCollapsed) {
                  return (
                    <div
                      key={item.id}
                      className="relative flex w-full justify-center"
                      role="button"
                      tabIndex={0}
                      onMouseEnter={(e) => { if (hasChildren) { cancelHideFlyout(); showFlyout(e, item.id); } }}
                      onMouseLeave={() => { if (hasChildren) hideFlyout(); }}
                      onClick={() => { if (!hasChildren) setActiveNavId(item.id); }}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (hasChildren) setFlyoutParentId(item.id); else setActiveNavId(item.id); } }}
                    >
                      {parentActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r" style={{ backgroundColor: secondaryColors.turquoise.hex }} aria-hidden />
                      )}
                      <button
                        type="button"
                        className={cn(
                          "group flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                          parentActive ? "bg-white/10 text-[#00D2A2]" : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                        )}
                      >
                        <Icon name={item.icon as "dashboard"} size={20} className={cn("shrink-0", parentActive ? "text-[#00D2A2]" : "text-gray-400 group-hover:text-gray-100")} />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleParentClick(item)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal transition-colors",
                        parentActive || isOpen
                          ? "bg-white/10 text-[#00D2A2]"
                          : "text-gray-400 hover:bg-white/10 hover:text-gray-100"
                      )}
                    >
                      <Icon name={item.icon as "dashboard"} size={20} className={cn("shrink-0", parentActive || isOpen ? "text-[#00D2A2]" : "text-gray-400 group-hover:text-gray-100")} />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {hasChildren && <Icon name={isOpen ? "expand_less" : "expand_more"} size={20} className="shrink-0 text-gray-500" />}
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
                                  ? "bg-white/10 text-[#00D2A2]"
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
            <div className="shrink-0 border-t border-white/10 p-2 flex flex-col items-center gap-0.5">
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="group flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
              >
                <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
              </button>
              <button
                type="button"
                onClick={() => setNavCollapsed((v) => !v)}
                className="group flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100"
                aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
              >
                <Icon name={navCollapsed ? "chevron_right" : "chevron_left"} size={20} />
              </button>
            </div>
          </aside>

          {/* Collapsed flyout */}
          {navCollapsed && flyoutParentId && flyoutPos && (() => {
            const parentItem = LEFT_NAV_ITEMS.find((i) => i.id === flyoutParentId);
            if (!parentItem?.children?.length) return null;
            return (
              <div
                className="fixed z-[100] min-w-[180px] rounded-md border border-gray-600 bg-gray-800 py-2"
                style={{ top: flyoutPos.top, left: flyoutPos.left, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" }}
                onMouseEnter={cancelHideFlyout}
                onMouseLeave={hideFlyout}
              >
                <div className="px-4 pb-1 pt-1.5 text-sm font-normal text-gray-300">{parentItem.label}</div>
                <div className="relative ml-4 border-l border-gray-600">
                  {parentItem.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => { setActiveNavId(child.id); setOpenParentId(parentItem.id); hideFlyout(); }}
                      className={cn(
                        "flex w-full items-center py-2 pl-3 pr-4 text-left text-sm font-normal transition-colors",
                        activeNavId === child.id
                          ? "mx-2 rounded-lg bg-[#00D2A2]/20 font-medium text-[#00D2A2]"
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

          {/* ────── Main content pane ────── */}
          <main className={cn("flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem]", PANE_LIGHT, PANE_DARK)}>
            {/* Left profile column */}
            <aside className={cn("flex w-72 shrink-0 flex-col overflow-y-auto px-3 py-4", PANE_LIGHT, PANE_DARK)}>
              <div className="space-y-2">
                {/* Account header card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 rounded-full bg-violet-400/90 ring-2 ring-violet-400/40">
                          <AvatarFallback className="bg-transparent text-lg font-medium text-violet-950">LM</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                          <Icon name="check" size={10} className="text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="break-words text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">QB00171824</h2>
                        <p className="break-words text-sm text-gray-600 dark:text-slate-400">Masked_Name_44D550D62</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">Commercial</p>
                      </div>
                    </div>
                    <div className="mt-3 flex w-full flex-wrap gap-1.5">
                      <span className="rounded-lg bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-500/20 dark:text-violet-300">Large Market</span>
                      <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">Active</span>
                      <span className="rounded-lg bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-500/20 dark:text-sky-300">Billing</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Account details card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Account details</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Icon name="business" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">AMPOL FOODARY GUMLY GUMLY</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="location_on" size={14} className="mt-0.5 shrink-0 text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">155 Queen St, Melbourne, VIC 3000</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="tag" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">NMI: 30125553846</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="bolt" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">Electricity</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary contact card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Primary contact</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Icon name="person" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">Justine Masked_Name_32BB</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="mail" size={14} className="mt-0.5 shrink-0 text-gray-300 dark:text-slate-600" />
                        <span className="break-all font-medium text-gray-800 dark:text-slate-200">justine.masked@example.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="phone" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">07 3555 0653</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial summary */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Financial summary</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Account balance</span>
                        <span className="font-semibold text-red-600 dark:text-red-400">-$200.58</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Last payment</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">$50.10</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Contract end</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">30/06/2025</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Annual consumption</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">4,500 kWh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </aside>

            {/* ────── Scrollable centre content ────── */}
            <div className="relative min-w-0 flex-1 overflow-y-auto bg-transparent">
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
                      {["overview", "insights", "bill-compare", "history"].map((tab) => (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="rounded-lg px-3 py-1.5 text-sm capitalize text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]"
                        >
                          {tab === "bill-compare" ? "Bill Compare" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>

                  {/* ──── Overview Tab: Service Addresses ──── */}
                  <TabsContent value="overview" className="mt-0">
                    <section>
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-3">
                          <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-slate-100">Service Addresses</h2>
                          <p className="text-sm text-gray-500 dark:text-slate-500">{ACCOUNTS.length} accounts</p>
                        </div>
                        <div className="flex h-8 items-center gap-0.5 rounded-lg border border-gray-200/80 bg-gray-100/90 p-0.5 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.06]">
                          {([
                            { key: "list" as const, icon: "view_list", label: "List" },
                            { key: "card" as const, icon: "grid_view", label: "Card" },
                          ] as const).map((opt) => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setServiceAddressView(opt.key)}
                              className={cn(
                                "flex items-center justify-center rounded-md p-1.5 transition-all",
                                serviceAddressView === opt.key
                                  ? "bg-white text-[#2C365D] shadow-sm dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]"
                                  : "text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-300"
                              )}
                              aria-label={opt.label}
                            >
                              <Icon name={opt.icon} size={16} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {serviceAddressView === "list" ? (
                      <div className="space-y-3">
                        {ACCOUNTS.map((acc) => {
                          const typeIcon = acc.type === "Commercial" ? "business" : "store";
                          const typeIconBg =
                            acc.type === "Commercial"
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
                                  GLASS_CARD_LIGHT, GLASS_CARD_DARK,
                                  "hover:shadow-lg hover:shadow-[#00D2A2]/10",
                                  isSelected && "ring-1 ring-[#00D2A2]/25 shadow-[0_0_20px_rgba(0,210,162,0.12)] dark:ring-[#00D2A2]/20"
                                )}
                                onClick={() => handleAccountClick(acc.address)}
                              >
                                <CardContent className="px-5 py-4 pt-4">
                                  <div className="flex items-center justify-between gap-3.5">
                                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]", typeIconBg)}>
                                        <Icon name={typeIcon} size={18} />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{acc.address}</p>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                                          <span className="text-gray-500 dark:text-slate-500">NMI: {acc.nmi}</span>
                                          <span className={cn("rounded-lg px-2 py-0.5 font-medium", typeIconBg)}>{acc.type}</span>
                                          <span className="rounded-lg bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-slate-600/40 dark:text-slate-400">{acc.fuel}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                      <span className={cn("rounded-lg px-2 py-0.5 text-xs font-medium", acc.status === "CLOSED" ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500" : "bg-gray-100 text-gray-600 dark:bg-slate-600/40 dark:text-slate-400")}>{acc.status}</span>
                                      <span className={cn("rounded-lg px-2 py-1 text-sm font-medium", balancePillGreen ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300")}>{acc.balance}</span>
                                      <Icon name={isSelected ? "expand_less" : "chevron_right"} size={20} className="text-gray-500 dark:text-slate-500" />
                                    </div>
                                  </div>
                                </CardContent>
                                {isSelected && (
                                  <div className="space-y-6 border-t border-gray-200/80 px-5 pb-5 pt-5 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                      {[
                                        { label: "Plan", value: acc.plan ?? "—", sub: acc.planRef },
                                        { label: "Best offer", value: acc.bestOffer ?? "—" },
                                        { label: "Billing", value: acc.billing ?? "—", sub: acc.billingTo },
                                        { label: "Commenced", value: acc.commenced ?? "—" },
                                      ].map((kpi) => (
                                        <Card key={kpi.label} className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                                          <CardContent className="p-5 pt-5 pb-5">
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">{kpi.label}</p>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{kpi.value}</p>
                                            {kpi.sub && <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">{kpi.sub}</p>}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>

                                    <div className="grid gap-6 lg:grid-cols-2">
                                      <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                                        <CardContent className="p-5 pt-5 pb-5">
                                          <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">Bill Information</h3>
                                          <Tabs defaultValue="overview" className="mt-4">
                                            <TabsList className="mb-4 h-10 gap-1 rounded-lg bg-gray-100/90 p-1 backdrop-blur-md border border-gray-200/80 dark:bg-white/[0.06] dark:border-white/[0.08]">
                                              <TabsTrigger value="overview" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">Overview</TabsTrigger>
                                              <TabsTrigger value="load" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">Load Disagg</TabsTrigger>
                                              <TabsTrigger value="usage" className="rounded-md px-3 py-1.5 text-sm text-gray-600 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] dark:text-slate-400 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">Usage</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="overview" className="mt-0">
                                              <div className="space-y-3 text-sm text-gray-700 dark:text-slate-300">
                                                {acc.isClosed ? (
                                                  <>
                                                    {[{ l: "Final invoice", v: acc.finalInvoice }, { l: "Allocated", v: acc.allocated }, { l: "Posted", v: acc.posted }, { l: "Closed on", v: acc.closedOn }, { l: "Final read", v: acc.finalRead }, { l: "Washup", v: acc.washup }].map((r) => (
                                                      <div key={r.l} className="flex justify-between gap-4"><span className="text-gray-500 dark:text-slate-500">{r.l}</span><span className="font-medium text-gray-900 dark:text-slate-100">{r.v ?? "—"}</span></div>
                                                    ))}
                                                  </>
                                                ) : (
                                                  <>
                                                    {[{ l: "Invoice amount", v: acc.invoiceAmount }, { l: "Allocated", v: acc.allocated }, { l: "Posted", v: acc.posted }, { l: "Due", v: acc.due }, { l: "Charges", v: acc.charges }, ...(acc.demandCharge ? [{ l: "Demand charge", v: acc.demandCharge }] : []), { l: "Washup", v: acc.washup }].map((r) => (
                                                      <div key={r.l} className="flex justify-between gap-4">
                                                        <span className="text-gray-500 dark:text-slate-500">{r.l}</span>
                                                        <span className={cn("font-medium", r.l === "Charges" && (acc.charges?.includes("−") || acc.charges?.includes("-")) && acc.charges?.includes("CR") ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-slate-100")}>{r.v ?? "—"}</span>
                                                      </div>
                                                    ))}
                                                  </>
                                                )}
                                              </div>
                                            </TabsContent>
                                            <TabsContent value="load" className="mt-0">
                                              <p className="mb-3 text-xs text-gray-500 dark:text-slate-400">Estimated breakdown by equipment category (kWh)</p>
                                              <div className="space-y-2.5">
                                                {LOAD_DISAGG_DATA.map((item) => {
                                                  const maxKWh = LOAD_DISAGG_DATA[0].kWh;
                                                  const pct = Math.round((item.kWh / maxKWh) * 100);
                                                  return (
                                                    <div key={item.category} className="group">
                                                      <div className="mb-1 flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-slate-300"><span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />{item.category}</span>
                                                        <span className="tabular-nums text-gray-500 dark:text-slate-400">{item.kWh.toLocaleString()} kWh</span>
                                                      </div>
                                                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                                                        <div className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80" style={{ width: `${pct}%`, backgroundColor: item.fill }} />
                                                      </div>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-white/[0.06]">
                                                <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Total estimated</span>
                                                <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-slate-100">{LOAD_DISAGG_DATA.reduce((s, d) => s + d.kWh, 0).toLocaleString()} kWh</span>
                                              </div>
                                            </TabsContent>
                                            <TabsContent value="usage" className="mt-0">
                                              <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"><span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CHART_TEAL }} />Monthly kWh</div>
                                              <div className="h-48 w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                  <BarChart data={USAGE_DATA} margin={{ top: 8, right: 12, bottom: 4, left: -8 }} barCategoryGap="25%">
                                                    <defs>
                                                      <linearGradient id={`gradUsage-${acc.nmi.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.85} />
                                                        <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.4} />
                                                      </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
                                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
                                                    <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={40} />
                                                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,210,162,0.06)", radius: 6 }} />
                                                    <Bar dataKey="usage" name="Usage (kWh)" fill={`url(#gradUsage-${acc.nmi.replace(/\s/g, "")})`} radius={[4, 4, 0, 0]} animationDuration={800} />
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
                                          </div>
                                          {acc.billVsPrevious && acc.billVsPrevious !== "—" ? (
                                            <div className={cn("mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium", acc.billVsPreviousUp ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300")}>
                                              <Icon name={acc.billVsPreviousUp ? "trending_up" : "trending_down"} size={18} />{acc.billVsPrevious}
                                            </div>
                                          ) : null}
                                          <div className="mt-4 flex items-center gap-4">
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"><span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CHART_TEAL }} />Current</span>
                                            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-400"><span className="inline-block h-2 w-2 rounded-full bg-gray-300 dark:bg-slate-500" />Previous</span>
                                          </div>
                                          <div className="mt-2 h-52 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <ComposedChart data={BILL_VS_PREVIOUS_DATA} margin={{ top: 12, right: 12, bottom: 4, left: -8 }}>
                                                <defs>
                                                  <linearGradient id={`bill-area-${acc.nmi.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.25} />
                                                    <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.02} />
                                                  </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
                                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
                                                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={40} />
                                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#00D2A2", strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.4 }} />
                                                <Area type="natural" dataKey="current" name="Current ($)" stroke={CHART_TEAL} strokeWidth={2.5} fill={`url(#bill-area-${acc.nmi.replace(/\s/g, "")})`} dot={false} activeDot={{ r: 5, fill: CHART_TEAL, stroke: "#fff", strokeWidth: 2 }} animationDuration={800} />
                                                <Line type="natural" dataKey="previous" name="Previous ($)" stroke="#D1D5DB" strokeWidth={1.5} strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: "#D1D5DB", stroke: "#fff", strokeWidth: 2 }} animationDuration={800} />
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
                      ) : (
                      /* ── Card View ── */
                      <div className="grid gap-4 sm:grid-cols-2">
                        {ACCOUNTS.map((acc) => {
                          const typeIcon = acc.type === "Commercial" ? "business" : "store";
                          const typeIconBg =
                            acc.type === "Commercial"
                              ? "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300";
                          const balancePillGreen = acc.isCredit || acc.balance === "$0.00";
                          const sparkline = ACCOUNT_USAGE_SPARKLINES[acc.address] ?? [];
                          const trendPct = acc.billVsPrevious && acc.billVsPrevious !== "—" ? acc.billVsPrevious : null;

                          return (
                            <Card
                              key={acc.address}
                              className={cn(
                                "cursor-pointer overflow-hidden border-0 transition-all duration-200",
                                GLASS_CARD_LIGHT, GLASS_CARD_DARK,
                                "hover:shadow-lg hover:shadow-[#00D2A2]/10",
                                acc.isClosed && "opacity-70"
                              )}
                              onClick={() => handleAccountClick(acc.address)}
                            >
                              <CardContent className="p-0">
                                <div className="px-5 pt-5 pb-3">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", typeIconBg)}>
                                      <Icon name={typeIcon} size={20} />
                                    </div>
                                    <span className={cn("shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium", acc.status === "CLOSED" ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500" : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400")}>{acc.status}</span>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{acc.address}</p>
                                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">NMI: {acc.nmi}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3">
                                  <span className={cn("rounded-lg px-2 py-0.5 text-[11px] font-medium", typeIconBg)}>{acc.type}</span>
                                  <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-slate-600/40 dark:text-slate-400">{acc.fuel}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100 dark:border-white/[0.06] dark:bg-white/[0.04]">
                                  <div className="bg-white/90 px-4 py-3 dark:bg-white/[0.06]">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Balance</p>
                                    <p className={cn("mt-0.5 text-sm font-semibold", balancePillGreen ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300")}>{acc.balance}</p>
                                  </div>
                                  <div className="bg-white/90 px-4 py-3 dark:bg-white/[0.06]">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Plan</p>
                                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-slate-100">{acc.plan ?? "—"}</p>
                                  </div>
                                  <div className="bg-white/90 px-4 py-3 dark:bg-white/[0.06]">
                                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Billing</p>
                                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-900 dark:text-slate-100">{acc.billing ?? "—"}</p>
                                  </div>
                                </div>
                                {sparkline.length > 0 && !acc.isClosed && (
                                  <div className="px-5 pt-4 pb-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Usage trend (kWh)</p>
                                      {trendPct && (
                                        <span className={cn("inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium", acc.billVsPreviousUp ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300")}>
                                          <Icon name={acc.billVsPreviousUp ? "trending_up" : "trending_down"} size={12} />{trendPct}
                                        </span>
                                      )}
                                    </div>
                                    <div className="h-16 w-full">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={sparkline.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 2, bottom: 0, left: 2 }}>
                                          <defs>
                                            <linearGradient id={`sparkGrad-${acc.nmi.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.3} />
                                              <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.02} />
                                            </linearGradient>
                                          </defs>
                                          <Area type="monotone" dataKey="v" stroke={CHART_TEAL} strokeWidth={1.5} fill={`url(#sparkGrad-${acc.nmi.replace(/\s/g, "")})`} dot={false} animationDuration={600} />
                                        </AreaChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/[0.06]">
                                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                                    <span className="flex items-center gap-1"><Icon name="calendar_today" size={12} />{acc.commenced ?? "—"}</span>
                                    {acc.billingTo && <span className="flex items-center gap-1"><Icon name="receipt_long" size={12} />{acc.billingTo}</span>}
                                  </div>
                                  {acc.bestOffer && !acc.isClosed && (
                                    <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", acc.bestOffer === "Currently on best" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" : acc.bestOffer === "Review recommended" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" : "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400")}>{acc.bestOffer}</span>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                      )}
                    </section>
                  </TabsContent>

                  {/* ──── Insights Tab ──── */}
                  <TabsContent value="insights" className="mt-0">
                    <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                      {[
                        { icon: "trending_up" as const, label: "Usage Trend", value: "↑ 12.3% over 12 months", color: "#EF4444" },
                        { icon: "payments" as const, label: "Avg Monthly Bill", value: "$1,416/month", color: "#0091BF" },
                        { icon: "star" as const, label: "Payment Score", value: "88/100 — Good", color: "#F59E0B" },
                        { icon: "shield" as const, label: "Risk Level", value: "Medium", color: "#864EAD" },
                      ].map((badge) => (
                        <Card key={badge.label} className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                          <CardContent className="flex items-start gap-3 p-4 pt-4">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${badge.color}18` }}>
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

                    {/* Adora summary */}
                    <Card className={cn("mb-3 overflow-hidden border border-[#00D2A2]/20 dark:border-[#00D2A2]/15", GLASS_CARD_LIGHT, GLASS_CARD_DARK, "shadow-[0_0_30px_rgba(0,210,162,0.08)]")}>
                      <CardContent className="p-4 pt-4">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <Image src="/Adora.svg" alt="Adora" width={80} height={36} className="h-6 w-auto" />
                            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">Account Summary</h3>
                          </div>
                          <Badge className="border-[#00D2A2]/40 bg-[#00D2A2]/10 text-xs font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">Auto-generated</Badge>
                        </div>
                        <div className="rounded-lg border border-orange-300 p-3 dark:border-orange-500/40">
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                            QB00171824 is a <strong className="text-gray-900 dark:text-slate-100">high-value commercial customer</strong> with <strong className="text-gray-900 dark:text-slate-100">strong payment reliability</strong>. Energy consumption is <strong className="text-gray-900 dark:text-slate-100">trending upward +12.3%</strong>, with demand charges representing 24% of total costs. Contract expires 30 Jun 2025. <strong className="text-gray-900 dark:text-slate-100">Recommended:</strong> Review demand tariff, initiate contract renewal, assess solar/battery for peak demand reduction.
                          </p>
                        </div>
                        <button type="button" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-orange-500">
                          <Image src="/AdoraDot.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                          Ask Adora
                        </button>
                      </CardContent>
                    </Card>

                    {/* Charts row 1 */}
                    <div className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                      <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                        <CardContent className="p-5 pt-5">
                          <div className="mb-4 flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Energy Usage Trend</h3>
                              <p className="text-xs text-gray-500 dark:text-slate-500">kWh consumption & cost — 12 month view</p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300"><Icon name="trending_up" size={14} /> 12.3%</span>
                          </div>
                          <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={INSIGHT_USAGE_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="gInsightKwhLM" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00C1FF" stopOpacity={0.15} />
                                    <stop offset="100%" stopColor="#00C1FF" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Area yAxisId="left" type="monotone" dataKey="kwh" stroke="#0091BF" fill="url(#gInsightKwhLM)" strokeWidth={2} name="Usage (kWh)" />
                                <Bar yAxisId="right" dataKey="cost" fill="#E8EBED" radius={[4, 4, 0, 0]} name="Cost ($)" barSize={20} />
                              </ComposedChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                        <CardContent className="p-5 pt-5">
                          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100">Cost Breakdown</h3>
                          <div className="flex justify-center">
                            <ResponsiveContainer width="100%" height={170}>
                              <PieChart>
                                <Pie data={COST_BREAKDOWN} cx="50%" cy="50%" innerRadius={45} outerRadius={72} dataKey="value" stroke="none">
                                  {COST_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                            {COST_BREAKDOWN.map((c) => (
                              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                                <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
                                <span className="text-gray-600 dark:text-slate-400">{c.name}</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">{c.value}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Charts row 2 */}
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
                          <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100">Account Health</h3>
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

                    {/* Charts row 3 */}
                    <div className="mb-3 grid gap-3 lg:grid-cols-[2fr_1fr]">
                      <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                        <CardContent className="p-5 pt-5">
                          <div className="mb-4 flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Payment History</h3>
                              <p className="text-xs text-gray-500 dark:text-slate-500">12 month payment record — 10/12 on time</p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">83.3% on-time</span>
                          </div>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={PAYMENT_HISTORY} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar dataKey="paid" name="Amount Paid ($)" radius={[5, 5, 0, 0]}>
                                  {PAYMENT_HISTORY.map((entry, i) => <Cell key={i} fill={entry.onTime ? "#3BB89A" : "#FF5E00"} opacity={0.8} />)}
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

                    {/* Bill Forecast */}
                    <Card className={cn("mb-3 overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                      <CardContent className="p-5 pt-5">
                        <div className="mb-4 flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Bill Forecast</h3>
                            <p className="text-xs text-gray-500 dark:text-slate-500">Predicted billing for next 4 months</p>
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">Predictive</span>
                        </div>
                        <div className="h-52 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={COMBINED_FORECAST} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                              <defs>
                                <linearGradient id="gForecastLM" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#B368E7" stopOpacity={0.15} />
                                  <stop offset="100%" stopColor="#B368E7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gActualFcLM" x1="0" y1="0" x2="0" y2="1">
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
                              <Area type="monotone" dataKey="actual" stroke="#0091BF" fill="url(#gActualFcLM)" strokeWidth={2} name="Actual ($)" connectNulls={false} />
                              <Line type="monotone" dataKey="forecast" stroke="#B368E7" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 4, fill: "#B368E7", stroke: "white", strokeWidth: 2 }} name="Forecast ($)" connectNulls={false} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Bottom stats */}
                    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                      {[
                        { num: "$17,997", label: "Total Billed (12mo)", change: "↑ 12.3% vs prior year", changeColor: "text-red-600 dark:text-red-400" },
                        { num: "48,320", label: "kWh Total Usage", change: "↑ 12.3% vs prior year", changeColor: "text-red-600 dark:text-red-400" },
                        { num: "6.2", label: "Avg Days Late", change: "↓ from 8.4 days", changeColor: "text-emerald-600 dark:text-emerald-400" },
                        { num: "2.4", label: "Years as Customer", change: "Since Nov 2022", changeColor: "text-[#0091BF] dark:text-[#00C1FF]" },
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

                  {/* ──── Bill Compare Tab ──── */}
                  <TabsContent value="bill-compare" className="mt-0">
                    <div className="rounded-density-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
                      <p>Bill comparison for Large Market accounts — coming soon.</p>
                    </div>
                  </TabsContent>

                  {/* ──── History Tab ──── */}
                  <TabsContent value="history" className="mt-0">
                    <div className="rounded-density-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-sm">
                      <p>History content would go here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* ────── Right control panel ────── */}
            <aside className={cn("shrink-0 overflow-hidden py-4 pr-3 transition-[width,padding] duration-300 ease-in-out", controlPanelOpen ? "w-[306px]" : "w-0 pr-0")}>
              <div className={cn("flex h-full min-w-[290px] flex-col overflow-hidden rounded-2xl", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                <div className="flex flex-1 flex-col overflow-y-auto">
                  <div className="flex items-center gap-1 px-3 pt-3 pb-2">
                    <div className="flex flex-1 gap-1">
                      {PANEL_TABS.map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActivePanelTab(tab)}
                          className={cn(
                            "whitespace-nowrap text-[11px] font-medium transition-all",
                            tab === "Adora"
                              ? cn("p-0", activePanelTab === tab ? "opacity-100" : "opacity-50 hover:opacity-80")
                              : cn("rounded-md px-2 py-1", activePanelTab === tab ? "bg-gray-100 text-[#2C365D] dark:bg-white/[0.1] dark:text-[#00D2A2]" : "text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400")
                          )}
                        >
                          {tab === "Adora" ? <Image src="/AdoraTab.svg" alt="Adora" width={72} height={24} className="h-6 w-auto" /> : tab}
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setControlPanelOpen(false)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-slate-300" aria-label="Close control panel">
                      <Icon name="right_panel_close" size={16} />
                    </button>
                  </div>

                  {/* Adora panel */}
                  {activePanelTab === "Adora" && (
                    <div className="flex flex-1 flex-col overflow-y-auto px-3.5 py-3.5">
                      <span className="mb-3 text-sm font-bold tracking-tight text-gray-900 dark:text-slate-100">Account Summary</span>
                      <Badge className="mb-3 w-fit border-[#00D2A2]/40 bg-[#00D2A2]/10 text-[10px] font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">Auto-generated</Badge>
                      <div className="rounded-xl border border-orange-300/80 p-3 dark:border-orange-500/40">
                        {(adoraPhase === "idle" || adoraPhase === "thinking") && (
                          <div className="flex items-center gap-2.5 py-1">
                            <div className="flex gap-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "0ms" }} />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "150ms" }} />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-xs text-gray-500 dark:text-slate-400">Adora is analysing...</span>
                          </div>
                        )}
                        {(adoraPhase === "typing" || adoraPhase === "done") && (
                          <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                            {renderAdoraSegments(adoraPhase === "done" ? ADORA_TOTAL_CHARS : adoraCharCount)}
                            {adoraPhase === "typing" && <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-orange-400 align-middle" />}
                          </p>
                        )}
                      </div>
                      {adoraPhase === "done" && (
                        <button type="button" className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-orange-500">
                          <Image src="/AdoraDot.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                          Ask Adora
                        </button>
                      )}
                    </div>
                  )}

                  {/* Control Panel */}
                  {activePanelTab === "Control Panel" && (
                    <>
                      <div className="flex gap-2 border-b border-gray-100/60 p-3.5 dark:border-white/[0.04]">
                        {([["check_box", "Tasks", true], ["add_comment", "New Interaction", false], ["filter_alt", "Filter", false], ["layers", "Work Items", false]] as const).map(([icon, label, active]) => (
                          <button key={icon} type="button" aria-label={label} className={cn("flex flex-1 items-center justify-center rounded-xl border px-1 py-2 backdrop-blur-lg transition-all hover:-translate-y-0.5", active ? "border-[#00D2A2]/40 bg-[#00D2A2]/10 text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]" : "border-gray-200/60 bg-white/60 text-gray-500 hover:border-[#4EEECA]/30 hover:bg-[#4EEECA]/8 hover:text-[#298268] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:hover:border-[#4EEECA]/20 dark:hover:bg-[#4EEECA]/10 dark:hover:text-[#4EEECA]")}>
                            <Icon name={icon} size={17} />
                          </button>
                        ))}
                      </div>
                      <div className="px-3.5 pt-3.5">
                        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#2C365D]/30 bg-[#2C365D]/4 px-3 py-2.5 text-[13px] font-semibold text-[#2C365D] transition-all hover:-translate-y-0.5 hover:border-[#2C365D] hover:bg-[#2C365D]/8 hover:shadow-md dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-white/40 dark:hover:bg-white/[0.06]">
                          <Icon name="add" size={16} />
                          Create new task
                          <span className="rounded bg-[#2C365D] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white dark:bg-[#00D2A2] dark:text-gray-900">New</span>
                        </button>
                      </div>
                      <div className="flex-1 px-2 py-1.5">
                        {TASK_CATEGORIES.map((tc) => (
                          <button key={tc.name} type="button" className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-white/[0.04]">
                            <Icon name={tc.icon} size={17} className="shrink-0 text-gray-400 dark:text-slate-500" />
                            <span className="flex-1 text-left text-[13px] font-medium text-gray-700 dark:text-slate-300">{tc.name}</span>
                            <span className={cn("min-w-[28px] rounded-full px-2 py-0.5 text-center font-mono text-[11.5px] font-medium", tc.count === null ? "bg-gray-100/60 text-gray-400 dark:bg-white/[0.04] dark:text-slate-600" : tc.hot ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" : "bg-gray-100/60 text-gray-500 dark:bg-white/[0.06] dark:text-slate-400")}>{tc.count ?? "—"}</span>
                            <Icon name="chevron_right" size={15} className="shrink-0 text-gray-300 dark:text-slate-600" />
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {/* X-Sell panel */}
                  {activePanelTab === "X-Sell" && (
                    <div className="flex-1 space-y-5 overflow-y-auto px-3.5 py-3.5">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Active Services</p>
                        <div className="space-y-2">
                          {[
                            { icon: "bolt" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Electricity", provider: "EnergyCo", plan: "Business Large Plan", status: "Connected" },
                          ].map((s) => (
                            <div key={s.service} className={cn("flex w-full items-start gap-3 rounded-xl p-3", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}><Icon name={s.icon} size={16} /></div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{s.status}</span>
                                </div>
                                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.provider}</p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.plan}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Opportunities</p>
                        <div className="space-y-2">
                          {[
                            { icon: "solar_power" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", headline: "Solar & Battery Assessment", sub: "Estimated 18% demand reduction" },
                            { icon: "electric_meter" as const, iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300", headline: "Demand Management Review", sub: "Current demand charges: $4,320/yr" },
                            { icon: "description" as const, iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300", headline: "Contract Renewal", sub: "Expires 30 Jun 2025" },
                          ].map((s) => (
                            <button key={s.headline} type="button" className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}><Icon name={s.icon} size={16} /></div>
                              <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.headline}</p>
                                <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.sub}</p>
                              </div>
                              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}
