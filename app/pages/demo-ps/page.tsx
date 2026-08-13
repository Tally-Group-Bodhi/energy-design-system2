"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage as BreadcrumbCurrentPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/Collapsible/Collapsible";
import Select from "@/components/Select/Select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";
import Checkbox from "@/components/Checkbox/Checkbox";
import Badge from "@/components/Badge/Badge";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Avatar/Avatar";
import { cn } from "@/lib/utils";

/** Left nav icons matching reference: Home, Property, Profile, Document, Card, Chart, Trend, Profile, Audit, Product, Settings, Upload. Design system Material Symbols Outlined. */
const LEFT_NAV_ITEMS = [
  { id: "home", icon: "home", ariaLabel: "Home" },
  { id: "property", icon: "real_estate_agent", ariaLabel: "Property" },
  { id: "profile", icon: "person", ariaLabel: "Profile" },
  { id: "documents", icon: "description", ariaLabel: "Documents" },
  { id: "payments", icon: "credit_card", ariaLabel: "Payments" },
  { id: "analytics", icon: "bar_chart", ariaLabel: "Analytics" },
  { id: "trends", icon: "trending_up", ariaLabel: "Trends" },
  { id: "account", icon: "person", ariaLabel: "Account" },
  { id: "audit", icon: "find_in_page", ariaLabel: "Audit" },
  { id: "products", icon: "inventory_2", ariaLabel: "Products" },
  { id: "settings", icon: "settings", ariaLabel: "Settings" },
  { id: "upload", icon: "upload", ariaLabel: "Upload" },
];

/** Tab config aligned with Tally Large Market template */
const RIGHT_PANEL_ITEMS = [
  { id: "actions", label: "Actions", icon: "bolt" as const },
  { id: "exceptions", label: "Exceptions", icon: "diamond" as const },
  { id: "tasks", label: "Tasks", icon: "task" as const },
];

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

const INITIAL_CARD_OPEN: Record<string, boolean> = {
  ...Object.fromEntries(OVERVIEW_CARD_TITLES.map((title) => [title, true])),
  "Additional details": false,
};

const INTERACTIONS = [
  { id: 1, title: "Billing configuration changed", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 2, title: "Billing Hold Reason Removed", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 3, title: "Account set to Billing as of 29/03/2024 as per TSD-35353.", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
  { id: 4, title: "Missing Start/End Dates", category: "Billing", user: "Pooja Ahuja", time: "3 hours ago" },
];

const CONTACTS_DATA = [
  { id: 1, name: "Phoenix Baker", dob: "12/04/1990", badge: "Primary", badgeVariant: "default" as const, details: { contactType: "Primary", fullName: "Phoenix Barker", dateOfBirth: "12/04/1990", landlineServiceComment: "Residential", mobileServiceComment: "Billing", preferredContactMethod: "Residential", landlinePhone: "03555506536", mobilePhone: "04123456789", verificationPassphrase: "Not Set", email: "Phoenixbarker12345@gmail.com", address: "29 - 35 Collingwood Road, Collingwood VIC 3066", customerNumber: "10953", cdnContact: "No", externalRef: "Residential" } },
  { id: 2, name: "Ethan Chang", dob: "12/04/1990", badge: "Secondary", badgeVariant: "secondary" as const, details: { contactType: "Secondary", fullName: "Ethan Chang", dateOfBirth: "12/04/1990", landlineServiceComment: "Residential", mobileServiceComment: "Residential", preferredContactMethod: "Email", landlinePhone: "03555509821", mobilePhone: "04198765432", verificationPassphrase: "Set", email: "ethan.chang@email.com", address: "15 Collins Street, Melbourne VIC 3000", customerNumber: "10954", cdnContact: "No", externalRef: "Residential" } },
  { id: 3, name: "Olivia Johnson", dob: "12/04/1990", badge: "CDN", badgeVariant: "info" as const, details: { contactType: "CDN", fullName: "Olivia Johnson", dateOfBirth: "12/04/1990", landlineServiceComment: "Business", mobileServiceComment: "Residential", preferredContactMethod: "Phone", landlinePhone: "03555501234", mobilePhone: "04111222333", verificationPassphrase: "Not Set", email: "olivia.johnson@business.com", address: "42 Bourke Street, Melbourne VIC 3000", customerNumber: "10955", cdnContact: "Yes", externalRef: "Business" } },
  { id: 4, name: "Aiden Smith", dob: "12/04/1990", badge: "Additional", badgeVariant: "info" as const, details: { contactType: "Additional", fullName: "Aiden Smith", dateOfBirth: "12/04/1990", landlineServiceComment: "Residential", mobileServiceComment: "Residential", preferredContactMethod: "Residential", landlinePhone: "03555507890", mobilePhone: "04155566777", verificationPassphrase: "Set", email: "aiden.smith@email.com", address: "8 Flinders Lane, Melbourne VIC 3000", customerNumber: "10956", cdnContact: "No", externalRef: "Residential" } },
  { id: 5, name: "Luna Martinez", dob: "12/04/1990", badge: "Additional", badgeVariant: "info" as const, details: { contactType: "Additional", fullName: "Luna Martinez", dateOfBirth: "12/04/1990", landlineServiceComment: "Residential", mobileServiceComment: "Billing", preferredContactMethod: "Email", landlinePhone: "03555504567", mobilePhone: "04188899000", verificationPassphrase: "Not Set", email: "luna.martinez@email.com", address: "103 Lygon Street, Carlton VIC 3053", customerNumber: "10957", cdnContact: "No", externalRef: "Residential" } },
];

const CARD_GRID_CLASS = "grid grid-cols-1 gap-density-lg sm:grid-cols-2 lg:grid-cols-3";

function DataCell({ label, value, asLink, className }: { label: string; value: React.ReactNode; asLink?: boolean; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-density-xs text-density-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      {asLink && value ? (
        <Link href="#" className="font-semibold text-[#0074C4] hover:underline dark:text-[#60a5fa]">{value}</Link>
      ) : (
        <span className="font-semibold text-foreground">{value || "—"}</span>
      )}
    </div>
  );
}

function SnapshotDataCell({ label, primaryValue, secondaryDetail, primaryValueClassName, className }: { label: string; primaryValue: React.ReactNode; secondaryDetail?: React.ReactNode; primaryValueClassName?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-0.5 text-density-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("text-density-base font-bold", primaryValueClassName ?? "text-gray-900 dark:text-gray-100")}>{primaryValue}</span>
      {secondaryDetail != null && secondaryDetail !== "" && <span className="text-density-sm text-muted-foreground">{secondaryDetail}</span>}
    </div>
  );
}

const ACCOUNT_NAME = "QB00171824 - Masked_Name_44D550D62";

/** Mock stopped transfers for Home > My Queues */
const STOPPED_TRANSFERS = [
  { id: 1, accountName: "Masked_Name_24615C90D9", accountNo: "CHILD345", site: "4103690710", siteLabel: "DORCHESTER APARTMENTS, CENTRE COURT-BUILDING D, MSB D, 1-11 LOT 1 LYONPARK RD, NORTH RYDE NSW 2113" },
  { id: 2, accountName: "Masked_Name_88A2B1C3E4", accountNo: "CHILD401", site: "4103690711", siteLabel: "12 COLLINS ST, MELBOURNE VIC 3000" },
  { id: 3, accountName: "Masked_Name_55D66E77F8", accountNo: "CHILD502", site: "4103690712", siteLabel: "5 GEORGE ST, SYDNEY NSW 2000" },
];

export default function DemoPsCustomerAccountPage() {
  const [activeNavId, setActiveNavId] = useState("home");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true);
  const [myTaskOpen, setMyTaskOpen] = useState(true);
  const [myQueuesOpen, setMyQueuesOpen] = useState(true);
  const [stoppedTransfersOpen, setStoppedTransfersOpen] = useState(true);
  const [tabValue, setTabValue] = useState("overview");
  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);
  const [selectedContactId, setSelectedContactId] = useState(1);
  const selectedContact = CONTACTS_DATA.find((c) => c.id === selectedContactId) ?? CONTACTS_DATA[0];
  const allCardsOpen = OVERVIEW_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Top App Bar — fixed at top, does not scroll */}
      <header className="flex h-14 shrink-0 items-center gap-density-md border-b border-white/10 bg-[#1A2238] px-density-xl">
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/TallyPSDemoLogo.svg"
            alt="Tally PS Demo"
            width={50}
            height={21}
            className="h-[21px] w-auto"
            priority
          />
        </Link>
        <div className="relative flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
            />
            <input
              type="search"
              placeholder="Search by address, account number or customer id"
              className="h-10 w-full rounded-density-lg border border-white/20 bg-white/10 pl-10 pr-density-md text-density-sm text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-1 focus:ring-white/40"
            />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-density-md">
          <button
            type="button"
            className="rounded p-density-sm text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Icon name="notifications" size={20} />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar-demo-ps.png" alt="Profile" />
            <AvatarFallback className="bg-white/20 text-white">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {/* Left Navigation — fixed height, footer stays at bottom of viewport */}
        <aside
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-r border-border bg-white transition-[width] duration-200 dark:border-gray-800 dark:bg-gray-950",
            navCollapsed ? "w-16" : "w-64"
          )}
        >
          <nav className="flex min-h-0 flex-1 flex-col items-center gap-density-xs overflow-y-auto py-density-sm">
            {LEFT_NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNavId(item.id)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  activeNavId === item.id
                    ? "bg-[#E6F7FF] text-[#006180] dark:bg-[#006180]/20 dark:text-[#80E0FF]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                )}
                aria-label={item.ariaLabel}
              >
                <Icon name={item.icon} size={20} />
              </button>
            ))}
          </nav>

          {/* Footer: question mark, divider above profile, profile (with status), expand/collapse — fixed at bottom of viewport */}
          <div className="flex shrink-0 flex-col items-center gap-density-sm p-density-sm">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Help"
            >
              <span className="text-base font-medium">?</span>
            </button>
            <div className="w-full border-t border-border dark:border-gray-700" />
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatar-demo-ps.png" alt="Profile" />
                <AvatarFallback className="bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300">U</AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-gray-900"
                aria-hidden
              />
            </div>
            <button
              type="button"
              onClick={() => setNavCollapsed((c) => !c)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
            >
              <Icon name={navCollapsed ? "chevron_right" : "chevron_left"} size={20} />
            </button>
          </div>
        </aside>

        {/* Main Content — no scroll; left/right columns scroll independently */}
        <main className={cn("flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden", "surface-demo-ps")}>
            <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col overflow-hidden px-density-xl py-density-xl">
            {activeNavId === "home" ? (
              /* Home: My Task + My Queues (match reference UI) */
              <div className="flex flex-col gap-density-xl overflow-y-auto">
                {/* My Task — match reference: white card, light gray divider, pill badge, subtle sort control */}
                <Card className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-none dark:border-gray-700 dark:bg-gray-900">
                  <Collapsible open={myTaskOpen} onOpenChange={setMyTaskOpen} defaultOpen={myTaskOpen}>
                    <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-gray-200 px-4 py-4 dark:border-gray-700">
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <CollapsibleTrigger className="-mx-1 flex items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
                          <Icon name={myTaskOpen ? "expand_less" : "expand_more"} size={20} className="shrink-0 text-gray-900 dark:text-gray-100" />
                          <span className="text-base font-bold text-gray-900 dark:text-gray-100">My Task</span>
                          <span className="inline-flex shrink-0 items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">0</span>
                        </CollapsibleTrigger>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Sort:</span>
                        <div className="w-[5.5rem] shrink-0 [&>div]:!max-w-full">
                          <Select className="h-6 w-full rounded-full border-gray-200 bg-gray-100 py-1 pl-2.5 pr-7 text-xs text-gray-700 focus:border-gray-300 focus:ring-1 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 [&>option]:bg-white dark:[&>option]:bg-gray-800" defaultValue="due-date">
                            <option value="due-date">Due Date</option>
                            <option value="created">Created</option>
                            <option value="priority">Priority</option>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="border-0 px-4 py-4 pt-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">You currently have no tasks assigned to you.</p>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>

                {/* My Queues */}
                <Card className="overflow-hidden shadow-sm dark:shadow-none">
                  <Collapsible open={myQueuesOpen} onOpenChange={setMyQueuesOpen} defaultOpen={myQueuesOpen}>
                    <CardHeader className="flex flex-row items-center justify-between gap-density-md border-b border-border px-density-xl py-density-lg dark:border-gray-700">
                      <CollapsibleTrigger className="-mx-2 flex items-center gap-density-sm rounded-lg px-2 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Icon name={myQueuesOpen ? "expand_less" : "expand_more"} size={20} className="shrink-0 text-gray-500 dark:text-gray-400" />
                        <CardTitle className="text-density-base font-bold text-gray-900 dark:text-gray-100">My Queues</CardTitle>
                        <Badge variant="secondary" className="shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-density-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300">1</Badge>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <div className="flex flex-col">
                        {/* Stopped Transfers sub-section */}
                        <div className="border-b border-border dark:border-gray-700">
                          <Collapsible open={stoppedTransfersOpen} onOpenChange={setStoppedTransfersOpen} defaultOpen>
                            <div className="flex flex-row flex-wrap items-center justify-between gap-density-md px-density-xl py-density-md">
                              <div className="flex min-w-0 flex-1 items-center gap-density-sm">
                                <CollapsibleTrigger className="-mx-2 flex items-center gap-density-sm rounded-lg px-2 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800">
                                  <Icon name={stoppedTransfersOpen ? "expand_less" : "expand_more"} size={20} className="shrink-0 text-gray-500 dark:text-gray-400" />
                                  <span className="text-density-sm font-bold text-gray-900 dark:text-gray-100">Stopped Transfers</span>
                                </CollapsibleTrigger>
                                <Button variant="outline" size="sm" className="shrink-0 rounded-lg border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">View All</Button>
                              </div>
                              <div className="flex shrink-0 items-center gap-density-md">
                                <div className="flex items-center gap-density-xs">
                                  <span className="text-density-sm text-gray-600 dark:text-gray-400">Sort:</span>
                                  <Select className="h-8 w-[120px] border-border bg-white dark:border-gray-600 dark:bg-gray-800" defaultValue="due-date">
                                    <option value="due-date">Due Date</option>
                                    <option value="created">Created</option>
                                  </Select>
                                </div>
                                <span className="text-density-base font-semibold text-gray-900 dark:text-gray-100">2161</span>
                              </div>
                            </div>
                            <CollapsibleContent>
                              <ul className="divide-y divide-border dark:divide-gray-700">
                                {STOPPED_TRANSFERS.map((t) => (
                                  <li key={t.id} className="flex items-center gap-density-md px-density-xl py-density-md">
                                    <Icon name="swap_horiz" size={20} className="shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />
                                    <div className="min-w-0 flex-1 text-density-sm text-gray-900 dark:text-gray-100">
                                      Account Name: {t.accountName} - Account No.: {t.accountNo} - Site: {t.site} - {t.siteLabel}
                                    </div>
                                    <Badge variant="error" className="shrink-0">Stopped</Badge>
                                    <span className="shrink-0 text-density-sm text-gray-600 dark:text-gray-400">No due date</span>
                                    <Icon name="person" size={20} className="shrink-0 text-gray-400 dark:text-gray-500" aria-hidden />
                                  </li>
                                ))}
                              </ul>
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              </div>
            ) : (
              <>
            {/* Breadcrumb — Tally Large Market style */}
            <Breadcrumb className="mb-density-xl">
              <BreadcrumbList className="items-center gap-density-sm text-density-sm text-gray-700 dark:text-gray-200">
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
                    <Link href="#" className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">Customers</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="#" className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100">Accounts</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbCurrentPage className="rounded-density-md bg-gray-100 px-density-md py-density-xs font-normal text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                    {ACCOUNT_NAME}
                  </BreadcrumbCurrentPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="mb-density-lg text-density-xxl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              {ACCOUNT_NAME}
            </h1>

            <Tabs value={tabValue} onValueChange={setTabValue} className="flex min-h-0 flex-1 flex-col">
              <TabsList className="mb-density-xl shrink-0 flex h-10 flex-nowrap justify-start gap-density-xs overflow-x-auto rounded-density-lg bg-gray-100 p-density-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="shrink-0 rounded-density-md px-density-md py-density-sm text-density-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:text-[#2C365D] data-[state=active]:shadow-sm dark:text-gray-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="mb-density-xl shrink-0 flex flex-wrap items-center gap-density-md">
                  <h2 className="text-density-lg font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
                  <button
                    type="button"
                    onClick={allCardsOpen ? collapseAll : expandAll}
                    className="inline-flex items-center gap-density-sm text-density-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
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
                <div className="grid min-h-0 flex-1 grid-cols-1 gap-density-lg overflow-hidden md:grid-cols-2">
                  <div className="min-h-0 min-w-0 space-y-density-lg overflow-y-auto">
                    <CollapsibleCard
                      title="Snapshot"
                      open={cardOpenState["Snapshot"]}
                      onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, Snapshot: open }))}
                    >
                      <div className={CARD_GRID_CLASS}>
                        <SnapshotDataCell label="Account Created" primaryValue="07/01/2025" secondaryDetail="a year ago" />
                        <SnapshotDataCell label="Last Invoice" primaryValue="$4,618.51" secondaryDetail="on 01/04/2025" />
                        <SnapshotDataCell label="Current Invoice" primaryValue="$3,611.44" secondaryDetail="since 01/05/2025" primaryValueClassName="text-[#0074C4] dark:text-[#60a5fa]" />
                        <SnapshotDataCell label="Last Payment" primaryValue="$3,611.44" secondaryDetail="on 19/05/2025" primaryValueClassName="text-green-600 dark:text-green-400" />
                        <SnapshotDataCell label="Account Balance" primaryValue="$0.00" primaryValueClassName="text-green-600 dark:text-green-400" />
                      </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                      title="Account details"
                      open={cardOpenState["Account details"]}
                      onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Account details": open }))}
                    >
                      <div className={CARD_GRID_CLASS}>
                        <DataCell label="Account Type" value="Commercial & Industrial" />
                        <DataCell label="Account Status" value="Billing" />
                        <DataCell label="Parent Account" value="View Account" asLink />
                        <DataCell label="Site Nickname" value="-" />
                        <DataCell label="Hold Transfer Reason" value="-" />
                        <DataCell label="Account Term" value="EACandI_MAJ_30" />
                        <DataCell label="Account Type" value="Electricity" />
                        <div className="col-span-full my-density-xs border-t border-border dark:border-gray-700" />
                        <Checkbox label="Hardship" className="checkbox-demo-ps" />
                        <Checkbox label="Ombudsman" defaultChecked className="checkbox-demo-ps" />
                        <Checkbox label="Sensitive Customer" className="checkbox-demo-ps" />
                        <Checkbox label="Sensitive Load" className="checkbox-demo-ps" />
                        <Checkbox label="CDR Eligible" className="checkbox-demo-ps" />
                        <Checkbox label="Environmental Exemption" className="checkbox-demo-ps" />
                      </div>
                    </CollapsibleCard>

                    <CollapsibleCard
                      title="Business information"
                      open={cardOpenState["Business information"]}
                      onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Business information": open }))}
                    >
                      <div className={CARD_GRID_CLASS}>
                        <DataCell label="Business Name" value="Optus Fixed Infrastructure Pty Limited." />
                        <DataCell label="ABN / ACN" value="96092450783" />
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
                        <DataCell label="Account Type" value="Commercial & Industrial" />
                        <DataCell label="Account Status" value="Billing" />
                        <DataCell label="Parent Account" value="View Account" asLink />
                        <DataCell label="Site Nickname" value="-" />
                        <DataCell label="Hold Transfer Reason" value="-" />
                        <DataCell label="Account Term" value="EACandI_MAJ_30" />
                        <DataCell label="Account Type" value="Electricity" />
                        <div className="col-span-full my-density-xs border-t border-border dark:border-gray-700" />
                        <Checkbox label="Hardship" className="checkbox-demo-ps" />
                        <Checkbox label="Ombudsman" defaultChecked className="checkbox-demo-ps" />
                        <Checkbox label="Sensitive Customer" className="checkbox-demo-ps" />
                        <Checkbox label="Sensitive Load" className="checkbox-demo-ps" />
                        <Checkbox label="CDR Eligible" className="checkbox-demo-ps" />
                        <Checkbox label="Environmental Exemption" className="checkbox-demo-ps" />
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

                  <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto">
                    <Card className="flex w-full min-w-0 flex-col shadow-none">
                      <CardHeader className="w-full space-y-0 border-b border-border pb-density-xl dark:border-gray-800">
                        <CardTitle className="text-density-base font-bold text-gray-900 dark:text-gray-100">Interactions</CardTitle>
                        <div className="mt-density-md w-full">
                          <div className="relative flex w-full min-w-0 items-center overflow-visible rounded-density-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
                            <div className="flex shrink-0 items-center py-density-sm pl-density-md pr-density-xl">
                              <Icon name="search" size={20} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
                              placeholder="Search"
                              className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent pl-0 pr-12 text-density-sm !border-0 shadow-none outline-none focus-visible:ring-0"
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                              title="Filter"
                              aria-label="Filter"
                            >
                              <Icon name="tune" size={20} />
                            </button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-density-md pt-density-xl">
                        {INTERACTIONS.map((item) => (
                          <div key={item.id} className="flex flex-col gap-density-md rounded-density-lg bg-gray-50 p-density-xl dark:bg-gray-900/25">
                            <div className="flex items-start justify-between gap-density-md">
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-density-base">{item.title}</p>
                                <p className="mt-density-xs text-density-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-density-sm rounded-density-lg border-border bg-white font-normal text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                                >
                                  <Icon name="add" size={16} className="mr-1" /> Add
                                </Button>
                              </div>
                              <div className="flex shrink-0 flex-col items-end text-right">
                                <span className="text-density-sm font-medium text-gray-900 dark:text-gray-100">{item.user}</span>
                                <span className="mt-density-xs text-density-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-density-sm border-t border-border pt-density-sm dark:border-gray-700">
                              <span className="text-density-sm font-medium text-gray-900 dark:text-gray-100">2 interactions</span>
                              <span className="rounded bg-[#0074C4] px-density-sm py-density-xs text-density-xs font-medium text-white">11223344</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="mt-0 min-h-0 flex-1 overflow-y-auto">
                <h2 className="mb-density-xl text-density-lg font-semibold text-gray-900 dark:text-gray-100">Contacts</h2>
                <div className="flex gap-density-lg">
                  <div className="w-[280px] shrink-0">
                    <Card className="shadow-none">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-density-xl pb-density-md pt-density-md dark:border-gray-800">
                        <CardTitle className="text-density-sm font-semibold text-gray-900 dark:text-gray-100">Contact Name</CardTitle>
                        <button type="button" className="rounded p-density-xs text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
                          <Icon name="add" size={20} />
                        </button>
                      </CardHeader>
                      <CardContent className="p-0">
                        {CONTACTS_DATA.map((contact) => (
                          <button
                            key={contact.id}
                            type="button"
                            onClick={() => setSelectedContactId(contact.id)}
                            className={cn(
                              "flex w-full items-start gap-density-md border-b border-border px-density-xl py-density-md text-left transition-colors last:border-b-0 dark:border-gray-800",
                              selectedContactId === contact.id ? "bg-gray-50 dark:bg-gray-800/50" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                            )}
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                              <Icon name="person" size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-density-sm font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                              <p className="text-density-xs text-gray-500 dark:text-gray-400">{contact.dob}</p>
                              <Badge variant={contact.badgeVariant} className="mt-density-xs px-density-sm py-density-xs text-density-xs">
                                {contact.badge}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Card className="shadow-none">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-density-xl dark:border-gray-800">
                        <CardTitle className="text-density-lg font-bold text-gray-900 dark:text-gray-100">
                          {selectedContact.details.fullName}
                        </CardTitle>
                        <div className="flex items-center gap-density-xs">
                          <button type="button" className="rounded p-density-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Edit contact">
                            <Icon name="edit" size={20} />
                          </button>
                          <button type="button" className="rounded p-density-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Delete contact">
                            <Icon name="delete" size={20} />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-density-lg">
                        <div className="grid grid-cols-3 gap-x-density-xl gap-y-density-lg">
                          <DataCell label="Contact Type" value={selectedContact.details.contactType} />
                          <DataCell label="Full name" value={selectedContact.details.fullName} />
                          <DataCell label="Date of birth" value={selectedContact.details.dateOfBirth} />
                          <DataCell label="Landline Service Comment" value={selectedContact.details.landlineServiceComment} />
                          <DataCell label="Mobile Service Comment" value={selectedContact.details.mobileServiceComment} />
                          <DataCell label="Preferred Contact Method" value={selectedContact.details.preferredContactMethod} />
                          <DataCell label="Landline Phone" value={selectedContact.details.landlinePhone} />
                          <DataCell label="Mobile Phone" value={selectedContact.details.mobilePhone} />
                          <DataCell label="Verification Passphrase" value={selectedContact.details.verificationPassphrase} />
                          <DataCell label="Email" value={selectedContact.details.email} />
                          <div className="col-span-2" />
                          <DataCell label="Address" value={selectedContact.details.address} className="col-span-3" />
                          <DataCell label="Customer Number" value={selectedContact.details.customerNumber} />
                          <DataCell label="CDN Contact" value={selectedContact.details.cdnContact} />
                          <DataCell label="External Ref" value={selectedContact.details.externalRef} />
                        </div>
                        <div className="mt-density-xl border-t border-border pt-density-lg dark:border-gray-800">
                          <h3 className="text-density-sm font-bold text-gray-900 dark:text-gray-100">Identification Documents</h3>
                          <p className="mt-density-md text-density-sm text-muted-foreground">No Identification documents to display</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {TAB_CONFIG.filter((t) => t.value !== "overview" && t.value !== "contacts").map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="mt-0 min-h-0 flex-1 overflow-y-auto">
                  <div className="rounded-density-lg border border-border bg-card p-density-xxl text-center text-muted-foreground text-density-base dark:border-gray-700 dark:bg-gray-900/40">
                    <p className="capitalize">{tab.label} content would go here.</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            </>
            )}
          </div>
        </main>

        {/* Right Action Sidebar — expandable; split-panel icon at top denotes expandable */}
        <div className="flex shrink-0">
          <aside
            className={cn(
              "flex flex-col overflow-hidden border-l border-border bg-white transition-[width] duration-200 dark:border-gray-800 dark:bg-gray-950",
              rightPanelCollapsed ? "w-16 items-center" : "w-64",
            )}
          >
            {/* Top: split-panel icon to denote expandable panel */}
            <div className={cn("shrink-0 border-b border-border p-density-sm dark:border-gray-700", rightPanelCollapsed && "flex justify-center w-full")}>
              <button
                type="button"
                onClick={() => setRightPanelCollapsed((c) => !c)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label={rightPanelCollapsed ? "Expand panel" : "Collapse panel"}
              >
                <Icon name="view_sidebar" size={20} />
              </button>
            </div>
            <nav className={cn("flex flex-col gap-density-xs pt-density-md", rightPanelCollapsed && "items-center w-full")}>
              {RIGHT_PANEL_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-colors",
                    rightPanelCollapsed
                      ? "h-10 w-10 justify-center shrink-0"
                      : "w-full px-3 py-2.5 text-left",
                    "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  )}
                  aria-label={item.label}
                >
                  <Icon name={item.icon} size={20} className="shrink-0" />
                  {!rightPanelCollapsed && (
                    <span className="truncate text-density-sm font-medium">{item.label}</span>
                  )}
                </button>
              ))}
            </nav>
            <div className={cn("mt-auto shrink-0 border-t border-border p-density-sm dark:border-gray-700", rightPanelCollapsed && "flex justify-center w-full")}>
              <button
                type="button"
                onClick={() => setRightPanelCollapsed((c) => !c)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                aria-label={rightPanelCollapsed ? "Expand panel" : "Collapse panel"}
              >
                <Icon name={rightPanelCollapsed ? "chevron_left" : "chevron_right"} size={20} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
