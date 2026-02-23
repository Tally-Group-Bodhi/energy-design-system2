"use client";

import React from "react";
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
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import { cn } from "@/lib/utils";
import { surfaceColours } from "@/lib/tokens/surface-colours";

const LEFT_NAV_ITEMS = [
  { id: "home", label: "Home", icon: "dashboard" },
  { id: "sales", label: "Sales", icon: "trending_up" },
  { id: "customers", label: "Customers", icon: "group" },
  { id: "billing", label: "Billing", icon: "receipt" },
  { id: "payments", label: "Payments", icon: "credit_card" },
  { id: "market", label: "Market", icon: "store" },
  { id: "reporting", label: "Reporting", icon: "insights" },
  { id: "onboarding", label: "Onboarding", icon: "headset_mic" },
  { id: "audit", label: "Audit", icon: "fact_check" },
  { id: "products", label: "Products", icon: "inventory_2" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "file-upload", label: "File Upload", icon: "upload_file" },
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

const CONTACTS_DATA = [
  {
    id: 1,
    name: "Phoenix Baker",
    dob: "12/04/1990",
    badge: "Primary",
    badgeVariant: "default" as const,
    details: {
      contactType: "Primary",
      fullName: "Phoenix Barker",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Billing",
      preferredContactMethod: "Residential",
      landlinePhone: "03555506536",
      mobilePhone: "04123456789",
      verificationPassphrase: "Not Set",
      email: "Phoenixbarker12345@gmail.com",
      address: "29 - 35 Collingwood Road, Collingwood VIC 3066",
      customerNumber: "10953",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 2,
    name: "Ethan Chang",
    dob: "12/04/1990",
    badge: "Secondary",
    badgeVariant: "secondary" as const,
    details: {
      contactType: "Secondary",
      fullName: "Ethan Chang",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Email",
      landlinePhone: "03555509821",
      mobilePhone: "04198765432",
      verificationPassphrase: "Set",
      email: "ethan.chang@email.com",
      address: "15 Collins Street, Melbourne VIC 3000",
      customerNumber: "10954",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 3,
    name: "Olivia Johnson",
    dob: "12/04/1990",
    badge: "CDN",
    badgeVariant: "info" as const,
    details: {
      contactType: "CDN",
      fullName: "Olivia Johnson",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Business",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Phone",
      landlinePhone: "03555501234",
      mobilePhone: "04111222333",
      verificationPassphrase: "Not Set",
      email: "olivia.johnson@business.com",
      address: "42 Bourke Street, Melbourne VIC 3000",
      customerNumber: "10955",
      cdnContact: "Yes",
      externalRef: "Business",
    },
  },
  {
    id: 4,
    name: "Aiden Smith",
    dob: "12/04/1990",
    badge: "Additional",
    badgeVariant: "info" as const,
    details: {
      contactType: "Additional",
      fullName: "Aiden Smith",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Residential",
      preferredContactMethod: "Residential",
      landlinePhone: "03555507890",
      mobilePhone: "04155566777",
      verificationPassphrase: "Set",
      email: "aiden.smith@email.com",
      address: "8 Flinders Lane, Melbourne VIC 3000",
      customerNumber: "10956",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
  {
    id: 5,
    name: "Luna Martinez",
    dob: "12/04/1990",
    badge: "Additional",
    badgeVariant: "info" as const,
    details: {
      contactType: "Additional",
      fullName: "Luna Martinez",
      dateOfBirth: "12/04/1990",
      landlineServiceComment: "Residential",
      mobileServiceComment: "Billing",
      preferredContactMethod: "Email",
      landlinePhone: "03555504567",
      mobilePhone: "04188899000",
      verificationPassphrase: "Not Set",
      email: "luna.martinez@email.com",
      address: "103 Lygon Street, Carlton VIC 3053",
      customerNumber: "10957",
      cdnContact: "No",
      externalRef: "Residential",
    },
  },
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
  const [activeNavId, setActiveNavId] = React.useState("customers");
  const [selectedContactId, setSelectedContactId] = React.useState(1);
  const currentTabLabel = TAB_CONFIG.find((t) => t.value === tabValue)?.label ?? "Overview";
  const selectedContact = CONTACTS_DATA.find((c) => c.id === selectedContactId) ?? CONTACTS_DATA[0];

  const allCardsOpen = OVERVIEW_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(OVERVIEW_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="flex min-h-screen flex-col">
      {/* App Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        {/* Left: Logo */}
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
            <AvatarFallback className="text-xs">PA</AvatarFallback>
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
                  "group flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  activeNavId === item.id
                    ? "bg-gray-100 text-gray-900 dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon
                    name={item.icon as "dashboard"}
                    size={20}
                    className={cn(
                      "shrink-0 font-extralight transition-colors",
                      activeNavId === item.id
                        ? "text-gray-900 dark:text-[#7c8cb8]"
                        : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <Icon
                  name="expand_more"
                  size={18}
                  className={cn(
                    "shrink-0 font-extralight transition-colors",
                    activeNavId === item.id
                      ? "text-gray-900 dark:text-[#7c8cb8]"
                      : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                  )}
                />
              </button>
            ))}
          </nav>
          </div>
          <div className="shrink-0 border-t border-border p-3 dark:border-gray-800">
            <Image src="/PoweredByTallyBadgeREV.svg" alt="Powered by Tally" width={120} height={29} className="w-[120px] h-auto" />
          </div>
        </aside>

        {/* Main Content */}
        <div className={`relative min-w-0 flex-1 overflow-y-auto ${surfaceColours["tally-group"]}`}>
          <div className="mx-auto max-w-[1600px] px-6 py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700 dark:text-gray-200">
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
                  className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                >Customers</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                  <Link
                  href="/pages/tally-large-market"
                  className="text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
                >Accounts</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage className="rounded bg-gray-100 px-2.5 py-1 font-normal text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                QB00171824 - Masked_Name_44D550D62
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          QB00171824 - Masked_Name_44D550D62
        </h1>

        <Tabs value={tabValue} onValueChange={setTabValue} className="mb-6">
          {/* Small screens only: dropdown (hide from md up) */}
          <div className="mb-4 flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-10 w-full items-center justify-between rounded-lg border border-border bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                <span>{currentTabLabel}</span>
                <Icon name="expand_more" size={20} className="text-gray-500 dark:text-gray-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[12rem] max-h-[min(70vh,20rem)] overflow-y-auto">
                {TAB_CONFIG.map((tab) => (
                  <DropdownMenuItem
                    key={tab.value}
                    onClick={() => setTabValue(tab.value)}
                    className={cn(tab.value === tabValue && "bg-gray-100 font-medium text-[#2C365D] dark:bg-gray-800 dark:text-[#7c8cb8]")}
                  >
                    {tab.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Md up to just below xl: 5 tabs + More (hidden on small and on xl+) */}
          <div className="mb-4 hidden md:block xl:hidden">
            <TabsList className="h-10 flex-nowrap justify-start gap-1 overflow-visible rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
              {TABS_VISIBLE_ON_MD.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:text-gray-200 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-gray-100"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
              <DropdownMenu>
                <div className="relative z-10">
                  <DropdownMenuTrigger
                    className={cn(
                      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2 dark:ring-offset-gray-900",
                      isTabInMore(tabValue)
                        ? "bg-white text-[#2C365D] shadow-sm dark:bg-gray-900 dark:text-[#7c8cb8]"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
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
                    className={cn(tab.value === tabValue && "bg-gray-100 font-medium text-[#2C365D] dark:bg-gray-800 dark:text-[#7c8cb8]")}
                      >
                        {tab.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </div>
              </DropdownMenu>
            </TabsList>
          </div>
          {/* Xl and up only: all tabs (hidden below xl) */}
          <div className="mb-4 hidden xl:block">
            <TabsList className="h-10 flex-nowrap justify-start gap-1 overflow-hidden rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
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
          </div>

          <TabsContent value="overview" className="mt-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Overview</h2>
              <button
                type="button"
                onClick={allCardsOpen ? collapseAll : expandAll}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100"
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
                  <CardHeader className="w-full space-y-0 border-b border-border pb-4 dark:border-gray-800">
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">Interactions</CardTitle>
                    <div className="mt-3 w-full">
                      <div className="relative flex w-full min-w-0 items-center overflow-visible rounded-lg border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
                        <div className="flex shrink-0 items-center py-2 pl-3 pr-4">
                          <Icon name="search" size={20} className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input
                          placeholder="Search"
                          className="h-10 min-w-0 flex-1 rounded-none border-0 bg-transparent pl-0 pr-12 text-sm !border-0 shadow-none outline-none focus-visible:ring-0"
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
                  <CardContent className="flex flex-col gap-3 pt-4">
                    {INTERACTIONS.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 rounded-lg bg-gray-100 p-4 dark:bg-gray-900/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{item.title}</p>
                            <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{item.category}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 rounded-lg border-border bg-white font-normal text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800"
                            >
                              <Icon name="add" size={16} className="mr-1" /> Add
                            </Button>
                          </div>
                          <div className="flex shrink-0 flex-col items-end text-right">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.user}</span>
                            <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 border-t border-border pt-2 dark:border-gray-700">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">2 interactions</span>
                          <span className="rounded bg-[#0074C4] px-2 py-0.5 text-xs font-medium text-white">11223344</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="mt-0">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Contacts</h2>
            <div className="flex gap-6">
              {/* Left: Contact list */}
              <div className="w-[280px] shrink-0">
                <Card className="shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border px-4 pb-3 pt-3 dark:border-gray-800">
                    <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">Contact Name</CardTitle>
                    <button type="button" className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
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
                          "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 dark:border-gray-800",
                          selectedContactId === contact.id
                            ? "bg-gray-50 dark:bg-gray-800/50"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                          <Icon name="person" size={24} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{contact.dob}</p>
                          <Badge variant={contact.badgeVariant} className="mt-1 text-[10px] px-2 py-0.5">
                            {contact.badge}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Contact details */}
              <div className="min-w-0 flex-1">
                <Card className="shadow-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border pb-4 dark:border-gray-800">
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {selectedContact.details.fullName}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <button type="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Edit contact">
                        <Icon name="edit" size={20} />
                      </button>
                      <button type="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" aria-label="Delete contact">
                        <Icon name="delete" size={20} />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-3 gap-x-8 gap-y-6">
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

                    <div className="mt-8 border-t border-border pt-6 dark:border-gray-800">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Identification Documents</h3>
                      <p className="mt-3 text-sm text-muted-foreground">No Identification documents to display</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Remaining tab placeholders */}
          {TAB_CONFIG.filter((t) => t.value !== "overview" && t.value !== "contacts").map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground dark:border-gray-700 dark:bg-gray-900/40">
                <p className="capitalize">{tab.label} content would go here.</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
          </div>
        </div>

        {/* Right Action Sidebar */}
        <aside className="flex w-16 shrink-0 flex-col items-center gap-1 border-l border-border bg-white pt-4 dark:border-gray-800 dark:bg-gray-950">
          <button
            type="button"
            className="flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <Icon name="bolt" size={22} />
            <span className="text-[10px] font-medium leading-tight">Actions</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <Icon name="diamond" size={22} />
            <span className="text-[10px] font-medium leading-tight">Exceptions</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <Icon name="task" size={22} />
            <span className="text-[10px] font-medium leading-tight">Tasks</span>
          </button>
        </aside>
      </div>
    </div>
  );
}
