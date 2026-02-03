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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Checkbox from "@/components/Checkbox/Checkbox";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";

const LEFT_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "tasks", label: "Tasks & Exceptions", icon: "notifications" },
  { id: "market", label: "Market", icon: "store" },
  { id: "adjustments", label: "Adjustments", icon: "tune" },
  { id: "metering", label: "Metering Services Registry", icon: "table_chart" },
  { id: "reports", label: "Reports", icon: "assessment" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "maintenance", label: "Maintenance", icon: "build" },
];

const TAB_CONFIG = [
  { value: "details", label: "Details" },
  { value: "pricing", label: "Pricing" },
  { value: "financial", label: "Financial" },
  { value: "utility", label: "Utility" },
  { value: "usage", label: "Usage" },
  { value: "interaction", label: "Interaction" },
];

const DETAILS_CARD_TITLES = [
  "Account Summary",
  "Billing Configuration",
  "Payment Details",
  "Contact Information",
  "Service Address",
] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  DETAILS_CARD_TITLES.map((title) => [title, true])
);

const ACCOUNT_EVENTS = [
  { id: 1, date: "16 May 2025", event: "Portal Registration Completed", performer: "Tally+" },
  { id: 2, date: "12 May 2025", event: "Account Status Changed to Open", performer: "Tally+" },
  { id: 3, date: "30 Apr 2025", event: "Move In Completed", performer: "System" },
  { id: 4, date: "28 Apr 2025", event: "Contractual Actions - 12 Month", performer: "Tally+" },
  { id: 5, date: "15 Apr 2025", event: "Account Created", performer: "Admin User" },
];

const RECENT_BILLS = [
  { id: "INV-2025-05", date: "27 Apr 2025", amount: "$142.50", status: "paid", dueDate: "12 May 2025" },
  { id: "INV-2025-04", date: "27 Mar 2025", amount: "$138.20", status: "paid", dueDate: "11 Apr 2025" },
  { id: "INV-2025-03", date: "27 Feb 2025", amount: "$156.80", status: "paid", dueDate: "14 Mar 2025" },
  { id: "INV-2025-02", date: "27 Jan 2025", amount: "$145.30", status: "paid", dueDate: "11 Feb 2025" },
];

const USAGE_DATA = [
  { period: "May 2025", electricity: "285 kWh", gas: "45 GJ", cost: "$142.50" },
  { period: "Apr 2025", electricity: "268 kWh", gas: "42 GJ", cost: "$138.20" },
  { period: "Mar 2025", electricity: "312 kWh", gas: "48 GJ", cost: "$156.80" },
  { period: "Feb 2025", electricity: "290 kWh", gas: "44 GJ", cost: "$145.30" },
];

function DataCell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}

function StatusCard({ label, value, icon, variant = "default" }: { label: string; value: string; icon: string; variant?: "default" | "success" | "info" }) {
  return (
    <div className={cn(
      "flex items-center gap-3 rounded-lg border p-4 shadow-none",
      variant === "success" ? "border-[#008000]/20 bg-[#D1FAE5]/30 dark:border-emerald-500/30 dark:bg-emerald-500/10" : 
      variant === "info" ? "border-[#0074C4]/20 bg-[#DBEAFE]/30 dark:border-blue-500/30 dark:bg-blue-500/10" : 
      "border-border bg-card dark:border-gray-800 dark:bg-gray-900/40"
    )}>
      <div className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        variant === "success" ? "bg-[#008000]/10 dark:bg-emerald-500/20" :
        variant === "info" ? "bg-[#0074C4]/10 dark:bg-blue-500/20" :
        "bg-gray-100 dark:bg-gray-800"
      )}>
        <Icon name={icon} size={20} className={cn(
          variant === "success" ? "text-[#008000] dark:text-emerald-300" :
          variant === "info" ? "text-[#0074C4] dark:text-blue-300" :
          "text-gray-600 dark:text-gray-300"
        )} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground dark:text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}

export default function SmallMarketPage() {
  const [tabValue, setTabValue] = useState("details");
  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const [activeNavId, setActiveNavId] = useState("dashboard");

  const allCardsOpen = DETAILS_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(DETAILS_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(DETAILS_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* App Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/TallyPlus.svg"
              alt="Tally+"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Center: Search */}
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

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80"
          >
            <Icon name="grid_view" size={20} />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">SA</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-w-0 flex-1 overflow-hidden">
      {/* Left Navigation Bar */}
      <aside className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="flex flex-col p-2">
          {LEFT_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNavId(item.id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                activeNavId === item.id
                  ? "bg-gray-100 text-gray-900 dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              )}
            >
              <Icon
                name={item.icon as "home"}
                size={20}
                className={cn(
                  "font-extralight transition-colors",
                  activeNavId === item.id
                    ? "text-gray-900 dark:text-[#7c8cb8]"
                    : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                )}
              />
              <span className="leading-tight">{item.label}</span>
            </button>
          ))}
        </nav>
        </div>
        <div className="shrink-0 border-t border-border p-3 dark:border-gray-800">
          <Image src="/PoweredByTallyBadgeDark.svg" alt="Powered by Tally" width={120} height={29} className="w-[120px] h-auto" />
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1600px] px-6 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="flex items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <Icon name="home" size={18} className="text-gray-600 dark:text-gray-400" />
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/pages"
                  className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Customers
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/pages/small-market"
                  className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Tally+ Small Market Accounts
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                104063774 - Shirley Anderson
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                104063774 - Shirley Anderson
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                1 Lee Walk, Cranbourne, VIC 3977
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Tally+ Small Market</Badge>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatusCard
            label="Account Balance"
            value="$0.00 Nothing Overdue"
            icon="account_balance_wallet"
            variant="success"
          />
          <StatusCard
            label="Account Status"
            value="Open - No Churn Activity"
            icon="check_circle"
            variant="info"
          />
          <StatusCard
            label="Billing Cycle"
            value="Monthly - Billed to 27 Apr 2025"
            icon="calendar_today"
          />
          <StatusCard
            label="Account Commenced"
            value="15 Apr 2025"
            icon="schedule"
          />
        </div>

        {/* Tabs */}
        <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
          <TabsList className="mb-6 h-10 flex-nowrap justify-start gap-1 rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
            {TAB_CONFIG.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account Details</h2>
              <button
                type="button"
                onClick={allCardsOpen ? collapseAll : expandAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                aria-label={allCardsOpen ? "Collapse all" : "Expand all"}
              >
                {allCardsOpen ? (
                  <>
                    <Icon name="unfold_less" size={18} />
                    Collapse all
                  </>
                ) : (
                  <>
                    <Icon name="unfold_more" size={18} />
                    Expand all
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Main Content */}
              <div className="space-y-6 lg:col-span-8">
                <CollapsibleCard
                  title="Account Summary"
                  open={cardOpenState["Account Summary"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account Summary": open }))}
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <DataCell label="Account Type" value="Residential" />
                    <DataCell label="Protection Classification" value="Tally+ Small Market" />
                    <DataCell label="Journal Segment" value="Residential" />
                    <DataCell label="Credit Status" value="Standard" />
                    <DataCell label="Account Status" value="Open" />
                    <DataCell label="Commence Date" value="15 Apr 2025" />
                    <DataCell label="Move In Date" value="15 Apr 2025" />
                    <DataCell label="Occupancy Type" value="Owner Occupied" />
                    <DataCell label="Life Support" value="No" />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Billing Configuration"
                  open={cardOpenState["Billing Configuration"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Billing Configuration": open }))}
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Select label="Bill Group" value="monthly">
                        <option value="monthly">Monthly Bill Group</option>
                        <option value="quarterly">Quarterly Bill Group</option>
                      </Select>
                      <Input label="Invoice Due Days" type="number" defaultValue="15" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Select label="Correspondence Delivery" value="email">
                        <option value="email">Email</option>
                        <option value="post">Post</option>
                        <option value="both">Both</option>
                      </Select>
                      <Input label="Invoice Template" defaultValue="Standard Residential" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Custom Invoice Message
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        rows={3}
                        defaultValue="The Australian Government and your State Government require us to provide you with information about energy rebates and concessions."
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <Checkbox label="Override Due Days" />
                      <Checkbox label="Sensitive Load" />
                    </div>
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Payment Details"
                  open={cardOpenState["Payment Details"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Payment Details": open }))}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select label="Payment Frequency" value="monthly">
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </Select>
                    <Input label="Payment Method" defaultValue="Direct Debit" />
                    <Input label="Next Payment Date" type="date" defaultValue="2025-05-28" />
                    <Input label="Payment Amount" defaultValue="$142.50" />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Contact Information"
                  open={cardOpenState["Contact Information"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Contact Information": open }))}
                >
                  <div className="mb-4 flex items-center justify-between rounded-lg border border-border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Mr Shirley Anderson</p>
                      <p className="mt-1 text-xs text-muted-foreground">Primary Contact since 14 Apr 2025</p>
                    </div>
                    <Badge variant="info">Primary</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Icon name="phone" size={18} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">0491 579 760</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="email" size={18} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">shirley.anderson@email.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="badge" size={18} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">31680432</span>
                    </div>
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Service Address"
                  open={cardOpenState["Service Address"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Service Address": open }))}
                >
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Service Address</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">1 Lee Walk</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Cranbourne, VIC 3977</p>
                        </div>
                        <button className="text-[#2C365D] hover:text-[#2C365D]/80">
                          <Icon name="edit" size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Postal Address</p>
                          <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">666-678 Lygon Street</p>
                          <p className="text-sm text-gray-900 dark:text-gray-100">Carlton North, VIC 3054</p>
                        </div>
                        <button className="text-[#2C365D] hover:text-[#2C365D]/80">
                          <Icon name="edit" size={18} />
                        </button>
                      </div>
                    </div>
                    <DataCell label="NMI - National Meter ID" value="6305194250" />
                  </div>
                </CollapsibleCard>

                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>

              {/* Sidebar - Account Events */}
              <div className="lg:col-span-4">
                <Card className="shadow-none">
                  <CardHeader className="border-b border-border pb-4 dark:border-gray-700">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">Account Events</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border dark:divide-gray-700">
                      {ACCOUNT_EVENTS.map((event) => (
                        <div key={event.id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2C365D]/10 dark:bg-[#7c8cb8]/20">
                              <Icon name="event" size={16} className="text-[#2C365D] dark:text-[#7c8cb8]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{event.event}</p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {event.date} • Performed by {event.performer}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="mt-0">
            <div className="space-y-6">
              <Card className="shadow-none">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">Recent Bills</CardTitle>
                    <Button variant="outline" size="sm">
                      <Icon name="download" size={16} className="mr-1" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                        <TableHead className="pl-6">Invoice ID</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="pr-6">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {RECENT_BILLS.map((bill) => (
                        <TableRow key={bill.id}>
                          <TableCell className="pl-6 font-medium text-gray-900 dark:text-gray-100">{bill.id}</TableCell>
                          <TableCell>{bill.date}</TableCell>
                          <TableCell>{bill.dueDate}</TableCell>
                          <TableCell className="font-medium">{bill.amount}</TableCell>
                          <TableCell className="pr-6">
                            <Badge variant={bill.status === "paid" ? "success" : "warning"}>
                              {bill.status === "paid" ? "Paid" : "Pending"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="mt-0">
            <div className="space-y-6">
              <Card className="shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">Usage History</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                        <TableHead className="pl-6">Period</TableHead>
                        <TableHead>Electricity</TableHead>
                        <TableHead>Gas</TableHead>
                        <TableHead className="pr-6">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {USAGE_DATA.map((usage) => (
                        <TableRow key={usage.period}>
                          <TableCell className="pl-6 font-medium text-gray-900 dark:text-gray-100">{usage.period}</TableCell>
                          <TableCell>{usage.electricity}</TableCell>
                          <TableCell>{usage.gas}</TableCell>
                          <TableCell className="pr-6 font-medium">{usage.cost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other Tabs */}
          {TAB_CONFIG.filter((t) => !["details", "financial", "usage"].includes(t.value)).map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-none dark:border-gray-700 dark:bg-gray-900/40">
                <p className="capitalize">{tab.label} content would go here.</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        </div>
      </div>
      </div>
    </div>
  );
}
