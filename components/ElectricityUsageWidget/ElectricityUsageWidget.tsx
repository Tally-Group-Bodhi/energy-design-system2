"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DotChart } from "./DotChart";

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
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "overflow-hidden rounded-2xl border border-[#DEDEE1] bg-white shadow-sm rounded-tl-[1.25rem] rounded-br-[1.25rem]";

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
            <div className="h-[84px] w-[84px] shrink-0 overflow-hidden">
              <DotChart dotData={dotData} cols={5} rows={3} compact />
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
            <div className="h-full w-full min-h-[80px]">
              <DotChart dotData={dotData} cols={8} rows={3} />
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
    const chartRows = size === "x-large" ? 8 : 7;
    const chartCols = months.length;
    // Scale dot data from small grid (8×3) to large grid (chartCols × chartRows)
    const scaledDotData = dotData.map((d) => ({
      ...d,
      col: Math.min(Math.round((d.col / 7) * (chartCols - 1)), chartCols - 1),
      row: Math.min(Math.round((d.row / 2) * (chartRows - 1)), chartRows - 1),
    }));

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

        <div className="grid grid-cols-3 gap-4 border-b border-[#E5E5E7] pb-5 pt-4">
          <div>
            <div className="text-sm font-medium text-[#595767]">Weekly</div>
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
              <p className="mt-0.5 text-sm text-[#595767]">{wk.comparisonText}</p>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[#595767]">Monthly</div>
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
              <p className="mt-0.5 text-sm text-[#595767]">{mon.comparisonText}</p>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-[#595767]">Yearly</div>
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
              <p className="mt-0.5 text-sm text-[#595767]">{yr.comparisonText}</p>
            )}
          </div>
        </div>

        <div className="pt-4">
          <div
            className={cn(
              "w-full",
              size === "x-large" ? "h-[180px]" : "h-[140px]"
            )}
          >
            <DotChart
              dotData={scaledDotData}
              cols={chartCols}
              rows={chartRows}
              showGrid={true}
            />
          </div>
          <div className="mt-2 flex justify-between gap-1 text-xs text-[#595767]">
            {months.map((m, i) => (
              <span key={i} className="shrink-0">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

ElectricityUsageWidget.displayName = "ElectricityUsageWidget";

export { ElectricityUsageWidget };
