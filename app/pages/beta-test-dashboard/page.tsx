"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import Progress from "@/components/Progress/Progress";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { dataVisualizationColors } from "@/lib/tokens/colors";
import { surfaceColours } from "@/lib/tokens/surface-colours";

const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
];

const LEFT_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "analytics", label: "Analytics", icon: "analytics" },
  { id: "accounts", label: "Accounts", icon: "group" },
  { id: "reports", label: "Reports", icon: "assessment" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// MRR gauge: 100,000 vs max ~120,000 = ~83%
const MRR_VALUE = 100000;
const MRR_MAX = 120000;
const mrrGaugeData = [
  { name: "value", value: MRR_VALUE, fill: dataVisualizationColors.dataASolid.hex },
  { name: "empty", value: MRR_MAX - MRR_VALUE, fill: "#E5E7EB" },
];

// Vs plan: 3 of 4 segments
const vsPlanData = [
  { filled: true },
  { filled: true },
  { filled: true },
  { filled: false },
];

// Accounts: double bar chart, 5 groups
const accountsData = [
  { name: "Jan", current: 120, previous: 95 },
  { name: "Feb", current: 98, previous: 110 },
  { name: "Mar", current: 85, previous: 78 },
  { name: "Apr", current: 145, previous: 120 },
  { name: "May", current: 92, previous: 105 },
];

// Growth: two lines
const growthData = [
  { name: "Jan", metric1: 40, metric2: 24 },
  { name: "Feb", metric1: 30, metric2: 40 },
  { name: "Mar", metric1: 20, metric2: 32 },
  { name: "Apr", metric1: 45, metric2: 28 },
  { name: "May", metric1: 35, metric2: 39 },
  { name: "Jun", metric1: 50, metric2: 42 },
];

export default function BetaTestDashboardPage() {
  const [activeNavId, setActiveNavId] = React.useState("dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top App Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/BetaTestLogo.svg"
              alt="Beta Test"
              width={140}
              height={32}
              className="h-8 w-auto block dark:hidden"
              priority
            />
            <Image
              src="/BetaTestLogo_darkmode.svg"
              alt="Beta Test"
              width={140}
              height={32}
              className="h-8 w-auto hidden dark:block"
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
            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100"
          >
            <Icon name="notifications" size={20} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C365D] text-sm font-medium text-white dark:bg-[#7c8cb8]">
            BT
          </div>
        </div>
      </header>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Left Navigation */}
        <aside className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-2">
              {LEFT_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNavId(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    activeNavId === item.id
                      ? "bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  )}
                >
                  <Icon
                    name={item.icon as "dashboard"}
                    size={20}
                    className={cn(
                      "font-extralight transition-colors",
                      activeNavId === item.id
                        ? "text-[#2C365D] dark:text-[#7c8cb8]"
                        : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                    )}
                  />
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`min-w-0 flex-1 overflow-y-auto ${surfaceColours["tally-group"]}`}>
          <div className="mx-auto max-w-[1600px] px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Beta Test Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Key metrics and performance overview
              </p>
            </div>

            {/* Dashboard grid: left column (MRR + Wins), right column (Charts) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left column: MRR + Wins today */}
              <div className="flex flex-col gap-6 lg:col-span-1">
                {/* MRR Card */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      MRR
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col items-center pt-0">
                    <div className="relative h-32 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mrrGaugeData}
                            cx="50%"
                            cy="85%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={0}
                            dataKey="value"
                          >
                            {mrrGaugeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {MRR_VALUE.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      vs plan
                    </p>
                    <div className="mt-2 flex gap-1">
                      {vsPlanData.map((seg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-2 w-6 rounded-sm",
                            seg.filled
                              ? "bg-[#2C365D] dark:bg-[#7c8cb8]"
                              : "bg-gray-200 dark:bg-gray-700"
                          )}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Wins today Card */}
                <Card className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Wins today
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      15 wins
                    </p>
                    <div className="mt-4">
                      <Progress value={60} max={100} className="h-2" />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Target: 25 wins
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column: Accounts + Growth */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Accounts panel */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={accountsData}
                          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #E5E7EB",
                            }}
                          />
                          <Bar
                            dataKey="current"
                            name="Current"
                            fill={CHART_COLORS[0]}
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="previous"
                            name="Previous"
                            fill={CHART_COLORS[1]}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Growth panel */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={growthData}
                          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <YAxis
                            stroke="#6B7280"
                            fontSize={12}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid #E5E7EB",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="metric1"
                            name="Metric 1"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS[0], r: 3 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="metric2"
                            name="Metric 2"
                            stroke={CHART_COLORS[1]}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS[1], r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
