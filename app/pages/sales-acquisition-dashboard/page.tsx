"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/Card/Card";
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
import { cn } from "@/lib/utils";
import { dataVisualizationColors } from "@/lib/tokens/colors";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Chart colors
const CHART_COLORS = [
  dataVisualizationColors.dataASolid.hex,
  dataVisualizationColors.dataBSolid.hex,
  dataVisualizationColors.dataCSolid.hex,
  dataVisualizationColors.dataDSolid.hex,
  dataVisualizationColors.dataESolid.hex,
  dataVisualizationColors.dataFSolid.hex,
] as const;

// Left nav items - Salesforce-like
const LEFT_NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "leads", label: "Leads", icon: "person_search" },
  { id: "opportunities", label: "Opportunities", icon: "trending_up" },
  { id: "accounts", label: "Accounts", icon: "business" },
  { id: "contacts", label: "Contacts", icon: "contact_page" },
  { id: "activities", label: "Activities", icon: "event" },
  { id: "forecast", label: "Forecast", icon: "insights" },
  { id: "reports", label: "Reports", icon: "assessment" },
];

// Pipeline stages data
const pipelineStagesData = [
  { stage: "Qualified", count: 42, value: 185000, color: CHART_COLORS[0] },
  { stage: "Proposal", count: 28, value: 142000, color: CHART_COLORS[1] },
  { stage: "Negotiation", count: 18, value: 89000, color: CHART_COLORS[2] },
  { stage: "Closed Won", count: 15, value: 67000, color: CHART_COLORS[4] },
  { stage: "Closed Lost", count: 12, value: 0, color: CHART_COLORS[5] },
];

// Revenue by month
const revenueData = [
  { month: "Jan", revenue: 42000, forecast: 45000 },
  { month: "Feb", revenue: 48500, forecast: 48000 },
  { month: "Mar", revenue: 52000, forecast: 51000 },
  { month: "Apr", revenue: 46100, forecast: 52000 },
  { month: "May", revenue: 53800, forecast: 53000 },
  { month: "Jun", revenue: 57200, forecast: 54500 },
  { month: "Jul", revenue: 54100, forecast: 55000 },
  { month: "Aug", revenue: 58900, forecast: 56000 },
  { month: "Sep", revenue: 61200, forecast: 57000 },
  { month: "Oct", revenue: 58400, forecast: 58000 },
  { month: "Nov", revenue: 63800, forecast: 59000 },
  { month: "Dec", revenue: 67100, forecast: 60000 },
];

// Recent leads
const recentLeadsData = [
  {
    id: "LD-1001",
    name: "Green Energy Solutions",
    company: "Commercial",
    value: "$24,500",
    stage: "Qualified",
    owner: "Sarah Chen",
    date: "2 hours ago",
  },
  {
    id: "LD-1002",
    name: "Metro Retail Group",
    company: "Enterprise",
    value: "$89,000",
    stage: "Proposal",
    owner: "James Wilson",
    date: "4 hours ago",
  },
  {
    id: "LD-1003",
    name: "Solar First Pty Ltd",
    company: "SMB",
    value: "$12,200",
    stage: "Negotiation",
    owner: "Emma Davis",
    date: "5 hours ago",
  },
  {
    id: "LD-1004",
    name: "City Council NSW",
    company: "Government",
    value: "$156,000",
    stage: "Proposal",
    owner: "Michael Brown",
    date: "Yesterday",
  },
  {
    id: "LD-1005",
    name: "Hospital Network",
    company: "Enterprise",
    value: "$78,400",
    stage: "Qualified",
    owner: "Sarah Chen",
    date: "Yesterday",
  },
];

// Recent opportunities
const opportunitiesData = [
  { id: "OPP-451", name: "Metro Retail - Full Site", value: "$89,000", stage: "Proposal", closeDate: "15 Feb 2026" },
  { id: "OPP-452", name: "City Council NSW - Solar", value: "$156,000", stage: "Negotiation", closeDate: "22 Feb 2026" },
  { id: "OPP-453", name: "Hospital Network - Energy", value: "$78,400", stage: "Qualified", closeDate: "28 Feb 2026" },
  { id: "OPP-454", name: "Green Energy - Bundle", value: "$24,500", stage: "Negotiation", closeDate: "8 Feb 2026" },
  { id: "OPP-455", name: "Solar First - Residential", value: "$12,200", stage: "Proposal", closeDate: "12 Feb 2026" },
];

// Activities / tasks
const activitiesData = [
  { id: 1, type: "Call", subject: "Follow up with Metro Retail", due: "Today", assignee: "James Wilson", priority: "high" },
  { id: 2, type: "Meeting", subject: "City Council proposal review", due: "Tomorrow", assignee: "Michael Brown", priority: "high" },
  { id: 3, type: "Email", subject: "Solar First contract draft", due: "Tomorrow", assignee: "Emma Davis", priority: "medium" },
  { id: 4, type: "Call", subject: "Hospital Network discovery call", due: "2 days", assignee: "Sarah Chen", priority: "medium" },
  { id: 5, type: "Task", subject: "Update Green Energy quote", due: "3 days", assignee: "Sarah Chen", priority: "low" },
];

// Top performers
const topPerformersData = [
  { name: "Sarah Chen", deals: 12, value: "$342,000", rank: 1 },
  { name: "James Wilson", deals: 9, value: "$289,500", rank: 2 },
  { name: "Michael Brown", deals: 8, value: "$267,200", rank: 3 },
  { name: "Emma Davis", deals: 7, value: "$198,400", rank: 4 },
];

// KPI Card
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
      <CardContent className="p-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {change && (
              <div className="mt-2 flex items-center gap-1">
                <Icon
                  name={changeType === "positive" ? "trending_up" : changeType === "negative" ? "trending_down" : "trending_flat"}
                  size={16}
                  className={
                    changeType === "positive" ? "text-[#008000]" : changeType === "negative" ? "text-[#C40000]" : "text-gray-500 dark:text-gray-400"
                  }
                />
                <span
                  className={`text-sm font-medium ${
                    changeType === "positive" ? "text-[#008000]" : changeType === "negative" ? "text-[#C40000]" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {change}
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            )}
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
            <Icon name={icon as "home"} size={24} className="text-[#2C365D] dark:text-[#7c8cb8]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Stage badge
function getStageBadge(stage: string) {
  switch (stage) {
    case "Qualified":
      return <Badge variant="info">Qualified</Badge>;
    case "Proposal":
      return <Badge variant="secondary">Proposal</Badge>;
    case "Negotiation":
      return <Badge variant="warning">Negotiation</Badge>;
    case "Closed Won":
      return <Badge variant="success">Won</Badge>;
    case "Closed Lost":
      return <Badge variant="error">Lost</Badge>;
    default:
      return <Badge variant="secondary">{stage}</Badge>;
  }
}

// Priority badge
function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return <Badge variant="error">High</Badge>;
    case "medium":
      return <Badge variant="warning">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

// Activity type icon
function getActivityIcon(type: string) {
  switch (type) {
    case "Call":
      return "call";
    case "Meeting":
      return "event";
    case "Email":
      return "email";
    case "Task":
      return "task_alt";
    default:
      return "circle";
  }
}

export default function SalesAcquisitionDashboardPage() {
  const [activeNavId, setActiveNavId] = useState("home");
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("12months");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top App Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/TallyAcquire.svg"
              alt="Tally Sales & Acquisition"
              width={140}
              height={40}
              className="block h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src="/TallyAcquire_darkmode.svg"
              alt="Tally Sales & Acquisition"
              width={140}
              height={40}
              className="hidden h-8 w-auto dark:block"
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
              placeholder="Search leads, opportunities, accounts..."
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
            SA
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
                    name={item.icon as "home"}
                    size={20}
                    className={cn(
                      "transition-colors",
                      activeNavId === item.id ? "text-[#2C365D] dark:text-[#7c8cb8]" : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                    )}
                  />
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-2 border-t border-border p-3 text-xs text-muted-foreground dark:border-gray-800">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <span className="flex items-center gap-2">
                <Icon name="description" size={16} className="text-gray-500 dark:text-gray-400" />
                Documentation
              </span>
            </button>
            <div className="pt-1">
              <div className="flex w-full items-center justify-center rounded-full px-2 py-1.5">
                <Image
                  src="/PoweredByTallyBadgeDark.svg"
                  alt="Powered by Tally"
                  width={120}
                  height={29}
                  className="h-auto w-[120px]"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-6 py-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="flex items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                      <Icon name="home" size={18} className="text-gray-600 dark:text-gray-400" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/pages" className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
                      Pages
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                    S&A Beta
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  S&A Beta
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pipeline, leads, opportunities, and performance metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="w-40">
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="12months">Last 12 months</option>
                  <option value="ytd">Year to date</option>
                </Select>
                <Link
                  href="#"
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#2C365D] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C365D]/90 dark:bg-[#7c8cb8] dark:hover:bg-[#7c8cb8]/90"
                >
                  <Icon name="add" size={18} />
                  New Lead
                </Link>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="mb-6 flex h-10 flex-nowrap justify-start gap-1 rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="forecast">Forecast</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Pipeline Value"
                    value="$416,000"
                    change="+18.2%"
                    changeType="positive"
                    icon="show_chart"
                  />
                  <KPICard
                    title="Closed Won (MTD)"
                    value="$67,000"
                    change="+12.5%"
                    changeType="positive"
                    icon="verified"
                  />
                  <KPICard
                    title="New Leads"
                    value="127"
                    change="+24"
                    changeType="positive"
                    icon="person_add"
                  />
                  <KPICard
                    title="Conversion Rate"
                    value="23.4%"
                    change="-1.2%"
                    changeType="negative"
                    icon="trending_up"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Revenue Trend */}
                  <Card className="shadow-none lg:col-span-8">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Revenue vs Forecast
                      </CardTitle>
                      <CardDescription>Monthly revenue compared to forecast</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
                            <YAxis
                              stroke="#6B7280"
                              fontSize={12}
                              tickLine={false}
                              tickFormatter={(v) => `$${v / 1000}k`}
                            />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
                              formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, ""]}
                            />
                            <Legend />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              name="Actual"
                              stackId="1"
                              stroke={CHART_COLORS[0]}
                              fill={CHART_COLORS[0]}
                              fillOpacity={0.6}
                            />
                            <Area
                              type="monotone"
                              dataKey="forecast"
                              name="Forecast"
                              stackId="2"
                              stroke={CHART_COLORS[1]}
                              fill={CHART_COLORS[1]}
                              fillOpacity={0.3}
                              strokeDasharray="5 5"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pipeline Funnel */}
                  <Card className="shadow-none lg:col-span-4">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Pipeline by Stage
                      </CardTitle>
                      <CardDescription>Deals and value by stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pipelineStagesData.map((stage) => (
                          <div key={stage.stage}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900 dark:text-gray-100">{stage.stage}</span>
                              <span className="text-muted-foreground">
                                {stage.count} deals · {stage.value > 0 ? `$${(stage.value / 1000).toFixed(0)}k` : "—"}
                              </span>
                            </div>
                            <Progress value={Math.min((stage.value / 416000) * 100, 100)} className="h-2" max={100} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tables Row */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Recent Leads */}
                  <Card className="shadow-none lg:col-span-8">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Recent Leads
                          </CardTitle>
                          <CardDescription>Latest lead activity</CardDescription>
                        </div>
                        <Link href="#" className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                          View all
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="px-0 pb-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                            <TableHead className="pl-6">Lead</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Stage</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className="pr-6">Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentLeadsData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="pl-6 font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                              </TableCell>
                              <TableCell>{item.company}</TableCell>
                              <TableCell className="font-medium">{item.value}</TableCell>
                              <TableCell>{getStageBadge(item.stage)}</TableCell>
                              <TableCell>{item.owner}</TableCell>
                              <TableCell className="pr-6 text-muted-foreground">{item.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Top Performers & Activities */}
                  <div className="flex flex-col gap-6 lg:col-span-4">
                    {/* Top Performers */}
                    <Card className="shadow-none">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                          Top Performers
                        </CardTitle>
                        <CardDescription>This month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {topPerformersData.map((performer) => (
                            <div
                              key={performer.name}
                              className="flex items-center gap-3 rounded-lg border border-border p-3 dark:border-gray-700"
                            >
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C365D]/10 text-sm font-bold text-[#2C365D] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]">
                                {performer.rank}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{performer.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {performer.deals} deals · {performer.value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Upcoming Activities */}
                    <Card className="shadow-none">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Upcoming Activities
                          </CardTitle>
                          <Link href="#" className="text-xs font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                            View all
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {activitiesData.slice(0, 4).map((activity) => (
                            <div
                              key={activity.id}
                              className="flex gap-3 rounded-lg border border-border p-3 dark:border-gray-700"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
                                <Icon name={getActivityIcon(activity.type) as "call"} size={16} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.subject}</p>
                                <p className="text-xs text-muted-foreground">
                                  {activity.due} · {activity.assignee}
                                </p>
                              </div>
                              {getPriorityBadge(activity.priority)}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Pipeline Tab */}
              <TabsContent value="pipeline" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Pipeline Funnel Chart */}
                  <Card className="shadow-none lg:col-span-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Pipeline Funnel
                      </CardTitle>
                      <CardDescription>Deal count and value by stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={pipelineStagesData}
                            layout="vertical"
                            margin={{ top: 10, right: 30, bottom: 0, left: 80 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                            <XAxis type="number" stroke="#6B7280" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                            <YAxis type="category" dataKey="stage" stroke="#6B7280" fontSize={12} width={70} />
                            <Tooltip
                              contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
                              formatter={(value, name, item) => {
                                const payload = item?.payload as { stage: string; count: number; value: number } | undefined;
                                if (!payload) return [value != null ? `${value}` : "", ""];
                                return [
                                  `${payload.count} deals · $${(payload.value / 1000).toFixed(0)}k`,
                                  payload.stage,
                                ];
                              }}
                            />
                            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stage Distribution Pie */}
                  <Card className="shadow-none lg:col-span-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                        Stage Distribution
                      </CardTitle>
                      <CardDescription>Deal count by stage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6">
                        <div className="h-64 w-64 shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pipelineStagesData.filter((s) => s.value > 0)}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="count"
                              >
                                {pipelineStagesData
                                  .filter((s) => s.value > 0)
                                  .map((_, i) => (
                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                  ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
                                formatter={(value, name, item) => {
                                  const payload = item?.payload as { stage: string } | undefined;
                                  if (!payload) return [value != null ? `${value}` : "", ""];
                                  return [`${value} deals`, payload.stage];
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1 space-y-2">
                          {pipelineStagesData.filter((s) => s.value > 0).map((stage, i) => (
                            <div key={stage.stage} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                <span className="text-gray-600 dark:text-gray-300">{stage.stage}</span>
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">{stage.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Opportunities Table */}
                <Card className="shadow-none">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                          Open Opportunities
                        </CardTitle>
                        <CardDescription>Deals in progress</CardDescription>
                      </div>
                      <Link href="#" className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]">
                        View all
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                          <TableHead className="pl-6">Opportunity</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Close Date</TableHead>
                          <TableHead className="pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {opportunitiesData.map((opp) => (
                          <TableRow key={opp.id}>
                            <TableCell className="pl-6 font-medium text-gray-900 dark:text-gray-100">{opp.name}</TableCell>
                            <TableCell className="font-medium">{opp.value}</TableCell>
                            <TableCell>{getStageBadge(opp.stage)}</TableCell>
                            <TableCell className="text-muted-foreground">{opp.closeDate}</TableCell>
                            <TableCell className="pr-6">
                              <button
                                type="button"
                                className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                              >
                                Edit
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Forecast Tab */}
              <TabsContent value="forecast" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard title="Forecast (This Month)" value="$67,000" change="+8%" changeType="positive" icon="insights" />
                  <KPICard title="Forecast (Next Month)" value="$72,500" change="+12%" changeType="positive" icon="trending_up" />
                  <KPICard title="Pipeline Coverage" value="3.2x" description="Pipeline / target" icon="stacked_line_chart" />
                  <KPICard title="Weighted Pipeline" value="$312,400" change="+5%" changeType="positive" icon="balance" />
                </div>

                <Card className="shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                      Revenue Forecast
                    </CardTitle>
                    <CardDescription>Actual vs forecasted revenue by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
                          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                          <Tooltip
                            contentStyle={{ borderRadius: "8px", border: "1px solid #E5E7EB" }}
                            formatter={(value: number | undefined) => [`$${(value ?? 0).toLocaleString()}`, ""]}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" name="Actual" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ fill: CHART_COLORS[0], r: 4 }} />
                          <Line
                            type="monotone"
                            dataKey="forecast"
                            name="Forecast"
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

              {/* Activities Tab */}
              <TabsContent value="activities" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard title="Calls Today" value="24" change="+6" changeType="positive" icon="call" />
                  <KPICard title="Meetings Scheduled" value="12" change="+2" changeType="positive" icon="event" />
                  <KPICard title="Emails Sent" value="48" change="-3" changeType="negative" icon="email" />
                  <KPICard title="Tasks Completed" value="18" change="+5" changeType="positive" icon="task_alt" />
                </div>

                <Card className="shadow-none">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
                      All Activities
                    </CardTitle>
                    <CardDescription>Tasks, calls, meetings, and emails</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                          <TableHead className="pl-6">Type</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Assignee</TableHead>
                          <TableHead>Due</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="pr-6">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activitiesData.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="pl-6">
                              <div className="flex items-center gap-2">
                                <Icon name={getActivityIcon(activity.type) as "call"} size={18} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                                {activity.type}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-900 dark:text-gray-100">{activity.subject}</TableCell>
                            <TableCell>{activity.assignee}</TableCell>
                            <TableCell className="text-muted-foreground">{activity.due}</TableCell>
                            <TableCell>{getPriorityBadge(activity.priority)}</TableCell>
                            <TableCell className="pr-6">
                              <button
                                type="button"
                                className="text-sm font-medium text-[#2C365D] hover:underline dark:text-[#7c8cb8]"
                              >
                                Complete
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
