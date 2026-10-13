"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import GridLayout, {
  useContainerWidth,
  verticalCompactor,
  type Layout,
  type LayoutItem,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import Select from "@/components/Select/Select";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { cn } from "@/lib/utils";
import { surfaceColours } from "@/lib/tokens/surface-colours";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { dataVisualizationColors } from "@/lib/tokens/colors";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

/* ── Nav (Large Market) ─────────────────────────────────────────────────── */

interface NavItem {
  id: string;
  label: string;
  icon: string;
  children?: { id: string; label: string }[];
}

const LEFT_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "dashboard",
    children: [
      { id: "home-dashboard", label: "Dashboard" },
      { id: "home-exceptions", label: "Exceptions" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: "trending_up",
    children: [
      { id: "sales-discovery", label: "Discovery" },
      { id: "sales-bulk-discovery", label: "Bulk Discovery" },
      { id: "sales-quotes", label: "Quotes" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: "group",
    children: [
      { id: "customers-accounts", label: "Accounts" },
      { id: "customers-manual-creation", label: "Manual Account Creation" },
      { id: "customers-add-new", label: "Add New Accounts" },
      { id: "customers-import-results", label: "View Import Results" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: "receipt",
    children: [
      { id: "billing-dashboard", label: "Dashboard" },
      { id: "billing-batch", label: "Batch" },
      { id: "billing-review", label: "Review" },
      { id: "billing-invoices", label: "Invoices" },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    icon: "credit_card",
    children: [{ id: "payments-suspense", label: "Suspense Account" }],
  },
  {
    id: "market",
    label: "Market",
    icon: "store",
    children: [
      { id: "market-change-requests", label: "Change Requests" },
      { id: "market-transactions-dashboard", label: "Transactions Dashboard" },
    ],
  },
  {
    id: "reporting",
    label: "Reporting",
    icon: "insights",
    children: [
      { id: "reporting-reports", label: "Reports" },
      { id: "reporting-scheduled", label: "Scheduled Reports" },
    ],
  },
  { id: "settings", label: "Settings", icon: "settings", children: [] },
];

/* ── Widget model ───────────────────────────────────────────────────────── */

type WidgetSize = "xs" | "s" | "m" | "l" | "xl";
type ChartType = "area" | "bar" | "line" | "pie" | "kpi";

type WidgetDef = {
  i: string;
  title: string;
  chartType: ChartType;
  size: WidgetSize;
  value?: string;
  unit?: string;
  change?: string;
};

const SIZE_PRESETS: Record<WidgetSize, { w: number; h: number }> = {
  xs: { w: 3, h: 2 },
  s: { w: 3, h: 3 },
  m: { w: 4, h: 4 },
  l: { w: 6, h: 4 },
  xl: { w: 6, h: 8 },
};

const GRID_COLS = 12;
const GRID_ROWS = 8;
const GRID_MARGIN: [number, number] = [8, 8];
const GRID_PADDING: [number, number] = [8, 8];

const DEFAULT_WIDGETS: WidgetDef[] = [
  {
    i: "consumption",
    title: "Consumption",
    chartType: "area",
    size: "xl",
    value: "38.5k",
    unit: "kWh",
  },
  {
    i: "peak",
    title: "Peak Demand",
    chartType: "kpi",
    size: "xs",
    value: "1,245",
    unit: "kW",
    change: "+3.2%",
  },
  {
    i: "solar",
    title: "Solar Output",
    chartType: "kpi",
    size: "xs",
    value: "24.8k",
    unit: "kWh",
    change: "+12%",
  },
  {
    i: "revenue",
    title: "Revenue vs Cost",
    chartType: "area",
    size: "m",
    value: "$968k",
  },
  {
    i: "load",
    title: "Hourly Load",
    chartType: "bar",
    size: "s",
    value: "6.4k",
    unit: "kW",
  },
  {
    i: "sources",
    title: "Energy Mix",
    chartType: "pie",
    size: "s",
  },
];

/** Tall-left default: XL chart on the left, KPIs + charts tiling the right. */
const DEFAULT_LAYOUT: Layout = [
  { i: "consumption", x: 0, y: 0, w: 6, h: 8 },
  { i: "peak", x: 6, y: 0, w: 3, h: 2 },
  { i: "solar", x: 9, y: 0, w: 3, h: 2 },
  { i: "revenue", x: 6, y: 2, w: 6, h: 3 },
  { i: "load", x: 6, y: 5, w: 3, h: 3 },
  { i: "sources", x: 9, y: 5, w: 3, h: 3 },
];

/* ── Mock chart data ────────────────────────────────────────────────────── */

const consumptionData = [
  { month: "Aug", residential: 4200, commercial: 3100, industrial: 5800 },
  { month: "Sep", residential: 3900, commercial: 2900, industrial: 5400 },
  { month: "Oct", residential: 3600, commercial: 2800, industrial: 5100 },
  { month: "Nov", residential: 4100, commercial: 3200, industrial: 5600 },
  { month: "Dec", residential: 4800, commercial: 3600, industrial: 6200 },
  { month: "Jan", residential: 5200, commercial: 3800, industrial: 6500 },
  { month: "Feb", residential: 4600, commercial: 3400, industrial: 6000 },
];

const revenueData = [
  { month: "Aug", revenue: 842, cost: 612 },
  { month: "Sep", revenue: 798, cost: 589 },
  { month: "Oct", revenue: 756, cost: 562 },
  { month: "Nov", revenue: 834, cost: 601 },
  { month: "Dec", revenue: 912, cost: 658 },
  { month: "Jan", revenue: 968, cost: 702 },
  { month: "Feb", revenue: 886, cost: 645 },
];

const hourlyLoadData = [
  { hour: "00", load: 2800 },
  { hour: "04", load: 2000 },
  { hour: "08", load: 4200 },
  { hour: "12", load: 6400 },
  { hour: "16", load: 5600 },
  { hour: "20", load: 4100 },
];

const sparklineData = [
  { v: 40 },
  { v: 55 },
  { v: 48 },
  { v: 62 },
  { v: 58 },
  { v: 70 },
  { v: 66 },
  { v: 78 },
];

const energySourceData = [
  { name: "Solar", value: 35, color: dataVisualizationColors.dataASolid.hex },
  { name: "Wind", value: 25, color: dataVisualizationColors.dataFSolid.hex },
  { name: "Gas", value: 22, color: dataVisualizationColors.dataCSolid.hex },
  { name: "Hydro", value: 12, color: dataVisualizationColors.dataESolid.hex },
  { name: "Other", value: 6, color: dataVisualizationColors.dataDSolid.hex },
];

const CHART_A = dataVisualizationColors.dataASolid.hex;
const CHART_B = dataVisualizationColors.dataBSolid.hex;
const CHART_F = dataVisualizationColors.dataFSolid.hex;

/* ── Chart body ─────────────────────────────────────────────────────────── */

function WidgetChart({
  widget,
  dense,
}: {
  widget: WidgetDef;
  dense: boolean;
}) {
  const showAxes = !dense;
  const showLegend = widget.size === "l" || widget.size === "xl";

  if (widget.chartType === "kpi") {
    return (
      <div className="flex h-full min-h-0 flex-col gap-0.5">
        <div className="shrink-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tracking-tight text-[#181B25] dark:text-gray-100">
              {widget.value}
            </span>
            {widget.unit && (
              <span className="text-xs text-muted-foreground">{widget.unit}</span>
            )}
          </div>
          {widget.change && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {widget.change}
            </span>
          )}
        </div>
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={CHART_A}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  if (widget.chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={energySourceData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={dense ? "30%" : "42%"}
            outerRadius={dense ? "78%" : "80%"}
            paddingAngle={2}
          >
            {energySourceData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              iconSize={8}
              layout="horizontal"
              verticalAlign="bottom"
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (widget.chartType === "bar" || widget.i === "load") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={hourlyLoadData}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          {showAxes ? (
            <>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={36} />
            </>
          ) : (
            <XAxis dataKey="hour" hide />
          )}
          <Tooltip />
          <Bar dataKey="load" fill={CHART_F} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (widget.i === "revenue") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueData}
          margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
        >
          {showAxes && (
            <>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={40} />
            </>
          )}
          <Tooltip />
          {showLegend && (
            <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
          )}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={CHART_A}
            fill={CHART_A}
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke={CHART_B}
            fill={CHART_B}
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={consumptionData}
        margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
      >
        {showAxes && (
          <>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={40} />
          </>
        )}
        <Tooltip />
        {showLegend && (
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
        )}
        <Area
          type="monotone"
          dataKey="residential"
          stackId="1"
          stroke={CHART_A}
          fill={CHART_A}
          fillOpacity={0.55}
        />
        <Area
          type="monotone"
          dataKey="commercial"
          stackId="1"
          stroke={CHART_F}
          fill={CHART_F}
          fillOpacity={0.55}
        />
        <Area
          type="monotone"
          dataKey="industrial"
          stackId="1"
          stroke={CHART_B}
          fill={CHART_B}
          fillOpacity={0.45}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export default function LargeMarketWidgetDashboardPage() {
  const isLg = useMediaQuery("(min-width: 1024px)");
  const [navCollapsed, setNavCollapsed] = React.useState(!isLg);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeNavId, setActiveNavId] = React.useState("home-dashboard");
  const [openParentId, setOpenParentId] = React.useState<string | null>("home");
  const [flyoutParentId, setFlyoutParentId] = React.useState<string | null>(null);
  const [flyoutPos, setFlyoutPos] = React.useState<{ top: number; left: number } | null>(null);
  const flyoutTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [widgets, setWidgets] = React.useState<WidgetDef[]>(() =>
    DEFAULT_WIDGETS.map((w) => ({ ...w }))
  );
  const [layout, setLayout] = React.useState<Layout>(() =>
    DEFAULT_LAYOUT.map((item) => ({ ...item }))
  );

  const { width, containerRef, mounted } = useContainerWidth({
    measureBeforeMount: true,
  });
  const [rowHeight, setRowHeight] = React.useState(48);

  React.useEffect(() => {
    setNavCollapsed(!isLg);
  }, [isLg]);

  React.useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) {
      sidebar.style.display = isExpanded ? "none" : "";
    }
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, [isExpanded]);

  // Fit grid rows to the available pane height (no page scroll).
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const h = el.clientHeight;
      if (h <= 0) return;
      const [marginY] = GRID_MARGIN;
      const [, padY] = GRID_PADDING;
      const totalMargins = marginY * (GRID_ROWS - 1);
      const totalPadding = padY * 2;
      const next = Math.max(24, (h - totalMargins - totalPadding) / GRID_ROWS);
      setRowHeight(next);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, mounted]);

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

  const handleLayoutChange = (next: Layout) => {
    setLayout(next.map((item) => ({ ...item })));
  };

  const handleSizeChange = (id: string, size: WidgetSize) => {
    const preset = SIZE_PRESETS[size];
    setWidgets((prev) =>
      prev.map((w) => (w.i === id ? { ...w, size } : w))
    );
    setLayout((prev) =>
      prev.map((item) =>
        item.i === id
          ? ({ ...item, w: preset.w, h: preset.h } as LayoutItem)
          : item
      )
    );
  };

  const resetLayout = () => {
    setWidgets(DEFAULT_WIDGETS.map((w) => ({ ...w })));
    setLayout(DEFAULT_LAYOUT.map((item) => ({ ...item })));
  };

  const widgetById = React.useMemo(() => {
    const map = new Map(widgets.map((w) => [w.i, w]));
    return map;
  }, [widgets]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="h-1 shrink-0 bg-[#FF5E00]" />

      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/TallyCIS_Test.svg"
              alt="Tally CIS"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="relative hidden w-full max-w-md md:block">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-border bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#2C365D] focus:outline-none focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80"
          >
            <Icon name="grid_view" size={20} />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">PA</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        <aside
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-r border-border bg-white transition-[width] duration-300 dark:border-gray-800 dark:bg-gray-950",
            navCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
            <nav
              className={cn(
                "flex flex-col",
                navCollapsed ? "items-center p-2" : "p-2"
              )}
            >
              {LEFT_NAV_ITEMS.map((item) => {
                const hasChildren = (item.children?.length ?? 0) > 0;
                const isOpen = openParentId === item.id;
                const parentActive = isParentActive(item);

                if (navCollapsed) {
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onMouseEnter={(e) => {
                        if (hasChildren) {
                          cancelHideFlyout();
                          showFlyout(e, item.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (hasChildren) hideFlyout();
                      }}
                      onClick={() => {
                        if (!hasChildren) setActiveNavId(item.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          if (hasChildren) setFlyoutParentId(item.id);
                          else setActiveNavId(item.id);
                        }
                      }}
                      title={!hasChildren ? item.label : undefined}
                      className={cn(
                        "group flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors",
                        parentActive
                          ? "bg-[#FFF3E6] text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      )}
                    >
                      <Icon
                        name={item.icon as "dashboard"}
                        size={20}
                        className={cn(
                          "shrink-0 font-extralight",
                          parentActive
                            ? "text-[#802F00] dark:text-[#FFCF99]"
                            : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                        )}
                      />
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
                          ? "bg-[#FFF3E6] text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                      )}
                    >
                      <Icon
                        name={item.icon as "dashboard"}
                        size={20}
                        className={cn(
                          "shrink-0 font-extralight",
                          parentActive || isOpen
                            ? "text-[#802F00] dark:text-[#FFCF99]"
                            : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      {hasChildren && (
                        <Icon
                          name={isOpen ? "expand_less" : "expand_more"}
                          size={20}
                          className="shrink-0 text-gray-500 dark:text-gray-400"
                        />
                      )}
                    </button>
                    {hasChildren && isOpen && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2 dark:border-gray-600">
                        {item.children!.map((child) => (
                          <li key={child.id}>
                            <button
                              type="button"
                              onClick={() => setActiveNavId(child.id)}
                              className={cn(
                                "flex w-full items-center rounded-lg py-2 pl-2 pr-3 text-left text-sm font-normal transition-colors",
                                activeNavId === child.id
                                  ? "bg-[#FFF3E6] text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]"
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
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
          </div>
          <div className="shrink-0 border-t border-border dark:border-gray-800">
            {navCollapsed ? (
              <div className="flex flex-col items-center gap-1 p-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded((v) => !v)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}
                >
                  <Icon
                    name={isExpanded ? "close_fullscreen" : "open_in_full"}
                    size={20}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setNavCollapsed(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label="Expand navigation"
                >
                  <Icon name="chevron_right" size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded((v) => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                    aria-label={
                      isExpanded ? "Exit full screen" : "Enter full screen"
                    }
                  >
                    <Icon
                      name={isExpanded ? "close_fullscreen" : "open_in_full"}
                      size={18}
                    />
                  </button>
                  <Image
                    src="/PoweredByTallyBadge.svg"
                    alt="Powered by Tally"
                    width={120}
                    height={29}
                    className="h-auto w-[120px] dark:hidden"
                  />
                  <Image
                    src="/PoweredByTallyBadgeREV.svg"
                    alt="Powered by Tally"
                    width={120}
                    height={29}
                    className="hidden h-auto w-[120px] dark:block"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setNavCollapsed(true)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  aria-label="Collapse navigation"
                >
                  <Icon name="chevron_left" size={20} />
                </button>
              </div>
            )}
          </div>
        </aside>

        {navCollapsed &&
          flyoutParentId &&
          flyoutPos &&
          (() => {
            const parentItem = LEFT_NAV_ITEMS.find(
              (i) => i.id === flyoutParentId
            );
            if (!parentItem?.children?.length) return null;
            return (
              <div
                className="fixed z-[100] min-w-[180px] rounded-md border border-gray-200 bg-white py-2 dark:border-gray-600 dark:bg-gray-800"
                style={{
                  top: flyoutPos.top,
                  left: flyoutPos.left,
                  boxShadow:
                    "0 2px 2px -1px rgba(10,13,18,0.04), 0 4px 6px -2px rgba(10,13,18,0.03), 0 12px 16px -4px rgba(10,13,18,0.08)",
                }}
                onMouseEnter={() => cancelHideFlyout()}
                onMouseLeave={() => hideFlyout()}
              >
                <div className="px-4 pb-1 pt-1.5 text-sm font-normal text-gray-600 dark:text-gray-300">
                  {parentItem.label}
                </div>
                <div className="relative ml-4 border-l border-gray-200 dark:border-gray-600">
                  {parentItem.children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => {
                        setActiveNavId(child.id);
                        setOpenParentId(parentItem.id);
                        hideFlyout();
                      }}
                      className={cn(
                        "flex w-full items-center py-2 pl-3 pr-4 text-left text-sm font-normal transition-colors",
                        activeNavId === child.id
                          ? "mx-2 rounded-lg bg-[#FFF3E6] font-medium text-[#802F00] dark:bg-[#802F00]/20 dark:text-[#FFCF99]"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
            surfaceColours["tally-group"]
          )}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 xl:px-5">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-[#2C365D] dark:text-gray-100">
                Widget Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Drag handles to rearrange · resize edges or pick xs–xl · fits the
                window
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetLayout}
              className="shrink-0"
            >
              <Icon name="restart_alt" size={16} className="mr-1.5" />
              Reset layout
            </Button>
          </div>

          <div
            ref={containerRef}
            className="lm-widget-grid min-h-0 flex-1 overflow-hidden px-1 pb-1"
          >
            {mounted && width > 0 && (
              <GridLayout
                className="h-full"
                width={width}
                layout={layout}
                gridConfig={{
                  cols: GRID_COLS,
                  rowHeight,
                  margin: GRID_MARGIN,
                  containerPadding: GRID_PADDING,
                  maxRows: GRID_ROWS,
                }}
                dragConfig={{
                  enabled: true,
                  handle: ".widget-drag-handle",
                  cancel: "select,option,button,input,a",
                  bounded: true,
                }}
                resizeConfig={{
                  enabled: true,
                  handles: ["se", "e", "s"],
                }}
                compactor={verticalCompactor}
                autoSize={false}
                onLayoutChange={handleLayoutChange}
              >
                {layout.map((item) => {
                  const widget = widgetById.get(item.i);
                  if (!widget) return <div key={item.i} />;
                  const dense =
                    widget.size === "xs" ||
                    widget.size === "s" ||
                    item.h <= 2;

                  return (
                    <div key={item.i} className="min-h-0 min-w-0">
                      <Card className="flex h-full min-h-0 flex-col overflow-hidden shadow-sm">
                        <CardHeader
                          className={cn(
                            "flex shrink-0 flex-row items-center gap-1.5 space-y-0 border-b border-border",
                            dense ? "px-2 py-1.5" : "px-3 py-2"
                          )}
                        >
                          <button
                            type="button"
                            className="widget-drag-handle -ml-0.5 flex cursor-grab items-center rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:cursor-grabbing dark:hover:bg-gray-800 dark:hover:text-gray-200"
                            aria-label={`Drag ${widget.title}`}
                          >
                            <Icon name="drag_indicator" size={18} />
                          </button>
                          <CardTitle className="min-w-0 flex-1 truncate text-sm font-medium">
                            {widget.title}
                          </CardTitle>
                          {!dense && widget.value && (
                            <span className="hidden text-xs text-muted-foreground sm:inline">
                              {widget.value}
                              {widget.unit ? ` ${widget.unit}` : ""}
                            </span>
                          )}
                          <div
                            className="w-[4.25rem] shrink-0"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Select
                              aria-label={`${widget.title} size`}
                              value={widget.size}
                              onChange={(e) =>
                                handleSizeChange(
                                  widget.i,
                                  e.target.value as WidgetSize
                                )
                              }
                              className="h-7 py-0 pr-8 text-xs"
                            >
                              <option value="xs">XS</option>
                              <option value="s">S</option>
                              <option value="m">M</option>
                              <option value="l">L</option>
                              <option value="xl">XL</option>
                            </Select>
                          </div>
                        </CardHeader>
                        <CardContent className="flex min-h-0 flex-1 flex-col p-2 !pt-2">
                          <div className="relative min-h-0 w-full flex-1">
                            <div className="absolute inset-0">
                              <WidgetChart widget={widget} dense={dense} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </GridLayout>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .lm-widget-grid .react-grid-item.react-grid-placeholder {
          background: #2c365d;
          opacity: 0.15;
          border-radius: 0.75rem;
        }
        .lm-widget-grid .react-grid-item > .react-resizable-handle::after {
          border-color: #2c365d;
        }
        .lm-widget-grid .react-grid-layout {
          min-height: 100%;
        }
      `}</style>
    </div>
  );
}
