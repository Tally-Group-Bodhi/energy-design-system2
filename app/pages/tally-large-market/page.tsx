"use client";

import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/DropdownMenu/DropdownMenu";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import { cn } from "@/lib/utils";

const TAB_CONFIG = [
  { value: "overview", label: "Overview" },
  { value: "contacts", label: "Contacts" },
  { value: "contracts", label: "Contracts" },
  { value: "dunning", label: "Dunning" },
  { value: "payment-plan", label: "Payment Plan" },
  { value: "corro-suppressions", label: "Corro Suppressions" },
  { value: "site", label: "Site" },
  { value: "usage", label: "Usage" },
  { value: "more", label: "more" },
];

const VISIBLE_TABS_BEFORE_MORE = 5;
const TABS_IN_MORE = TAB_CONFIG.slice(VISIBLE_TABS_BEFORE_MORE);
const TABS_VISIBLE_ON_MD = TAB_CONFIG.slice(0, VISIBLE_TABS_BEFORE_MORE);
const isTabInMore = (value: string) => TABS_IN_MORE.some((t) => t.value === value);

const OVERVIEW_CARD_TITLES = [
  "Snapshot",
  "Account details",
  "Business information",
  "Suppress dunning",
  "Primary contact",
  "Key dates",
  "Additional details",
  "Account options",
] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  OVERVIEW_CARD_TITLES.map((title) => [title, true])
);

const INTERACTIONS = [
  { id: 1, title: "Billing configuration changed", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 2, title: "Billing Hold Reason Removed", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 3, title: "Account set to Billing as of 29/03/2024 as per TSD-35353.", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 4, title: "Missing Start/End Dates", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
];

const CARD_GRID_CLASS = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3";

function DataCell({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || "—"}</span>
    </div>
  );
}

function SnapshotDataCell({ label, primaryValue, secondaryDetail, className }: { label: string; primaryValue: React.ReactNode; secondaryDetail?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-base font-bold text-gray-900">{primaryValue}</span>
      {secondaryDetail != null && secondaryDetail !== "" && <span className="text-sm text-muted-foreground">{secondaryDetail}</span>}
    </div>
  );
}

export default function TallyLargeMarketPage() {
  const [tabValue, setTabValue] = React.useState("overview");
  const [cardOpenState, setCardOpenState] = React.useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const currentTabLabel = TAB_CONFIG.find((t) => t.value === tabValue)?.label ?? "Overview";

  const allCardsOpen = OVERVIEW_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
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
                <Link href="/pages" className="text-gray-700 transition-colors hover:text-gray-900">Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/pages/tally-large-market" className="text-gray-700 transition-colors hover:text-gray-900">Accounts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900">
                QB00171824 - Masked_Name_44D550D62
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
          QB00171824 - Masked_Name_44D550D62
        </h1>

        <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
          {/* Small screens: single menu with all tabs */}
          <div className="mb-4 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-border bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2">
                <span>{currentTabLabel}</span>
                <Icon name="expand_more" size={20} className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[12rem] max-h-[min(70vh,20rem)] overflow-y-auto">
                {TAB_CONFIG.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => setTabValue(tab.value)}
                    className={cn(tab.value === tabValue && "bg-gray-100 font-medium text-[#2C365D]")}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Md to xl: first N tabs + More dropdown */}
          <TabsList className="mb-4 hidden h-10 flex-nowrap justify-start gap-1 overflow-visible rounded-lg bg-gray-100 p-1 text-gray-600 md:flex xl:hidden">
            {TABS_VISIBLE_ON_MD.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
            <DropdownMenu>
              <div className="relative z-10">
                <DropdownMenuTrigger
                  className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2",
                    isTabInMore(tabValue) ? "bg-white text-[#2C365D] shadow-sm" : "text-gray-600 hover:text-gray-900"
                  )}
                  aria-label="More tabs"
                >
                  More
                  <Icon name="expand_more" size={18} className="ml-0.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[12rem] max-h-[min(70vh,20rem)] overflow-y-auto">
                  {TABS_IN_MORE.map((tab) => (
                    <DropdownMenuItem
                      key={tab.value}
                      onClick={() => setTabValue(tab.value)}
                      className={cn(tab.value === tabValue && "bg-gray-100 font-medium text-[#2C365D]")}
                    >
                      {tab.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </div>
            </DropdownMenu>
          </TabsList>
          {/* Xl and up: all tabs */}
          <TabsList className="mb-4 hidden h-10 flex-nowrap justify-start gap-1 overflow-hidden rounded-lg bg-gray-100 p-1 text-gray-600 xl:flex">
            {TAB_CONFIG.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
              <button
                type="button"
                onClick={allCardsOpen ? collapseAll : expandAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="min-w-0 space-y-6">
                <CollapsibleCard
                  title="Snapshot"
                  open={cardOpenState["Snapshot"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, Snapshot: open }))}
                >
                  <div className={CARD_GRID_CLASS}>
                    <SnapshotDataCell label="Account created" primaryValue="10/11/2022" secondaryDetail="7 months ago" />
                    <SnapshotDataCell label="Last invoice" primaryValue="$47.83" secondaryDetail="On 02/12/2022" />
                    <SnapshotDataCell label="Current invoice" primaryValue="$50.10" secondaryDetail="Since 02/12/2022" />
                    <SnapshotDataCell label="Last payment" primaryValue="$50.10" secondaryDetail="on 07/06/2023" />
                    <SnapshotDataCell label="Account balance" primaryValue="-$200.58" />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Account details"
                  open={cardOpenState["Account details"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account details": open }))}
                >
                  <div className={CARD_GRID_CLASS}>
                    <DataCell label="Account type" value="Residential" />
                    <DataCell label="Account status" value="Billing" />
                    <DataCell label="Parent account" value="Residential" />
                    <DataCell label="Site nickname" value="Residential" />
                    <DataCell label="Supply address" value="129 Springwood Rd, Springwood QLD 4127" />
                    <DataCell label="NMI - National Meter ID" value="Residential" />
                    <Checkbox label="Hardship" defaultChecked />
                    <Checkbox label="Ombudsman" defaultChecked />
                    <Checkbox label="CDR eligible" defaultChecked />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Business information"
                  open={cardOpenState["Business information"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Business information": open }))}
                >
                  <div className={CARD_GRID_CLASS}>
                    <DataCell label="Business name" value="AMPOL FOODARY GUMLY GUMLY" />
                    <DataCell label="ABN/ACN" value="64000175342" />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Suppress dunning"
                  open={cardOpenState["Suppress dunning"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Suppress dunning": open }))}
                >
                  <p className="text-sm text-muted-foreground">No active dunning present for this account</p>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Primary contact"
                  open={cardOpenState["Primary contact"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Primary contact": open }))}
                >
                  <div className={CARD_GRID_CLASS}>
                    <DataCell label="Contact type" value="Primary" />
                    <DataCell label="Full name" value="Justine Masked_Name_32BB 8EED194" />
                    <DataCell label="Supply address" value="129 Springwood Rd, Springwood QLD 4127" />
                  </div>
                </CollapsibleCard>

                <CollapsibleCard
                  title="Key dates"
                  open={cardOpenState["Key dates"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Key dates": open }))}
                />
                <CollapsibleCard
                  title="Additional details"
                  open={cardOpenState["Additional details"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Additional details": open }))}
                />
                <CollapsibleCard
                  title="Account options"
                  open={cardOpenState["Account options"]}
                  onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account options": open }))}
                />
              </div>

              <div className="flex min-w-0 flex-col">
                <Card className="flex w-full min-w-0 flex-col shadow-none">
                  <CardHeader className="w-full space-y-0 border-b border-border pb-4">
                    <CardTitle className="text-base font-bold text-gray-900">Interactions</CardTitle>
                    <div className="mt-3 w-full">
                      <div className="relative flex w-full min-w-0 items-center overflow-visible rounded-lg border border-gray-200 bg-white">
                        <div className="flex shrink-0 items-center py-2 pl-3 pr-4">
                          <Icon name="search" size={20} className="text-gray-500" />
                        </div>
                        <Input placeholder="Search" className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent pl-0 pr-12 text-sm !border-0 shadow-none outline-none focus-visible:ring-0" />
                        <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100" title="Filter" aria-label="Filter">
                          <Icon name="tune" size={20} />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-4">
                    {INTERACTIONS.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 rounded-lg bg-gray-100 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="mt-0.5 text-sm text-gray-600">{item.category}</p>
                            <Button variant="outline" size="sm" className="mt-2 rounded-lg border-gray-200 bg-white font-normal text-gray-900 hover:bg-gray-50">
                              <Icon name="add" size={16} className="mr-1" /> Add
                            </Button>
                          </div>
                          <div className="flex shrink-0 flex-col items-end text-right">
                            <span className="text-sm font-medium text-gray-900">{item.user}</span>
                            <span className="mt-0.5 text-xs text-gray-500">{item.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-gray-200 pt-2">
                          <span className="text-sm font-medium text-gray-900">2 interactions</span>
                          <span className="rounded bg-[#0074C4] px-2 py-0.5 text-xs font-medium text-white">11223344</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {TAB_CONFIG.filter((t) => t.value !== "overview").map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
                <p className="capitalize">{tab.label} content would go here.</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
