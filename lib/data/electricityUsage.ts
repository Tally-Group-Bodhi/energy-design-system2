/**
 * Electricity usage data from electricity_usage_6months.csv
 * Parses CSV and computes widget-ready metrics and dot chart data.
 */

export interface ElectricityUsageRow {
  date: string;
  usage_kwh: number;
  cost_aud: number;
  peak_day: boolean;
  day_of_week: string;
  season: string;
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseElectricityCSV(text: string): ElectricityUsageRow[] {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const rows: ElectricityUsageRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length < 6) continue;
    const [date, usage_kwh, cost_aud, peak_day, day_of_week, season] = parts;
    rows.push({
      date: date.trim(),
      usage_kwh: parseFloat(usage_kwh) || 0,
      cost_aud: parseFloat(cost_aud) || 0,
      peak_day: peak_day.trim().toLowerCase() === "true",
      day_of_week: day_of_week.trim(),
      season: season.trim(),
    });
  }
  return rows;
}

export interface ElectricityWidgetData {
  title: string;
  value: string;
  changePercent: number;
  secondaryLabel: string;
  weekly: { value: string; changePercent: number; comparisonText: string };
  monthly: { value: string; changePercent: number; comparisonText: string };
  yearly: { value: string; changePercent: number; comparisonText: string };
  monthlyCompact: { value: string; changePercent: number; comparisonText: string };
  yearlyCompact: { value: string; changePercent: number; comparisonText: string };
  dotData: { col: number; row: number; size: number }[];
  chartMonths: string[];
  chartCols: number;
  chartRows: number;
}

function formatAud(n: number): string {
  return "$" + Math.round(n).toLocaleString();
}

function pctChange(from: number, to: number): number {
  if (from === 0) return 0;
  return Math.round(((to - from) / from) * 1000) / 10;
}

export function computeWidgetData(rows: ElectricityUsageRow[]): ElectricityWidgetData {
  if (rows.length === 0) {
    return {
      title: "Electricity Usage",
      value: "$0",
      changePercent: 0,
      secondaryLabel: "Avg. score $0",
      weekly: { value: "$0", changePercent: 0, comparisonText: "" },
      monthly: { value: "$0", changePercent: 0, comparisonText: "" },
      yearly: { value: "$0", changePercent: 0, comparisonText: "" },
      monthlyCompact: { value: "$0", changePercent: 0, comparisonText: "" },
      yearlyCompact: { value: "$0", changePercent: 0, comparisonText: "" },
      dotData: [],
      chartMonths: [],
      chartCols: 8,
      chartRows: 7,
    };
  }

  const totalCost = rows.reduce((s, r) => s + r.cost_aud, 0);
  const n = rows.length;

  const last7 = rows.slice(-7);
  const prev7 = rows.slice(-14, -7);
  const last30 = rows.slice(-30);
  const prev30 = rows.slice(-60, -30);

  const sum7 = last7.reduce((s, r) => s + r.cost_aud, 0);
  const sumPrev7 = prev7.length ? prev7.reduce((s, r) => s + r.cost_aud, 0) : sum7;
  const sum30 = last30.reduce((s, r) => s + r.cost_aud, 0);
  const sumPrev30 = prev30.length ? prev30.reduce((s, r) => s + r.cost_aud, 0) : sum30;

  const change7 = pctChange(sumPrev7, sum7);
  const change30 = pctChange(sumPrev30, sum30);
  const changeTotal = prev30.length ? pctChange(sumPrev30, sum30) : 0;

  const usageKwh = rows.map((r) => r.usage_kwh);
  const minKwh = Math.min(...usageKwh);
  const maxKwh = Math.max(...usageKwh);
  const range = maxKwh - minKwh || 1;

  const monthSet = new Set<string>();

  rows.forEach((r) => {
    monthSet.add(r.date.slice(0, 7));
  });

  const sortedMonths = Array.from(monthSet).sort();
  const chartMonths = sortedMonths.map((m) => {
    const monthNum = parseInt(m.slice(5, 7), 10);
    return MONTH_NAMES[monthNum - 1];
  });
  const chartCols = chartMonths.length;
  const chartRows = 7;

  const sortedByUsage = [...rows].sort((a, b) => a.usage_kwh - b.usage_kwh);
  const t1 = sortedByUsage[Math.floor(n / 3)]?.usage_kwh ?? minKwh;
  const t2 = sortedByUsage[Math.floor((2 * n) / 3)]?.usage_kwh ?? maxKwh;

  const byCell: Record<string, number[]> = {};
  rows.forEach((r, i) => {
    const col = Math.min(7, Math.floor((i / n) * 8));
    let row = 0;
    if (r.usage_kwh >= t2) row = 2;
    else if (r.usage_kwh >= t1) row = 1;
    const k = `${col},${row}`;
    if (!byCell[k]) byCell[k] = [];
    byCell[k].push(r.usage_kwh);
  });
  const dotData: { col: number; row: number; size: number }[] = Object.entries(
    byCell
  ).map(([k, usageValues]) => {
    const [c, r] = k.split(",").map(Number);
    const avg = usageValues.reduce((a, b) => a + b, 0) / usageValues.length;
    const size = (avg - minKwh) / range;
    return {
      col: c,
      row: r,
      size: Math.min(1, Math.max(0, size)),
    };
  });

  return {
    title: "Electricity Usage",
    value: formatAud(totalCost),
    changePercent: changeTotal,
    secondaryLabel: `Avg. ${formatAud(totalCost / Math.max(1, Math.ceil(n / 30)))} per month`,
    weekly: {
      value: formatAud(sum7),
      changePercent: change7,
      comparisonText: `Compared to ${formatAud(sumPrev7)} previous week`,
    },
    monthly: {
      value: formatAud(sum30),
      changePercent: change30,
      comparisonText: `Compared to ${formatAud(sumPrev30)} previous month`,
    },
    yearly: {
      value: formatAud(totalCost),
      changePercent: changeTotal,
      comparisonText: `Last ${n} days`,
    },
    monthlyCompact: {
      value: formatAud(sum30),
      changePercent: change30,
      comparisonText: `${(sum30 - (prev30.length ? sumPrev30 : sum30)).toFixed(2)} AUD`,
    },
    yearlyCompact: {
      value: formatAud(totalCost),
      changePercent: changeTotal,
      comparisonText: `${totalCost.toFixed(2)} AUD`,
    },
    dotData,
    chartMonths,
    chartCols,
    chartRows,
  };
}

export const ELECTRICITY_CSV_PATH = "/data/electricity_usage_6months.csv";
