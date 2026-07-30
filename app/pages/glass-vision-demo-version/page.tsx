"use client";

import React, { Suspense, useState, useEffect, useCallback, useRef } from "react";
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
import Button from "@/components/Button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { secondaryColors } from "@/lib/tokens/colors";

/* ────────── Chart data & helpers ────────── */

const CHART_MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"] as const;

type BillVsPreviousPoint = { month: string; current: number; previous: number };
type UsagePoint = { month: string; usage: number; highlight?: boolean };
type LoadDisaggPoint = { category: string; kWh: number; fill: string };

const USAGE_HIGHLIGHT = "#F97316";

/** Demo timeline — call on 3 Jul 2026; customer is querying the bill issued 1 Jul for May–Jun period */
const DEMO_CALL_DATE = "3 July 2026";
const DEMO_CALL_TIME = "01:30 pm";
const DEMO_CALL_TIMESTAMP = "03/07/2026, 01:30 PM";
const DEMO_CALL_SUMMARY_TIMESTAMP = "03/07/2026, 01:31 PM";
const DEMO_ANALYSIS_MESSAGE = "Please give me a minute while I run the high bill analysis.";
const DEMO_ANALYSIS_TIMESTAMP = "03/07/2026, 01:30 PM";
const DEMO_BILL_PERIOD = "31 May – 29 Jun 2026";
const DEMO_BILL_PERIOD_RANGE = "31/05/2026 to 29/06/2026";
const DEMO_PLAN_CHANGE_DATE = "06/06/2026";
const DEMO_INVOICE_ISSUED = "01 Jul 2026";
const DEMO_INVOICE_DUE = "22 Jul 2026";
const DEMO_BILLED_TO = "Billed To 29 Jun 2026";
const DEMO_NEXT_READ = "17 Aug 2026";

const BASE_LOAD_DISAGG: LoadDisaggPoint[] = [
  { category: "HVAC", kWh: 148, fill: "#6366F1" },
  { category: "Hot Water", kWh: 98, fill: "#F59E0B" },
  { category: "Lighting", kWh: 64, fill: "#06B6D4" },
  { category: "Appliances", kWh: 52, fill: "#00D2A2" },
  { category: "Cooking", kWh: 28, fill: "#EC4899" },
  { category: "Other", kWh: 22, fill: "#9CA3AF" },
];

function sparklineToUsageData(values: number[]): UsagePoint[] {
  return CHART_MONTHS.map((month, index) => ({
    month,
    usage: values[index] ?? values[values.length - 1],
  }));
}

function scaleLoadDisagg(totalKWh: number): LoadDisaggPoint[] {
  const baseTotal = BASE_LOAD_DISAGG.reduce((sum, item) => sum + item.kWh, 0);
  const factor = totalKWh / baseTotal;
  return BASE_LOAD_DISAGG.map((item) => ({
    ...item,
    kWh: Math.max(1, Math.round(item.kWh * factor)),
  }));
}

/** Officer — stable usage then +22% spike on current bill period (338 → 412 kWh) */
const OFFICER_USAGE: UsagePoint[] = [
  { month: "Nov", usage: 305 },
  { month: "Dec", usage: 298 },
  { month: "Jan", usage: 312 },
  { month: "Feb", usage: 305 },
  { month: "Mar", usage: 318 },
  { month: "Apr", usage: 328 },
  { month: "May", usage: 338 },
  { month: "Jun", usage: 412, highlight: true },
];

/** Officer — demo account: $140.74 bill, +22% vs $115.42 previous (338 → 412 kWh) */
const OFFICER_BILL_VS_PREVIOUS: BillVsPreviousPoint[] = [
  { month: "Nov", current: 105, previous: 103 },
  { month: "Dec", current: 104, previous: 104 },
  { month: "Jan", current: 106, previous: 105 },
  { month: "Feb", current: 105, previous: 106 },
  { month: "Mar", current: 108, previous: 107 },
  { month: "Apr", current: 110, previous: 108 },
  { month: "May", current: 115, previous: 112 },
  { month: "Jun", current: 141, previous: 115 },
];

/** Torquay — $68.20 bill, 8% down vs ~$74 previous */
const TORQUAY_BILL_VS_PREVIOUS: BillVsPreviousPoint[] = [
  { month: "Nov", current: 72, previous: 70 },
  { month: "Dec", current: 74, previous: 72 },
  { month: "Jan", current: 73, previous: 74 },
  { month: "Feb", current: 75, previous: 73 },
  { month: "Mar", current: 74, previous: 75 },
  { month: "Apr", current: 76, previous: 74 },
  { month: "May", current: 75, previous: 74 },
  { month: "Jun", current: 68, previous: 74 },
];

/** Berwick — $92.15 bill, 15% up vs ~$80 previous */
const BERWICK_BILL_VS_PREVIOUS: BillVsPreviousPoint[] = [
  { month: "Nov", current: 78, previous: 76 },
  { month: "Dec", current: 80, previous: 78 },
  { month: "Jan", current: 79, previous: 80 },
  { month: "Feb", current: 81, previous: 79 },
  { month: "Mar", current: 82, previous: 80 },
  { month: "Apr", current: 84, previous: 81 },
  { month: "May", current: 85, previous: 82 },
  { month: "Jun", current: 92, previous: 80 },
];

type AccountChartData = {
  billVsPrevious: BillVsPreviousPoint[];
  usage: UsagePoint[];
  loadDisagg: LoadDisaggPoint[];
};

const ACCOUNT_CHART_DATA: Record<string, AccountChartData> = {
  "LOT 83 3 SNOW WAY, OFFICER, VIC 3809": {
    billVsPrevious: OFFICER_BILL_VS_PREVIOUS,
    usage: OFFICER_USAGE,
    loadDisagg: scaleLoadDisagg(412),
  },
  "18 OCEAN VIEW DR, TORQUAY, VIC 3228": {
    billVsPrevious: TORQUAY_BILL_VS_PREVIOUS,
    usage: sparklineToUsageData([95, 88, 92, 85, 78, 74, 72, 68]),
    loadDisagg: scaleLoadDisagg(120),
  },
  "7/22 MAIN ST, BERWICK, VIC 3806": {
    billVsPrevious: BERWICK_BILL_VS_PREVIOUS,
    usage: sparklineToUsageData([185, 192, 178, 185, 198, 215, 228, 210]),
    loadDisagg: scaleLoadDisagg(228),
  },
};

function getAccountChartData(address: string): AccountChartData {
  return (
    ACCOUNT_CHART_DATA[address] ?? {
      billVsPrevious: OFFICER_BILL_VS_PREVIOUS,
      usage: OFFICER_USAGE,
      loadDisagg: scaleLoadDisagg(412),
    }
  );
}

const INSIGHT_USAGE_DATA = [
  { month: "Jul", kwh: 305, cost: 106 },
  { month: "Aug", kwh: 298, cost: 101 },
  { month: "Sep", kwh: 312, cost: 105 },
  { month: "Oct", kwh: 318, cost: 108 },
  { month: "Nov", kwh: 305, cost: 104 },
  { month: "Dec", kwh: 298, cost: 101 },
  { month: "Jan", kwh: 312, cost: 105 },
  { month: "Feb", kwh: 305, cost: 104 },
  { month: "Mar", kwh: 318, cost: 108 },
  { month: "Apr", kwh: 328, cost: 112 },
  { month: "May", kwh: 338, cost: 115 },
  { month: "Jun", kwh: 412, cost: 141 },
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
  { month: "Jul", paid: 106, onTime: true },
  { month: "Aug", paid: 101, onTime: true },
  { month: "Sep", paid: 105, onTime: true },
  { month: "Oct", paid: 108, onTime: true },
  { month: "Nov", paid: 104, onTime: true },
  { month: "Dec", paid: 101, onTime: true },
  { month: "Jan", paid: 105, onTime: false },
  { month: "Feb", paid: 104, onTime: true },
  { month: "Mar", paid: 108, onTime: true },
  { month: "Apr", paid: 112, onTime: true },
  { month: "May", paid: 115, onTime: true },
  { month: "Jun", paid: 141, onTime: true },
];

const INTERACTION_DATA = [
  { month: "Jan", calls: 2, emails: 6, web: 7 },
  { month: "Feb", calls: 1, emails: 3, web: 11 },
  { month: "Mar", calls: 2, emails: 4, web: 8 },
  { month: "Apr", calls: 1, emails: 5, web: 9 },
  { month: "May", calls: 3, emails: 2, web: 6 },
  { month: "Jun", calls: 4, emails: 4, web: 5 },
];

const COMBINED_FORECAST = [
  ...INSIGHT_USAGE_DATA.slice(-4).map((d) => ({ month: d.month, actual: d.cost, forecast: null as number | null, low: null as number | null, high: null as number | null })),
  { month: "Jul", actual: null as number | null, forecast: 22, low: 15, high: 30 },
  { month: "Aug", actual: null, forecast: 35, low: 25, high: 48 },
  { month: "Sep", actual: null, forecast: 52, low: 40, high: 65 },
  { month: "Oct", actual: null, forecast: 78, low: 60, high: 95 },
];

const PANEL_TABS = ["Adora", "Control Panel", "X-Sell"] as const;

/* ────────── Bill Compare data ────────── */
const BILL_COMPARE_BILLS = [
  {
    id: "bill-1",
    label: "Bill 1",
    period: DEMO_BILL_PERIOD,
    status: "Paid" as const,
    adoraColor: "#F97316",
    adoraSummary:
      `Invoice 33066423 for new charges of $140.74 (${DEMO_BILL_PERIOD_RANGE}, 30 days). Usage increased 22% compared to the previous invoice. Plan changed to HomeDeal Extra on ${DEMO_PLAN_CHANGE_DATE}.`,
  },
  {
    id: "bill-2",
    label: "Bill 2",
    period: "31 Apr – 29 May 2026",
    status: "Paid" as const,
    adoraColor: "#EF4444",
    adoraSummary: "Previous bill received a $75.00 government relief credit.",
  },
  {
    id: "bill-3",
    label: "Bill 3",
    period: "31 Mar – 29 Apr 2026",
    status: "Paid" as const,
    adoraColor: "#EF4444",
    adoraSummary: "Baseline period before plan change to HomeDeal Extra.",
  },
];

const BILL_COMPARE_ROWS: { label: string; values: string[]; detail?: string }[] = [
  { label: "Invoice issue date", values: [DEMO_INVOICE_ISSUED, "01 Jun 2026", "01 May 2026"] },
  { label: "Energy plan", values: ["HomeDeal Extra", "HomeDeal Extra", "Home Saver"], detail: `Plan changed to HomeDeal Extra on ${DEMO_PLAN_CHANGE_DATE}` },
  { label: "Invoice amount", values: ["$140.74", "$115.42", "$108.90"] },
  { label: "Allocated amount", values: ["Fully Allocated", "Fully Allocated", "Fully Allocated"] },
  { label: "Total Usage", values: ["412 kWh", "338 kWh", "321 kWh"] },
  { label: "Average Daily Usage", values: ["13.7 kWh", "11.3 kWh", "10.7 kWh"] },
  { label: "Compared to previous invoice", values: ["+22%", "−6.4%", "+3.1%"] },
  { label: "General usage charge", values: ["$98.40", "$81.20", "$76.50"] },
  { label: "Daily supply charge", values: ["$42.34", "$42.34", "$42.34"] },
  { label: "Total new charges", values: ["$140.74", "$115.42", "$108.90"] },
  { label: "GST", values: ["$12.79", "$10.49", "$9.90"] },
  { label: "Previous Balance", values: ["−$69.14 CR", "$0.00", "−$12.50 CR"] },
  { label: "Government relief credit", values: ["—", "−$75.00", "−$75.00"], detail: "No government relief credit on current bill" },
  { label: "Hardship credit", values: ["−$100.00", "—", "—"] },
  { label: "Carried forward credit", values: ["−$69.14 CR", "−$45.20 CR", "−$12.50 CR"] },
];

const BROADBAND_PLANS = [
  {
    name: "Galileo",
    logo: "/broadband/Galileo.svg",
    cost: "$68/mth",
    speed: "25 Mbps",
    data: "Unlimited",
    description: "A solid all-rounder for everyday use. Perfect for emails, streaming your favourite shows, and keeping up with the news.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Luminary",
    logo: "/broadband/Luminary.svg",
    cost: "$98/mth",
    speed: "100 Mbps",
    data: "Unlimited",
    description: "Made for households that love to stream, game, and stay connected. Fast, reliable, and built to handle multiple devices at once — no more buffering battles.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "3Portals",
    logo: "/broadband/3Portals.svg",
    cost: "$75/mth",
    speed: "50 Mbps",
    data: "Unlimited",
    description: "A great mix of speed and value for busy homes. Stream, scroll, and video call without missing a beat.",
    features: ["No contract", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Ollio",
    logo: "/broadband/Ollio.svg",
    cost: "$120/mth",
    speed: "240 Mbps",
    data: "Unlimited",
    description: "Premium speed for homes that do it all. Stream in 4K, game online, jump on video calls, and still have bandwidth to spare.",
    features: ["$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Photon",
    logo: null,
    icon: "bolt",
    iconBg: "bg-amber-500",
    cost: "$55/mth",
    speed: "12 Mbps",
    data: "500 GB",
    description: "An affordable entry plan for light users. Browse, email, and stream in SD without breaking the bank.",
    features: ["No contract", "$0 Setup Fee"],
  },
  {
    name: "Vertex",
    logo: null,
    icon: "cell_tower",
    iconBg: "bg-sky-600",
    cost: "$149/mth",
    speed: "1000 Mbps",
    data: "Unlimited",
    description: "Ultra-fast fibre for power users and large households. Download, upload, and stream simultaneously without limits.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
];

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

function CallInProgressLabel() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDotCount((count) => (count + 1) % 4);
    }, 450);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      Call in progress
      <span className="inline-block w-[1.1em] text-left" aria-hidden="true">
        {".".repeat(dotCount)}
      </span>
    </>
  );
}

function AccountUsageBarChart({
  data,
  gradientId,
}: {
  data: UsagePoint[];
  gradientId: string;
}) {
  const maxUsage = Math.max(...data.map((point) => point.usage));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
          barCategoryGap="25%"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.85} />
              <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
          <YAxis
            domain={[0, Math.ceil(maxUsage / 50) * 50 + 50]}
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,210,162,0.06)", radius: 6 }} />
          <Bar
            dataKey="usage"
            name="Usage (kWh)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          >
            {data.map((entry) => (
              <Cell
                key={entry.month}
                fill={entry.highlight ? USAGE_HIGHLIGHT : `url(#${gradientId})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function AccountUsageChartLegend({
  data,
  billVsPrevious,
  billVsPreviousUp,
}: {
  data: UsagePoint[];
  billVsPrevious?: string;
  billVsPreviousUp?: boolean;
}) {
  const hasHighlight = data.some((point) => point.highlight);

  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: CHART_TEAL }} />
          Monthly kWh
        </span>
        {hasHighlight && (
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: USAGE_HIGHLIGHT }} />
            Current bill period
          </span>
        )}
      </div>
      {billVsPreviousUp && billVsPrevious && billVsPrevious !== "—" ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300">
          <Icon name="trending_up" size={12} />
          {billVsPrevious} vs previous invoice
        </span>
      ) : null}
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
  "dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border-white/[0.08] dark:shadow-none";
const GLASS_CARD_DARK =
  "dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border-white/[0.12] dark:shadow-none";
const GLOW_ACCENT_DARK = "";

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
  accNumber?: string;
  type: "Residential" | "Commercial" | "Small Business";
  fuel: string;
  status: string;
  balance: string;
  isCredit: boolean;
  tags?: { label: string; variant: "hardship" | "government" }[];
  plan?: string;
  planRef?: string;
  bestOffer?: string;
  billing?: string;
  billingTo?: string;
  commenced?: string;
  scheduledRead?: string;
  billPeriod?: string;
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

const AGENT = {
  name: "Effie Fletcher",
  initials: "EF",
};

const CUSTOMER = {
  name: "Jason Mills",
  initials: "JM",
  cn: "31714583",
  region: "Victoria",
  dob: "2 Aug 1964",
  age: 61,
  email: "noreply3@tally-group.com.au",
  phone: "0417000012",
  preference: "Contact via Phone",
  marketing: "No Marketing",
  identity: "Medicare",
  payerRating: "Inconsistent",
};

const ACCOUNTS: AccountRecord[] = [
  {
    address: "LOT 83 3 SNOW WAY, OFFICER, VIC 3809",
    nmi: "63060244291",
    accNumber: "104099258",
    type: "Residential",
    fuel: "Electricity",
    status: "OPEN",
    balance: "−$69.14 Credit",
    isCredit: true,
    tags: [
      { label: "Hardship", variant: "hardship" },
      { label: "Government Assist", variant: "government" },
    ],
    plan: "HomeDeal Extra",
    bestOffer: "Currently on best offer",
    billing: "MONTHLY Billing",
    billingTo: DEMO_BILLED_TO,
    scheduledRead: DEMO_NEXT_READ,
    billPeriod: DEMO_BILL_PERIOD,
    commenced: "14 Mar 2019",
    invoiceAmount: "$140.74",
    allocated: "Fully Allocated",
    posted: DEMO_INVOICE_ISSUED,
    due: DEMO_INVOICE_DUE,
    charges: "$140.74",
    washup: "No days washed up",
    billVsPrevious: "22%",
    billVsPreviousUp: true,
  },
  {
    address: "18 OCEAN VIEW DR, TORQUAY, VIC 3228",
    nmi: "63058847231",
    accNumber: "104087412",
    type: "Residential",
    fuel: "Electricity",
    status: "OPEN",
    balance: "−$24.50 Credit",
    isCredit: true,
    plan: "Home Saver",
    bestOffer: "Currently on best offer",
    billing: "MONTHLY Billing",
    billingTo: "Billed To 15 Jun 2026",
    scheduledRead: "8 Aug 2026",
    billPeriod: "16 May – 15 Jun 2026",
    commenced: "02 Sep 2021",
    invoiceAmount: "$68.20",
    allocated: "Fully Allocated",
    posted: "18 Jun 2026",
    due: "08 Jul 2026",
    charges: "$68.20",
    washup: "No days washed up",
    billVsPrevious: "8%",
    billVsPreviousUp: false,
  },
  {
    address: "7/22 MAIN ST, BERWICK, VIC 3806",
    nmi: "63051193847",
    accNumber: "104052891",
    type: "Residential",
    fuel: "Electricity + Gas",
    status: "OPEN",
    balance: "$92.15",
    isCredit: false,
    tags: [{ label: "Government Assist", variant: "government" }],
    plan: "HomeDeal Basic",
    bestOffer: "Better offer available",
    billing: "MONTHLY Billing",
    billingTo: "Billed To 22 Jun 2026",
    scheduledRead: "14 Aug 2026",
    billPeriod: "23 May – 22 Jun 2026",
    commenced: "11 Jun 2017",
    invoiceAmount: "$92.15",
    allocated: "Partially Allocated",
    posted: "24 Jun 2026",
    due: "13 Jul 2026",
    charges: "$92.15",
    washup: "1 day",
    billVsPrevious: "15%",
    billVsPreviousUp: true,
  },
];

const ACCOUNT_USAGE_SPARKLINES: Record<string, number[]> = {
  "LOT 83 3 SNOW WAY, OFFICER, VIC 3809": [305, 298, 312, 305, 318, 328, 338, 412],
  "18 OCEAN VIEW DR, TORQUAY, VIC 3228": [95, 88, 92, 85, 78, 74, 72, 68],
  "7/22 MAIN ST, BERWICK, VIC 3806": [185, 192, 178, 185, 198, 215, 228, 210],
};

const CUSTOMER_SUMMARY =
  `Invoice 33066423 for new charges of $140.74 (${DEMO_BILL_PERIOD_RANGE}, 30 days). The previous bill received a $75.00 government relief credit. Usage increased 22% compared to the previous invoice. Plan changed to HomeDeal Extra on ${DEMO_PLAN_CHANGE_DATE}, which will also affect future bills. A $100.00 hardship credit was applied to this bill's balance. Meter readings for this period were based on actual usage. The account has a solar system with a feed-in tariff.`;

const ADORA_OVERVIEW_SEGMENTS = [
  { text: "Invoice ", bold: false },
  { text: "33066423", bold: true },
  { text: " for new charges of ", bold: false },
  { text: "$140.74", bold: true },
  { text: ` (${DEMO_BILL_PERIOD_RANGE}, 30 days). The previous bill received a `, bold: false },
  { text: "$75.00 government relief credit", bold: true },
  { text: ". Usage increased ", bold: false },
  { text: "22%", bold: true },
  { text: " compared to the previous invoice. Plan changed to ", bold: false },
  { text: "HomeDeal Extra", bold: true },
  { text: ` on ${DEMO_PLAN_CHANGE_DATE}, which will also affect future bills. A `, bold: false },
  { text: "$100.00 hardship credit", bold: true },
  { text: " was applied to this bill's balance. Meter readings for this period were based on actual usage. The account has a ", bold: false },
  { text: "solar system with a feed-in tariff", bold: true },
  { text: ".", bold: false },
];

function AdoraSummaryText({ className }: { className?: string }) {
  return (
    <p className={className}>
      {ADORA_OVERVIEW_SEGMENTS.map((segment, index) =>
        segment.bold ? (
          <strong key={index} className="text-gray-900 dark:text-slate-100">
            {segment.text}
          </strong>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </p>
  );
}

const ADORA_TOTAL_CHARS = ADORA_OVERVIEW_SEGMENTS.reduce((sum, s) => sum + s.text.length, 0);

type CallDemoStep = "waiting" | "analysing" | "showInsights" | "complete";

const PRIMARY_ACCOUNT_ADDRESS = "LOT 83 3 SNOW WAY, OFFICER, VIC 3809";

const CALL_DEMO_SECTIONS = [
  {
    title: "High Bill Suggestions:",
    items: [
      `Invoice 33066423 for new charges of $140.74 (${DEMO_BILL_PERIOD_RANGE}, 30 days)`,
      "Previous bill received a $75.00 government relief credit",
      "Usage increased 22% compared to the previous invoice",
      `Plan changed to HomeDeal Extra on ${DEMO_PLAN_CHANGE_DATE} (also affects future bills)`,
    ],
  },
  {
    title: "Additional Info:",
    items: ["A $100.00 hardship credit was applied to this bill's balance"],
  },
  {
    title: "Supplementary Context:",
    items: [
      "Meter readings for this period were based on actual usage",
      "The account has a solar system with a feed-in tariff",
    ],
  },
] as const;

const CALL_DEMO_SUMMARY =
  "Your recent bill is higher due to new charges of $140.74, a previous government relief credit of $75.00, a 22% increase in usage, and a plan change to HomeDeal Extra. A $100.00 hardship credit was applied to this bill's balance.";

const CALL_WRAP_NOTE_REF = "INT-20260703-0142";

const CALL_WRAP_SUMMARY_POINTS = [
  "Customer called regarding a higher-than-expected bill for invoice 33066423 ($140.74, 31 May – 29 Jun 2026).",
  "Explained that the previous bill included a $75.00 government relief credit not applied to the current invoice.",
  "Reviewed 22% usage increase compared to the previous billing period and plan change to HomeDeal Extra on 06/06/2026.",
  "Confirmed $100.00 hardship credit already applied to the current bill balance.",
  "Customer acknowledged the explanation; no further escalation required at this time.",
] as const;

const DEMO_ANALYSE_DELAY = 3500;

export default function GlassVisionPage() {
  return (
    <Suspense>
      <GlassVisionContent />
    </Suspense>
  );
}

function GlassVisionContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeNavId, setActiveNavId] = useState("customers");
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(searchParams.get("expanded") === "true");
  const [controlPanelOpen, setControlPanelOpen] = useState(true);
  const [activePanelTab, setActivePanelTab] = useState<(typeof PANEL_TABS)[number]>("Adora");
  const [adoraPhase, setAdoraPhase] = useState<"idle" | "thinking" | "typing" | "done">("idle");
  const [adoraCharCount, setAdoraCharCount] = useState(0);
  const [callDemoStep, setCallDemoStep] = useState<CallDemoStep>("waiting");
  const [callSummaryModalOpen, setCallSummaryModalOpen] = useState(false);
  const demoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [xSellView, setXSellView] = useState<string | null>(null);
  const [partnerLogo, setPartnerLogo] = useState<"energyco" | "sumo">("energyco");
  const [billCompareView, setBillCompareView] = useState<"table" | "chart">("table");
  const [serviceAddressView, setServiceAddressView] = useState<"list" | "card">("list");
  const [adoraSummaryVisible, setAdoraSummaryVisible] = useState(false);
  const [expandedBillRows, setExpandedBillRows] = useState<Set<string>>(new Set());
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);

  const toggleBillRow = useCallback((label: string) => {
    setExpandedBillRows((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  }, []);

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

  const clearDemoTimeout = useCallback(() => {
    if (demoTimeoutRef.current) {
      clearTimeout(demoTimeoutRef.current);
      demoTimeoutRef.current = null;
    }
  }, []);

  const resetCallDemo = useCallback(() => {
    clearDemoTimeout();
    setCallDemoStep("waiting");
    setSelectedAccountAddress(null);
  }, [clearDemoTimeout]);

  const advanceCallDemo = useCallback(() => {
    setCallDemoStep((step) => {
      if (step === "analysing" || step === "complete") return step;
      if (step === "waiting") return "analysing";
      if (step === "showInsights") return "complete";
      return step;
    });
  }, []);

  const adoraInsightsActive =
    callDemoStep === "analysing" ||
    callDemoStep === "showInsights" ||
    callDemoStep === "complete";
  const isCallDemoAnalysing = callDemoStep === "analysing";
  const callDemoInsightsVisible =
    callDemoStep === "showInsights" || callDemoStep === "complete";

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

  React.useEffect(() => {
    const floatingControls = document.querySelector(".fixed.bottom-6.right-6") as HTMLElement | null;
    if (floatingControls) floatingControls.style.display = "none";
    return () => {
      if (floatingControls) floatingControls.style.display = "";
    };
  }, []);

  useEffect(() => {
    if (callDemoStep !== "analysing") return;
    demoTimeoutRef.current = setTimeout(
      () => setCallDemoStep("showInsights"),
      DEMO_ANALYSE_DELAY
    );
    return clearDemoTimeout;
  }, [callDemoStep, clearDemoTimeout]);

  useEffect(() => {
    if (callDemoStep !== "showInsights") return;
    setSelectedAccountAddress(PRIMARY_ACCOUNT_ADDRESS);
    requestAnimationFrame(() => {
      const el = document.getElementById(`account-${PRIMARY_ACCOUNT_ADDRESS.replace(/\W/g, "-")}`);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [callDemoStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "r" || e.key === "R") {
        resetCallDemo();
        return;
      }

      if (e.key === " " || e.key === "ArrowRight") {
        if (isCallDemoAnalysing) return;
        e.preventDefault();
        advanceCallDemo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advanceCallDemo, resetCallDemo, isCallDemoAnalysing]);

  useEffect(() => {
    if (adoraPhase !== "typing") return;
    if (adoraCharCount >= ADORA_TOTAL_CHARS) {
      setAdoraPhase("done");
      return;
    }
    const t = setTimeout(() => setAdoraCharCount((c) => Math.min(c + 2, ADORA_TOTAL_CHARS)), 10);
    return () => clearTimeout(t);
  }, [adoraPhase, adoraCharCount]);

  const renderAdoraSegments = (charLimit: number) => {
    let remaining = charLimit;
    return ADORA_OVERVIEW_SEGMENTS.map((seg, i) => {
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
      style={{ backgroundColor: DARKEST_NAVY, "--tally-radius-lg": "24px" } as React.CSSProperties}
    >
      {/* Seamless chrome: header + nav as one dark block (no border between them) */}
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setPartnerLogo(partnerLogo === "energyco" ? "sumo" : "energyco")}
            className="flex items-center transition-opacity hover:opacity-80"
          >
            <Image
              src={partnerLogo === "energyco" ? "/EnergyCoLogo.png" : "/SumoLogo.png"}
              alt={partnerLogo === "energyco" ? "EnergyCo" : "Sumo"}
              width={620}
              height={120}
              className={cn("h-8 w-auto", partnerLogo === "sumo" && "mix-blend-screen")}
              priority
            />
          </button>
        </div>
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
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setControlPanelOpen(true);
              setActivePanelTab("Adora");
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-all",
              activePanelTab === "Adora" && controlPanelOpen && adoraInsightsActive
                ? "bg-orange-500 ring-2 ring-orange-300/40"
                : "bg-orange-400 hover:bg-orange-500"
            )}
          >
            <Image src="/AdoraDot.svg" alt="" width={16} height={16} className="h-4 w-4" />
            Adora
          </button>
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
                {AGENT.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-medium text-white">{AGENT.name}</span>
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
          <div className="relative shrink-0 border-t border-white/10 p-2 flex flex-col items-center gap-0.5">
            <button
              type="button"
              onClick={() => setDisplayOptionsOpen((v) => !v)}
              className={cn(
                "group flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2A2]/50",
                displayOptionsOpen && "bg-white/10 text-[#00D2A2]"
              )}
              aria-label="Display options"
              aria-expanded={displayOptionsOpen}
            >
              <Icon name="display_settings" size={20} />
            </button>
            {displayOptionsOpen && (
              <>
                <button
                  type="button"
                  className="fixed inset-0 z-40 cursor-default"
                  aria-label="Close display options"
                  onClick={() => setDisplayOptionsOpen(false)}
                />
                <div
                  className={cn(
                    "absolute bottom-0 left-full z-50 ml-3 w-56 rounded-xl border border-white/10 p-4 shadow-2xl",
                    GLASS_CARD_LIGHT,
                    GLASS_CARD_DARK
                  )}
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
                    <div className="border-t border-gray-200/80 pt-3 dark:border-white/10">
                      <button
                        type="button"
                        onClick={resetCallDemo}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200/80 bg-white/60 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]"
                      >
                        <Icon name="restart_alt" size={14} />
                        Reset call demo
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
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
              <span className="text-xs font-medium">{AGENT.initials}</span>
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
                          <AvatarFallback className="bg-transparent text-lg font-medium text-amber-950">{CUSTOMER.initials}</AvatarFallback>
                        </Avatar>
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                          <Icon name="check" size={10} className="text-white" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">{CUSTOMER.name}</h2>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{CUSTOMER.cn}</p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{CUSTOMER.region}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal details card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Personal details</p>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center gap-2">
                        <Icon name="calendar_today" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.dob}</span>
                        <Badge variant="secondary" className="ml-auto border-gray-200 bg-gray-100 text-[10px] text-gray-500 dark:border-white/10 dark:bg-white/10 dark:text-slate-400">{CUSTOMER.age}</Badge>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon name="mail" size={14} className="mt-0.5 shrink-0 text-gray-300 dark:text-slate-600" />
                        <span className="break-all font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="phone" size={14} className="text-gray-300 dark:text-slate-600" />
                        <span className="font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.phone}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Preference</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.preference}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Marketing</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.marketing}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-400 dark:text-slate-500">Identity</span>
                        <span className="font-medium text-gray-800 dark:text-slate-200">{CUSTOMER.identity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact history card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Contact history</p>
                    <div className="space-y-2.5 text-xs">
                      {[
                        { icon: "chat_bubble_outline" as const, label: "Created", date: "05 Apr 2008" },
                        { icon: "call" as const, label: "Last call", date: "18 Jun 2026" },
                        { icon: "description" as const, label: "Last note", date: "20 Jun 2026" },
                        { icon: "computer" as const, label: "Last web", date: "20 Jun 2026" },
                      ].map((row) => (
                        <div key={row.label} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon name={row.icon} size={14} className="text-gray-300 dark:text-slate-600" />
                            <span className="text-gray-400 dark:text-slate-500">{row.label}</span>
                          </div>
                          <span className="font-medium text-gray-800 dark:text-slate-200">{row.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payer rating card */}
                <Card className={cn("overflow-hidden border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10")}>
                  <CardContent className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Icon name="star" size={20} className="text-red-600 dark:text-red-400" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">Payer Rating</span>
                    </div>
                    <span className="text-sm font-semibold text-red-800 dark:text-red-200">{CUSTOMER.payerRating}</span>
                  </CardContent>
                </Card>

                {/* Payment methods card */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">Payment methods</p>
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Image src="/VISA.svg" alt="Visa" width={36} height={24} className="h-6 w-9 shrink-0 rounded" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-800 dark:text-slate-200">.... 1234</div>
                          <div className="text-[10px] text-gray-400 dark:text-slate-600">Exp 06/2027</div>
                        </div>
                        <Badge variant="secondary" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300">Default</Badge>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Image src="/MC.svg" alt="Mastercard" width={36} height={24} className="h-6 w-9 shrink-0 rounded" />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-800 dark:text-slate-200">.... 1234</div>
                          <div className="text-[10px] text-gray-400 dark:text-slate-600">Exp 06/2027</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-9 shrink-0 items-center justify-center rounded bg-violet-600 text-[8px] font-bold text-white">DD</div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-800 dark:text-slate-200">Direct Debit</div>
                          <div className="text-[10px] text-gray-400 dark:text-slate-600">Exp 06/2027</div>
                        </div>
                      </div>
                      <button type="button" className="flex w-full items-center gap-2 pt-1 text-xs font-medium text-gray-400 transition-colors hover:text-[#00D2A2] dark:text-slate-500 dark:hover:text-[#00D2A2]">
                        <Icon name="add" size={14} />
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
                <TabsTrigger value="overview" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="insights" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                  Insights
                </TabsTrigger>
                <TabsTrigger value="bill-compare" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                  Bill Compare
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-lg px-3 py-1.5 text-sm text-gray-400 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-md dark:text-slate-500 dark:data-[state=active]:bg-[#00D2A2]/20 dark:data-[state=active]:text-[#00D2A2]">
                  History
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="overview" className="mt-0">
          {/* Adora Customer Summary — progressive typing animation */}
          {adoraSummaryVisible ? (
          <Card className={cn("mb-8 overflow-hidden border border-[#00D2A2]/20 dark:border-[#00D2A2]/15", GLASS_CARD_LIGHT, GLASS_CARD_DARK, "shadow-[0_0_30px_rgba(0,210,162,0.08)]")}>
            <CardContent className="p-6 pt-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Image src="/Adora.svg" alt="Adora" width={80} height={36} className="h-6 w-auto" />
                  <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">
                    Customer Summary
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="border-[#00D2A2]/40 bg-[#00D2A2]/10 text-xs font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">
                    Auto-generated
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setAdoraSummaryVisible(false)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-300"
                  >
                    <Icon name="close" size={16} />
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-orange-300 p-3 dark:border-orange-500/40">
                {(adoraPhase === "idle" || adoraPhase === "thinking") && (
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-slate-400">Adora is analysing...</span>
                  </div>
                )}
                {(adoraPhase === "typing" || adoraPhase === "done") && (
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                    {renderAdoraSegments(adoraPhase === "done" ? ADORA_TOTAL_CHARS : adoraCharCount)}
                    {adoraPhase === "typing" && (
                      <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-orange-400 align-middle" />
                    )}
                  </p>
                )}
              </div>
              {adoraPhase === "done" && (
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-orange-500"
                >
                  <Image src="/AdoraDot.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                  Ask Adora
                </button>
              )}
            </CardContent>
          </Card>
          ) : null}

          {/* Service Addresses */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                  Service Addresses
                </h2>
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
                const typeIcon = acc.type === "Residential" ? "home" : acc.type === "Commercial" ? "business" : "store";
                const typeIconBg =
                  acc.type === "Residential"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300"
                    : acc.type === "Commercial"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300";
                const balancePillGreen = acc.isCredit || acc.balance === "$0.00";
                const accountCharts = getAccountChartData(acc.address);
                const isSelected = selectedAccountAddress === acc.address;
                return (
                  <React.Fragment key={acc.address}>
                    <Card
                      id={`account-${acc.address.replace(/\W/g, "-")}`}
                      className={cn(
                        "scroll-mt-4 cursor-pointer overflow-hidden border-0 transition-all duration-200",
                        GLASS_CARD_LIGHT,
                        GLASS_CARD_DARK,
                        "hover:shadow-lg hover:shadow-[#00D2A2]/10",
                        isSelected && "ring-1 ring-[#00D2A2]/25 shadow-[0_0_20px_rgba(0,210,162,0.12)] dark:ring-[#00D2A2]/20"
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
                                {acc.accNumber && (
                                  <span className="text-gray-500 dark:text-slate-500">
                                    ACC#: {acc.accNumber}
                                  </span>
                                )}
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
                              {acc.tags && acc.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {acc.tags.map((tag) => (
                                    <span
                                      key={tag.label}
                                      className={cn(
                                        "rounded-lg px-2 py-0.5 text-xs font-medium",
                                        tag.variant === "hardship"
                                          ? "text-red-700 dark:text-red-300"
                                          : "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                      )}
                                    >
                                      {tag.label}
                                    </span>
                                  ))}
                                </div>
                              )}
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
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">{acc.scheduledRead ? "Next scheduled read" : "Commenced"}</p>
                        <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.scheduledRead ?? acc.commenced ?? "—"}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                      <CardContent className="p-5 pt-5 pb-5">
                        <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">Bill Information</h3>
                        {acc.billPeriod && (
                          <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{acc.billPeriod}</p>
                        )}
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
                              {accountCharts.loadDisagg.map((item) => {
                                const maxKWh = accountCharts.loadDisagg[0].kWh;
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
                                {accountCharts.loadDisagg.reduce((s, d) => s + d.kWh, 0)} kWh
                              </span>
                            </div>
                          </TabsContent>
                          <TabsContent value="usage" className="mt-0">
                            <AccountUsageChartLegend
                              data={accountCharts.usage}
                              billVsPrevious={acc.billVsPrevious}
                              billVsPreviousUp={acc.billVsPreviousUp}
                            />
                            <AccountUsageBarChart
                              data={accountCharts.usage}
                              gradientId={`gradUsage-${acc.nmi.replace(/\s/g, "")}`}
                            />
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
                              data={accountCharts.billVsPrevious}
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
            ) : (
            /* ── Card View ── */
            <div className="grid gap-4 sm:grid-cols-2">
              {ACCOUNTS.map((acc) => {
                const typeIcon = acc.type === "Residential" ? "home" : acc.type === "Commercial" ? "business" : "store";
                const typeIconBg =
                  acc.type === "Residential"
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300"
                    : acc.type === "Commercial"
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300";
                const balancePillGreen = acc.isCredit || acc.balance === "$0.00";
                const accountCharts = getAccountChartData(acc.address);
                const sparkline = ACCOUNT_USAGE_SPARKLINES[acc.address] ?? [];
                const trendPct = acc.billVsPrevious && acc.billVsPrevious !== "—" ? acc.billVsPrevious : null;
                const isSelected = selectedAccountAddress === acc.address;

                return (
                  <Card
                    key={acc.address}
                    id={`card-account-${acc.address.replace(/\W/g, "-")}`}
                    className={cn(
                      "cursor-pointer overflow-hidden border-0 transition-all duration-200",
                      GLASS_CARD_LIGHT,
                      GLASS_CARD_DARK,
                      "hover:shadow-lg hover:shadow-[#00D2A2]/10",
                      acc.isClosed && "opacity-70",
                      isSelected && "col-span-full ring-1 ring-[#00D2A2]/25 shadow-[0_0_20px_rgba(0,210,162,0.12)] dark:ring-[#00D2A2]/20"
                    )}
                    onClick={() => handleAccountClick(acc.address)}
                  >
                    <CardContent className="p-0">
                      <div className={cn(isSelected ? "flex gap-6" : "")}>
                        {/* Card summary — keeps its column width when expanded */}
                        <div className={cn(isSelected ? "w-72 shrink-0" : "")}>
                          {/* Header */}
                          <div className="px-5 pt-5 pb-3">
                            <div className="flex items-start justify-between mb-3">
                              <div
                                className={cn(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                  typeIconBg
                                )}
                              >
                                <Icon name={typeIcon} size={20} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium",
                                    acc.status === "CLOSED"
                                      ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500"
                                      : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                  )}
                                >
                                  {acc.status}
                                </span>
                                {isSelected && (
                                  <Icon name="expand_less" size={18} className="text-gray-400 dark:text-slate-500" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              {acc.address}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">
                              NMI: {acc.nmi}
                              {acc.accNumber ? ` · ACC#: ${acc.accNumber}` : ""}
                            </p>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3">
                            <span className={cn("rounded-lg px-2 py-0.5 text-[11px] font-medium", typeIconBg)}>
                              {acc.type}
                            </span>
                            <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-slate-600/40 dark:text-slate-400">
                              {acc.fuel}
                            </span>
                            {acc.tags?.map((tag) => (
                              <span
                                key={tag.label}
                                className={cn(
                                  "rounded-lg px-2 py-0.5 text-[11px] font-medium",
                                  tag.variant === "hardship"
                                    ? "text-red-700 dark:text-red-300"
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                )}
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>

                          {/* Key metrics row */}
                          <div className="grid grid-cols-3 gap-px border-t border-gray-100 bg-gray-100 dark:border-white/[0.06] dark:bg-white/[0.04]">
                            <div className="bg-white/90 px-4 py-3 dark:bg-white/[0.06]">
                              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Balance</p>
                              <p className={cn(
                                "mt-0.5 text-sm font-semibold",
                                balancePillGreen
                                  ? "text-emerald-700 dark:text-emerald-300"
                                  : "text-red-700 dark:text-red-300"
                              )}>
                                {acc.balance}
                              </p>
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

                          {/* Sparkline + trend */}
                          {sparkline.length > 0 && !acc.isClosed && (
                            <div className="px-5 pt-4 pb-1">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-500">Usage trend (kWh)</p>
                                {trendPct && (
                                  <span className={cn(
                                    "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                                    acc.billVsPreviousUp
                                      ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                  )}>
                                    <Icon name={acc.billVsPreviousUp ? "trending_up" : "trending_down"} size={12} />
                                    {trendPct}
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
                                    <Area
                                      type="monotone"
                                      dataKey="v"
                                      stroke={CHART_TEAL}
                                      strokeWidth={1.5}
                                      fill={`url(#sparkGrad-${acc.nmi.replace(/\s/g, "")})`}
                                      dot={false}
                                      animationDuration={600}
                                    />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          )}

                          {/* Footer details */}
                          <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-3 dark:border-white/[0.06]">
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-500">
                              <span className="flex items-center gap-1">
                                <Icon name="calendar_today" size={12} />
                                {acc.commenced ?? "—"}
                              </span>
                              {acc.billingTo && (
                                <span className="flex items-center gap-1">
                                  <Icon name="receipt_long" size={12} />
                                  {acc.billingTo}
                                </span>
                              )}
                            </div>
                            {acc.bestOffer && !acc.isClosed && (
                              <span className={cn(
                                "rounded-md px-2 py-0.5 text-[11px] font-medium",
                                acc.bestOffer === "Currently on best"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                  : acc.bestOffer === "Review recommended"
                                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                                    : "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"
                              )}>
                                {acc.bestOffer}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expanded detail panel */}
                        {isSelected && (
                          <div
                            className="flex-1 space-y-6 border-l border-gray-200/80 px-5 py-5 dark:border-white/10"
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
                                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">{acc.scheduledRead ? "Next scheduled read" : "Commenced"}</p>
                                  <p className="mt-1 font-semibold text-gray-900 dark:text-slate-100">{acc.scheduledRead ?? acc.commenced ?? "—"}</p>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="grid gap-6 lg:grid-cols-2">
                              <Card className="overflow-hidden border-0 !bg-gray-50 shadow-none dark:!bg-slate-800/40">
                                <CardContent className="p-5 pt-5 pb-5">
                                  <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">Bill Information</h3>
                                  {acc.billPeriod && (
                                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">{acc.billPeriod}</p>
                                  )}
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
                                              <span className={cn(
                                                "font-medium",
                                                (acc.charges?.includes("−") || acc.charges?.includes("-")) && acc.charges?.includes("CR")
                                                  ? "text-emerald-600 dark:text-emerald-400"
                                                  : "text-gray-900 dark:text-slate-100"
                                              )}>
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
                                        {accountCharts.loadDisagg.map((item) => {
                                          const maxKWh = accountCharts.loadDisagg[0].kWh;
                                          const pct = Math.round((item.kWh / maxKWh) * 100);
                                          return (
                                            <div key={item.category} className="group">
                                              <div className="mb-1 flex items-center justify-between text-xs">
                                                <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-slate-300">
                                                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                                                  {item.category}
                                                </span>
                                                <span className="tabular-nums text-gray-500 dark:text-slate-400">{item.kWh} kWh</span>
                                              </div>
                                              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]">
                                                <div
                                                  className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                                                  style={{ width: `${pct}%`, backgroundColor: item.fill }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 dark:border-white/[0.06]">
                                        <span className="text-xs font-medium text-gray-700 dark:text-slate-300">Total estimated</span>
                                        <span className="text-xs font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                                          {accountCharts.loadDisagg.reduce((s, d) => s + d.kWh, 0)} kWh
                                        </span>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="usage" className="mt-0">
                                      <AccountUsageChartLegend
                                        data={accountCharts.usage}
                                        billVsPrevious={acc.billVsPrevious}
                                        billVsPreviousUp={acc.billVsPreviousUp}
                                      />
                                      <AccountUsageBarChart
                                        data={accountCharts.usage}
                                        gradientId={`cardGradUsage-${acc.nmi.replace(/\s/g, "")}`}
                                      />
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
                                    <div
                                      className={cn(
                                        "mt-4 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium",
                                        acc.billVsPreviousUp
                                          ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300"
                                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                      )}
                                    >
                                      <Icon name={acc.billVsPreviousUp ? "trending_up" : "trending_down"} size={18} />
                                      {acc.billVsPrevious}
                                    </div>
                                  ) : null}
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
                                      <ComposedChart data={accountCharts.billVsPrevious} margin={{ top: 12, right: 12, bottom: 4, left: -8 }}>
                                        <defs>
                                          <linearGradient id={`card-bill-area-${acc.nmi.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={CHART_TEAL} stopOpacity={0.25} />
                                            <stop offset="100%" stopColor={CHART_TEAL} stopOpacity={0.02} />
                                          </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} vertical={false} />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} dy={6} />
                                        <YAxis domain={[0, 160]} ticks={[0, 80, 160]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={32} />
                                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#00D2A2", strokeWidth: 1, strokeDasharray: "4 4", strokeOpacity: 0.4 }} />
                                        <Area type="natural" dataKey="current" name="Current" stroke={CHART_TEAL} strokeWidth={2.5} fill={`url(#card-bill-area-${acc.nmi.replace(/\s/g, "")})`} dot={false} activeDot={{ r: 5, fill: CHART_TEAL, stroke: "#fff", strokeWidth: 2 }} animationDuration={800} animationEasing="ease-out" />
                                        <Line type="natural" dataKey="previous" name="Previous" stroke="#D1D5DB" strokeWidth={1.5} strokeDasharray="6 3" dot={false} activeDot={{ r: 4, fill: "#D1D5DB", stroke: "#fff", strokeWidth: 2 }} animationDuration={800} animationEasing="ease-out" />
                                      </ComposedChart>
                                    </ResponsiveContainer>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
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
            <TabsContent value="insights" className="mt-0">
              {/* KPI Badges */}
              <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[
                  { icon: "trending_up" as const, label: "Usage Trend", value: "↑ 22% vs previous invoice", color: "#EF4444" },
                  { icon: "payments" as const, label: "Latest Bill", value: "$140.74 / month", color: "#0091BF" },
                  { icon: "star" as const, label: "Payment Score", value: "Inconsistent", color: "#EF4444" },
                  { icon: "shield" as const, label: "Risk Level", value: "Medium — Hardship", color: "#864EAD" },
                ].map((badge) => (
                  <Card key={badge.label} className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <CardContent className="flex items-start gap-3 p-4 pt-4">
                      <div
                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
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

              {/* Adora Customer Summary — static (already seen on Overview) */}
              <Card className={cn("mb-3 overflow-hidden border border-[#00D2A2]/20 dark:border-[#00D2A2]/15", GLASS_CARD_LIGHT, GLASS_CARD_DARK, "shadow-[0_0_30px_rgba(0,210,162,0.08)]")}>
                <CardContent className="p-4 pt-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Image src="/Adora.svg" alt="Adora" width={80} height={36} className="h-6 w-auto" />
                      <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">Customer Summary</h3>
                    </div>
                    <Badge className="border-[#00D2A2]/40 bg-[#00D2A2]/10 text-xs font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">Auto-generated</Badge>
                  </div>
                  <div className="rounded-lg border border-orange-300 p-3 dark:border-orange-500/40">
                    <AdoraSummaryText className="text-sm leading-relaxed text-gray-700 dark:text-slate-300" />
                  </div>
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-orange-500"
                  >
                    <Image src="/AdoraDot.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                    Ask Adora
                  </button>
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
                      <span className="inline-flex items-center gap-1 rounded-lg bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-500/20 dark:text-red-300">
                        <Icon name="trending_up" size={14} /> 22%
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
                    <div className="flex justify-center">
                      <ResponsiveContainer width="100%" height={170}>
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
              {/* Bill comparison card */}
              <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                <CardContent className="p-0">
                  {/* Bill headers */}
                  <div className="grid grid-cols-3 gap-px">
                    {BILL_COMPARE_BILLS.map((bill) => (
                      <div key={bill.id} className="p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">{bill.label}</span>
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{bill.status}</span>
                          <button
                            type="button"
                            className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                            aria-label="Download PDF"
                          >
                            <Icon name="picture_as_pdf" size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400">{bill.period}</p>
                      </div>
                    ))}
                  </div>

                  {/* Expand/Collapse all + Data rows */}
                  <div className="flex items-center justify-end px-4 py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (expandedBillRows.size === BILL_COMPARE_ROWS.length) {
                          setExpandedBillRows(new Set());
                        } else {
                          setExpandedBillRows(new Set(BILL_COMPARE_ROWS.map((r) => r.label)));
                        }
                      }}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-white/[0.04] dark:hover:text-slate-300"
                    >
                      <Icon name={expandedBillRows.size === BILL_COMPARE_ROWS.length ? "unfold_less" : "unfold_more"} size={14} />
                      {expandedBillRows.size === BILL_COMPARE_ROWS.length ? "Collapse all" : "Expand all"}
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                    {BILL_COMPARE_ROWS.map((row) => {
                      const isExpanded = expandedBillRows.has(row.label);
                      return (
                        <div key={row.label}>
                          <button
                            type="button"
                            onClick={() => toggleBillRow(row.label)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-gray-50/60 dark:hover:bg-white/[0.02]"
                          >
                            <span className="flex-1 text-xs font-medium text-gray-500 dark:text-slate-400">{row.label}</span>
                            <Icon name={isExpanded ? "expand_less" : "expand_more"} size={18} className="shrink-0 text-gray-400 dark:text-slate-500" />
                          </button>
                          {isExpanded && (
                            <div className="grid grid-cols-3 gap-px border-t border-gray-50 bg-gray-50/50 px-4 py-3 dark:border-white/[0.03] dark:bg-white/[0.02]">
                              {row.values.map((val, i) => (
                                <div key={i}>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{val}</p>
                                  {row.detail && i === 0 && (
                                    <p className="mt-1 text-[10px] leading-relaxed text-gray-500 dark:text-slate-500">{row.detail}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
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
                        onClick={() => {
                          setActivePanelTab(tab);
                          if (tab !== "X-Sell") setXSellView(null);
                        }}
                        className={cn(
                          "whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                          activePanelTab === tab
                            ? "bg-gray-100 text-[#2C365D] dark:bg-white/[0.1] dark:text-[#00D2A2]"
                            : "text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400"
                        )}
                      >
                        {tab}
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

                {activePanelTab === "Adora" && (
                  <div className="flex flex-1 flex-col overflow-y-auto px-3.5 py-3.5">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <Image src="/Adora.svg" alt="Adora" width={72} height={32} className="h-5 w-auto" />
                      <Badge variant="success" className="flex items-center gap-1 text-[10px]">
                        <Icon name="call" size={12} className="animate-pulse" />
                        <CallInProgressLabel />
                      </Badge>
                    </div>
                    <div className="mb-3 rounded-lg bg-gray-100/90 px-2.5 py-2 text-center dark:bg-white/[0.06]">
                      <p className="text-[11px] leading-relaxed text-gray-600 dark:text-slate-400">
                        Conversation between Customer and Agent commenced {DEMO_CALL_DATE} at {DEMO_CALL_TIME}
                      </p>
                    </div>
                    {callDemoStep === "waiting" && (
                      <div className="rounded-xl bg-gray-100/90 p-3 dark:bg-white/[0.06]">
                        <p className="py-2 text-xs italic text-gray-500 dark:text-slate-400">
                          Waiting for customer enquiry…
                        </p>
                      </div>
                    )}
                    {(isCallDemoAnalysing || callDemoInsightsVisible) && (
                      <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                        <div className="flex items-start gap-2.5">
                          {isCallDemoAnalysing && (
                            <div className="mt-1 flex shrink-0 gap-1">
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "0ms" }} />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "150ms" }} />
                              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" style={{ animationDelay: "300ms" }} />
                            </div>
                          )}
                          <p className="flex-1 text-xs leading-relaxed text-gray-600 dark:text-slate-400">
                            {DEMO_ANALYSIS_MESSAGE}
                          </p>
                        </div>
                        <p className="mt-3 text-right text-[10px] text-gray-400 dark:text-slate-500">
                          {DEMO_ANALYSIS_TIMESTAMP}
                        </p>
                      </div>
                    )}
                    {callDemoInsightsVisible && (
                      <>
                        <div className="rounded-xl bg-gray-100/90 p-3 dark:bg-white/[0.06]">
                          <div className="space-y-3 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                            {CALL_DEMO_SECTIONS.map((section) => (
                              <div key={section.title}>
                                <p className="mb-1 font-semibold text-gray-900 dark:text-slate-100">{section.title}</p>
                                <ul className="list-disc space-y-1 pl-4">
                                  {section.items.map((item) => (
                                    <li key={item}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <p className="mt-3 text-right text-[10px] text-gray-400 dark:text-slate-500">
                            {DEMO_CALL_TIMESTAMP}
                          </p>
                        </div>
                        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                          <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">{CALL_DEMO_SUMMARY}</p>
                          <p className="mt-3 text-right text-[10px] text-gray-400 dark:text-slate-500">
                            {DEMO_CALL_SUMMARY_TIMESTAMP}
                          </p>
                        </div>
                      </>
                    )}
                    {callDemoStep === "complete" && (
                      <button
                        type="button"
                        onClick={() => setCallSummaryModalOpen(true)}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2C365D] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2C365D]/90 dark:bg-[#00D2A2] dark:text-gray-900 dark:hover:bg-[#00D2A2]/90"
                      >
                        Generate Call Summary
                      </button>
                    )}
                  </div>
                )}

                {activePanelTab === "Control Panel" && (
                  <>
                    {/* Quick action buttons */}
                    <div className="flex gap-2 border-b border-gray-100/60 p-3.5 dark:border-white/[0.04]">
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
                              ? "border-[#00D2A2]/40 bg-[#00D2A2]/10 text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]"
                              : "border-gray-200/60 bg-white/60 text-gray-500 hover:border-[#4EEECA]/30 hover:bg-[#4EEECA]/8 hover:text-[#298268] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:hover:border-[#4EEECA]/20 dark:hover:bg-[#4EEECA]/10 dark:hover:text-[#4EEECA]"
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
                  </>
                )}

                {activePanelTab === "X-Sell" && xSellView === null && (
                  <div className="flex-1 space-y-5 overflow-y-auto px-3.5 py-3.5">
                    {/* Active Services */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Active Services</p>
                      <div className="space-y-2">
                        {([
                          { icon: "bolt" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Electricity", provider: "EnergyCo", plan: "HomeDeal Extra", status: "Connected" },
                          { icon: "local_fire_department" as const, iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300", service: "Gas", provider: "Energy Co", plan: "Online saver plan 2024", status: "Connected" },
                        ]).map((s) => (
                          <button key={s.service} type="button" className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                              <Icon name={s.icon} size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{s.status}</span>
                              </div>
                              <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.provider}</p>
                              <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.plan}</p>
                            </div>
                            <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services available to this site */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Services available to this site</p>
                      <div className="space-y-2">
                        {([
                          { icon: "wifi" as const, iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300", service: "Broadband", headline: "6 broadband plans available", sub: "Plans from $68/month", badge: null, action: "broadband" },
                          { icon: "solar_power" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Solar", headline: "7 Exclusive Solar offers available", sub: "Offers starting at $4,500", badge: null, action: null },
                          { icon: "battery_charging_full" as const, iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300", service: null, headline: "2026 Home battery subsidies available", sub: "Check eligibility", badge: "New", action: null },
                        ]).map((s) => (
                          <button key={s.headline} type="button" onClick={() => s.action && setXSellView(s.action)} className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                              <Icon name={s.icon} size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                {s.service && <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>}
                                {s.badge && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{s.badge}</span>}
                              </div>
                              <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.headline}</p>
                              <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.sub}</p>
                            </div>
                            <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* MIMO Services */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">MIMO Services</p>
                      <div className="space-y-2">
                        {([
                          { icon: "cleaning_services" as const, iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300", service: "Cleaning", headline: "3 cleaning services available", sub: "Starting at $650" },
                          { icon: "local_shipping" as const, iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300", service: "Removals", headline: "11 removal services available", sub: "From $1200" },
                        ]).map((s) => (
                          <button key={s.service} type="button" className={cn("flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                            <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                              <Icon name={s.icon} size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                              </div>
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

                {/* Broadband Plans drill-down */}
                {activePanelTab === "X-Sell" && xSellView === "broadband" && (
                  <div className="flex flex-1 flex-col overflow-y-auto">
                    <div className="flex items-center gap-2 border-b border-gray-100/60 px-3.5 py-3 dark:border-white/[0.04]">
                      <button
                        type="button"
                        onClick={() => setXSellView(null)}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
                        aria-label="Back to X-Sell"
                      >
                        <Icon name="arrow_back" size={16} />
                      </button>
                      <span className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">
                        ({BROADBAND_PLANS.length}) Broadband Plans
                      </span>
                    </div>
                    <div className="space-y-2.5 px-3.5 py-3.5">
                      {BROADBAND_PLANS.map((plan) => (
                        <div key={plan.name} className={cn("overflow-hidden rounded-xl", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                          <div className="p-3.5">
                            <div className="mb-2.5 flex items-center gap-2.5">
                              {plan.logo ? (
                                <Image src={plan.logo} alt={plan.name} width={120} height={40} className="h-7 w-auto" />
                              ) : (
                                <>
                                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", (plan as { iconBg?: string }).iconBg)}>
                                    <Icon name={(plan as { icon?: string }).icon ?? "public"} size={16} />
                                  </div>
                                  <span className="text-base font-bold tracking-tight text-gray-900 dark:text-slate-100">{plan.name}</span>
                                </>
                              )}
                            </div>
                            <div className="mb-2.5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-gray-200/80 dark:border-white/[0.08]">
                              {([
                                ["Cost", plan.cost],
                                ["Speed", plan.speed],
                                ["Data", plan.data],
                              ] as const).map(([label, value]) => (
                                <div key={label} className="bg-gray-50 px-2 py-1.5 text-center dark:bg-white/[0.04]">
                                  <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">{label}</p>
                                  <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{value}</p>
                                </div>
                              ))}
                            </div>
                            <p className="mb-2.5 text-[11px] leading-relaxed text-gray-600 dark:text-slate-400">{plan.description}</p>
                            <div className="flex flex-wrap gap-x-3 gap-y-1">
                              {plan.features.map((f) => (
                                <div key={f} className="flex items-center gap-1 text-[10px]">
                                  <Icon name="check_circle" size={13} className="text-emerald-500" />
                                  <span className="font-medium text-gray-700 dark:text-slate-300">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </div>
            </aside>
          </main>
        </div>
      </div>

      <Dialog open={callSummaryModalOpen} onOpenChange={setCallSummaryModalOpen}>
        <DialogContent className="max-w-lg border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-slate-100">Call Wrap Summary</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400">
              {DEMO_CALL_DATE} at {DEMO_CALL_TIME} · {CUSTOMER.name} · CN {CUSTOMER.cn}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-xs dark:bg-white/[0.04]">
              <div>
                <p className="font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Agent</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-slate-100">{AGENT.name}</p>
              </div>
              <div>
                <p className="font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Duration</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-slate-100">1 min 12 sec</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Account</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-slate-100">{PRIMARY_ACCOUNT_ADDRESS}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Reason</p>
                <p className="mt-0.5 font-semibold text-gray-900 dark:text-slate-100">High bill enquiry</p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-2 dark:border-emerald-500/25 dark:bg-emerald-500/10">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                <Icon name="sentiment_satisfied" size={18} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">
                    Customer sentiment
                  </p>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Positive</span>
                </div>
                <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                  <div className="flex-1" />
                  <div className="flex-1" />
                  <div className="flex-1 rounded-r-full bg-emerald-500 dark:bg-emerald-400" />
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-500">
                Wrap notes
              </p>
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-gray-700 dark:text-slate-300">
                {CALL_WRAP_SUMMARY_POINTS.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20">
                <Icon name="check_circle" size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Recorded against customer notes
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-emerald-700 dark:text-emerald-400/90">
                  Call summary saved to {CUSTOMER.name}&apos;s interaction history. Reference{" "}
                  <span className="font-mono font-medium">{CALL_WRAP_NOTE_REF}</span>.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="primary" className="w-full sm:w-auto">
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
