"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/Card/Card";
import Select from "@/components/Select/Select";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import { Icon } from "@/components/ui/icon";
import {
  ACCENT,
  ACCOUNTS_HREF,
  PURPLE_DEEP,
  PURPLE_LIGHT,
  PURPLE_MID,
  NEUTRAL,
  ICON_SM,
  ICON_MD,
  ICON_LG,
  SecPortalShell,
  chart,
  colours,
  money,
} from "./components/SecPortalShell";

const DASH_NEUTRAL = chart.seriesDash[4];

// ── Formatting (Australian English and formats throughout) ──────────────────

const energy = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 });

const formatKwh = (value: number | undefined) =>
  `${whole.format(value ?? 0)} kWh`;
const formatMoney = (value: number | undefined) => money.format(value ?? 0);
const formatShare = (value: number | undefined) => `${value ?? 0}%`;
const inMillions = (value: number) => `${Math.round(value / 1_000_000)}M`;

// ── Mock data ───────────────────────────────────────────────────────────────

const CUSTOMERS = [
  "MST - Department of Government Services",
  "MST - Department of Education",
  "MST - Department of Health",
  "MST - Victoria Police",
];

const ACCOUNTS = ["100001", "100002", "100003", "100004"];

const KPIS = [
  {
    label: "Amount due on 4 Sep 2026",
    value: money.format(31562307.28),
    icon: "account_balance_wallet",
  },
  {
    label: "Last bill",
    value: money.format(21054497.06),
    delta: "4% higher than last month",
    icon: "receipt_long",
  },
  {
    label: "Projected consumption",
    value: `${energy.format(1650234.43)} MWh`,
    icon: "bolt",
  },
];

const SPOT_PRICES = [
  { region: "NSW", price: 52.21 },
  { region: "QLD", price: -11.3 },
  { region: "SA", price: 84.02 },
  { region: "VIC", price: 83.71, home: true },
];

const SPOT_PRICE_TIME = "1:30:07 pm AEST";

const MONTHLY_CONSUMPTION = [
  { month: "Aug-25", offPeak: 55, peak: 60, generation: 1.45 },
  { month: "Sep-25", offPeak: 50, peak: 58, generation: 1.62 },
  { month: "Oct-25", offPeak: 52, peak: 60, generation: 1.85 },
  { month: "Nov-25", offPeak: 55, peak: 63, generation: 2.15 },
  { month: "Dec-25", offPeak: 60, peak: 73, generation: 2.45 },
  { month: "Jan-26", offPeak: 62, peak: 76, generation: 2.68 },
  { month: "Feb-26", offPeak: 56, peak: 65, generation: 2.3 },
  { month: "Mar-26", offPeak: 55, peak: 64, generation: 1.95 },
  { month: "Apr-26", offPeak: 52, peak: 60, generation: 1.42 },
  { month: "May-26", offPeak: 57, peak: 67, generation: 1.05 },
  { month: "Jun-26", offPeak: 56, peak: 64, generation: 0.72 },
  { month: "Jul-26", offPeak: 60, peak: 71, generation: 1.05 },
  { month: "Aug-26", offPeak: 26, peak: 29, generation: 0.58 },
].map((d) => ({
  ...d,
  offPeak: d.offPeak * 1_000_000,
  peak: d.peak * 1_000_000,
  generation: d.generation * 1_000_000,
}));

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Daily read window: 1 Jul 2026 through 13 Aug 2026. Shaped, not random, so
 *  server and client render identically. */
const DAILY_CONSUMPTION = Array.from({ length: 44 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 6, 1 + i));
  const weekday = date.getUTCDay();
  const isWeekend = weekday === 0 || weekday === 6;
  const wave = Math.sin(i / 1.7) * 0.4 + Math.sin(i / 5.3) * 0.26;
  return {
    day: `${String(date.getUTCDate()).padStart(2, "0")} ${
      MONTH_LABELS[date.getUTCMonth()]
    }`,
    consumption: Math.round((4.4 + wave + (isWeekend ? -0.6 : 0)) * 1_000_000),
    lastYear: Math.round((4.6 + Math.sin((i + 2) / 2.1) * 0.36) * 1_000_000),
  };
});

const MONTHLY_BILLED = [
  { month: "Aug-25", billed: 18.4 },
  { month: "Sep-25", billed: 17.1 },
  { month: "Oct-25", billed: 18.9 },
  { month: "Nov-25", billed: 20.2 },
  { month: "Dec-25", billed: 24.6 },
  { month: "Jan-26", billed: 25.3 },
  { month: "Feb-26", billed: 21.0 },
  { month: "Mar-26", billed: 20.4 },
  { month: "Apr-26", billed: 18.2 },
  { month: "May-26", billed: 21.8 },
  { month: "Jun-26", billed: 20.6 },
  { month: "Jul-26", billed: 23.4 },
  { month: "Aug-26", billed: 9.8 },
].map((d) => ({ ...d, billed: d.billed * 1_000_000 }));

/** Shares sum to 100, so the slice label is the value itself. */
const COST_BREAKDOWN = [
  { name: "Energy", value: 35.9 },
  { name: "Network", value: 28.4 },
  { name: "Environmental", value: 15.2 },
  { name: "Market charges", value: 12.3 },
  { name: "Retail", value: 8.2 },
].map((slice) => ({ ...slice, label: `${slice.value}%` }));

const COST_COLOURS = [ACCENT, PURPLE_MID, PURPLE_DEEP, PURPLE_LIGHT, NEUTRAL];

// ── State marks ─────────────────────────────────────────────────────────────

/** Coastline traced from the mainland's cardinal capes, plus Tasmania. Drawn
 *  once and marked per region, because individual state silhouettes are not
 *  legible at this size. */
const AUSTRALIA_OUTLINE =
  "M22.3 2.3 21.5 5.5 21 7.4 19.3 6.5 18.6 4.6 18.1 3.3 16.5 4.6 14.2 3.6 13 5 12.2 5.5 10 6.6 8.1 7.8 5 9.5 2.4 10.8 3.2 13.5 3.6 18.3 3.1 20.1 5.5 20.3 8 19.8 11 18.6 13.6 18 16 18.6 17.4 20.5 18.3 18.8 19.6 20.5 21.5 21.8 23 23.4 25 23.6 27.5 22.4 28.4 19.7 29.9 14.9 29.3 13 27 10.1 24.6 6.9Z" +
  "M24.5 25.5 26.3 25.3 26 27.4 24.8 27.1Z";

/** Region centroids on the same grid. */
const REGION_MARKS: Record<string, { x: number; y: number }> = {
  NSW: { x: 25.3, y: 18.2 },
  QLD: { x: 23.6, y: 11.1 },
  SA: { x: 17.5, y: 16.6 },
  VIC: { x: 23.3, y: 21.4 },
};

function RegionMark({ region, colour }: { region: string; colour: string }) {
  const mark = REGION_MARKS[region];
  if (!mark) return null;
  return (
    <svg
      viewBox="0 0 32 29"
      width={42}
      height={38}
      className="shrink-0"
      aria-hidden="true"
    >
      <path d={AUSTRALIA_OUTLINE} fill="var(--color-sec-gray-300)" />
      <circle
        cx={mark.x}
        cy={mark.y}
        r={3.2}
        fill={colour}
        stroke="var(--color-sec-gray-25)"
        strokeWidth={1}
      />
    </svg>
  );
}

// ── Chart chrome ────────────────────────────────────────────────────────────

const tooltipStyle: React.CSSProperties = {
  borderRadius: "var(--tally-radius-md)",
  border: `1px solid ${chart.grid}`,
  fontSize: "var(--tally-font-size-sm)",
  color: colours.text,
  boxShadow: "0 4px 12px rgb(28 32 36 / 0.08)",
};

const axisTick = { fill: chart.axis, fontSize: 10 };

interface LegendItem {
  label: string;
  colour: string;
  /** Line series carry their dash pattern so colour isn't the only cue. */
  dash?: string;
}

/** Hand-built legend: Recharts' own colours its labels to match the series,
 *  which fails contrast on the lighter tints. */
function ChartLegend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="mt-density-sm flex flex-wrap items-center justify-center gap-x-density-lg gap-y-density-xs">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-density-sm text-density-xs text-sec-gray-600"
        >
          <svg width="16" height="10" aria-hidden="true">
            {item.dash ? (
              <line
                x1="0"
                y1="5"
                x2="16"
                y2="5"
                stroke={item.colour}
                strokeWidth="2"
                strokeDasharray={item.dash === "0" ? undefined : item.dash}
              />
            ) : (
              <rect width="10" height="10" rx="2" fill={item.colour} />
            )}
          </svg>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Chart panel with the portal's standard affordances: an info hint and an
 * expand control that reuses the chart in a larger dialog.
 */
function ChartCard({
  title,
  info,
  legend,
  children,
}: {
  title: string;
  info: string;
  legend: LegendItem[];
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(false);

  const controlClass =
    "flex h-9 w-9 items-center justify-center rounded-density-md text-sec-gray-600 transition-colors hover:bg-sec-purple-50 hover:text-sec-purple-950";

  return (
    <>
      <Card className="flex flex-col border-sec-gray-200 bg-white">
        <div className="flex items-start justify-between gap-density-md px-density-xl pt-density-md">
          <button
            type="button"
            title={info}
            aria-label={`About ${title}`}
            className={controlClass}
          >
            <Icon name="info" size={ICON_MD} />
          </button>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label={`Expand ${title}`}
            className={controlClass}
          >
            <Icon name="open_in_full" size={ICON_MD} />
          </button>
        </div>
        <CardContent className="pt-0">
          <h2 className="mb-density-md text-density-xl font-medium text-sec-purple-950">
            {title}
          </h2>
          <div className="h-[210px] w-full">{children}</div>
          <ChartLegend items={legend} />
        </CardContent>
      </Card>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-[min(1200px,92vw)] rounded-density-lg border-sec-gray-200">
          <DialogHeader>
            <DialogTitle className="text-sec-purple-950">{title}</DialogTitle>
          </DialogHeader>
          <div className="h-[62vh] w-full">{children}</div>
          <ChartLegend items={legend} />
          <DialogClose aria-label="Close">
            <Icon name="close" size={ICON_LG} className="text-sec-gray-600" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── Stat tile ───────────────────────────────────────────────────────────────

/**
 * Two card variants only: tinted for the figures to read first, hairline for
 * everything else. Never both. The icon chip sits on white so the orange
 * clears 3:1 against its own background.
 *
 * The `pt-density-xl` is not redundant next to `p-density-xl`: CardContent
 * ships `pt-0` for the header case, and tailwind-merge can't collapse it
 * against a custom density value, so the top padding must be restated.
 */
function StatTile({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: string;
}) {
  return (
    <Card className="flex flex-col border-0 bg-sec-purple-50">
      <CardContent className="flex flex-1 flex-col justify-center p-density-xl pt-density-xl">
        <div className="flex items-center justify-between gap-density-sm">
          <p className="truncate text-density-sm leading-none text-sec-purple-600">
            {label}
          </p>
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-density-md border border-sec-orange-300 bg-white">
            <Icon name={icon} size={ICON_MD} className="text-sec-orange-600" />
          </span>
        </div>
        <p className="mt-density-md text-density-4xl font-semibold leading-none tracking-tight tabular-nums text-sec-purple-950">
          {value}
        </p>
        {/* Cards without a delta still reserve its line, so the values stay on
            a common baseline across the row. */}
        {delta ? (
          <p className="mt-density-sm text-density-xs leading-none text-sec-purple-600">
            <span aria-hidden="true">↑</span> {delta}
          </p>
        ) : (
          <div aria-hidden="true" className="mt-density-sm h-[1em] text-density-xs" />
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SecVictoriaCiPortalPage() {
  const [customer, setCustomer] = React.useState(CUSTOMERS[0]);
  const [account, setAccount] = React.useState(ACCOUNTS[0]);

  const contextButton =
    "flex h-11 w-11 items-center justify-center rounded-density-md text-sec-gray-600 transition-colors hover:bg-sec-purple-50 hover:text-sec-purple-950";

  return (
    <SecPortalShell activeNavId="home">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm">
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sec-gray-600">Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Account context bar */}
      <div className="mb-density-lg flex flex-wrap items-end gap-density-lg">
        <div className="w-full max-w-[320px]">
          <Select
            label="Select customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="h-11 rounded-density-md border-sec-gray-300"
          >
            {CUSTOMERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        <div className="w-full max-w-[280px]">
          <Select
            label="Select account"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="h-11 rounded-density-md border-sec-gray-300"
          >
            {ACCOUNTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        </div>

        <Link
          href={ACCOUNTS_HREF}
          className="inline-flex min-h-11 items-center justify-center px-5 text-density-base text-white"
          style={{
            backgroundColor: "var(--color-sec-purple-950)",
            borderRadius: "9999px",
          }}
        >
          View account
        </Link>

        <div className="ml-auto flex items-center gap-density-xs">
          <button
            type="button"
            aria-label="More actions"
            className={contextButton}
          >
            <Icon name="more_vert" size={ICON_LG} />
          </button>
          <button
            type="button"
            aria-label="Add account"
            className={`${contextButton} text-sec-orange-600 hover:text-sec-orange-600`}
          >
            <Icon name="add_circle" size={ICON_LG} />
          </button>
          <button
            type="button"
            aria-label="About this page"
            className={contextButton}
          >
            <Icon name="info" size={ICON_LG} />
          </button>
        </div>
      </div>

            {/* Billing summary — tinted, because these are read first */}
            <div className="mb-density-lg grid grid-cols-1 gap-density-lg md:grid-cols-3">
              {KPIS.map((kpi) => (
                <StatTile key={kpi.label} {...kpi} />
              ))}
            </div>

            {/* Regional spot prices — one bar, divided by space */}
            <Card className="mb-density-lg border-sec-gray-200 bg-white">
              <CardContent className="p-density-xl pt-density-xl">
                <div className="mb-density-md flex flex-wrap items-center justify-between gap-density-md">
                  <h2 className="text-density-base font-medium text-sec-purple-950">
                    Spot price $/MWh
                  </h2>
                  <p className="text-density-sm text-sec-gray-600">
                    Updated {SPOT_PRICE_TIME}
                  </p>
                </div>

                <ul className="grid grid-cols-2 gap-density-lg lg:grid-cols-4">
                  {SPOT_PRICES.map((region) => {
                    const negative = region.price < 0;
                    const rule = negative
                      ? colours.danger
                      : region.home
                        ? colours.accent
                        : colours.primary;
                    return (
                      <li
                        key={region.region}
                        className="flex items-center gap-density-md"
                      >
                        <span
                          className="h-10 w-[3px] shrink-0 rounded-full"
                          style={{ backgroundColor: rule }}
                        />
                        <RegionMark region={region.region} colour={rule} />
                        <div className="min-w-0">
                          <p className="flex items-center gap-density-xs text-density-sm text-sec-gray-600">
                            {region.region}
                            {region.home && (
                              <>
                                <span aria-hidden="true">·</span>
                                <Icon
                                  name="home"
                                  size={ICON_SM}
                                  className="text-sec-orange-600"
                                />
                                <span className="text-sec-purple-600">home</span>
                              </>
                            )}
                          </p>
                          <p
                            className="text-density-3xl font-semibold leading-none tracking-tight tabular-nums"
                            style={{
                              color: negative
                                ? colours.danger
                                : colours.text,
                            }}
                          >
                            {money.format(region.price)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-density-lg pb-density-xl xl:grid-cols-2">
              <ChartCard
                title="Monthly consumption"
                info="Peak and off-peak consumption by month, with on-site generation on the right axis."
                legend={[
                  { label: "Off-peak", colour: PURPLE_LIGHT },
                  { label: "Peak", colour: ACCENT },
                  { label: "Generation", colour: PURPLE_DEEP, dash: "0" },
                ]}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={MONTHLY_CONSUMPTION}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={axisTick}
                      axisLine={{ stroke: chart.grid }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={48}
                      interval={0}
                    />
                    <YAxis
                      yAxisId="left"
                      tick={axisTick}
                      tickFormatter={inMillions}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: chart.axis, fontSize: 10 },
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={axisTick}
                      tickFormatter={inMillions}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      label={{
                        value: "Generation",
                        angle: 90,
                        position: "insideRight",
                        style: { fill: chart.axis, fontSize: 10 },
                      }}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={formatKwh} />
                    <Bar
                      isAnimationActive={false}
                      yAxisId="left"
                      dataKey="offPeak"
                      name="Off-peak"
                      stackId="consumption"
                      fill={PURPLE_LIGHT}
                      barSize={22}
                    />
                    <Bar
                      isAnimationActive={false}
                      yAxisId="left"
                      dataKey="peak"
                      name="Peak"
                      stackId="consumption"
                      fill={ACCENT}
                      barSize={22}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      isAnimationActive={false}
                      yAxisId="right"
                      type="linear"
                      dataKey="generation"
                      name="Generation"
                      stroke={PURPLE_DEEP}
                      strokeWidth={2}
                      dot={{ r: 2.5, fill: PURPLE_DEEP }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Daily consumption"
                info="Daily consumption for the current read window, against the same period last year."
                legend={[
                  { label: "What you used", colour: ACCENT },
                  { label: "Last year", colour: NEUTRAL, dash: DASH_NEUTRAL },
                ]}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={DAILY_CONSUMPTION}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={axisTick}
                      axisLine={{ stroke: chart.grid }}
                      tickLine={false}
                      angle={-90}
                      textAnchor="end"
                      height={48}
                      interval={1}
                    />
                    <YAxis
                      tick={axisTick}
                      tickFormatter={inMillions}
                      axisLine={false}
                      tickLine={false}
                      width={44}
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: chart.axis, fontSize: 10 },
                      }}
                    />
                    <Tooltip contentStyle={tooltipStyle} formatter={formatKwh} />
                    <Bar
                      isAnimationActive={false}
                      dataKey="consumption"
                      name="What you used"
                      fill={ACCENT}
                      barSize={9}
                      radius={[2, 2, 0, 0]}
                    />
                    <Line
                      isAnimationActive={false}
                      type="linear"
                      dataKey="lastYear"
                      name="Last year"
                      stroke={NEUTRAL}
                      strokeWidth={1.5}
                      strokeDasharray={DASH_NEUTRAL}
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Monthly billed"
                info="Total invoiced by billing month."
                legend={[{ label: "Billed", colour: ACCENT }]}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={MONTHLY_BILLED}
                    margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid stroke={chart.grid} vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={axisTick}
                      axisLine={{ stroke: chart.grid }}
                      tickLine={false}
                      angle={-45}
                      textAnchor="end"
                      height={48}
                      interval={0}
                    />
                    <YAxis
                      tick={axisTick}
                      tickFormatter={inMillions}
                      axisLine={false}
                      tickLine={false}
                      width={52}
                      label={{
                        value: "AUD",
                        angle: -90,
                        position: "insideLeft",
                        style: { fill: chart.axis, fontSize: 10 },
                      }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={formatMoney}
                    />
                    <Bar
                      isAnimationActive={false}
                      dataKey="billed"
                      name="Billed"
                      fill={ACCENT}
                      barSize={22}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard
                title="Cost breakdown"
                info="Share of the last invoice by charge category."
                legend={COST_BREAKDOWN.map((slice, index) => ({
                  label: slice.name,
                  colour: COST_COLOURS[index],
                }))}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={COST_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      innerRadius={44}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={1}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {COST_BREAKDOWN.map((slice, index) => (
                        <Cell key={slice.name} fill={COST_COLOURS[index]} />
                      ))}
                      <LabelList
                        dataKey="label"
                        position="outside"
                        offset={12}
                        fill={chart.axis}
                        fontSize={11}
                      />
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={formatShare}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
    </SecPortalShell>
  );
}
