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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/Collapsible/Collapsible";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ToggleGroup/ToggleGroup";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import Select from "@/components/Select/Select";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/* ========== DATA ========== */
const SERVICE_TAGS = [
  { label: "Vulnerable", className: "bg-red-100 text-red-800" },
  { label: "Hardship", className: "bg-orange-100 text-orange-800" },
  { label: "Life Support", className: "bg-blue-100 text-blue-800" },
  { label: "Family Violence", className: "bg-purple-100 text-purple-800" },
  { label: "Active complaint", className: "bg-red-200 text-red-900" },
  { label: "Ombudsman", className: "bg-amber-700/20 text-amber-900" },
];

// Compact navigation items – aligned with Tally Small Market left nav
const COMPACT_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "tasks", label: "Tasks & Exceptions", icon: "notifications" },
  { id: "market", label: "Market", icon: "store" },
  { id: "adjustments", label: "Adjustments", icon: "tune" },
  { id: "metering", label: "Metering Services Registry", icon: "table_chart" },
  { id: "reports", label: "Reports", icon: "assessment" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "maintenance", label: "Maintenance", icon: "build" },
];

const SERVICES = [
  { address: "1/123 Smith St, Fitzroy, VIC, 3066", account: "10111521616108", status: "OPEN", balance: "-$144.74 Credit", tags: ["Vulnerable", "Hardship"] },
  { address: "2/456 Jones Rd, Carlton, VIC, 3053", account: "10111521616109", status: "CLOSED TRANSFERRED", balance: "$144.74 Owing", tags: ["Life Support"] },
  { address: "3/789 Collins St, Melbourne, VIC, 3000", account: "10111521616110", status: "OPEN", balance: "$0.00", tags: [] },
];

const LOAD_DISAGG = [
  { category: "Heating/Cooling", percent: 30, color: "bg-orange-500" },
  { category: "Entertainment / Digital", percent: 20, color: "bg-gray-500" },
  { category: "Laundry", percent: 15, color: "bg-blue-500" },
  { category: "Kitchen", percent: 15, color: "bg-purple-300" },
  { category: "Pool Pump", percent: 5, color: "bg-green-500" },
  { category: "Hot water", percent: 5, color: "bg-pink-500" },
  { category: "Rest", percent: 10, color: "bg-gray-700" },
];

const OVERVIEW_CARD_TITLES = [
  "Sub-Overview",
  "Plan Details",
  "Bill Information",
  "PDF Bill",
] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  OVERVIEW_CARD_TITLES.map((title) => [title, true])
);

const ADORA_INSIGHTS = [
  { title: "Estimated bill", desc: "Difference between estimated and actual readings for December 2024." },
  { title: "Rebates", desc: "Loss of government rebate: $435 less rebate this March compared to August." },
  { title: "Solar", desc: "Reduced solar credits: Solar credits decreased from $35 in August to $15 in March." },
  { title: "Daily Consumption", desc: "Increased daily consumption: Average daily cost increased from $0.74 in December to $9.75 in March." },
  { title: "Daily Average", desc: "Higher average daily usage: Average daily usage jumped from 16.3 kWh in December to 26.9 kWh in March." },
];

/* ========== HELPERS ========== */
function DataCell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value || "—"}</span>
    </div>
  );
}

function LoadDisaggBar({ category, percent, color }: { category: string; percent: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="min-w-[140px] text-sm text-gray-700">{category}</span>
      <div className="flex-1 min-w-0">
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${percent}%` }} />
        </div>
      </div>
      <span className="w-10 text-right text-sm font-medium text-gray-900">{percent}%</span>
    </div>
  );
}

export default function TallyGlassPage() {
  const [billTab, setBillTab] = useState("load-disagg");
  const [loadUnit, setLoadUnit] = useState("percent");
  const [servicesOpen, setServicesOpen] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(true);
  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const [activeNavId, setActiveNavId] = useState("dashboard");

  const allCardsOpen = OVERVIEW_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-white px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/GlassLogoTest.svg"
              alt="Tally Glass"
              width={98}
              height={30}
              className="h-6 w-auto"
              priority
            />
          </Link>
          <div className="relative hidden w-80 md:block">
            <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search Tally"
              className="h-10 w-full rounded-lg border border-border bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#2C365D] focus:outline-none focus:ring-1 focus:ring-[#2C365D]"
            />
          </div>
        </div>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">BB</AvatarFallback>
        </Avatar>
      </header>

      {/* 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Compact Navigation Bar */}
        <aside className="flex w-16 shrink-0 flex-col items-center border-r border-border bg-white py-4">
          <nav className="flex flex-1 flex-col items-center gap-2">
            {COMPACT_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNavId(item.id)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900",
                  activeNavId === item.id && "bg-gray-100 text-gray-900"
                )}
                aria-label={item.label}
                aria-pressed={activeNavId === item.id}
              >
                <Icon name={item.icon as "home"} size={20} className="font-extralight" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Left Sidebar – Ronald Thomas details */}
        <aside className="flex w-80 shrink-0 flex-col overflow-hidden border-r border-border bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* User Profile */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Ronald Thomas</h2>
                <Icon name="verified" size={18} className="text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">100 039 340 • South Australia</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="calendar_today" size={16} className="text-gray-500" />
                  <span>01 - June - 1960 | 65</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="mail" size={16} className="text-gray-500" />
                  <span className="truncate">ronald_thomas12345@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="phone" size={16} className="text-gray-500" />
                  <span>0464 464 646</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="directions_car" size={16} className="text-gray-500" />
                  <span>4795</span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>05 - Apr - 2008</p>
                <p>02 - Feb - 2025</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Payer rating</span>
                <Badge variant="success">Excellent</Badge>
              </div>
            </div>

            {/* Services */}
            <Collapsible open={servicesOpen} onOpenChange={setServicesOpen}>
              <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900">
                Services
                <Icon name={servicesOpen ? "expand_less" : "expand_more"} size={20} className="text-gray-500 transition-colors group-hover:text-gray-900" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-3">
                  {SERVICES.map((svc) => (
                    <div key={svc.account} className="rounded-lg border border-border bg-gray-50 p-3">
                      <p className="text-sm font-medium text-gray-900">{svc.address}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{svc.account}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">{svc.status}</Badge>
                        <span className={cn("text-sm font-medium", svc.balance.startsWith("-") ? "text-green-600" : "text-gray-900")}>
                          {svc.balance}
                        </span>
                      </div>
                      {svc.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {svc.tags.map((t) => {
                            const tagConfig = SERVICE_TAGS.find((st) => st.label === t);
                            return (
                              <span
                                key={t}
                                className={cn("rounded px-1.5 py-0.5 text-xs font-medium", tagConfig?.className ?? "bg-gray-200 text-gray-700")}
                              >
                                {t}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Payment Methods */}
            <Collapsible open={paymentOpen} onOpenChange={setPaymentOpen}>
              <CollapsibleTrigger className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900">
                Payment methods
                <Icon name={paymentOpen ? "expand_less" : "expand_more"} size={20} className="text-gray-500 transition-colors group-hover:text-gray-900" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox defaultChecked />
                    <Image src="/PaymentMethod_VISA.svg" alt="Visa" width={46} height={32} className="h-8 w-auto" />
                    <span className="text-sm">ending in 1234 Expiry 06/2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox />
                    <Image src="/PaymentMethod_MasterCard.svg" alt="Mastercard" width={46} height={32} className="h-8 w-auto" />
                    <span className="text-sm">ending in 1234 Expiry 06/2025</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox />
                    <Image src="/PaymentMethod_PayPal.svg" alt="PayPal" width={46} height={32} className="h-8 w-auto" />
                    <span className="text-sm">PayPal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox />
                    <Image src="/PaymentMethod_DirectDebit.svg" alt="Direct Debit" width={46} height={32} className="h-8 w-auto" />
                    <span className="text-sm">Direct debit Expiry 06/2025</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Icon name="add" size={16} className="mr-1" />
                    Add new payment method
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-6 py-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/pages" className="text-gray-700 hover:text-gray-900">Customer Profile</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-gray-900">Ronald Thomas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="mb-4 h-10 bg-gray-100 p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  {/* Address Header */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded p-1 text-gray-500 hover:bg-gray-100">
                        <Icon name="arrow_back" size={20} />
                      </button>
                      <h1 className="text-xl font-semibold text-gray-900">1/123 Smith St, Fitzroy, VIC, 3066</h1>
                    </div>
                    <button
                      type="button"
                      onClick={allCardsOpen ? collapseAll : expandAll}
                      className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
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

                  {/* Sub-Overview Card */}
                  <CollapsibleCard
                    title="Sub-Overview"
                    open={cardOpenState["Sub-Overview"]}
                    onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Sub-Overview": open }))}
                    showMenu={false}
                  >
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-900">1/123 Smith St, Fitzroy, VIC, 3066</p>
                      <p className="text-sm text-muted-foreground">10111521616108</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">OPEN</Badge>
                        {SERVICE_TAGS.slice(0, 6).map((t) => (
                          <span key={t.label} className={cn("rounded px-2 py-0.5 text-xs font-medium", t.className)}>
                            {t.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CollapsibleCard>

                  {/* Plan Details */}
                  <CollapsibleCard
                    title="Plan Details"
                    open={cardOpenState["Plan Details"]}
                    onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Plan Details": open }))}
                    showMenu={false}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <DataCell label="Plan name" value="Home plan, 20101203013" />
                      <DataCell label="Best offer" value="Currently on best offer" />
                      <DataCell label="Quarter billing" value="Billed to 05 Feb 2025" />
                      <DataCell label="Account commence" value="04 May 2024" />
                    </div>
                  </CollapsibleCard>

                  {/* Bill Information */}
                  <CollapsibleCard
                    title="Bill Information"
                    open={cardOpenState["Bill Information"]}
                    onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Bill Information": open }))}
                    showMenu={false}
                  >
                    <Tabs value={billTab} onValueChange={setBillTab}>
                      <div className="mb-4 flex flex-row items-center justify-between">
                        <TabsList className="h-9 bg-transparent p-0">
                          <TabsTrigger value="overview" className="rounded-md data-[state=active]:bg-gray-100">Bill Overview</TabsTrigger>
                          <TabsTrigger value="load-disagg" className="rounded-md data-[state=active]:bg-gray-100">Load disagg</TabsTrigger>
                          <TabsTrigger value="usage" className="rounded-md data-[state=active]:bg-gray-100">Usage</TabsTrigger>
                        </TabsList>
                        <div className="w-40">
                          <Select defaultValue="latest">
                            <option value="latest">Latest bill</option>
                          </Select>
                        </div>
                      </div>
                      <TabsContent value="overview" className="mt-0">
                        <p className="py-8 text-center text-sm text-muted-foreground">Bill overview content</p>
                      </TabsContent>
                      <TabsContent value="load-disagg" className="mt-0">
                        <div className="space-y-4">
                          <div className="flex items-center justify-end gap-1">
                            <ToggleGroup type="single" value={loadUnit} onValueChange={(v) => { if (typeof v === "string") setLoadUnit(v); }}>
                              <ToggleGroupItem value="dollar" className="rounded-l-md px-2 py-1 text-xs">$</ToggleGroupItem>
                              <ToggleGroupItem value="percent" className="px-2 py-1 text-xs">%</ToggleGroupItem>
                              <ToggleGroupItem value="kwh" className="rounded-r-md px-2 py-1 text-xs">kWh</ToggleGroupItem>
                            </ToggleGroup>
                          </div>
                          <div className="space-y-4">
                            {LOAD_DISAGG.map((item) => (
                              <LoadDisaggBar key={item.category} category={item.category} percent={item.percent} color={item.color} />
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="usage" className="mt-0">
                        <p className="py-8 text-center text-sm text-muted-foreground">Usage content</p>
                      </TabsContent>
                    </Tabs>
                  </CollapsibleCard>

                  {/* PDF Bill */}
                  <CollapsibleCard
                    title="PDF Bill"
                    open={cardOpenState["PDF Bill"]}
                    onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "PDF Bill": open }))}
                    showMenu={false}
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">12 Nov 2024 to 05 Feb 2025</p>
                      <div className="rounded-lg border border-border bg-gray-100 p-8">
                        <div className="mx-auto max-w-lg space-y-4 rounded bg-white p-6 shadow-sm">
                          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Electricity account</h3>
                            <div className="h-16 w-48 rounded bg-gray-300" aria-hidden />
                          </div>
                          <p className="text-sm text-muted-foreground">EnergyAustralia LIGHT THE WAY</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <DataCell label="Customer number" value="100 039 340" />
                            <DataCell label="Account number" value="10111521616108" />
                            <DataCell label="Service address" value="1/123 Smith St, Fitzroy, VIC, 3066" />
                            <DataCell label="Tax invoice issue date" value="05 Feb 2025" />
                          </div>
                          <div className="rounded-lg bg-green-50 p-4">
                            <p className="text-sm font-semibold text-gray-900">Due date 15 Jan 2017</p>
                            <p className="text-sm text-muted-foreground">Total amount if paid after due date $316.16</p>
                            <p className="text-sm font-medium text-green-700">Total amount with discount if paid by due date $248.41</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleCard>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground shadow-none">
                  <p>Timeline content would go here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Right Sidebar - Adora */}
        <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-white">
          <div className="flex flex-col p-4">
            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Icon name="smart_toy" size={24} className="text-[#2C365D]" />
                <span className="font-semibold text-gray-900">Adora</span>
              </div>
              <span className="text-sm text-muted-foreground">15:55</span>
              <Badge variant="success" className="text-xs">Call in progress</Badge>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {ADORA_INSIGHTS.map((insight) => (
                <Card key={insight.title} className="shadow-none">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                    <p className="mt-1 text-xs text-muted-foreground">{insight.desc}</p>
                    <div className="mt-2 flex gap-2">
                      <button type="button" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Thumbs up">
                        <Icon name="thumb_up" size={16} />
                      </button>
                      <button type="button" className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" aria-label="Thumbs down">
                        <Icon name="thumb_down" size={16} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <Input placeholder="Ask Adora" className="mb-2" />
              <p className="text-xs text-muted-foreground">Adora can make mistakes. Check important info.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
