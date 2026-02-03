"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { dataVisualizationColors } from "@/lib/tokens/colors";

const CHART_COLOR = dataVisualizationColors.dataASolid.hex;
const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { borderRadius: "8px", border: "1px solid #E5E7EB", background: "#fff" },
  cursor: { fill: "transparent" as const },
};

export type ElectricityUsageWidgetSize =
  | "x-small"
  | "small"
  | "medium"
  | "large"
  | "x-large";

export interface PeriodMetric {
  value: string;
  changePercent?: number;
  /** e.g. "44.214 USD" or "Compared to $1,340 last week" */
  comparisonText?: string;
}

export interface ElectricityUsageWidgetProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Widget size: x-small | small | medium | large | x-large */
  size?: ElectricityUsageWidgetSize;
  /** Widget title (e.g. "Electricity Usage") */
  title?: string;
  /** Primary metric – used in x-small, small (e.g. "$9,134") */
  value: string;
  /** Percentage change for primary – shown in green/red (e.g. 2.5) */
  changePercent?: number;
  /** Secondary label (e.g. "Avg. score $185,301") – small, x-small */
  secondaryLabel?: string;
  /** Optional icon next to title – "sparkle" (orange) for small */
  showIcon?: boolean;
  /** Weekly summary – large, x-large */
  weekly?: PeriodMetric;
  /** Monthly summary – medium, large, x-large */
  monthly?: PeriodMetric;
  /** Yearly summary – medium, large, x-large */
  yearly?: PeriodMetric;
  /** Dot chart data: [{ col, row, size }] – size 0–1 */
  dotData?: { col: number; row: number; size: number }[];
  /** Month labels for chart x-axis – large, x-large (e.g. ["Jun","Jul",…]) */
  chartMonths?: string[];
  /** Chart type for small/medium/large/x-large: area (default), pie, bubble, heatmap, funnel */
  chartType?: "area" | "pie" | "bubble" | "heatmap" | "funnel";
}

const DEFAULT_DOTS: { col: number; row: number; size: number }[] = [
  { col: 0, row: 0, size: 0.25 },
  { col: 1, row: 2, size: 0.2 },
  { col: 1, row: 0, size: 0.15 },
  { col: 2, row: 1, size: 0.35 },
  { col: 3, row: 0, size: 0.9 },
  { col: 3, row: 1, size: 0.5 },
  { col: 3, row: 2, size: 0.2 },
  { col: 4, row: 0, size: 0.3 },
  { col: 4, row: 1, size: 0.4 },
  { col: 5, row: 0, size: 0.55 },
  { col: 5, row: 2, size: 0.2 },
  { col: 6, row: 0, size: 0.45 },
  { col: 6, row: 1, size: 0.35 },
  { col: 7, row: 1, size: 0.4 },
  { col: 7, row: 2, size: 0.25 },
];

const DEFAULT_MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PIE_DATA = [
  { name: "A", value: 40 },
  { name: "B", value: 30 },
  { name: "C", value: 20 },
  { name: "D", value: 10 },
];

const BUBBLE_DATA = [
  { x: 20, y: 30, z: 50 },
  { x: 40, y: 50, z: 80 },
  { x: 60, y: 25, z: 40 },
  { x: 80, y: 45, z: 60 },
];

/** 3 rows x 6 cols, values 0–100 */
const HEATMAP_GRID = [
  [40, 65, 30, 80, 55, 70],
  [55, 45, 75, 50, 60, 35],
  [25, 70, 50, 45, 80, 65],
];

const FUNNEL_DATA = [
  { name: "Visit", value: 100 },
  { name: "Lead", value: 60 },
  { name: "Quote", value: 30 },
  { name: "Close", value: 10 },
];

/** Convert dot/bubble data to Recharts area chart data (name, value) per month/col. */
function dotDataToAreaData(
  dotData: { col: number; row: number; size: number }[],
  monthLabels: string[]
): { name: string; value: number }[] {
  const cols = monthLabels.length;
  const byCol = Array.from({ length: cols }, (_, i) =>
    dotData
      .filter((d) => d.col === i)
      .reduce((sum, d) => sum + d.size, 0)
  );
  const max = Math.max(...byCol, 0.01);
  return monthLabels.map((name, i) => ({
    name,
    value: Math.round((byCol[i] ?? 0) / max * 100),
  }));
}

type ChartType = "area" | "pie" | "bubble" | "heatmap" | "funnel";

function WidgetChartContent({
  chartType,
  areaData,
  months,
  compact,
  showAxes,
}: {
  chartType: ChartType;
  areaData: { name: string; value: number }[];
  months: string[];
  compact?: boolean;
  showAxes?: boolean;
}) {
  const margin = compact ? { top: 4, right: 4, bottom: 4, left: 4 } : { top: 8, right: 8, bottom: 8, left: 8 };
  const fontSize = compact ? 8 : 10;

  if (chartType === "pie") {
    return (
      <PieChart margin={margin}>
        <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(value: number, name: string) => [`${value}`, name]} />
        <Pie
          data={PIE_DATA}
          cx="50%"
          cy="50%"
          innerRadius={compact ? 20 : 40}
          outerRadius={compact ? 36 : 60}
          paddingAngle={1}
          dataKey="value"
        >
          {PIE_DATA.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    );
  }

  if (chartType === "bubble") {
    const bubbleRadiusRange = compact ? [4, 18] : [8, 32];
    return (
      <ScatterChart margin={margin}>
        <Tooltip
          {...CHART_TOOLTIP_STYLE}
          formatter={(value: number, _n: string, props: { payload?: { x?: number; y?: number; z?: number } }) => {
            const p = props.payload;
            return [p ? `x: ${p.x}, y: ${p.y}, z: ${p.z}` : value, "Point"];
          }}
        />
        <XAxis dataKey="x" type="number" domain={[0, 100]} hide />
        <YAxis dataKey="y" type="number" domain={[0, 60]} hide />
        <ZAxis dataKey="z" type="number" range={bubbleRadiusRange} />
        <Scatter name="Bubble" data={BUBBLE_DATA} fill={CHART_COLOR} />
      </ScatterChart>
    );
  }

  if (chartType === "heatmap") {
    return (
      <div className="flex h-full w-full flex-col gap-0.5 p-1">
        {HEATMAP_GRID.map((row, ri) => (
          <div key={ri} className="flex flex-1 gap-0.5">
            {row.map((val, ci) => (
              <div
                key={ci}
                className="flex-1 rounded-sm"
                style={{
                  backgroundColor: `rgba(44, 54, 93, ${val / 100})`,
                }}
                title={`${val}`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (chartType === "funnel") {
    const maxVal = Math.max(...FUNNEL_DATA.map((d) => d.value), 1);
    return (
      <div className="flex h-full w-full flex-col justify-center gap-0.5 px-1 py-2">
        {FUNNEL_DATA.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1">
            <div
              className="h-2 flex-shrink-0 rounded-full bg-[#2C365D]"
              style={{ width: `${(d.value / maxVal) * 100}%`, minWidth: 4 }}
            />
            {!compact && (
              <span className="truncate text-[10px] text-[#595767]">{d.name}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // area (default)
  return (
    <AreaChart data={areaData} margin={margin}>
      <Tooltip {...CHART_TOOLTIP_STYLE} formatter={(value: number, name: string) => [value, name ?? "Value"]} />
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
      <XAxis dataKey="name" hide={!showAxes} stroke="#6B7280" fontSize={fontSize} tickLine={false} />
      <YAxis hide={!showAxes} stroke="#6B7280" fontSize={fontSize} tickLine={false} width={showAxes ? 24 : 0} domain={[0, "auto"]} />
      <Area
        type="monotone"
        dataKey="value"
        stroke={CHART_COLOR}
        fill={CHART_COLOR}
        fillOpacity={0.4}
        strokeWidth={compact ? 1.5 : 2}
      />
    </AreaChart>
  );
}

function ChangeBadge({
  changePercent,
  className,
}: {
  changePercent: number;
  className?: string;
}) {
  const isPositive = changePercent >= 0;
  return (
    <span
      className={cn(
        "font-medium",
        isPositive ? "text-[#008000]" : "text-[#C40000]",
        className
      )}
    >
      {isPositive ? "↑" : "↓"}
      {Math.abs(changePercent)}%
    </span>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-4 shrink-0 text-[#F59E0B]", className)}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 0l1.5 4.5L14 6l-4.5 1.5L8 12l-1.5-4.5L2 6l4.5-1.5L8 0z" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3.5 shrink-0 text-[#008000]", className)}
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 0l7 7-7 7L0 7 7 0z" />
    </svg>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("size-3.5 shrink-0 text-[#EAB308]", className)}
      viewBox="0 0 14 14"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7 3.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM1.5 4.5l.8.5-.8.5-.2-.5.2-.5zm11 0l.2.5-.2.5-.8-.5.8-.5zM1.5 9.5l.2.5-.2.5-.8-.5.8-.5zm11 0l.8-.5.2.5-.2.5-.8-.5zM4.5 1.5l.5.8.5-.8-.5-.2-.5.2zm4 11l.5-.2.5.2-.5.8-.5-.8zm-5-5l-.8.5.8.5.2-.5-.2-.5zm11 0l-.2.5.2.5.8-.5-.8-.5zM4.5 12.5l-.5-.8-.5.8.5.2.5-.2zm4-11l-.5.2-.5-.2.5-.8.5.8z" />
    </svg>
  );
}

const ElectricityUsageWidget = React.forwardRef<
  HTMLDivElement,
  ElectricityUsageWidgetProps
>(
  (
    {
      size = "small",
      title = "Electricity Usage",
      value,
      changePercent,
      secondaryLabel = "Avg. score $185,301",
      showIcon = false,
      weekly,
      monthly,
      yearly,
      dotData = DEFAULT_DOTS,
      chartMonths = DEFAULT_MONTHS,
      chartType = "area",
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "overflow-hidden rounded-2xl border border-border bg-white rounded-tl-[1.25rem] rounded-br-[1.25rem]";

    // —— X-Small: title + value + change only, no chart
    if (size === "x-small") {
      return (
        <div
          ref={ref}
          className={cn(baseClasses, "inline-flex flex-col gap-0.5 px-4 py-3", className)}
          {...props}
        >
          <h3 className="text-sm font-semibold text-[#181B25]">{title}</h3>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold tracking-tight text-[#181B25]">
              {value}
            </span>
            {changePercent != null && (
              <ChangeBadge changePercent={changePercent} className="text-xs" />
            )}
          </div>
        </div>
      );
    }

    // —— Small: under 200px, grid 5×3 — left ~100px, right ~92px (total 192px), chart fits without cropping
    if (size === "small") {
      return (
        <div
          ref={ref}
          className={cn(
            baseClasses,
            "flex h-[132px] w-[192px] max-w-full flex-row overflow-hidden",
            className
          )}
          {...props}
        >
          <div className="flex w-[100px] shrink-0 flex-col justify-center gap-0.5 px-3 py-2.5">
            <h3 className="text-xs font-semibold leading-tight text-[#181B25]">
              {title}
            </h3>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold leading-tight tracking-tight text-[#181B25]">
                {value}
              </span>
              {changePercent != null && (
                <ChangeBadge changePercent={changePercent} className="text-xs" />
              )}
            </div>
            {secondaryLabel && (
              <p className="text-xs font-normal leading-tight text-[#595767]">
                {secondaryLabel}
              </p>
            )}
          </div>
          <div className="relative flex min-w-0 w-[92px] shrink-0 items-center justify-center py-2.5 pr-2 pl-1">
            <div className="h-[84px] w-full min-w-0 overflow-hidden outline-none [&_*]:outline-none [&_*]:focus:outline-none">
              {chartType === "heatmap" || chartType === "funnel" ? (
                <WidgetChartContent
                  chartType={chartType}
                  areaData={dotDataToAreaData(dotData, (chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 5))}
                  months={(chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 5)}
                  compact
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <WidgetChartContent
                    chartType={chartType}
                    areaData={dotDataToAreaData(dotData, (chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 5))}
                    months={(chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 5)}
                    compact
                  />
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      );
    }

    // —— Medium: under 200px, grid 8×3 — total 192px
    if (size === "medium") {
      return (
        <div
          ref={ref}
          className={cn(
            baseClasses,
            "flex h-[260px] w-[192px] max-w-full min-w-0 flex-col",
            className
          )}
          {...props}
        >
          <h3 className="shrink-0 px-3 pt-3 text-sm font-semibold text-[#181B25]">
            {title}
          </h3>
          <div className="shrink-0 px-3 pt-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold leading-tight tracking-tight text-[#181B25]">
                {value}
              </span>
              {changePercent != null && (
                <ChangeBadge changePercent={changePercent} className="text-xs" />
              )}
            </div>
            {secondaryLabel && (
              <p className="mt-0.5 text-xs font-normal leading-tight text-[#595767]">
                {secondaryLabel}
              </p>
            )}
          </div>
          <div className="min-h-0 flex-1 px-2 pb-2 pt-2">
            <div className="h-full w-full min-h-[80px] outline-none [&_*]:outline-none [&_*]:focus:outline-none">
              {chartType === "heatmap" || chartType === "funnel" ? (
                <WidgetChartContent
                  chartType={chartType}
                  areaData={dotDataToAreaData(dotData, (chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 8))}
                  months={(chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 8)}
                  showAxes
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <WidgetChartContent
                    chartType={chartType}
                    areaData={dotDataToAreaData(dotData, (chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 8))}
                    months={(chartMonths.length ? chartMonths : DEFAULT_MONTHS).slice(0, 8)}
                    showAxes
                  />
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      );
    }

    // —— Large & X-Large: title → 3 summary cards (Weekly, Monthly, Yearly) → chart with month labels
    const wk = weekly ?? {
      value: "$2,197",
      changePercent: 19.6,
      comparisonText: "Compared to $1,340 last week",
    };
    const mon =
      monthly ?? {
        value: "$8,903",
        changePercent: 1.9,
        comparisonText: "Compared to $5,441 last month",
      };
    const yr = yearly ?? {
      value: "$98,134",
      changePercent: 22,
      comparisonText: "Compared to $76,330 last year",
    };
    const months = chartMonths.length ? chartMonths : DEFAULT_MONTHS;
    const chartCols = months.length;
    // Scale dot data from small grid (8×3) to large grid (chartCols columns) for area data
    const scaledDotData = dotData.map((d) => ({
      ...d,
      col: Math.min(Math.round((d.col / 7) * (chartCols - 1)), chartCols - 1),
      row: d.row,
    }));
    const areaData = dotDataToAreaData(scaledDotData, months);

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          "flex min-w-0 flex-col",
          size === "x-large" ? "p-6" : "p-5",
          className
        )}
        {...props}
      >
        <h3
          className={cn(
            "font-semibold text-[#181B25]",
            size === "x-large" ? "text-xl" : "text-lg"
          )}
        >
          {title}
        </h3>

        <div
          className={cn(
            "grid grid-cols-3 border-b border-border pt-4",
            size === "x-large" ? "gap-5 pb-6" : "gap-4 pb-5"
          )}
        >
          <div>
            <div className={cn("font-medium text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>Weekly</div>
            <div
              className={cn(
                "font-bold tracking-tight text-[#181B25]",
                size === "x-large" ? "text-2xl" : "text-xl"
              )}
            >
              {wk.value}
            </div>
            {wk.changePercent != null && (
              <ChangeBadge changePercent={wk.changePercent} className="text-sm" />
            )}
            {wk.comparisonText && (
              <p className={cn("mt-0.5 text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>{wk.comparisonText}</p>
            )}
          </div>
          <div>
            <div className={cn("font-medium text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>Monthly</div>
            <div
              className={cn(
                "font-bold tracking-tight text-[#181B25]",
                size === "x-large" ? "text-2xl" : "text-xl"
              )}
            >
              {mon.value}
            </div>
            {mon.changePercent != null && (
              <ChangeBadge changePercent={mon.changePercent} className="text-sm" />
            )}
            {mon.comparisonText && (
              <p className={cn("mt-0.5 text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>{mon.comparisonText}</p>
            )}
          </div>
          <div>
            <div className={cn("font-medium text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>Yearly</div>
            <div
              className={cn(
                "font-bold tracking-tight text-[#181B25]",
                size === "x-large" ? "text-2xl" : "text-xl"
              )}
            >
              {yr.value}
            </div>
            {yr.changePercent != null && (
              <ChangeBadge changePercent={yr.changePercent} className="text-sm" />
            )}
            {yr.comparisonText && (
              <p className={cn("mt-0.5 text-[#595767]", size === "x-large" ? "text-base" : "text-sm")}>{yr.comparisonText}</p>
            )}
          </div>
        </div>

        <div className={cn("pt-4", size === "x-large" && "pt-5")}>
          <div
            className={cn(
              "w-full outline-none [&_*]:outline-none [&_*]:focus:outline-none",
              size === "x-large" ? "h-[180px]" : "h-[140px]"
            )}
          >
            {chartType === "heatmap" || chartType === "funnel" ? (
              <WidgetChartContent
                chartType={chartType}
                areaData={areaData}
                months={months}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <WidgetChartContent
                  chartType={chartType}
                  areaData={areaData}
                  months={months}
                />
              </ResponsiveContainer>
            )}
          </div>
          {chartType === "area" && (
            <div className={cn("mt-2 flex justify-between gap-1 text-[#595767]", size === "x-large" ? "text-sm" : "text-xs")}>
              {months.map((m, i) => (
                <span key={i} className="shrink-0">
                  {m}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ElectricityUsageWidget.displayName = "ElectricityUsageWidget";

export { ElectricityUsageWidget };
