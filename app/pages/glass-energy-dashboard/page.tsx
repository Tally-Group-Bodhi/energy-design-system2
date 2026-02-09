"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Avatar/Avatar";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import type { NavigationItem } from "@/components/NavigationBar/NavigationBar";
import Badge from "@/components/Badge/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
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
import { dataVisualizationColors } from "@/lib/tokens/colors";

/* ─── Mock data ─────────────────────────────────────────────────────────── */

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
  { month: "Aug", revenue: 842000, cost: 612000 },
  { month: "Sep", revenue: 798000, cost: 589000 },
  { month: "Oct", revenue: 756000, cost: 562000 },
  { month: "Nov", revenue: 834000, cost: 601000 },
  { month: "Dec", revenue: 912000, cost: 658000 },
  { month: "Jan", revenue: 968000, cost: 702000 },
  { month: "Feb", revenue: 886000, cost: 645000 },
];

const energySourceData = [
  { name: "Solar", value: 35, color: dataVisualizationColors.dataASolid.hex },
  { name: "Wind", value: 25, color: dataVisualizationColors.dataFSolid.hex },
  { name: "Natural Gas", value: 22, color: dataVisualizationColors.dataCSolid.hex },
  { name: "Hydro", value: 12, color: dataVisualizationColors.dataESolid.hex },
  { name: "Other", value: 6, color: dataVisualizationColors.dataDSolid.hex },
];

const hourlyLoadData = [
  { hour: "00:00", load: 2800 },
  { hour: "02:00", load: 2200 },
  { hour: "04:00", load: 2000 },
  { hour: "06:00", load: 2600 },
  { hour: "08:00", load: 4200 },
  { hour: "10:00", load: 5800 },
  { hour: "12:00", load: 6400 },
  { hour: "14:00", load: 6100 },
  { hour: "16:00", load: 5600 },
  { hour: "18:00", load: 5200 },
  { hour: "20:00", load: 4100 },
  { hour: "22:00", load: 3200 },
];

const recentAlerts = [
  { id: 1, type: "warning", message: "High demand forecast for next 48hrs", time: "2 hours ago", icon: "warning" },
  { id: 2, type: "info", message: "Solar generation exceeding projections by 12%", time: "4 hours ago", icon: "solar_power" },
  { id: 3, type: "success", message: "Grid stability index: 98.4%", time: "6 hours ago", icon: "check_circle" },
  { id: 4, type: "error", message: "Transformer TF-204 maintenance overdue", time: "8 hours ago", icon: "error" },
];

const topAccounts = [
  { name: "Metro Industrial Park", consumption: "12,840 kWh", change: "+3.2%", type: "Commercial" },
  { name: "Sunrise Residential Complex", consumption: "8,420 kWh", change: "-1.8%", type: "Residential" },
  { name: "TechHub Data Centre", consumption: "18,960 kWh", change: "+7.1%", type: "Industrial" },
  { name: "Green Valley Hospital", consumption: "6,340 kWh", change: "+0.5%", type: "Commercial" },
  { name: "Harbour District Apartments", consumption: "5,120 kWh", change: "-2.3%", type: "Residential" },
];

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const navItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "#" },
  {
    id: "energy",
    label: "Energy",
    icon: "bolt",
    children: [
      { id: "energy-consumption", label: "Consumption", href: "#" },
      { id: "energy-generation", label: "Generation", href: "#" },
      { id: "energy-grid", label: "Grid Status", href: "#" },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: "people",
    children: [
      { id: "customers-accounts", label: "Accounts", href: "#" },
      { id: "customers-meters", label: "Meters", href: "#" },
      { id: "customers-service", label: "Service Requests", href: "#" },
    ],
  },
  {
    id: "billing",
    label: "Billing",
    icon: "receipt_long",
    children: [
      { id: "billing-invoices", label: "Invoices", href: "#" },
      { id: "billing-payments", label: "Payments", href: "#" },
      { id: "billing-tariffs", label: "Tariffs", href: "#" },
    ],
  },
  { id: "reports", label: "Reports", icon: "bar_chart", href: "#" },
  { id: "analytics", label: "Analytics", icon: "insights", href: "#" },
];

const bottomNavItems: NavigationItem[] = [
  { id: "help", label: "Help & Support", icon: "help_outline", href: "#" },
  { id: "settings", label: "Settings", icon: "settings", href: "#" },
];

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function GlassEnergyDashboard() {
  const [currentEnv, setCurrentEnv] = useState("glass");

  return (
    <div className="flex h-screen flex-col bg-[#F9F9FB] dark:bg-gray-900">
      {/* ── App Bar ──────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-white px-4 dark:bg-gray-800">
        {/* Logo */}
        <Link href="/pages/glass-energy-dashboard" className="mr-6 flex items-center">
          <Image
            src="/GlassLogoTest.svg"
            alt="Tally Glass"
            width={140}
            height={40}
            className="block h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/GlassLogoTest_darkmode.svg"
            alt="Tally Glass"
            width={140}
            height={40}
            className="hidden h-8 w-auto dark:block"
            priority
          />
        </Link>

        {/* Search */}
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-density-md border border-border bg-gray-50 px-3 dark:bg-gray-700">
          <Icon name="search" size="var(--tally-icon-size-md)" className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search accounts, meters, addresses…"
            className="w-full bg-transparent py-2 outline-none placeholder:text-muted-foreground"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          />
        </div>

        {/* Right side */}
        <div className="ml-6 flex items-center gap-3">
          <button className="relative rounded-density-md p-density-sm hover:bg-gray-100 dark:hover:bg-gray-700">
            <Icon name="notifications" size="var(--tally-icon-size-md)" className="text-muted-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/32?u=glass-agent" alt="Agent" />
            <AvatarFallback>KL</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ── Expanded Navigation ─────────────────────────────────── */}
        <NavigationBar
          items={navItems}
          bottomItems={bottomNavItems}
          topSection={{
            icon: "public",
            title: currentEnv === "glass" ? "Tally Glass" : currentEnv === "orion" ? "Tally Orion" : "Small Markets",
            subtitle: currentEnv === "glass" ? "Energy Operations" : currentEnv === "orion" ? "CRM Platform" : "Retail Energy",
            flyoutDirection: "dropdown",
            environments: [
              { id: "glass", label: "Tally Glass", sublabel: "Energy Operations", icon: "public", accent: "teal" },
              { id: "orion", label: "Tally Orion", sublabel: "CRM Platform", icon: "public", accent: "red" },
              { id: "small-markets", label: "Small Markets", sublabel: "Retail Energy", icon: "public", accent: "default" },
            ],
            currentEnvironmentId: currentEnv,
            onEnvironmentChange: (id) => setCurrentEnv(id),
            onAddEnvironment: () => {},
          }}
          defaultActiveId="dashboard"
          collapsed={false}
        />

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] p-density-xl">

            {/* Page header */}
            <div className="mb-density-xl flex items-center justify-between">
              <div>
                <h1
                  className="font-bold text-gray-900 dark:text-gray-100"
                  style={{ fontSize: "var(--tally-font-size-3xl)", lineHeight: "var(--tally-line-height-tight)" }}
                >
                  Energy Dashboard
                </h1>
                <p
                  className="mt-density-xs text-muted-foreground"
                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                >
                  Real-time overview of energy distribution, consumption, and grid performance
                </p>
              </div>
              <div className="flex items-center gap-density-sm">
                <Button variant="outline" size="sm">
                  <Icon name="download" size="var(--tally-icon-size-sm)" className="mr-1" />
                  Export
                </Button>
                <Button variant="primary" size="sm">
                  <Icon name="add" size="var(--tally-icon-size-sm)" className="mr-1" />
                  New Report
                </Button>
              </div>
            </div>

            {/* ── KPI Cards ───────────────────────────────────────── */}
            <div className="mb-density-xl grid grid-cols-1 gap-density-lg sm:grid-cols-2 xl:grid-cols-4">
              <KPICard
                title="Total Consumption"
                value="48,260 kWh"
                change="+4.2% from last month"
                changeType="positive"
                icon="electric_meter"
              />
              <KPICard
                title="Revenue"
                value="$886,400"
                change="+6.8% from last month"
                changeType="positive"
                icon="payments"
              />
              <KPICard
                title="Active Accounts"
                value="12,847"
                change="+128 new accounts"
                changeType="positive"
                icon="group"
              />
              <KPICard
                title="Grid Efficiency"
                value="96.8%"
                change="-0.3% from last month"
                changeType="negative"
                icon="speed"
              />
            </div>

            {/* ── Tabs for dashboard sections ─────────────────────── */}
            <Tabs defaultValue="overview" className="mb-density-xl">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="consumption">Consumption</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="grid">Grid Status</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-density-lg">
                {/* Chart row 1 */}
                <div className="mb-density-lg grid grid-cols-1 gap-density-lg lg:grid-cols-12">
                  {/* Area chart: consumption trend */}
                  <Card className="shadow-none lg:col-span-8">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Consumption Trend</CardTitle>
                          <CardDescription>Monthly energy usage by sector (kWh)</CardDescription>
                        </div>
                        <Badge variant="outline">Last 7 months</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "320px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={consumptionData}>
                            <defs>
                              <linearGradient id="gradResidential" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={dataVisualizationColors.dataASolid.hex} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={dataVisualizationColors.dataASolid.hex} stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="gradCommercial" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={dataVisualizationColors.dataFSolid.hex} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={dataVisualizationColors.dataFSolid.hex} stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="gradIndustrial" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={dataVisualizationColors.dataCSolid.hex} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={dataVisualizationColors.dataCSolid.hex} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="residential" name="Residential" stroke={dataVisualizationColors.dataASolid.hex} fill="url(#gradResidential)" strokeWidth={2} />
                            <Area type="monotone" dataKey="commercial" name="Commercial" stroke={dataVisualizationColors.dataFSolid.hex} fill="url(#gradCommercial)" strokeWidth={2} />
                            <Area type="monotone" dataKey="industrial" name="Industrial" stroke={dataVisualizationColors.dataCSolid.hex} fill="url(#gradIndustrial)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pie chart: energy sources */}
                  <Card className="shadow-none lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Energy Sources</CardTitle>
                      <CardDescription>Generation mix breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "320px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={energySourceData}
                              cx="50%"
                              cy="45%"
                              innerRadius={60}
                              outerRadius={100}
                              dataKey="value"
                              paddingAngle={2}
                              label={({ name, percent }: { name: string; percent?: number }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                            >
                              {energySourceData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart row 2 */}
                <div className="mb-density-lg grid grid-cols-1 gap-density-lg lg:grid-cols-12">
                  {/* Bar chart: revenue vs cost */}
                  <Card className="shadow-none lg:col-span-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Revenue vs Operating Cost</CardTitle>
                          <CardDescription>Monthly financial performance ($)</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={revenueData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                              formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Bar dataKey="revenue" name="Revenue" fill={dataVisualizationColors.dataASolid.hex} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="cost" name="Cost" fill={dataVisualizationColors.dataBSolid.hex} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Line chart: hourly load */}
                  <Card className="shadow-none lg:col-span-6">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Today&apos;s Load Profile</CardTitle>
                          <CardDescription>Hourly grid load (MW)</CardDescription>
                        </div>
                        <Badge variant="secondary">Live</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "280px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hourlyLoadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="load"
                              name="Load (MW)"
                              stroke={dataVisualizationColors.dataDSolid.hex}
                              strokeWidth={2.5}
                              dot={{ r: 4, fill: dataVisualizationColors.dataDSolid.hex }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom row: alerts + top accounts */}
                <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-12">
                  {/* Alerts */}
                  <Card className="shadow-none lg:col-span-5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Alerts</CardTitle>
                        <Badge variant="outline">{recentAlerts.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-density-md">
                        {recentAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-start gap-density-md rounded-density-md border border-border p-density-md"
                          >
                            <div
                              className={`flex shrink-0 items-center justify-center rounded-density-sm p-density-xs ${
                                alert.type === "warning"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  : alert.type === "error"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : alert.type === "success"
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              <Icon name={alert.icon} size="var(--tally-icon-size-md)" />
                            </div>
                            <div className="flex-1">
                              <p
                                className="font-medium text-gray-900 dark:text-gray-100"
                                style={{ fontSize: "var(--tally-font-size-sm)" }}
                              >
                                {alert.message}
                              </p>
                              <p
                                className="mt-density-xs text-muted-foreground"
                                style={{ fontSize: "var(--tally-font-size-xs)" }}
                              >
                                {alert.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top accounts table */}
                  <Card className="shadow-none lg:col-span-7">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Top Accounts by Consumption</CardTitle>
                          <CardDescription>Current billing period</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          View All
                          <Icon name="chevron_right" size="var(--tally-icon-size-sm)" className="ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-hidden rounded-density-md border border-border">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border bg-gray-50 dark:bg-gray-800">
                              <th
                                className="px-density-lg py-density-sm text-left font-medium text-muted-foreground"
                                style={{ fontSize: "var(--tally-font-size-xs)" }}
                              >
                                Account
                              </th>
                              <th
                                className="px-density-lg py-density-sm text-left font-medium text-muted-foreground"
                                style={{ fontSize: "var(--tally-font-size-xs)" }}
                              >
                                Type
                              </th>
                              <th
                                className="px-density-lg py-density-sm text-right font-medium text-muted-foreground"
                                style={{ fontSize: "var(--tally-font-size-xs)" }}
                              >
                                Consumption
                              </th>
                              <th
                                className="px-density-lg py-density-sm text-right font-medium text-muted-foreground"
                                style={{ fontSize: "var(--tally-font-size-xs)" }}
                              >
                                Change
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {topAccounts.map((account) => (
                              <tr key={account.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <td
                                  className="px-density-lg py-density-md font-medium text-gray-900 dark:text-gray-100"
                                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                                >
                                  {account.name}
                                </td>
                                <td className="px-density-lg py-density-md">
                                  <Badge
                                    variant={account.type === "Industrial" ? "default" : account.type === "Commercial" ? "secondary" : "outline"}
                                  >
                                    {account.type}
                                  </Badge>
                                </td>
                                <td
                                  className="px-density-lg py-density-md text-right font-medium text-gray-900 dark:text-gray-100"
                                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                                >
                                  {account.consumption}
                                </td>
                                <td
                                  className={`px-density-lg py-density-md text-right font-medium ${
                                    account.change.startsWith("+")
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                  style={{ fontSize: "var(--tally-font-size-sm)" }}
                                >
                                  {account.change}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Consumption tab */}
              <TabsContent value="consumption" className="mt-density-lg">
                <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-2">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle>Sector Breakdown</CardTitle>
                      <CardDescription>Consumption by customer type over the past 7 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "380px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={consumptionData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }} />
                            <Legend />
                            <Bar dataKey="residential" name="Residential" fill={dataVisualizationColors.dataASolid.hex} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="commercial" name="Commercial" fill={dataVisualizationColors.dataFSolid.hex} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="industrial" name="Industrial" fill={dataVisualizationColors.dataCSolid.hex} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle>Peak Demand Analysis</CardTitle>
                      <CardDescription>Hourly load profile for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "380px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={hourlyLoadData}>
                            <defs>
                              <linearGradient id="gradLoad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={dataVisualizationColors.dataDSolid.hex} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={dataVisualizationColors.dataDSolid.hex} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }} />
                            <Area type="monotone" dataKey="load" name="Load (MW)" stroke={dataVisualizationColors.dataDSolid.hex} fill="url(#gradLoad)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Revenue tab */}
              <TabsContent value="revenue" className="mt-density-lg">
                <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-12">
                  <Card className="shadow-none lg:col-span-8">
                    <CardHeader>
                      <CardTitle>Revenue & Cost Trend</CardTitle>
                      <CardDescription>7-month financial overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div style={{ height: "380px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }}
                              formatter={(value: number) => `$${value.toLocaleString()}`}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" name="Revenue" stroke={dataVisualizationColors.dataESolid.hex} strokeWidth={2.5} dot={{ r: 4 }} />
                            <Line type="monotone" dataKey="cost" name="Cost" stroke={dataVisualizationColors.dataCSolid.hex} strokeWidth={2.5} dot={{ r: 4 }} strokeDasharray="5 5" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-density-lg lg:col-span-4">
                    <MiniStatCard label="Gross Margin" value="$241,400" subtext="27.2% margin" icon="trending_up" positive />
                    <MiniStatCard label="Avg. Revenue/Account" value="$68.97" subtext="+$2.14 vs last month" icon="person" positive />
                    <MiniStatCard label="Outstanding Invoices" value="$124,800" subtext="342 accounts" icon="receipt" positive={false} />
                  </div>
                </div>
              </TabsContent>

              {/* Grid status tab */}
              <TabsContent value="grid" className="mt-density-lg">
                <div className="grid grid-cols-1 gap-density-lg sm:grid-cols-2 xl:grid-cols-4">
                  <GridStatusCard title="Grid Frequency" value="50.02 Hz" status="normal" icon="radio_button_checked" />
                  <GridStatusCard title="Voltage Stability" value="99.1%" status="normal" icon="electric_bolt" />
                  <GridStatusCard title="Transformer Load" value="78.4%" status="warning" icon="power" />
                  <GridStatusCard title="Line Losses" value="3.2%" status="normal" icon="timeline" />
                </div>

                <Card className="mt-density-lg shadow-none">
                  <CardHeader>
                    <CardTitle>Grid Load Distribution</CardTitle>
                    <CardDescription>Real-time load across the network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "340px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyLoadData} barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB", fontSize: "13px" }} />
                          <Bar dataKey="load" name="Grid Load (MW)" fill={dataVisualizationColors.dataFSolid.hex} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function KPICard({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: string;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-density-xl pt-density-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className="font-medium text-muted-foreground"
              style={{ fontSize: "var(--tally-font-size-sm)" }}
            >
              {title}
            </p>
            <p
              className="mt-density-sm font-bold leading-tight text-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-3xl)" }}
            >
              {value}
            </p>
            <div className="mt-density-sm flex items-center gap-density-xs">
              <Icon
                name={changeType === "positive" ? "trending_up" : "trending_down"}
                size="var(--tally-icon-size-sm)"
                className={
                  changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              />
              <span
                className={`font-medium ${
                  changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                {change}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#2C365D]/10 p-density-md dark:bg-[#7c8cb8]/20">
            <Icon
              name={icon}
              size="var(--tally-icon-size-lg)"
              className="text-[#2C365D] dark:text-[#7c8cb8]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStatCard({
  label,
  value,
  subtext,
  icon,
  positive,
}: {
  label: string;
  value: string;
  subtext: string;
  icon: string;
  positive: boolean;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-density-xl pt-density-xl">
        <div className="flex items-center gap-density-md">
          <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#2C365D]/10 p-density-sm dark:bg-[#7c8cb8]/20">
            <Icon name={icon} size="var(--tally-icon-size-md)" className="text-[#2C365D] dark:text-[#7c8cb8]" />
          </div>
          <div>
            <p className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
              {label}
            </p>
            <p
              className="font-bold text-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-xl)" }}
            >
              {value}
            </p>
            <p
              className={`font-medium ${positive ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
              style={{ fontSize: "var(--tally-font-size-xs)" }}
            >
              {subtext}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GridStatusCard({
  title,
  value,
  status,
  icon,
}: {
  title: string;
  value: string;
  status: "normal" | "warning" | "critical";
  icon: string;
}) {
  const statusColors = {
    normal: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const statusLabels = { normal: "Normal", warning: "Attention", critical: "Critical" };

  return (
    <Card className="shadow-none">
      <CardContent className="p-density-xl pt-density-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground" style={{ fontSize: "var(--tally-font-size-xs)" }}>
              {title}
            </p>
            <p
              className="mt-density-sm font-bold text-gray-900 dark:text-gray-100"
              style={{ fontSize: "var(--tally-font-size-xxl)" }}
            >
              {value}
            </p>
            <div className="mt-density-sm">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${statusColors[status]}`}
                style={{ fontSize: "var(--tally-font-size-xs)" }}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  status === "normal" ? "bg-green-500" : status === "warning" ? "bg-amber-500" : "bg-red-500"
                }`} />
                {statusLabels[status]}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-density-md bg-[#2C365D]/10 p-density-sm dark:bg-[#7c8cb8]/20">
            <Icon name={icon} size="var(--tally-icon-size-md)" className="text-[#2C365D] dark:text-[#7c8cb8]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
