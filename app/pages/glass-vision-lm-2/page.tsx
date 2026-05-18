"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { cn } from "@/lib/utils";
import { secondaryColors } from "@/lib/tokens/colors";

/* ────────── Theme tokens ────────── */

const DARKEST_NAVY = "#161B2E";
const DARK_NAVY = "#212946";
const ACCENT = "#00D2A2";

const COLORS = {
  green: ACCENT,
  green2: "#22c55e",
  blue: "#60a5fa",
  amber: "#f59e0b",
  red: "#fb7185",
  purple: "#a78bfa",
  slate: "#64748b",
};

const riskClasses: Record<string, string> = {
  High: "bg-red-500/15 text-red-300 border-red-400/30",
  Medium: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Low: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Critical: "bg-red-500/20 text-red-200 border-red-400/40",
};

const statusClasses: Record<string, string> = {
  Ready: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Blocked: "bg-red-500/15 text-red-300 border-red-400/30",
  Pending: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  Billed: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  Current: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Overdue: "bg-red-500/15 text-red-300 border-red-400/30",
  Active: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  New: "bg-blue-500/15 text-blue-300 border-blue-400/30",
  Triaged: "bg-amber-500/15 text-amber-300 border-amber-400/30",
  "In Progress": "bg-purple-500/15 text-purple-300 border-purple-400/30",
  "Pending External": "bg-slate-500/15 text-slate-300 border-slate-400/30",
};

/* ────────── Mock data ────────── */

interface ContractRecord {
  id: string;
  customerId: string;
  name: string;
  startDate: string;
  endDate: string;
  products: string;
  terms: string;
  swapAmount: string;
  sites: number;
}

const contracts: ContractRecord[] = [
  { id: "rga-fy25", customerId: "retail-group", name: "FY25 Retail Portfolio", startDate: "2024-07-01", endDate: "2025-06-30", products: "Electricity + LREC", terms: "Blended retail portfolio pricing with monthly reconciliation and demand reset provisions.", swapAmount: "42 GWh hedged", sites: 2145 },
  { id: "rga-fy26", customerId: "retail-group", name: "FY26 Retail Portfolio Renewal", startDate: "2025-07-01", endDate: "2026-06-30", products: "Electricity + Environmental Products", terms: "Renewed portfolio pricing with revised peak shaping and quarterly market review.", swapAmount: "47 GWh hedged", sites: 2145 },
  { id: "atlas-fy25", customerId: "atlas-mining", name: "Mining Operations Base Load", startDate: "2024-01-01", endDate: "2025-12-31", products: "Electricity + Demand Response", terms: "Large market mining agreement with embedded demand response participation.", swapAmount: "61 GWh hedged", sites: 1328 },
  { id: "southern-health-25", customerId: "southern-health", name: "Healthcare Network FY25", startDate: "2024-07-01", endDate: "2025-06-30", products: "Electricity", terms: "Healthcare network fixed pricing with emergency supply continuity obligations.", swapAmount: "18 GWh hedged", sites: 876 },
];

interface Region {
  name: string;
  sites: number;
  share: number;
  usage: number;
}

interface CustomerRecord {
  id: string;
  name: string;
  segment: string;
  industry: string;
  manager: string;
  sites: number;
  usageMwh: number;
  usage: string;
  billReady: number;
  blockedRevenue: number;
  unbilled: number;
  exceptions: number;
  debt: number;
  regions: Region[];
}

const customers: CustomerRecord[] = [
  { id: "retail-group", name: "Retail Group Australia", segment: "Contracted SME", industry: "Retail", manager: "Sarah Kim", sites: 2145, usageMwh: 142312, usage: "142.3 GWh", billReady: 58, blockedRevenue: 2.9, unbilled: 8.6, exceptions: 23, debt: 1.2, regions: [{ name: "VIC Region", sites: 912, share: 43, usage: 54.8 }, { name: "NSW Region", sites: 846, share: 39, usage: 49.1 }, { name: "QLD Region", sites: 248, share: 12, usage: 21.3 }, { name: "Other", sites: 139, share: 6, usage: 17.1 }] },
  { id: "atlas-mining", name: "Atlas Mining Services", segment: "C&I", industry: "Mining", manager: "Michael Tran", sites: 1328, usageMwh: 98765, usage: "98.8 GWh", billReady: 44, blockedRevenue: 2.5, unbilled: 11.4, exceptions: 31, debt: 3.4, regions: [{ name: "WA Operations", sites: 611, share: 46, usage: 61.2 }, { name: "QLD Operations", sites: 394, share: 30, usage: 23.7 }, { name: "SA Operations", sites: 202, share: 15, usage: 9.4 }, { name: "Other", sites: 121, share: 9, usage: 4.5 }] },
  { id: "southern-health", name: "Southern Health Network", segment: "C&I", industry: "Health", manager: "Emma Liu", sites: 876, usageMwh: 65432, usage: "65.4 GWh", billReady: 78, blockedRevenue: 1.1, unbilled: 4.8, exceptions: 14, debt: 0.8, regions: [{ name: "Metro Hospitals", sites: 336, share: 38, usage: 30.8 }, { name: "Regional Clinics", sites: 284, share: 33, usage: 20.1 }, { name: "Specialist Sites", sites: 179, share: 20, usage: 10.7 }, { name: "Other", sites: 77, share: 9, usage: 3.8 }] },
  { id: "freshchain", name: "FreshChain Logistics", segment: "Contracted SME", industry: "Logistics", manager: "James O'Neill", sites: 1942, usageMwh: 87654, usage: "87.7 GWh", billReady: 86, blockedRevenue: 0.6, unbilled: 3.9, exceptions: 9, debt: 0.5, regions: [{ name: "Cold Storage", sites: 612, share: 32, usage: 36.4 }, { name: "Distribution", sites: 498, share: 26, usage: 26.1 }, { name: "Retail Hubs", sites: 531, share: 27, usage: 17.7 }, { name: "Other", sites: 301, share: 15, usage: 7.5 }] },
  { id: "citycare", name: "CityCare Property Services", segment: "C&I", industry: "Facilities", manager: "Priya Nair", sites: 1102, usageMwh: 54323, usage: "54.3 GWh", billReady: 91, blockedRevenue: 0.4, unbilled: 2.6, exceptions: 6, debt: 0.2, regions: [{ name: "Commercial Towers", sites: 488, share: 44, usage: 27.2 }, { name: "Retail Centres", sites: 301, share: 27, usage: 14.1 }, { name: "Industrial", sites: 201, share: 18, usage: 9.2 }, { name: "Other", sites: 112, share: 10, usage: 3.8 }] },
  { id: "aurora-food", name: "Aurora Food Manufacturing", segment: "C&I", industry: "Manufacturing", manager: "David Morgan", sites: 1876, usageMwh: 76543, usage: "76.5 GWh", billReady: 93, blockedRevenue: 0.3, unbilled: 2.1, exceptions: 4, debt: 0.1, regions: [{ name: "Manufacturing", sites: 744, share: 40, usage: 44.8 }, { name: "Warehousing", sites: 522, share: 28, usage: 16.7 }, { name: "Office / Retail", sites: 391, share: 21, usage: 8.9 }, { name: "Other", sites: 219, share: 12, usage: 6.1 }] },
];

const trend = [
  { month: "Dec '24", exposure: 27.6, ready: 73 },
  { month: "Jan '25", exposure: 29.8, ready: 76 },
  { month: "Feb '25", exposure: 32.1, ready: 78 },
  { month: "Mar '25", exposure: 35.4, ready: 80 },
  { month: "Apr '25", exposure: 37.9, ready: 81 },
  { month: "May '25", exposure: 41.2, ready: 82 },
];

const billStatus = [
  { name: "Ready", value: 82, amount: "$112.4m", color: COLORS.green },
  { name: "Blocked", value: 7, amount: "$8.7m", color: COLORS.red },
  { name: "Pending", value: 6, amount: "$7.8m", color: COLORS.amber },
  { name: "Billed", value: 5, amount: "$6.8m", color: COLORS.blue },
];

const exceptionHeatmap = [
  { severity: "High", Billing: 42, "Meter Data": 58, Market: 21, Payments: 11, Contract: 18, Other: 6 },
  { severity: "Medium", Billing: 85, "Meter Data": 94, Market: 44, Payments: 26, Contract: 39, Other: 12 },
  { severity: "Low", Billing: 51, "Meter Data": 63, Market: 28, Payments: 17, Contract: 21, Other: 8 },
];

const rootCauses = [
  { name: "Missing / invalid meter data", value: 3.1, pct: 36 },
  { name: "Bill validation failure", value: 2.6, pct: 66 },
  { name: "Contract / pricing issue", value: 1.6, pct: 85 },
  { name: "Network mismatch", value: 0.9, pct: 95 },
  { name: "Payment hold", value: 0.5, pct: 100 },
];

const exceptionTrend = [
  { day: "Apr 26", exceptions: 78 },
  { day: "Apr 29", exceptions: 112 },
  { day: "May 3", exceptions: 137 },
  { day: "May 6", exceptions: 92 },
  { day: "May 10", exceptions: 82 },
  { day: "May 13", exceptions: 104 },
  { day: "May 17", exceptions: 153 },
  { day: "May 20", exceptions: 117 },
  { day: "May 24", exceptions: 108 },
];

const exceptionRows = [
  { customer: "Retail Group Australia", site: "RGA Flagship Store", issue: "Missing interval data (5 days)", severity: "Critical", impact: "$532,410", age: "5d 4h", owner: "Daniel Lee", status: "New", sla: "Critical" },
  { customer: "Atlas Mining Services", site: "Atlas - Karara Site", issue: "Bill validation failure", severity: "Critical", impact: "$487,250", age: "4d 7h", owner: "Priya Nair", status: "In Progress", sla: "Critical" },
  { customer: "Southern Health Network", site: "SHN - Hospital 3", issue: "Contract/pricing mismatch", severity: "High", impact: "$312,780", age: "3d 2h", owner: "Michael Tran", status: "Triaged", sla: "High" },
  { customer: "FreshChain Logistics", site: "FCL - Cold Storage 12", issue: "Missing interval data (3 days)", severity: "High", impact: "$276,610", age: "2d 6h", owner: "Emma Liu", status: "In Progress", sla: "High" },
  { customer: "CityCare Property Services", site: "CCPS - Tower A", issue: "Network mismatch", severity: "High", impact: "$198,340", age: "2d 1h", owner: "James O'Neill", status: "Pending External", sla: "High" },
  { customer: "Retail Group Australia", site: "RGA Distribution Ctr", issue: "Payment hold", severity: "Medium", impact: "$154,200", age: "1d 8h", owner: "Daniel Lee", status: "Triaged", sla: "Medium" },
  { customer: "Atlas Mining Services", site: "Atlas - Processing Plant", issue: "Missing interval data (1 day)", severity: "Medium", impact: "$128,900", age: "1d 3h", owner: "Sophie Patel", status: "New", sla: "Medium" },
  { customer: "FreshChain Logistics", site: "FCL - Warehouse 7", issue: "Bill validation failure", severity: "Medium", impact: "$117,860", age: "23h 45m", owner: "Emma Liu", status: "In Progress", sla: "Medium" },
  { customer: "Southern Health Network", site: "SHN - Clinic 5", issue: "Contract/pricing mismatch", severity: "Low", impact: "$67,230", age: "18h 22m", owner: "Michael Tran", status: "Triaged", sla: "Low" },
  { customer: "CityCare Property Services", site: "CCPS - Retail Hub", issue: "Missing interval data (2 days)", severity: "Low", impact: "$42,100", age: "12h 10m", owner: "James O'Neill", status: "New", sla: "Low" },
];

/* ────────── Nav data ────────── */

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "dashboard", children: [{ id: "home-dashboard", label: "Dashboard" }, { id: "home-exceptions", label: "Exceptions" }] },
  { id: "sales", label: "Sales", icon: "trending_up", children: [{ id: "sales-discovery", label: "Discovery" }, { id: "sales-quotes", label: "Quotes" }] },
  { id: "customers", label: "Customers", icon: "group", children: [{ id: "customers-portfolio", label: "Portfolio" }, { id: "customers-accounts", label: "Accounts" }] },
  { id: "billing", label: "Billing", icon: "receipt", children: [{ id: "billing-dashboard", label: "Dashboard" }, { id: "billing-invoices", label: "Invoices" }] },
  { id: "exceptions", label: "Exceptions", icon: "warning", children: [{ id: "exceptions-queue", label: "Queue" }] },
  { id: "market", label: "Market", icon: "store", children: [{ id: "market-change-requests", label: "Change Requests" }] },
  { id: "reporting", label: "Reporting", icon: "insights", children: [{ id: "reporting-reports", label: "Reports" }] },
  { id: "settings", label: "Settings", icon: "settings", children: [] },
];

/* ────────── Reusable bits ────────── */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/20", className)}>{children}</div>;
}

function Pill({ children, tone = "Low" }: { children: React.ReactNode; tone?: string }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", riskClasses[tone] || statusClasses[tone] || "border-slate-700 bg-slate-800 text-slate-300")}>{children}</span>;
}

function StatusPill({ children }: { children: string }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", statusClasses[children] || "border-slate-700 bg-slate-800 text-slate-300")}>{children}</span>;
}

interface KpiCardProps {
  icon: string;
  title: string;
  value: string | number;
  sub: string;
  tone?: "green" | "blue" | "amber" | "red" | "purple";
  onClick?: () => void;
}

function KpiCard({ icon, title, value, sub, tone = "green", onClick }: KpiCardProps) {
  const color = {
    green: "text-emerald-300 bg-emerald-500/15 border-emerald-400/20",
    blue: "text-blue-300 bg-blue-500/15 border-blue-400/20",
    amber: "text-amber-300 bg-amber-500/15 border-amber-400/20",
    red: "text-red-300 bg-red-500/15 border-red-400/20",
    purple: "text-purple-300 bg-purple-500/15 border-purple-400/20",
  }[tone];
  const sparkColor = tone === "red" ? COLORS.red : tone === "blue" ? COLORS.blue : tone === "amber" ? COLORS.amber : tone === "purple" ? COLORS.purple : COLORS.green;
  return (
    <button onClick={onClick} className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/50">
      <div className="flex items-start justify-between">
        <div className={cn("rounded-2xl border p-2", color)}>
          <Icon name={icon} size={20} />
        </div>
        <div className="h-7 w-20 opacity-80">
          <ResponsiveContainer width="100%" height="100%">
            <RLineChart data={[{ v: 8 }, { v: 11 }, { v: 9 }, { v: 13 }, { v: 10 }, { v: 12 }, { v: 14 }, { v: 11 }, { v: 13 }]}>
              <Line type="monotone" dataKey="v" dot={false} stroke={sparkColor} strokeWidth={2} />
            </RLineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-white">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </button>
  );
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <button className="flex min-w-40 items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-left hover:border-slate-600">
      <span>
        <span className="block text-[11px] text-slate-500">{label}</span>
        <span className="text-sm text-slate-200">{value}</span>
      </span>
      <Icon name="expand_more" size={16} className="text-slate-500" />
    </button>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

type ViewKey = "Portfolio Overview" | "Customer Hierarchy" | "Exception Workspace";

function ViewSwitcher({ activeView, setActiveView, selected }: { activeView: ViewKey; setActiveView: (v: ViewKey) => void; selected: CustomerRecord }) {
  const items: Array<{ label: string; view: ViewKey; icon: string }> = [
    { label: "Portfolio", view: "Portfolio Overview", icon: "dashboard" },
    { label: "Customer", view: "Customer Hierarchy", icon: "group" },
    { label: "Exceptions", view: "Exception Workspace", icon: "warning" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-1">
      {items.map(({ label, view, icon }) => {
        const active = activeView === view;
        return (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
              active ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30" : "text-slate-300 hover:bg-slate-800 hover:text-white",
            )}
          >
            <Icon name={icon} size={16} />
            <span>{label}</span>
            {view === "Customer Hierarchy" && <span className="hidden max-w-36 truncate text-xs text-slate-500 lg:inline">{selected.name}</span>}
          </button>
        );
      })}
    </div>
  );
}

const chartTooltipStyle: React.CSSProperties = { background: "#020617", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" };

/* ────────── Portfolio Overview ────────── */

function PortfolioOverview({ setActiveView, openCustomer }: { setActiveView: (v: ViewKey) => void; openCustomer: (c: CustomerRecord) => void }) {
  const portfolioCards: KpiCardProps[] = [
    { title: "Active Customers", value: "184", sub: "↑ 6 vs last month", icon: "group", tone: "green" },
    { title: "Active Sites", value: "12,486", sub: "↑ 312 vs last month", icon: "apartment", tone: "green" },
    { title: "Bills Ready", value: "82%", sub: "↑ 5pp vs last month", icon: "description", tone: "blue" },
    { title: "Blocked Bills", value: "312", sub: "$8.7m held from release", icon: "lock", tone: "red" },
    { title: "Unbilled Exposure", value: "$41.2m", sub: "↑ $5.3m vs last month", icon: "credit_card", tone: "purple" },
    { title: "Open Exceptions", value: "1,287", sub: "Billing, meter data and market items", icon: "warning", tone: "amber" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
        <SelectLike label="Portfolio Manager" value="All" />
        <SelectLike label="Segment" value="All C&I + Contracted SME" />
        <SelectLike label="Billing Cycle" value="May 2025 (Current)" />
        <button type="button" className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10">
          Reset filters <Icon name="refresh" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
        {portfolioCards.map((card) => (
          <KpiCard key={card.title} {...card} onClick={() => card.title.includes("Blocked") && setActiveView("Exception Workspace")} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-4">
          <SectionHeader title="Bill Status Distribution" action={<span className="text-xs text-slate-500">Current cycle</span>} />
          <div className="flex h-12 overflow-hidden rounded-xl border border-slate-800 bg-slate-800">
            {billStatus.map((s) => (
              <div key={s.name} className="grid place-items-center text-xs font-semibold text-white" style={{ width: `${s.value}%`, backgroundColor: s.color }}>
                {s.value}%
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {billStatus.map((s) => (
              <div key={s.name} className="flex items-center gap-2 text-slate-300">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
                <span className="ml-auto text-slate-500">{s.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 border-t border-slate-800 pt-5 text-sm">
            <div>
              <div className="text-slate-500">Total Billed Value YTD</div>
              <div className="mt-1 text-xl font-semibold text-white">$1,152.6m</div>
            </div>
            <div>
              <div className="text-slate-500">vs Prior Year</div>
              <div className="mt-1 text-xl font-semibold text-emerald-300">↑ 9.4%</div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-4">
          <SectionHeader title="Unbilled Exposure Trend" action={<button type="button" className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-300">6 Months</button>} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="exposureLm2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}m`} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="exposure" stroke={COLORS.green} strokeWidth={3} fill="url(#exposureLm2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-4">
          <SectionHeader title="Payment Status (Based on Billed $)" />
          <div className="mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Paid On Time", value: 64 },
                    { name: "Paid Late", value: 17 },
                    { name: "1-30 Days Overdue", value: 11 },
                    { name: "31+ Days Overdue", value: 8 },
                  ]}
                  innerRadius={56}
                  outerRadius={80}
                  dataKey="value"
                  paddingAngle={2}
                >
                  <Cell fill={COLORS.green} />
                  <Cell fill={COLORS.blue} />
                  <Cell fill={COLORS.amber} />
                  <Cell fill={COLORS.red} />
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            {[
              { color: "bg-emerald-400", label: "Paid On Time", amount: "$736.9m" },
              { color: "bg-blue-400", label: "Paid Late", amount: "$195.5m" },
              { color: "bg-amber-400", label: "1-30 Days Overdue", amount: "$126.6m" },
              { color: "bg-red-400", label: "31+ Days Overdue", amount: "$93.6m" },
            ].map((row) => (
              <div key={row.label} className="flex min-w-0 items-center gap-2 text-slate-300">
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", row.color)} />
                <span className="min-w-0 truncate">{row.label}</span>
                <span className="ml-auto whitespace-nowrap text-slate-500">{row.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-sm">
            <div className="min-w-0">
              <div className="text-slate-500">Total Billed</div>
              <div className="mt-1 truncate text-xl font-semibold text-white">$1,152.6m</div>
            </div>
            <div className="min-w-0 text-right">
              <div className="text-slate-500">Collection Efficiency (YTD)</div>
              <div className="mt-1 text-xl font-semibold text-emerald-300">92.1%</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-4">
          <SectionHeader title="Exception Volume by Type" sub="Last 7 days by operational category" />
          <div className="overflow-hidden rounded-xl border border-slate-800 text-xs">
            <table className="w-full border-collapse">
              <thead className="bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="p-2 text-left">Severity</th>
                  {["Billing", "Meter Data", "Market", "Payments", "Contract", "Other", "Total"].map((h) => (
                    <th key={h} className="p-2 text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exceptionHeatmap.map((row) => {
                  const cols = ["Billing", "Meter Data", "Market", "Payments", "Contract", "Other"] as const;
                  const total = cols.reduce((a, k) => a + ((row as unknown as Record<string, number>)[k] ?? 0), 0);
                  return (
                    <tr key={row.severity} className="border-t border-slate-800">
                      <td className="p-2 text-slate-300">{row.severity}</td>
                      {cols.map((k) => {
                        const v = (row as unknown as Record<string, number>)[k] ?? 0;
                        const bg = row.severity === "High" ? `rgba(248,113,113,${0.12 + v / 180})` : row.severity === "Medium" ? `rgba(245,158,11,${0.12 + v / 220})` : `rgba(74,222,128,${0.08 + v / 220})`;
                        return (
                          <td key={k} className="p-2 text-right" style={{ background: bg }}>
                            {v}
                          </td>
                        );
                      })}
                      <td className="p-2 text-right font-semibold text-white">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => setActiveView("Exception Workspace")} className="mt-4 text-sm text-emerald-300 hover:text-emerald-200">
            View Exception Workspace →
          </button>
        </Panel>

        <Panel className="p-5 xl:col-span-8">
          <SectionHeader
            title="Customer Performance (Billed and Paid)"
            sub="Portfolio health based on expected bill value, billed value, paid value and payment performance."
            action={<button type="button" className="text-sm text-emerald-300">View all ↗</button>}
          />
          <div className="overflow-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400">
                <tr>
                  {["Customer", "Segment", "Manager", "Sites", "Expected Bill", "Billed $", "Paid $", "Payment Performance", "% Billed", "% Paid", "Exceptions"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} onClick={() => openCustomer(c)} className="cursor-pointer border-t border-slate-800 hover:bg-emerald-500/5">
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-emerald-200">{c.name}</td>
                    <td className="px-3 py-3 text-slate-300">{c.industry}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-300">{c.manager}</td>
                    <td className="px-3 py-3 text-slate-300">{c.sites.toLocaleString()}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-300">${(c.unbilled + c.blockedRevenue + 20).toFixed(1)}m</td>
                    <td className="px-3 py-3 text-slate-300">${(c.unbilled + 18).toFixed(1)}m</td>
                    <td className="px-3 py-3 text-slate-300">${(c.unbilled + 15).toFixed(1)}m</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded bg-slate-800">
                          <div className="h-2 rounded bg-emerald-400" style={{ width: `${Math.min(100, c.billReady)}%` }} />
                        </div>
                        <span className="text-slate-300">{c.billReady}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-300">{Math.max(81, c.billReady - 2)}%</td>
                    <td className="px-3 py-3 text-slate-300">{Math.max(78, c.billReady - 1)}%</td>
                    <td className="px-3 py-3 text-slate-300">{c.exceptions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>1–6 of 184 customers</span>
            <span>‹ 1 2 3 … 31 ›</span>
          </div>
        </Panel>
      </div>
    </div>
  );
}

/* ────────── Customer Drilldown ────────── */

interface SiteRecord {
  id: string;
  site: string;
  group: string;
  state: string;
  address: string;
  nmi: string;
  account: string;
  contract: string;
  usage: string;
  actualDemand: number;
  contractDemand: number;
  change: string;
  billing: string;
  payment: string;
  unbilled: string;
  overdue: string;
  exceptions: number;
  lastInvoice: string;
  meterStatus: string;
  cert: string;
  creditTags: string[];
  pendingInterest: string;
}

const SITE_ROWS: SiteRecord[] = [
  { id: "site-melbourne-central", site: "Melbourne Central", group: "Flagship Stores", state: "Active", address: "211 La Trobe Street, Melbourne VIC 3000", nmi: "VICMELB001", account: "RGA-100284", contract: "C&I Retail Flex 2025", usage: "1.82 GWh", actualDemand: 4.8, contractDemand: 4.2, change: "↑ 9%", billing: "Ready", payment: "Current", unbilled: "$118k", overdue: "$0", exceptions: 2, lastInvoice: "20 May 2025", meterStatus: "Complete", cert: "LGC allocation active", creditTags: ["Low risk", "Direct debit"], pendingInterest: "$0" },
  { id: "site-chadstone", site: "Chadstone", group: "Flagship Stores", state: "Active", address: "1341 Dandenong Road, Chadstone VIC 3148", nmi: "VICCHAD014", account: "RGA-100311", contract: "C&I Retail Flex 2025", usage: "1.56 GWh", actualDemand: 5.1, contractDemand: 4.4, change: "↑ 6%", billing: "Blocked", payment: "Overdue", unbilled: "$284k", overdue: "$84k", exceptions: 5, lastInvoice: "12 Apr 2025", meterStatus: "Missing intervals", cert: "Certificate variance review", creditTags: ["Watchlist", "Promise to pay"], pendingInterest: "$1.8k" },
  { id: "site-parramatta", site: "Parramatta", group: "Metro Stores", state: "Active", address: "159 Church Street, Parramatta NSW 2150", nmi: "NSWPARA221", account: "RGA-200118", contract: "SME Portfolio Fixed 2025", usage: "1.45 GWh", actualDemand: 3.9, contractDemand: 4.1, change: "↑ 7%", billing: "Pending", payment: "Current", unbilled: "$171k", overdue: "$12k", exceptions: 3, lastInvoice: "18 May 2025", meterStatus: "Complete", cert: "STC exemption on file", creditTags: ["Standard terms"], pendingInterest: "$320" },
  { id: "site-penrith", site: "Penrith", group: "Metro Stores", state: "Active", address: "585 High Street, Penrith NSW 2750", nmi: "NSWPEN087", account: "RGA-200412", contract: "SME Portfolio Fixed 2025", usage: "1.13 GWh", actualDemand: 4.3, contractDemand: 3.8, change: "↑ 4%", billing: "Blocked", payment: "Overdue", unbilled: "$132k", overdue: "$63k", exceptions: 6, lastInvoice: "09 Apr 2025", meterStatus: "Comms failure", cert: "Pending exemption certificate", creditTags: ["Credit hold", "Collections"], pendingInterest: "$2.2k" },
  { id: "site-geelong-west", site: "Geelong West", group: "Regional Stores", state: "Active", address: "95 Pakington Street, Geelong West VIC 3218", nmi: "VICGEEL045", account: "RGA-100522", contract: "C&I Retail Flex 2025", usage: "0.98 GWh", actualDemand: 2.8, contractDemand: 3.2, change: "↓ 2%", billing: "Ready", payment: "Current", unbilled: "$86k", overdue: "$0", exceptions: 1, lastInvoice: "22 May 2025", meterStatus: "Complete", cert: "LGC allocation active", creditTags: ["Low risk"], pendingInterest: "$0" },
  { id: "site-newcastle", site: "Newcastle", group: "Regional Stores", state: "Active", address: "15 Hunter Street, Newcastle NSW 2300", nmi: "NSWNEW097", account: "RGA-200731", contract: "SME Portfolio Fixed 2025", usage: "0.91 GWh", actualDemand: 3.3, contractDemand: 3.1, change: "↑ 5%", billing: "Pending", payment: "Current", unbilled: "$94k", overdue: "$7k", exceptions: 2, lastInvoice: "16 May 2025", meterStatus: "Estimated read", cert: "No active variance", creditTags: ["Standard terms"], pendingInterest: "$120" },
];

interface NodeMetric {
  name: string;
  count: string;
  contact: string;
  role: string;
  email: string;
  phone: string;
  sites: number;
  usage: string;
  billed: string;
  paid: string;
  unbilled: string;
  overdue: string;
  paymentInsight: string;
}

interface HierarchyNode {
  id: string;
  name: string;
  count: string;
  children: Array<HierarchyNode | string>;
}

const HIERARCHY: HierarchyNode[] = [
  {
    id: "node-corporate",
    name: "Corporate Energy Portfolio",
    count: "1,540 sites",
    children: [
      { id: "node-flagship", name: "Flagship Stores", count: "312 sites", children: ["site-melbourne-central", "site-chadstone"] },
      { id: "node-metro", name: "Metro Stores", count: "684 sites", children: ["site-parramatta", "site-penrith"] },
      { id: "node-regional", name: "Regional Stores", count: "544 sites", children: ["site-geelong-west", "site-newcastle"] },
    ],
  },
  { id: "node-franchise", name: "Franchise / Managed Sites", count: "605 sites", children: [] },
];

function CustomerDrilldown({ selected }: { selected: CustomerRecord }) {
  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({});
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ "node-corporate": true, "node-flagship": true, "node-metro": true });
  const [selectedEntity, setSelectedEntity] = useState<{ type: "site" | "node"; id: string; name: string }>({ type: "site", id: "site-melbourne-central", name: "Melbourne Central" });

  const customerContracts = contracts.filter((contract) => contract.customerId === selected.id);

  const siteById = useMemo(() => Object.fromEntries(SITE_ROWS.map((row) => [row.id, row])), []);
  const selectedSite = selectedEntity.type === "site" ? siteById[selectedEntity.id] || SITE_ROWS[0] : SITE_ROWS[0];
  const isSite = selectedEntity.type === "site";

  const nodeMetrics: Record<string, NodeMetric> = {
    "node-retail-group": { name: selected.name, count: `${selected.sites.toLocaleString()} sites`, contact: selected.manager, role: "Customer Portfolio Manager", email: `${selected.manager.toLowerCase().replace(" ", ".")}@retailgroup.example`, phone: "+61 3 9000 1200", sites: selected.sites, usage: selected.usage, billed: "$24.8m", paid: "$21.6m", unbilled: `$${selected.unbilled.toFixed(1)}m`, overdue: `$${selected.debt.toFixed(1)}m`, paymentInsight: "Payment performance is stable, with most overdue value concentrated in large flagship locations." },
    "node-corporate": { name: "Corporate Energy Portfolio", count: "1,540 sites", contact: "Sarah Kim", role: "Corporate Account Lead", email: "sarah.kim@retailgroup.example", phone: "+61 3 9000 1201", sites: 1540, usage: "104.6 GWh", billed: "$18.2m", paid: "$15.9m", unbilled: "$6.4m", overdue: "$920k", paymentInsight: "Strong billed-to-paid conversion, but unbilled exposure is elevated due to two blocked flagship sites." },
    "node-flagship": { name: "Flagship Stores", count: "312 sites", contact: "Amelia Hart", role: "National Flagship Operations", email: "amelia.hart@retailgroup.example", phone: "+61 3 9000 1202", sites: 312, usage: "31.7 GWh", billed: "$6.8m", paid: "$5.7m", unbilled: "$1.9m", overdue: "$284k", paymentInsight: "Chadstone is driving most overdue value and billing blockage in this node." },
    "node-metro": { name: "Metro Stores", count: "684 sites", contact: "Daniel Lee", role: "Metro Stores Lead", email: "daniel.lee@retailgroup.example", phone: "+61 2 9000 1300", sites: 684, usage: "45.2 GWh", billed: "$8.4m", paid: "$7.6m", unbilled: "$2.2m", overdue: "$75k", paymentInsight: "Metro sites are performing well overall, with isolated metering issues at Penrith." },
    "node-regional": { name: "Regional Stores", count: "544 sites", contact: "Priya Nair", role: "Regional Energy Lead", email: "priya.nair@retailgroup.example", phone: "+61 3 9000 1203", sites: 544, usage: "27.7 GWh", billed: "$5.2m", paid: "$4.8m", unbilled: "$1.1m", overdue: "$7k", paymentInsight: "Regional sites have low debt exposure and a small number of estimated read issues." },
    "node-franchise": { name: "Franchise / Managed Sites", count: "605 sites", contact: "Michael Tran", role: "Franchise Portfolio Lead", email: "michael.tran@retailgroup.example", phone: "+61 3 9000 1204", sites: 605, usage: "37.7 GWh", billed: "$6.6m", paid: "$5.7m", unbilled: "$2.2m", overdue: "$280k", paymentInsight: "Payment timing is more variable in managed sites, with higher collections activity required." },
  };

  const selectedNode = selectedEntity.type === "node" ? nodeMetrics[selectedEntity.id] || nodeMetrics["node-retail-group"] : nodeMetrics["node-retail-group"];

  const demandTrend = [
    { month: "Jan", contract: selectedSite.contractDemand, actual: selectedSite.actualDemand - 0.4 },
    { month: "Feb", contract: selectedSite.contractDemand, actual: selectedSite.actualDemand - 0.2 },
    { month: "Mar", contract: selectedSite.contractDemand, actual: selectedSite.actualDemand + 0.1 },
    { month: "Apr", contract: selectedSite.contractDemand, actual: selectedSite.actualDemand - 0.1 },
    { month: "May", contract: selectedSite.contractDemand, actual: selectedSite.actualDemand },
  ];

  const distributionData = selected.regions.map((region) => ({ name: region.name, sites: region.sites, usage: region.usage }));

  const toggleNode = (id: string) => setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleContract = (id: string) => setExpandedContracts((prev) => ({ ...prev, [id]: !prev[id] }));
  const selectSite = (siteId: string) => {
    const site = siteById[siteId];
    if (site) setSelectedEntity({ type: "site", id: siteId, name: site.site });
  };
  const selectNode = (node: HierarchyNode) => setSelectedEntity({ type: "node", id: node.id, name: node.name });

  const renderNode = (node: HierarchyNode, level = 0): React.ReactNode => {
    const isOpen = expandedNodes[node.id];
    const isSelected = selectedEntity.type === "node" && selectedEntity.id === node.id;
    return (
      <div key={node.id} className={level > 0 ? "ml-5 border-l border-slate-700/80 pl-4" : ""}>
        <div className={cn("mb-2 flex items-center gap-2 rounded-lg px-2 py-2 transition", isSelected ? "bg-emerald-500/15 ring-1 ring-emerald-400/40" : "hover:bg-slate-800")}>
          <button type="button" onClick={() => toggleNode(node.id)} className="text-slate-400 hover:text-white">
            <Icon name={isOpen ? "expand_more" : "chevron_right"} size={15} />
          </button>
          <button type="button" onClick={() => selectNode(node)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <Icon name="apartment" size={15} className="text-emerald-300" />
            <span className="truncate font-medium text-slate-200">{node.name}</span>
            <span className="ml-auto rounded bg-slate-800 px-2 py-1 text-xs text-slate-500">{node.count}</span>
          </button>
        </div>
        {isOpen && (
          <div className="space-y-1">
            {node.children.map((child) => {
              if (typeof child === "string") {
                const site = siteById[child];
                if (!site) return null;
                const siteSelected = selectedEntity.type === "site" && selectedEntity.id === child;
                return (
                  <button
                    key={child}
                    type="button"
                    onClick={() => selectSite(child)}
                    className={cn(
                      "block w-full rounded-lg px-4 py-2 text-left text-sm transition",
                      siteSelected ? "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/40" : "text-slate-400 hover:bg-slate-800 hover:text-emerald-200",
                    )}
                  >
                    <span>{site.site}</span>
                    <span className="ml-2 text-xs text-slate-600">{site.nmi}</span>
                  </button>
                );
              }
              return renderNode(child, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  const contractPanel = (
    <Panel className="p-5 xl:col-span-12">
      <SectionHeader title="Contract Details" sub="Commercial contract structures and contract periods associated to this customer." />
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-950/60 text-xs text-slate-400">
            <tr>{["", "Contract", "Start Date", "End Date", "Products", "Sites"].map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {customerContracts.map((contract) => {
              const expanded = expandedContracts[contract.id];
              return (
                <React.Fragment key={contract.id}>
                  <tr className="border-t border-slate-800 hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => toggleContract(contract.id)} className="rounded-md border border-slate-700 p-1 text-slate-300 hover:border-emerald-400/40 hover:text-emerald-300">
                        <Icon name={expanded ? "expand_more" : "chevron_right"} size={14} />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{contract.name}</td>
                    <td className="px-4 py-3 text-slate-300">{contract.startDate}</td>
                    <td className="px-4 py-3 text-slate-300">{contract.endDate}</td>
                    <td className="px-4 py-3 text-slate-300">{contract.products}</td>
                    <td className="px-4 py-3 text-slate-300">{contract.sites.toLocaleString()} associated sites</td>
                  </tr>
                  {expanded && (
                    <tr className="border-t border-slate-800 bg-slate-950/40">
                      <td colSpan={6} className="px-4 py-5">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Swap Amount</div>
                            <div className="mt-2 text-lg font-semibold text-white">{contract.swapAmount}</div>
                          </div>
                          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Associated Sites</div>
                            <div className="mt-2 text-lg font-semibold text-white">{contract.sites.toLocaleString()} total sites covered</div>
                          </div>
                          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Contract Terms</div>
                            <div className="mt-2 text-sm leading-relaxed text-slate-300">{contract.terms}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard icon="apartment" title="Sites" value={selected.sites.toLocaleString()} sub="Across customer hierarchy" tone="green" />
        <KpiCard icon="bolt" title="Usage" value={selected.usage} sub="Current billing period" tone="green" />
        <KpiCard icon="description" title="Bill Readiness" value={`${selected.billReady}%`} sub="Sites ready to bill" tone="blue" />
        <KpiCard icon="credit_card" title="Unbilled Exposure" value={`$${selected.unbilled.toFixed(1)}m`} sub="Open this cycle" tone="purple" />
        <KpiCard icon="warning" title="Open Exceptions" value={selected.exceptions} sub="Across customer sites" tone="amber" />
        <KpiCard icon="account_balance" title="Outstanding Debt" value={`$${selected.debt.toFixed(1)}m`} sub="Due or overdue" tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-4 xl:row-span-5">
          <SectionHeader title="Customer Hierarchy" sub="Select a node for aggregated customer detail, or a site for operational detail." action={<button type="button" className="rounded-lg border border-slate-800 px-2 py-1 text-xs text-slate-300">Saved views</button>} />
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-400">
            <Icon name="search" size={15} />
            <input placeholder="Search site, NMI, address or contract" className="w-full bg-transparent outline-none placeholder:text-slate-500" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedEntity({ type: "node", id: "node-retail-group", name: selected.name })}
            className={cn("mb-4 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-semibold", selectedEntity.id === "node-retail-group" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40" : "text-emerald-300 hover:bg-slate-800")}
          >
            <Icon name="account_tree" size={16} /> {selected.name}
            <span className="ml-auto rounded bg-slate-800 px-2 py-1 text-xs text-slate-400">{selected.sites.toLocaleString()} sites</span>
          </button>
          <div className="max-h-[720px] overflow-auto pr-1 text-sm">
            {HIERARCHY.map((node) => renderNode(node))}
          </div>
        </Panel>

        {isSite ? (
          <div className="space-y-5 xl:col-span-8">
            <Panel className="p-5">
              <SectionHeader
                title={`Site Details: ${selectedSite.site}`}
                sub="Operational detail for the selected site."
                action={
                  <div className="flex flex-wrap gap-2">
                    {selectedSite.creditTags.map((tag) => (
                      <span key={tag} className="rounded-lg border border-slate-700 bg-slate-950/50 px-3 py-1.5 text-xs text-slate-300">{tag}</span>
                    ))}
                  </div>
                }
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 md:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
                    <Icon name="location_on" size={16} className="text-emerald-300" /> Address
                  </div>
                  <div className="text-sm text-slate-300">{selectedSite.address}</div>
                  <div className="mt-3 text-xs text-slate-500">Group: {selectedSite.group}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">NMI</div>
                  <div className="mt-1 text-lg font-semibold text-white">{selectedSite.nmi}</div>
                  <div className="mt-2 text-xs text-slate-500">Meter: {selectedSite.meterStatus}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">Account</div>
                  <div className="mt-1 text-lg font-semibold text-white">{selectedSite.account}</div>
                  <div className="mt-2 text-xs text-slate-500">{selectedSite.contract}</div>
                </div>
              </div>
            </Panel>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <Panel className="p-5 xl:col-span-6">
                <SectionHeader title="Invoices" sub="Unbilled and overdue exposure." />
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="text-xs text-slate-500">Unbilled</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{selectedSite.unbilled}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="text-xs text-slate-500">Overdue</div>
                    <div className="mt-1 text-2xl font-semibold text-white">{selectedSite.overdue}</div>
                  </div>
                </div>
              </Panel>

              <Panel className="p-5 xl:col-span-6">
                <SectionHeader title="Meter Data" />
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div>
                    <div className="text-sm font-medium text-white">{selectedSite.meterStatus}</div>
                    <div className="mt-1 text-xs text-slate-500">Latest interval file processed today</div>
                  </div>
                  <StatusPill>{selectedSite.meterStatus === "Complete" ? "Ready" : "Pending"}</StatusPill>
                </div>
              </Panel>

              <Panel className="p-5 xl:col-span-6">
                <SectionHeader title="Variation Trends" sub="Contract demand vs actual." />
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={demandTrend}>
                      <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={chartTooltipStyle} />
                      <Line type="monotone" dataKey="contract" stroke={COLORS.blue} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="actual" stroke={COLORS.green} strokeWidth={3} />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel className="p-5 xl:col-span-6">
                <SectionHeader title="Cert Details" />
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <Icon name="verified_user" size={16} className="text-emerald-300" /> {selectedSite.cert}
                  </div>
                </div>
              </Panel>

              <Panel className="p-5 xl:col-span-12">
                <SectionHeader title="Pending Interest" />
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">Pending interest</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{selectedSite.pendingInterest}</div>
                </div>
              </Panel>

              <Panel className="p-5 xl:col-span-12">
                <SectionHeader title="Exceptions / Activities" />
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm">
                  <span className="text-slate-300">Open exceptions</span>
                  <span className="font-semibold text-amber-300">{selectedSite.exceptions}</span>
                </div>
              </Panel>
            </div>
          </div>
        ) : (
          <>
            <Panel className="p-5 xl:col-span-8">
              <SectionHeader title={`Node Summary: ${selectedNode.name}`} sub="Aggregated customer view for the selected hierarchy node." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">Sites</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{selectedNode.sites.toLocaleString()}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">kWh</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{selectedNode.usage}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">Billed $</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{selectedNode.billed}</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="text-xs text-slate-500">Unbilled</div>
                  <div className="mt-1 text-2xl font-semibold text-white">{selectedNode.unbilled}</div>
                </div>
              </div>
            </Panel>

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Contact Details" />
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="text-lg font-semibold text-white">{selectedNode.contact}</div>
                <div className="mt-1 text-sm text-slate-400">{selectedNode.role}</div>
                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <div>{selectedNode.email}</div>
                  <div>{selectedNode.phone}</div>
                </div>
              </div>
            </Panel>

            {contractPanel}

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Geographic Distribution" sub="Sites in the selected contract or node." />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#94a3b8", fontSize: 11 }} width={95} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="sites" fill={COLORS.green} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Customer Performance" sub="Billed and paid performance." />
              <div className="space-y-4">
                {([
                  ["Billed", selectedNode.billed, 86],
                  ["Paid", selectedNode.paid, 74],
                  ["Overdue", selectedNode.overdue, 18],
                ] as Array<[string, string, number]>).map(([label, value, width]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-slate-300">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-800">
                      <div className="h-2 rounded bg-emerald-400" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Payment Insights" />
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="text-sm font-semibold text-emerald-300">Insight</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{selectedNode.paymentInsight}</p>
              </div>
            </Panel>
          </>
        )}
      </div>
    </div>
  );
}

/* ────────── Exception Workspace ────────── */

function ExceptionWorkspace() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
        {["Severity", "Owner", "Root Cause", "Customer", "SLA Risk", "Region"].map((f) => (
          <SelectLike key={f} label={f} value="All" />
        ))}
        <button type="button" className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-emerald-300 hover:bg-emerald-500/10">
          Reset filters <Icon name="refresh" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
        <KpiCard icon="warning" title="Open Exceptions" value="312" sub="↓ 18 vs last month" tone="green" />
        <KpiCard icon="warning" title="High Severity" value="18" sub="↑ 5 vs last month" tone="red" />
        <KpiCard icon="credit_card" title="Revenue Impacted" value="$8.7m" sub="↑ $1.9m vs last month" tone="green" />
        <KpiCard icon="schedule" title="SLA Risk" value="26" sub="↑ 7 vs last month" tone="amber" />
        <KpiCard icon="schedule" title="Avg Resolution Time" value="1.8 days" sub="↓ 0.4 days vs last month" tone="purple" />
        <KpiCard icon="check_circle" title="Auto-Resolved" value="37%" sub="↑ 6% vs last month" tone="blue" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-3">
          <SectionHeader title="Exception Lifecycle" />
          <div className="space-y-2">
            {([
              ["New", 112, "36%", COLORS.green],
              ["Triaged", 68, "22%", COLORS.amber],
              ["In Progress", 74, "24%", COLORS.red],
              ["Pending External", 36, "12%", COLORS.blue],
              ["Resolved", 22, "7%", COLORS.purple],
            ] as Array<[string, number, string, string]>).map(([name, v, pct, color], i) => (
              <div key={name} className="mx-auto grid h-12 place-items-center rounded-lg text-sm font-semibold text-white" style={{ width: `${100 - i * 11}%`, backgroundColor: color }}>
                {v} ({pct}) <span className="ml-2 font-normal text-white/70">{name}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-slate-400">Total 312</div>
        </Panel>

        <Panel className="p-5 xl:col-span-3">
          <SectionHeader title="Top Root Causes by Financial Impact" sub="Pareto view" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rootCauses} margin={{ left: -20, right: 5 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={70} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="value" fill={COLORS.green} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-3">
          <SectionHeader title="SLA Risk by Owner & Severity" />
          <div className="overflow-hidden rounded-xl border border-slate-800 text-xs">
            <table className="w-full">
              <thead className="bg-slate-950/60 text-slate-400">
                <tr>
                  <th className="p-2 text-left">Team</th>
                  {["Critical", "High", "Medium", "Low", "Total"].map((h) => (
                    <th key={h} className="p-2 text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ["Unassigned", 3, 7, 5, 2],
                  ["Billing Ops", 6, 11, 9, 4],
                  ["Market Ops", 4, 8, 7, 3],
                  ["Metering Ops", 5, 9, 8, 6],
                  ["Customer Ops", 2, 6, 10, 5],
                  ["RA", 1, 3, 4, 2],
                ] as Array<[string, number, number, number, number]>).map(([team, c, h, m, l]) => (
                  <tr key={team} className="border-t border-slate-800">
                    <td className="p-2 text-slate-300">{team}</td>
                    {[c, h, m, l, c + h + m + l].map((v, i) => {
                      const bg = i === 0 ? `rgba(248,113,113,${0.12 + v / 18})` : i === 1 ? `rgba(245,158,11,${0.12 + v / 24})` : i === 2 ? `rgba(234,179,8,${0.10 + v / 25})` : i === 3 ? `rgba(74,222,128,${0.08 + v / 20})` : "transparent";
                      return (
                        <td key={i} className="p-2 text-right" style={{ background: bg }}>
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel className="p-5 xl:col-span-3">
          <SectionHeader title="Exception Volume Trend" action={<button type="button" className="rounded-lg border border-slate-800 px-3 py-1 text-xs text-slate-300">Last 30 Days</button>} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={exceptionTrend} margin={{ left: -20, right: 5 }}>
                <defs>
                  <linearGradient id="exceptionTrendLm2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="exceptions" stroke={COLORS.green} strokeWidth={3} fill="url(#exceptionTrendLm2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="p-5 xl:col-span-9">
          <SectionHeader
            title="Priority Exception Queue"
            action={
              <div className="flex items-center gap-3 text-slate-400">
                <button type="button" className="text-sm text-emerald-300">View all exceptions →</button>
                <Icon name="refresh" size={16} />
                <Icon name="filter_alt" size={16} />
              </div>
            }
          />
          <div className="overflow-auto rounded-xl border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400">
                <tr>
                  {["", "Customer", "Site", "Issue", "Severity", "Financial Impact", "Age", "Owner", "Status", "SLA Risk"].map((h, i) => (
                    <th key={i} className="whitespace-nowrap px-3 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exceptionRows.map((r) => (
                  <tr key={r.customer + r.site + r.issue} className="border-t border-slate-800 hover:bg-slate-800/50">
                    <td className="px-3 py-3">
                      <input type="checkbox" className="rounded border-slate-700 bg-slate-900" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-white">{r.customer}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-300">{r.site}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-300">{r.issue}</td>
                    <td className="px-3 py-3"><Pill tone={r.severity}>{r.severity}</Pill></td>
                    <td className="px-3 py-3 text-slate-300">{r.impact}</td>
                    <td className="px-3 py-3 text-red-300">{r.age}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-300">{r.owner}</td>
                    <td className="px-3 py-3"><StatusPill>{r.status}</StatusPill></td>
                    <td className="px-3 py-3"><Pill tone={r.sla}>{r.sla}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to 10 of 312 exceptions</span>
            <span>‹ 1 2 3 4 5 … 32 ›</span>
          </div>
        </Panel>

        <Panel className="border-emerald-500/30 p-5 xl:col-span-3">
          <div className="mb-4 flex items-center gap-2">
            <Icon name="auto_awesome" size={20} className="text-emerald-300" />
            <h2 className="text-lg font-semibold text-white">AI Triage Assistant</h2>
            <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">BETA</span>
          </div>
          <div className="text-sm font-semibold text-white">Triage Summary</div>
          <p className="mt-1 text-xs text-slate-500">Based on financial impact and urgency</p>
          <div className="mt-5 space-y-5">
            <div>
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-red-500/20 text-red-300">1</div>
                <div>
                  <div className="font-medium text-white">Missing interval data</div>
                  <div className="text-sm text-slate-300">$3.1m impacted (36%)</div>
                  <p className="mt-1 text-xs text-slate-500">Interval gaps or delays causing estimated billing and revenue leakage.</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 pl-11 text-xs text-emerald-300">
                <div>✓ Backfill missing interval data</div>
                <div>✓ Validate meter communications</div>
                <div>✓ Reprocess billing for affected sites</div>
              </div>
            </div>
            <div>
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-amber-500/20 text-amber-300">2</div>
                <div>
                  <div className="font-medium text-white">Bill validation failure</div>
                  <div className="text-sm text-slate-300">$2.6m impacted (30%)</div>
                  <p className="mt-1 text-xs text-slate-500">Pricing, tariff or data validation failures blocking accurate billing.</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 pl-11 text-xs text-emerald-300">
                <div>✓ Review validation rules and edits</div>
                <div>✓ Correct source data or mappings</div>
                <div>✓ Re-run validation and re-bill</div>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="text-sm text-slate-300">Estimated recoverable revenue if acted on today</div>
            <div className="mt-1 text-3xl font-semibold text-emerald-300">$4.7m</div>
          </div>
          <button type="button" className="mt-4 w-full rounded-xl border border-emerald-400/50 px-4 py-3 text-sm font-medium text-emerald-300 hover:bg-emerald-500/10">
            View AI recommendations →
          </button>
        </Panel>
      </div>
    </div>
  );
}

/* ────────── Dashboard header (within main pane) ────────── */

function DashboardHeader({ activeView, selected, setActiveView, setSelectedCustomer, compact }: { activeView: ViewKey; selected: CustomerRecord; setActiveView: (v: ViewKey) => void; setSelectedCustomer: (c: CustomerRecord) => void; compact: boolean }) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const isCustomer = activeView === "Customer Hierarchy";
  const title = isCustomer ? selected.name : activeView;
  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()));

  const subtitle = isCustomer
    ? "Customer command centre for hierarchy, site, billing, usage and exceptions."
    : activeView === "Exception Workspace"
      ? "Unified queue for billing, market, metering and customer exceptions."
      : "Operational command and control for contracted C&I and SME portfolios.";

  const customerPicker = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowCustomerPicker((v) => !v)}
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 text-left transition hover:border-emerald-400/40 hover:bg-slate-900",
          compact ? "px-3 py-1.5" : "px-5 py-3",
        )}
      >
        <div>
          {!compact && <div className="text-[11px] uppercase tracking-wide text-slate-500">Customer</div>}
          <div className={cn("font-semibold tracking-tight text-white", compact ? "text-base" : "text-3xl")}>{selected.name}</div>
        </div>
        <Icon name="expand_more" size={compact ? 16 : 18} className={cn("text-slate-500 transition", !compact && "mt-1", showCustomerPicker && "rotate-180")} />
      </button>

      {showCustomerPicker && (
        <div className="absolute left-0 top-full z-50 mt-3 w-[520px] rounded-2xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3 text-sm text-slate-400">
            <Icon name="search" size={15} />
            <input
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Search customer, segment or manager"
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-800">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setShowCustomerPicker(false);
                  setCustomerSearch("");
                }}
                className={cn(
                  "flex w-full items-center gap-4 border-b border-slate-800 px-4 py-4 text-left transition last:border-b-0 hover:bg-emerald-500/5",
                  selected.id === customer.id && "bg-emerald-500/10",
                )}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-sm font-semibold text-emerald-300">
                  {customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">{customer.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{customer.segment}</span>
                    <span>•</span>
                    <span>{customer.industry}</span>
                    <span>•</span>
                    <span>{customer.sites.toLocaleString()} sites</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-400">Bill Ready</div>
                  <div className={cn("mt-1 font-semibold", customer.billReady < 60 ? "text-red-300" : customer.billReady < 80 ? "text-amber-300" : "text-emerald-300")}>
                    {customer.billReady}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const actions = (
    <div className="flex items-center gap-2">
      {isCustomer && (
        <button
          type="button"
          onClick={() => setActiveView("Portfolio Overview")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-600",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          <Icon name="arrow_back" size={compact ? 14 : 16} /> {compact ? "Back" : "Back to Portfolio"}
        </button>
      )}
      {activeView === "Exception Workspace" ? (
        <button
          type="button"
          className={cn(
            "rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-600",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          Bulk Action <Icon name="expand_more" size={compact ? 12 : 14} className="ml-1 inline" />
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-200 hover:border-slate-600",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          <Icon name="download" size={compact ? 14 : 16} /> Export
        </button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "sticky top-0 z-20 border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl transition-[padding] duration-200",
        compact ? "px-7 py-2" : "px-7 py-5",
      )}
    >
      {compact ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {isCustomer ? (
              customerPicker
            ) : (
              <h1 className="truncate text-lg font-semibold tracking-tight text-white">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <ViewSwitcher activeView={activeView} setActiveView={setActiveView} selected={selected} />
            {actions}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-end gap-4">
            <ViewSwitcher activeView={activeView} setActiveView={setActiveView} selected={selected} />
          </div>

          <div className="flex items-start justify-between gap-6">
            <div>
              {isCustomer ? (
                customerPicker
              ) : (
                <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
              )}
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
              {isCustomer && (
                <div className="mt-2 text-xs text-blue-300">
                  Portfolio Overview <span className="text-slate-600">›</span> {selected.name}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">{actions}</div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-500">
            <Icon name="refresh" size={13} /> Last updated: 8:32 AM AEST
            {isCustomer && <span className="ml-3 rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">Auto refresh •</span>}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────── Right insight rail ────────── */

function RightInsightRail({ activeView, selected }: { activeView: ViewKey; selected: CustomerRecord }) {
  const isCustomer = activeView === "Customer Hierarchy";
  const isPortfolio = activeView === "Portfolio Overview";
  if (!isCustomer && !isPortfolio) return null;

  const insightTitle = isCustomer ? `${selected.name} needs focused billing attention` : "Billing and collections performance improving";

  const insightBody = isCustomer
    ? "Unbilled exposure and open exceptions are concentrated in a small number of high-value sites. Prioritise meter data completeness, billing validation and collections follow-up."
    : "Portfolio billed performance improved month-on-month, with payment timeliness strongest across Health and Facilities segments.";

  return (
    <aside className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-800 bg-slate-950/95 p-5 backdrop-blur-xl xl:flex xl:flex-col">
      <Panel className="border-emerald-500/30 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="auto_awesome" size={20} className="text-emerald-300" />
          <h2 className="text-lg font-semibold text-white">AI Insight</h2>
          <span className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300">BETA</span>
        </div>
        <div className="text-base font-semibold text-white">{insightTitle}</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{insightBody}</p>
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-sm font-semibold text-emerald-300">Next best action</div>
          <div className="mt-1 text-sm text-slate-300">
            {isCustomer ? "Resolve blocked billing drivers for the highest-value sites first." : "Prioritise customers with high billed value but low paid percentage this cycle."}
          </div>
        </div>
      </Panel>

      {isCustomer && (
        <Panel className="mt-5 p-5">
          <SectionHeader title="Quick Actions" />
          <div className="space-y-3">
            {["Update Contact", "Upload Ratchets", "Import Payments", "Download Meter Data", "Download Invoices"].map((action) => (
              <button
                key={action}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:bg-slate-900"
              >
                <span>{action}</span>
                <Icon name="chevron_right" size={15} className="text-slate-500" />
              </button>
            ))}
          </div>
        </Panel>
      )}
    </aside>
  );
}

/* ────────── Page wrapper with Glass chrome ────────── */

export default function GlassVisionLM2Page() {
  return (
    <Suspense>
      <GlassVisionLM2Content />
    </Suspense>
  );
}

function GlassVisionLM2Content() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<ViewKey>("Portfolio Overview");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord>(customers[0]);
  const [activeNavId, setActiveNavId] = useState("customers-portfolio");
  const [openParentId, setOpenParentId] = useState<string | null>("customers");
  const [isExpanded, setIsExpanded] = useState(searchParams.get("expanded") === "true");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [headerCompact, setHeaderCompact] = useState(false);
  const headerSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [flyoutParentId, setFlyoutParentId] = useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sentinel = headerSentinelRef.current;
    const scrollRoot = scrollContainerRef.current;
    if (!sentinel || !scrollRoot) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeaderCompact(!entry.isIntersecting),
      { root: scrollRoot, threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) sidebar.style.display = isExpanded ? "none" : "";
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

  const openCustomer = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setActiveView("Customer Hierarchy");
  };

  const content = useMemo(() => {
    if (activeView === "Portfolio Overview") return <PortfolioOverview setActiveView={setActiveView} openCustomer={openCustomer} />;
    if (activeView === "Customer Hierarchy") return <CustomerDrilldown selected={selectedCustomer} />;
    return <ExceptionWorkspace />;
  }, [activeView, selectedCustomer]);

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: DARKEST_NAVY }}>
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ────── Glass header chrome ────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex items-center">
              <Image src="/GlassLogoTest_darkmode.svg" alt="Tally Glass" width={140} height={40} className="h-8 w-auto" priority />
            </Link>
            <div className="h-6 w-px bg-white/30" />
            <Link href="/pages/tally-large-market" className="flex items-center transition-opacity hover:opacity-80">
              <Image src="/TallyCIS_Test.svg" alt="Tally CIS" width={140} height={34} className="h-7 w-auto brightness-0 invert" />
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
            <button type="button" className="flex items-center gap-1.5 rounded-full bg-orange-400 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-orange-500">
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
          {/* ────── Left navigation ────── */}
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
                          parentActive ? "bg-white/10 text-[#00D2A2]" : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
                        )}
                      >
                        <Icon name={item.icon} size={20} className={cn("shrink-0", parentActive ? "text-[#00D2A2]" : "text-gray-400 group-hover:text-gray-100")} />
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
                        parentActive || isOpen ? "bg-white/10 text-[#00D2A2]" : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
                      )}
                    >
                      <Icon name={item.icon} size={20} className={cn("shrink-0", parentActive || isOpen ? "text-[#00D2A2]" : "text-gray-400 group-hover:text-gray-100")} />
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
                                activeNavId === child.id ? "bg-white/10 text-[#00D2A2]" : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
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
                        activeNavId === child.id ? "mx-2 rounded-lg bg-[#00D2A2]/20 font-medium text-[#00D2A2]" : "text-gray-400 hover:text-gray-100",
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ────── Main pane: dashboard with radial glow + right rail ────── */}
          <main
            className="flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem] text-slate-100"
            style={{ background: "radial-gradient(circle at top left, #123024 0, #020617 32%, #020617 100%)" }}
          >
            <div ref={scrollContainerRef} className="flex min-w-0 flex-1 flex-col overflow-y-auto">
              <div ref={headerSentinelRef} className="h-px shrink-0" aria-hidden />
              <DashboardHeader activeView={activeView} selected={selectedCustomer} setActiveView={setActiveView} setSelectedCustomer={setSelectedCustomer} compact={headerCompact} />
              <div className="p-7">{content}</div>
            </div>
            <RightInsightRail activeView={activeView} selected={selectedCustomer} />
          </main>
        </div>
      </div>
    </div>
  );
}
