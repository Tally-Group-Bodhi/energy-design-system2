"use client";

import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";

export interface DotChartDataPoint {
  col: number;
  row: number;
  size: number;
}

export interface DotChartProps {
  /** Data: [{ col, row, size }] – size 0–1. Uses dummy data if empty. */
  dotData?: DotChartDataPoint[];
  cols?: number;
  rows?: number;
  className?: string;
  showGrid?: boolean;
  /** Tighter margins for small containers to avoid cropping */
  compact?: boolean;
}

/** Dummy/sample electricity usage data for the dot chart (usage intensity by period). */
export function getDummyDotData(cols: number, rows: number): DotChartDataPoint[] {
  const data: DotChartDataPoint[] = [];
  const midCol = Math.floor(cols / 2);
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const peak = c === midCol && r === 0;
      const size = peak ? 0.9 : 0.15 + (r === 0 ? 0.25 : 0.1) + (c % 3) * 0.15;
      data.push({ col: c, row: r, size: Math.min(1, size) });
    }
  }
  return data;
}

/** Default dummy data matching the original widget pattern (peak in middle-top). */
const DEFAULT_DUMMY_DATA: DotChartDataPoint[] = [
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

function DotChart({
  dotData = DEFAULT_DUMMY_DATA,
  cols = 8,
  rows = 3,
  className,
  showGrid = true,
  compact = false,
}: DotChartProps) {
  const chartData = dotData.map((d) => ({
    x: d.col + 0.5,
    y: d.row + 0.5,
    z: 4 + d.size * 14,
    fillOpacity: 0.4 + d.size * 0.6,
  }));

  const gridLines = showGrid ? Array.from({ length: cols + 1 }, (_, i) => i) : [];
  const margin = compact ? { top: 4, right: 4, bottom: 4, left: 4 } : { top: 8, right: 8, bottom: 8, left: 8 };

  return (
    <div className={cn("h-full w-full min-w-0 overflow-hidden", className)} aria-hidden>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ScatterChart margin={margin}>
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, cols]}
            hide
            allowDuplicatedCategory={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[rows, 0]}
            hide
          />
          {gridLines.map((x) => (
            <ReferenceLine key={x} x={x} stroke="#E5E5E7" strokeWidth={1} />
          ))}
          <Scatter
            data={chartData}
            dataKey="x"
            fill="#F59E0B"
            shape={({
              cx = 0,
              cy = 0,
              payload,
            }: {
              cx?: number;
              cy?: number;
              payload?: { z: number; fillOpacity: number };
            }) => {
              const r = payload?.z ?? 8;
              const opacity = payload?.fillOpacity ?? 0.7;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#F59E0B"
                  fillOpacity={opacity}
                />
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export { DotChart };
