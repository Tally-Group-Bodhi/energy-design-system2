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
import { Dialog, DialogContent } from "@/components/Dialog/Dialog";
import CompanionWidget, { CompanionCompactIcon } from "@/components/CompanionWidget/CompanionWidget";
import { cn } from "@/lib/utils";
import {
  adoraDefenderIssues,
  adoraDefenderSections,
  type AdoraDefenderDrillDown,
  type AdoraDefenderIssue,
  type AdoraDefenderSection,
} from "@/lib/mock-data/adora-defender-issues";

/* ────────── Theme tokens ────────── */

/* SUPA Energy brand tokens — from supaenergy-colours.html
 * green-600 #4FB748 = brand mark / fills (never body text)
 * green-800 #067152 = AA-safe text, links, CTAs
 * green-950 #033E2D = chrome / app bar
 * lime-300 #C0E095 = accent on deep-green chrome
 */
const ACCENT = "#4FB748";
const ACCENT_TEXT = "#067152";
const ACCENT_SOFT = "#99D595";
const ACCENT_ON_DARK = "#C0E095";

/** Soft card surface tokens — used by Panel / KpiCard / nested cards */
const CARD_SURFACE_VARS = {
  "--card-border": "1px solid #DFE3E5",
  "--shadow-card":
    "0 1px 2px rgba(62, 89, 101, 0.04), 0 2px 4px -1px rgba(62, 89, 101, 0.06)",
} as React.CSSProperties;

/** Deepest SUPA green — header & left nav chrome */
const DARKEST_NAVY = "#033E2D";
/** Slightly lighter chrome for search input */
const DARK_NAVY = "#0A4F3A";

const COLORS_DARK = {
  green: ACCENT,
  green2: ACCENT_ON_DARK,
  blue: "#60a5fa",
  amber: "#f59e0b",
  red: "#fb7185",
  purple: "#a78bfa",
  slate: "#6E808B",
};

const COLORS_LIGHT = {
  green: ACCENT_TEXT,
  green2: ACCENT_SOFT,
  blue: "#0F5C8C",
  amber: "#8A5300",
  red: "#B3261E",
  purple: "#7c3aed",
  slate: "#3E5965",
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
  Billing: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30",
  "Pending product": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30",
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
  { id: "techpark-gate-fy26", customerId: "techpark-campus", name: "TechPark Campus EN — Gate Supply FY26", startDate: "2025-07-01", endDate: "2026-06-30", products: "Electricity (gate) + LGC", terms: "Parent gate supply agreement for the embedded network, reconciled monthly against child account consumption.", swapAmount: "14 GWh hedged", sites: 186 },
  { id: "techpark-multi-fuel", customerId: "techpark-campus", name: "TechPark Campus EN — Multi-fuel Services", startDate: "2025-07-01", endDate: "2027-06-30", products: "HVAC + Water + EV Charging", terms: "Embedded network service schedule covering HVAC, water and EV charging billed per child account.", swapAmount: "n/a", sites: 186 },
  { id: "northwind-tenancy", customerId: "northwind-logistics", name: "Northwind Logistics — Suite B2 Tenancy", startDate: "2025-09-01", endDate: "2027-08-31", products: "Electricity + HVAC + Water + EV Charging + Telco/ISP", terms: "Tenancy agreement covering all fuel accounts for Suite B2, billed on a single monthly cycle.", swapAmount: "n/a", sites: 5 },
  { id: "docklands-gate-fy26", customerId: "docklands-hub", name: "Docklands Business Hub EN — Gate Supply FY26", startDate: "2025-07-01", endDate: "2026-06-30", products: "Electricity (gate)", terms: "Parent gate supply agreement with monthly gate versus child reconciliation.", swapAmount: "11 GWh hedged", sites: 210 },
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
  /** Child fuel accounts under the network / tenant */
  sites: number;
  usageMwh: number;
  usage: string;
  billReady: number;
  blockedRevenue: number;
  unbilled: number;
  exceptions: number;
  debt: number;
  regions: Region[];
  fuels: string[];
}

const customers: CustomerRecord[] = [
  { id: "techpark-campus", name: "TechPark Campus EN", segment: "Commercial EN", industry: "Business park", manager: "J. Patel", sites: 186, usageMwh: 12400, usage: "12.4 GWh", billReady: 94, blockedRevenue: 0.04, unbilled: 12.4, exceptions: 5, debt: 0, regions: [{ name: "VIC", sites: 186, share: 100, usage: 12.4 }], fuels: ["Electricity", "HVAC", "EV Charging", "Water"] },
  { id: "docklands-hub", name: "Docklands Business Hub EN", segment: "Commercial EN", industry: "Office precinct", manager: "S. Nguyen", sites: 210, usageMwh: 9800, usage: "9.8 GWh", billReady: 92, blockedRevenue: 0.02, unbilled: 8.1, exceptions: 3, debt: 0, regions: [{ name: "VIC", sites: 210, share: 100, usage: 9.8 }], fuels: ["Electricity", "HVAC", "Water"] },
  { id: "westside-industrial", name: "Westside Industrial Park EN", segment: "Commercial EN", industry: "Industrial park", manager: "A. Brooks", sites: 98, usageMwh: 14600, usage: "14.6 GWh", billReady: 86, blockedRevenue: 0.06, unbilled: 21.3, exceptions: 4, debt: 4.2, regions: [{ name: "NSW", sites: 98, share: 100, usage: 14.6 }], fuels: ["Electricity", "HVAC", "EV Charging", "Water", "Telco/ISP"] },
  { id: "southbank-offices", name: "Southbank Offices EN", segment: "Commercial EN", industry: "Office precinct", manager: "R. Singh", sites: 144, usageMwh: 7200, usage: "7.2 GWh", billReady: 97, blockedRevenue: 0, unbilled: 3.2, exceptions: 1, debt: 0, regions: [{ name: "VIC", sites: 144, share: 100, usage: 7.2 }], fuels: ["Electricity", "HVAC", "Water"] },
  { id: "portside-logistics", name: "Portside Logistics Hub EN", segment: "Commercial EN", industry: "Logistics estate", manager: "J. Patel", sites: 72, usageMwh: 6400, usage: "6.4 GWh", billReady: 82, blockedRevenue: 0.08, unbilled: 19.8, exceptions: 5, debt: 9.6, regions: [{ name: "QLD", sites: 72, share: 100, usage: 6.4 }], fuels: ["Electricity", "EV Charging", "Water"] },
  { id: "northwind-logistics", name: "Northwind Logistics Pty Ltd", segment: "Commercial EN", industry: "Tenant · TechPark Campus EN", manager: "J. Patel", sites: 5, usageMwh: 580, usage: "0.58 GWh", billReady: 100, blockedRevenue: 0, unbilled: 0, exceptions: 1, debt: 0, regions: [{ name: "VIC", sites: 5, share: 100, usage: 0.58 }], fuels: ["Electricity", "HVAC", "Water", "EV Charging", "Telco/ISP"] },
];

interface PortfolioPerformanceRow {
  customer: string;
  fuels: string[];
  sites: number;
  expectedBill: string;
  billed: string;
  avgBillDay: string;
  paid: string;
  billReadyPct: string;
  pctBilled: string;
  pctPaid: string;
  unbilled: string;
  exceptions: number;
}

const portfolioPerformance: PortfolioPerformanceRow[] = [
  { customer: "TechPark Campus EN", fuels: ["Electricity", "HVAC", "EV Charging", "Water"], sites: 186, expectedBill: "$253,480.00", billed: "$241,080.00", avgBillDay: "6", paid: "$231,440.00", billReadyPct: "94%", pctBilled: "95.1%", pctPaid: "96.0%", unbilled: "$12,400", exceptions: 5 },
  { customer: "Docklands Business Hub EN", fuels: ["Electricity", "HVAC", "Water"], sites: 210, expectedBill: "$164,530.00", billed: "$156,420.00", avgBillDay: "9", paid: "$143,910.00", billReadyPct: "92%", pctBilled: "95.1%", pctPaid: "92.0%", unbilled: "$8,110", exceptions: 3 },
  { customer: "Westside Industrial Park EN", fuels: ["Electricity", "HVAC", "EV Charging", "Water", "Telco/ISP"], sites: 98, expectedBill: "$140,250.00", billed: "$118,950.00", avgBillDay: "14", paid: "$105,860.00", billReadyPct: "86%", pctBilled: "84.8%", pctPaid: "89.0%", unbilled: "$21,300", exceptions: 4 },
  { customer: "Southbank Offices EN", fuels: ["Electricity", "HVAC", "Water"], sites: 144, expectedBill: "$100,880.00", billed: "$97,660.00", avgBillDay: "7", paid: "$94,730.00", billReadyPct: "97%", pctBilled: "96.8%", pctPaid: "97.0%", unbilled: "$3,220", exceptions: 1 },
  { customer: "Portside Logistics Hub EN", fuels: ["Electricity", "EV Charging", "Water"], sites: 72, expectedBill: "$104,010.00", billed: "$84,210.00", avgBillDay: "18", paid: "$71,580.00", billReadyPct: "82%", pctBilled: "81.0%", pctPaid: "85.0%", unbilled: "$19,800", exceptions: 5 },
  { customer: "Northwind Logistics Pty Ltd", fuels: ["Electricity", "HVAC", "Water", "EV Charging", "Telco/ISP"], sites: 5, expectedBill: "$5,860.00", billed: "$5,860.00", avgBillDay: "6", paid: "$5,860.00", billReadyPct: "100%", pctBilled: "100%", pctPaid: "100%", unbilled: "$0", exceptions: 1 },
];

const trend = [
  { month: "Sep 25", exposure: 96 },
  { month: "Oct 25", exposure: 102 },
  { month: "Nov 25", exposure: 108 },
  { month: "Dec 25", exposure: 116 },
  { month: "Jan 26", exposure: 128 },
  { month: "Feb 26", exposure: 154 },
  { month: "Mar 26", exposure: 186 },
  { month: "Apr 26", exposure: 148 },
  { month: "May 26", exposure: 92 },
  { month: "Jun 26", exposure: 44 },
  { month: "Jul 26", exposure: 0 },
];

const activeSitesTrend = [
  { month: "Aug '25", sites: 4520 },
  { month: "Sep '25", sites: 4548 },
  { month: "Oct '25", sites: 4586 },
  { month: "Nov '25", sites: 4610 },
  { month: "Dec '25", sites: 4642 },
  { month: "Jan '26", sites: 4664 },
  { month: "Feb '26", sites: 4698 },
  { month: "Mar '26", sites: 4726 },
  { month: "Apr '26", sites: 4750 },
  { month: "May '26", sites: 4772 },
  { month: "Jun '26", sites: 4788 },
  { month: "Jul '26", sites: 4802 },
];

const exceptionsResolvedTrend = [
  { month: "Oct 25", resolved: 24 },
  { month: "Nov 25", resolved: 31 },
  { month: "Dec 25", resolved: 27 },
  { month: "Jan 26", resolved: 38 },
  { month: "Feb 26", resolved: 34 },
  { month: "Mar 26", resolved: 41 },
];

const invoiceIssueDay = [
  { day: "1", share: 3, amount: 28 },
  { day: "6", share: 18, amount: 182 },
  { day: "11", share: 24, amount: 214 },
  { day: "15", share: 12, amount: 96 },
  { day: "20", share: 9, amount: 74 },
  { day: "25", share: 7, amount: 58 },
  { day: "28", share: 20, amount: 168 },
  { day: "30", share: 7, amount: 52 },
];

const ADORA_DEFENDER_TOTAL = 1842;

const adoraDefenderOutcomes = {
  pass: { value: 78, count: Math.round(ADORA_DEFENDER_TOTAL * 0.78) },
  fail: { value: 6, count: Math.round(ADORA_DEFENDER_TOTAL * 0.06) },
  warning: { value: 16, count: Math.round(ADORA_DEFENDER_TOTAL * 0.16) },
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
              "rounded-xl border-l-4 bg-white p-3.5 [border:var(--card-border)] [border-left-width:4px] dark:bg-slate-900/60",
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
                  ? "bg-[#067152] text-white dark:bg-emerald-500/20 dark:text-emerald-300"
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
            <button type="button" onClick={goToOutcomes} className="rounded font-medium text-[#067152] hover:underline dark:text-slate-300">Outcomes</button>
            <Icon name="chevron_right" size={14} className="text-slate-400" />
            {selectedSection ? (
              <button type="button" onClick={() => setActiveSection(null)} className="rounded font-medium text-[#067152] hover:underline dark:text-slate-300">{drillDown}</button>
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

          <div className="mt-4 rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/40">
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
                  "group rounded-xl bg-white p-4 text-left [border:var(--card-border)] transition hover:-translate-y-0.5 dark:bg-slate-900/70",
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
          <div key={stat.label} className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
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
                  "flex items-center gap-3 rounded-xl bg-slate-50 p-3 [border:var(--card-border)] dark:bg-slate-950/50",
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
            <li key={i} className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-3 dark:border-emerald-500/20 dark:bg-slate-900/70">
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
  { name: "Issued", value: 72, amount: "$806K", color: COLORS.green },
  { name: "Pending", value: 18, amount: "$198K", color: COLORS.amber },
  { name: "Held", value: 10, amount: "$116K", color: COLORS.red },
];

const EXCEPTION_HEATMAP_MAX = 2;

type ExceptionHeatmapRow = {
  severity: "High" | "Medium" | "Low";
  "Gate vs child"?: number;
  "Standing data"?: number;
  "Meter upload"?: number;
  "PoC transfer"?: number;
  "Child add/rem"?: number;
};

const exceptionHeatmap: ExceptionHeatmapRow[] = [
  { severity: "High", "Gate vs child": 2, "Standing data": 1, "Meter upload": 1 },
  { severity: "Medium", "Gate vs child": 2, "Standing data": 2, "Meter upload": 1, "PoC transfer": 2, "Child add/rem": 1 },
  { severity: "Low", "Gate vs child": 1, "Standing data": 1, "Meter upload": 2, "PoC transfer": 1, "Child add/rem": 1 },
];

const paymentStatusLegend = [
  { color: "bg-emerald-500", label: "Paid On Time", amount: "$724K" },
  { color: "bg-blue-500", label: "Paid Late", amount: "$82K" },
  { color: "bg-amber-500", label: "1-30 Days Overdue", amount: "$52K" },
  { color: "bg-red-500", label: "31+ Days Overdue", amount: "$26K" },
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

function Panel({
  children,
  className = "",
  elevated = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Subtle card elevation; set false to keep a card flat (border only) */
  elevated?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white [border:var(--card-border)] dark:bg-slate-900/70",
        elevated && "[box-shadow:var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
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
  sparklineData?: Array<{ label: string; value: number }>;
  sparklineValueFormatter?: (value: number) => string;
  emphasizeValue?: boolean;
  onClick?: () => void;
  /** Subtle card elevation; set false to keep a card flat (border only) */
  elevated?: boolean;
}

type KpiSparkShape = "rise" | "ease" | "volatile" | "decline";

function makeKpiSparkTrend(endValue: number, shape: KpiSparkShape, precision = 0) {
  const pointCount = 24;
  const startFactor =
    shape === "rise" ? 0.62 : shape === "ease" ? 1.28 : shape === "decline" ? 1.55 : 0.84;
  const waveAmp =
    shape === "volatile" ? 0.14 : shape === "rise" ? 0.07 : shape === "ease" ? 0.06 : 0.09;
  const waveFreq = shape === "volatile" ? 2.4 : shape === "decline" ? 1.5 : 1.8;
  const jitterSeed =
    shape === "rise" ? 1.7 : shape === "ease" ? 2.3 : shape === "decline" ? 3.1 : 4.2;
  const additiveAmp =
    endValue === 0
      ? shape === "decline"
        ? 2.4
        : 1.2
      : endValue < 8 && precision === 0
        ? Math.max(1.8, endValue * 0.9)
        : endValue * waveAmp;
  const base = endValue === 0 ? (shape === "decline" ? 6 : 1.5) : endValue;

  return Array.from({ length: pointCount }, (_, index) => {
    const date = new Date(2026, 6, 31);
    date.setDate(date.getDate() - (pointCount - 1 - index));
    const t = index / (pointCount - 1);
    const drift = startFactor + (1 - startFactor) * t;
    const wave = Math.sin(t * Math.PI * waveFreq + jitterSeed) * additiveAmp;
    const jitter = Math.sin(index * 1.37 + jitterSeed * 2.1) * (additiveAmp * 0.35);
    const raw =
      index === pointCount - 1
        ? endValue
        : endValue === 0
          ? Math.max(0, base * (1 - t) + wave + jitter)
          : base * drift + wave + jitter;
    return {
      label: date.toLocaleDateString("en-AU", { day: "numeric", month: "short" }),
      value: Number(Math.max(0, raw).toFixed(precision)),
    };
  });
}

function KpiCard({
  icon,
  title,
  value,
  sub,
  tone = "green",
  compact = false,
  showSparkline = true,
  sparklineData,
  sparklineValueFormatter,
  emphasizeValue = false,
  onClick,
  elevated = true,
}: KpiCardProps) {
  const colors = useColors();
  const chart = useChartTheme();
  const sparklineFillId = React.useId().replace(/:/g, "");
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
  const hasSparkline = compact && showSparkline && Boolean(sparklineData?.length);
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full rounded-xl bg-white text-left [border:var(--card-border)] transition dark:bg-slate-900/80",
        elevated && "[box-shadow:var(--shadow-card)]",
        hasSparkline ? "overflow-visible" : "overflow-hidden",
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
          {showSparkline && sparklineData?.length ? (
            <div
              className="-mx-3.5 -mb-3 mt-2 h-12 w-[calc(100%+1.75rem)] [&_.recharts-surface]:rounded-b-[11px]"
              aria-label={`${title} trend`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={sparklineFillId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={sparkColor} stopOpacity={0.28} />
                      <stop offset="95%" stopColor={sparkColor} stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <Tooltip
                    allowEscapeViewBox={{ x: false, y: true }}
                    offset={12}
                    wrapperStyle={{ zIndex: 60, pointerEvents: "none" }}
                    contentStyle={{
                      ...chart.tooltipStyle,
                      borderRadius: 8,
                      padding: "5px 8px",
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                    cursor={{ stroke: sparkColor, strokeDasharray: "3 3", strokeWidth: 1 }}
                    labelFormatter={(label) => String(label)}
                    formatter={(raw) => [
                      sparklineValueFormatter
                        ? sparklineValueFormatter(Number(raw))
                        : Number(raw).toLocaleString(),
                      title,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={sparkColor}
                    strokeWidth={1.75}
                    fill={`url(#${sparklineFillId})`}
                    activeDot={{ r: 3, fill: sparkColor, stroke: "#fff", strokeWidth: 1.5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : null}
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

function DetailsContextStrip({
  kind,
  title,
  accountId,
  subtitle,
  segment,
  initials,
  badges,
  metrics,
}: {
  kind: "site" | "account";
  title: string;
  accountId: string;
  subtitle: string;
  segment: string;
  initials: string;
  badges: React.ReactNode;
  metrics: Array<[string, string]>;
}) {
  return (
    <Panel className="xl:sticky xl:top-20 xl:z-20 border-emerald-200/70 bg-white/95 p-3.5 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-slate-900/95">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {kind === "site" ? "Fuel account details" : "Node details"}
          </div>
          <div className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">{title}</div>
        </div>
        <div className="flex flex-wrap gap-1.5">{badges}</div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-purple-100 text-xs font-semibold text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold tabular-nums text-slate-900 dark:text-white">{accountId}</div>
          <div className="truncate text-[11px] text-slate-500">
            {subtitle}<span className="mx-1.5 text-slate-300 dark:text-slate-600">·</span>{segment}
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-1 sm:gap-x-5">
          {metrics.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <div className="text-[9px] uppercase tracking-wide text-slate-400">{label}</div>
              <div className="mt-0.5 truncate text-xs font-semibold tabular-nums text-slate-900 dark:text-white">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
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

const EXCEPTION_HEATMAP_COLUMNS = ["Gate vs child", "Standing data", "Meter upload", "PoC transfer", "Child add/rem"] as const;

function getExceptionHeatmapCellStyle(severity: ExceptionHeatmapRow["severity"], value: number, isDark: boolean) {
  const ratio = value / EXCEPTION_HEATMAP_MAX;
  if (severity === "High") {
    const alpha = 0.14 + ratio * 0.72;
    return {
      backgroundColor: `rgba(239, 68, 68, ${alpha})`,
      color: isDark ? "#fee2e2" : ratio >= 0.55 ? "#ffffff" : "#991b1b",
    };
  }
  if (severity === "Medium") {
    const alpha = 0.16 + ratio * 0.55;
    return {
      backgroundColor: `rgba(245, 158, 11, ${alpha})`,
      color: isDark ? "#fef3c7" : "#92400e",
    };
  }
  const alpha = 0.12 + ratio * 0.5;
  return {
    backgroundColor: `rgba(16, 185, 129, ${alpha})`,
    color: isDark ? "#d1fae5" : "#065f46",
  };
}

function ExceptionHeatmapCell({ severity, value }: { severity: ExceptionHeatmapRow["severity"]; value?: number }) {
  const isDark = useResolvedTheme() === "dark";

  if (value == null || value === 0) {
    return <span className="text-slate-400">—</span>;
  }

  const style = getExceptionHeatmapCellStyle(severity, value, isDark);
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

function ViewSwitcher({
  activeView,
  setActiveView,
  onSelectCustomerView,
  compact = false,
}: {
  activeView: ViewKey;
  setActiveView: (v: ViewKey) => void;
  onSelectCustomerView?: () => void;
  compact?: boolean;
}) {
  const items: Array<{ label: string; view: ViewKey; count?: string; countTone?: "warning" | "neutral" }> = [
    { label: "Portfolio", view: "Portfolio Overview" },
    { label: "Exceptions", view: "Exception Workspace", count: "18", countTone: "warning" },
    { label: "Customers", view: "Customer Hierarchy", count: "1,240", countTone: "neutral" },
    { label: "Interactions", view: "Interactions", count: "9", countTone: "neutral" },
  ];
  return (
    <nav
      aria-label="Workspace views"
      className={cn(
        "flex min-w-0 items-center",
        compact && "border-b border-slate-200 dark:border-slate-700",
      )}
    >
      {items.map(({ label, view, count, countTone }) => {
        const active = activeView === view;
        return (
          <button
            key={view}
            type="button"
            aria-current={active ? "page" : undefined}
            onClick={() => {
              if (view === "Customer Hierarchy" && onSelectCustomerView) {
                onSelectCustomerView();
                return;
              }
              setActiveView(view);
            }}
            className={cn(
              "-mb-px flex shrink-0 items-center whitespace-nowrap border-b-2 transition-colors",
              compact
                ? "gap-1.5 px-4 py-2.5 text-sm"
                : "gap-[clamp(0.375rem,0.9cqi,0.625rem)] px-[clamp(0.375rem,1.8cqi,1.5rem)] pb-3 pt-1 text-[clamp(1.125rem,2.6cqi,1.875rem)] font-semibold tracking-tight first:pl-0",
              active
                ? "border-[#4FB748] font-semibold text-slate-900 dark:border-[#4FB748] dark:text-slate-100"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
            )}
          >
            {label}
            {!compact && count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold tracking-normal",
                  countTone === "warning"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
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
    { title: "Active Customers", value: "1,240", sub: "Tenants / parents", icon: "group", tone: "green", compact: true, sparklineData: makeKpiSparkTrend(1240, "rise"), sparklineValueFormatter: (value) => `${value.toLocaleString()} customers` },
    { title: "Active Sites", value: "4.8k", sub: "Child fuel accounts", icon: "apartment", tone: "green", compact: true, sparklineData: makeKpiSparkTrend(4800, "rise"), sparklineValueFormatter: (value) => `${value.toLocaleString()} accounts` },
    { title: "Bills Ready", value: "91%", sub: "Of current cycle", icon: "description", tone: "blue", compact: true, sparklineData: makeKpiSparkTrend(91, "rise"), sparklineValueFormatter: (value) => `${value.toLocaleString()}% ready` },
    { title: "Blocked Bills", value: "24", sub: "$64.5k held from release", icon: "lock", tone: "red", compact: true, sparklineData: makeKpiSparkTrend(24, "decline"), sparklineValueFormatter: (value) => `${value.toLocaleString()} blocked bills` },
    { title: "Unbilled Exposure", value: "$186K", sub: "Open this cycle", icon: "credit_card", tone: "purple", compact: true, sparklineData: makeKpiSparkTrend(186, "volatile"), sparklineValueFormatter: (value) => `$${value.toLocaleString()}K` },
    { title: "Open Exceptions", value: "18", sub: "Across EN child accounts", icon: "warning", tone: "amber", compact: true, emphasizeValue: true, sparklineData: makeKpiSparkTrend(18, "ease"), sparklineValueFormatter: (value) => `${value.toLocaleString()} exceptions` },
  ];

  const billStatusLive = [
    { name: "Issued", value: 72, amount: "$806K", color: colors.green },
    { name: "Pending", value: 18, amount: "$198K", color: colors.amber },
    { name: "Held", value: 10, amount: "$116K", color: colors.red },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <SelectLike compact label="Segment" value="Commercial EN" />
        <SelectLike compact label="Billing cycle" value="Current month" />
        <button type="button" className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10">
          Reset filters <Icon name="refresh" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {portfolioCards.map((card) => (
          <KpiCard key={card.title} {...card} onClick={() => card.title.includes("Exception") && setActiveView("Exception Workspace")} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                <YAxis domain={[4400, 4900]} tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
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
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">$1.12M</div>
            </div>
            <div>
              <div className="text-slate-500">vs Prior Year</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">+18.4%</div>
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
          <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
            {[
              { label: "Paid", value: 81, color: colors.green },
              { label: "Partial", value: 12, color: colors.blue },
              { label: "Overdue", value: 7, color: colors.red },
            ].map((row) => (
              <div
                key={row.label}
                className="grid place-items-center text-xs font-semibold text-white"
                style={{ width: `${row.value}%`, backgroundColor: row.color }}
              >
                {row.value}%
              </div>
            ))}
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
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">$884,180.00</div>
            </div>
            <div>
              <div className="text-slate-500">Collection Efficiency (YTD)</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">93.4%</div>
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
            Rows: severity • Columns: EN exception area • Cell values: open exception count
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
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={exceptionsResolvedTrend} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid stroke={chart.grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: chart.axis, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: chart.axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={chart.tooltipStyle} />
                <Bar dataKey="resolved" fill={colors.blue} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
            <div>
              <div className="text-slate-500">Resolved MTD</div>
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">41</div>
            </div>
            <div>
              <div className="text-slate-500">Avg Resolve Time</div>
              <div className="mt-1 text-xl font-semibold text-emerald-700 dark:text-emerald-300">1.8 days</div>
            </div>
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <SectionHeader
          title="Customer Performance (Billed and Paid)"
          sub="Network-level health based on expected bill value, billed value, paid value and payment performance."
          action={<button type="button" className="text-sm text-emerald-700 dark:text-emerald-300">View all ↗</button>}
        />
        <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
              <tr>
                {["Customer / network", "Fuels", "Active sites", "Expected Bill", "Billed $", "Avg Bill Day", "Paid $", "Bill Ready %", "% Billed", "% Paid", "Unbilled", "Open Exceptions"].map((h) => (
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
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.fuels.map((fuel) => (
                          <span
                            key={fuel}
                            className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-white/[0.06] dark:text-slate-300"
                          >
                            {fuel}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.sites}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700 dark:text-slate-300">{row.expectedBill}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.billed}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.avgBillDay}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.paid}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.billReadyPct}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.pctBilled}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.pctPaid}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.unbilled}</td>
                    <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.exceptions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>1–6 of 1,240 customers</span>
          <span>‹ 1 2 3 4 5 ›</span>
        </div>
      </Panel>
    </div>
  );
}

/* ────────── Customer Drilldown ────────── */

interface SiteRecord {
  id: string;
  /** Fuel of the EN child account (Electricity, HVAC, Water, EV Charging, Telco/ISP) */
  site: string;
  /** Suite / tenancy the child account sits under */
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
  billed: string;
  balance: string;
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
  { id: "acct-b2-e", site: "Electricity", group: "Suite B2", state: "Billing", address: "Suite B2, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "NAAVIGR901", account: "EN-TP-B2-E", contract: "EN C&I TOU", usage: "48,220 kWh", actualDemand: 126.4, contractDemand: 140, change: "↑ 6%", billing: "Ready", payment: "Current", billed: "$2,840", balance: "$2,100", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing", "Direct debit"], pendingInterest: "$0" },
  { id: "acct-b2-h", site: "HVAC", group: "Suite B2", state: "Billing", address: "Suite B2, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-B2-H", account: "EN-TP-B2-H", contract: "EN HVAC service charge", usage: "18,640 kWh", actualDemand: 42.8, contractDemand: 55, change: "↑ 3%", billing: "Ready", payment: "Current", billed: "$1,620", balance: "$1,420", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-b2-w", site: "Water", group: "Suite B2", state: "Billing", address: "Suite B2, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-B2-W", account: "EN-TP-B2-W", contract: "EN Water stepped", usage: "184 kL", actualDemand: 2.1, contractDemand: 3, change: "↓ 2%", billing: "Ready", payment: "Current", billed: "$410", balance: "$380", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-b2-ev", site: "EV Charging", group: "Suite B2", state: "Billing", address: "Suite B2, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-B2-EV", account: "EN-TP-B2-EV", contract: "EN EV per-kWh", usage: "6,180 kWh", actualDemand: 22.4, contractDemand: 30, change: "↑ 14%", billing: "Ready", payment: "Current", billed: "$690", balance: "$620", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-b2-t", site: "Telco/ISP", group: "Suite B2", state: "Pending product", address: "Suite B2, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-B2-T", account: "EN-TP-B2-T", contract: "EN Telco bundle", usage: "—", actualDemand: 0, contractDemand: 0, change: "—", billing: "Pending", payment: "Current", billed: "$300", balance: "$300", unbilled: "$0", overdue: "$0", exceptions: 1, lastInvoice: "06 Mar 2026", meterStatus: "Pending product set-up", cert: "No environmental certificate products for this account.", creditTags: ["Pending product"], pendingInterest: "$0" },
  { id: "acct-l3-e", site: "Electricity", group: "Suite L3", state: "Billing", address: "Suite L3, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "NAAVIGR914", account: "EN-TP-L3-E", contract: "EN C&I TOU", usage: "52,480 kWh", actualDemand: 138.2, contractDemand: 150, change: "↑ 8%", billing: "Ready", payment: "Current", billed: "$3,120", balance: "$3,120", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing", "Direct debit"], pendingInterest: "$0" },
  { id: "acct-l3-h", site: "HVAC", group: "Suite L3", state: "Billing", address: "Suite L3, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-L3-H", account: "EN-TP-L3-H", contract: "EN HVAC service charge", usage: "21,300 kWh", actualDemand: 48.6, contractDemand: 55, change: "↑ 5%", billing: "Ready", payment: "Current", billed: "$1,880", balance: "$1,880", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-l3-w", site: "Water", group: "Suite L3", state: "Billing", address: "Suite L3, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-L3-W", account: "EN-TP-L3-W", contract: "EN Water stepped", usage: "162 kL", actualDemand: 1.8, contractDemand: 3, change: "↓ 4%", billing: "Ready", payment: "Current", billed: "$360", balance: "$360", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Estimated read", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-l3-ev", site: "EV Charging", group: "Suite L3", state: "Billing", address: "Suite L3, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-L3-EV", account: "EN-TP-L3-EV", contract: "EN EV per-kWh", usage: "4,860 kWh", actualDemand: 18.2, contractDemand: 30, change: "↑ 9%", billing: "Ready", payment: "Current", billed: "$540", balance: "$540", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-gate-e", site: "Electricity (gate)", group: "Common area / house", state: "Billing", address: "Gate meter, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "NAAVIGR900", account: "EN-TP-CA-E", contract: "EN gate meter", usage: "412,600 kWh", actualDemand: 986.4, contractDemand: 1100, change: "↑ 4%", billing: "Blocked", payment: "Current", billed: "$18,400", balance: "$18,400", unbilled: "$12,400", overdue: "$0", exceptions: 3, lastInvoice: "06 Mar 2026", meterStatus: "Missing intervals", cert: "LGC allocation active", creditTags: ["Gate meter", "Reconciliation"], pendingInterest: "$0" },
  { id: "acct-ca-w", site: "Water", group: "Common area / house", state: "Billing", address: "Common area, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-CA-W", account: "EN-TP-CA-W", contract: "EN Water stepped", usage: "640 kL", actualDemand: 6.4, contractDemand: 9, change: "↑ 2%", billing: "Ready", payment: "Current", billed: "$1,240", balance: "$1,240", unbilled: "$0", overdue: "$0", exceptions: 0, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
  { id: "acct-ca-ev", site: "EV Charging", group: "Common area / house", state: "Billing", address: "Visitor car park, TechPark Campus, 12 Innovation Way, Clayton VIC 3168", nmi: "EN-TP-CA-EV", account: "EN-TP-CA-EV", contract: "EN EV per-kWh", usage: "24,180 kWh", actualDemand: 86.2, contractDemand: 120, change: "↑ 22%", billing: "Ready", payment: "Current", billed: "$2,180", balance: "$2,180", unbilled: "$0", overdue: "$0", exceptions: 1, lastInvoice: "06 Mar 2026", meterStatus: "Complete", cert: "No environmental certificate products for this account.", creditTags: ["Billing"], pendingInterest: "$0" },
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
    id: "node-tenancies",
    name: "Tenancies",
    count: "9 accounts",
    children: [
      { id: "node-suite-b2", name: "Suite B2", count: "5", children: ["acct-b2-e", "acct-b2-h", "acct-b2-w", "acct-b2-ev", "acct-b2-t"] },
      { id: "node-suite-l3", name: "Suite L3", count: "4", children: ["acct-l3-e", "acct-l3-h", "acct-l3-w", "acct-l3-ev"] },
    ],
  },
  { id: "node-common-area", name: "Common area / house", count: "3", children: ["acct-gate-e", "acct-ca-w", "acct-ca-ev"] },
];

function CustomerLanding({ onSelect }: { onSelect: (customer: CustomerRecord) => void }) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filtered = customers.filter((customer) =>
    !query ||
    customer.name.toLowerCase().includes(query) ||
    customer.segment.toLowerCase().includes(query) ||
    customer.industry.toLowerCase().includes(query) ||
    customer.manager.toLowerCase().includes(query)
  );

  return (
    <Panel className="mx-auto max-w-3xl p-8">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon name="group" size={28} />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Select a customer or network</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Choose a network or tenant to open the hierarchy, fuel account details, billing, usage and exceptions.
        </p>
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
        <Icon name="search" size={16} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search network, tenant or manager"
          className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100"
          autoFocus
        />
      </div>
      <div className="mt-4 max-h-[28rem] overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
        {filtered.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-slate-500">No customers match “{search}”.</div>
        ) : filtered.map((customer) => (
          <button
            key={customer.id}
            type="button"
            onClick={() => onSelect(customer)}
            className="flex w-full items-center gap-4 border-b border-slate-200 px-4 py-4 text-left transition last:border-b-0 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-500/5"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {customer.name.split(" ").map((name) => name[0]).slice(0, 2).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{customer.name}</div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>{customer.segment}</span><span>•</span><span>{customer.industry}</span><span>•</span>
                <span>{customer.sites.toLocaleString()} accounts</span>
              </div>
            </div>
            <Icon name="chevron_right" size={18} className="shrink-0 text-slate-300 dark:text-slate-600" />
          </button>
        ))}
      </div>
    </Panel>
  );
}

function CustomerDrilldown({ selected, initialSiteId }: { selected: CustomerRecord; initialSiteId?: string | null }) {
  const colors = useColors();
  const chart = useChartTheme();
  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({});
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({ "node-tenancies": true, "node-suite-b2": true, "node-common-area": true });
  const [selectedEntity, setSelectedEntity] = useState<{ type: "site" | "node"; id: string; name: string }>(() => {
    const site = SITE_ROWS.find((row) => row.id === initialSiteId);
    if (site) return { type: "site", id: site.id, name: site.site };
    return { type: "site", id: "acct-b2-e", name: "Electricity" };
  });

  const customerContracts = contracts.filter((contract) => contract.customerId === selected.id);

  const siteById = useMemo(() => Object.fromEntries(SITE_ROWS.map((row) => [row.id, row])), []);
  const selectedSite = selectedEntity.type === "site" ? siteById[selectedEntity.id] || SITE_ROWS[0] : SITE_ROWS[0];
  const isSite = selectedEntity.type === "site";
  const displaySiteName = selected.sites === 1 ? selected.name : selectedSite.site;

  const nodeMetrics: Record<string, NodeMetric> = {
    "node-customer-root": { name: selected.name, count: `${selected.sites.toLocaleString()} accounts`, contact: selected.manager, role: "EN Portfolio Manager", email: `${selected.manager.toLowerCase().replace(" ", ".")}@supaenergy.example`, phone: "+61 3 9000 1200", sites: selected.sites, usage: selected.usage, billed: "$241.1k", paid: "$231.4k", unbilled: `$${selected.unbilled.toFixed(1)}k`, overdue: `$${selected.debt.toFixed(1)}k`, paymentInsight: "Payment performance across the network is stable, with the small residual balance sitting in newly onboarded tenancies." },
    "node-tenancies": { name: "Tenancies", count: "9 accounts", contact: "Amelia Hart", role: "EN Tenancy Operations", email: "amelia.hart@supaenergy.example", phone: "+61 3 9000 1202", sites: 9, usage: "151.5 MWh", billed: "$11.8k", paid: "$11.5k", unbilled: "$0", overdue: "$0", paymentInsight: "Tenancy billing is current — the only open item is a pending Telco/ISP product set-up in Suite B2." },
    "node-suite-b2": { name: "Suite B2", count: "5 accounts", contact: "Priya Nair", role: "Tenant Contact · Northwind Logistics", email: "priya.nair@northwind.example", phone: "+61 3 9000 1203", sites: 5, usage: "73.0 MWh", billed: "$5.9k", paid: "$5.9k", unbilled: "$0", overdue: "$0", paymentInsight: "All fuels are billing on the same cycle; the Telco/ISP account is awaiting product configuration." },
    "node-suite-l3": { name: "Suite L3", count: "4 accounts", contact: "Daniel Lee", role: "Tenant Contact · Vertex Analytics", email: "daniel.lee@vertex.example", phone: "+61 2 9000 1300", sites: 4, usage: "78.6 MWh", billed: "$5.9k", paid: "$5.9k", unbilled: "$0", overdue: "$0", paymentInsight: "No payment risk — a single estimated water read is pending an actual read." },
    "node-common-area": { name: "Common area / house", count: "3 accounts", contact: "Michael Tran", role: "Network Operations Lead", email: "michael.tran@supaenergy.example", phone: "+61 3 9000 1204", sites: 3, usage: "437.4 MWh", billed: "$21.8k", paid: "$21.8k", unbilled: "$12.4k", overdue: "$0", paymentInsight: "Gate meter billing is held pending gate versus child reconciliation for the March cycle." },
  };

  const selectedNode = selectedEntity.type === "node" ? nodeMetrics[selectedEntity.id] || nodeMetrics["node-customer-root"] : nodeMetrics["node-customer-root"];

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
                    <span className="ml-2 text-xs text-slate-500 dark:text-slate-600">{site.account}</span>
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
    <Panel className="p-5 md:col-span-2">
      <SectionHeader title="Contract Details" sub="Gate supply and embedded network service agreements associated to this customer." />
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
            <tr>{["", "Contract", "Start Date", "End Date", "Products", "Accounts"].map((h, i) => <th key={i} className="whitespace-nowrap px-4 py-3 text-left">{h}</th>)}</tr>
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
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{contract.sites.toLocaleString()} associated accounts</td>
                  </tr>
                  {expanded && (
                    <tr className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40">
                      <td colSpan={6} className="px-4 py-5">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                          <div className="rounded-xl bg-white p-4 [border:var(--card-border)] dark:bg-slate-900/60">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Swap Amount</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{contract.swapAmount}</div>
                          </div>
                          <div className="rounded-xl bg-white p-4 [border:var(--card-border)] dark:bg-slate-900/60">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Associated Accounts</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{contract.sites.toLocaleString()} total accounts covered</div>
                          </div>
                          <div className="rounded-xl bg-white p-4 [border:var(--card-border)] dark:bg-slate-900/60">
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard compact icon="apartment" title="Fuel Accounts" value={selected.sites.toLocaleString()} sub="Child accounts in hierarchy" tone="green" sparklineData={makeKpiSparkTrend(selected.sites, "rise")} sparklineValueFormatter={(value) => `${value.toLocaleString()} accounts`} />
        <KpiCard compact icon="bolt" title="Usage" value={selected.usage} sub="Current billing period" tone="green" sparklineData={makeKpiSparkTrend(Number.parseFloat(selected.usage.replace(/,/g, "")) || 0, "volatile", 2)} sparklineValueFormatter={(value) => `${value.toLocaleString()} GWh`} />
        <KpiCard compact icon="description" title="Draft Invoices" value="0" sub="Pending release" tone="blue" sparklineData={makeKpiSparkTrend(0, "decline")} sparklineValueFormatter={(value) => `${value.toLocaleString()} invoices`} />
        <KpiCard compact icon="credit_card" title="Unbilled Exposure" value={`$${selected.unbilled.toFixed(1)}k`} sub="Open this cycle" tone="purple" sparklineData={makeKpiSparkTrend(selected.unbilled, "volatile", 1)} sparklineValueFormatter={(value) => `$${value.toLocaleString()}k`} />
        <KpiCard compact emphasizeValue icon="warning" title="Open Exceptions" value={selected.exceptions} sub="Across EN child accounts" tone="amber" sparklineData={makeKpiSparkTrend(Number(selected.exceptions), "ease")} sparklineValueFormatter={(value) => `${value.toLocaleString()} exceptions`} />
        <KpiCard compact icon="account_balance" title="Outstanding Debt" value={`$${selected.debt.toFixed(1)}k`} sub="Due or overdue" tone="green" sparklineData={makeKpiSparkTrend(selected.debt, "ease", 1)} sparklineValueFormatter={(value) => `$${value.toLocaleString()}k`} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <Panel className="min-h-[420px] min-w-0 overflow-hidden p-5 xl:sticky xl:top-20 xl:z-10 xl:col-span-4 xl:flex xl:h-[calc(100vh-10rem)] xl:min-h-0 xl:self-start xl:flex-col">
          <SectionHeader title="Customer Hierarchy" sub="Select a suite or fuel account to view its details." />
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
            <Icon name="search" size={15} />
            <input placeholder="Search suite, NMI, or account" className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500 dark:text-slate-100" />
          </div>
          <button
            type="button"
            onClick={() => setSelectedEntity({ type: "node", id: "node-customer-root", name: selected.name })}
            className={cn(
              "mb-4 flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-left font-semibold",
              selectedEntity.id === "node-customer-root"
                ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/40"
                : "text-emerald-700 hover:bg-slate-100 dark:text-emerald-300 dark:hover:bg-slate-800",
            )}
          >
            <Icon name="account_tree" size={16} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate">{selected.name}</span>
            <span className="ml-auto shrink-0 rounded bg-slate-100 px-2 py-1 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">{selected.sites.toLocaleString()} accounts</span>
          </button>
          <div className="min-h-0 flex-1 overflow-y-auto pr-1 text-sm">
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
          <div className="min-w-0 space-y-4 xl:col-span-8">
            <DetailsContextStrip
              kind="site"
              title={displaySiteName}
              accountId={selectedSite.account}
              subtitle={selected.name}
              segment={selected.segment}
              initials={selected.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
              badges={
                <>
                  {selectedSite.creditTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>
                  ))}
                </>
              }
              metrics={[
                ["Fuel", selectedSite.site],
                ["Usage", selectedSite.usage],
                ["Billed", selectedSite.billed],
                ["Unbilled", selectedSite.unbilled],
                ["Overdue", selectedSite.overdue],
                ["Balance", selectedSite.balance],
              ]}
            />
            <Panel className="p-5">
              <SectionHeader
                title={`Account Details: ${displaySiteName}`}
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
                  ["Fuel", selectedSite.site],
                  ["Usage", selectedSite.usage],
                  ["Billed", selectedSite.billed],
                  ["Unbilled", selectedSite.unbilled],
                  ["Overdue", selectedSite.overdue],
                  ["Balance", selectedSite.balance],
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
                    <div className="flex items-start gap-2"><Icon name="bolt" size={14} className="text-emerald-600" /><span>{selectedSite.site} · {selectedSite.contract}</span></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Primary contact</div>
                  <div className="space-y-2 text-slate-700 dark:text-slate-300">
                    <div className="flex items-start gap-2"><Icon name="person" size={14} className="text-emerald-600" /><span>{selected.manager}</span></div>
                    <div className="flex items-start gap-2"><Icon name="mail" size={14} className="text-emerald-600" /><span>{selected.manager.toLowerCase().replaceAll(" ", ".")}@supaenergy.example</span></div>
                    <div className="flex items-start gap-2"><Icon name="phone" size={14} className="text-emerald-600" /><span>+61 400 000 000</span></div>
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Financial summary</div>
                  <div className="space-y-2">
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Account balance</span><span className="font-medium text-emerald-700 dark:text-emerald-300">{selectedSite.balance}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Last invoice</span><span className="font-medium text-slate-900 dark:text-white">{selectedSite.billed} · {selectedSite.lastInvoice}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Product</span><span className="font-medium text-slate-900 dark:text-white">{selectedSite.contract}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Network</span><span className="font-medium text-slate-900 dark:text-white">TechPark Campus EN</span></div>
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

            <Panel className="p-5">
              <SectionHeader
                title={`Sibling fuel accounts (${selectedSite.group})`}
                sub="Other fuel accounts billed to the same tenancy."
                action={<WidgetDownloadAction />}
              />
              <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                    <tr>
                      {["Account", "Fuel", "Mar billed", "Balance", "Status"].map((h) => (
                        <th key={h} className="whitespace-nowrap px-3 py-3 text-left">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SITE_ROWS.filter((row) => row.group === selectedSite.group).map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => selectSite(row.id)}
                        className={cn(
                          "cursor-pointer border-t border-slate-200 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-emerald-500/5",
                          row.id === selectedSite.id && "bg-emerald-50/70 dark:bg-emerald-500/10",
                        )}
                      >
                        <td className="whitespace-nowrap px-3 py-3 font-medium text-emerald-700 dark:text-emerald-200">{row.account}</td>
                        <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.site}</td>
                        <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.billed}</td>
                        <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.balance}</td>
                        <td className="px-3 py-3"><StatusPill>{row.state}</StatusPill></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <LoadDisaggregationPanel siteId={selectedSite.id} siteName={displaySiteName} customerId={selected.id} />
          </div>
        ) : (
          <div className="min-w-0 space-y-4 xl:col-span-8">
            <DetailsContextStrip
              kind="account"
              title={selectedNode.name}
              accountId={`TA${String(selectedNode.sites).padStart(6, "0")}`}
              subtitle={selectedNode.name}
              segment={selected.segment}
              initials={selectedNode.name.split(" ").map((part) => part[0]).slice(0, 2).join("").slice(0, 2) || "AC"}
              badges={
                <>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Active</span>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">Billing</span>
                </>
              }
              metrics={[
                ["Accounts", selectedNode.sites.toLocaleString()],
                ["Usage", selectedNode.usage],
                ["Billed", selectedNode.billed],
                ["Unbilled", selectedNode.unbilled],
                ["Overdue", selectedNode.overdue],
                ["Paid", selectedNode.paid],
              ]}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel className="p-5 md:col-span-2">
              <SectionHeader title={`Node Summary: ${selectedNode.name}`} sub="Aggregated view for the selected suite or network node." />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Fuel accounts</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.sites.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">kWh</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.usage}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Billed $</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.billed}</div>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
                  <div className="text-xs text-slate-500">Unbilled</div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{selectedNode.unbilled}</div>
                </div>
              </div>
            </Panel>

            <Panel className="p-5">
              <SectionHeader title="Contact Details" />
              <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
                <div className="text-lg font-semibold text-slate-900 dark:text-white">{selectedNode.contact}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{selectedNode.role}</div>
                <div className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <div>{selectedNode.email}</div>
                  <div>{selectedNode.phone}</div>
                </div>
              </div>
            </Panel>

            {contractPanel}

            <Panel className="p-5">
              <SectionHeader title="Geographic Distribution" sub="Child fuel accounts in the selected network or node." />
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

            <Panel className="p-5">
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

            <Panel className="p-5">
              <SectionHeader title="Payment Insights" />
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Insight</div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{selectedNode.paymentInsight}</p>
              </div>
            </Panel>
            </div>
          </div>
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
    { month: "Apr", created: 18, resolved: 16 },
    { month: "May", created: 21, resolved: 20 },
    { month: "Jun", created: 19, resolved: 21 },
    { month: "Jul", created: 24, resolved: 22 },
    { month: "Aug", created: 22, resolved: 19 },
    { month: "Sep", created: 26, resolved: 24 },
    { month: "Oct", created: 24, resolved: 24 },
    { month: "Nov", created: 31, resolved: 31 },
    { month: "Dec", created: 28, resolved: 27 },
    { month: "Jan", created: 36, resolved: 38 },
    { month: "Feb", created: 33, resolved: 34 },
    { month: "Mar", created: 27, resolved: 41 },
  ];
  const openByArea = [
    { name: "Gate vs child", count: 5 },
    { name: "Standing data", count: 4 },
    { name: "Meter upload", count: 4 },
    { name: "PoC transfer", count: 3 },
    { name: "Child add/rem", count: 2 },
  ];
  const customersWithExceptions = [
    ["TechPark Campus EN", 5, 2, "Gate Δ 2.8%"],
    ["Portside Logistics Hub EN", 5, 1, "Child NMI add"],
    ["Docklands Business Hub EN", 3, 1, "HVAC NEM12 fail"],
    ["Westside Industrial Park EN", 3, 0, "PoC OFF↔ON transfer"],
    ["Southbank Offices EN", 1, 0, "Child standing data"],
    ["Northwind Logistics Pty Ltd", 1, 0, "Standing data LR"],
  ] as const;

  const segmentOptions = ["Commercial EN"];
  const periodOptions = ["Current month", "Previous month", "QTD", "YTD"];
  const [segment, setSegment] = useState(segmentOptions[0]);
  const [period, setPeriod] = useState(periodOptions[0]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <SelectLike compact label="Segment" value={segment} options={segmentOptions} onChange={setSegment} />
        <SelectLike compact label="Billing cycle" value={period} options={periodOptions} onChange={setPeriod} />
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <KpiCard compact emphasizeValue icon="warning" title="Open Exceptions" value="18" sub="Currently unresolved" tone="amber" sparklineData={makeKpiSparkTrend(18, "ease")} sparklineValueFormatter={(value) => `${value.toLocaleString()} exceptions`} />
        <KpiCard compact emphasizeValue icon="priority_high" title="High Severity" value="4" sub="Critical and high priority" tone="red" sparklineData={makeKpiSparkTrend(4, "ease")} sparklineValueFormatter={(value) => `${value.toLocaleString()} high severity`} />
        <KpiCard compact icon="task_alt" title="Resolved" value="41" sub="Closed in current month" tone="green" sparklineData={makeKpiSparkTrend(41, "rise")} sparklineValueFormatter={(value) => `${value.toLocaleString()} resolved`} />
        <KpiCard compact emphasizeValue icon="schedule" title="SLA Breached" value="4" sub="Open past SLA date" tone="red" sparklineData={makeKpiSparkTrend(4, "decline")} sparklineValueFormatter={(value) => `${value.toLocaleString()} breached`} />
        <KpiCard compact icon="hourglass_top" title="Avg Age Open" value="3.2d" sub="Days since created" tone="purple" sparklineData={makeKpiSparkTrend(3.2, "ease", 1)} sparklineValueFormatter={(value) => `${value.toLocaleString()} days`} />
        <KpiCard compact icon="event" title="Due Today" value="6" sub="Target date is today" tone="blue" sparklineData={makeKpiSparkTrend(6, "volatile")} sparklineValueFormatter={(value) => `${value.toLocaleString()} due`} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel className="p-5">
          <SectionHeader title="Open by Sub-status" sub="Workflow state for unresolved exceptions" action={<WidgetDownloadAction />} />
          <div className="mt-8">
            <div className="flex h-11 overflow-hidden rounded-xl border border-blue-300 bg-blue-50 dark:border-blue-400/40 dark:bg-blue-500/10">
              <div className="flex items-center justify-end bg-blue-100 pr-3 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200" style={{ width: "50%" }}>
                50%
              </div>
              <div className="flex items-center justify-end bg-amber-100 pr-3 text-xs font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200" style={{ width: "38.9%" }}>
                38.9%
              </div>
              <div className="min-w-[3px] flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-slate-500">In Progress</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">9</div>
              </div>
              <div>
                <div className="text-slate-500">New</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">7</div>
              </div>
              <div>
                <div className="text-slate-500">Waiting Customer</div>
                <div className="mt-1 font-semibold text-slate-900 dark:text-white">2</div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Open by Severity" sub="Mapped from exception priority" action={<WidgetDownloadAction />} />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ severity: "High", count: 4 }, { severity: "Medium", count: 8 }, { severity: "Low", count: 6 }]} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
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
            <div className="grid place-items-center bg-emerald-100 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" style={{ width: "39%" }}>39%</div>
            <div className="grid min-w-8 flex-1 place-items-center bg-blue-100 text-xs font-semibold text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">61%</div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Resolved Automatically</div>
              <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">16</div>
              <div className="mt-1 text-xs text-slate-500">39.0% · meter upload retries</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 [border:var(--card-border)] dark:bg-slate-950/50">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />User</div>
              <div className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">25</div>
              <div className="mt-1 text-xs text-slate-500">61.0% · avg 1.8 days to close</div>
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
                  {["Severity", "Gate vs child", "Standing data", "Meter upload", "PoC transfer", "Child add/rem", "Total"].map((heading) => (
                    <th key={heading} className="px-3 py-3 text-right font-medium first:text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["High", 2, 1, 1, 0, 0, 4],
                  ["Medium", 2, 2, 1, 2, 1, 8],
                  ["Low", 1, 1, 2, 1, 1, 6],
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
                              : severity === "Medium"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
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
            <span>Total open · 18</span>
          </div>
        </Panel>

        <Panel className="p-5">
          <SectionHeader title="Open by Area" sub="EN exception area concentration" action={<WidgetDownloadAction />} />
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
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">16</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">j.patel@supaenergy.example</td>
                <td className="px-4 py-3 text-slate-500">User</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">14</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">s.nguyen@supaenergy.example</td>
                <td className="px-4 py-3 text-slate-500">User</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">7</td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">a.brooks@supaenergy.example</td>
                <td className="px-4 py-3 text-slate-500">User</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel className="p-5">
        <SectionHeader title="Customers with Open Exceptions" sub="Concentration by network and tenant" action={<WidgetDownloadAction />} />
          <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                <tr>
                  {["Customer / network", "Open", "High Severity", "Example"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left font-medium">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customersWithExceptions.map(([customer, open, high, example]) => (
                  <tr key={customer} className="border-t border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{customer}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{open}</td>
                    <td className="px-4 py-3 font-medium text-red-700 dark:text-red-300">{high}</td>
                    <td className="px-4 py-3 text-slate-500">{example}</td>
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

function DashboardHeader({
  activeView,
  selected,
  setActiveView,
  setSelectedCustomer,
  compact,
  onSelectCustomerView,
}: {
  activeView: ViewKey;
  selected: CustomerRecord | null;
  setActiveView: (v: ViewKey) => void;
  setSelectedCustomer: (c: CustomerRecord) => void;
  compact: boolean;
  onSelectCustomerView?: () => void;
}) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const isCustomer = activeView === "Customer Hierarchy";
  const pickerCustomer = selected ?? customers[0];
  const filteredCustomers = customers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()));

  const subtitle = isCustomer
    ? "Customer command centre for hierarchy, fuel accounts, billing, usage and exceptions."
    : activeView === "Exception Workspace"
      ? "Unified queue for gate reconciliation, standing data, meter upload and child account exceptions."
      : activeView === "Interactions"
        ? "Customer interaction history and communication log."
        : "Network-level billing, payment and exception performance across embedded networks.";

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
          <div className={cn("font-semibold tracking-tight text-slate-900 dark:text-white", compact ? "text-base" : "text-3xl")}>{pickerCustomer.name}</div>
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
              placeholder="Search network, tenant or manager"
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
                  pickerCustomer.id === customer.id && "bg-emerald-50/80 dark:bg-emerald-500/10",
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
                    <span>{customer.sites.toLocaleString()} accounts</span>
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

  return (
    <div
      className={cn(
        "@container sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl transition-[padding] duration-200 dark:border-slate-800 dark:bg-slate-950/85",
        compact ? "px-7 py-2" : "px-7 py-3",
      )}
    >
      {compact ? (
        <div className="flex items-center justify-between gap-4">
          <ViewSwitcher
            activeView={activeView}
            setActiveView={setActiveView}
            onSelectCustomerView={onSelectCustomerView}
            compact
          />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <ViewSwitcher activeView={activeView} setActiveView={setActiveView} onSelectCustomerView={onSelectCustomerView} />
              {isCustomer && selected && <div className="mt-4">{customerPicker}</div>}
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
              {isCustomer && selected && (
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                  Portfolio Overview <span className="text-slate-400 dark:text-slate-600">›</span> {selected.name}
                </div>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-2 text-xs text-slate-500">
            <Icon name="refresh" size={13} /> Last updated: 8:32 AM AEST
            {isCustomer && selected && <span className="ml-3 rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">Auto refresh •</span>}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────── Right insight rail ────────── */

const PANEL_TABS = ["Adora", "Control Panel", "X-Sell"] as const;
type PanelTab = (typeof PANEL_TABS)[number];
const PANEL_TAB_ICONS: Record<PanelTab, string> = {
  Adora: "auto_awesome",
  "Control Panel": "tune",
  "X-Sell": "add_shopping_cart",
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

/** Embedded network actions added alongside the shared quick actions */
const EN_QUICK_ACTIONS = [
  { name: "Upload EN meter reads", icon: "upload" as const },
  { name: "Reconcile gate meter", icon: "compare_arrows" as const },
  { name: "Add fuel account", icon: "add_circle" as const },
];

const SHARED_QUICK_ACTIONS = [
  { name: "Update Contact", icon: "person_edit" as const },
  { name: "Import Payments", icon: "payments" as const },
  { name: "Download Invoices", icon: "receipt_long" as const },
  { name: "Download Meter Data", icon: "download" as const },
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
                    ? "rounded-tr-sm bg-[#067152] text-white"
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
          className="mb-4 flex items-center gap-1 text-sm font-medium text-[#067152] transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
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
      title: "Electricity · SUPA Energy",
      subtitle: "Business Large Plan · Connected",
      detailTitle: "Active electricity service",
      paragraphs: [
        "Electricity is supplied by SUPA Energy on the Business Large Plan. All linked NMIs show a connected status.",
        "This is the primary revenue service for cross-sell conversations such as demand review, solar, and renewal.",
      ],
      bullets: [
        "Provider: SUPA Energy",
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
                ? "border-[#4FB748]/40 bg-[#4FB748]/10 text-[#067152] dark:border-[#4FB748]/30 dark:bg-[#4FB748]/15 dark:text-[#4FB748]"
                : "border-slate-200/60 bg-white/60 text-slate-500 hover:border-[#C0E095]/30 hover:bg-[#C0E095]/8 hover:text-[#067152] dark:border-white/[0.06] dark:bg-white/[0.04] dark:text-slate-500 dark:hover:border-[#C0E095]/20 dark:hover:bg-[#C0E095]/10 dark:hover:text-[#C0E095]"
            )}
          >
            <Icon name={icon} size={17} />
          </button>
        ))}
      </div>

      <div className="px-3.5 pt-3.5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#067152]/30 bg-[#067152]/4 px-3 py-2.5 text-[13px] font-semibold text-[#067152] transition-all hover:-translate-y-0.5 hover:border-[#067152] hover:bg-[#067152]/8 hover:shadow-md dark:border-white/20 dark:bg-white/[0.03] dark:text-slate-200 dark:hover:border-white/40 dark:hover:bg-white/[0.06]"
        >
          <Icon name="add" size={16} />
          Create new task
          <span className="rounded bg-[#067152] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white dark:bg-[#4FB748] dark:text-gray-900">
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

      <div className="border-t border-slate-100/60 px-2 py-1.5 dark:border-white/[0.04]">
        <div className="px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Shared
        </div>
        {SHARED_QUICK_ACTIONS.map((action) => (
          <button
            key={action.name}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.04]"
          >
            <Icon name={action.icon} size={17} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="flex-1 text-left text-[13px] font-medium text-slate-700 dark:text-slate-300">
              {action.name}
            </span>
            <Icon name="chevron_right" size={15} className="shrink-0 text-slate-300 dark:text-slate-600" />
          </button>
        ))}

        <div className="px-2.5 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-[#067152] dark:text-[#C0E095]">
          Embedded network
        </div>
        {EN_QUICK_ACTIONS.map((action) => (
          <button
            key={action.name}
            type="button"
            className="flex w-full items-center gap-2.5 rounded-xl border border-[#4FB748]/30 bg-[#4FB748]/8 px-2.5 py-2.5 transition-colors hover:border-[#4FB748]/60 hover:bg-[#4FB748]/12 dark:border-[#4FB748]/25 dark:bg-[#4FB748]/10 dark:hover:bg-[#4FB748]/15 [&:not(:last-child)]:mb-1.5"
          >
            <Icon name={action.icon} size={17} className="shrink-0 text-[#067152] dark:text-[#C0E095]" />
            <span className="flex-1 text-left text-[13px] font-medium text-slate-700 dark:text-slate-200">
              {action.name}
            </span>
            <Icon name="chevron_right" size={15} className="shrink-0 text-[#067152]/60 dark:text-[#C0E095]/70" />
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
            { icon: "bolt" as const, iconBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/25 dark:text-amber-300", service: "Electricity", provider: "SUPA Energy", plan: "HomeDeal Extra", status: "Connected" },
            { icon: "local_fire_department" as const, iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300", service: "Gas", provider: "SUPA Energy", plan: "Online saver plan 2024", status: "Connected" },
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
  activePanelTab: controlledActivePanelTab,
  onPanelTabChange,
}: {
  activeView: ViewKey;
  selected: CustomerRecord;
  onClose?: () => void;
  showRailHeader?: boolean;
  activePanelTab?: PanelTab;
  onPanelTabChange?: (tab: PanelTab) => void;
}) {
  const isCustomer = activeView === "Customer Hierarchy";
  const [localActivePanelTab, setLocalActivePanelTab] = useState<PanelTab>("Adora");
  const [xSellView, setXSellView] = useState<string | null>(null);
  const activePanelTab = controlledActivePanelTab ?? localActivePanelTab;
  const setActivePanelTab = (tab: PanelTab) => {
    setLocalActivePanelTab(tab);
    onPanelTabChange?.(tab);
  };

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
                  ? "bg-slate-100 text-[#067152] dark:bg-white/[0.1] dark:text-[#4FB748]"
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
  companionOpen,
  onOpenCompanion,
}: {
  activeView: ViewKey;
  selected: CustomerRecord | null;
  collapsed: boolean;
  onToggle: () => void;
  companionOpen: boolean;
  onOpenCompanion: () => void;
}) {
  const [activePanelTab, setActivePanelTab] = useState<PanelTab>("Adora");
  const resolvedSelected = selected ?? customers[0];

  if (collapsed) {
    return (
      <aside
        className="dark flex w-14 shrink-0 flex-col items-center py-4"
        style={{ backgroundColor: DARKEST_NAVY }}
        aria-label="Insight panel"
      >
        <div className="flex flex-col items-center gap-2">
          {PANEL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActivePanelTab(tab);
                onToggle();
              }}
              aria-label={`Open ${tab}`}
              title={tab}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors",
                activePanelTab === tab ? "bg-white/10" : "hover:bg-white/10",
              )}
            >
              <Icon name={PANEL_TAB_ICONS[tab]} size={20} />
              {tab === "Adora" ? (
                <span aria-hidden className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full shadow-[0_0_6px_rgba(79,183,72,0.6)]" style={{ backgroundColor: ACCENT }} />
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onOpenCompanion}
            aria-label="Open Companion"
            title="Companion"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              companionOpen
                ? "bg-orange-50 dark:bg-orange-500/15"
                : "hover:bg-orange-50 dark:hover:bg-orange-500/10",
            )}
          >
            <CompanionCompactIcon />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand AI insight panel"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          >
            <Icon name="chevron_left" size={20} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="dark flex w-72 shrink-0 flex-col overflow-hidden p-3 xl:w-80"
      style={{ backgroundColor: DARKEST_NAVY }}
      aria-label="Insight panel"
    >
      <InsightContent
        activeView={activeView}
        selected={resolvedSelected}
        onClose={onToggle}
        showRailHeader
        activePanelTab={activePanelTab}
        onPanelTabChange={setActivePanelTab}
      />
    </aside>
  );
}

/* ────────── Page wrapper with Glass chrome ────────── */

export default function GlassEmbeddedNetworksPage() {
  return (
    <Suspense>
      <GlassEmbeddedNetworksContent />
    </Suspense>
  );
}

function GlassEmbeddedNetworksContent() {
  const searchParams = useSearchParams();
  const deepLinkSiteId = searchParams.get("site");
  const [activeView, setActiveView] = useState<ViewKey>(() =>
    searchParams.get("view") === "customer" ? "Customer Hierarchy" : "Portfolio Overview"
  );
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(() => {
    const customerId = searchParams.get("customer");
    if (!customerId) return null;
    return customers.find((customer) => customer.id === customerId) ?? null;
  });
  const [activeNavId, setActiveNavId] = useState("customers-portfolio");
  const [openParentId, setOpenParentId] = useState<string | null>("customers");
  const [isExpanded, setIsExpanded] = useState(searchParams.get("expanded") === "true");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [aiRailCollapsed, setAiRailCollapsed] = useState(false);
  const [companionOpen, setCompanionOpen] = useState(false);
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
  const openCustomerLanding = () => {
    setSelectedCustomer(null);
    setActiveView("Customer Hierarchy");
  };

  const content = useMemo(() => {
    if (activeView === "Portfolio Overview") return <PortfolioOverview setActiveView={setActiveView} openCustomer={openCustomer} />;
    if (activeView === "Customer Hierarchy") {
      return selectedCustomer
        ? <CustomerDrilldown selected={selectedCustomer} initialSiteId={deepLinkSiteId} />
        : <CustomerLanding onSelect={openCustomer} />;
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
      style={{ backgroundColor: DARKEST_NAVY, ...CARD_SURFACE_VARS }}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* ────── Glass header chrome ────── */}
        <header className="flex h-14 shrink-0 items-center gap-4 px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
              <Image src="/SupaEnergyLogoReversed.png" alt="supaenergy" width={300} height={48} className="h-8 w-auto" priority />
            </Link>
          </div>
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Search data"
                className="h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4FB748]/50"
                style={{ backgroundColor: DARK_NAVY }}
              />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-md bg-pink-500 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">DEV</span>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-gray-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Add">
              <Icon name="add" size={22} />
            </button>
            <Avatar className="h-9 w-9 border-2 border-[#4FB748]/30">
              <AvatarFallback className="text-xs font-medium text-white" style={{ backgroundColor: ACCENT }}>BD</AvatarFallback>
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
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r" style={{ backgroundColor: ACCENT }} aria-hidden />
                      )}
                      <button
                        type="button"
                        className={cn(
                          "group flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white transition-colors",
                          parentActive ? "bg-white/10" : "hover:bg-white/10",
                        )}
                      >
                        <Icon name={item.icon} size={20} className="shrink-0 text-white" />
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
                        "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-normal text-white transition-colors",
                        parentActive || isOpen ? "bg-white/10" : "hover:bg-white/10",
                      )}
                    >
                      {parentActive && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r" style={{ backgroundColor: ACCENT }} aria-hidden />
                      )}
                      <Icon name={item.icon} size={20} className="shrink-0 text-white" />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {hasChildren && <Icon name={isOpen ? "expand_less" : "expand_more"} size={20} className="shrink-0 text-white/70" />}
                    </button>
                    {hasChildren && isOpen && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-2">
                        {item.children!.map((child) => (
                          <li key={child.id}>
                            <button
                              type="button"
                              onClick={() => setActiveNavId(child.id)}
                              className={cn(
                                "flex w-full items-center rounded-lg py-2 pl-2 pr-3 text-left text-sm font-normal text-white transition-colors",
                                activeNavId === child.id
                                  ? "bg-white/10 font-medium"
                                  : "hover:bg-white/10",
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
                className="group flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
              >
                <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
              </button>
              <button
                type="button"
                onClick={() => setNavCollapsed((v) => !v)}
                className="group flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
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
                          ? "mx-2 rounded-lg bg-emerald-100 font-medium text-[#067152] dark:bg-[#4FB748]/20 dark:text-[#4FB748]"
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
            className="flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem] rounded-tr-[1.5rem] text-slate-700 dark:text-slate-100"
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
                onSelectCustomerView={openCustomerLanding}
              />
              <div className="p-7">{content}</div>
            </div>
          </main>
          <RightInsightRail
            activeView={activeView}
            selected={selectedCustomer}
            collapsed={aiRailCollapsed}
            onToggle={() => setAiRailCollapsed((v) => !v)}
            companionOpen={companionOpen}
            onOpenCompanion={() => setCompanionOpen(true)}
          />
          <CompanionWidget
            open={companionOpen}
            onOpenChange={setCompanionOpen}
            launcherClassName={aiRailCollapsed ? "hidden" : undefined}
          />
        </div>
      </div>
    </div>
  );
}
