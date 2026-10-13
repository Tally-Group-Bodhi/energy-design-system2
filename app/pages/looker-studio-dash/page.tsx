"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import Select from "@/components/Select/Select";
import Button from "@/components/Button/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import { H3 } from "@/components/Typography/Typography";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── Brand skins ────────────────────────────────────────────────────────── */

type BrandId = "adora" | "first-energy" | "tally-group";
type ToneKey = "neutral" | "accent" | "warn" | "danger" | "success";

type BrandTheme = {
  id: BrandId;
  label: string;
  subtitle: string;
  pageBg: string;
  card: string;
  cardRadius: string;
  chipRadius: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableZebra: string;
  tableHover: string;
  footerBg: string;
  mutedPanel: string;
  text: string;
  muted: string;
  border: string;
  axis: string;
  grid: string;
  chartPrimary: string;
  chartActive: string;
  toggleActive: string;
  toggleIdle: string;
  breadcrumbActive: string;
  logo?: { src: string; alt: string; mark?: string };
  swatches: { name: string; hex: string }[];
  tones: Record<
    ToneKey,
    { value: string; iconBg: string; icon: string; chip: string }
  >;
  pie: { mismatch: string; needsReview: string; match: string };
};

const THEMES: Record<BrandId, BrandTheme> = {
  adora: {
    id: "adora",
    label: "Adora Defender",
    subtitle: "Default Adora Defender emerald / amber / red validation theme",
    pageBg: "bg-slate-50 dark:bg-slate-950",
    card: "rounded-xl border-slate-200 bg-white shadow-none dark:border-slate-800 dark:bg-slate-900/70",
    cardRadius: "rounded-xl",
    chipRadius: "rounded-md",
    tableHeaderBg: "bg-emerald-600 dark:bg-emerald-700",
    tableHeaderText: "text-white",
    tableZebra: "bg-slate-50 dark:bg-slate-900/70",
    tableHover: "hover:bg-emerald-50/60 dark:hover:bg-emerald-500/5",
    footerBg: "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40",
    mutedPanel: "rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40",
    text: "text-slate-900 dark:text-white",
    muted: "text-slate-500 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    axis: "#64748B",
    grid: "#E2E8F0",
    chartPrimary: "#059669",
    chartActive: "#22C55E",
    toggleActive: "bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300",
    toggleIdle:
      "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white",
    breadcrumbActive:
      "rounded-md bg-emerald-50 px-2.5 py-1 font-normal text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    logo: { src: "/AdoraDefenderLogo.png", alt: "Adora", mark: "defender" },
    swatches: [
      { name: "Emerald", hex: "#22C55E" },
      { name: "Amber", hex: "#F59E0B" },
      { name: "Red", hex: "#EF4444" },
      { name: "Slate", hex: "#64748B" },
    ],
    tones: {
      neutral: {
        value: "text-slate-900 dark:text-white",
        iconBg: "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700",
        icon: "text-slate-600 dark:text-slate-300",
        chip: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
      },
      accent: {
        value: "text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-400/20",
        icon: "text-emerald-700 dark:text-emerald-300",
        chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      },
      warn: {
        value: "text-amber-700 dark:text-amber-300",
        iconBg: "bg-amber-50 border-amber-200 dark:bg-amber-500/15 dark:border-amber-400/20",
        icon: "text-amber-700 dark:text-amber-300",
        chip: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
      },
      danger: {
        value: "text-red-700 dark:text-red-300",
        iconBg: "bg-red-50 border-red-200 dark:bg-red-500/15 dark:border-red-400/20",
        icon: "text-red-700 dark:text-red-300",
        chip: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
      },
      success: {
        value: "text-emerald-700 dark:text-emerald-300",
        iconBg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/15 dark:border-emerald-400/20",
        icon: "text-emerald-700 dark:text-emerald-300",
        chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      },
    },
    pie: { mismatch: "#EF4444", needsReview: "#F59E0B", match: "#22C55E" },
  },

  "first-energy": {
    id: "first-energy",
    label: "1st Energy",
    subtitle:
      "Reskin using 1st Energy navy + cyan (logo & login) with rounded UI chrome",
    pageBg: "bg-[#F5F8FC]",
    card: "rounded-2xl border-[#D4E3F4] bg-white shadow-none",
    cardRadius: "rounded-2xl",
    chipRadius: "rounded-full",
    tableHeaderBg: "bg-[#1A4796]",
    tableHeaderText: "text-white",
    tableZebra: "bg-[#F0F6FC]",
    tableHover: "hover:bg-[#E5F3FB]",
    footerBg: "border-[#D4E3F4] bg-[#F0F6FC]",
    mutedPanel: "rounded-2xl border border-[#D4E3F4] bg-white",
    text: "text-[#1A4796]",
    muted: "text-[#5A7391]",
    border: "border-[#D4E3F4]",
    axis: "#5A7391",
    grid: "#D4E3F4",
    chartPrimary: "#00ADEF",
    chartActive: "#1A4796",
    toggleActive: "rounded-full bg-[#1A4796] text-white",
    toggleIdle:
      "rounded-full text-[#5A7391] hover:bg-[#E5F3FB] hover:text-[#1A4796]",
    breadcrumbActive:
      "rounded-full bg-[#E5F3FB] px-2.5 py-1 font-normal text-[#1A4796]",
    logo: { src: "/1stEnergyLogo.png", alt: "1st Energy" },
    swatches: [
      { name: "Navy", hex: "#1A4796" },
      { name: "Cyan", hex: "#00ADEF" },
      { name: "Sky", hex: "#2AABE2" },
      { name: "Ice", hex: "#E5F3FB" },
    ],
    tones: {
      neutral: {
        value: "text-[#1A4796]",
        iconBg: "bg-[#E5F3FB] border-[#D4E3F4]",
        icon: "text-[#1A4796]",
        chip: "bg-[#E5F3FB] text-[#1A4796]",
      },
      accent: {
        value: "text-[#00ADEF]",
        iconBg: "bg-[#E0F6FD] border-[#A8E4F8]",
        icon: "text-[#008FC4]",
        chip: "bg-[#E0F6FD] text-[#0077A8]",
      },
      warn: {
        value: "text-[#2AABE2]",
        iconBg: "bg-[#E5F3FB] border-[#A8E4F8]",
        icon: "text-[#1A4796]",
        chip: "bg-[#E5F3FB] text-[#1A4796]",
      },
      danger: {
        value: "text-[#C40000]",
        iconBg: "bg-[#FEE2E2] border-[#FECACA]",
        icon: "text-[#C40000]",
        chip: "bg-[#FEE2E2] text-[#C40000]",
      },
      success: {
        value: "text-[#1A4796]",
        iconBg: "bg-[#E0F6FD] border-[#A8E4F8]",
        icon: "text-[#00ADEF]",
        chip: "bg-[#E0F6FD] text-[#0077A8]",
      },
    },
    pie: { mismatch: "#C40000", needsReview: "#2AABE2", match: "#1A4796" },
  },

  "tally-group": {
    id: "tally-group",
    label: "Tally Group",
    subtitle: "Reskin with Tally Group / EnergyCo navy + turquoise brand colours",
    pageBg: "bg-[#F9F9FB]",
    card: "rounded-xl border-[#DEDEE1] bg-white shadow-none",
    cardRadius: "rounded-xl",
    chipRadius: "rounded-md",
    tableHeaderBg: "bg-[#2C365D]",
    tableHeaderText: "text-white",
    tableZebra: "bg-[#E8EBED]/50",
    tableHover: "hover:bg-[#E8EBED]",
    footerBg: "border-[#DEDEE1] bg-[#E8EBED]/60",
    mutedPanel: "rounded-xl border border-[#DEDEE1] bg-[#E8EBED]/40",
    text: "text-[#2C365D]",
    muted: "text-[#595767]",
    border: "border-[#DEDEE1]",
    axis: "#595767",
    grid: "#DEDEE1",
    chartPrimary: "#00D2A2",
    chartActive: "#2C365D",
    toggleActive: "bg-[#2C365D] text-white",
    toggleIdle: "text-[#8896AE] hover:bg-[#E8EBED] hover:text-[#2C365D]",
    breadcrumbActive: "rounded bg-[#E8EBED] px-2.5 py-1 font-normal text-[#2C365D]",
    logo: { src: "/EnergyCoLogoOnLight.png", alt: "EnergyCo" },
    swatches: [
      { name: "Navy", hex: "#2C365D" },
      { name: "Turquoise", hex: "#00D2A2" },
      { name: "Mint", hex: "#4EEECA" },
      { name: "Lighter", hex: "#E8EBED" },
    ],
    tones: {
      neutral: {
        value: "text-[#2C365D]",
        iconBg: "bg-[#E8EBED] border-[#DEDEE1]",
        icon: "text-[#2C365D]",
        chip: "bg-[#E8EBED] text-[#2C365D]",
      },
      accent: {
        value: "text-[#00D2A2]",
        iconBg: "bg-[#D1FAF0] border-[#A1E2D8]",
        icon: "text-[#00A882]",
        chip: "bg-[#D1FAF0] text-[#008F70]",
      },
      warn: {
        value: "text-[#C53B00]",
        iconBg: "bg-[#FFF4E6] border-[#FBD89D]",
        icon: "text-[#C53B00]",
        chip: "bg-[#FFF4E6] text-[#C53B00]",
      },
      danger: {
        value: "text-[#C40000]",
        iconBg: "bg-[#FEE2E2] border-[#FECACA]",
        icon: "text-[#C40000]",
        chip: "bg-[#FEE2E2] text-[#C40000]",
      },
      success: {
        value: "text-[#008000]",
        iconBg: "bg-[#D1FAE5] border-[#A7F3D0]",
        icon: "text-[#008000]",
        chip: "bg-[#D1FAE5] text-[#008000]",
      },
    },
    pie: { mismatch: "#C53B00", needsReview: "#8896AE", match: "#00D2A2" },
  },
};

/* ── Screen data ────────────────────────────────────────────────────────── */

const findingsRows = [
  {
    index: 1,
    run_date: "Sep 16, 2026",
    conversation_key: "3c8a9f5a-ad6f-4150-8c9c-009bb01d7e12",
    verdict: "MISMATCH",
    severity: "major",
    spoken_move_out_date: "Dec 20, 2026",
    submitted_move_out_date: "Nov 11, 2026",
    delta_days: "39",
    account_number: "9001402",
  },
  {
    index: 2,
    run_date: "Sep 16, 2026",
    conversation_key: "7e2b1c4d-9f0a-4b3e-a1d5-22c8e6f0a94b",
    verdict: "MISMATCH",
    severity: "major",
    spoken_move_out_date: "Oct 5, 2026",
    submitted_move_out_date: "Nov 6, 2026",
    delta_days: "-32",
    account_number: "9002817",
  },
  {
    index: 3,
    run_date: "Sep 16, 2026",
    conversation_key: "a91f3e70-b2c4-4d8e-9f11-55a0c3d8e217",
    verdict: "NEEDS_REVIEW",
    severity: "none",
    spoken_move_out_date: "null",
    submitted_move_out_date: "null",
    delta_days: "null",
    account_number: "9003341",
  },
  {
    index: 4,
    run_date: "Sep 15, 2026",
    conversation_key: "f04c6d8a-1e29-48b7-b3c2-88d1a5e9f063",
    verdict: "MISMATCH",
    severity: "major",
    spoken_move_out_date: "Jan 8, 2027",
    submitted_move_out_date: "Dec 20, 2026",
    delta_days: "19",
    account_number: "9004529",
  },
  {
    index: 5,
    run_date: "Sep 15, 2026",
    conversation_key: "2b7e9a1c-5d60-4f2a-8e3b-11c4d7a0b852",
    verdict: "MATCH",
    severity: "none",
    spoken_move_out_date: "Sep 30, 2026",
    submitted_move_out_date: "Sep 30, 2026",
    delta_days: "0",
    account_number: "9005188",
  },
];

const evidenceRows = [
  {
    index: 1,
    conversation_key: "3c8a9f5a-ad6f-4150-8c9c-009bb01d7e12",
    evidence:
      "Agent: Sure. I have processed your move-out request for 20 December 2026.\nCustomer: Yes that's the date I gave you — the twentieth of December.\nAgent: Confirmed. I'll submit that now against account 9001402.",
    agent_email: "bhagya.rupasinghe@tally.energy",
    account_number: "9001402",
    genesys_conversation_id: "3c8a9f5a-ad6f-4150-8c9c-009bb01d7e12",
  },
  {
    index: 2,
    conversation_key: "7e2b1c4d-9f0a-4b3e-a1d5-22c8e6f0a94b",
    evidence:
      "Customer: Can you change my move-out to the 5th of October please?\nAgent: I've noted 5 October 2026 as the spoken move-out date.\nCustomer: Perfect, thanks.",
    agent_email: "bhagya.rupasinghe@tally.energy",
    account_number: "9002817",
    genesys_conversation_id: "7e2b1c4d-9f0a-4b3e-a1d5-22c8e6f0a94b",
  },
  {
    index: 3,
    conversation_key: "a91f3e70-b2c4-4d8e-9f11-55a0c3d8e217",
    evidence:
      "Agent: Just confirming — do you have a move-out date yet?\nCustomer: Not sure, I need to check with the real estate agent and call back.\nAgent: No worries. We'll leave the date blank until you confirm.",
    agent_email: "sara.chen@tally.energy",
    account_number: "9003341",
    genesys_conversation_id: "a91f3e70-b2c4-4d8e-9f11-55a0c3d8e217",
  },
  {
    index: 4,
    conversation_key: "f04c6d8a-1e29-48b7-b3c2-88d1a5e9f063",
    evidence:
      "Customer: We're moving on the 8th of January next year.\nAgent: Got it — 8 January 2027. I'll put that through now.\nCustomer: Actually wait, the form might still say December somewhere.\nAgent: I'll double-check the submitted date against what you just said.",
    agent_email: "liam.okafor@tally.energy",
    account_number: "9004529",
    genesys_conversation_id: "f04c6d8a-1e29-48b7-b3c2-88d1a5e9f063",
  },
  {
    index: 5,
    conversation_key: "2b7e9a1c-5d60-4f2a-8e3b-11c4d7a0b852",
    evidence:
      "Agent: Your move-out is recorded as 30 September 2026 — does that still look right?\nCustomer: Yes, that's correct.\nAgent: Great, spoken and submitted dates match. Nothing further needed.",
    agent_email: "sara.chen@tally.energy",
    account_number: "9005188",
    genesys_conversation_id: "2b7e9a1c-5d60-4f2a-8e3b-11c4d7a0b852",
  },
];

const dailyActiveUsers = [
  { date: "Aug 20", users: 2100 },
  { date: "Aug 22", users: 2250 },
  { date: "Aug 24", users: 1980 },
  { date: "Aug 26", users: 2400 },
  { date: "Aug 28", users: 2650 },
  { date: "Aug 30", users: 2500 },
  { date: "Sep 1", users: 2800 },
  { date: "Sep 3", users: 3100 },
  { date: "Sep 5", users: 2950 },
  { date: "Sep 7", users: 3200 },
  { date: "Sep 9", users: 3050 },
  { date: "Sep 11", users: 3350 },
  { date: "Sep 13", users: 3180 },
  { date: "Sep 14", users: 3400 },
];

const eventMixRows = [
  { rank: 1, event: "user_engagement", count: "404,353", users: "18,451" },
  { rank: 2, event: "screen_view", count: "396,300", users: "18,729" },
  { rank: 3, event: "login", count: "24,203", users: "13,070" },
  { rank: 4, event: "user_login", count: "24,084", users: "12,999" },
];

const selfServeRows = [
  {
    rank: 1,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "ALL_SERVICE_TYPES",
    interactions_digital: "12,840",
    interactions_non_digital: "168,210",
    digital_share: "7%",
  },
  {
    rank: 2,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "payment",
    interactions_digital: "4,210",
    interactions_non_digital: "38,920",
    digital_share: "10%",
  },
  {
    rank: 3,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "bill_view",
    interactions_digital: "3,105",
    interactions_non_digital: "41,880",
    digital_share: "7%",
  },
  {
    rank: 4,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "meter_read",
    interactions_digital: "1,980",
    interactions_non_digital: "29,450",
    digital_share: "6%",
  },
  {
    rank: 5,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "move_in",
    interactions_digital: "890",
    interactions_non_digital: "11,240",
    digital_share: "7%",
  },
  {
    rank: 6,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "move_out",
    interactions_digital: "720",
    interactions_non_digital: "9,880",
    digital_share: "7%",
  },
  {
    rank: 7,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "concession",
    interactions_digital: "640",
    interactions_non_digital: "12,100",
    digital_share: "5%",
  },
  {
    rank: 8,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "plan_change",
    interactions_digital: "510",
    interactions_non_digital: "7,420",
    digital_share: "6%",
  },
  {
    rank: 9,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "hardship",
    interactions_digital: "385",
    interactions_non_digital: "8,960",
    digital_share: "4%",
  },
  {
    rank: 10,
    retailer_id: "first_energy",
    month_start_date: "2026-08-01",
    interaction_type: "complaint",
    interactions_digital: "400",
    interactions_non_digital: "8,360",
    digital_share: "5%",
  },
];

type ScreenId = "findings" | "engagement";

/* ── Shared helpers ─────────────────────────────────────────────────────── */

function KpiCard({
  theme,
  title,
  value,
  icon,
  description,
  tone = "neutral",
}: {
  theme: BrandTheme;
  title: string;
  value: string;
  icon: string;
  description?: string;
  tone?: ToneKey;
}) {
  const t = theme.tones[tone];
  return (
    <Card className={cn(theme.card, "transition hover:-translate-y-0.5")}>
      <CardContent className="p-5 pt-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm font-medium", theme.muted)}>{title}</p>
            <p
              className={cn(
                "mt-2 text-5xl font-semibold tracking-tight sm:text-6xl",
                t.value
              )}
            >
              {value}
            </p>
            {description && (
              <p className={cn("mt-2 text-sm", theme.muted)}>{description}</p>
            )}
          </div>
          <span
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center border",
              theme.id === "first-energy" ? "rounded-full" : "rounded-lg",
              t.iconBg,
              t.icon
            )}
          >
            <Icon name={icon} size={22} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function VerdictChip({ theme, verdict }: { theme: BrandTheme; verdict: string }) {
  const tone: ToneKey =
    verdict === "MISMATCH"
      ? "danger"
      : verdict === "NEEDS_REVIEW"
        ? "warn"
        : verdict === "MATCH"
          ? "success"
          : "neutral";
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase",
        theme.chipRadius,
        theme.tones[tone].chip
      )}
    >
      {verdict}
    </span>
  );
}

function SeverityChip({
  theme,
  severity,
}: {
  theme: BrandTheme;
  severity: string;
}) {
  if (severity === "major") {
    return (
      <span
        className={cn(
          "inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase",
          theme.chipRadius,
          theme.tones.danger.chip
        )}
      >
        major
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex border px-2 py-0.5 text-[10px] font-semibold uppercase",
        theme.chipRadius,
        theme.border,
        theme.tones.neutral.chip
      )}
    >
      {severity}
    </span>
  );
}

function TableFooter({ theme, label }: { theme: BrandTheme; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 border-t px-3 py-2 text-xs",
        theme.footerBg,
        theme.muted
      )}
    >
      <span>{label}</span>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Previous page">
        <Icon name="chevron_left" size={18} />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" aria-label="Next page">
        <Icon name="chevron_right" size={18} />
      </Button>
    </div>
  );
}

function ThemedTableHead({
  theme,
  children,
}: {
  theme: BrandTheme;
  children: React.ReactNode;
}) {
  return (
    <TableHead
      className={cn(
        "whitespace-nowrap px-4 text-xs font-medium",
        theme.tableHeaderBg,
        theme.tableHeaderText
      )}
    >
      {children}
    </TableHead>
  );
}

/* ── Screen 1: Findings Summary ─────────────────────────────────────────── */

function FindingsSummaryScreen({ theme }: { theme: BrandTheme }) {
  const pieData = useMemo(
    () => [
      { name: "MISMATCH", value: 60, color: theme.pie.mismatch },
      { name: "NEEDS_REVIEW", value: 20, color: theme.pie.needsReview },
      { name: "MATCH", value: 20, color: theme.pie.match },
    ],
    [theme]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard
          theme={theme}
          title="Record Count"
          value="5"
          icon="database"
          description="Total findings in scope"
          tone="neutral"
        />
        <KpiCard
          theme={theme}
          title="Actionable Records"
          value="3"
          icon="task_alt"
          description="Require follow-up"
          tone="warn"
        />
        <KpiCard
          theme={theme}
          title="Mismatch Records"
          value="3"
          icon="cancel"
          description="Date delta detected"
          tone="danger"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <Card className={theme.card}>
          <CardHeader>
            <CardTitle className={theme.text}>Filters</CardTitle>
            <CardDescription className={theme.muted}>
              Narrow findings by client, run, and verdict
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="Client" defaultValue="all">
                <option value="all">All clients</option>
                <option value="first-energy">First Energy</option>
                <option value="orion">Orion</option>
              </Select>
              <Select label="Run date" defaultValue="sep16">
                <option value="sep16">Sep 16, 2026</option>
                <option value="sep15">Sep 15, 2026</option>
                <option value="all">All dates</option>
              </Select>
              <Select label="Verdict" defaultValue="all">
                <option value="all">All verdicts</option>
                <option value="mismatch">MISMATCH</option>
                <option value="needs_review">NEEDS_REVIEW</option>
                <option value="match">MATCH</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className={theme.card}>
          <CardHeader>
            <CardTitle className={theme.text}>Verdicts</CardTitle>
            <CardDescription className={theme.muted}>
              Share of findings by outcome
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-[160px] w-[160px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={72}
                      innerRadius={36}
                      stroke="#fff"
                      strokeWidth={2}
                      paddingAngle={2}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Share"]}
                      contentStyle={{
                        borderRadius: theme.id === "first-energy" ? 999 : 8,
                        border: `1px solid ${theme.grid}`,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={theme.muted}>{item.name}</span>
                    <span className={cn("font-semibold", theme.text)}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.text}>Findings Summary</CardTitle>
          <CardDescription className={theme.muted}>
            Move-out date reconciliation across conversation audits
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table disableWrapper>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  {[
                    "#",
                    "run_date",
                    "conversation_key",
                    "verdict",
                    "severity",
                    "spoken_move_out_date",
                    "submitted_move_out_date",
                    "delta_days",
                    "account_number",
                  ].map((col) => (
                    <ThemedTableHead key={col} theme={theme}>
                      {col}
                    </ThemedTableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {findingsRows.map((row, i) => (
                  <TableRow
                    key={row.conversation_key}
                    className={cn(
                      theme.border,
                      theme.tableHover,
                      i % 2 === 1 ? theme.tableZebra : "bg-white"
                    )}
                  >
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>
                      {row.index}
                    </TableCell>
                    <TableCell className={cn("whitespace-nowrap px-4 py-3 text-sm", theme.text)}>
                      {row.run_date}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "max-w-[220px] truncate px-4 py-3 font-mono text-xs",
                        theme.muted
                      )}
                    >
                      {row.conversation_key}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <VerdictChip theme={theme} verdict={row.verdict} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <SeverityChip theme={theme} severity={row.severity} />
                    </TableCell>
                    <TableCell className={cn("whitespace-nowrap px-4 py-3 text-sm", theme.muted)}>
                      {row.spoken_move_out_date}
                    </TableCell>
                    <TableCell className={cn("whitespace-nowrap px-4 py-3 text-sm", theme.muted)}>
                      {row.submitted_move_out_date}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm font-medium", theme.text)}>
                      {row.delta_days}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>
                      {row.account_number}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TableFooter theme={theme} label="1 – 5 / 5" />
        </CardContent>
      </Card>

      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.text}>Evidence table</CardTitle>
          <CardDescription className={theme.muted}>
            Conversation excerpts linked to each finding
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table disableWrapper>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  <ThemedTableHead theme={theme}>#</ThemedTableHead>
                  <ThemedTableHead theme={theme}>conversation_key</ThemedTableHead>
                  <ThemedTableHead theme={theme}>evidence</ThemedTableHead>
                  <ThemedTableHead theme={theme}>agent_email</ThemedTableHead>
                  <ThemedTableHead theme={theme}>
                    <span className="inline-flex items-center gap-1">
                      account_number
                      <Icon name="arrow_downward" size={14} />
                    </span>
                  </ThemedTableHead>
                  <ThemedTableHead theme={theme}>genesys_conversation_id</ThemedTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {evidenceRows.map((row, i) => (
                  <TableRow
                    key={`${row.genesys_conversation_id}-${row.index}`}
                    className={cn(
                      "align-top",
                      theme.border,
                      theme.tableHover,
                      i % 2 === 1 ? theme.tableZebra : "bg-white"
                    )}
                  >
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>
                      {row.index}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "max-w-[180px] truncate px-4 py-3 font-mono text-xs",
                        theme.muted
                      )}
                      title={row.conversation_key}
                    >
                      {row.conversation_key}
                    </TableCell>
                    <TableCell className="min-w-[320px] max-w-[520px] px-4 py-3 sm:min-w-[420px]">
                      <div
                        className={cn(
                          "max-h-28 overflow-y-auto whitespace-pre-wrap rounded-md border px-3 py-2 text-sm leading-relaxed",
                          theme.border,
                          "bg-white/80",
                          theme.text
                        )}
                      >
                        {row.evidence}
                      </div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "max-w-[200px] truncate px-4 py-3 text-sm",
                        theme.muted
                      )}
                      title={row.agent_email}
                    >
                      {row.agent_email}
                    </TableCell>
                    <TableCell className={cn("whitespace-nowrap px-4 py-3 text-sm", theme.text)}>
                      {row.account_number}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "whitespace-nowrap px-4 py-3 font-mono text-xs",
                        theme.muted
                      )}
                    >
                      {row.genesys_conversation_id}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TableFooter theme={theme} label="1 – 5 / 5" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Screen 2: Engagement Metrics ───────────────────────────────────────── */

function EngagementMetricsScreen({ theme }: { theme: BrandTheme }) {
  return (
    <div className="space-y-6">
      <div className={cn("p-4", theme.mutedPanel)}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className={cn("text-sm font-semibold", theme.text)}>Engagement report</p>
            <p className={cn("mt-0.5 text-xs", theme.muted)}>
              Annex #1 demo · BigQuery self-serve mix
            </p>
          </div>
          <div className="w-full sm:w-56">
            <Select defaultValue="30d" aria-label="Select date range">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <H3 className={cn("mb-3 border-0 pb-0", theme.text)}>Key Engagement Metrics</H3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard theme={theme} title="Total users" value="19,379" icon="group" tone="neutral" />
          <KpiCard theme={theme} title="Active users" value="19,158" icon="person" tone="accent" />
          <KpiCard theme={theme} title="New users" value="4,995" icon="person_add" tone="accent" />
          <KpiCard
            theme={theme}
            title="New / returning"
            value="4"
            icon="swap_horiz"
            description="Ratio (rounded)"
            tone="warn"
          />
        </div>
      </div>

      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.text}>Daily active users</CardTitle>
          <CardDescription className={theme.muted}>Aug 20 – Sep 14</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
              <LineChart data={dailyActiveUsers} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: theme.axis, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[1500, 3500]}
                  tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`}
                  tick={{ fill: theme.axis, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  width={42}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: theme.id === "first-energy" ? 999 : 8,
                    border: `1px solid ${theme.grid}`,
                    fontSize: 12,
                  }}
                  formatter={(value) => [
                    typeof value === "number" ? value.toLocaleString() : value,
                    "Active users",
                  ]}
                />
                <Legend verticalAlign="top" height={28} formatter={() => "Active users"} />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Active users"
                  stroke={theme.chartPrimary}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: theme.chartActive }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.text}>Surface adoption — event mix</CardTitle>
          <CardDescription className={theme.muted}>Top events by volume and reach</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table disableWrapper>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  {["#", "Event name", "Event count", "Active users"].map((col, i) => (
                    <ThemedTableHead key={col} theme={theme}>
                      <span className="inline-flex items-center gap-1">
                        {col}
                        {i === 2 && <Icon name="arrow_downward" size={14} />}
                      </span>
                    </ThemedTableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventMixRows.map((row, i) => (
                  <TableRow
                    key={row.event}
                    className={cn(
                      theme.border,
                      theme.tableHover,
                      i % 2 === 1 ? theme.tableZebra : "bg-white"
                    )}
                  >
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>{row.rank}</TableCell>
                    <TableCell className={cn("px-4 py-3 font-mono text-sm", theme.text)}>
                      {row.event}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm font-medium", theme.text)}>
                      {row.count}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>{row.users}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TableFooter theme={theme} label="1 – 4 / 4" />
        </CardContent>
      </Card>

      <Card className={theme.card}>
        <CardHeader>
          <CardTitle className={theme.text}>Self-serve mix</CardTitle>
          <CardDescription className={theme.muted}>Annex #1 demo · BigQuery</CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <Table disableWrapper>
              <TableHeader>
                <TableRow className="border-0 hover:bg-transparent">
                  {[
                    "#",
                    "retailer_id",
                    "month_start_date",
                    "interaction_type",
                    "interactions_digital",
                    "interactions_non_digital",
                    "digital_share",
                  ].map((col) => (
                    <ThemedTableHead key={col} theme={theme}>
                      {col}
                    </ThemedTableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {selfServeRows.map((row, i) => (
                  <TableRow
                    key={`${row.interaction_type}-${row.rank}`}
                    className={cn(
                      theme.border,
                      theme.tableHover,
                      i % 2 === 1 ? theme.tableZebra : "bg-white"
                    )}
                  >
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>{row.rank}</TableCell>
                    <TableCell className={cn("px-4 py-3 font-mono text-sm", theme.text)}>
                      {row.retailer_id}
                    </TableCell>
                    <TableCell className={cn("whitespace-nowrap px-4 py-3 text-sm", theme.text)}>
                      {row.month_start_date}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 font-mono text-sm", theme.text)}>
                      {row.interaction_type}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>
                      {row.interactions_digital}
                    </TableCell>
                    <TableCell className={cn("px-4 py-3 text-sm", theme.text)}>
                      {row.interactions_non_digital}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "px-4 py-3 text-sm font-semibold",
                        theme.tones.accent.value
                      )}
                    >
                      {row.digital_share}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <TableFooter theme={theme} label="1 – 10 / 10" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          theme={theme}
          title="digital_share"
          value="7%"
          icon="pie_chart"
          description="Overall digital share"
          tone="warn"
        />
        <KpiCard
          theme={theme}
          title="Active users"
          value="19,158"
          icon="person"
          description="Period total"
          tone="accent"
        />
      </div>
    </div>
  );
}

/* ── Branded dashboard shell ────────────────────────────────────────────── */

/* ── Branded dashboard shell ────────────────────────────────────────────── */

const BRAND_OPTIONS: BrandId[] = ["adora", "first-energy", "tally-group"];

function BrandLogoMark({ theme, className }: { theme: BrandTheme; className?: string }) {
  if (!theme.logo) {
    return (
      <span className={cn("text-sm font-semibold", theme.text, className)}>
        {theme.label}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Image
        src={theme.logo.src}
        alt={theme.logo.alt}
        width={
          theme.id === "first-energy" ? 140 : theme.id === "tally-group" ? 160 : 135
        }
        height={theme.id === "first-energy" ? 68 : 57}
        className={cn(
          "w-auto",
          theme.id === "first-energy"
            ? "h-10"
            : theme.id === "tally-group"
              ? "h-7"
              : "h-8"
        )}
        priority
      />
      {theme.logo.mark && (
        <span className={cn("text-sm font-semibold", theme.text)}>
          {theme.logo.mark}
        </span>
      )}
    </span>
  );
}

function BrandDashboard({
  theme,
  brand,
  onBrandChange,
}: {
  theme: BrandTheme;
  brand: BrandId;
  onBrandChange: (brand: BrandId) => void;
}) {
  const [screen, setScreen] = useState<ScreenId>("findings");

  return (
    <div className={cn("min-h-screen", theme.pageBg)}>
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DropdownMenu key={brand}>
            <DropdownMenuTrigger
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                theme.id === "adora" && "focus-visible:ring-emerald-600",
                theme.id === "first-energy" && "focus-visible:ring-[#1A4796]",
                theme.id === "tally-group" && "focus-visible:ring-[#2C365D]"
              )}
              aria-label={`Brand: ${theme.label}. Change brand`}
            >
              <BrandLogoMark theme={theme} />
              <Icon
                name="expand_more"
                size={22}
                className={cn("shrink-0 opacity-70", theme.muted)}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[14rem] p-1.5">
              {BRAND_OPTIONS.map((id) => {
                const option = THEMES[id];
                const selected = id === brand;
                return (
                  <DropdownMenuItem
                    key={id}
                    onClick={() => onBrandChange(id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2",
                      selected && "bg-gray-100"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      {option.logo ? (
                        <Image
                          src={option.logo.src}
                          alt=""
                          width={72}
                          height={28}
                          className="h-6 w-auto"
                        />
                      ) : null}
                      <span className="text-sm font-medium text-gray-900">
                        {option.label}
                      </span>
                    </span>
                    {selected && (
                      <Icon name="check" size={18} className="shrink-0 text-gray-700" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            className={cn(
              "inline-flex border bg-white p-0.5",
              theme.cardRadius,
              theme.border
            )}
          >
            <button
              type="button"
              onClick={() => setScreen("findings")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                theme.id === "first-energy" ? "rounded-full" : "rounded-md",
                screen === "findings" ? theme.toggleActive : theme.toggleIdle
              )}
            >
              Findings Summary
            </button>
            <button
              type="button"
              onClick={() => setScreen("engagement")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium transition-colors",
                theme.id === "first-energy" ? "rounded-full" : "rounded-md",
                screen === "engagement" ? theme.toggleActive : theme.toggleIdle
              )}
            >
              Engagement Metrics
            </button>
          </div>
        </div>

        {screen === "findings" ? (
          <FindingsSummaryScreen theme={theme} />
        ) : (
          <EngagementMetricsScreen theme={theme} />
        )}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function LookerStudioDashPage() {
  const [brand, setBrand] = useState<BrandId>("adora");
  const theme = THEMES[brand];

  return (
    <BrandDashboard
      theme={theme}
      brand={brand}
      onBrandChange={setBrand}
    />
  );
}
