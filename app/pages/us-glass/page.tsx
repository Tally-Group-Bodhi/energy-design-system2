"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/Card/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";
import Input from "@/components/Input/Input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table/Table";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import CompanionWidget, {
  CompanionCompactIcon,
} from "@/components/CompanionWidget/CompanionWidget";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { dataVisualizationColors, secondaryColors } from "@/lib/tokens/colors";
import {
  IOS_CHROME_ACTIVE_CLASS,
  IOS_CHROME_ACTIVE_ICON_CLASS,
  IOS_CHROME_BORDER_CLASS,
  IOS_CHROME_CLASS,
  IOS_CHROME_INSET_CLASS,
  IOS_CHROME_ITEM_CLASS,
  IOS_CHROME_MUTED_CLASS,
  IOS_CHROME_TEXT_CLASS,
} from "@/app/pages/eos-glass/eos-glass-theme";

/* ────────── Glass surfaces (aligned with Glass Vision Demo V2.2) ────────── */

const PANE = "bg-gray-100 dark:bg-gray-900";
const GLASS_CARD =
  "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40 dark:bg-white/[0.08] dark:border-white/[0.12] dark:shadow-none";
const GLASS_PANEL =
  "bg-white/80 backdrop-blur-xl border border-gray-200/90 shadow-xl shadow-gray-200/50 dark:bg-white/[0.06] dark:border-white/[0.08] dark:shadow-none";

const CHART = {
  energy: dataVisualizationColors.dataASolid.hex, // teal
  tdsp: dataVisualizationColors.dataBSolid.hex, // navy
  base: dataVisualizationColors.dataCSolid.hex, // amber
  fees: dataVisualizationColors.dataDSolid.hex, // purple
  gain: "#14B69D",
  loss: "#D86327",
  navy: "#2C365D",
  grid: "#E5E7EB",
  axis: "#6B7280",
  reconnect: "#00D2A2",
};

/* ────────── Nav ────────── */

type NavId = "home" | "operations" | "reports" | "search";

const LEFT_NAV: { id: NavId; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "operations", label: "Operations", icon: "conversion_path" },
  { id: "reports", label: "Reports", icon: "description" },
  { id: "search", label: "Search", icon: "search" },
];

type ReportKey = "texas-revenue" | "customer-base";
type TexasTab = "overview" | "billing-review";

const REPORT_CATALOG: {
  id: ReportKey;
  title: string;
  section: string;
  blurb: string;
}[] = [
  {
    id: "texas-revenue",
    title: "Texas revenue detail",
    section: "Finance",
    blurb: "Net charges, component mix, TDSP breakdown, and invoice review.",
  },
  {
    id: "customer-base",
    title: "Customer base",
    section: "Customers",
    blurb: "Gains, losses, census estimates, and reconnect performance.",
  },
];

/* ────────── Mock data — Texas revenue ────────── */

const KPI_CARDS = [
  { label: "Net charges", value: "$9,183", delta: "71.1%", spark: [42, 38, 45, 30, 22, 18, 12] },
  { label: "Invoices", value: "60", delta: "71.6%", spark: [80, 72, 68, 50, 40, 28, 20] },
  { label: "Usage", value: "16 MWh", delta: "78.9%", spark: [55, 48, 40, 32, 24, 16, 10] },
  { label: "Energy revenue", value: "$5,885", delta: "71.7%", spark: [60, 55, 48, 36, 28, 20, 14] },
  { label: "TDSP charges", value: "$2,316", delta: "73.2%", spark: [50, 46, 40, 30, 22, 16, 11] },
  { label: "Total tax", value: "$380", delta: "49.3%", spark: [28, 30, 26, 24, 20, 18, 16] },
] as const;

const COMPONENT_BREAKDOWN = [
  { name: "Energy usage", value: 5885, pct: "62.5%", color: CHART.energy },
  { name: "TDSP charges", value: 2316, pct: "24.6%", color: CHART.tdsp },
  { name: "Customer base", value: 259, pct: "2.8%", color: CHART.base },
  { name: "Fees and other", value: 950, pct: "10.1%", color: CHART.fees },
];

const TDSP_BARS = [
  { name: "CenterPoint", value: 4120 },
  { name: "TNMP", value: 1980 },
  { name: "Oncor", value: 1640 },
  { name: "AEP Texas Central", value: 720 },
  { name: "AEP Texas North", value: 410 },
  { name: "Other", value: 313 },
];

const DAILY_NET = Array.from({ length: 30 }, (_, i) => ({
  day: `Jun ${i + 1}`,
  charges: Math.round(180 + Math.sin(i / 2.2) * 90 + (i % 5) * 18 + (i > 20 ? 40 : 0)),
}));

const BRAND_STACK = [
  { brand: "Gexa Energy IX", energy: 3200, tdsp: 1100, base: 120, fees: 480 },
  { brand: "Frontier Utilities", energy: 1800, tdsp: 780, base: 90, fees: 310 },
  { brand: "Companion Energy", energy: 885, tdsp: 436, base: 49, fees: 160 },
];

const INVOICES = [
  { id: "33014185", status: "REVERSED", post: "Jun 28", customer: "C1048", name: "River Oaks Partners LLC", brand: "Gexa Energy IX", tdsp: "CenterPoint", cycle: "28", usage: "1,240", energy: "$412", tdspAmt: "$168", net: "$0.00" },
  { id: "33014166", status: "POSTED", post: "Jun 28", customer: "C1048", name: "River Oaks Partners LLC", brand: "Gexa Energy IX", tdsp: "CenterPoint", cycle: "28", usage: "1,240", energy: "$412", tdspAmt: "$168", net: "$612.40" },
  { id: "33014012", status: "POSTED", post: "Jun 27", customer: "C2081", name: "Lone Star Warehousing", brand: "Frontier Utilities", tdsp: "Oncor", cycle: "15", usage: "2,860", energy: "$890", tdspAmt: "$310", net: "$1,284.10" },
  { id: "33013988", status: "POSTED", post: "Jun 26", customer: "C3310", name: "Bayou Medical Group", brand: "Companion Energy", tdsp: "TNMP", cycle: "01", usage: "980", energy: "$298", tdspAmt: "$142", net: "$478.20" },
  { id: "33013840", status: "POSTED", post: "Jun 25", customer: "C4412", name: "Hill Country Foods", brand: "Gexa Energy IX", tdsp: "AEP Texas Central", cycle: "22", usage: "3,410", energy: "$1,020", tdspAmt: "$390", net: "$1,512.80" },
  { id: "33013755", status: "REVERSED", post: "Jun 24", customer: "C2081", name: "Lone Star Warehousing", brand: "Frontier Utilities", tdsp: "Oncor", cycle: "15", usage: "2,860", energy: "$890", tdspAmt: "$310", net: "$0.00" },
  { id: "33013601", status: "POSTED", post: "Jun 22", customer: "C5520", name: "Capitol Office REIT", brand: "Gexa Energy IX", tdsp: "Oncor", cycle: "10", usage: "4,120", energy: "$1,280", tdspAmt: "$460", net: "$1,890.00" },
  { id: "33013488", status: "POSTED", post: "Jun 20", customer: "C6671", name: "Gulf Coast Plastics", brand: "Companion Energy", tdsp: "CenterPoint", cycle: "05", usage: "5,640", energy: "$1,640", tdspAmt: "$520", net: "$2,310.50" },
];

const REVIEW_STATS = [
  { label: "Likely errors", value: 0, tone: "warn" as const },
  { label: "Review lists", value: 0, tone: "info" as const },
  { label: "Reversals", value: 1, tone: "neutral" as const },
  { label: "No flags", value: 0, tone: "neutral" as const },
];

const REVIEW_CHECKS = [
  { group: "LIKELY ERRORS", items: [
    { name: "Negative usage with positive energy", count: 0, done: true },
    { name: "Energy vs usage mismatch", count: 0, done: true },
    { name: "TDSP charges without usage", count: 0, done: true },
    { name: "Tax without taxable base", count: 0, done: true },
  ]},
  { group: "REVIEW LISTS", items: [
    { name: "High variance vs prior month", count: 0, done: true },
    { name: "Final invoice with open balance", count: 0, done: true },
    { name: "Missing bill cycle", count: 0, done: true },
  ]},
  { group: "OTHER", items: [
    { name: "Reversals this period", count: 1, done: false },
    { name: "Manual adjustments", count: 0, done: true },
  ]},
];

const HEATMAP_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
const HEATMAP = HEATMAP_MONTHS.map((month, mi) => ({
  month,
  days: Array.from({ length: 31 }, (_, i) => {
    if (month === "Feb" && i > 27) return null;
    // Deterministic pseudo-pattern (avoids SSR hydration mismatch)
    return (mi * 3 + i * 5 + (i % 7)) % 8;
  }),
}));

const SELECTED_INVOICE = {
  id: "33014185",
  customer: "River Oaks Partners LLC",
  customerNo: "C1048",
  brand: "GEXA ENERGY IX",
  status: "REVERSES INVOICE 33014166",
  amountDue: "$0.00",
  due: "Jul 18, 2026",
  posted: "Jun 28, 2026",
  service: "May 28 – Jun 27, 2026",
  usage: "1,240 kWh",
  tdsp: "CenterPoint",
  cycle: "28",
  lines: [
    { desc: "TDU Duplicate Charge Refund", net: "-$168.00", tax: "-$13.86", total: "-$181.86" },
    { desc: "Energy credit — reverse", net: "-$412.00", tax: "-$18.54", total: "-$430.54" },
  ],
};

/* ────────── Glass layer — customer + service addresses (Demo V2.2 pattern) ────────── */

type UsAccountType = "Commercial" | "Small Business" | "Residential";

type UsServiceAddress = {
  address: string;
  esid: string;
  accountNo: string;
  type: UsAccountType;
  fuel: string;
  status: "OPEN" | "CLOSED";
  balance: string;
  isCredit?: boolean;
  tdsp: string;
  brand: string;
  plan?: string;
  billing?: string;
  billingTo?: string;
  scheduledRead?: string;
  invoiceAmount?: string;
  tags?: { label: string; variant: "hardship" | "assist" }[];
};

type UsGlassCustomer = {
  id: string;
  name: string;
  initials: string;
  region: string;
  email: string;
  phone: string;
  preference: string;
  marketing: string;
  payerRating: string;
  payerTone: "ok" | "warn";
  created: string;
  lastCall: string;
  lastNote: string;
  addresses: UsServiceAddress[];
};

const US_GLASS_CUSTOMERS: Record<string, UsGlassCustomer> = {
  C1048: {
    id: "C1048",
    name: "River Oaks Partners LLC",
    initials: "RO",
    region: "Texas · Houston",
    email: "billing@riveroakspartners.com",
    phone: "(713) 555-0148",
    preference: "Contact via Email",
    marketing: "Opted in",
    payerRating: "Consistent",
    payerTone: "ok",
    created: "12 Mar 2016",
    lastCall: "02 Jun 2026",
    lastNote: "28 Jun 2026",
    addresses: [
      {
        address: "2401 Kirby Dr, Houston, TX 77019",
        esid: "10443720001234567",
        accountNo: "TX-88104201",
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$612.40",
        tdsp: "CenterPoint",
        brand: "Gexa Energy IX",
        plan: "Commercial Fixed 24",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 27, 2026",
        scheduledRead: "28 Jul 2026",
        invoiceAmount: "$612.40",
      },
      {
        address: "3800 Buffalo Speedway, Houston, TX 77098",
        esid: "10443720009876543",
        accountNo: "TX-88104218",
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$1,840.00",
        tdsp: "CenterPoint",
        brand: "Gexa Energy IX",
        plan: "Commercial Fixed 24",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 22, 2026",
        scheduledRead: "22 Jul 2026",
        invoiceAmount: "$1,840.00",
      },
      {
        address: "5000 Westheimer Rd, Houston, TX 77056",
        esid: "10443720005551234",
        accountNo: "TX-88104255",
        type: "Small Business",
        fuel: "Electricity",
        status: "OPEN",
        balance: "−$42.10 Credit",
        isCredit: true,
        tdsp: "CenterPoint",
        brand: "Gexa Energy IX",
        plan: "SMB Variable",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 15, 2026",
        scheduledRead: "15 Jul 2026",
        invoiceAmount: "$0.00",
        tags: [{ label: "Net metered", variant: "assist" }],
      },
      {
        address: "910 Louisiana St, Houston, TX 77002",
        esid: "10443720007778888",
        accountNo: "TX-88104002",
        type: "Commercial",
        fuel: "Electricity",
        status: "CLOSED",
        balance: "$0.00",
        isCredit: true,
        tdsp: "CenterPoint",
        brand: "Gexa Energy IX",
        plan: "Commercial Fixed 12",
        billing: "Final billed",
        invoiceAmount: "$0.00",
      },
    ],
  },
  C2081: {
    id: "C2081",
    name: "Lone Star Warehousing",
    initials: "LS",
    region: "Texas · Dallas",
    email: "ap@lonestarwh.com",
    phone: "(214) 555-0190",
    preference: "Contact via Phone",
    marketing: "No Marketing",
    payerRating: "Watch",
    payerTone: "warn",
    created: "08 Jan 2019",
    lastCall: "24 Jun 2026",
    lastNote: "24 Jun 2026",
    addresses: [
      {
        address: "1200 Industrial Blvd, Dallas, TX 75207",
        esid: "10443721110002222",
        accountNo: "TX-77208101",
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$1,284.10",
        tdsp: "Oncor",
        brand: "Frontier Utilities",
        plan: "Industrial Peak",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 15, 2026",
        scheduledRead: "15 Jul 2026",
        invoiceAmount: "$1,284.10",
      },
      {
        address: "450 Rail Yard Rd, Fort Worth, TX 76102",
        esid: "10443721110003333",
        accountNo: "TX-77208122",
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$2,110.00",
        tdsp: "Oncor",
        brand: "Frontier Utilities",
        plan: "Industrial Peak",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 10, 2026",
        scheduledRead: "10 Jul 2026",
        invoiceAmount: "$2,110.00",
      },
    ],
  },
  C3310: {
    id: "C3310",
    name: "Bayou Medical Group",
    initials: "BM",
    region: "Texas · Beaumont",
    email: "finance@bayoumed.org",
    phone: "(409) 555-0112",
    preference: "Contact via Email",
    marketing: "Opted in",
    payerRating: "Consistent",
    payerTone: "ok",
    created: "19 Sep 2020",
    lastCall: "11 May 2026",
    lastNote: "26 Jun 2026",
    addresses: [
      {
        address: "755 Medical Center Blvd, Beaumont, TX 77701",
        esid: "10443723310004444",
        accountNo: "TX-55331001",
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$478.20",
        tdsp: "TNMP",
        brand: "Companion Energy",
        plan: "Healthcare Fixed 36",
        billing: "Monthly billing",
        billingTo: "Billed to Jun 01, 2026",
        scheduledRead: "01 Jul 2026",
        invoiceAmount: "$478.20",
      },
      {
        address: "220 Clinic Way, Port Arthur, TX 77640",
        esid: "10443723310005555",
        accountNo: "TX-55331018",
        type: "Small Business",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$312.00",
        tdsp: "TNMP",
        brand: "Companion Energy",
        plan: "SMB Fixed 12",
        billing: "Monthly billing",
        billingTo: "Billed to May 28, 2026",
        scheduledRead: "28 Jun 2026",
        invoiceAmount: "$312.00",
      },
    ],
  },
};

const ACCOUNT_TYPE_META: Record<
  UsAccountType,
  { icon: "home" | "store" | "business"; iconBg: string }
> = {
  Residential: {
    icon: "home",
    iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300",
  },
  "Small Business": {
    icon: "store",
    iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300",
  },
  Commercial: {
    icon: "business",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300",
  },
};

function resolveUsGlassCustomer(customerNo: string, fallbackName?: string): UsGlassCustomer {
  const known = US_GLASS_CUSTOMERS[customerNo];
  if (known) return known;
  const name = fallbackName ?? customerNo;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return {
    id: customerNo,
    name,
    initials: initials || "CU",
    region: "Texas",
    email: "billing@example.com",
    phone: "(000) 000-0000",
    preference: "Contact via Email",
    marketing: "No Marketing",
    payerRating: "—",
    payerTone: "ok",
    created: "—",
    lastCall: "—",
    lastNote: "—",
    addresses: [
      {
        address: "Service address on file",
        esid: "—",
        accountNo: customerNo,
        type: "Commercial",
        fuel: "Electricity",
        status: "OPEN",
        balance: "$0.00",
        isCredit: true,
        tdsp: "—",
        brand: "—",
      },
    ],
  };
}

function GlassIconButton({
  onClick,
  label = "Open in Glass",
  className,
}: {
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2C365D]/15 bg-white shadow-sm transition-all hover:border-[#00D2A2]/50 hover:shadow-md dark:border-white/15 dark:bg-white/10 dark:hover:border-[#00D2A2]/40",
        className,
      )}
    >
      <span className="relative h-4 w-4 overflow-hidden rounded-full">
        <Image
          src="/GlassLogoTest.svg"
          alt=""
          width={52}
          height={16}
          className="absolute left-0 top-1/2 h-4 w-auto max-w-none -translate-y-1/2 dark:hidden"
        />
        <Image
          src="/GlassLogoTest_darkmode.svg"
          alt=""
          width={52}
          height={16}
          className="absolute left-0 top-1/2 hidden h-4 w-auto max-w-none -translate-y-1/2 dark:block"
        />
      </span>
    </button>
  );
}

function GlassCustomerLayer({
  customerNo,
  fallbackName,
  onClose,
}: {
  customerNo: string;
  fallbackName?: string;
  onClose: () => void;
}) {
  const customer = useMemo(
    () => resolveUsGlassCustomer(customerNo, fallbackName),
    [customerNo, fallbackName],
  );
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const selected = selectedAddress
    ? customer.addresses.find((a) => a.address === selectedAddress) ?? null
    : null;

  const sections = (["Commercial", "Small Business", "Residential"] as UsAccountType[])
    .map((type) => ({
      type,
      accounts: customer.addresses.filter((a) => a.type === type),
      ...ACCOUNT_TYPE_META[type],
    }))
    .filter((s) => s.accounts.length > 0);

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden">
      {/* Customer details — Demo V2.2 left rail */}
      <aside className="flex w-72 shrink-0 flex-col overflow-y-auto px-3 py-4">
        <button
          type="button"
          onClick={onClose}
          className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-[#2C365D] transition-colors hover:bg-white/60 dark:text-[#00D2A2] dark:hover:bg-white/[0.06]"
        >
          <Icon name="arrow_back" size={18} />
          Back to reports
        </button>

        <div className="space-y-2">
          <Card className={cn("overflow-hidden border-0", GLASS_CARD)}>
            <CardContent className="p-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 rounded-full bg-amber-400/90 ring-2 ring-amber-400/40">
                    <AvatarFallback className="bg-transparent text-lg font-medium text-amber-950">
                      {customer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900">
                    <Icon name="check" size={10} className="text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-slate-100">
                    {customer.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{customer.id}</p>
                  <p className="text-sm text-gray-600 dark:text-slate-400">{customer.region}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("overflow-hidden border-0", GLASS_CARD)}>
            <CardContent className="p-4 pt-4">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">
                Account details
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2">
                  <Icon name="mail" size={14} className="mt-0.5 shrink-0 text-gray-300 dark:text-slate-600" />
                  <span className="break-all font-medium text-gray-800 dark:text-slate-200">
                    {customer.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="phone" size={14} className="text-gray-300 dark:text-slate-600" />
                  <span className="font-medium text-gray-800 dark:text-slate-200">{customer.phone}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 dark:text-slate-500">Preference</span>
                  <span className="font-medium text-gray-800 dark:text-slate-200">
                    {customer.preference}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 dark:text-slate-500">Marketing</span>
                  <span className="font-medium text-gray-800 dark:text-slate-200">
                    {customer.marketing}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn("overflow-hidden border-0", GLASS_CARD)}>
            <CardContent className="p-4 pt-4">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-slate-600">
                Contact history
              </p>
              <div className="space-y-2.5 text-xs">
                {[
                  { icon: "chat_bubble_outline" as const, label: "Created", date: customer.created },
                  { icon: "call" as const, label: "Last call", date: customer.lastCall },
                  { icon: "description" as const, label: "Last note", date: customer.lastNote },
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

          <Card
            className={cn(
              "overflow-hidden border",
              customer.payerTone === "warn"
                ? "border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
                : "border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10",
            )}
          >
            <CardContent className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <Icon
                  name="star"
                  size={20}
                  className={
                    customer.payerTone === "warn"
                      ? "text-red-600 dark:text-red-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    customer.payerTone === "warn"
                      ? "text-red-700 dark:text-red-300"
                      : "text-emerald-700 dark:text-emerald-300",
                  )}
                >
                  Payer Rating
                </span>
              </div>
              <span
                className={cn(
                  "text-sm font-semibold",
                  customer.payerTone === "warn"
                    ? "text-red-800 dark:text-red-200"
                    : "text-emerald-800 dark:text-emerald-200",
                )}
              >
                {customer.payerRating}
              </span>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Service addresses / account detail */}
      <div className="relative min-w-0 flex-1 overflow-y-auto bg-transparent">
        <div className="min-h-full w-full px-6 py-4">
          {selected ? (
            <Card className={cn("border-0", GLASS_CARD)}>
              <div className="sticky top-0 z-10 rounded-t-[inherit] bg-white/95 px-5 pt-4 backdrop-blur-md dark:bg-slate-900/90">
                <button
                  type="button"
                  onClick={() => setSelectedAddress(null)}
                  className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium text-[#2C365D] transition-colors hover:bg-gray-100 dark:text-[#00D2A2] dark:hover:bg-white/[0.06]"
                >
                  <Icon name="arrow_back" size={18} />
                  Service addresses
                </button>
                <div className="flex items-start justify-between gap-3.5 pb-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <Icon name="bolt" size={22} className="mt-0.5 text-[#2C365D] dark:text-[#00D2A2]" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                          {selected.address}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-slate-500">
                          <span>ESID: {selected.esid}</span>
                          <span>ACC#: {selected.accountNo}</span>
                          <span
                            className={cn(
                              "rounded-lg px-2 py-0.5 font-medium",
                              ACCOUNT_TYPE_META[selected.type].iconBg,
                            )}
                          >
                            {selected.type}
                          </span>
                        </div>
                        {selected.tags && selected.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selected.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={cn(
                                  "rounded-lg px-2 py-0.5 text-xs font-medium",
                                  tag.variant === "hardship"
                                    ? "text-red-700 dark:text-red-300"
                                    : "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300",
                                )}
                              >
                                {tag.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "rounded-lg px-2 py-0.5 text-xs font-medium",
                        selected.status === "CLOSED"
                          ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-600/40 dark:text-slate-400",
                      )}
                    >
                      {selected.status}
                    </span>
                    <span
                      className={cn(
                        "rounded-lg px-2 py-1 text-sm font-medium",
                        selected.isCredit || selected.balance === "$0.00"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
                      )}
                    >
                      {selected.balance}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-4 px-5 pb-5 pt-2">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ["Plan", selected.plan ?? "—"],
                    ["Brand", selected.brand],
                    ["Billing", selected.billing ?? "—"],
                    ["Next read", selected.scheduledRead ?? "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-gray-50 p-3.5 dark:bg-slate-800/40"
                    >
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">
                        {label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {value}
                      </p>
                      {label === "Billing" && selected.billingTo && (
                        <p className="mt-0.5 text-xs text-gray-500">{selected.billingTo}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["TDSP", selected.tdsp],
                    ["Fuel", selected.fuel],
                    ["Latest invoice", selected.invoiceAmount ?? "—"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-gray-100 p-3 dark:border-white/10"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                      <p className="mt-1 text-sm font-medium text-gray-800 dark:text-slate-200">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Image
                      src="/GlassLogoTest.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="h-5 w-5 object-contain dark:hidden"
                    />
                    <Image
                      src="/GlassLogoTest_darkmode.svg"
                      alt=""
                      width={22}
                      height={22}
                      className="hidden h-5 w-5 object-contain dark:block"
                    />
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                      Service addresses
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-500">
                    {customer.addresses.length}{" "}
                    {customer.addresses.length === 1 ? "account" : "accounts"} · open Glass to
                    review every site on this customer
                  </p>
                </div>
              </div>

              {sections.map((section) => (
                <div key={section.type} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                        section.iconBg,
                      )}
                    >
                      <Icon name={section.icon} size={19} />
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                      {section.type}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-slate-500">
                      {section.accounts.length}{" "}
                      {section.accounts.length === 1 ? "account" : "accounts"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {section.accounts.map((acc) => {
                      const balanceGreen = acc.isCredit || acc.balance === "$0.00";
                      return (
                        <Card
                          key={acc.address}
                          role="button"
                          tabIndex={0}
                          aria-label={`Open account ${acc.address}`}
                          className={cn(
                            "cursor-pointer overflow-hidden border-0 transition-all duration-200",
                            GLASS_CARD,
                            "hover:shadow-lg hover:shadow-[#00D2A2]/10",
                            acc.status === "CLOSED" && "opacity-70",
                          )}
                          onClick={() => setSelectedAddress(acc.address)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setSelectedAddress(acc.address);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 flex-1 items-start gap-3">
                                <Icon
                                  name="bolt"
                                  size={20}
                                  className="mt-0.5 shrink-0 text-[#2C365D] dark:text-[#00D2A2]"
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                    {acc.address}
                                  </p>
                                  <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-500">
                                    ESID: {acc.esid} · ACC#: {acc.accountNo}
                                  </p>
                                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                    <span
                                      className={cn(
                                        "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                                        ACCOUNT_TYPE_META[acc.type].iconBg,
                                      )}
                                    >
                                      {acc.type}
                                    </span>
                                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-white/10 dark:text-slate-400">
                                      {acc.tdsp}
                                    </span>
                                    {acc.tags?.map((tag) => (
                                      <span
                                        key={tag.label}
                                        className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                      >
                                        {tag.label}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="flex shrink-0 items-center gap-2">
                                <span
                                  className={cn(
                                    "rounded-lg px-2 py-0.5 text-xs font-medium",
                                    acc.status === "CLOSED"
                                      ? "bg-gray-50 text-gray-400 dark:bg-slate-700/30 dark:text-slate-500"
                                      : "bg-gray-100 text-gray-600 dark:bg-slate-600/40 dark:text-slate-400",
                                  )}
                                >
                                  {acc.status}
                                </span>
                                <span
                                  className={cn(
                                    "rounded-lg px-2 py-1 text-sm font-medium",
                                    balanceGreen
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
                                  )}
                                >
                                  {acc.balance}
                                </span>
                                <Icon
                                  name="chevron_right"
                                  size={20}
                                  className="text-gray-500 dark:text-slate-500"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ────────── Mock data — Customer base ────────── */

const CUSTOMER_KPIS = [
  { label: "Active customers", value: "248,410", note: "+510 since Sep 30", tone: "positive" as const },
  { label: "Net gains (30d)", value: "+5,173", note: "+12% vs prior month", tone: "positive" as const },
  { label: "Losses (30d)", value: "14,821", note: "Switch-outs 59%", tone: "negative" as const },
  { label: "Reconnect rate", value: "74.2%", note: "▼ 2.1 pts vs Aug", tone: "negative" as const },
  { label: "Avg tenure", value: "26 mo", note: "+1 mo vs prior year", tone: "neutral" as const },
];

const ATTENTION = [
  { tag: "Watch", owner: "CS", title: "Switch-outs elevated in Oncor", body: "Disconnect-related exits doubled week-over-week in North Texas. Review retention offers on fixed-term renewals." },
  { tag: "Note", owner: "Finance", title: "Payment plan balance up 8%", body: "Active plans sit at $2.4M. Validate before Finance closes the monthly pack." },
  { tag: "Data", owner: "Sales", title: "FL census lagging estimate", body: "Week-ending Oct 5 census is 1.8% under the rolling estimate. Confirm enrollment batch latency." },
];

const GAINS_LOSSES = [
  { month: "May", gains: 8200, losses: -4100, net: 4100 },
  { month: "Jun", gains: 9100, losses: -5200, net: 3900 },
  { month: "Jul", gains: 7800, losses: -6100, net: 1700 },
  { month: "Aug", gains: 10200, losses: -4800, net: 5400 },
  { month: "Sep", gains: 11400, losses: -6227, net: 5173 },
];

const CENSUS_SERIES = [
  { month: "May", census: 236200, estimate: null as number | null },
  { month: "Jun", census: 239400, estimate: null },
  { month: "Jul", census: 241100, estimate: null },
  { month: "Aug", census: 243200, estimate: null },
  { month: "Sep", census: 247900, estimate: null },
  { month: "Oct", census: 248410, estimate: 249200 },
  { month: "Nov", census: null, estimate: 251800 },
  { month: "Dec", census: null, estimate: 254400 },
];

const WHY_LEFT = [
  { reason: "Switched to another REP", value: 14821, pct: 59 },
  { reason: "Moved out", value: 4820, pct: 19 },
  { reason: "Cancelled", value: 2910, pct: 12 },
  { reason: "Non-pay disconnect", value: 1840, pct: 7 },
  { reason: "Other", value: 720, pct: 3 },
];

const WHERE_STATE = [
  { name: "FL", value: 68420, delta: "+1,240" },
  { name: "PA", value: 42110, delta: "+310" },
  { name: "OH", value: 38640, delta: "-180" },
  { name: "NJ", value: 29880, delta: "+90" },
  { name: "IL", value: 22140, delta: "+40" },
];

const WHERE_CONTRACT = [
  { name: "Fixed-term", value: 142800 },
  { name: "Month-to-month", value: 68420 },
  { name: "Expired", value: 22110 },
  { name: "Prepay", value: 15080 },
];

const WEEKLY_SIGNUPS = [
  { week: "Aug 8", live: 4200, left: 820, pending: 410 },
  { week: "Aug 15", live: 4680, left: 910, pending: 380 },
  { week: "Aug 22", live: 5100, left: 740, pending: 420 },
  { week: "Aug 29", live: 4920, left: 880, pending: 390 },
  { week: "Sep 5", live: 5380, left: 960, pending: 450 },
  { week: "Sep 12", live: 5610, left: 1020, pending: 410 },
  { week: "Sep 19", live: 5480, left: 990, pending: 430 },
  { week: "Sep 26", live: 5674, left: 1100, pending: 460 },
  { week: "Oct 3", live: 4120, left: 780, pending: 520 },
  { week: "Oct 10", live: 2100, left: 420, pending: 680 },
];

const DISCONNECT_RECONNECT = [
  { week: "Aug 8", disconnect: 2100, reconnect: 1680 },
  { week: "Aug 15", disconnect: 2280, reconnect: 1720 },
  { week: "Aug 22", disconnect: 1980, reconnect: 1810 },
  { week: "Aug 29", disconnect: 2400, reconnect: 1690 },
  { week: "Sep 5", disconnect: 2520, reconnect: 1740 },
  { week: "Sep 12", disconnect: 2680, reconnect: 1820 },
  { week: "Sep 19", disconnect: 2410, reconnect: 1900 },
  { week: "Sep 26", disconnect: 2750, reconnect: 1860 },
];

const RECONNECT_TDSP = [
  { name: "Oncor", aug: 82.1, sep: 74.3 },
  { name: "CenterPoint", aug: 78.4, sep: 76.1 },
  { name: "TNMP", aug: 75.2, sep: 71.8 },
  { name: "AEP Central", aug: 73.0, sep: 70.4 },
  { name: "AEP North", aug: 71.5, sep: 68.9 },
];

const PAYMENT_PLANS = [
  { group: "Active", plans: 18420, amount: 2410000, avg: 131 },
  { group: "Completed receipt", plans: 9200, amount: 980000, avg: 107 },
  { group: "Broken", plans: 2140, amount: 310000, avg: 145 },
  { group: "Pending setup", plans: 860, amount: 92000, avg: 107 },
];

/* ────────── Small UI helpers ────────── */

function ChartToggle({
  mode,
  onChange,
}: {
  mode: "chart" | "table";
  onChange: (m: "chart" | "table") => void;
}) {
  return (
    <div className="flex h-8 items-center gap-0.5 rounded-lg border border-gray-200/80 bg-gray-100/90 p-0.5 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.06]">
      {(["chart", "table"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
            mode === m
              ? "bg-white text-[#2C365D] shadow-sm dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]"
              : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

function CardChrome({
  title,
  subtitle,
  children,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn(GLASS_CARD, "shadow-none", className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-[#2C365D] dark:text-white">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {actions}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/[0.04] hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={`About ${title}`}
          >
            <Icon name="info" size={16} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-black/[0.04] hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label={`More for ${title}`}
          >
            <Icon name="more_vert" size={16} />
          </button>
        </div>
      </div>
      <CardContent className="pt-3">{children}</CardContent>
    </Card>
  );
}

function Sparkline({ values }: { values: readonly number[] }) {
  const data = values.map((v, i) => ({ i, v }));
  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="v" stroke="#94A3B8" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function FilterChip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-[120px] flex-1">
      <Select label={label} className="h-9 text-xs" defaultValue="all">
        {children}
      </Select>
    </div>
  );
}

function HorizontalBarRow({
  label,
  value,
  max,
  color,
  right,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  right: string;
}) {
  const pct = Math.max(4, (value / max) * 100);
  return (
    <div className="grid grid-cols-[140px_1fr_100px] items-center gap-3 py-1.5">
      <span className="truncate text-xs text-gray-700 dark:text-slate-300">{label}</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-right text-xs font-medium tabular-nums text-gray-800 dark:text-slate-200">
        {right}
      </span>
    </div>
  );
}

/* ────────── Texas — Overview ────────── */

function TexasOverview({
  onSelectInvoice,
  onOpenCustomer,
}: {
  onSelectInvoice: (id: string) => void;
  onOpenCustomer: (customerNo: string, name: string) => void;
}) {
  const [dailyGrain, setDailyGrain] = useState<"day" | "week" | "month">("day");
  const [tdspMode, setTdspMode] = useState<"chart" | "table">("chart");
  const [customerNo, setCustomerNo] = useState("C1048");

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className={cn(GLASS_PANEL, "rounded-xl p-4")}>
        <div className="flex flex-wrap items-end gap-3">
          <FilterChip label="Posted date">
            <option value="all">Jun 1 – Jun 30, 2026</option>
            <option value="may">May 1 – May 31, 2026</option>
          </FilterChip>
          <FilterChip label="Brand">
            <option value="all">All brands</option>
            <option value="gexa">Gexa Energy IX</option>
            <option value="frontier">Frontier Utilities</option>
            <option value="companion">Companion Energy</option>
          </FilterChip>
          <FilterChip label="TDSP">
            <option value="all">All TDSPs</option>
            <option value="centerpoint">CenterPoint</option>
            <option value="oncor">Oncor</option>
            <option value="tnmp">TNMP</option>
          </FilterChip>
          <FilterChip label="Customer type">
            <option value="all">All types</option>
            <option value="resi">Residential</option>
            <option value="smb">Small commercial</option>
          </FilterChip>
          <FilterChip label="Bill cycle">
            <option value="all">All cycles</option>
            <option value="01">01</option>
            <option value="15">15</option>
            <option value="28">28</option>
          </FilterChip>
          <FilterChip label="Account status">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="final">Final</option>
          </FilterChip>
          <FilterChip label="Final invoice">
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </FilterChip>
          <div className="min-w-[120px] flex-1">
            <Input
              label="Customer no."
              value={customerNo}
              onChange={(e) => setCustomerNo(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <Button variant="outline" size="sm" className="mb-0.5">
            Reset
          </Button>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
          60 invoices from 06/01/2026 to 06/30/2026 — presets count back from the latest posted invoice (Jul 14, 2026).
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className={cn(GLASS_CARD, "shadow-none")}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                  {kpi.label}
                </p>
                <Icon name="info" size={14} className="text-gray-300 dark:text-slate-600" />
              </div>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#2C365D] dark:text-white">
                {kpi.value}
              </p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <Sparkline values={kpi.spark} />
                <p className="text-[11px] font-medium text-[#C40000]">
                  ▼ {kpi.delta}
                  <span className="block font-normal text-gray-400 dark:text-slate-500">
                    vs May 1 – May 31
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome title="Net charges by component" subtitle="$9,410 charge components">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-[200px] w-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COMPONENT_BREAKDOWN}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {COMPONENT_BREAKDOWN.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Amount"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-semibold text-[#2C365D] dark:text-white">$9,410</span>
                <span className="text-[10px] text-gray-500">Components</span>
              </div>
            </div>
            <div className="w-full flex-1 space-y-2">
              {COMPONENT_BREAKDOWN.map((row) => (
                <div key={row.name} className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: row.color }} />
                    <span className="text-gray-700 dark:text-slate-300">{row.name}</span>
                  </div>
                  <span className="tabular-nums font-medium text-gray-900 dark:text-white">
                    ${row.value.toLocaleString()} · {row.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-4 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-slate-400">
            Charge components $9,410 − Credits $227 = Net charges $9,183
            <span className="inline-flex items-center gap-0.5 font-medium text-[#008000] dark:text-[#00D2A2]">
              <Icon name="check_circle" size={14} /> reconciles
            </span>
          </p>
        </CardChrome>

        <CardChrome
          title="Net charges by TDSP"
          actions={<ChartToggle mode={tdspMode} onChange={setTdspMode} />}
        >
          {tdspMode === "chart" ? (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TDSP_BARS} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
                  <XAxis type="number" tick={{ fill: CHART.axis, fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fill: CHART.axis, fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, "Net charges"]}
                    contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                  />
                  <Bar dataKey="value" fill={CHART.navy} radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TDSP</TableHead>
                  <TableHead className="text-right">Net charges</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TDSP_BARS.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      ${row.value.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardChrome>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome
          title="Daily net charges"
          actions={
            <div className="flex h-8 items-center gap-0.5 rounded-lg border border-gray-200/80 bg-gray-100/90 p-0.5 dark:border-white/[0.08] dark:bg-white/[0.06]">
              {(["day", "week", "month"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setDailyGrain(g)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                    dailyGrain === g
                      ? "bg-white text-[#2C365D] shadow-sm dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]"
                      : "text-gray-500 dark:text-slate-400",
                  )}
                >
                  {g === "day" ? "Day · auto" : g}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_NET}>
                <defs>
                  <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.navy} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={CHART.navy} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: CHART.axis, fontSize: 10 }}
                  interval={4}
                />
                <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Net charges"]}
                  contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="charges"
                  stroke={CHART.navy}
                  fill="url(#dailyFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardChrome>

        <CardChrome title="Components by brand" subtitle="Energy · TDSP · Base · Fees">
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BRAND_STACK} layout="vertical" margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: CHART.axis, fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="brand"
                  width={120}
                  tick={{ fill: CHART.axis, fontSize: 11 }}
                />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="energy" stackId="a" fill={CHART.energy} barSize={16} />
                <Bar dataKey="tdsp" stackId="a" fill={CHART.tdsp} barSize={16} />
                <Bar dataKey="base" stackId="a" fill={CHART.base} barSize={16} />
                <Bar dataKey="fees" stackId="a" fill={CHART.fees} radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardChrome>
      </div>

      {/* Invoices table */}
      <Card className={cn(GLASS_CARD, "shadow-none")}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[#2C365D] dark:text-white">Invoices</h3>
            <Badge className="rounded-md bg-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:bg-white/10 dark:text-slate-300">
              60 rows
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon name="view_column" size={16} className="mr-1.5" />
              Columns
            </Button>
            <Button variant="success" size="sm">
              <Icon name="download" size={16} className="mr-1.5" />
              Export
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 dark:bg-white/[0.04]">
                {[
                  "Invoice",
                  "Status",
                  "Post date",
                  "Customer no.",
                  "Customer",
                  "Brand",
                  "TDSP",
                  "Bill cycle",
                  "Usage kWh",
                  "Energy",
                  "TDSP charges",
                  "Net",
                ].map((h) => (
                  <TableHead key={h} className="whitespace-nowrap text-xs">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((row, i) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "cursor-pointer",
                    i % 2 === 1 && "bg-gray-50/50 dark:bg-white/[0.02]",
                  )}
                  onClick={() => onSelectInvoice(row.id)}
                >
                  <TableCell>
                    <button
                      type="button"
                      className="font-medium text-[#0074C4] hover:underline dark:text-[#00D2A2]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInvoice(row.id);
                      }}
                    >
                      {row.id}
                    </button>
                  </TableCell>
                  <TableCell>
                    {row.status === "REVERSED" ? (
                      <Badge
                        variant="warning"
                        className="rounded-md bg-[#FFF4E6] text-[10px] font-semibold uppercase text-[#C53B00] dark:bg-[#C53B00]/20 dark:text-[#FBD89D]"
                      >
                        Reversed
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-500">Posted</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{row.post}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="text-xs font-medium text-[#0074C4] hover:underline dark:text-[#00D2A2]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCustomer(row.customer, row.name);
                        }}
                      >
                        {row.customer}
                      </button>
                      <GlassIconButton
                        label={`Open ${row.name} in Glass`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCustomer(row.customer, row.name);
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[160px] truncate text-xs">
                    <button
                      type="button"
                      className="truncate text-left hover:text-[#0074C4] hover:underline dark:hover:text-[#00D2A2]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCustomer(row.customer, row.name);
                      }}
                    >
                      {row.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs">{row.brand}</TableCell>
                  <TableCell className="text-xs">{row.tdsp}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.cycle}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.usage}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.energy}</TableCell>
                  <TableCell className="text-xs tabular-nums">{row.tdspAmt}</TableCell>
                  <TableCell className="text-xs font-semibold tabular-nums">{row.net}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────── Texas — Billing review ────────── */

function TexasBillingReview() {
  return (
    <div className="space-y-4">
      <div className={cn(GLASS_PANEL, "rounded-xl p-4")}>
        <div className="flex flex-wrap items-end gap-3">
          <FilterChip label="Posting day">
            <option value="all">All posting days</option>
            <option value="jun">June 2026</option>
          </FilterChip>
          <FilterChip label="Brand">
            <option value="all">All brands</option>
          </FilterChip>
          <FilterChip label="TDSP">
            <option value="all">All TDSPs</option>
          </FilterChip>
          <FilterChip label="Customer type">
            <option value="all">All types</option>
          </FilterChip>
          <FilterChip label="Bill cycle">
            <option value="all">All cycles</option>
          </FilterChip>
          <FilterChip label="Account status">
            <option value="all">All statuses</option>
          </FilterChip>
          <FilterChip label="Final invoice">
            <option value="all">Any</option>
          </FilterChip>
          <div className="min-w-[120px] flex-1">
            <Input label="Customer no." defaultValue="" placeholder="Search…" className="h-9 text-xs" />
          </div>
          <Button variant="outline" size="sm">
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {REVIEW_STATS.map((stat) => (
          <Card key={stat.label} className={cn(GLASS_CARD, "shadow-none")}>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {stat.label}
              </p>
              <p
                className={cn(
                  "mt-2 text-3xl font-semibold tracking-tight",
                  stat.tone === "warn" && "text-[#C53B00]",
                  stat.tone === "info" && "text-[#0074C4]",
                  stat.tone === "neutral" && "text-[#2C365D] dark:text-white",
                )}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <CardChrome title="Posting days" subtitle="Invoice volume by day · darker = more invoices">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {HEATMAP.map((col) => (
            <div key={col.month} className="min-w-[72px]">
              <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {col.month}
              </p>
              <div className="grid grid-cols-7 gap-0.5">
                {col.days.map((v, i) => (
                  <div
                    key={i}
                    title={v == null ? undefined : `${col.month} · ${v} invoices`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-[2px]",
                      v == null && "bg-transparent",
                      v === 0 && "bg-gray-100 dark:bg-white/5",
                      v != null && v > 0 && v < 3 && "bg-emerald-100 dark:bg-emerald-500/20",
                      v != null && v >= 3 && v < 5 && "bg-emerald-300 dark:bg-emerald-500/45",
                      v != null && v >= 5 && "bg-emerald-500 dark:bg-emerald-400",
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardChrome>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <Card className={cn(GLASS_CARD, "shadow-none")}>
          <CardContent className="space-y-5 p-4">
            {REVIEW_CHECKS.map((group) => (
              <div key={group.group}>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {group.group}
                </p>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
                    >
                      <div className="flex items-start gap-2">
                        <Icon
                          name={item.done ? "check_circle" : "radio_button_unchecked"}
                          size={16}
                          className={item.done ? "mt-0.5 text-[#008000] dark:text-[#00D2A2]" : "mt-0.5 text-gray-300"}
                        />
                        <span className="text-xs text-gray-700 dark:text-slate-300">{item.name}</span>
                      </div>
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-gray-500">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={cn(GLASS_CARD, "shadow-none")}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#2C365D] dark:text-white">All invoices</h3>
              <Badge className="rounded-md bg-gray-100 text-[10px] font-semibold uppercase text-gray-600 dark:bg-white/10 dark:text-slate-300">
                60
              </Badge>
            </div>
            <Button size="sm" className="bg-[#0F6B4D] text-white hover:bg-[#0c5a41]">
              <Icon name="download" size={16} className="mr-1.5" />
              Export for review
            </Button>
          </div>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 dark:bg-white/[0.04]">
                  {["Invoice no.", "Checks", "Customer no.", "Customer", "Brand", "Delivery", "Issue", "Action", "By"].map(
                    (h) => (
                      <TableHead key={h} className="whitespace-nowrap text-xs">
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {INVOICES.map((row, i) => (
                  <TableRow key={row.id} className={i % 2 === 1 ? "bg-gray-50/50 dark:bg-white/[0.02]" : undefined}>
                    <TableCell className="text-xs font-medium text-[#0074C4] dark:text-[#00D2A2]">
                      {row.id}
                    </TableCell>
                    <TableCell>
                      {row.status === "REVERSED" ? (
                        <Badge variant="warning" className="rounded-md bg-[#FFF4E6] text-[10px] text-[#C53B00]">
                          Reverse
                        </Badge>
                      ) : (
                        <Icon name="check_circle" size={16} className="text-[#008000] dark:text-[#00D2A2]" />
                      )}
                    </TableCell>
                    <TableCell className="text-xs">{row.customer}</TableCell>
                    <TableCell className="max-w-[140px] truncate text-xs">{row.name}</TableCell>
                    <TableCell className="text-xs">{row.brand}</TableCell>
                    <TableCell className="text-xs">{row.tdsp}</TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {row.status === "REVERSED" ? "Reversal posted" : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {["Pass", "Hold", "Pull", "Reverse"].map((a) => (
                          <button
                            key={a}
                            type="button"
                            className="rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 hover:bg-gray-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">—</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ────────── Customer base ────────── */

function CustomerBaseReport() {
  const [gainsMode, setGainsMode] = useState<"chart" | "table">("chart");
  const [censusMode, setCensusMode] = useState<"chart" | "table">("chart");
  const maxWhy = WHY_LEFT[0].value;
  const maxState = WHERE_STATE[0].value;
  const maxContract = WHERE_CONTRACT[0].value;
  const maxPlanAmt = PAYMENT_PLANS[0].amount;

  return (
    <div className="space-y-4">
      <div className={cn(GLASS_PANEL, "rounded-xl p-4")}>
        <div className="flex flex-wrap items-end gap-3">
          <FilterChip label="State">
            <option value="all">All states</option>
            <option value="tx">TX</option>
            <option value="fl">FL</option>
            <option value="pa">PA</option>
          </FilterChip>
          <FilterChip label="Product">
            <option value="all">All products</option>
            <option value="fixed">Fixed</option>
            <option value="variable">Variable</option>
          </FilterChip>
          <FilterChip label="Contract type">
            <option value="all">All contracts</option>
            <option value="fixed">Fixed-term</option>
            <option value="mtm">Month-to-month</option>
          </FilterChip>
          <FilterChip label="TDSP">
            <option value="all">All TDSPs</option>
          </FilterChip>
          <FilterChip label="Compare">
            <option value="mom">vs prior month</option>
            <option value="yoy">vs prior year</option>
          </FilterChip>
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Icon name="download" size={16} className="mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {CUSTOMER_KPIS.map((kpi) => (
          <Card key={kpi.label} className={cn(GLASS_CARD, "shadow-none")}>
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                {kpi.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-[#2C365D] dark:text-white">
                {kpi.value}
              </p>
              <p
                className={cn(
                  "mt-1 text-xs",
                  kpi.tone === "positive" && "text-[#008000] dark:text-[#00D2A2]",
                  kpi.tone === "negative" && "text-[#C40000]",
                  kpi.tone === "neutral" && "text-gray-500 dark:text-slate-400",
                )}
              >
                {kpi.note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className={cn(GLASS_PANEL, "rounded-xl p-4")}>
        <h3 className="mb-3 text-sm font-semibold text-[#2C365D] dark:text-white">Needs attention</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {ATTENTION.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-gray-200/80 bg-white/70 p-4 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase",
                    item.tag === "Watch" && "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                    item.tag === "Note" && "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
                    item.tag === "Data" && "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300",
                  )}
                >
                  <Icon
                    name={item.tag === "Watch" ? "warning" : item.tag === "Note" ? "info" : "database"}
                    size={12}
                  />
                  {item.tag}
                </span>
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-white/10">
                  {item.owner}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-slate-400">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome
          title="Gains and losses by month"
          subtitle="Net movement · teal gains / orange losses"
          actions={<ChartToggle mode={gainsMode} onChange={setGainsMode} />}
        >
          {gainsMode === "chart" ? (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={GAINS_LOSSES}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="month" tick={{ fill: CHART.axis, fontSize: 11 }} />
                  <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                  <Bar dataKey="gains" fill={CHART.gain} radius={[4, 4, 0, 0]} barSize={18} />
                  <Bar dataKey="losses" fill={CHART.loss} radius={[0, 0, 4, 4]} barSize={18} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Gains</TableHead>
                  <TableHead className="text-right">Losses</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {GAINS_LOSSES.map((r) => (
                  <TableRow key={r.month}>
                    <TableCell>{r.month}</TableCell>
                    <TableCell className="text-right tabular-nums text-[#14B69D]">
                      +{r.gains.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-[#D86327]">
                      {r.losses.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      +{r.net.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardChrome>

        <CardChrome
          title="Texas customers, month-end and estimate"
          subtitle="Solid = census · dashed = estimate"
          actions={<ChartToggle mode={censusMode} onChange={setCensusMode} />}
        >
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CENSUS_SERIES}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="month" tick={{ fill: CHART.axis, fontSize: 11 }} />
                <YAxis
                  domain={["dataMin - 2000", "dataMax + 2000"]}
                  tick={{ fill: CHART.axis, fontSize: 11 }}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="census"
                  stroke={CHART.navy}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: CHART.navy }}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="estimate"
                  stroke={CHART.navy}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 3, fill: "#fff", stroke: CHART.navy, strokeWidth: 2 }}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardChrome>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome title="Why customers left, September" subtitle="Switch-outs are 59% of exits">
          <div className="space-y-1">
            {WHY_LEFT.map((row) => (
              <HorizontalBarRow
                key={row.reason}
                label={row.reason}
                value={row.value}
                max={maxWhy}
                color={CHART.loss}
                right={`${row.value.toLocaleString()} · ${row.pct}%`}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-slate-400">
            Disconnect-related exits doubled week-over-week in Oncor territory.
          </p>
        </CardChrome>

        <CardChrome title="Where customers are" subtitle="Oct 5 census">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            By state
          </p>
          {WHERE_STATE.map((row) => (
            <HorizontalBarRow
              key={row.name}
              label={row.name}
              value={row.value}
              max={maxState}
              color={CHART.navy}
              right={`${row.value.toLocaleString()} (${row.delta})`}
            />
          ))}
          <p className="mb-1 mt-4 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            By contract type · all states
          </p>
          {WHERE_CONTRACT.map((row) => (
            <HorizontalBarRow
              key={row.name}
              label={row.name}
              value={row.value}
              max={maxContract}
              color={CHART.navy}
              right={row.value.toLocaleString()}
            />
          ))}
        </CardChrome>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome title="Weekly sign-ups and where they are now" subtitle="Live · Already left · Pending">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_SIGNUPS}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="week" tick={{ fill: CHART.axis, fontSize: 10 }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="live" stackId="a" fill={CHART.navy} barSize={18} />
                <Bar dataKey="left" stackId="a" fill={CHART.loss} barSize={18} />
                <Bar dataKey="pending" stackId="a" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardChrome>

        <CardChrome title="Disconnects and reconnects by week">
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISCONNECT_RECONNECT}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="week" tick={{ fill: CHART.axis, fontSize: 10 }} />
                <YAxis tick={{ fill: CHART.axis, fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="disconnect" fill={CHART.loss} radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="reconnect" fill={CHART.reconnect} radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardChrome>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <CardChrome title="Reconnect rate by TDSP" subtitle="August → September">
          <div className="space-y-3">
            {RECONNECT_TDSP.map((row) => {
              const drop = (row.aug - row.sep).toFixed(1);
              const left = ((row.aug - 60) / 25) * 100;
              const right = ((row.sep - 60) / 25) * 100;
              return (
                <div key={row.name} className="grid grid-cols-[100px_1fr_90px] items-center gap-3">
                  <span className="truncate text-xs text-gray-700 dark:text-slate-300">{row.name}</span>
                  <div className="relative h-3">
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200 dark:bg-white/10" />
                    <div
                      className="absolute top-1/2 h-px -translate-y-1/2 bg-[#2C365D]/40"
                      style={{
                        left: `${Math.min(left, right)}%`,
                        width: `${Math.abs(right - left)}%`,
                      }}
                    />
                    <span
                      className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#2C365D] bg-white"
                      style={{ left: `${left}%` }}
                    />
                    <span
                      className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2C365D]"
                      style={{ left: `${right}%` }}
                    />
                  </div>
                  <span className="text-right text-xs tabular-nums text-gray-700 dark:text-slate-300">
                    {row.sep}%{" "}
                    <span className="text-[#C40000]">▼ {drop} pts</span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardChrome>

        <CardChrome title="Payment plans" subtitle="Data check before Finance relies on it">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Plans</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Avg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENT_PLANS.map((row) => (
                <TableRow key={row.group}>
                  <TableCell className="text-xs font-medium">{row.group}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">
                    {row.plans.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#2C365D]"
                          style={{ width: `${(row.amount / maxPlanAmt) * 100}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-xs tabular-nums">
                        ${(row.amount / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-xs tabular-nums">${row.avg}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardChrome>
      </div>
    </div>
  );
}

/* ────────── Invoice drawer ────────── */

function InvoiceDrawer({
  open,
  onClose,
  onOpenCustomer,
}: {
  open: boolean;
  onClose: () => void;
  onOpenCustomer: (customerNo: string, name: string) => void;
}) {
  if (!open) return null;
  const inv = SELECTED_INVOICE;
  return (
    <aside
      className={cn(
        GLASS_PANEL,
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l shadow-2xl sm:rounded-none",
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-white/10">
        <div>
          <p className="text-xs text-gray-500">Invoice {inv.id}</p>
          <div className="mt-0.5 flex items-center gap-2">
            <h2 className="text-base font-semibold text-[#2C365D] dark:text-white">
              {inv.customer}
            </h2>
            <GlassIconButton
              label={`Open ${inv.customer} in Glass`}
              onClick={() => onOpenCustomer(inv.customerNo, inv.customer)}
            />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="text-xs font-medium text-[#0074C4] hover:underline dark:text-[#00D2A2]"
              onClick={() => onOpenCustomer(inv.customerNo, inv.customer)}
            >
              {inv.customerNo}
            </button>
            <Badge className="rounded-md bg-[#2C365D]/10 text-[10px] font-semibold text-[#2C365D] dark:bg-white/10 dark:text-white">
              {inv.brand}
            </Badge>
            <Badge
              variant="warning"
              className="rounded-md bg-[#FFF4E6] text-[10px] font-semibold text-[#C53B00]"
            >
              {inv.status}
            </Badge>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-black/[0.04] hover:text-gray-700 dark:hover:bg-white/10"
          aria-label="Close invoice"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            Amount due
          </p>
          <p className="mt-1 text-3xl font-semibold text-[#2C365D] dark:text-white">
            {inv.amountDue}
          </p>
          <p className="mt-1 text-xs text-gray-500">Due {inv.due}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            ["Posted", inv.posted],
            ["Due", inv.due],
            ["Service period", inv.service],
            ["Usage", inv.usage],
            ["TDSP", inv.tdsp],
            ["Bill cycle", inv.cycle],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-gray-100 p-2.5 dark:border-white/10">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{k}</p>
              <p className="mt-1 font-medium text-gray-800 dark:text-slate-200">{v}</p>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-[#2C365D] dark:text-white">Line items</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Net</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inv.lines.map((line) => (
                <TableRow key={line.desc}>
                  <TableCell className="text-xs">{line.desc}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{line.net}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">{line.tax}</TableCell>
                  <TableCell className="text-right text-xs font-medium tabular-nums">
                    {line.total}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 p-4 dark:border-white/10">
        <Button variant="outline" size="sm" className="flex-1">
          <Icon name="picture_as_pdf" size={16} className="mr-1.5" />
          Invoice PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onOpenCustomer(inv.customerNo, inv.customer)}
        >
          <Image
            src="/GlassLogoTest.svg"
            alt=""
            width={16}
            height={16}
            className="mr-1.5 h-4 w-4 object-contain dark:hidden"
          />
          <Image
            src="/GlassLogoTest_darkmode.svg"
            alt=""
            width={16}
            height={16}
            className="mr-1.5 hidden h-4 w-4 object-contain dark:block"
          />
          Open in Glass
        </Button>
      </div>
    </aside>
  );
}

/* ────────── Right insight panel (Adora + X-Sell; Companion separate) ────────── */

const PANEL_TABS = ["Adora", "X-Sell"] as const;
type PanelTab = (typeof PANEL_TABS)[number];
const PANEL_TAB_ICONS: Record<PanelTab, string> = {
  Adora: "auto_awesome",
  "X-Sell": "add_shopping_cart",
};

const XSELL_CARD =
  "rounded-xl border border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-white/[0.12] dark:bg-white/[0.08]";

const BROADBAND_PLANS = [
  {
    name: "Galileo",
    logo: "/broadband/Galileo.svg",
    cost: "$68/mth",
    speed: "25 Mbps",
    data: "Unlimited",
    description:
      "A solid all-rounder for everyday use. Perfect for emails, streaming, and keeping up with the news.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Luminary",
    logo: "/broadband/Luminary.svg",
    cost: "$98/mth",
    speed: "100 Mbps",
    data: "Unlimited",
    description:
      "Made for households that stream, game, and stay connected. Built to handle multiple devices.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "3Portals",
    logo: "/broadband/3Portals.svg",
    cost: "$75/mth",
    speed: "50 Mbps",
    data: "Unlimited",
    description: "A great mix of speed and value for busy homes.",
    features: ["No contract", "$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Ollio",
    logo: "/broadband/Ollio.svg",
    cost: "$120/mth",
    speed: "240 Mbps",
    data: "Unlimited",
    description: "Premium speed for homes that stream in 4K, game, and video call.",
    features: ["$0 Setup Fee", "Unlimited data"],
  },
  {
    name: "Photon",
    logo: null as string | null,
    icon: "bolt",
    iconBg: "bg-amber-500",
    cost: "$55/mth",
    speed: "12 Mbps",
    data: "500 GB",
    description: "An affordable entry plan for light users.",
    features: ["No contract", "$0 Setup Fee"],
  },
  {
    name: "Vertex",
    logo: null as string | null,
    icon: "wifi",
    iconBg: "bg-sky-500",
    cost: "$85/mth",
    speed: "50 Mbps",
    data: "Unlimited",
    description: "Reliable mid-tier speed for hybrid work and streaming.",
    features: ["No contract", "14 day trial", "Unlimited data"],
  },
] as const;

type AdoraContext = {
  contentNav: "home" | "operations" | "reports";
  report: ReportKey | null;
  texasTab: TexasTab;
};

function getAdoraInsight(ctx: AdoraContext) {
  if (ctx.contentNav === "home") {
    return {
      title: "Ready to review the US packs",
      body: "Finance and customer-base proofs of concept are available in Reports. Start with Texas revenue detail if you’re validating invoice integrity this cycle.",
      next: "Open Reports and select Texas revenue detail.",
      bullets: [
        "Texas revenue detail includes Overview and Billing review.",
        "Customer base covers gains, losses, and reconnect performance.",
        "Data freshness badges show when each pack last ran.",
      ],
    };
  }
  if (ctx.contentNav === "operations") {
    return {
      title: "Operations workspace is a stub in this PoC",
      body: "Exception queues and work items will land here. Until then, Billing review on Texas revenue is the closest operational checklist.",
      next: "Jump to Texas revenue → Billing review to clear the reversal flag.",
      bullets: [
        "1 reversal is flagged in the current Jun pack.",
        "Likely-error and review-list checks currently reconcile to zero.",
        "Export for review is available from the All invoices table.",
      ],
    };
  }
  if (ctx.report == null) {
    return {
      title: "Pick a report to ground Adora",
      body: "Select Texas revenue detail or Customer base. Adora will summarise drivers, risks, and next actions for the open pack.",
      next: "Open Texas revenue detail for invoice and charge component review.",
      bullets: [
        "Finance packs surface charge mix and TDSP concentration.",
        "Customer packs surface switch-outs and reconnect rate movement.",
        "Use All reports anytime to switch context.",
      ],
    };
  }
  if (ctx.report === "customer-base") {
    return {
      title: "Switch-outs elevated; reconnect rate soft",
      body: "Net gains remain positive (+5,173 / 30d) but losses are concentrated in switch-outs (59%). Reconnect rate fell 2.1 pts vs August, led by Oncor.",
      next: "Prioritise Oncor retention offers and validate the FL census lag with Sales.",
      bullets: [
        "Watch: disconnect-related exits doubled week-over-week in Oncor.",
        "Note: payment-plan balance up ~8% — confirm before Finance close.",
        "Data: FL census ~1.8% under rolling estimate as of Oct 5.",
      ],
    };
  }
  if (ctx.texasTab === "billing-review") {
    return {
      title: "Billing review is clear aside from one reversal",
      body: "Likely-error and review-list checks are complete with zero open items. One reversal remains in the Jun posting window for customer C1048.",
      next: "Open invoice 33014185, confirm the reverse of 33014166, then Pass or Hold.",
      bullets: [
        "Reversals this period: 1.",
        "No negative-usage or tax-base mismatches detected.",
        "Export for review is ready if Finance wants a pack sign-off.",
      ],
    };
  }
  return {
    title: "Net charges down sharply vs May — filter context matters",
    body: "June net charges of $9,183 are ~71% below May. With customer C1048 in the filter, the period is a thin slice (60 invoices / 16 MWh). Charge components reconcile after $227 credits.",
    next: "Clear or widen the Customer no. filter, then re-check TDSP concentration on CenterPoint.",
    bullets: [
      "Energy usage is 62.5% of charge components ($5,885).",
      "CenterPoint leads TDSP net charges in the filtered set.",
      "Two reversed invoices appear in the table — open Billing review to disposition.",
    ],
  };
}

function CrossSellPanel({
  xSellView,
  setXSellView,
}: {
  xSellView: string | null;
  setXSellView: (v: string | null) => void;
}) {
  if (xSellView === "broadband") {
    return (
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
            <div key={plan.name} className={cn("overflow-hidden", XSELL_CARD)}>
              <div className="p-3.5">
                <div className="mb-2.5 flex items-center gap-2.5">
                  {plan.logo ? (
                    <Image src={plan.logo} alt={plan.name} width={120} height={40} className="h-7 w-auto" />
                  ) : (
                    <>
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white",
                          "iconBg" in plan ? plan.iconBg : "bg-sky-500",
                        )}
                      >
                        <Icon name={"icon" in plan ? plan.icon : "public"} size={16} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-gray-900 dark:text-slate-100">
                        {plan.name}
                      </span>
                    </>
                  )}
                </div>
                <div className="mb-2.5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-gray-200/80 dark:border-white/[0.08]">
                  {(
                    [
                      ["Cost", plan.cost],
                      ["Speed", plan.speed],
                      ["Data", plan.data],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label} className="bg-gray-50 px-2 py-1.5 text-center dark:bg-white/[0.04]">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        {label}
                      </p>
                      <p className="text-xs font-bold text-gray-900 dark:text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mb-2.5 text-[11px] leading-relaxed text-gray-600 dark:text-slate-400">
                  {plan.description}
                </p>
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
    );
  }

  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-3.5 py-3.5">
      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Active Services
        </p>
        <div className="space-y-2">
          {(
            [
              {
                icon: "bolt" as const,
                iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300",
                service: "Electricity",
                provider: "Gexa Energy IX",
                plan: "Texas Fixed 12",
                status: "Connected",
              },
              {
                icon: "local_fire_department" as const,
                iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300",
                service: "Gas",
                provider: "Frontier Utilities",
                plan: "Month-to-month",
                status: "Connected",
              },
            ] as const
          ).map((s) => (
            <button
              key={s.service}
              type="button"
              className={cn(
                "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]",
                XSELL_CARD,
              )}
            >
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {s.status}
                  </span>
                </div>
                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.provider}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.plan}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          Services available to this site
        </p>
        <div className="space-y-2">
          {(
            [
              {
                icon: "wifi" as const,
                iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300",
                service: "Broadband",
                headline: "6 broadband plans available",
                sub: "Plans from $68/month",
                badge: null as string | null,
                action: "broadband" as string | null,
              },
              {
                icon: "solar_power" as const,
                iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300",
                service: "Solar",
                headline: "7 Exclusive Solar offers available",
                sub: "Offers starting at $4,500",
                badge: null,
                action: null,
              },
              {
                icon: "battery_charging_full" as const,
                iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300",
                service: null as string | null,
                headline: "2026 Home battery subsidies available",
                sub: "Check eligibility",
                badge: "New",
                action: null,
              },
            ] as const
          ).map((s) => (
            <button
              key={s.headline}
              type="button"
              onClick={() => s.action && setXSellView(s.action)}
              className={cn(
                "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]",
                XSELL_CARD,
              )}
            >
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {s.service && (
                    <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                  )}
                  {s.badge && (
                    <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.headline}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.sub}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
          MIMO Services
        </p>
        <div className="space-y-2">
          {(
            [
              {
                icon: "cleaning_services" as const,
                iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300",
                service: "Cleaning",
                headline: "3 cleaning services available",
                sub: "Starting at $650",
              },
              {
                icon: "local_shipping" as const,
                iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300",
                service: "Removals",
                headline: "11 removal services available",
                sub: "From $1200",
              },
            ] as const
          ).map((s) => (
            <button
              key={s.service}
              type="button"
              className={cn(
                "flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.04]",
                XSELL_CARD,
              )}
            >
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-gray-500 dark:text-slate-400">{s.service}</span>
                <p className="text-[13px] font-semibold text-gray-900 dark:text-slate-100">{s.headline}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-500">{s.sub}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-gray-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdoraPanel({
  open,
  onOpenChange,
  context,
  companionOpen,
  onOpenCompanion,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: AdoraContext;
  companionOpen: boolean;
  onOpenCompanion: () => void;
}) {
  const insight = getAdoraInsight(context);
  const [activeTab, setActiveTab] = useState<PanelTab>("Adora");
  const [xSellView, setXSellView] = useState<string | null>(null);

  const openTab = (tab: PanelTab) => {
    setActiveTab(tab);
    if (tab !== "X-Sell") setXSellView(null);
    onOpenChange(true);
  };

  return (
    <aside
      className={cn(
        "shrink-0 overflow-hidden transition-[width,padding] duration-300 ease-in-out",
        IOS_CHROME_CLASS,
        open ? "w-80 p-3" : "w-14 py-4",
      )}
      aria-label="Insight panel"
    >
      {!open ? (
        <div className="flex h-full flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => openTab(tab)}
                aria-label={`Open ${tab}`}
                title={tab}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  activeTab === tab
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-slate-100",
                )}
              >
                <Icon name={PANEL_TAB_ICONS[tab]} size={20} />
                {tab === "Adora" ? (
                  <span
                    aria-hidden
                    className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:bg-emerald-400"
                  />
                ) : null}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onOpenCompanion}
            aria-label="Open Companion"
            title="Companion"
            className={cn(
              "group relative mt-auto flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              companionOpen
                ? "bg-orange-50 text-[#E65100] dark:bg-orange-500/15 dark:text-orange-300"
                : "text-gray-500 hover:bg-orange-50 hover:text-[#E65100] dark:text-slate-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-300",
            )}
          >
            <CompanionCompactIcon />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            GLASS_CARD,
            "flex h-full min-w-[290px] flex-col overflow-hidden rounded-xl shadow-none",
          )}
        >
          <div className="flex items-center gap-1 px-3 pb-2 pt-3">
            <div className="flex flex-1 gap-1">
              {PANEL_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => openTab(tab)}
                  className={cn(
                    "whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                    activeTab === tab
                      ? "bg-gray-100 text-[#2C365D] dark:bg-white/[0.1] dark:text-[#00D2A2]"
                      : "text-gray-400 hover:text-gray-600 dark:text-slate-600 dark:hover:text-slate-400",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/[0.06] dark:hover:text-slate-300"
              aria-label="Collapse insight panel"
            >
              <Icon name="right_panel_close" size={16} />
            </button>
          </div>

          {activeTab === "Adora" && (
            <div className="flex flex-1 flex-col overflow-y-auto px-3.5 py-3.5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Image src="/Adora.svg" alt="Adora" width={72} height={32} className="h-5 w-auto" />
                <Badge
                  className="rounded-md border border-[#00D2A2]/40 bg-[#00D2A2]/10 text-[10px] font-medium text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]"
                >
                  Insight
                </Badge>
              </div>

              <div className="mb-3 rounded-lg bg-gray-100/90 px-2.5 py-2 dark:bg-white/[0.06]">
                <p className="text-[11px] leading-relaxed text-gray-600 dark:text-slate-400">
                  Context updates as you move between Home, Operations, and open reports.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="mb-2 flex items-center gap-1.5">
                  <Icon name="auto_awesome" size={16} className="text-emerald-700 dark:text-emerald-300" />
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {insight.title}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                  {insight.body}
                </p>
              </div>

              <div className="mt-3 rounded-xl bg-gray-100/90 p-3 dark:bg-white/[0.06]">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Key points
                </p>
                <ul className="list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                  {insight.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#008f6f] dark:text-[#00D2A2]">
                  Next best action
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-700 dark:text-slate-300">
                  {insight.next}
                </p>
              </div>

              <button
                type="button"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#2C365D] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#2C365D]/90 dark:bg-[#00D2A2] dark:text-gray-900 dark:hover:bg-[#00D2A2]/90"
              >
                <Image src="/AdoraDot.svg" alt="" width={14} height={14} className="h-3.5 w-3.5" />
                Ask Adora
              </button>
            </div>
          )}

          {activeTab === "X-Sell" && (
            <CrossSellPanel xSellView={xSellView} setXSellView={setXSellView} />
          )}
        </div>
      )}
    </aside>
  );
}

/* ────────── Lightweight section panes ────────── */

function SectionPlaceholder({
  title,
  blurb,
  onOpenReports,
}: {
  title: string;
  blurb: string;
  onOpenReports: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <div className={cn(GLASS_CARD, "rounded-2xl p-8 shadow-none")}>
        <h1 className="text-2xl font-semibold tracking-tight text-[#2C365D] dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">{blurb}</p>
        <Button
          size="sm"
          className="mt-6"
          onClick={onOpenReports}
        >
          Browse reports
        </Button>
      </div>
    </div>
  );
}

function ReportsLibrary({
  onOpenReport,
}: {
  onOpenReport: (id: ReportKey) => void;
}) {
  return (
    <div className="mx-auto max-w-[960px] space-y-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-gray-500 dark:text-slate-400">
            <BreadcrumbItem>
              <BreadcrumbPage className="text-xs font-medium text-[#2C365D] dark:text-white">
                Reports
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#2C365D] dark:text-white sm:text-3xl">
          Reports
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
          Proof-of-concept Report Studio library for US Glass.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {REPORT_CATALOG.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpenReport(item.id)}
            className={cn(
              GLASS_CARD,
              "rounded-xl p-5 text-left shadow-none transition hover:-translate-y-0.5 hover:border-[#2C365D]/30 dark:hover:border-[#00D2A2]/40",
            )}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
              {item.section}
            </p>
            <p className="mt-1 text-base font-semibold text-[#2C365D] dark:text-white">
              {item.title}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-slate-400">
              {item.blurb}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ────────── Page ────────── */

export default function UsGlassPage() {
  const [activeNav, setActiveNav] = useState<NavId>("reports");
  /** Content section — Search highlights in the rail without replacing the pane */
  const [contentNav, setContentNav] = useState<"home" | "operations" | "reports">("reports");
  const [report, setReport] = useState<ReportKey | null>("texas-revenue");
  const [texasTab, setTexasTab] = useState<TexasTab>("overview");
  const [displayOpen, setDisplayOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [glassCustomer, setGlassCustomer] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [adoraOpen, setAdoraOpen] = useState(true);
  const [companionOpen, setCompanionOpen] = useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const openGlassCustomer = (customerNo: string, name: string) => {
    setInvoiceOpen(false);
    setGlassCustomer({ id: customerNo, name });
  };

  useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) sidebar.style.display = isExpanded ? "none" : "";
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, [isExpanded]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("us-glass-adora-open");
      if (stored === "false") setAdoraOpen(false);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("us-glass-adora-open", adoraOpen ? "true" : "false");
    } catch {
      /* ignore */
    }
  }, [adoraOpen]);

  const openReportsLibrary = () => {
    setActiveNav("reports");
    setContentNav("reports");
    setReport(null);
  };

  const openReport = (id: ReportKey) => {
    setActiveNav("reports");
    setContentNav("reports");
    setReport(id);
    if (id === "texas-revenue") setTexasTab("overview");
  };

  const handleNavClick = (id: NavId) => {
    if (id === "search") {
      setActiveNav("search");
      searchRef.current?.focus();
      return;
    }
    setActiveNav(id);
    setContentNav(id);
  };

  const catalogEntry = useMemo(
    () => REPORT_CATALOG.find((r) => r.id === report) ?? null,
    [report],
  );

  const title = catalogEntry?.title ?? "Reports";
  const asOf =
    report === "customer-base"
      ? "Data as of Oct 6, 2026, 5:44 AM — weekly run — window Aug 1 – Oct 5"
      : "DATA AS OF OCT 1, 2026, 2:30 PM — 7 DAYS AGO";

  return (
    <div
      className={cn("flex h-full flex-col overflow-hidden", IOS_CHROME_CLASS)}
      style={{ "--tally-radius-lg": "24px" } as React.CSSProperties}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* App bar — seamless with left nav (no studio tab row) */}
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/pages/us-glass" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <Image
                src="/GlassLogoTest.svg"
                alt="Tally Glass"
                width={140}
                height={40}
                className="h-7 w-auto dark:hidden"
                priority
              />
              <Image
                src="/GlassLogoTest_darkmode.svg"
                alt="Tally Glass"
                width={140}
                height={40}
                className="hidden h-7 w-auto dark:block"
                priority
              />
              <div className="hidden h-6 w-px bg-gray-200 dark:bg-white/20 sm:block" />
              <div className="hidden sm:block">
                <p className={cn("text-[11px] font-semibold uppercase tracking-[0.14em]", IOS_CHROME_MUTED_CLASS)}>
                  Report Studio
                </p>
                <p className={cn("text-xs font-medium", IOS_CHROME_TEXT_CLASS)}>US Glass</p>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Icon
                name="search"
                size={20}
                className={cn("absolute left-3 top-1/2 -translate-y-1/2", IOS_CHROME_MUTED_CLASS)}
              />
              <input
                ref={searchRef}
                type="search"
                placeholder="Find an invoice"
                className={cn(
                  "h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm placeholder:text-[#8E8E93] focus:outline-none focus:ring-2 focus:ring-[#00D2A2]/50",
                  IOS_CHROME_INSET_CLASS,
                  IOS_CHROME_TEXT_CLASS,
                )}
              />
              <kbd
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-black/[0.04] px-2 py-0.5 text-xs dark:bg-white/10",
                  IOS_CHROME_BORDER_CLASS,
                  IOS_CHROME_MUTED_CLASS,
                )}
              >
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              className={cn("relative rounded-lg p-2 transition-colors", IOS_CHROME_ITEM_CLASS)}
              aria-label="Notifications"
            >
              <Icon name="notifications" size={22} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E8560A]" aria-hidden />
            </button>
            <Avatar className="h-9 w-9 border-2 border-[#00D2A2]/30">
              <AvatarFallback
                className="text-xs font-medium text-white"
                style={{ backgroundColor: secondaryColors.turquoise.hex }}
              >
                US
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Left nav owns Home / Operations / Reports / Search */}
          <aside className="flex w-16 shrink-0 flex-col items-center py-4">
            <nav className="flex flex-1 flex-col items-center gap-0.5 p-2">
              {LEFT_NAV.map((item) => {
                const selected = activeNav === item.id;
                return (
                  <div key={item.id} className="relative flex w-full justify-center">
                    {selected && (
                      <span
                        className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-[#2C365D] dark:bg-[#00D2A2]"
                        aria-hidden
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                        selected ? IOS_CHROME_ACTIVE_CLASS : IOS_CHROME_ITEM_CLASS,
                      )}
                      aria-label={item.label}
                      title={item.label}
                    >
                      <Icon
                        name={item.icon}
                        size={20}
                        className={selected ? IOS_CHROME_ACTIVE_ICON_CLASS : undefined}
                      />
                    </button>
                  </div>
                );
              })}
            </nav>
            <div className={cn("relative shrink-0 border-t p-2", IOS_CHROME_BORDER_CLASS)}>
              <button
                type="button"
                onClick={() => setDisplayOpen((v) => !v)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  displayOpen ? IOS_CHROME_ACTIVE_CLASS : IOS_CHROME_ITEM_CLASS,
                )}
                aria-label="Display options"
                aria-expanded={displayOpen}
              >
                <Icon name="display_settings" size={20} />
              </button>
              {displayOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close display options"
                    onClick={() => setDisplayOpen(false)}
                  />
                  <div className={cn(GLASS_CARD, "absolute bottom-0 left-full z-50 ml-3 w-56 rounded-xl p-4 shadow-2xl")}>
                    <p className="mb-3 text-xs font-semibold text-gray-900 dark:text-slate-100">
                      Display options
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          Density
                        </p>
                        <DensityModeSwitch />
                      </div>
                      <div>
                        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                          Theme
                        </p>
                        <ThemeModeSwitch />
                      </div>
                    </div>
                  </div>
                </>
              )}
              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className={cn(
                  "mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  IOS_CHROME_ITEM_CLASS,
                )}
                aria-label={isExpanded ? "Show design system sidebar" : "Hide design system sidebar"}
              >
                <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
              </button>
            </div>
          </aside>

          {/* Main pane — grey with soft corners on both top edges against white chrome */}
          <main
            className={cn(
              "relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-tl-[1.5rem] rounded-tr-[1.5rem]",
              PANE,
            )}
          >
            {glassCustomer ? (
              <GlassCustomerLayer
                customerNo={glassCustomer.id}
                fallbackName={glassCustomer.name}
                onClose={() => setGlassCustomer(null)}
              />
            ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-[1600px] space-y-4 p-6 lg:p-8">
                {contentNav === "home" && (
                  <SectionPlaceholder
                    title="Home"
                    blurb="US Glass home — jump into Report Studio when you’re ready to review finance and customer base packs."
                    onOpenReports={openReportsLibrary}
                  />
                )}

                {contentNav === "operations" && (
                  <SectionPlaceholder
                    title="Operations"
                    blurb="Operations queues and exception workspaces will live here. For this PoC, open Reports to explore Texas revenue and customer base."
                    onOpenReports={openReportsLibrary}
                  />
                )}

                {contentNav === "reports" && report == null && (
                  <ReportsLibrary onOpenReport={openReport} />
                )}

                {contentNav === "reports" && report != null && catalogEntry && (
                  <>
                    {/* Report context: breadcrumb owns “this report” */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Breadcrumb>
                          <BreadcrumbList className="text-xs text-gray-500 dark:text-slate-400">
                            <BreadcrumbItem>
                              <BreadcrumbLink asChild>
                                <button
                                  type="button"
                                  onClick={openReportsLibrary}
                                  className="text-xs text-gray-500 transition-colors hover:text-[#2C365D] dark:hover:text-[#00D2A2]"
                                >
                                  Reports
                                </button>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <span className="text-xs text-gray-500">{catalogEntry.section}</span>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage className="text-xs font-medium text-[#2C365D] dark:text-white">
                                {title}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </BreadcrumbList>
                        </Breadcrumb>
                        <div className="mt-1 flex flex-wrap items-center gap-3">
                          <h1 className="text-2xl font-semibold tracking-tight text-[#2C365D] dark:text-white sm:text-3xl">
                            {title}
                          </h1>
                          <Badge
                            className={cn(
                              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide",
                              report === "customer-base"
                                ? "bg-[#E6F0FF] text-[#0074C4] dark:bg-[#0074C4]/20 dark:text-[#80C4FF]"
                                : "bg-[#FFF4E6] text-[#C53B00] dark:bg-[#C53B00]/20 dark:text-[#FBD89D]",
                            )}
                          >
                            {asOf}
                          </Badge>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={openReportsLibrary}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-[#2C365D] dark:hover:text-[#00D2A2]"
                      >
                        <Icon name="arrow_back" size={14} />
                        All reports
                      </button>
                    </div>

                    {report === "texas-revenue" ? (
                      <Tabs
                        value={texasTab}
                        onValueChange={(v) => setTexasTab(v as TexasTab)}
                      >
                        <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-b border-gray-200 bg-transparent p-0 shadow-none dark:border-white/10">
                          <TabsTrigger
                            value="overview"
                            className="-mb-px rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2.5 pt-0 text-sm font-medium text-gray-500 shadow-none data-[state=active]:border-[#2C365D] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#2C365D] data-[state=active]:shadow-none dark:text-slate-400 dark:data-[state=active]:border-[#00D2A2] dark:data-[state=active]:text-[#00D2A2]"
                          >
                            Overview
                          </TabsTrigger>
                          <TabsTrigger
                            value="billing-review"
                            className="-mb-px rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2.5 pt-0 text-sm font-medium text-gray-500 shadow-none data-[state=active]:border-[#2C365D] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#2C365D] data-[state=active]:shadow-none dark:text-slate-400 dark:data-[state=active]:border-[#00D2A2] dark:data-[state=active]:text-[#00D2A2]"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              Billing review
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#008000] dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">
                                <Icon name="check" size={12} />
                                Done
                              </span>
                            </span>
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                          <TexasOverview
                            onSelectInvoice={() => setInvoiceOpen(true)}
                            onOpenCustomer={openGlassCustomer}
                          />
                        </TabsContent>
                        <TabsContent value="billing-review" className="mt-4">
                          <TexasBillingReview />
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <CustomerBaseReport />
                    )}
                  </>
                )}
              </div>
            </div>
            )}

            {invoiceOpen && !glassCustomer && (
              <button
                type="button"
                className="absolute inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                aria-label="Close invoice drawer"
                onClick={() => setInvoiceOpen(false)}
              />
            )}
            <InvoiceDrawer
              open={invoiceOpen && !glassCustomer}
              onClose={() => setInvoiceOpen(false)}
              onOpenCustomer={openGlassCustomer}
            />
          </main>

          <AdoraPanel
            open={adoraOpen}
            onOpenChange={setAdoraOpen}
            context={{ contentNav, report, texasTab }}
            companionOpen={companionOpen}
            onOpenCompanion={() => setCompanionOpen(true)}
          />
        </div>
      </div>

      <CompanionWidget
        open={companionOpen}
        onOpenChange={setCompanionOpen}
        launcherClassName={adoraOpen ? undefined : "hidden"}
      />
    </div>
  );
}