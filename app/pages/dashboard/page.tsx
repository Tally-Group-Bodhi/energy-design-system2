"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import Progress from "@/components/Progress/Progress";
import Select from "@/components/Select/Select";
import { Icon } from "@/components/ui/icon";
import { dataVisualizationColors, semanticColors } from "@/lib/tokens/colors";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Chart colors from design system
const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
  dataVisualizationColors.dataESolid.hex,
  dataVisualizationColors.dataFSolid.hex,
] as const;

// Sample data for charts
const energyConsumptionData = [
  { month: "Jan", electricity: 4200, gas: 2400, solar: 1200 },
  { month: "Feb", electricity: 3800, gas: 2100, solar: 1400 },
  { month: "Mar", electricity: 3500, gas: 1800, solar: 1800 },
  { month: "Apr", electricity: 3200, gas: 1400, solar: 2200 },
  { month: "May", electricity: 2900, gas: 1100, solar: 2600 },
  { month: "Jun", electricity: 2700, gas: 900, solar: 2800 },
  { month: "Jul", electricity: 2500, gas: 800, solar: 3000 },
  { month: "Aug", electricity: 2600, gas: 850, solar: 2900 },
  { month: "Sep", electricity: 2800, gas: 1000, solar: 2500 },
  { month: "Oct", electricity: 3100, gas: 1300, solar: 2000 },
  { month: "Nov", electricity: 3600, gas: 1800, solar: 1500 },
  { month: "Dec", electricity: 4000, gas: 2200, solar: 1100 },
];

const weeklyUsageData = [
  { day: "Mon", usage: 320 },
  { day: "Tue", usage: 280 },
  { day: "Wed", usage: 350 },
  { day: "Thu", usage: 290 },
  { day: "Fri", usage: 310 },
  { day: "Sat", usage: 220 },
  { day: "Sun", usage: 180 },
];

const costBreakdownData = [
  { name: "Electricity", value: 4500, color: CHART_COLORS[0] },
  { name: "Gas", value: 1800, color: CHART_COLORS[1] },
  { name: "Water", value: 600, color: CHART_COLORS[2] },
  { name: "Network Charges", value: 1200, color: CHART_COLORS[3] },
];

const regionPerformanceData = [
  { region: "QLD", target: 95, actual: 92 },
  { region: "NSW", target: 95, actual: 88 },
  { region: "VIC", target: 95, actual: 96 },
  { region: "SA", target: 95, actual: 91 },
  { region: "WA", target: 95, actual: 94 },
];

const recentActivityData = [
  {
    id: "TXN-001",
    customer: "Acme Industries",
    type: "Bill Payment",
    amount: "$1,245.00",
    status: "completed",
    date: "2 hours ago",
  },
  {
    id: "TXN-002",
    customer: "TechCorp Solutions",
    type: "New Connection",
    amount: "$350.00",
    status: "pending",
    date: "4 hours ago",
  },
  {
    id: "TXN-003",
    customer: "Green Energy Co",
    type: "Meter Reading",
    amount: "—",
    status: "completed",
    date: "5 hours ago",
  },
  {
    id: "TXN-004",
    customer: "City Council",
    type: "Bill Payment",
    amount: "$8,750.00",
    status: "completed",
    date: "Yesterday",
  },
  {
    id: "TXN-005",
    customer: "Smith Residence",
    type: "Disconnection",
    amount: "$75.00",
    status: "error",
    date: "Yesterday",
  },
  {
    id: "TXN-006",
    customer: "Metro Hospital",
    type: "Usage Alert",
    amount: "—",
    status: "warning",
    date: "2 days ago",
  },
];

const alertsData = [
  { id: 1, title: "High usage detected", description: "Customer QB00171824 exceeded usage threshold by 25%", severity: "warning", time: "10 min ago" },
  { id: 2, title: "Payment overdue", description: "3 accounts have payments overdue by 30+ days", severity: "error", time: "1 hour ago" },
  { id: 3, title: "Meter sync completed", description: "Batch meter data synchronization completed successfully", severity: "success", time: "2 hours ago" },
  { id: 4, title: "New tariff applied", description: "Summer peak tariff now active for all residential accounts", severity: "info", time: "3 hours ago" },
];

// KPI Card component
function KPICard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: string;
  description?: string;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="mt-2 flex items-center gap-1">
                <Icon
                  name={changeType === "positive" ? "trending_up" : changeType === "negative" ? "trending_down" : "trending_flat"}
                  size={16}
                  className={
                    changeType === "positive"
                      ? "text-[#008000]"
                      : changeType === "negative"
                      ? "text-[#C40000]"
                      : "text-gray-500"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    changeType === "positive"
                      ? "text-[#008000]"
                      : changeType === "negative"
                      ? "text-[#C40000]"
                      : "text-gray-500"
                  }`}
                >
                  {change}
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2C365D]/10">
            <Icon name={icon} size={24} className="text-[#2C365D]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Status badge helper
function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "error":
      return <Badge variant="error">Failed</Badge>;
    case "warning":
      return <Badge variant="warning">Warning</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

// Alert severity badge
function getAlertBadge(severity: string) {
  switch (severity) {
    case "success":
      return <Badge variant="success">Success</Badge>;
    case "warning":
      return <Badge variant="warning">Warning</Badge>;
    case "error":
      return <Badge variant="error">Critical</Badge>;
    case "info":
      return <Badge variant="info">Info</Badge>;
    default:
      return <Badge variant="secondary">{severity}</Badge>;
  }
}

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("12months");
  const [activeTab, setActiveTab] = useState("overview");

  // Compact widget data
  const compactWidgets = [
    { title: "Consumption", value: "38.5k", unit: "kWh", data: energyConsumptionData.map(d => ({ value: d.electricity })), type: "line" as const },
    { title: "Cost", value: "$8.2k", unit: "", data: energyConsumptionData.map((d, i) => ({ value: (d.electricity * 0.21 + d.gas * 0.15) })), type: "area" as const },
    { title: "Solar", value: "24.8k", unit: "kWh", data: energyConsumptionData.map(d => ({ value: d.solar })), type: "line" as const },
    { title: "Accounts", value: "12,847", unit: "", data: Array.from({ length: 12 }, (_, i) => ({ value: 12000 + Math.random() * 2000 })), type: "bar" as const },
    { title: "Peak", value: "1,245", unit: "kW", data: weeklyUsageData, type: "bar" as const },
    { title: "Avg Daily", value: "1,282", unit: "kWh", data: weeklyUsageData, type: "line" as const },
    { title: "Off-Peak", value: "42%", unit: "", data: [{ name: "Peak", value: 35 }, { name: "Shoulder", value: 23 }, { name: "Off-Peak", value: 42 }], type: "pie" as const },
    { title: "Carbon", value: "12.4t", unit: "", data: energyConsumptionData.map(d => ({ value: d.solar * 0.5 })), type: "area" as const },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="flex items-center text-gray-700 transition-colors hover:text-gray-900">
                  <Icon name="home" size={18} />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/pages" className="text-gray-700 transition-colors hover:text-gray-900">
                  Pages
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900">
                Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Energy Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Monitor energy consumption, costs, and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-40"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="12months">Last 12 months</option>
              <option value="ytd">Year to date</option>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-6 h-10 flex-nowrap justify-start gap-1 rounded-lg bg-gray-100 p-1 text-gray-600">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consumption">Consumption</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compact">Compact</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Total Consumption"
                value="38,450 kWh"
                change="+12.5%"
                changeType="negative"
                icon="bolt"
              />
              <KPICard
                title="Current Month Cost"
                value="$8,245"
                change="-8.2%"
                changeType="positive"
                icon="payments"
              />
              <KPICard
                title="Active Accounts"
                value="12,847"
                change="+156"
                changeType="positive"
                icon="group"
              />
              <KPICard
                title="Solar Generation"
                value="24,800 kWh"
                change="+18.3%"
                changeType="positive"
                icon="solar_power"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Energy Consumption Trend */}
              <Card className="shadow-none lg:col-span-8">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-gray-900">
                    Energy Consumption Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly breakdown by energy source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={energyConsumptionData}
                        margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                          formatter={(value: number | undefined) => [`${(value ?? 0).toLocaleString()} kWh`, ""]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="electricity"
                          name="Electricity"
                          stackId="1"
                          stroke={CHART_COLORS[0]}
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="gas"
                          name="Gas"
                          stackId="1"
                          stroke={CHART_COLORS[1]}
                          fill={CHART_COLORS[1]}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="solar"
                          name="Solar"
                          stackId="1"
                          stroke={CHART_COLORS[4]}
                          fill={CHART_COLORS[4]}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown Pie */}
              <Card className="shadow-none lg:col-span-4">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-gray-900">
                    Cost Breakdown
                  </CardTitle>
                  <CardDescription>Current billing period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                          formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, ""]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {costBreakdownData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-600">{item.name}</span>
                        </div>
                        <span className="font-medium text-gray-900">
                          ${item.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity and Alerts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Recent Activity Table */}
              <Card className="shadow-none lg:col-span-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-gray-900">
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Latest transactions and events</CardDescription>
                    </div>
                    <Link
                      href="#"
                      className="text-sm font-medium text-[#2C365D] hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="pl-6">Transaction</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="pr-6">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivityData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="pl-6 font-medium text-gray-900">
                            {item.id}
                          </TableCell>
                          <TableCell>{item.customer}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell className="font-medium">{item.amount}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="pr-6 text-muted-foreground">
                            {item.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Alerts Panel */}
              <Card className="shadow-none lg:col-span-4">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-gray-900">
                      Alerts
                    </CardTitle>
                    <Badge variant="outline">{alertsData.length} new</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex gap-3 rounded-lg border border-border bg-gray-50 p-3"
                    >
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          alert.severity === "error"
                            ? "bg-[#FEE2E2]"
                            : alert.severity === "warning"
                            ? "bg-[#FEF3C7]"
                            : alert.severity === "success"
                            ? "bg-[#D1FAE5]"
                            : "bg-[#DBEAFE]"
                        }`}
                      >
                        <Icon
                          name={
                            alert.severity === "error"
                              ? "error"
                              : alert.severity === "warning"
                              ? "warning"
                              : alert.severity === "success"
                              ? "check_circle"
                              : "info"
                          }
                          size={18}
                          className={
                            alert.severity === "error"
                              ? "text-[#C40000]"
                              : alert.severity === "warning"
                              ? "text-[#C53B00]"
                              : alert.severity === "success"
                              ? "text-[#008000]"
                              : "text-[#0074C4]"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                          {alert.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consumption Tab */}
          <TabsContent value="consumption" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Peak Demand"
                value="1,245 kW"
                change="+5.2%"
                changeType="negative"
                icon="show_chart"
                description="Highest recorded this month"
              />
              <KPICard
                title="Average Daily"
                value="1,282 kWh"
                change="-3.1%"
                changeType="positive"
                icon="calendar_today"
              />
              <KPICard
                title="Off-Peak Usage"
                value="42%"
                change="+8%"
                changeType="positive"
                icon="nightlight"
              />
              <KPICard
                title="Carbon Offset"
                value="12.4 tons"
                change="+22%"
                changeType="positive"
                icon="eco"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Weekly Usage Pattern */}
              <Card className="shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-gray-900">
                    Weekly Usage Pattern
                  </CardTitle>
                  <CardDescription>Average daily consumption this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weeklyUsageData}
                        margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="day"
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6B7280"
                          fontSize={12}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                          }}
                          formatter={(value: number | undefined) => [`${value ?? 0} kWh`, "Usage"]}
                        />
                        <Bar
                          dataKey="usage"
                          fill={CHART_COLORS[0]}
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Consumption by Time of Day */}
              <Card className="shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-gray-900">
                    Time-of-Use Distribution
                  </CardTitle>
                  <CardDescription>Consumption by tariff period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">Peak (2pm - 8pm)</span>
                        <span className="text-muted-foreground">35% - 13,458 kWh</span>
                      </div>
                      <Progress value={35} className="h-3" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">Shoulder (7am - 2pm, 8pm - 10pm)</span>
                        <span className="text-muted-foreground">23% - 8,844 kWh</span>
                      </div>
                      <Progress value={23} className="h-3" />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">Off-Peak (10pm - 7am)</span>
                        <span className="text-muted-foreground">42% - 16,149 kWh</span>
                      </div>
                      <Progress value={42} className="h-3" />
                    </div>
                  </div>

                  <div className="mt-8 rounded-lg border border-[#D1FAE5] bg-[#D1FAE5]/30 p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="lightbulb" size={20} className="mt-0.5 text-[#008000]" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Optimization Tip</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Shifting 10% of peak usage to off-peak hours could save approximately $420/month.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Costs Tab */}
          <TabsContent value="costs" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="Year to Date"
                value="$94,320"
                change="-4.8%"
                changeType="positive"
                icon="account_balance"
              />
              <KPICard
                title="Projected Annual"
                value="$112,500"
                icon="trending_up"
                description="Based on current usage"
              />
              <KPICard
                title="Avg Cost/kWh"
                value="$0.214"
                change="+2.1%"
                changeType="negative"
                icon="attach_money"
              />
              <KPICard
                title="Savings This Year"
                value="$8,450"
                change="+15%"
                changeType="positive"
                icon="savings"
              />
            </div>

            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  Monthly Cost Comparison
                </CardTitle>
                <CardDescription>Current year vs previous year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", current: 8200, previous: 8800 },
                        { month: "Feb", current: 7500, previous: 8200 },
                        { month: "Mar", current: 7100, previous: 7600 },
                        { month: "Apr", current: 6400, previous: 7000 },
                        { month: "May", current: 5800, previous: 6200 },
                        { month: "Jun", current: 5200, previous: 5800 },
                        { month: "Jul", current: 4900, previous: 5400 },
                        { month: "Aug", current: 5100, previous: 5500 },
                        { month: "Sep", current: 5600, previous: 6000 },
                        { month: "Oct", current: 6200, previous: 6800 },
                        { month: "Nov", current: 7200, previous: 7800 },
                        { month: "Dec", current: 8000, previous: 8600 },
                      ]}
                      margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                      />
                      <YAxis
                        stroke="#6B7280"
                        fontSize={12}
                        tickLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "1px solid #E5E7EB",
                        }}
                        formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, ""]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="current"
                        name="2024"
                        stroke={CHART_COLORS[0]}
                        strokeWidth={2}
                        dot={{ fill: CHART_COLORS[0], r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="previous"
                        name="2023"
                        stroke={CHART_COLORS[1]}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: CHART_COLORS[1], r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compact Tab */}
          <TabsContent value="compact" className="mt-0 space-y-6">
            {/* Compact KPI Widgets */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Key Metrics</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                {compactWidgets.map((widget, index) => (
                  <div
                    key={widget.title}
                    className="h-[112px] w-full overflow-hidden rounded-lg border border-border bg-card p-2 shadow-none"
                  >
                    <div className="mb-1 flex items-start justify-between">
                      <p className="truncate text-[10px] font-medium text-gray-500">
                        {widget.title}
                      </p>
                    </div>
                    <p className="mb-1 truncate text-base font-bold text-gray-900">
                      {widget.value}
                    </p>
                    <div className="h-[58px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        {widget.type === "line" ? (
                          <LineChart
                            data={widget.data}
                            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                          >
                            <XAxis hide />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={CHART_COLORS[index % CHART_COLORS.length]}
                              strokeWidth={1.5}
                              dot={false}
                            />
                          </LineChart>
                        ) : widget.type === "bar" ? (
                          <BarChart
                            data={widget.data}
                            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                          >
                            <XAxis hide />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                              radius={[2, 2, 0, 0]}
                            />
                          </BarChart>
                        ) : widget.type === "area" ? (
                          <AreaChart
                            data={widget.data}
                            margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
                          >
                            <XAxis hide />
                            <YAxis hide />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={CHART_COLORS[index % CHART_COLORS.length]}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                              fillOpacity={0.5}
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        ) : (
                          <PieChart margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                            <Pie
                              data={widget.data}
                              cx="50%"
                              cy="50%"
                              innerRadius={18}
                              outerRadius={28}
                              paddingAngle={1}
                              dataKey="value"
                            >
                              {widget.data.map((_, idx) => (
                                <Cell
                                  key={`cell-${idx}`}
                                  fill={CHART_COLORS[idx % CHART_COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                borderRadius: "4px",
                                border: "1px solid #E5E7EB",
                                fontSize: "10px",
                              }}
                            />
                          </PieChart>
                        )}
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact Charts */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Energy Consumption - Compact */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-900">
                    Energy Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={energyConsumptionData}
                        margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          stroke="#6B7280"
                          fontSize={10}
                          tickLine={false}
                        />
                        <YAxis
                          stroke="#6B7280"
                          fontSize={10}
                          tickLine={false}
                          tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "6px",
                            border: "1px solid #E5E7EB",
                            fontSize: "11px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="electricity"
                          stackId="1"
                          stroke={CHART_COLORS[0]}
                          fill={CHART_COLORS[0]}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="gas"
                          stackId="1"
                          stroke={CHART_COLORS[1]}
                          fill={CHART_COLORS[1]}
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="solar"
                          stackId="1"
                          stroke={CHART_COLORS[4]}
                          fill={CHART_COLORS[4]}
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown - Compact */}
              <Card className="shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-900">
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-32 w-32 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              borderRadius: "6px",
                              border: "1px solid #E5E7EB",
                              fontSize: "11px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {costBreakdownData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-600">{item.name}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            ${(item.value / 1000).toFixed(1)}k
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compact Activity Table */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-gray-900">
                    Recent Activity
                  </CardTitle>
                  <Link
                    href="#"
                    className="text-xs font-medium text-[#2C365D] hover:underline"
                  >
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="pl-6 text-xs">ID</TableHead>
                        <TableHead className="text-xs">Customer</TableHead>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Amount</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="pr-6 text-xs">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentActivityData.slice(0, 4).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="pl-6 text-xs font-medium text-gray-900">
                            {item.id}
                          </TableCell>
                          <TableCell className="text-xs">{item.customer}</TableCell>
                          <TableCell className="text-xs">{item.type}</TableCell>
                          <TableCell className="text-xs font-medium">{item.amount}</TableCell>
                          <TableCell className="text-xs">{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="pr-6 text-xs text-muted-foreground">
                            {item.date}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Compact Alerts */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {alertsData.map((alert) => (
                <div
                  key={alert.id}
                  className="flex gap-2 rounded-lg border border-border bg-card p-3 shadow-none"
                >
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      alert.severity === "error"
                        ? "bg-[#FEE2E2]"
                        : alert.severity === "warning"
                        ? "bg-[#FEF3C7]"
                        : alert.severity === "success"
                        ? "bg-[#D1FAE5]"
                        : "bg-[#DBEAFE]"
                    }`}
                  >
                    <Icon
                      name={
                        alert.severity === "error"
                          ? "error"
                          : alert.severity === "warning"
                          ? "warning"
                          : alert.severity === "success"
                          ? "check_circle"
                          : "info"
                      }
                      size={14}
                      className={
                        alert.severity === "error"
                          ? "text-[#C40000]"
                          : alert.severity === "warning"
                          ? "text-[#C53B00]"
                          : alert.severity === "success"
                          ? "text-[#008000]"
                          : "text-[#0074C4]"
                      }
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{alert.title}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground line-clamp-2">
                      {alert.description}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Regional Performance - Compact */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-gray-900">
                  Regional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regionPerformanceData.map((region) => (
                    <div key={region.region} className="flex items-center gap-3">
                      <span className="w-12 text-xs font-medium text-gray-900">{region.region}</span>
                      <div className="relative flex-1">
                        <Progress value={region.actual} max={100} className="h-2" />
                        <div
                          className="absolute top-0 h-2 w-0.5 bg-[#C40000]"
                          style={{ left: `${region.target}%` }}
                        />
                      </div>
                      <span
                        className={`w-12 text-right text-xs font-medium ${
                          region.actual >= region.target ? "text-[#008000]" : "text-[#C53B00]"
                        }`}
                      >
                        {region.actual}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <KPICard
                title="System Uptime"
                value="99.97%"
                icon="dns"
                description="Last 30 days"
              />
              <KPICard
                title="Billing Accuracy"
                value="99.8%"
                change="+0.2%"
                changeType="positive"
                icon="fact_check"
              />
              <KPICard
                title="Meter Read Rate"
                value="98.5%"
                change="-0.5%"
                changeType="negative"
                icon="speed"
              />
              <KPICard
                title="Avg Response Time"
                value="1.2s"
                change="-15%"
                changeType="positive"
                icon="timer"
              />
            </div>

            <Card className="shadow-none">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold text-gray-900">
                  Regional Performance
                </CardTitle>
                <CardDescription>Target vs actual performance by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {regionPerformanceData.map((region) => (
                    <div key={region.region}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{region.region}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${
                              region.actual >= region.target
                                ? "text-[#008000]"
                                : "text-[#C53B00]"
                            }`}
                          >
                            {region.actual}%
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / {region.target}% target
                          </span>
                          {region.actual >= region.target ? (
                            <Badge variant="success" className="ml-2">On Track</Badge>
                          ) : (
                            <Badge variant="warning" className="ml-2">Below Target</Badge>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <Progress value={region.actual} max={100} className="h-3" />
                        <div
                          className="absolute top-0 h-3 w-0.5 bg-[#C40000]"
                          style={{ left: `${region.target}%` }}
                          title={`Target: ${region.target}%`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
