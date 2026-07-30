"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  ComposedChart,
  Line,
  LineChart as RLineChart,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { Sheet, SheetContent } from "@/components/Sheet/Sheet";
import { Dialog, DialogContent } from "@/components/Dialog/Dialog";
import { cn } from "@/lib/utils";
import { secondaryColors } from "@/lib/tokens/colors";
import {
  adoraDefenderIssues,
  adoraDefenderSections,
  type AdoraDefenderDrillDown,
  type AdoraDefenderIssue,
  type AdoraDefenderSection,
} from "@/lib/mock-data/adora-defender-issues";

/* ────────── Theme tokens ────────── */

const ACCENT = "#00D2A2";

/** Darkest navy — header & left nav chrome */
const DARKEST_NAVY = "#161B2E";
/** Dark navy for search input */
const DARK_NAVY = "#212946";

const COLORS_DARK = {
  green: ACCENT,
  green2: "#22c55e",
  blue: "#60a5fa",
  amber: "#f59e0b",
  red: "#fb7185",
  purple: "#a78bfa",
  slate: "#64748b",
};

const COLORS_LIGHT = {
  green: "#0F9C7A",
  green2: "#16a34a",
  blue: "#2563eb",
  amber: "#d97706",
  red: "#dc2626",
  purple: "#7c3aed",
  slate: "#475569",
};

/** Subscribe to the global `.dark` class on <html> and return the resolved theme. */
function useResolvedTheme(): "light" | "dark" {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const compute = () => (root.classList.contains("dark") ? "dark" : "light");
    setTheme(compute());
    const observer = new MutationObserver(() => setTheme(compute()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}

function useColors() {
  const theme = useResolvedTheme();
  return theme === "light" ? COLORS_LIGHT : COLORS_DARK;
}

function useChartTheme() {
  const theme = useResolvedTheme();
  const isLight = theme === "light";
  return {
    isLight,
    grid: isLight ? "#E2E8F0" : "#1e293b",
    axis: isLight ? "#64748b" : "#94a3b8",
    tooltipStyle: {
      background: isLight ? "#ffffff" : "#020617",
      border: `1px solid ${isLight ? "#cbd5e1" : "#334155"}`,
      borderRadius: 12,
      color: isLight ? "#0f172a" : "#e2e8f0",
    } as React.CSSProperties,
  };
}

/** Back-compat alias for module-scope constants that pre-date the theme hook. */
const COLORS = COLORS_DARK;

const riskClasses: Record<string, string> = {
  High: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/30",
  Medium: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30",
  Critical: "bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-400/40",
};

const statusClasses: Record<string, string> = {
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30",
  Blocked: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/30",
  Pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30",
  Billed: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30",
  Current: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30",
  Overdue: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/30",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30",
  New: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-400/30",
  Triaged: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30",
  "In Progress": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-400/30",
  "Pending External": "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-500/15 dark:text-slate-300 dark:border-slate-400/30",
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
  { id: "battery-site", name: "Battery Site", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 1, usageMwh: 0, usage: "0 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0, exceptions: 145, debt: 0, regions: [{ name: "VIC", sites: 1, share: 100, usage: 0 }] },
  { id: "btm-parent", name: "BTM Parent Account 1", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 1, usageMwh: 1200, usage: "1.2 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.12, exceptions: 12, debt: 0, regions: [{ name: "NSW", sites: 1, share: 100, usage: 1.2 }] },
  { id: "crp", name: "CRP", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 42, usageMwh: 8400, usage: "8.4 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.8, exceptions: 8, debt: 0, regions: [{ name: "Multi-state", sites: 42, share: 100, usage: 8.4 }] },
  { id: "gas-parent", name: "Gas Parent Account", segment: "Gas", industry: "Gas", manager: "Ops Team", sites: 18, usageMwh: 3200, usage: "3.2 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.3, exceptions: 6, debt: 0, regions: [{ name: "VIC", sites: 10, share: 55, usage: 1.8 }, { name: "NSW", sites: 8, share: 45, usage: 1.4 }] },
  { id: "industrial-hub", name: "Industrial Hub Portfolio", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 124, usageMwh: 45200, usage: "45.2 GWh", billReady: 0, blockedRevenue: 0, unbilled: 4.5, exceptions: 14, debt: 0.2, regions: [{ name: "QLD", sites: 68, share: 55, usage: 24.8 }, { name: "NSW", sites: 56, share: 45, usage: 20.4 }] },
  { id: "metro-retail", name: "Metro Retail Network", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 286, usageMwh: 22100, usage: "22.1 GWh", billReady: 0, blockedRevenue: 0, unbilled: 2.2, exceptions: 11, debt: 0, regions: [{ name: "VIC", sites: 142, share: 50, usage: 11.0 }, { name: "SA", sites: 144, share: 50, usage: 11.1 }] },
  { id: "solar-farm", name: "Solar Farm Collective", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 6, usageMwh: 18600, usage: "18.6 GWh", billReady: 0, blockedRevenue: 0, unbilled: 1.8, exceptions: 4, debt: 0, regions: [{ name: "WA", sites: 6, share: 100, usage: 18.6 }] },
  { id: "community-gas", name: "Community Gas Scheme", segment: "Gas", industry: "Gas", manager: "Ops Team", sites: 94, usageMwh: 5400, usage: "5.4 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.5, exceptions: 9, debt: 0, regions: [{ name: "VIC", sites: 94, share: 100, usage: 5.4 }] },
  { id: "hospital-network", name: "Hospital Network", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 38, usageMwh: 9800, usage: "9.8 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.9, exceptions: 7, debt: 0, regions: [{ name: "NSW", sites: 38, share: 100, usage: 9.8 }] },
  { id: "logistics-park", name: "Logistics Park", segment: "Electricity", industry: "Electricity", manager: "Ops Team", sites: 22, usageMwh: 6700, usage: "6.7 GWh", billReady: 0, blockedRevenue: 0, unbilled: 0.6, exceptions: 5, debt: 0, regions: [{ name: "QLD", sites: 22, share: 100, usage: 6.7 }] },
];

interface PortfolioPerformanceRow {
  customer: string;
  segment: string;
  sites: number;
  expectedBill: string;
  billed: string;
  avgBillDay: string;
  paid: string;
  billReadyPct: string;
  pctBilled: string;
  pctPaid: string;
  exceptions: number;
}

const portfolioPerformance: PortfolioPerformanceRow[] = [
  { customer: "Battery Site", segment: "Electricity", sites: 1, expectedBill: "$0.00", billed: "$0.00", avgBillDay: "—", paid: "$0.00", billReadyPct: "—", pctBilled: "—", pctPaid: "—", exceptions: 145 },
  { customer: "BTM Parent Account 1", segment: "Electricity", sites: 1, expectedBill: "$0.00", billed: "$0.00", avgBillDay: "—", paid: "$0.00", billReadyPct: "—", pctBilled: "—", pctPaid: "—", exceptions: 12 },
  { customer: "CRP", segment: "Electricity", sites: 42, expectedBill: "$8,420.00", billed: "$0.00", avgBillDay: "—", paid: "$0.00", billReadyPct: "0%", pctBilled: "0%", pctPaid: "0%", exceptions: 8 },
  { customer: "Gas Parent Account", segment: "Gas", sites: 18, expectedBill: "$3,180.00", billed: "$2,940.00", avgBillDay: "12", paid: "$1,960.00", billReadyPct: "0%", pctBilled: "92.5%", pctPaid: "66.7%", exceptions: 6 },
  { customer: "Industrial Hub Portfolio", segment: "Electricity", sites: 124, expectedBill: "$45,200.00", billed: "$38,400.00", avgBillDay: "8", paid: "$24,100.00", billReadyPct: "0%", pctBilled: "85.0%", pctPaid: "62.8%", exceptions: 14 },
  { customer: "Metro Retail Network", segment: "Electricity", sites: 286, expectedBill: "$22,100.00", billed: "$18,600.00", avgBillDay: "15", paid: "$12,400.00", billReadyPct: "0%", pctBilled: "84.2%", pctPaid: "66.7%", exceptions: 11 },
  { customer: "Solar Farm Collective", segment: "Electricity", sites: 6, expectedBill: "$18,600.00", billed: "$14,200.00", avgBillDay: "6", paid: "$9,800.00", billReadyPct: "0%", pctBilled: "76.3%", pctPaid: "69.0%", exceptions: 4 },
  { customer: "Community Gas Scheme", segment: "Gas", sites: 94, expectedBill: "$5,400.00", billed: "$4,100.00", avgBillDay: "18", paid: "$2,200.00", billReadyPct: "0%", pctBilled: "75.9%", pctPaid: "53.7%", exceptions: 9 },
  { customer: "Hospital Network", segment: "Electricity", sites: 38, expectedBill: "$9,800.00", billed: "$7,200.00", avgBillDay: "10", paid: "$4,800.00", billReadyPct: "0%", pctBilled: "73.5%", pctPaid: "66.7%", exceptions: 7 },
  { customer: "Logistics Park", segment: "Electricity", sites: 22, expectedBill: "$6,700.00", billed: "$5,100.00", avgBillDay: "14", paid: "$3,400.00", billReadyPct: "0%", pctBilled: "76.1%", pctPaid: "66.7%", exceptions: 5 },
];

const trend = [
  { month: "Sep 25", exposure: 80 },
  { month: "Oct 25", exposure: 80 },
  { month: "Nov 25", exposure: 80 },
  { month: "Dec 25", exposure: 82 },
  { month: "Jan 26", exposure: 85 },
  { month: "Feb 26", exposure: 120 },
  { month: "Mar 26", exposure: 190 },
  { month: "Apr 26", exposure: 150 },
  { month: "May 26", exposure: 90 },
  { month: "Jun 26", exposure: 40 },
  { month: "Jul 26", exposure: 0 },
];

const activeSitesTrend = [
  { month: "Aug '23", sites: 792 },
  { month: "Sep '23", sites: 794 },
  { month: "Oct '23", sites: 795 },
  { month: "Nov '23", sites: 796 },
  { month: "Dec '23", sites: 797 },
  { month: "Jan '24", sites: 797 },
  { month: "Feb '24", sites: 797 },
  { month: "Mar '24", sites: 797 },
  { month: "Apr '24", sites: 797 },
  { month: "May '24", sites: 797 },
  { month: "Jun '24", sites: 797 },
  { month: "Jul '24", sites: 797 },
];

const invoiceIssueDay = [
  { day: "1", share: 2, amount: 1.2 },
  { day: "5", share: 4, amount: 2.1 },
  { day: "10", share: 6, amount: 3.4 },
  { day: "15", share: 18, amount: 12.8 },
  { day: "20", share: 8, amount: 5.6 },
  { day: "25", share: 5, amount: 3.2 },
  { day: "28", share: 12, amount: 8.4 },
  { day: "30", share: 3, amount: 1.8 },
];

const ADORA_DEFENDER_TOTAL = 1240;

const adoraDefenderOutcomes = {
  pass: { value: 97, count: Math.round(ADORA_DEFENDER_TOTAL * 0.97) },
  fail: { value: 1, count: Math.round(ADORA_DEFENDER_TOTAL * 0.01) },
  warning: { value: 2, count: Math.round(ADORA_DEFENDER_TOTAL * 0.02) },
};

const ADORA_BUCKET = "tally-ml-poc-raw-invoices";
/**
 * Demo invoice served from `/public`. In production, swap this for the real
 * invoice-store deep link (e.g. `https://storage.googleapis.com/${ADORA_BUCKET}/${issue.fileName}`).
 */
const ADORA_SAMPLE_PDF = "/sample-invoice.pdf";

const adoraPdfUrl = (_issue: AdoraDefenderIssue) => ADORA_SAMPLE_PDF;

function seedAdoraReviewed(): Record<string, boolean> {
  return Object.fromEntries(adoraDefenderIssues.map((issue) => [issue.eventId, issue.reviewed]));
}

const adoraToneStyles: Record<"green" | "red" | "amber", { chip: string; bar: string; barFill: string; barStroke: string; accent: string; hoverBorder: string }> = {
  green: {
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/20",
    bar: "bg-emerald-500 dark:bg-emerald-400",
    barFill: "#DCFCE7",
    barStroke: "#22C55E",
    accent: "text-emerald-700 dark:text-emerald-300",
    hoverBorder: "hover:border-emerald-400/60 dark:hover:border-emerald-400/50",
  },
  red: {
    chip: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-300 dark:border-red-400/20",
    bar: "bg-red-500 dark:bg-red-400",
    barFill: "#FEE2E2",
    barStroke: "#EF4444",
    accent: "text-red-700 dark:text-red-300",
    hoverBorder: "hover:border-red-400/60 dark:hover:border-red-400/50",
  },
  amber: {
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/20",
    bar: "bg-amber-500 dark:bg-amber-400",
    barFill: "#FEF9C3",
    barStroke: "#F59E0B",
    accent: "text-amber-700 dark:text-amber-300",
    hoverBorder: "hover:border-amber-400/60 dark:hover:border-amber-400/50",
  },
};

function AdoraDefenderPanel() {
  const chart = useChartTheme();
  const [drillDown, setDrillDown] = useState<AdoraDefenderDrillDown | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [findingsView, setFindingsView] = useState<"table" | "cards">("table");
  const [pdfPreview, setPdfPreview] = useState<AdoraDefenderIssue | null>(null);
  const [reviewedState, setReviewedState] = useState<Record<string, boolean>>(() => seedAdoraReviewed());

  const sections = drillDown ? adoraDefenderSections[drillDown] : null;
  const totalFindings = sections ? sections.reduce((sum, s) => sum + s.findings.length, 0) : 0;
  const selectedSection = sections && activeSection ? sections.find((s) => s.section === activeSection) ?? null : null;
  const tone = drillDown === "Fail" ? adoraToneStyles.red : adoraToneStyles.amber;

  const goToOutcomes = () => {
    setDrillDown(null);
    setActiveSection(null);
  };
  const openDrillDown = (name: AdoraDefenderDrillDown) => {
    setDrillDown(name);
    setActiveSection(null);
  };
  const toggleReviewed = (id: string) => setReviewedState((p) => ({ ...p, [id]: !p[id] }));

  const openPdfPreview = (issue: AdoraDefenderIssue) => {
    setPdfPreview(issue);
    setExpanded(true);
  };

  const handleExpandedChange = (open: boolean) => {
    setExpanded(open);
    if (!open) setPdfPreview(null);
  };

  const renderPdfLink = (issue: AdoraDefenderIssue, variant: "table" | "card") => {
    if (variant === "table") {
      return (
        <button
          type="button"
          onClick={() => openPdfPreview(issue)}
          className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline dark:text-emerald-300"
          title={`View ${issue.invoiceNumber}.pdf`}
        >
          {issue.invoiceNumber}
          <Icon name="picture_as_pdf" size={13} />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openPdfPreview(issue)}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:ring-offset-slate-900"
        title={`View ${issue.invoiceNumber}.pdf`}
      >
        <Icon name="picture_as_pdf" size={15} />
        Open PDF
      </button>
    );
  };

  const liveMessage = !drillDown
    ? "Showing validation outcomes summary"
    : selectedSection
      ? `Showing ${selectedSection.findings.length} ${drillDown} findings in ${selectedSection.section}`
      : `Showing ${drillDown} findings by validation section, ${totalFindings} findings`;

  const barData = sections?.map((s) => ({ section: s.section, count: s.findings.length })) ?? [];
  const domainMax = barData.length ? Math.max(2, Math.ceil(Math.max(...barData.map((d) => d.count)) / 2) * 2) : 2;
  const ticks = Array.from({ length: domainMax / 2 + 1 }, (_, i) => i * 2);

  const tiles = [
    { name: "Fail" as const, tone: adoraToneStyles.red, icon: "cancel", ...adoraDefenderOutcomes.fail },
    { name: "Warning" as const, tone: adoraToneStyles.amber, icon: "warning", ...adoraDefenderOutcomes.warning },
  ];

  const renderFindingsTable = (section: AdoraDefenderSection, inModal: boolean) => (
    <div
      className="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-800"
      style={{ maxHeight: inModal ? "62vh" : "18rem" }}
    >
      <table className="w-full border-collapse text-xs">
        <thead className="sticky top-0 z-10 bg-emerald-600 text-left text-white dark:bg-emerald-700">
          <tr>
            {["event_id", "status", "section", "description", "file_name", "invoice_number", "Reviewed"].map((h) => (
              <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.findings.map((issue, index) => (
            <tr key={`${issue.eventId}-${index}`} className="border-t border-slate-200 odd:bg-white even:bg-slate-50 hover:bg-emerald-50/60 dark:border-slate-800 dark:odd:bg-slate-900/40 dark:even:bg-slate-900/70 dark:hover:bg-emerald-500/5">
              <td className="max-w-[220px] truncate px-3 py-2 text-slate-600 dark:text-slate-400" title={issue.eventId}>{issue.eventId}</td>
              <td className="whitespace-nowrap px-3 py-2">
                <span className={cn(
                  "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                  issue.status === "FAIL"
                    ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                )}
                >
                  {issue.status}
                </span>
              </td>
              <td className="min-w-[160px] px-3 py-2 text-slate-700 dark:text-slate-300">{issue.section}</td>
              <td className="min-w-[280px] max-w-[360px] px-3 py-2 text-slate-600 dark:text-slate-400">{issue.description}</td>
              <td className="max-w-[220px] truncate px-3 py-2 text-slate-600 dark:text-slate-400" title={issue.fileName}>{issue.fileName}</td>
              <td className="whitespace-nowrap px-3 py-2">
                {renderPdfLink(issue, "table")}
              </td>
              <td className="px-3 py-2 text-center">
                <input
                  type="checkbox"
                  checked={reviewedState[issue.eventId] ?? false}
                  onChange={() => toggleReviewed(issue.eventId)}
                  aria-label={`Mark ${issue.invoiceNumber} reviewed`}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderFindingsCards = (section: AdoraDefenderSection, inModal: boolean) => (
    <div
      className="mt-3 space-y-2.5 overflow-auto pr-0.5"
      style={{ maxHeight: inModal ? "62vh" : "18rem" }}
    >
      {section.findings.map((issue, index) => {
        const isFail = issue.status === "FAIL";
        return (
          <div
            key={`${issue.eventId}-${index}`}
            className={cn(
              "rounded-xl border border-l-4 border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60",
              isFail ? "border-l-red-500 dark:border-l-red-400" : "border-l-amber-500 dark:border-l-amber-400",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                  isFail
                    ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                )}
                >
                  {issue.status}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{issue.invoiceNumber}</span>
              </div>
              <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={reviewedState[issue.eventId] ?? false}
                  onChange={() => toggleReviewed(issue.eventId)}
                  aria-label={`Mark ${issue.invoiceNumber} reviewed`}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-900"
                />
                Reviewed
              </label>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{issue.description}</p>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                <Icon name="description" size={13} />
                <span className="truncate" title={issue.fileName}>{issue.fileName}</span>
              </span>
              {renderPdfLink(issue, "card")}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderInvoiceTable = (section: AdoraDefenderSection, inModal: boolean) => (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium", tone.chip)}>
            <Icon name={drillDown === "Fail" ? "cancel" : "warning"} size={13} />
            {drillDown}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{section.findings.length} findings in this section</span>
        </div>
        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 dark:border-slate-800" role="group" aria-label="Findings view">
          {([
            { key: "table" as const, icon: "table_rows", label: "Table view" },
            { key: "cards" as const, icon: "grid_view", label: "Card view" },
          ]).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFindingsView(opt.key)}
              aria-pressed={findingsView === opt.key}
              aria-label={opt.label}
              title={opt.label}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                findingsView === opt.key
                  ? "bg-[#2C365D] text-white dark:bg-emerald-500/20 dark:text-emerald-300"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white",
              )}
            >
              <Icon name={opt.icon} size={16} />
            </button>
          ))}
        </div>
      </div>
      {findingsView === "table" ? renderFindingsTable(section, inModal) : renderFindingsCards(section, inModal)}
      <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Select an invoice number to view the source PDF in the expanded panel.</p>
    </div>
  );

  const renderPdfViewer = () => {
    if (!pdfPreview) return null;

    return (
      <aside className="flex min-h-0 w-full min-w-0 flex-col border-slate-200 dark:border-slate-800 lg:w-[min(52%,640px)] lg:shrink-0 lg:border-l">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Invoice {pdfPreview.invoiceNumber}</div>
            <div className="truncate text-xs text-slate-500 dark:text-slate-400" title={pdfPreview.fileName}>{pdfPreview.fileName}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <a
              href={adoraPdfUrl(pdfPreview)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              title="Open PDF in new tab"
              aria-label="Open PDF in new tab"
            >
              <Icon name="open_in_new" size={18} />
            </a>
            <button
              type="button"
              onClick={() => setPdfPreview(null)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close PDF preview"
              title="Close PDF preview"
            >
              <Icon name="close" size={18} />
            </button>
          </div>
        </div>
        <iframe
          src={adoraPdfUrl(pdfPreview)}
          title={`Invoice ${pdfPreview.invoiceNumber} PDF`}
          className="min-h-[50vh] w-full flex-1 bg-slate-100 dark:bg-slate-950"
        />
      </aside>
    );
  };

  const renderBody = (inModal: boolean) => {
    const content = (
      <>
      <span className="sr-only" aria-live="polite">{liveMessage}</span>

      <div className="mb-1 flex items-start justify-between gap-4">
        <h2 className={cn("flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white", inModal ? "text-lg" : "text-sm")}>
          <Image
            src="/AdoraDefenderLogo.png"
            alt="Adora"
            width={135}
            height={57}
            className={cn("w-auto", inModal ? "h-12" : "h-9")}
            priority
          />
          <span>defender</span>
        </h2>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Download" className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <Icon name="download" size={18} />
          </button>
          <button
            type="button"
            onClick={() => (inModal ? handleExpandedChange(false) : setExpanded(true))}
            aria-label={inModal ? "Exit full screen" : "Expand to full screen"}
            title={inModal ? "Exit full screen" : "Expand to full screen"}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <Icon name={inModal ? "close_fullscreen" : "open_in_full"} size={18} />
          </button>
        </div>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">AI PDF validation outcomes for invoices issued in current month</p>

      {drillDown ? (
        <>
          <nav className="mt-4 flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <button type="button" onClick={goToOutcomes} className="rounded font-medium text-[#2C365D] hover:underline dark:text-slate-300">Outcomes</button>
            <Icon name="chevron_right" size={14} className="text-slate-400" />
            {selectedSection ? (
              <button type="button" onClick={() => setActiveSection(null)} className="rounded font-medium text-[#2C365D] hover:underline dark:text-slate-300">{drillDown}</button>
            ) : (
              <span className="font-medium text-slate-700 dark:text-slate-200">{drillDown}</span>
            )}
            {selectedSection && (
              <>
                <Icon name="chevron_right" size={14} className="text-slate-400" />
                <span className="font-medium text-slate-700 dark:text-slate-200">{selectedSection.section}</span>
              </>
            )}
          </nav>

          {selectedSection ? (
            renderInvoiceTable(selectedSection, inModal)
          ) : (
            <>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{drillDown} — by validation section</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{totalFindings} findings · issue date in current month · select a section for detail</p>
              </div>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 24 }}>
                    <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" horizontal vertical={false} />
                    <XAxis
                      type="number"
                      domain={[0, domainMax]}
                      ticks={ticks}
                      tick={{ fill: chart.axis, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Findings", position: "insideBottom", offset: -12, fill: chart.axis, fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="section"
                      width={200}
                      tick={{ fill: chart.axis, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "Section", angle: -90, position: "insideLeft", fill: chart.axis, fontSize: 11, dx: -8 }}
                    />
                    <Tooltip contentStyle={chart.tooltipStyle} cursor={{ fill: "transparent" }} />
                    <Bar
                      dataKey="count"
                      fill={tone.barFill}
                      stroke={tone.barStroke}
                      strokeWidth={1}
                      radius={[0, 4, 4, 0]}
                      barSize={22}
                      onClick={(data) => {
                        const section = (data as unknown as { payload?: { section?: string } }).payload?.section;
                        if (section) setActiveSection(section);
                      }}
                      style={{ cursor: "pointer" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-center text-xs text-slate-400 dark:text-slate-500">Select a bar to view findings in that section</p>
            </>
          )}
        </>
      ) : (
        <>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{ADORA_DEFENDER_TOTAL.toLocaleString()} invoices validated</span>
            <span>Issue date in current month</span>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-lg border", adoraToneStyles.green.chip)}>
                  <Icon name="check_circle" size={16} />
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Pass rate</span>
              </div>
              <span className="text-2xl font-semibold text-slate-900 dark:text-white">{adoraDefenderOutcomes.pass.value}%</span>
            </div>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={adoraToneStyles.green.bar} style={{ width: `${adoraDefenderOutcomes.pass.value}%` }} />
              <div className={adoraToneStyles.red.bar} style={{ width: `${adoraDefenderOutcomes.fail.value}%` }} />
              <div className={adoraToneStyles.amber.bar} style={{ width: `${adoraDefenderOutcomes.warning.value}%` }} />
            </div>
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              {adoraDefenderOutcomes.pass.count.toLocaleString()} of {ADORA_DEFENDER_TOTAL.toLocaleString()} invoices passed validation
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {tiles.map((tile) => (
              <button
                key={tile.name}
                type="button"
                onClick={() => openDrillDown(tile.name)}
                className={cn(
                  "group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70",
                  tile.tone.hoverBorder,
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg border", tile.tone.chip)}>
                    <Icon name={tile.icon} size={18} />
                  </span>
                  <Icon name="chevron_right" size={16} className="text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-300" />
                </div>
                <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">{tile.count.toLocaleString()}</div>
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{tile.name} · {tile.value}%</div>
                <div className={cn("mt-2 text-xs font-medium", tile.tone.accent)}>View findings →</div>
              </button>
            ))}
          </div>
        </>
      )}
      </>
    );

    if (inModal && pdfPreview) {
      return (
        <div className="flex min-h-0 flex-1 flex-col gap-0 lg:flex-row lg:gap-5">
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pr-0 lg:pr-2">{content}</div>
          {renderPdfViewer()}
        </div>
      );
    }

    return content;
  };

  return (
    <>
      <Panel className="p-5">{renderBody(false)}</Panel>
      <Dialog open={expanded} onOpenChange={handleExpandedChange}>
        <DialogContent className="!flex !flex-col h-[92vh] w-[95vw] !max-w-[1400px] overflow-hidden !bg-white p-6 !border-slate-200 dark:!bg-slate-900 dark:!border-slate-800">
          {renderBody(true)}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ────────── Load Disaggregation (site-level) ────────── */

type LdaStatus = "ok" | "watch" | "fault";

type LdaCategory = { name: string; colorKey: keyof typeof COLORS_LIGHT; peakKw: number; status: LdaStatus; flag?: string };

type LdaDiagnostic = { name: string; status: "fault" | "watch"; desc: string; trend: number[] };

type LdaRec = { text: string; value: string | null };

type LdaDataset = {
  capKw: number;
  peakTime: string;
  peakNote: string;
  demandCharge: string;
  captionUnits: string;
  categories: LdaCategory[];
  /** Hourly multipliers 0–1 for each category, length 9 (12A…12A) */
  profileShape: number[][];
  diagnostics: LdaDiagnostic[];
  recs: LdaRec[];
};

const LDA_HOURS = ["12A", "3A", "6A", "9A", "12P", "3P", "6P", "9P", "12A"] as const;

/** Per-site load profiles — switching sites changes LDA numbers */
const LDA_BY_SITE: Record<string, LdaDataset> = {
  "site-melbourne-central": {
    capKw: 900,
    peakTime: "3:04 PM",
    peakNote: "Jul 22 · Chillers + EV overlap",
    demandCharge: "$14,220",
    captionUnits: "2 units",
    categories: [
      { name: "Chillers", colorKey: "amber", peakKw: 312, status: "watch", flag: "Watch · drifting 18% above baseline" },
      { name: "Compressors", colorKey: "blue", peakKw: 198, status: "fault", flag: "Fault · RTU-4 short-cycling" },
      { name: "Refrigeration", colorKey: "green", peakKw: 164, status: "ok" },
      { name: "EV fleet charging", colorKey: "purple", peakKw: 72, status: "ok" },
      { name: "Lighting", colorKey: "slate", peakKw: 58, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 38, status: "ok" },
    ],
    profileShape: [
      [0.06, 0.05, 0.19, 0.74, 1, 0.83, 0.26, 0.06, 0.06],
      [0.2, 0.18, 0.45, 0.93, 1, 0.81, 0.3, 0.2, 0.2],
      [0.91, 0.9, 0.93, 0.98, 1, 0.98, 0.93, 0.91, 0.91],
      [0.83, 0.69, 0.08, 0.28, 1, 1.25, 0.86, 0.83, 0.83],
      [0.17, 0.14, 0.52, 0.95, 1, 1, 0.26, 0.17, 0.17],
      [0.53, 0.47, 0.68, 0.95, 1, 0.89, 0.58, 0.53, 0.53],
    ],
    diagnostics: [
      { name: "Compressors — RTU-4", status: "fault", desc: "Short-cycling pattern since 6:12 AM — typically precedes compressor failure within 4–6 weeks.", trend: [40, 42, 58, 44, 72, 46, 90] },
      { name: "Chillers", status: "watch", desc: "Draw running 18% above baseline for its cooling duty, consistently over the past 6 days.", trend: [264, 271, 278, 285, 292, 301, 312] },
    ],
    recs: [
      { text: "Shift chiller pre-cooling earlier than 1:00 PM to stop overlap with EV fleet charging — ", value: "↓ ~110 kW off peak" },
      { text: "Enroll Refrigeration in the demand response program — load is stable enough to qualify — ", value: "+ ~$3,100/yr" },
      { text: "Schedule an inspection of the RTU-4 compressor before the short-cycling pattern causes failure", value: null },
    ],
  },
  "site-chadstone": {
    capKw: 1100,
    peakTime: "2:48 PM",
    peakNote: "Jul 22 · HVAC + retail lighting coincidence",
    demandCharge: "$21,840",
    captionUnits: "4 AHUs",
    categories: [
      { name: "HVAC / AHUs", colorKey: "amber", peakKw: 418, status: "fault", flag: "Fault · AHU-2 coil icing" },
      { name: "Retail lighting", colorKey: "blue", peakKw: 246, status: "watch", flag: "Watch · after-hours draw high" },
      { name: "Escalators / lifts", colorKey: "green", peakKw: 132, status: "ok" },
      { name: "Food court cooking", colorKey: "purple", peakKw: 98, status: "ok" },
      { name: "IT / back-of-house", colorKey: "slate", peakKw: 64, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 52, status: "ok" },
    ],
    profileShape: [
      [0.2, 0.15, 0.35, 0.7, 0.95, 1, 0.55, 0.25, 0.2],
      [0.1, 0.08, 0.4, 0.85, 1, 0.95, 0.7, 0.45, 0.15],
      [0.05, 0.05, 0.3, 0.9, 1, 1, 0.85, 0.4, 0.1],
      [0.0, 0.0, 0.2, 0.7, 1, 0.9, 0.6, 0.2, 0.0],
      [0.7, 0.65, 0.7, 0.85, 1, 0.95, 0.8, 0.75, 0.7],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "HVAC — AHU-2", status: "fault", desc: "Coil icing detected mid-day; AHU cycling inefficiently and adding ~60 kW to peak.", trend: [280, 310, 340, 360, 390, 405, 418] },
      { name: "Retail lighting", status: "watch", desc: "After-hours lighting remains at ~45% of daytime load across the past week.", trend: [180, 190, 200, 210, 220, 235, 246] },
    ],
    recs: [
      { text: "Isolate AHU-2 for service before the next heatwave — ", value: "↓ ~60 kW off peak" },
      { text: "Enable scheduled lighting setback after 9:00 PM centre-wide — ", value: "↓ ~$4,800/yr" },
      { text: "Review food-court diversity factor ahead of summer demand reset", value: null },
    ],
  },
  "site-parramatta": {
    capKw: 650,
    peakTime: "1:15 PM",
    peakNote: "Jul 21 · Midday retail peak",
    demandCharge: "$8,640",
    captionUnits: "1 plant",
    categories: [
      { name: "Packaged AC", colorKey: "amber", peakKw: 210, status: "ok" },
      { name: "Lighting", colorKey: "blue", peakKw: 148, status: "ok" },
      { name: "Refrigeration", colorKey: "green", peakKw: 96, status: "watch", flag: "Watch · case temp drift" },
      { name: "EV charging", colorKey: "purple", peakKw: 54, status: "ok" },
      { name: "IT / POS", colorKey: "slate", peakKw: 42, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 28, status: "ok" },
    ],
    profileShape: [
      [0.15, 0.12, 0.4, 0.8, 1, 0.85, 0.4, 0.15, 0.15],
      [0.1, 0.08, 0.45, 0.9, 1, 0.95, 0.55, 0.2, 0.1],
      [0.85, 0.85, 0.9, 0.95, 1, 0.98, 0.9, 0.85, 0.85],
      [0.2, 0.1, 0.05, 0.4, 0.8, 1, 0.7, 0.4, 0.2],
      [0.6, 0.55, 0.7, 0.95, 1, 0.95, 0.7, 0.6, 0.55],
      [0.4, 0.35, 0.55, 0.85, 1, 0.9, 0.5, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Refrigeration — Case bank B", status: "watch", desc: "Case temperatures drifting 1.4°C above setpoint; compressor duty rising through the afternoon.", trend: [78, 82, 85, 88, 90, 93, 96] },
    ],
    recs: [
      { text: "Service Case bank B door seals and check defrost timers — ", value: "↓ ~12 kW" },
      { text: "Stagger EV charger availability away from 12–2 PM retail peak — ", value: "↓ ~40 kW off peak" },
    ],
  },
  "site-penrith": {
    capKw: 720,
    peakTime: "4:22 PM",
    peakNote: "Jul 20 · Comms outage · estimated profile",
    demandCharge: "$11,100",
    captionUnits: "3 packs",
    categories: [
      { name: "Refrigeration packs", colorKey: "amber", peakKw: 268, status: "fault", flag: "Fault · Pack 3 high head pressure" },
      { name: "HVAC", colorKey: "blue", peakKw: 176, status: "watch", flag: "Watch · estimated intervals" },
      { name: "Lighting", colorKey: "green", peakKw: 88, status: "ok" },
      { name: "Bakery / ovens", colorKey: "purple", peakKw: 62, status: "ok" },
      { name: "IT / POS", colorKey: "slate", peakKw: 36, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 30, status: "ok" },
    ],
    profileShape: [
      [0.7, 0.65, 0.75, 0.9, 0.95, 1, 0.85, 0.75, 0.7],
      [0.2, 0.15, 0.35, 0.7, 0.9, 1, 0.7, 0.3, 0.2],
      [0.15, 0.1, 0.4, 0.85, 1, 0.95, 0.6, 0.25, 0.15],
      [0.0, 0.0, 0.5, 0.9, 1, 0.7, 0.3, 0.0, 0.0],
      [0.55, 0.5, 0.65, 0.9, 1, 0.95, 0.7, 0.55, 0.5],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Refrigeration — Pack 3", status: "fault", desc: "Head pressure elevated since meter comms failure; running near trip threshold.", trend: [200, 215, 230, 240, 250, 260, 268] },
      { name: "HVAC", status: "watch", desc: "Interval data estimated for 6 hours — confidence in afternoon peak attribution is reduced.", trend: [140, 145, 150, 155, 162, 170, 176] },
    ],
    recs: [
      { text: "Restore meter communications before validating demand charges this cycle", value: null },
      { text: "Inspect Pack 3 condenser and clean filters — ", value: "↓ ~35 kW risk" },
      { text: "Hold demand reset review until actual interval data returns", value: null },
    ],
  },
  "site-geelong-west": {
    capKw: 480,
    peakTime: "12:40 PM",
    peakNote: "Jul 22 · Clean midday peak",
    demandCharge: "$4,920",
    captionUnits: "1 plant",
    categories: [
      { name: "Packaged AC", colorKey: "amber", peakKw: 156, status: "ok" },
      { name: "Lighting", colorKey: "blue", peakKw: 98, status: "ok" },
      { name: "Refrigeration", colorKey: "green", peakKw: 74, status: "ok" },
      { name: "IT / POS", colorKey: "purple", peakKw: 32, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 26, status: "ok" },
    ],
    profileShape: [
      [0.15, 0.1, 0.35, 0.75, 1, 0.8, 0.35, 0.15, 0.15],
      [0.1, 0.08, 0.4, 0.85, 1, 0.9, 0.5, 0.2, 0.1],
      [0.85, 0.85, 0.9, 0.95, 1, 0.95, 0.9, 0.85, 0.85],
      [0.55, 0.5, 0.65, 0.9, 1, 0.95, 0.7, 0.55, 0.5],
      [0.4, 0.35, 0.5, 0.8, 1, 0.85, 0.5, 0.4, 0.4],
    ],
    diagnostics: [],
    recs: [
      { text: "Site is within 80% of contracted demand — no immediate action required", value: null },
      { text: "Consider voluntary DR enrolment for packaged AC — ", value: "+ ~$1,400/yr" },
    ],
  },
  "site-newcastle": {
    capKw: 540,
    peakTime: "5:10 PM",
    peakNote: "Jul 19 · Evening lighting + AC overlap",
    demandCharge: "$6,180",
    captionUnits: "2 packs",
    categories: [
      { name: "Packaged AC", colorKey: "amber", peakKw: 188, status: "watch", flag: "Watch · late-day duty high" },
      { name: "Lighting", colorKey: "blue", peakKw: 112, status: "ok" },
      { name: "Refrigeration", colorKey: "green", peakKw: 82, status: "ok" },
      { name: "EV charging", colorKey: "purple", peakKw: 48, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 34, status: "ok" },
    ],
    profileShape: [
      [0.2, 0.15, 0.3, 0.6, 0.85, 1, 0.9, 0.5, 0.25],
      [0.1, 0.08, 0.35, 0.7, 0.9, 1, 0.95, 0.6, 0.2],
      [0.85, 0.85, 0.9, 0.95, 1, 0.98, 0.95, 0.9, 0.85],
      [0.3, 0.2, 0.1, 0.2, 0.5, 0.8, 1, 0.7, 0.4],
      [0.4, 0.35, 0.5, 0.75, 0.9, 1, 0.85, 0.55, 0.4],
    ],
    diagnostics: [
      { name: "Packaged AC", status: "watch", desc: "Late-afternoon duty cycle elevated vs regional peers — likely thermostat setpoint drift.", trend: [150, 155, 160, 168, 175, 182, 188] },
    ],
    recs: [
      { text: "Audit thermostat setpoints and close-of-business schedules — ", value: "↓ ~25 kW" },
      { text: "Move EV charging preference earlier in the day to avoid 5 PM peak", value: null },
    ],
  },
};

/** Customer-level profiles used when the hierarchy sites are shared across customers */
const LDA_BY_CUSTOMER: Record<string, LdaDataset> = {
  "battery-site": {
    capKw: 2500,
    peakTime: "11:20 AM",
    peakNote: "Jul 22 · Charge cycle ramp",
    demandCharge: "$0 (export-led)",
    captionUnits: "1 BESS",
    categories: [
      { name: "BESS charging", colorKey: "purple", peakKw: 1840, status: "watch", flag: "Watch · charge window vs network peak" },
      { name: "Inverters / PCS", colorKey: "blue", peakKw: 210, status: "ok" },
      { name: "HVAC (enclosure)", colorKey: "amber", peakKw: 86, status: "ok" },
      { name: "Auxiliary / controls", colorKey: "green", peakKw: 42, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 18, status: "ok" },
    ],
    profileShape: [
      [0.1, 0.05, 0.4, 0.9, 1, 0.6, 0.2, 0.1, 0.1],
      [0.4, 0.35, 0.6, 0.9, 1, 0.8, 0.5, 0.4, 0.4],
      [0.3, 0.25, 0.4, 0.7, 1, 0.9, 0.5, 0.3, 0.3],
      [0.5, 0.5, 0.6, 0.85, 1, 0.9, 0.7, 0.55, 0.5],
      [0.4, 0.35, 0.5, 0.8, 1, 0.85, 0.5, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "BESS charging window", status: "watch", desc: "Charge ramp overlaps local network peak window — may attract future export/import constraints.", trend: [1200, 1400, 1550, 1680, 1750, 1800, 1840] },
    ],
    recs: [
      { text: "Shift charge start 45 minutes earlier to clear the network peak window — ", value: "↓ constraint risk" },
      { text: "Confirm PCS auxiliary load in next settlement cycle", value: null },
    ],
  },
  "hospital-network": {
    capKw: 1600,
    peakTime: "10:05 AM",
    peakNote: "Jul 22 · Clinical + HVAC coincidence",
    demandCharge: "$28,400",
    captionUnits: "campus",
    categories: [
      { name: "HVAC / chillers", colorKey: "amber", peakKw: 520, status: "watch", flag: "Watch · chiller #2 staging" },
      { name: "Clinical equipment", colorKey: "blue", peakKw: 380, status: "ok" },
      { name: "Imaging (MRI / CT)", colorKey: "purple", peakKw: 240, status: "ok" },
      { name: "Lighting", colorKey: "green", peakKw: 160, status: "ok" },
      { name: "Kitchen / laundry", colorKey: "slate", peakKw: 110, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 70, status: "ok" },
    ],
    profileShape: [
      [0.4, 0.35, 0.55, 0.9, 1, 0.95, 0.7, 0.5, 0.4],
      [0.5, 0.45, 0.7, 1, 0.95, 0.9, 0.75, 0.55, 0.5],
      [0.2, 0.15, 0.4, 0.9, 1, 0.85, 0.5, 0.25, 0.2],
      [0.6, 0.55, 0.7, 0.9, 1, 0.95, 0.85, 0.7, 0.6],
      [0.3, 0.25, 0.5, 0.85, 1, 0.9, 0.6, 0.35, 0.3],
      [0.45, 0.4, 0.55, 0.8, 1, 0.9, 0.6, 0.45, 0.45],
    ],
    diagnostics: [
      { name: "Chiller #2", status: "watch", desc: "Staging earlier than design sequence; adding unnecessary baseload through mid-morning.", trend: [420, 440, 460, 480, 500, 510, 520] },
    ],
    recs: [
      { text: "Retune chiller staging sequence with facilities — ", value: "↓ ~40 kW" },
      { text: "Schedule non-urgent imaging outside 9–11 AM clinical peak", value: null },
    ],
  },
  "industrial-hub": {
    capKw: 3200,
    peakTime: "2:15 PM",
    peakNote: "Jul 22 · Process line A + compressors",
    demandCharge: "$46,800",
    captionUnits: "Line A",
    categories: [
      { name: "Process line A", colorKey: "amber", peakKw: 1120, status: "fault", flag: "Fault · motor drive trip risk" },
      { name: "Air compressors", colorKey: "blue", peakKw: 680, status: "watch", flag: "Watch · leak rate elevated" },
      { name: "Furnaces / ovens", colorKey: "purple", peakKw: 540, status: "ok" },
      { name: "HVAC", colorKey: "green", peakKw: 320, status: "ok" },
      { name: "Lighting", colorKey: "slate", peakKw: 180, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 120, status: "ok" },
    ],
    profileShape: [
      [0.3, 0.25, 0.5, 0.85, 0.95, 1, 0.7, 0.4, 0.3],
      [0.5, 0.45, 0.65, 0.9, 1, 0.95, 0.75, 0.55, 0.5],
      [0.6, 0.55, 0.7, 0.9, 1, 0.95, 0.8, 0.65, 0.6],
      [0.25, 0.2, 0.4, 0.75, 0.95, 1, 0.7, 0.35, 0.25],
      [0.4, 0.35, 0.6, 0.9, 1, 0.95, 0.7, 0.45, 0.4],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Process line A — Drive 4", status: "fault", desc: "VSD current spikes correlating with afternoon peak; maintenance overdue.", trend: [900, 950, 1000, 1040, 1080, 1100, 1120] },
      { name: "Air compressors", status: "watch", desc: "Compressed-air leak survey overdue; system running ~14% above baseline.", trend: [580, 600, 620, 640, 655, 670, 680] },
    ],
    recs: [
      { text: "Bring Drive 4 forward in the maintenance window this week", value: null },
      { text: "Commission compressed-air leak survey — ", value: "↓ ~90 kW" },
      { text: "Stagger furnace restart away from Line A peak — ", value: "↓ ~120 kW off peak" },
    ],
  },
  "solar-farm": {
    capKw: 4800,
    peakTime: "1:05 PM",
    peakNote: "Jul 22 · Inverter cluster B curtailment",
    demandCharge: "N/A (generator)",
    captionUnits: "Cluster B",
    categories: [
      { name: "Inverter cluster A", colorKey: "green", peakKw: 1680, status: "ok" },
      { name: "Inverter cluster B", colorKey: "amber", peakKw: 1420, status: "watch", flag: "Watch · curtailment events" },
      { name: "Tracker motors", colorKey: "blue", peakKw: 240, status: "ok" },
      { name: "Substation auxiliaries", colorKey: "purple", peakKw: 160, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 60, status: "ok" },
    ],
    profileShape: [
      [0.0, 0.0, 0.2, 0.7, 1, 0.95, 0.4, 0.05, 0.0],
      [0.0, 0.0, 0.15, 0.6, 0.9, 1, 0.45, 0.05, 0.0],
      [0.1, 0.05, 0.4, 0.9, 1, 0.95, 0.5, 0.15, 0.1],
      [0.5, 0.45, 0.6, 0.85, 1, 0.95, 0.7, 0.55, 0.5],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Inverter cluster B", status: "watch", desc: "Three curtailment events today between 12:40–1:20 PM — check export limit setpoint.", trend: [1100, 1200, 1280, 1350, 1380, 1400, 1420] },
    ],
    recs: [
      { text: "Validate export limit and SCADA curtailment logic with network operator", value: null },
      { text: "Inspect Cluster B DC string currents for mismatch", value: null },
    ],
  },
  "logistics-park": {
    capKw: 1400,
    peakTime: "6:35 AM",
    peakNote: "Jul 22 · Dock door + reefer coincidence",
    demandCharge: "$16,200",
    captionUnits: "Yard A",
    categories: [
      { name: "Reefer charging", colorKey: "amber", peakKw: 480, status: "watch", flag: "Watch · morning bunching" },
      { name: "HVAC / warehouse", colorKey: "blue", peakKw: 310, status: "ok" },
      { name: "Conveyors / material handling", colorKey: "green", peakKw: 220, status: "ok" },
      { name: "Lighting", colorKey: "purple", peakKw: 140, status: "ok" },
      { name: "EV / forklift charging", colorKey: "slate", peakKw: 95, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 55, status: "ok" },
    ],
    profileShape: [
      [0.3, 0.9, 1, 0.7, 0.5, 0.45, 0.4, 0.35, 0.3],
      [0.4, 0.5, 0.7, 0.9, 1, 0.95, 0.7, 0.5, 0.4],
      [0.2, 0.6, 1, 0.95, 0.8, 0.7, 0.4, 0.25, 0.2],
      [0.5, 0.7, 0.9, 0.85, 0.7, 0.6, 0.9, 1, 0.6],
      [0.4, 0.8, 1, 0.7, 0.4, 0.35, 0.5, 0.7, 0.45],
      [0.4, 0.5, 0.7, 0.9, 1, 0.85, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Reefer charging — Yard A", status: "watch", desc: "Most reefers plug in between 5:30–7:00 AM, stacking onto warehouse HVAC start.", trend: [300, 360, 420, 450, 470, 475, 480] },
    ],
    recs: [
      { text: "Stagger reefer charge windows across Yard A/B — ", value: "↓ ~90 kW off peak" },
      { text: "Delay warehouse HVAC start by 30 minutes on mild mornings", value: null },
    ],
  },
  "metro-retail": {
    capKw: 780,
    peakTime: "2:30 PM",
    peakNote: "Jul 22 · Store HVAC peak",
    demandCharge: "$9,860",
    captionUnits: "store avg",
    categories: [
      { name: "HVAC", colorKey: "amber", peakKw: 290, status: "watch", flag: "Watch · setpoint drift" },
      { name: "Lighting", colorKey: "blue", peakKw: 175, status: "ok" },
      { name: "Refrigeration", colorKey: "green", peakKw: 120, status: "ok" },
      { name: "EV charging", colorKey: "purple", peakKw: 68, status: "ok" },
      { name: "IT / POS", colorKey: "slate", peakKw: 48, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 35, status: "ok" },
    ],
    profileShape: [
      [0.2, 0.15, 0.4, 0.75, 0.95, 1, 0.6, 0.25, 0.2],
      [0.1, 0.08, 0.4, 0.85, 1, 0.95, 0.55, 0.2, 0.1],
      [0.85, 0.85, 0.9, 0.95, 1, 0.98, 0.9, 0.85, 0.85],
      [0.2, 0.1, 0.1, 0.4, 0.8, 1, 0.7, 0.4, 0.2],
      [0.55, 0.5, 0.7, 0.95, 1, 0.95, 0.7, 0.55, 0.5],
      [0.4, 0.35, 0.55, 0.85, 1, 0.9, 0.5, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "HVAC", status: "watch", desc: "Average store setpoint 1.2°C cooler than portfolio target during peak hours.", trend: [240, 250, 260, 270, 280, 285, 290] },
    ],
    recs: [
      { text: "Push portfolio HVAC setpoint policy to metro stores — ", value: "↓ ~35 kW avg" },
      { text: "Review EV charger diversity limits at high-traffic sites", value: null },
    ],
  },
  "gas-parent": {
    capKw: 420,
    peakTime: "7:40 AM",
    peakNote: "Jul 22 · Boiler bank morning ramp",
    demandCharge: "$3,180",
    captionUnits: "Boiler bank",
    categories: [
      { name: "Boilers / process heat", colorKey: "amber", peakKw: 210, status: "watch", flag: "Watch · boiler 2 cycling" },
      { name: "Compressors", colorKey: "blue", peakKw: 86, status: "ok" },
      { name: "HVAC", colorKey: "green", peakKw: 54, status: "ok" },
      { name: "Lighting", colorKey: "purple", peakKw: 32, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 22, status: "ok" },
    ],
    profileShape: [
      [0.4, 0.9, 1, 0.7, 0.5, 0.45, 0.4, 0.35, 0.4],
      [0.5, 0.55, 0.7, 0.9, 1, 0.9, 0.7, 0.55, 0.5],
      [0.3, 0.35, 0.5, 0.8, 1, 0.95, 0.6, 0.35, 0.3],
      [0.2, 0.25, 0.5, 0.8, 1, 0.9, 0.7, 0.4, 0.25],
      [0.4, 0.4, 0.55, 0.8, 1, 0.85, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Boiler 2", status: "watch", desc: "Short-cycling on morning ramp — efficiency loss and elevated electrical auxiliaries.", trend: [150, 170, 185, 195, 200, 205, 210] },
    ],
    recs: [
      { text: "Service Boiler 2 burner controls before winter peak — ", value: "↓ cycling losses" },
      { text: "Stagger boiler bank start across a 20-minute window", value: null },
    ],
  },
  "community-gas": {
    capKw: 280,
    peakTime: "6:50 AM",
    peakNote: "Jul 21 · Residential cluster morning peak",
    demandCharge: "$1,640",
    captionUnits: "cluster",
    categories: [
      { name: "Space heating", colorKey: "amber", peakKw: 142, status: "ok" },
      { name: "Hot water", colorKey: "blue", peakKw: 68, status: "ok" },
      { name: "Cooktops", colorKey: "green", peakKw: 34, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 18, status: "ok" },
    ],
    profileShape: [
      [0.3, 0.95, 1, 0.55, 0.35, 0.3, 0.4, 0.5, 0.35],
      [0.4, 0.9, 1, 0.6, 0.4, 0.35, 0.5, 0.7, 0.45],
      [0.2, 0.5, 0.8, 0.6, 0.4, 0.5, 0.9, 1, 0.4],
      [0.35, 0.45, 0.6, 0.7, 0.8, 0.9, 1, 0.85, 0.4],
    ],
    diagnostics: [],
    recs: [
      { text: "Promote off-peak hot water timers across the scheme — ", value: "↓ ~20 kW morning" },
      { text: "No equipment faults detected this cycle", value: null },
    ],
  },
  "btm-parent": {
    capKw: 380,
    peakTime: "1:50 PM",
    peakNote: "Jul 22 · Behind-the-meter solar dip + HVAC",
    demandCharge: "$5,420",
    captionUnits: "BTM site",
    categories: [
      { name: "HVAC", colorKey: "amber", peakKw: 148, status: "ok" },
      { name: "Process / production", colorKey: "blue", peakKw: 96, status: "watch", flag: "Watch · export limit binding" },
      { name: "Lighting", colorKey: "green", peakKw: 42, status: "ok" },
      { name: "EV charging", colorKey: "purple", peakKw: 36, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 24, status: "ok" },
    ],
    profileShape: [
      [0.25, 0.2, 0.4, 0.75, 0.9, 1, 0.6, 0.3, 0.25],
      [0.4, 0.35, 0.55, 0.85, 1, 0.95, 0.7, 0.45, 0.4],
      [0.15, 0.1, 0.4, 0.85, 1, 0.9, 0.5, 0.2, 0.15],
      [0.2, 0.15, 0.2, 0.5, 0.8, 1, 0.7, 0.4, 0.2],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Export limit", status: "watch", desc: "BTM export clipped at midday — onsite load not absorbing available solar.", trend: [60, 70, 80, 88, 92, 94, 96] },
    ],
    recs: [
      { text: "Shift flexible process load into the solar window — ", value: "↑ self-consumption" },
      { text: "Review EV charge policy to soak midday export", value: null },
    ],
  },
  "crp": {
    capKw: 960,
    peakTime: "3:18 PM",
    peakNote: "Jul 22 · Multi-site coincident peak",
    demandCharge: "$12,400",
    captionUnits: "portfolio peak",
    categories: [
      { name: "HVAC", colorKey: "amber", peakKw: 340, status: "watch", flag: "Watch · coincident peak" },
      { name: "Refrigeration", colorKey: "blue", peakKw: 220, status: "ok" },
      { name: "Lighting", colorKey: "green", peakKw: 150, status: "ok" },
      { name: "EV / fleet", colorKey: "purple", peakKw: 110, status: "ok" },
      { name: "IT / data", colorKey: "slate", peakKw: 80, status: "ok" },
      { name: "Other / plug load", colorKey: "slate", peakKw: 55, status: "ok" },
    ],
    profileShape: [
      [0.2, 0.15, 0.35, 0.7, 0.9, 1, 0.65, 0.3, 0.2],
      [0.7, 0.65, 0.75, 0.9, 1, 0.95, 0.8, 0.7, 0.7],
      [0.15, 0.1, 0.4, 0.85, 1, 0.95, 0.55, 0.2, 0.15],
      [0.25, 0.2, 0.15, 0.4, 0.75, 1, 0.8, 0.5, 0.3],
      [0.55, 0.5, 0.65, 0.9, 1, 0.95, 0.75, 0.55, 0.5],
      [0.4, 0.35, 0.5, 0.8, 1, 0.9, 0.55, 0.4, 0.4],
    ],
    diagnostics: [
      { name: "Portfolio HVAC", status: "watch", desc: "Coincident peak across 12 CRP sites within a 20-minute window — diversity factor eroded.", trend: [260, 280, 300, 315, 325, 335, 340] },
    ],
    recs: [
      { text: "Introduce staggered HVAC setback across CRP sites — ", value: "↓ ~80 kW coincident" },
      { text: "Prioritise DR enrolment for the top 5 peaking NMIs", value: null },
    ],
  },
};

const LDA_SITE_DEFAULT = "site-melbourne-central";

/** Customers that use the shared site hierarchy — LDA follows the selected site */
const LDA_SITE_DRIVEN_CUSTOMERS = new Set(["metro-retail", "crp"]);

function resolveLdaDataset(siteId: string, customerId: string): LdaDataset {
  // Industry / portfolio customers get their own equipment mix
  if (!LDA_SITE_DRIVEN_CUSTOMERS.has(customerId) && LDA_BY_CUSTOMER[customerId]) {
    return LDA_BY_CUSTOMER[customerId];
  }
  // Retail-style customers: data changes when a different site is selected
  return LDA_BY_SITE[siteId] ?? LDA_BY_SITE[LDA_SITE_DEFAULT];
}

function buildLdaProfile(dataset: LdaDataset): Array<Record<string, string | number>> {
  return LDA_HOURS.map((hour, i) => {
    const row: Record<string, string | number> = { hour };
    dataset.categories.forEach((cat, ci) => {
      const shape = dataset.profileShape[ci]?.[i] ?? 0.5;
      row[cat.name] = Math.round(cat.peakKw * Math.min(shape, 1.3));
    });
    return row;
  });
}

function LdaSparkline({ points, color }: { points: number[]; color: string }) {
  const w = 64;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - 4 - ((p - min) / range) * (h - 8);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoadDisaggregationPanel({ siteId, siteName, customerId }: { siteId: string; siteName: string; customerId: string }) {
  const colors = useColors();
  const chart = useChartTheme();
  const [expanded, setExpanded] = useState(false);

  const dataset = useMemo(() => resolveLdaDataset(siteId, customerId), [siteId, customerId]);
  const categories = dataset.categories;
  const peakTotal = categories.reduce((sum, c) => sum + c.peakKw, 0);
  const topCategory = [...categories].sort((a, b) => b.peakKw - a.peakKw)[0];
  const topPct = Math.round((topCategory.peakKw / peakTotal) * 100);
  const peakPctOfCap = Math.round((peakTotal / dataset.capKw) * 100);
  const loadProfile = useMemo(() => buildLdaProfile(dataset), [dataset]);

  const catColor = (key: keyof typeof COLORS_LIGHT) => colors[key];

  useEffect(() => {
    setExpanded(false);
  }, [siteId, customerId]);

  const headerActions = (inModal: boolean) => (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Download" className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
        <Icon name="download" size={18} />
      </button>
      <button
        type="button"
        onClick={() => setExpanded(!inModal)}
        aria-label={inModal ? "Exit full screen" : "Expand to full screen"}
        title={inModal ? "Exit full screen" : "Expand to full screen"}
        className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
      >
        <Icon name={inModal ? "close_fullscreen" : "open_in_full"} size={18} />
      </button>
    </div>
  );

  const renderDetail = (inModal: boolean) => (
    <div className={cn("mt-5 border-t border-slate-200 pt-5 dark:border-slate-800", inModal && "min-h-0 flex-1 overflow-y-auto pr-1")}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Peak demand", value: `${peakTotal.toLocaleString()}`, unit: "kW", note: `${peakPctOfCap}% of ${dataset.capKw.toLocaleString()} kW cap` },
          { label: "Demand charge exposure", value: dataset.demandCharge, unit: null, note: "set by one 15-min interval" },
          { label: "Peak recorded", value: dataset.peakTime, unit: null, note: dataset.peakNote },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
            <div className="text-xs text-slate-500">{stat.label}</div>
            <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
              {stat.value}
              {stat.unit ? <span className="ml-1 text-sm font-medium text-slate-500">{stat.unit}</span> : null}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Load profile — today, by equipment</h3>
        <div className={cn(inModal ? "h-56" : "h-44")}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={loadProfile} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, dataset.capKw]} tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chart.tooltipStyle} />
              {categories.map((c) => (
                <Area key={c.name} type="monotone" dataKey={c.name} stackId="load" stroke={catColor(c.colorKey)} fill={catColor(c.colorKey)} fillOpacity={0.85} strokeWidth={0} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Peak at <span className="font-semibold text-slate-900 dark:text-white">{dataset.peakTime}</span> — {dataset.peakNote}, pushing the site to {peakPctOfCap}% of its {dataset.capKw.toLocaleString()}&nbsp;kW cap.
        </p>
      </div>

      {dataset.diagnostics.length > 0 ? (
        <div className="mt-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">Flagged equipment</h3>
          <div className="flex flex-col gap-2.5">
            {dataset.diagnostics.map((d) => (
              <div
                key={d.name}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/50",
                  d.status === "fault" && "border-red-200 dark:border-red-500/30",
                  d.status === "watch" && "border-amber-200 dark:border-amber-500/30",
                )}
              >
                <LdaSparkline points={d.trend} color={d.status === "fault" ? colors.red : colors.amber} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">{d.name}</div>
                  <div className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-slate-400">{d.desc}</div>
                </div>
                <Pill tone={d.status === "fault" ? "Critical" : "Medium"}>{d.status === "fault" ? "Fault" : "Watch"}</Pill>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white dark:bg-emerald-500">
            <Icon name="priority_high" size={18} />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">Recommended actions</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">Prioritised opportunities for this site</p>
          </div>
        </div>
        <ul className="space-y-2.5">
          {dataset.recs.map((rec, i) => (
            <li key={i} className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm dark:border-emerald-500/20 dark:bg-slate-900/70">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                {rec.text}
                {rec.value ? (
                  <span className="mt-1 block w-fit rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                    {rec.value}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" className="mt-4 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
        Open full equipment report →
      </button>
    </div>
  );

  const renderBody = (inModal: boolean) => (
    <div className={cn(inModal && "flex min-h-0 flex-1 flex-col")}>
      <SectionHeader
        title="Load Disaggregation"
        sub={`Equipment-level breakdown of load driving today's peak demand · ${siteName}`}
        action={headerActions(inModal)}
      />

      <div className="mb-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{peakTotal.toLocaleString()} kW peak · {categories.length} equipment groups</span>
        <span>Peak at {dataset.peakTime}</span>
      </div>

      <div className={cn("flex items-center gap-4", inModal && "gap-6")}>
        <div className={cn("relative shrink-0", inModal ? "h-36 w-36" : "h-28 w-28")}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                dataKey="peakKw"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={inModal ? 42 : 32}
                outerRadius={inModal ? 58 : 46}
                paddingAngle={1}
                strokeWidth={0}
              >
                {categories.map((c) => (
                  <Cell key={c.name} fill={catColor(c.colorKey)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("font-semibold text-slate-900 dark:text-white", inModal ? "text-xl" : "text-lg")}>{topPct}%</span>
            <span className="max-w-[4.5rem] truncate text-center text-[10px] text-slate-500">{topCategory.name}</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          {categories.map((c) => (
            <div key={c.name} className="flex items-start justify-between gap-2 border-b border-slate-100 py-1.5 last:border-b-0 dark:border-slate-800/80">
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: catColor(c.colorKey) }} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</div>
                  {c.flag ? (
                    <div className={cn("mt-0.5 text-xs font-medium", c.status === "fault" ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300")}>
                      {c.flag}
                    </div>
                  ) : null}
                </div>
              </div>
              <span className="shrink-0 tabular-nums text-xs text-slate-500 dark:text-slate-400">{c.peakKw.toLocaleString()} kW</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        {topCategory.peakKw.toLocaleString()} of {peakTotal.toLocaleString()} kW peak driven by {topCategory.name} · {dataset.captionUnits}
      </p>

      {inModal ? renderDetail(true) : null}
    </div>
  );

  return (
    <>
      <Panel className="p-5">
        {renderBody(false)}
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-4 inline-flex w-full items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200 dark:hover:bg-emerald-500/15"
        >
          <span className="flex items-center gap-2">
            <Icon name="priority_high" size={18} />
            View recommended actions
          </span>
          <Icon name="arrow_forward" size={18} />
        </button>
      </Panel>
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="!flex !flex-col h-[92vh] w-[95vw] !max-w-[900px] overflow-hidden !bg-white p-6 !border-slate-200 dark:!bg-slate-900 dark:!border-slate-800">
          {renderBody(true)}
        </DialogContent>
      </Dialog>
    </>
  );
}

const billStatus = [
  { name: "Ready", value: 0, amount: "$0", color: COLORS.green },
  { name: "Pending", value: 0, amount: "$0", color: COLORS.amber },
  { name: "Blocked", value: 0, amount: "$0", color: COLORS.red },
  { name: "Billed", value: 100, amount: "$891K", color: COLORS.blue },
];

const EXCEPTION_HEATMAP_MAX = 133;

type ExceptionHeatmapRow = {
  severity: "High" | "Medium" | "Low";
  Billing?: number;
  Meter?: number;
  Market?: number;
  Payments?: number;
  Contract?: number;
  Other?: number;
};

const exceptionHeatmap: ExceptionHeatmapRow[] = [
  { severity: "High", Billing: 133, Market: 14, Contract: 57, Other: 18 },
  { severity: "Medium", Other: 4 },
  { severity: "Low" },
];

const paymentStatusLegend = [
  { color: "bg-emerald-500", label: "Paid On Time", amount: "$0" },
  { color: "bg-blue-500", label: "Paid Late", amount: "$0" },
  { color: "bg-amber-500", label: "1-30 Days Overdue", amount: "$0" },
  { color: "bg-red-500", label: "31+ Days Overdue", amount: "$75K" },
];

/* ────────── Nav data ────────── */

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: "dashboard", children: [{ id: "home-dashboard", label: "Dashboard" }] },
  { id: "sales", label: "Sales", icon: "trending_up", children: [{ id: "sales-discovery", label: "Discovery" }, { id: "sales-quotes", label: "Quotes" }] },
  { id: "customers", label: "Customers", icon: "group", children: [{ id: "customers-portfolio", label: "Portfolio" }, { id: "customers-accounts", label: "Accounts" }] },
  { id: "billing", label: "Billing", icon: "receipt", children: [{ id: "billing-dashboard", label: "Dashboard" }, { id: "billing-invoices", label: "Invoices" }] },
  { id: "payments", label: "Payments", icon: "payments", children: [{ id: "payments-dashboard", label: "Dashboard" }] },
  { id: "market", label: "Market", icon: "store", children: [{ id: "market-change-requests", label: "Change Requests" }] },
  { id: "reporting", label: "Reporting", icon: "insights", children: [{ id: "reporting-reports", label: "Reports" }] },
  { id: "onboarding", label: "Onboarding", icon: "person_add", children: [] },
  { id: "audit", label: "Audit", icon: "fact_check", children: [] },
  { id: "products", label: "Products", icon: "inventory_2", children: [] },
  { id: "settings", label: "Settings", icon: "settings", children: [] },
  { id: "file-upload", label: "File Upload", icon: "upload_file", children: [] },
];

/* ────────── Reusable bits ────────── */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-black/20", className)}>{children}</div>;
}

function Pill({ children, tone = "Low" }: { children: React.ReactNode; tone?: string }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", riskClasses[tone] || statusClasses[tone] || "bg-slate-100 text-slate-600 border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300")}>{children}</span>;
}

function StatusPill({ children }: { children: string }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", statusClasses[children] || "bg-slate-100 text-slate-600 border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300")}>{children}</span>;
}

interface KpiCardProps {
  icon: string;
  title: string;
  value: string | number;
  sub: string;
  tone?: "green" | "blue" | "amber" | "red" | "purple";
  compact?: boolean;
  showSparkline?: boolean;
  emphasizeValue?: boolean;
  onClick?: () => void;
}

function KpiCard({ icon, title, value, sub, tone = "green", compact = false, showSparkline = true, emphasizeValue = false, onClick }: KpiCardProps) {
  const colors = useColors();
  const color = {
    green: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/15 dark:border-emerald-400/20",
    blue: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/15 dark:border-blue-400/20",
    amber: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/15 dark:border-amber-400/20",
    red: "text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-500/15 dark:border-red-400/20",
    purple: "text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/15 dark:border-purple-400/20",
  }[tone];
  const valueColor = emphasizeValue
    ? tone === "red"
      ? "text-red-700 dark:text-red-300"
      : tone === "amber"
        ? "text-amber-700 dark:text-amber-300"
        : "text-slate-900 dark:text-white"
    : "text-slate-900 dark:text-white";
  const sparkColor = tone === "red" ? colors.red : tone === "blue" ? colors.blue : tone === "amber" ? colors.amber : tone === "purple" ? colors.purple : colors.green;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-xl border border-slate-200 bg-white text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900/80 dark:shadow-black/20",
        compact ? "px-3.5 py-3 hover:border-slate-300 dark:hover:border-slate-700" : "rounded-2xl p-4 hover:-translate-y-0.5 hover:border-emerald-500/60 dark:hover:border-emerald-400/50",
      )}
    >
      {compact ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-xs leading-none text-slate-500 dark:text-slate-400">{title}</div>
            <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border", color)}>
              <Icon name={icon} size={14} />
            </div>
          </div>
          <div className={cn("mt-1 text-2xl font-semibold leading-none tracking-tight", valueColor)}>{value}</div>
          {sub ? <div className="mt-1.5 truncate text-[11px] leading-none text-slate-500">{sub}</div> : <div className="mt-1.5 h-[11px]" />}
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <div className={cn("shrink-0 rounded-2xl border p-2", color)}>
              <Icon name={icon} size={20} />
            </div>
            {showSparkline ? (
              <div className="h-7 w-20 opacity-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RLineChart data={[{ v: 8 }, { v: 11 }, { v: 9 }, { v: 13 }, { v: 10 }, { v: 12 }, { v: 14 }, { v: 11 }, { v: 13 }]}>
                    <Line type="monotone" dataKey="v" dot={false} stroke={sparkColor} strokeWidth={2} />
                  </RLineChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">{title}</div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</div>
          {sub ? <div className="mt-1 text-xs text-slate-500">{sub}</div> : null}
        </>
      )}
    </button>
  );
}

function SelectLike({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  options?: string[];
  onChange?: (value: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (compact) {
    return (
      <div ref={rootRef} className="relative min-w-36">
        <span className="mb-1 block text-[11px] leading-none text-slate-500 dark:text-slate-400">{label}</span>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-left shadow-sm hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-600"
        >
          <span className="text-xs leading-tight text-slate-700 dark:text-slate-200">{value}</span>
          <Icon name="expand_more" size={14} className={cn("text-slate-500 transition", open && "rotate-180")} />
        </button>
        {open && options?.length ? (
          <div
            role="listbox"
            aria-label={label}
            className="absolute left-0 top-[calc(100%+6px)] z-40 min-w-[11.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            {options.map((option) => {
              const selected = option === value;
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange?.(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition",
                    selected
                      ? "bg-blue-600 text-white"
                      : "text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
                  )}
                >
                  {selected ? <Icon name="check" size={15} className="shrink-0 text-white" /> : <span className="w-[15px] shrink-0" />}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button className="flex min-w-40 items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-slate-600">
      <span>
        <span className="block text-[11px] text-slate-500">{label}</span>
        <span className="text-sm text-slate-700 dark:text-slate-200">{value}</span>
      </span>
      <Icon name="expand_more" size={16} className="text-slate-500" />
    </button>
  );
}

function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
        {sub && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function WidgetDownloadAction({ periodLabel }: { periodLabel?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
      {periodLabel ? <span>{periodLabel}</span> : null}
      <Icon name="download" size={16} />
    </div>
  );
}

const EXCEPTION_HEATMAP_COLUMNS = ["Billing", "Meter", "Market", "Payments", "Contract", "Other"] as const;

function getExceptionHeatmapCellStyle(severity: ExceptionHeatmapRow["severity"], value: number) {
  const ratio = value / EXCEPTION_HEATMAP_MAX;
  if (severity === "High") {
    const alpha = 0.14 + ratio * 0.72;
    return {
      backgroundColor: `rgba(239, 68, 68, ${alpha})`,
      color: ratio >= 0.55 ? "#ffffff" : "#991b1b",
    };
  }
  if (severity === "Medium") {
    const alpha = 0.16 + (value / 10) * 0.55;
    return {
      backgroundColor: `rgba(245, 158, 11, ${alpha})`,
      color: "#92400e",
    };
  }
  const alpha = 0.12 + ratio * 0.5;
  return {
    backgroundColor: `rgba(16, 185, 129, ${alpha})`,
    color: "#065f46",
  };
}

function ExceptionHeatmapCell({ severity, value }: { severity: ExceptionHeatmapRow["severity"]; value?: number }) {
  if (value == null || value === 0) {
    return <span className="text-slate-400">—</span>;
  }

  const style = getExceptionHeatmapCellStyle(severity, value);
  return (
    <span
      className="inline-flex min-w-[2rem] items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={style}
    >
      {value}
    </span>
  );
}

type ViewKey = "Portfolio Overview" | "Customer Hierarchy" | "Exception Workspace" | "Interactions";

function ViewSwitcher({ activeView, setActiveView, selected }: { activeView: ViewKey; setActiveView: (v: ViewKey) => void; selected: CustomerRecord }) {
  const items: Array<{ label: string; view: ViewKey; icon: string }> = [
    { label: "Portfolio", view: "Portfolio Overview", icon: "dashboard" },
    { label: "Exceptions", view: "Exception Workspace", icon: "warning" },
    { label: "Customer", view: "Customer Hierarchy", icon: "group" },
    { label: "Interactions", view: "Interactions", icon: "forum" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900/80">
      {items.map(({ label, view, icon }) => {
        const active = activeView === view;
        return (
          <button
            key={view}
            type="button"
            onClick={() => setActiveView(view)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition",
              active
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
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

/** Dark-mode chart tooltip fallback. Components that mount inside a hook context should prefer `useChartTheme().tooltipStyle`. */
const chartTooltipStyle: React.CSSProperties = { background: "#020617", border: "1px solid #334155", borderRadius: 12, color: "#e2e8f0" };

/* ────────── Portfolio Overview ────────── */

function PortfolioOverview({ setActiveView, openCustomer }: { setActiveView: (v: ViewKey) => void; openCustomer: (c: CustomerRecord) => void }) {
  const colors = useColors();
  const chart = useChartTheme();
  const [activeSitesPeriod, setActiveSitesPeriod] = useState<"Month" | "Quarter">("Month");

  const portfolioCards: KpiCardProps[] = [
    { title: "Active Customers", value: "50", sub: "Across portfolio", icon: "group", tone: "green", compact: true },
    { title: "Active Sites", value: "797", sub: "Across customer hierarchy", icon: "apartment", tone: "green", compact: true },
    { title: "Bills Ready", value: "—", sub: "", icon: "description", tone: "blue", compact: true },
    { title: "Blocked Bills", value: "0", sub: "$0.00 held from release", icon: "lock", tone: "red", compact: true },
    { title: "Unbilled Exposure", value: "$120K", sub: "Open this cycle", icon: "credit_card", tone: "purple", compact: true },
    { title: "Open Exceptions", value: "226", sub: "Across customer sites", icon: "warning", tone: "amber", compact: true },
  ];

  const billStatusLive = [
    { name: "Ready", value: 0, amount: "$0", color: colors.green },
    { name: "Pending", value: 0, amount: "$0", color: colors.amber },
    { name: "Blocked", value: 0, amount: "$0", color: colors.red },
    { name: "Billed", value: 100, amount: "$891K", color: colors.blue },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        <SelectLike label="Segment" value="All segment" />
        <SelectLike label="Period" value="Current month" />
        <button type="button" className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10">
          Reset filters <Icon name="refresh" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {portfolioCards.map((card) => (
          <KpiCard key={card.title} {...card} onClick={() => card.title.includes("Exception") && setActiveView("Exception Workspace")} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <AdoraDefenderPanel />

        <Panel className="p-5">
          <SectionHeader title="Invoice Issue Day" sub="Share of authorised invoices and $ issued by day of month" action={<Icon name="upload" size={16} className="text-slate-400" />} />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={invoiceIssueDay} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Bar yAxisId="left" dataKey="share" fill={colors.blue} radius={[4, 4, 0, 0]} barSize={28} />
                <Line yAxisId="right" type="monotone" dataKey="amount" stroke={colors.amber} strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader
            title="Active sites"
            action={
              <div className="flex gap-1 rounded-lg border border-slate-200 p-0.5 text-xs dark:border-slate-800">
                {(["Month", "Quarter"] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setActiveSitesPeriod(period)}
                    className={cn(
                      "rounded-md px-2.5 py-1 transition",
                      activeSitesPeriod === period
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            }
          />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeSitesTrend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis domain={[780, 800]} tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Bar dataKey="sites" fill={colors.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Bill Status Distribution" action={<Icon name="upload" size={16} className="text-slate-400" />} />
          <div className="mb-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {billStatusLive.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name}</span>
                </div>
                <span className="text-slate-500">{s.amount}</span>
              </div>
            ))}
          </div>
          <div className="flex h-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
            {billStatusLive.map((s) => (
              s.value > 0 ? (
                <div key={s.name} className="grid place-items-center text-xs font-semibold text-white" style={{ width: `${s.value}%`, backgroundColor: s.color }}>
                  {s.name}
                </div>
              ) : null
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
            <div>
              <div className="text-slate-500">Total Billed Value YTD</div>
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">$891K</div>
            </div>
            <div>
              <div className="text-slate-500">vs Prior Year</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">+1317.7%</div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Unbilled Exposure Trend" action={<WidgetDownloadAction />} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 10, right: 12, left: 4, bottom: 20 }}>
                <defs>
                  <linearGradient id="exposureLm2Demo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.green} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={colors.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} interval={1}>
                  <Label value="Month" position="insideBottom" offset={-12} style={{ fill: chart.axis, fontSize: 11 }} />
                </XAxis>
                <YAxis domain={[0, 200]} ticks={[0, 50, 100, 150, 200]} tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}K`}>
                  <Label value="Amount ($)" angle={-90} position="insideLeft" style={{ fill: chart.axis, fontSize: 11 }} offset={12} />
                </YAxis>
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Area type="monotone" dataKey="exposure" stroke={colors.green} strokeWidth={3} fill="url(#exposureLm2Demo)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Payment Status (Based on Billed $)" action={<WidgetDownloadAction periodLabel="Selected period" />} />
          <div className="flex h-12 items-center justify-center rounded-xl border border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10">
            <span className="text-sm font-semibold text-red-600 dark:text-red-300">100%</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {paymentStatusLegend.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-2 text-slate-700 dark:text-slate-300">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", row.color)} />
                  <span className="truncate">{row.label}</span>
                </div>
                <span className="whitespace-nowrap text-slate-500">{row.amount}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
            <div>
              <div className="text-slate-500">Total Billed</div>
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">$74,505.28</div>
            </div>
            <div>
              <div className="text-slate-500">Collection Efficiency (YTD)</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">67.3%</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader title="Exception Volume by Type" sub="Open exceptions by severity and area" action={<WidgetDownloadAction />} />
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs dark:border-slate-800">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                <tr>
                  <th className="p-2 text-left font-medium">Severity</th>
                  {EXCEPTION_HEATMAP_COLUMNS.map((h) => (
                    <th key={h} className="p-2 text-center font-medium">{h}</th>
                  ))}
                  <th className="p-2 text-center font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {exceptionHeatmap.map((row) => {
                  const total = EXCEPTION_HEATMAP_COLUMNS.reduce((sum, key) => sum + (row[key] ?? 0), 0);
                  return (
                    <tr key={row.severity} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="p-2 text-slate-700 dark:text-slate-300">{row.severity}</td>
                      {EXCEPTION_HEATMAP_COLUMNS.map((key) => (
                        <td key={key} className="p-2 text-center">
                          <ExceptionHeatmapCell severity={row.severity} value={row[key]} />
                        </td>
                      ))}
                      <td className="p-2 text-center text-sm font-semibold text-slate-900 dark:text-white">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            Rows: severity • Columns: exception area • Cell values: open exception count
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            {[
              { label: "High", stops: ["#fecaca", "#ef4444", "#991b1b"] },
              { label: "Medium", stops: ["#fef3c7", "#f59e0b", "#b45309"] },
              { label: "Low", stops: ["#d1fae5", "#10b981", "#047857"] },
            ].map((scale) => (
              <div key={scale.label} className="flex items-center gap-2">
                <span>{scale.label}</span>
                <div
                  className="h-2 w-16 rounded-full"
                  style={{ background: `linear-gradient(to right, ${scale.stops.join(", ")})` }}
                />
              </div>
            ))}
            <span>Lighter = fewer • Darker = more ({EXCEPTION_HEATMAP_MAX} max)</span>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader
            title="Exceptions Resolved"
            sub="Closed in the selected period — resolved automatically vs user"
            action={<WidgetDownloadAction />}
          />
          <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-950/40">
            <Icon name="check_circle" size={32} className="text-slate-300 dark:text-slate-600" />
            <p className="mt-3 text-sm text-slate-500">No exceptions resolved in the selected period.</p>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionHeader
          title="Customer Performance (Billed and Paid)"
          sub="Portfolio health based on expected bill value, billed value, paid value and payment performance."
          action={<button type="button" className="text-sm text-emerald-700 dark:text-emerald-300">View all ↗</button>}
        />
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {["Customer", "Segment", "Sites", "Expected Bill", "Billed $", "Avg Bill Day", "Paid $", "Bill Ready %", "% Billed", "% Paid", "Exceptions"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolioPerformance.map((row) => {
                const customer = customers.find((c) => c.name === row.customer);
                return (
                  <tr
                    key={row.customer}
                    onClick={() => customer && openCustomer(customer)}
                    className="cursor-pointer border-t border-slate-200 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-500/5"
                  >
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-emerald-700 dark:text-emerald-200">{row.customer}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.segment}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.sites}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{row.expectedBill}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.billed}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.avgBillDay}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.paid}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.billReadyPct}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.pctBilled}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.pctPaid}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.exceptions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>1–10 of 50 customers</span>
          <span>‹ 1 2 3 4 5 ›</span>
        </div>
      </Panel>
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

function CustomerDrilldown({ selected, initialSiteId }: { selected: CustomerRecord; initialSiteId?: string | null }) {
  const colors = useColors();
  const chart = useChartTheme();
  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({});
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ "node-corporate": true, "node-flagship": true, "node-metro": true });
  const [selectedEntity, setSelectedEntity] = useState<{ type: "site" | "node"; id: string; name: string }>(() => {
    const site = SITE_ROWS.find((row) => row.id === initialSiteId);
    if (site) return { type: "site", id: site.id, name: site.site };
    return { type: "site", id: "site-melbourne-central", name: "Melbourne Central" };
  });

  const customerContracts = contracts.filter((contract) => contract.customerId === selected.id);

  const siteById = useMemo(() => Object.fromEntries(SITE_ROWS.map((row) => [row.id, row])), []);
  const selectedSite = selectedEntity.type === "site" ? siteById[selectedEntity.id] || SITE_ROWS[0] : SITE_ROWS[0];
  const isSite = selectedEntity.type === "site";
  const displaySiteName = selected.sites === 1 ? selected.name : selectedSite.site;

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
      <div key={node.id} className={level > 0 ? "ml-5 border-l border-slate-200 pl-4 dark:border-slate-700/80" : ""}>
        <div className={cn("mb-2 flex items-center gap-2 rounded-lg px-2 py-2 transition", isSelected ? "bg-emerald-50 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:ring-emerald-400/40" : "hover:bg-slate-100 dark:hover:bg-slate-800")}>
          <button type="button" onClick={() => toggleNode(node.id)} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            <Icon name={isOpen ? "expand_more" : "chevron_right"} size={15} />
          </button>
          <button type="button" onClick={() => selectNode(node)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <Icon name="apartment" size={15} className="text-emerald-700 dark:text-emerald-300" />
            <span className="truncate font-medium text-slate-800 dark:text-slate-200">{node.name}</span>
            <span className="ml-auto rounded bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800">{node.count}</span>
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
                      siteSelected
                        ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/40"
                        : "text-slate-600 hover:bg-slate-100 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-emerald-200",
                    )}
                  >
                    <span>{site.site}</span>
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-600">{site.nmi}</span>
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
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>{["", "Contract", "Start Date", "End Date", "Products", "Sites"].map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {customerContracts.map((contract) => {
              const expanded = expandedContracts[contract.id];
              return (
                <React.Fragment key={contract.id}>
                  <tr className="border-t border-slate-200 hover:bg-slate-100/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3">
                      <button type="button" onClick={() => toggleContract(contract.id)} className="rounded-md border border-slate-300 p-1 text-slate-600 hover:border-emerald-400/60 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300">
                        <Icon name={expanded ? "expand_more" : "chevron_right"} size={14} />
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{contract.name}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{contract.startDate}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{contract.endDate}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{contract.products}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{contract.sites.toLocaleString()} associated sites</td>
                  </tr>
                  {expanded && (
                    <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40">
                      <td colSpan={6} className="px-4 py-5">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Swap Amount</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{contract.swapAmount}</div>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Associated Sites</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{contract.sites.toLocaleString()} total sites covered</div>
                          </div>
                          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Contract Terms</div>
                            <div className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{contract.terms}</div>
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
        <KpiCard compact showSparkline={false} icon="apartment" title="Sites" value={selected.sites.toLocaleString()} sub="Across customer hierarchy" tone="green" />
        <KpiCard compact showSparkline={false} icon="bolt" title="Usage" value={selected.usage} sub="Current billing period" tone="green" />
        <KpiCard compact showSparkline={false} icon="description" title="Draft Invoices" value="0" sub="Pending release" tone="blue" />
        <KpiCard compact showSparkline={false} icon="credit_card" title="Unbilled Exposure" value={`$${selected.unbilled.toFixed(1)}m`} sub="Open this cycle" tone="purple" />
        <KpiCard compact showSparkline={false} emphasizeValue icon="warning" title="Open Exceptions" value={selected.exceptions} sub="Across customer sites" tone="amber" />
        <KpiCard compact showSparkline={false} icon="account_balance" title="Outstanding Debt" value={`$${selected.debt.toFixed(1)}m`} sub="Due or overdue" tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <Panel className="min-h-[660px] p-5 xl:col-span-4 xl:row-span-5">
          <SectionHeader title="Customer Hierarchy" sub="Select an account or site to view its details." />
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
            <Icon name="search" size={15} />
            <input placeholder="Search site, NMI, address or contract" className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedEntity({ type: "node", id: "node-retail-group", name: selected.name })}
            className={cn(
              "mb-4 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left font-semibold",
              selectedEntity.id === "node-retail-group"
                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/40"
                : "text-emerald-700 hover:bg-slate-100 dark:text-emerald-300 dark:hover:bg-slate-800",
            )}
          >
            <Icon name="account_tree" size={16} /> {selected.name}
            <span className="ml-auto rounded bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">{selected.sites.toLocaleString()} sites</span>
          </button>
          <div className="max-h-[720px] overflow-auto pr-1 text-sm">
            {selected.sites === 1 ? (
              <button
                type="button"
                onClick={() => selectSite(selectedSite.id)}
                className="ml-4 flex w-[calc(100%-1rem)] items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2 text-left text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/40"
              >
                <Icon name="account_balance" size={14} className="shrink-0" />
                <span className="truncate">{displaySiteName}</span>
                <span className="ml-auto text-[10px] text-slate-500">{selectedSite.account}</span>
              </button>
            ) : (
              HIERARCHY.map((node) => renderNode(node))
            )}
          </div>
        </Panel>

        {isSite ? (
          <div className="space-y-4 xl:col-span-8">
            <Panel className="p-5">
              <SectionHeader
                title={`Site Details: ${displaySiteName}`}
                action={
                  <div className="flex flex-wrap gap-2">
                    {selectedSite.creditTags.map((tag) => (
                      <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>
                    ))}
                  </div>
                }
              />
              <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
                  {selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="text-base font-semibold text-slate-900 dark:text-white">{selectedSite.account}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{selected.name}</div>
                  <div className="text-xs text-slate-500">{selected.segment}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-6 gap-y-4 border-b border-slate-200 py-4 sm:grid-cols-6 dark:border-slate-800">
                {[
                  ["Sites", "1"],
                  ["Usage", selected.usage],
                  ["Billed", "$0.00"],
                  ["Unbilled", selectedSite.unbilled],
                  ["Overdue", selectedSite.overdue],
                  ["Balance", selectedSite.pendingInterest],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{value}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 pt-4 text-xs md:grid-cols-3">
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Account details</div>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <div className="flex items-start gap-2"><Icon name="badge" size={14} className="text-emerald-600" /><span>{selectedSite.account}</span></div>
                    <div className="flex items-start gap-2"><Icon name="pin_drop" size={14} className="text-emerald-600" /><span>{selectedSite.nmi}</span></div>
                    <div className="flex items-start gap-2"><Icon name="location_on" size={14} className="text-emerald-600" /><span>{selectedSite.address}</span></div>
                    <div className="flex items-start gap-2"><Icon name="bolt" size={14} className="text-emerald-600" /><span>{selected.segment}</span></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Primary contact</div>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <div className="flex items-start gap-2"><Icon name="person" size={14} className="text-emerald-600" /><span>{selected.manager}</span></div>
                    <div className="flex items-start gap-2"><Icon name="mail" size={14} className="text-emerald-600" /><span>{selected.manager.toLowerCase().replaceAll(" ", ".")}@energyco.example</span></div>
                    <div className="flex items-start gap-2"><Icon name="phone" size={14} className="text-emerald-600" /><span>+61 400 000 000</span></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Financial summary</div>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Account balance</span><span className="font-medium text-emerald-700 dark:text-emerald-300">$0.00</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Last payment</span><span className="font-medium text-slate-900 dark:text-white">$0.00</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Contract end</span><span className="font-medium text-slate-900 dark:text-white">—</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Annual consumption</span><span className="font-medium text-slate-900 dark:text-white">{selected.usage}</span></div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Panel className="p-4">
                <SectionHeader title="Invoices" action={<WidgetDownloadAction />} />
                <div className="grid grid-cols-2 gap-6">
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Unbilled exposure</div><div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedSite.unbilled}</div></div>
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Overdue</div><div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedSite.overdue}</div></div>
                </div>
              </Panel>

              <Panel className="p-4">
                <SectionHeader title="Meter Data" action={<WidgetDownloadAction />} />
                <p className={cn("text-sm font-medium", selectedSite.meterStatus === "Complete" ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>
                  {selectedSite.meterStatus === "Complete" ? "Complete — interval data available" : `Incomplete — ${selectedSite.meterStatus}`}
                </p>
                <p className="mt-2 text-xs text-slate-500">Checked for interval data on the latest processing date.</p>
              </Panel>

              <Panel className="p-4">
                <SectionHeader title="Usage trend" action={<span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Monthly</span>} />
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <RLineChart data={demandTrend}>
                      <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={chart.tooltipStyle} />
                      <Line type="monotone" dataKey="actual" stroke={colors.green} strokeWidth={2} dot={false} />
                    </RLineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel className="p-4">
                <SectionHeader title="Certificate Details" action={<WidgetDownloadAction />} />
                <p className="text-xs text-slate-500">
                  {selectedSite.cert || "No environmental certificate products for this site account."}
                </p>
              </Panel>

              <Panel className="min-h-28 p-4">
                <SectionHeader title="Contract Details" />
                <p className="text-xs text-slate-500">{selectedSite.contract || "No active contracts for this account."}</p>
              </Panel>

              <Panel className="min-h-28 p-4">
                <SectionHeader title="Exceptions" action={<WidgetDownloadAction />} />
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Open exceptions</div><div className="mt-1 text-sm font-semibold text-amber-700 dark:text-amber-300">{selectedSite.exceptions}</div></div>
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Breached SLA</div><div className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">0</div></div>
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Due this week</div><div className="mt-1 font-medium text-slate-900 dark:text-white">0</div></div>
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Due today</div><div className="mt-1 font-medium text-slate-900 dark:text-white">0</div></div>
                  <div><div className="text-[10px] uppercase tracking-wide text-slate-400">Billing due this month</div><div className="mt-1 font-medium text-slate-900 dark:text-white">0</div></div>
                </div>
              </Panel>
            </div>

            <LoadDisaggregationPanel siteId={selectedSite.id} siteName={displaySiteName} customerId={selected.id} />
          </div>
        ) : (
          <>
            <Panel className="p-5 xl:col-span-8">
              <SectionHeader title={`Node Summary: ${selectedNode.name}`} sub="Aggregated customer view for the selected hierarchy node." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Sites</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.sites.toLocaleString()}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">kWh</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.usage}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Billed $</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.billed}</div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Unbilled</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.unbilled}</div>
                </div>
              </div>
            </Panel>

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Contact Details" />
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedNode.contact}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedNode.role}</div>
                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
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
                    <YAxis dataKey="name" type="category" tick={{ fill: chart.axis, fontSize: 11 }} width={95} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chart.tooltipStyle} />
                    <Bar dataKey="sites" fill={colors.green} radius={[0, 8, 8, 0]} />
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
                      <span className="text-slate-700 dark:text-slate-300">{label}</span>
                      <span className="text-slate-900 dark:text-white">{value}</span>
                    </div>
                    <div className="h-2 rounded bg-slate-200 dark:bg-slate-800">
                      <div className="h-2 rounded bg-emerald-500 dark:bg-emerald-400" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-5 xl:col-span-4">
              <SectionHeader title="Payment Insights" />
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Insight</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{selectedNode.paymentInsight}</p>
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
  const colors = useColors();
  const chart = useChartTheme();
  const volumeTrend = [
    { month: "Aug", created: 620, resolved: 260 },
    { month: "Sep", created: 710, resolved: 330 },
    { month: "Oct", created: 520, resolved: 280 },
    { month: "Nov", created: 410, resolved: 230 },
    { month: "Dec", created: 360, resolved: 190 },
    { month: "Jan", created: 540, resolved: 250 },
    { month: "Feb", created: 470, resolved: 230 },
    { month: "Mar", created: 1480, resolved: 490 },
    { month: "Apr", created: 1960, resolved: 610 },
    { month: "May", created: 1510, resolved: 420 },
    { month: "Jun", created: 1120, resolved: 280 },
    { month: "Jul", created: 360, resolved: 190 },
  ];
  const openByArea = [
    { name: "Market", count: 1380 },
    { name: "Customer", count: 1210 },
    { name: "Billing", count: 890 },
    { name: "Meter Data", count: 360 },
    { name: "Other", count: 70 },
  ];
  const customersWithExceptions = [
    ["Retail Group Australia", "Electricity", 220, 202],
    ["Metro Retail Network", "Electricity", 219, 206],
    ["Industrial Hub Portfolio", "Electricity", 63, 63],
    ["Hospital Network", "Electricity", 53, 47],
    ["CRP", "Electricity", 49, 49],
    ["Logistics Park", "Electricity", 47, 44],
    ["BTM Parent Account 1", "Electricity", 44, 44],
    ["Solar Farm Collective", "Electricity", 41, 38],
    ["Community Gas Scheme", "Gas", 39, 39],
    ["Gas Parent Account", "Gas", 38, 38],
  ] as const;

  const segmentOptions = ["All segments", "Electricity", "Gas"];
  const periodOptions = ["Current month", "Previous month", "QTD", "YTD"];
  const [segment, setSegment] = useState(segmentOptions[0]);
  const [period, setPeriod] = useState(periodOptions[0]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-2">
        <SelectLike compact label="Segment" value={segment} options={segmentOptions} onChange={setSegment} />
        <SelectLike compact label="Period" value={period} options={periodOptions} onChange={setPeriod} />
        <button
          type="button"
          onClick={() => {
            setSegment(segmentOptions[0]);
            setPeriod(periodOptions[0]);
          }}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
        >
          <Icon name="refresh" size={14} /> Reset filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-6">
        <KpiCard compact showSparkline={false} emphasizeValue icon="warning" title="Open Exceptions" value="3,857" sub="Currently unresolved" tone="amber" />
        <KpiCard compact showSparkline={false} emphasizeValue icon="priority_high" title="High Severity" value="3,669" sub="Critical and high priority" tone="red" />
        <KpiCard compact showSparkline={false} icon="task_alt" title="Resolved" value="51" sub="Closed in current month" tone="green" />
        <KpiCard compact showSparkline={false} emphasizeValue icon="schedule" title="SLA Breached" value="1" sub="Open past SLA date" tone="red" />
        <KpiCard compact showSparkline={false} icon="hourglass_top" title="Avg Age Open" value="278.1d" sub="Days since created" tone="purple" />
        <KpiCard compact showSparkline={false} icon="autorenew" title="Auto-Resolved" value="98%" sub="Avg close rate in period" tone="green" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader title="Open by Sub-status" sub="Workflow state for unresolved exceptions" action={<WidgetDownloadAction />} />
          <div className="mt-8">
            <div className="flex h-11 overflow-hidden rounded-xl border border-blue-300 bg-blue-50 dark:border-blue-400/40 dark:bg-blue-500/10">
              <div className="flex items-center justify-end bg-blue-100 pr-3 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200" style={{ width: "99.9%" }}>
                99.9%
              </div>
              <div className="min-w-[3px] bg-amber-400" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-slate-500">Open</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">3,804</div>
              </div>
              <div>
                <div className="text-slate-500">In Progress</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">2</div>
              </div>
              <div>
                <div className="text-slate-500">Monitor</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">1</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Open by Severity" sub="Mapped from exception priority" action={<WidgetDownloadAction />} />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ severity: "High", count: 3669 }, { severity: "Medium", count: 188 }, { severity: "Low", count: 0 }]} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="severity" tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Bar dataKey="count" fill={colors.red} fillOpacity={0.2} stroke={colors.red} radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader title="Exception Volume Trend" sub="Created vs resolved — last 12 months" action={<WidgetDownloadAction />} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeTrend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="createdVolumeLm2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.amber} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={colors.amber} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedVolumeLm2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.green} stopOpacity={0.22} />
                    <stop offset="95%" stopColor={colors.green} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Area type="monotone" dataKey="created" stroke={colors.amber} strokeWidth={2} fill="url(#createdVolumeLm2)" />
                <Area type="monotone" dataKey="resolved" stroke={colors.green} strokeWidth={2} fill="url(#resolvedVolumeLm2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex justify-center gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" />Created</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Resolved</span>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Exceptions Resolved" sub="Closed in current month — automatically vs user" action={<WidgetDownloadAction />} />
          <div className="mt-8 flex h-11 overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50 dark:border-emerald-400/40 dark:bg-emerald-500/10">
            <div className="grid place-items-center bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" style={{ width: "98%" }}>98%</div>
            <div className="grid min-w-8 flex-1 place-items-center bg-blue-100 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">2%</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Resolved Automatically</div>
              <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">50</div>
              <div className="mt-1 text-xs text-slate-500">98.0% · fully automated</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />User</div>
              <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">1</div>
              <div className="mt-1 text-xs text-slate-500">2.0% · all user resolves</div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader title="Exception Volume by Type" sub="Open exceptions by severity and area" action={<WidgetDownloadAction />} />
          <div className="overflow-hidden rounded-xl border border-slate-200 text-xs dark:border-slate-800">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                <tr>
                  {["Severity", "Billing", "Meter", "Market", "Payments", "Contract", "Other", "Total"].map((heading) => (
                    <th key={heading} className="px-3 py-3 text-right font-medium first:text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["High", 319, 70, 1360, 0, 1203, 691, 3669],
                  ["Medium", 13, 0, 0, 0, 0, 175, 188],
                  ["Low", 0, 0, 0, 0, 0, 0, 0],
                ].map(([severity, ...values]) => (
                  <tr key={severity} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-3 py-3 font-medium text-slate-700 dark:text-slate-300">{severity}</td>
                    {values.map((value, index) => (
                      <td key={index} className="px-2 py-2 text-right">
                        <span className={cn(
                          "block rounded-md px-2 py-1 font-medium",
                          Number(value) === 0
                            ? "bg-slate-50 text-slate-400 dark:bg-slate-950/50"
                            : severity === "High"
                              ? "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
                        )}>
                          {Number(value) === 0 ? "—" : Number(value).toLocaleString()}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Heat intensity reflects exception volume</span>
            <span>Total open · 3,857</span>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Open by Area" sub="Operational category concentration" action={<WidgetDownloadAction />} />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={openByArea} layout="vertical" margin={{ top: 4, right: 20, left: 15, bottom: 10 }}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={85} tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Bar dataKey="count" fill={colors.blue} fillOpacity={0.2} stroke={colors.blue} radius={[0, 7, 7, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionHeader title="Top Resolvers" sub="Users and automation closing exceptions in current month" action={<WidgetDownloadAction />} />
        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {["Resolver", "Type", "Resolved"].map((heading) => <th key={heading} className="px-4 py-3 text-left font-medium">{heading}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">System / Automation</td>
                <td className="px-4 py-3 text-slate-500">Automation</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">50</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">priyanka.reddy@tally-group.com</td>
                <td className="px-4 py-3 text-slate-500">User</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-5">
        <SectionHeader title="Customers with Open Exceptions" sub="Concentration by customer account" action={<WidgetDownloadAction />} />
          <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                <tr>
                  {["Customer", "Segment", "Open", "High Severity"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customersWithExceptions.map(([customer, segment, open, high]) => (
                  <tr key={customer} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{customer}</td>
                    <td className="px-4 py-3 text-slate-500">{segment}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{open}</td>
                    <td className="px-4 py-3 font-medium text-red-700 dark:text-red-300">{high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Panel>
    </div>
  );
}

/* ────────── Dashboard header (within main pane) ────────── */

function DashboardHeader({ activeView, selected, setActiveView, setSelectedCustomer, compact, onOpenInsightSheet }: { activeView: ViewKey; selected: CustomerRecord; setActiveView: (v: ViewKey) => void; setSelectedCustomer: (c: CustomerRecord) => void; compact: boolean; onOpenInsightSheet?: () => void }) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const isCustomer = activeView === "Customer Hierarchy";
  const title = isCustomer
    ? selected.name
    : activeView === "Exception Workspace"
      ? "Exception Overview"
      : activeView;
  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()));

  const subtitle = isCustomer
    ? "Customer command centre for hierarchy, site, billing, usage and exceptions."
    : activeView === "Exception Workspace"
      ? "Unified queue for billing, market, metering and customer exceptions."
      : activeView === "Interactions"
        ? "Customer interaction history and communication log."
        : "Portfolio-level billing, payment and exception performance across all customers.";

  const customerPicker = (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowCustomerPicker((v) => !v)}
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white text-left transition hover:border-emerald-500/60 hover:bg-emerald-50/40 dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-emerald-400/40 dark:hover:bg-slate-900",
          compact ? "px-3 py-1.5" : "px-5 py-3",
        )}
      >
        <div>
          {!compact && <div className="text-[11px] uppercase tracking-wide text-slate-500">Customer</div>}
          <div className={cn("font-semibold tracking-tight text-slate-900 dark:text-white", compact ? "text-base" : "text-3xl")}>{selected.name}</div>
        </div>
        <Icon name="expand_more" size={compact ? 16 : 18} className={cn("text-slate-500 transition", !compact && "mt-1", showCustomerPicker && "rotate-180")} />
      </button>

      {showCustomerPicker && (
        <div className="absolute left-0 top-full z-50 mt-3 w-[520px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 dark:shadow-2xl dark:shadow-black/40">
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <Icon name="search" size={15} />
            <input
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
              placeholder="Search customer, segment or manager"
              className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100"
            />
          </div>
          <div className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
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
                  "flex w-full items-center gap-4 border-b border-slate-200 px-4 py-4 text-left transition last:border-b-0 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-500/5",
                  selected.id === customer.id && "bg-emerald-50/80 dark:bg-emerald-500/10",
                )}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {customer.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{customer.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{customer.segment}</span>
                    <span>•</span>
                    <span>{customer.industry}</span>
                    <span>•</span>
                    <span>{customer.sites.toLocaleString()} sites</span>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500 dark:text-slate-400">Bill Ready</div>
                  <div className={cn("mt-1 font-semibold", customer.billReady < 60 ? "text-red-700 dark:text-red-300" : customer.billReady < 80 ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300")}>
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

  const hasInsight = activeView !== "Exception Workspace";

  const actions = (
    <div className="flex items-center gap-2">
      {isCustomer && (
        <button
          type="button"
          onClick={() => setActiveView("Portfolio Overview")}
          className={cn(
            "flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600",
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
            "rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          Bulk Action <Icon name="expand_more" size={compact ? 12 : 14} className="ml-1 inline" />
        </button>
      ) : (
        <button
          type="button"
          className={cn(
            "flex items-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          <Icon name="download" size={compact ? 14 : 16} /> Export
        </button>
      )}
      {hasInsight && onOpenInsightSheet && (
        <button
          type="button"
          onClick={onOpenInsightSheet}
          aria-label="Open AI insight panel"
          className={cn(
            "flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20 xl:hidden",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          )}
        >
          <Icon name="auto_awesome" size={compact ? 14 : 16} /> Summary
        </button>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[padding] duration-200 dark:border-slate-800 dark:bg-slate-950/85",
        compact ? "px-7 py-2" : "px-7 py-5",
      )}
    >
      {compact ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            {isCustomer ? (
              customerPicker
            ) : (
              <h1 className="truncate text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
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
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
              )}
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
              {isCustomer && (
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  Portfolio Overview <span className="text-slate-400 dark:text-slate-600">›</span> {selected.name}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">{actions}</div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-500">
            <Icon name="refresh" size={13} /> Last updated: 8:32 AM AEST
            {isCustomer && <span className="ml-3 rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Auto refresh •</span>}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────── Right insight rail ────────── */

const PANEL_TABS = ["Adora", "Control Panel", "X-Sell"] as const;
type PanelTab = (typeof PANEL_TABS)[number];

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
    logo: null as string | null,
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
    logo: null as string | null,
    icon: "cell_tower",
    iconBg: "bg-sky-600",
    cost: "$149/mth",
    speed: "1000 Mbps",
    data: "Unlimited",
    description: "Ultra-fast fibre for power users and large households. Download, upload, and stream simultaneously without limits.",
    features: ["No contract", "14 day trial", "$0 Setup Fee", "Unlimited data"],
  },
];

const XSELL_CARD =
  "rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] dark:border-white/[0.12] dark:bg-white/[0.08] dark:shadow-none";

type InsightSummaryItem = {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
};

type InsightDetailItem = InsightSummaryItem & {
  detailTitle?: string;
  paragraphs: string[];
  bullets: string[];
  adoraResponse: string;
};

function InsightSummaryCard({ item, onClick }: { item: InsightSummaryItem; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-[0_1px_2px_rgba(16,24,40,0.06),0_1px_3px_rgba(16,24,40,0.1)] transition-shadow hover:shadow-[0_2px_6px_rgba(16,24,40,0.1)] dark:border-slate-800 dark:bg-slate-950/50 dark:shadow-none dark:hover:border-slate-700 dark:hover:bg-slate-900/70"
    >
      <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", item.iconBg)}>
        <Icon name={item.icon} size={17} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-white">{item.title}</div>
        <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">{item.subtitle}</p>
      </div>
      <Icon name="chevron_right" size={16} className="shrink-0 text-slate-300 dark:text-slate-600" />
    </button>
  );
}

function AskAdoraChat({ response }: { response: string }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "adora"; text: string }>>([]);

  const submitQuestion = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    setMessages((current) => [
      ...current,
      { role: "user", text: trimmed },
      { role: "adora", text: response },
    ]);
    setQuestion("");
  };

  return (
    <div>
      {messages.length > 0 ? (
        <div className="mb-3 space-y-2">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn("flex", message.role === "user" ? "justify-end" : "items-start gap-2")}
            >
              {message.role === "adora" ? (
                <Image src="/AdoraDot.svg" alt="" width={20} height={20} className="mt-0.5 h-5 w-5 shrink-0" />
              ) : null}
              <p
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                  message.role === "user"
                    ? "rounded-tr-sm bg-[#2C365D] text-white"
                    : "rounded-tl-sm bg-orange-50 text-slate-700 dark:bg-orange-500/10 dark:text-slate-300"
                )}
              >
                {message.text}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={submitQuestion}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shadow-sm transition focus-within:border-orange-400 focus-within:bg-white dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-orange-500"
      >
        <Image src="/AdoraDot.svg" alt="" width={22} height={22} className="h-5 w-5 shrink-0" />
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask Adora…"
          aria-label="Ask Adora a question"
          className="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
        <button
          type="submit"
          aria-label="Send question"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#FF6B00] text-white transition hover:bg-[#E85F00]"
        >
          <Icon name="send" size={15} />
        </button>
      </form>
    </div>
  );
}

function InsightDetail({ item, onBack }: { item: InsightDetailItem; onBack: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col px-1 py-1">
      <div className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-sm font-medium text-[#2C365D] transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
        >
          <Icon name="arrow_back" size={15} />
          Back to insights
        </button>

        <div className="mb-4 flex items-start gap-3">
          <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", item.iconBg)}>
            <Icon name={item.icon} size={17} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold leading-tight text-slate-900 dark:text-white">
              {item.detailTitle ?? item.title}
            </div>
            <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">{item.subtitle}</p>
          </div>
        </div>

        <div className="rounded-xl border border-orange-300 p-3 dark:border-orange-500/50">
          <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="my-3 border-t border-slate-900 dark:border-slate-500" />
          <div className="space-y-2">
            {item.bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-2 text-xs leading-snug text-slate-600 dark:text-slate-300">
                <Icon name="check_circle" size={14} className="mt-0.5 shrink-0 text-[#00BFA5]" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white/95 pt-3 dark:border-slate-800 dark:bg-slate-950/95">
        <AskAdoraChat response={item.adoraResponse} />
      </div>
    </div>
  );
}

function PortfolioInsightsPanel() {
  const [selectedInsight, setSelectedInsight] = useState<InsightDetailItem | null>(null);
  const portfolioInsights: InsightDetailItem[] = [
    {
      icon: "apartment",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
      title: "Commercial portfolio",
      subtitle: "High-value multi-site account",
      detailTitle: "Account profile",
      paragraphs: [
        "Thin Tran (TA000174) is a high-value commercial customer with a multi-site portfolio.",
        "Coordinated billing and consolidated reporting are likely priorities for this account tier.",
      ],
      bullets: [
        "Multi-site commercial portfolio",
        "Account tier: high-value commercial",
        "Engagement: account manager recommended",
      ],
      adoraResponse: "This account should receive coordinated portfolio-level engagement. I recommend assigning an account manager and reviewing consolidated billing and reporting preferences.",
    },
    {
      icon: "payments",
      iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      title: "Payment reliability",
      subtitle: "88th percentile · strong track record",
      paragraphs: [
        "Payment behaviour ranks in the 88th percentile compared with similar commercial accounts.",
        "Low late-payment risk supports favourable credit terms and reduces collections effort.",
      ],
      bullets: [
        "88th percentile payment reliability",
        "Low overdue exposure in selected period",
        "Suitable for proactive retention outreach",
      ],
      adoraResponse: "Payment risk is low. The strongest next step is proactive retention outreach rather than collections activity, with favourable terms considered during renewal.",
    },
    {
      icon: "trending_up",
      iconBg: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
      title: "Energy usage trend",
      subtitle: "+12.3% over 12 months",
      detailTitle: "Energy consumption trend",
      paragraphs: [
        "Energy consumption is trending upward by 12.3% over the past 12 months across linked sites.",
        "Rising usage may reflect portfolio growth, seasonal variation, or operational changes worth validating with the customer.",
      ],
      bullets: [
        "+12.3% YoY consumption increase",
        "Review site-level drivers before tariff conversations",
        "Align forecast with billing cycle expectations",
      ],
      adoraResponse: "Validate the increase at site level before discussing tariffs. The largest contributors should be checked against operating changes, seasonality and the current billing forecast.",
    },
    {
      icon: "bolt",
      iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
      title: "Electricity · EnergyCo",
      subtitle: "Business Large Plan · Connected",
      detailTitle: "Active electricity service",
      paragraphs: [
        "Electricity is supplied by EnergyCo on the Business Large Plan. All linked NMIs show a connected status.",
        "This is the primary revenue service for cross-sell conversations such as demand review, solar, and renewal.",
      ],
      bullets: [
        "Provider: EnergyCo",
        "Plan: Business Large Plan",
        "Status: Connected across portfolio sites",
      ],
      adoraResponse: "The electricity service is active across all linked sites. Demand review, solar assessment and contract renewal are the most relevant cross-sell conversations.",
    },
  ];

  const opportunities: InsightDetailItem[] = [
    {
      icon: "workspace_premium",
      iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300",
      title: "Tariff optimisation",
      subtitle: "Review alternate network tariffs for potential savings",
      detailTitle: "Tariff optimisation opportunity",
      paragraphs: [
        "Interval meter data and current network tariff charges suggest there may be alternate tariff structures better aligned to this site load profile.",
        "Modelling alternate tariffs against the same consumption profile can identify savings without changing usage patterns.",
      ],
      bullets: [
        "Review current network tariff structure",
        "Model alternate tariffs against interval data",
        "Recommended: initiate tariff optimisation assessment",
      ],
      adoraResponse: "I recommend initiating a tariff optimisation assessment using the latest interval data. Compare alternative network structures against the same load profile before presenting estimated savings.",
    },
    {
      icon: "description",
      iconBg: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
      title: "Contract renewal",
      subtitle: "Expires 30 Jun 2025",
      paragraphs: [
        "The primary supply contract expires on 30 Jun 2025.",
        "Early renewal discussions reduce churn risk and allow time to bundle demand-management or solar options into the next term.",
      ],
      bullets: [
        "Contract end: 30 Jun 2025",
        "Initiate renewal 90–120 days ahead",
        "Cross-sell demand and solar assessments at renewal",
      ],
      adoraResponse: "Start renewal outreach 90–120 days before expiry. Bundle the conversation with demand-management and solar assessments to improve retention and account value.",
    },
  ];

  if (selectedInsight) {
    return (
      <div className="h-full px-3.5 py-3.5">
        <InsightDetail item={selectedInsight} onBack={() => setSelectedInsight(null)} />
      </div>
    );
  }

  return (
    <div className="px-3.5 py-3.5">
      <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">Account Summary</h2>
      <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
        Auto-generated
      </span>

      <p className="mb-3 mt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Account Insights
      </p>
      <div className="space-y-2.5">
        {portfolioInsights.map((item) => (
          <InsightSummaryCard key={item.title} item={item} onClick={() => setSelectedInsight(item)} />
        ))}
      </div>

      <p className="mb-3 mt-5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Other Opportunities
      </p>
      <div className="space-y-2.5">
        {opportunities.map((item) => (
          <InsightSummaryCard key={item.title} item={item} onClick={() => setSelectedInsight(item)} />
        ))}
      </div>
    </div>
  );
}

function CustomerInsightPanel({ selected }: { selected: CustomerRecord }) {
  return (
    <div className="space-y-4 px-3.5 py-3.5">
      <Panel className="border-emerald-300 p-5 dark:border-emerald-500/30">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="auto_awesome" size={20} className="text-emerald-700 dark:text-emerald-300" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">AI Insight</h2>
          <span className="rounded bg-purple-100 px-2 py-0.5 text-xs text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">BETA</span>
        </div>
        <div className="text-base font-semibold text-slate-900 dark:text-white">{selected.name} needs focused billing attention</div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Unbilled exposure and open exceptions are concentrated in a small number of high-value sites. Prioritise meter data completeness, billing validation and collections follow-up.
        </p>
      </Panel>
    </div>
  );
}

function QuickActionsPanel() {
  return (
    <>
      <div className="flex gap-2 border-b border-slate-100/60 p-3.5 dark:border-white/[0.04]">
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
              "flex flex-1 items-center justify-center rounded-xl border px-1 py-2 transition-all hover:-translate-y-0.5",
              active
                ? "border-[#00D2A2]/40 bg-[#00D2A2]/10 text-[#008f6f] dark:border-[#00D2A2]/30 dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]"
                : "border-slate-200/60 bg-white/60 text-slate-500 hover:border-[#4EEECA]/30 hover:bg-[#4EEECA]/8 hover:text-[#298268] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:hover:border-[#4EEECA]/20 dark:hover:bg-[#4EEECA]/10 dark:hover:text-[#4EEECA]"
            )}
          >
            <Icon name={icon} size={17} />
          </button>
        ))}
      </div>

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

      <div className="flex-1 px-2 py-1.5">
        {TASK_CATEGORIES.map((tc) => (
          <button
            key={tc.name}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
          >
            <Icon name={tc.icon} size={17} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="flex-1 text-left text-[13px] font-medium text-slate-700 dark:text-slate-300">
              {tc.name}
            </span>
            <span
              className={cn(
                "min-w-[28px] rounded-full px-2 py-0.5 text-center font-mono text-[11.5px] font-medium",
                tc.count === null
                  ? "bg-slate-100/60 text-slate-400 dark:bg-white/[0.04] dark:text-slate-600"
                  : tc.hot
                    ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    : "bg-slate-100/60 text-slate-500 dark:bg-white/[0.06] dark:text-slate-400"
              )}
            >
              {tc.count ?? "—"}
            </span>
            <Icon name="chevron_right" size={15} className="shrink-0 text-slate-300 dark:text-slate-600" />
          </button>
        ))}
      </div>
    </>
  );
}

function CrossSellPanel({ xSellView, setXSellView }: { xSellView: string | null; setXSellView: (v: string | null) => void }) {
  if (xSellView === "broadband") {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex items-center gap-2 border-b border-slate-100/60 px-3.5 py-3 dark:border-white/[0.04]">
          <button
            type="button"
            onClick={() => setXSellView(null)}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
            aria-label="Back to X-Sell"
          >
            <Icon name="arrow_back" size={16} />
          </button>
          <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">
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
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", plan.iconBg)}>
                        <Icon name={plan.icon ?? "public"} size={16} />
                      </div>
                      <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">{plan.name}</span>
                    </>
                  )}
                </div>
                <div className="mb-2.5 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200/80 dark:border-white/[0.08]">
                  {([
                    ["Cost", plan.cost],
                    ["Speed", plan.speed],
                    ["Data", plan.data],
                  ] as const).map(([label, value]) => (
                    <div key={label} className="bg-slate-50 px-2 py-1.5 text-center dark:bg-white/[0.04]">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mb-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">{plan.description}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-1 text-[10px]">
                      <Icon name="check_circle" size={13} className="text-emerald-500" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{f}</span>
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
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active Services</p>
        <div className="space-y-2">
          {([
            { icon: "bolt" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Electricity", provider: "EnergyCo", plan: "HomeDeal Extra", status: "Connected" },
            { icon: "local_fire_department" as const, iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300", service: "Gas", provider: "Energy Co", plan: "Online saver plan 2024", status: "Connected" },
          ]).map((s) => (
            <button key={s.service} type="button" className={cn("flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]", XSELL_CARD)}>
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.service}</span>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{s.status}</span>
                </div>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{s.provider}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-500">{s.plan}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-slate-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Services available to this site</p>
        <div className="space-y-2">
          {([
            { icon: "wifi" as const, iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300", service: "Broadband", headline: "6 broadband plans available", sub: "Plans from $68/month", badge: null as string | null, action: "broadband" as string | null },
            { icon: "solar_power" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Solar", headline: "7 Exclusive Solar offers available", sub: "Offers starting at $4,500", badge: null, action: null },
            { icon: "battery_charging_full" as const, iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300", service: null as string | null, headline: "2026 Home battery subsidies available", sub: "Check eligibility", badge: "New", action: null },
          ]).map((s) => (
            <button key={s.headline} type="button" onClick={() => s.action && setXSellView(s.action)} className={cn("flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]", XSELL_CARD)}>
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {s.service && <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.service}</span>}
                  {s.badge && <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">{s.badge}</span>}
                </div>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{s.headline}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-500">{s.sub}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-slate-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">MIMO Services</p>
        <div className="space-y-2">
          {([
            { icon: "cleaning_services" as const, iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-500/25 dark:text-violet-300", service: "Cleaning", headline: "3 cleaning services available", sub: "Starting at $650" },
            { icon: "local_shipping" as const, iconBg: "bg-sky-100 text-sky-700 dark:bg-sky-500/25 dark:text-sky-300", service: "Removals", headline: "11 removal services available", sub: "From $1200" },
          ]).map((s) => (
            <button key={s.service} type="button" className={cn("flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04]", XSELL_CARD)}>
              <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
                <Icon name={s.icon} size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.service}</span>
                </div>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100">{s.headline}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-500">{s.sub}</p>
              </div>
              <Icon name="chevron_right" size={16} className="mt-2 shrink-0 text-slate-300 dark:text-slate-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsightContent({
  activeView,
  selected,
  onClose,
  showRailHeader = false,
}: {
  activeView: ViewKey;
  selected: CustomerRecord;
  onClose?: () => void;
  showRailHeader?: boolean;
}) {
  const isCustomer = activeView === "Customer Hierarchy";
  const [activePanelTab, setActivePanelTab] = useState<PanelTab>("Adora");
  const [xSellView, setXSellView] = useState<string | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-1 px-1 pb-2 pt-0">
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
                  ? "bg-slate-100 text-[#2C365D] dark:bg-white/[0.1] dark:text-[#00D2A2]"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-400"
              )}
            >
              {tab === "Adora" ? (
                <Image src="/AdoraTab.svg" alt="Adora" width={64} height={28} className="h-7 w-auto" />
              ) : (
                tab
              )}
            </button>
          ))}
        </div>
        {showRailHeader && onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Collapse panel"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/[0.06] dark:hover:text-slate-300"
          >
            <Icon name="right_panel_close" size={16} />
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {activePanelTab === "Adora" && (
          isCustomer ? <CustomerInsightPanel selected={selected} /> : <PortfolioInsightsPanel />
        )}
        {activePanelTab === "Control Panel" && <QuickActionsPanel />}
        {activePanelTab === "X-Sell" && (
          <CrossSellPanel xSellView={xSellView} setXSellView={setXSellView} />
        )}
      </div>
    </div>
  );
}

function RightInsightRail({
  activeView,
  selected,
  collapsed,
  onToggle,
}: {
  activeView: ViewKey;
  selected: CustomerRecord;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const isCustomer = activeView === "Customer Hierarchy";
  const isPortfolio = activeView === "Portfolio Overview";
  if (!isCustomer && !isPortfolio) return null;

  if (collapsed) {
    return (
      <aside className="hidden w-14 shrink-0 flex-col items-center border-l border-slate-200 bg-white/85 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 xl:flex">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand portfolio summary panel"
          title="Portfolio Summary"
          className="group relative flex h-10 w-10 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
        >
          <Icon name="auto_awesome" size={20} className="text-emerald-700 dark:text-emerald-300" />
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)] dark:bg-emerald-400 dark:shadow-[0_0_6px_rgba(52,211,153,0.8)]"
          />
        </button>
        <div className="mt-auto">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand AI insight panel"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-gray-100"
          >
            <Icon name="chevron_left" size={20} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-80 shrink-0 overflow-hidden border-l border-slate-200 bg-white/85 p-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 xl:flex xl:flex-col">
      <InsightContent
        activeView={activeView}
        selected={selected}
        onClose={onToggle}
        showRailHeader
      />
    </aside>
  );
}

/* ────────── Page wrapper with Glass chrome ────────── */

export default function GlassVisionLM2DemoPage() {
  return (
    <Suspense>
      <GlassVisionLM2DemoContent />
    </Suspense>
  );
}

function GlassVisionLM2DemoContent() {
  const searchParams = useSearchParams();
  const deepLinkSiteId = searchParams.get("site");
  const [activeView, setActiveView] = useState<ViewKey>(() =>
    searchParams.get("view") === "customer" ? "Customer Hierarchy" : "Portfolio Overview"
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord>(() => {
    const customerId = searchParams.get("customer");
    return customers.find((customer) => customer.id === customerId) ?? customers[0];
  });
  const [activeNavId, setActiveNavId] = useState("customers-portfolio");
  const [openParentId, setOpenParentId] = useState<string | null>("customers");
  const [isExpanded, setIsExpanded] = useState(searchParams.get("expanded") === "true");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [aiRailCollapsed, setAiRailCollapsed] = useState(false);
  const [aiSheetOpen, setAiSheetOpen] = useState(false);
  const headerSentinelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("glass-vision-ai-rail-collapsed");
      if (stored === "true") setAiRailCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("glass-vision-ai-rail-collapsed", aiRailCollapsed ? "true" : "false");
    } catch {}
  }, [aiRailCollapsed]);

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

  const openCustomer = (customer: CustomerRecord) => {
    setSelectedCustomer(customer);
    setActiveView("Customer Hierarchy");
  };

  const content = useMemo(() => {
    if (activeView === "Portfolio Overview") return <PortfolioOverview setActiveView={setActiveView} openCustomer={openCustomer} />;
    if (activeView === "Customer Hierarchy") {
      return <CustomerDrilldown selected={selectedCustomer} initialSiteId={deepLinkSiteId} />;
    }
    if (activeView === "Interactions") {
      return (
        <Panel className="p-8 text-center">
          <Icon name="forum" size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
          <h2 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Interactions</h2>
          <p className="mt-2 text-sm text-slate-500">Customer interaction history will appear here.</p>
        </Panel>
      );
    }
    return <ExceptionWorkspace />;
  }, [activeView, selectedCustomer, deepLinkSiteId]);

  const theme = useResolvedTheme();
  const isLight = theme === "light";

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ backgroundColor: DARKEST_NAVY }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ────── Glass header chrome ────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Image src="/EnergyCoLogo.png" alt="EnergyCo" width={620} height={120} className="h-8 w-auto" priority />
            </Link>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search data"
                className="h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2A2]/50"
                style={{ backgroundColor: DARK_NAVY }}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-md bg-pink-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">DEV</span>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-gray-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Add">
              <Icon name="add" size={22} />
            </button>
            <Avatar className="h-9 w-9 border-2 border-[#00D2A2]/30">
              <AvatarFallback className="text-xs font-medium text-white" style={{ backgroundColor: secondaryColors.turquoise.hex }}>BD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* ────── Left navigation ────── */}
          <aside className={cn("flex shrink-0 flex-col items-center min-h-0 transition-[width] duration-300", navCollapsed ? "w-16" : "w-64")} style={{ backgroundColor: DARKEST_NAVY }}>
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
                          parentActive
                            ? "bg-white/10 text-[#00D2A2]"
                            : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
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
                        parentActive || isOpen
                          ? "bg-white/10 text-[#00D2A2]"
                          : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
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
                                activeNavId === child.id
                                  ? "bg-white/10 text-[#00D2A2]"
                                  : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
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
                className="fixed z-[100] min-w-[180px] rounded-md border border-slate-200 bg-white py-2 shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                style={{ top: flyoutPos.top, left: flyoutPos.left }}
                onMouseEnter={cancelHideFlyout}
                onMouseLeave={hideFlyout}
              >
                <div className="px-4 pb-1 pt-1.5 text-sm font-normal text-slate-700 dark:text-gray-300">{parentItem.label}</div>
                <div className="relative ml-4 border-l border-slate-200 dark:border-gray-600">
                  {parentItem.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => { setActiveNavId(child.id); setOpenParentId(parentItem.id); hideFlyout(); }}
                      className={cn(
                        "flex w-full items-center py-2 pl-3 pr-4 text-left text-sm font-normal transition-colors",
                        activeNavId === child.id
                          ? "mx-2 rounded-lg bg-emerald-100 font-medium text-[#0F9C7A] dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]"
                          : "text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-100",
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
            className="flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem] text-slate-700 dark:text-slate-100"
            style={{
              background: isLight
                ? "radial-gradient(circle at top left, #EBEDF2 0, #F9F9FB 38%, #F9F9FB 100%)"
                : "radial-gradient(circle at top left, #123024 0, #020617 32%, #020617 100%)",
            }}
          >
            <div ref={scrollContainerRef} className="flex min-w-0 flex-1 flex-col overflow-y-auto">
              <div ref={headerSentinelRef} className="h-px shrink-0" aria-hidden />
              <DashboardHeader
                activeView={activeView}
                selected={selectedCustomer}
                setActiveView={setActiveView}
                setSelectedCustomer={setSelectedCustomer}
                compact={headerCompact}
                onOpenInsightSheet={() => setAiSheetOpen(true)}
              />
              <div className="p-7">{content}</div>
            </div>
            <RightInsightRail
              activeView={activeView}
              selected={selectedCustomer}
              collapsed={aiRailCollapsed}
              onToggle={() => setAiRailCollapsed((v) => !v)}
            />
          </main>
          <Sheet open={aiSheetOpen} onOpenChange={setAiSheetOpen}>
            <SheetContent
              side="right"
              className="!bg-white !border-slate-200 text-slate-900 w-full overflow-y-auto p-5 sm:!max-w-md dark:!bg-slate-950 dark:!border-slate-800 dark:text-slate-100"
            >
              <InsightContent
                activeView={activeView}
                selected={selectedCustomer}
                onClose={() => setAiSheetOpen(false)}
                showRailHeader
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
