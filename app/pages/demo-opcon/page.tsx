"use client";

import React, { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/Card/Card";
import Progress from "@/components/Progress/Progress";
import Select from "@/components/Select/Select";
import { Tabs, TabsList, TabsTrigger } from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/* ========== Glass surfaces (matches Glass Vision Demo V2.2) ========== */
const PANE_LIGHT = "bg-gray-100";
const PANE_DARK = "dark:bg-gray-900";
const GLASS_CARD_LIGHT =
  "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40";
const GLASS_CARD_DARK =
  "dark:bg-white/[0.08] dark:backdrop-blur-xl dark:border-white/[0.12] dark:shadow-none";

const HEADLINE_TABS_LIST =
  "h-auto w-full justify-start rounded-none border-b border-gray-200 bg-transparent p-0 shadow-none dark:border-white/10 dark:bg-transparent";
const HEADLINE_TAB_TRIGGER_SM =
  "-mb-px rounded-none border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-[13px] font-medium text-gray-500 shadow-none hover:bg-transparent hover:text-gray-800 data-[state=active]:border-[#2C365D] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#2C365D] data-[state=active]:shadow-none dark:text-slate-400 dark:hover:text-slate-200 dark:data-[state=active]:border-[#00D2A2] dark:data-[state=active]:bg-transparent dark:data-[state=active]:text-[#00D2A2]";

const CHART_TEAL = "#00D2A2";

const FILTERS = [
  { label: "State", options: ["All states", "NSW", "VIC", "QLD", "SA"] },
  { label: "Fuel", options: ["All fuels", "Electricity", "Gas"] },
  { label: "DB", options: ["All DBs", "Ausgrid", "CitiPower", "Energex"] },
  { label: "Work Package", options: ["All work packages", "Move in", "Transfer"] },
  { label: "Account Status", options: ["All", "Open", "Pending", "Closed"] },
];

const PIPELINE_ROWS = [
  { segment: "SA Gas", happyPath: 90.6, timeToSwitch: 6.1, intervention: 312, aged: 98 },
  { segment: "SA Elec", happyPath: 62.8, timeToSwitch: 10.2, intervention: 612, aged: 211 },
  { segment: "VIC Gas", happyPath: 96.4, timeToSwitch: 6.3, intervention: 145, aged: 62 },
  { segment: "VIC Elec", happyPath: 81.8, timeToSwitch: 7.4, intervention: 356, aged: 124 },
  { segment: "NSW Gas", happyPath: 92.8, timeToSwitch: 6.5, intervention: 198, aged: 71 },
  { segment: "NSW Elec", happyPath: 59.6, timeToSwitch: 11.3, intervention: 542, aged: 186 },
  { segment: "QLD Gas", happyPath: 87.0, timeToSwitch: 7.9, intervention: 201, aged: 68 },
  { segment: "QLD Elec", happyPath: 49.9, timeToSwitch: 12.8, intervention: 491, aged: 123 },
];

const SWITCH_DISTRIBUTION = [
  { range: "0 – 5 days", value: 32.5, label: "32.5%", fill: CHART_TEAL },
  { range: "6 – 10 days", value: 31.8, label: "31.8%", fill: CHART_TEAL },
  { range: "11 – 14 days", value: 23.0, label: "23.0%", fill: "#EAB308" },
  { range: ">14 days", value: 12.7, label: "12.7%", fill: "#C40000" },
];

const MOVEMENT_ROWS = [
  { icon: "add_circle", label: "New exceptions", value: "143", change: "+21", up: true },
  { icon: "check_circle", label: "Resolved today", value: "198", change: "+34", up: false },
  { icon: "swap_vert", label: "Net movement", value: "↓ 55", change: "−13", up: false },
  { icon: "description", label: "Total requires intervention", value: "2,057", change: "−55", up: false },
];

const WORK_QUEUES = [
  {
    id: "p1",
    title: "P1 – Immediate failure / blockage",
    total: "1,179",
    accent: "text-[#C40000] dark:text-red-400",
    action: "Open P1 Work Queue",
    rows: [
      { issue: "CR Rejected", accounts: "412", over14: "86", over30: "21", oldest: "43d" },
      { issue: "SO Failed", accounts: "287", over14: "49", over30: "8", oldest: "31d" },
      { issue: "Market Data Error", accounts: "480", over14: "72", over30: "17", oldest: "39d" },
    ],
  },
  {
    id: "p2",
    title: "P2 – Data / progression issue",
    total: "241",
    accent: "text-[#C53B00] dark:text-orange-400",
    action: "Open P2 Work Queue",
    rows: [
      { issue: "Invalid Meter Data", accounts: "126", over14: "35", over30: "7", oldest: "27d" },
      { issue: "Completed – Not Progressed", accounts: "115", over14: "44", over30: "11", oldest: "36d" },
    ],
  },
];

const AGED_ROWS = [
  { label: "14 – 30 days", accounts: "455" },
  { label: ">30 days", accounts: "182" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <h2 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">{children}</h2>
      <Icon name="info" size={15} className="text-gray-400 dark:text-slate-500" />
    </div>
  );
}

function CardHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100">{children}</h3>
      <Icon name="info" size={14} className="text-gray-400 dark:text-slate-500" />
    </div>
  );
}

type Stat = {
  value: string;
  caption: string;
  valueClass: string;
  statLabel?: string;
  delta?: { text: string; up: boolean };
};

function MetricStat({ stat }: { stat: Stat }) {
  return (
    <div className="min-w-0">
      {stat.statLabel && (
        <p className="text-xs text-gray-500 dark:text-slate-400">{stat.statLabel}</p>
      )}
      <div className="mt-1 flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold tabular-nums tracking-tight", stat.valueClass)}>
          {stat.value}
        </span>
        {stat.delta && (
          <span
            className={cn(
              "text-xs font-semibold",
              stat.delta.up ? "text-[#C40000] dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
            )}
          >
            {stat.delta.text}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">{stat.caption}</p>
    </div>
  );
}

function MetricCard({
  label,
  icon,
  iconClass,
  primary,
  secondary,
  className,
}: {
  label: string;
  icon: string;
  iconClass: string;
  primary: Stat;
  secondary?: Stat;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK, className)}>
      <CardContent className="flex items-start justify-between gap-3 p-5 pt-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">
            {label}
          </p>
          <div className={cn("mt-2", secondary && "grid grid-cols-2 gap-4")}>
            <MetricStat stat={primary} />
            {secondary && <MetricStat stat={secondary} />}
          </div>
        </div>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", iconClass)}>
          <Icon name={icon} size={20} filled />
        </span>
      </CardContent>
    </Card>
  );
}

export default function DemoOpConPage() {
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(FILTERS.map((filter) => [filter.label, filter.options[0]]))
  );
  const [pipelineView, setPipelineView] = useState("state");
  const [distributionMode, setDistributionMode] = useState("days");

  const resetFilters = () =>
    setFilterValues(Object.fromEntries(FILTERS.map((filter) => [filter.label, filter.options[0]])));

  return (
    <div
      className={cn("min-h-full", PANE_LIGHT, PANE_DARK)}
      style={{ "--tally-radius-lg": "24px" } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1600px] space-y-5 px-5 py-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
                      East Coast Transfers Pipeline
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                      Operational control · all eligible accounts
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                    <span>Last refreshed: 30 Jul 2026, 8:22 am</span>
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/70 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Refresh dashboard"
                    >
                      <Icon name="refresh" size={20} />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                  <CardContent className="p-4 pt-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
                      {FILTERS.map((filter) => (
                        <Select
                          key={filter.label}
                          label={filter.label}
                          value={filterValues[filter.label]}
                          onChange={(event) =>
                            setFilterValues((values) => ({ ...values, [filter.label]: event.target.value }))
                          }
                        >
                          {filter.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </Select>
                      ))}
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-auto inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white/70 px-4 text-sm font-medium text-[#2C365D] transition-colors hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
                      >
                        <Icon name="refresh" size={16} />
                        Reset filters
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Headline metrics */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  <MetricCard
                    className="sm:col-span-2"
                    label="Time to switch"
                    icon="schedule"
                    iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
                    primary={{
                      statLabel: "Median (days)",
                      value: "8.4",
                      caption: "vs previous 30 days",
                      valueClass: "text-emerald-600 dark:text-emerald-400",
                      delta: { text: "↓ 1.2", up: false },
                    }}
                    secondary={{
                      statLabel: "Completed within target",
                      value: "87.3%",
                      caption: "Target: ≤ 14 days",
                      valueClass: "text-emerald-600 dark:text-emerald-400",
                    }}
                  />
                  <MetricCard
                    label="Progressing on track"
                    icon="trending_up"
                    iconClass="bg-sky-50 text-[#0074C4] dark:bg-sky-500/15 dark:text-sky-300"
                    primary={{
                      value: "1,846",
                      caption: "Within expected timeframe",
                      valueClass: "text-[#0074C4] dark:text-sky-400",
                    }}
                  />
                  <MetricCard
                    label="Requires intervention"
                    icon="warning"
                    iconClass="bg-orange-50 text-[#C53B00] dark:bg-orange-500/15 dark:text-orange-300"
                    primary={{
                      value: "2,057",
                      caption: "143 new today vs yesterday",
                      valueClass: "text-[#C53B00] dark:text-orange-400",
                      delta: { text: "↑ 143", up: true },
                    }}
                  />
                  <MetricCard
                    label="Aged >14 days"
                    icon="history"
                    iconClass="bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
                    primary={{
                      value: "637",
                      caption: "182 accounts over 30 days",
                      valueClass: "text-violet-600 dark:text-violet-400",
                    }}
                  />
                </div>

                {/* Operational work queue */}
                <div className="space-y-3">
                  <SectionHeading>Operational Work Queue</SectionHeading>
                  <div className="grid gap-4 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
                    {WORK_QUEUES.map((queue) => (
                      <Card key={queue.id} className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                        <CardContent className="p-5 pt-5">
                          <div className="flex items-start justify-between gap-3">
                            <CardHeading>{queue.title}</CardHeading>
                            <span className={cn("text-xl font-semibold tabular-nums", queue.accent)}>{queue.total}</span>
                          </div>
                          <div className="mt-4 grid grid-cols-[1fr_repeat(4,52px)] gap-2 border-b border-gray-200/80 pb-2 text-[11px] font-medium text-gray-500 dark:border-white/10 dark:text-slate-500">
                            <span>Issue type</span>
                            <span className="text-right">Accounts</span>
                            <span className="text-right">&gt;14 Days</span>
                            <span className="text-right">&gt;30 Days</span>
                            <span className="text-right">Oldest</span>
                          </div>
                          <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                            {queue.rows.map((row) => (
                              <div
                                key={row.issue}
                                className="grid grid-cols-[1fr_repeat(4,52px)] items-center gap-2 py-2.5 text-xs text-gray-700 dark:text-slate-300"
                              >
                                <span className="font-medium text-gray-900 dark:text-slate-100">{row.issue}</span>
                                <span className="text-right tabular-nums">{row.accounts}</span>
                                <span className="text-right tabular-nums">{row.over14}</span>
                                <span className="text-right tabular-nums">{row.over30}</span>
                                <span className="text-right tabular-nums">{row.oldest}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            type="button"
                            className={cn(
                              "mt-3 inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-80",
                              queue.accent
                            )}
                          >
                            <Icon name="description" size={15} />
                            {queue.action}
                          </button>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                      <CardContent className="p-5 pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <CardHeading>Aged &gt;14 days (any priority)</CardHeading>
                          <span className="text-xl font-semibold tabular-nums text-violet-600 dark:text-violet-400">637</span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-b border-gray-200/80 pb-2 text-[11px] font-medium text-gray-500 dark:border-white/10 dark:text-slate-500">
                          <span>Ageing</span>
                          <span>Accounts</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                          {AGED_ROWS.map((row) => (
                            <div
                              key={row.label}
                              className="flex items-center justify-between py-2.5 text-xs text-gray-700 dark:text-slate-300"
                            >
                              <span className="font-medium text-gray-900 dark:text-slate-100">{row.label}</span>
                              <span className="tabular-nums">{row.accounts}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0074C4] transition-opacity hover:opacity-80 dark:text-sky-400"
                        >
                          <Icon name="description" size={15} />
                          Open Aged Work Queue
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Pipeline health, movement, distribution */}
                <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr_1fr]">
                  <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <Tabs value={pipelineView} onValueChange={setPipelineView}>
                      <div className="px-5 pt-5">
                        <CardHeading>Pipeline Health</CardHeading>
                      </div>
                      <TabsList className={cn(HEADLINE_TABS_LIST, "mx-5 mt-3 flex w-auto gap-5")}>
                        <TabsTrigger value="state" className={HEADLINE_TAB_TRIGGER_SM}>By State</TabsTrigger>
                        <TabsTrigger value="fuel" className={HEADLINE_TAB_TRIGGER_SM}>By Fuel</TabsTrigger>
                        <TabsTrigger value="db" className={HEADLINE_TAB_TRIGGER_SM}>By DB</TabsTrigger>
                        <TabsTrigger value="package" className={HEADLINE_TAB_TRIGGER_SM}>By Work Package</TabsTrigger>
                      </TabsList>
                      <CardContent className="p-5 pt-4">
                        <div className="grid grid-cols-[76px_1fr_88px_66px_72px] gap-3 border-b border-gray-200/80 pb-2 text-[11px] font-medium text-gray-500 dark:border-white/10 dark:text-slate-500">
                          <span>State / Fuel</span>
                          <span>Happy path (on track + completed)</span>
                          <span className="text-right leading-tight">
                            Time to switch
                            <br />
                            Median (days)
                          </span>
                          <span className="text-right">Requires int.</span>
                          <span className="text-right leading-tight">Aged &gt;14 days</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
                          {PIPELINE_ROWS.map((row) => {
                            const atRisk = row.happyPath < 65;
                            return (
                              <div
                                key={row.segment}
                                className="grid grid-cols-[76px_1fr_88px_66px_72px] items-center gap-3 py-2.5 text-xs text-gray-700 dark:text-slate-300"
                              >
                                <span className="font-medium text-gray-900 dark:text-slate-100">{row.segment}</span>
                                <div className="flex items-center gap-2">
                                  <span className="w-11 shrink-0 tabular-nums text-gray-500 dark:text-slate-400">
                                    {row.happyPath}%
                                  </span>
                                  <Progress
                                    value={row.happyPath}
                                    aria-label={`${row.segment} happy path ${row.happyPath}%`}
                                    className={cn(
                                      "bg-gray-200/80 dark:bg-white/10",
                                      atRisk ? "[&>div]:bg-[#C40000]" : "[&>div]:bg-emerald-600"
                                    )}
                                  />
                                </div>
                                <span
                                  className={cn(
                                    "text-right tabular-nums",
                                    row.timeToSwitch > 10 && "font-semibold text-[#C40000] dark:text-red-400"
                                  )}
                                >
                                  {row.timeToSwitch}
                                </span>
                                <span
                                  className={cn(
                                    "text-right tabular-nums",
                                    row.intervention > 450 && "font-semibold text-[#C40000] dark:text-red-400"
                                  )}
                                >
                                  {row.intervention}
                                </span>
                                <span
                                  className={cn(
                                    "text-right tabular-nums",
                                    row.aged > 120 && "font-semibold text-[#C40000] dark:text-red-400"
                                  )}
                                >
                                  {row.aged}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-4 border-t border-gray-200/80 pt-3 text-xs text-gray-500 dark:border-white/10 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
                            On track / completed
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full bg-[#C40000]" />
                            Requires intervention
                          </span>
                        </div>
                      </CardContent>
                    </Tabs>
                  </Card>

                  <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <CardContent className="p-5 pt-5">
                      <CardHeading>Movement (Today)</CardHeading>
                      <div className="mt-4 space-y-2.5">
                        {MOVEMENT_ROWS.map((row) => (
                          <div
                            key={row.label}
                            className="flex items-center gap-3 rounded-xl bg-gray-50/80 p-3 dark:bg-white/[0.04]"
                          >
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-white/10 dark:text-slate-300">
                              <Icon name={row.icon} size={18} />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 dark:text-slate-400">{row.label}</p>
                              <p className="text-base font-semibold tabular-nums text-gray-900 dark:text-slate-100">
                                {row.value}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-semibold",
                                row.up ? "text-[#C40000] dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              {row.change}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="mt-3 flex w-full items-center justify-between text-xs font-semibold text-[#2C365D] transition-opacity hover:opacity-80 dark:text-[#00D2A2]"
                      >
                        View movement history
                        <Icon name="chevron_right" size={16} />
                      </button>
                    </CardContent>
                  </Card>

                  <Card className={cn("overflow-hidden border-0", GLASS_CARD_LIGHT, GLASS_CARD_DARK)}>
                    <Tabs value={distributionMode} onValueChange={setDistributionMode}>
                      <div className="px-5 pt-5">
                        <CardHeading>Time to Switch Distribution</CardHeading>
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                          Completed accounts by time to switch
                        </p>
                      </div>
                      <TabsList className={cn(HEADLINE_TABS_LIST, "mx-5 mt-3 flex w-auto gap-5")}>
                        <TabsTrigger value="days" className={HEADLINE_TAB_TRIGGER_SM}>Days</TabsTrigger>
                        <TabsTrigger value="share" className={HEADLINE_TAB_TRIGGER_SM}>% of Completed</TabsTrigger>
                      </TabsList>
                      <CardContent className="p-5 pt-4">
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SWITCH_DISTRIBUTION} margin={{ top: 18, right: 8, bottom: 0, left: -8 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.6} vertical={false} />
                              <XAxis
                                dataKey="range"
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                dy={6}
                              />
                              <YAxis
                                domain={[0, 40]}
                                ticks={[0, 20, 40]}
                                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                                axisLine={false}
                                tickLine={false}
                                width={44}
                                unit="%"
                              />
                              <Bar
                                dataKey="value"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={44}
                                animationDuration={800}
                                label={{
                                  position: "top",
                                  fontSize: 11,
                                  fill: "#6B7280",
                                  formatter: (value: React.ReactNode) => `${value}%`,
                                }}
                              >
                                {SWITCH_DISTRIBUTION.map((entry) => (
                                  <Cell key={entry.range} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-gray-200/80 pt-3 dark:border-white/10">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">Median (days)</p>
                            <p className="mt-0.5 text-xl font-semibold text-emerald-600 dark:text-emerald-400">8.4</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                              vs previous 30 days <span className="text-emerald-600 dark:text-emerald-400">↓ 1.2</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-slate-400">90th percentile (days)</p>
                            <p className="mt-0.5 text-xl font-semibold text-gray-900 dark:text-slate-100">17.6</p>
                            <p className="text-xs text-gray-500 dark:text-slate-500">
                              vs previous 30 days <span className="text-[#C40000] dark:text-red-400">↑ 1.8</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Tabs>
                  </Card>
                </div>

                <p className="flex items-center gap-1.5 pb-2 text-xs text-gray-500 dark:text-slate-400">
                  <Icon name="info" size={15} />
                  All counts are based on eligible accounts. Pending transactions within 14 days remain on the on-track path.
                </p>
      </div>
    </div>
  );
}
