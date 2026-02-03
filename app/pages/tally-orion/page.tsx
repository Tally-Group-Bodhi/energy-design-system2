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
import Checkbox from "@/components/Checkbox/Checkbox";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";

/* ========== DATA ========== */
const NAV_ITEMS = [
  { label: "Dashboard", icon: "home", active: false },
  { label: "Contacts", icon: "group", active: true, subItems: ["Summary", "Details"] },
  { label: "Customer", icon: "person", active: false },
  { label: "Calls and Activities", icon: "call", active: false },
  { label: "Invoicing", icon: "receipt", active: false },
  { label: "Accounts Receivable", icon: "account_balance", active: false },
  { label: "Credit Control", icon: "credit_card", active: false },
  { label: "Documents", icon: "folder", active: false },
  { label: "Notifications", icon: "notifications", active: false },
  { label: "Utilities", icon: "build", active: false },
  { label: "Market", icon: "store", active: false },
];

const CONTACTS = [
  { id: 1, pending: "", contactId: "Individual", contactType: "Individual", contactName: "Adam Landry", roles: "Sarah Landry", title: "Mr", firstName: "Adam", lastName: "Landry", dob: "15/03/1975", email: "adam.landry@email.com" },
  { id: 2, pending: "", contactId: "Individual", contactType: "Individual", contactName: "Laura Cowan", roles: "Billing, Decision Maker", title: "Mrs", firstName: "Laura", lastName: "Cowan", dob: "22/08/1982", email: "laura.cowan@email.com" },
  { id: 3, pending: "", contactId: "Individual", contactType: "Individual", contactName: "Laura Cowan", roles: "Accounts, ATTN Person on correspondence, Online Access", title: "Mrs", firstName: "Laura", lastName: "Cowan", dob: "22/08/1982", email: "laura.cowan@email.com" },
];

const ADDRESSES = [
  { type: "Postal Address", street: "21B Baird Street", suburb: "Brighton East", state: "Victoria", postcode: "3187" },
];

const SECTION_CARD_TITLES = ["Contact Details", "Address"] as const;

const INITIAL_CARD_OPEN: Record<string, boolean> = Object.fromEntries(
  SECTION_CARD_TITLES.map((title) => [title, true])
);

export default function TallyOrionPage() {
  const [contentTab, setContentTab] = useState("address");
  const [contactExpanded, setContactExpanded] = useState(true);
  const [cardOpenState, setCardOpenState] = useState<Record<string, boolean>>(INITIAL_CARD_OPEN);

  const allCardsOpen = SECTION_CARD_TITLES.every((t) => cardOpenState[t]);
  const expandAll = () => setCardOpenState(() => Object.fromEntries(SECTION_CARD_TITLES.map((t) => [t, true])));
  const collapseAll = () => setCardOpenState(() => Object.fromEntries(SECTION_CARD_TITLES.map((t) => [t, false])));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/ORION_LOGO.svg"
              alt="ORION"
              width={105}
              height={24}
              className="h-6 w-auto"
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
          <button type="button" className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/80">
            <Icon name="grid_view" size={20} />
          </button>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">LC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="min-h-0 flex-1 overflow-y-auto">
          <nav className="flex flex-col p-2">
            {NAV_ITEMS.map((item) =>
              item.subItems ? (
                <Collapsible key={item.label} open={item.active && contactExpanded} onOpenChange={(o) => item.active && setContactExpanded(o)}>
                  <CollapsibleTrigger className={cn(
                    "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                    item.active && "bg-gray-100 text-gray-900 dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                  )}>
                    <div className="flex items-center gap-3">
                      <Icon
                        name={item.icon as "home"}
                        size={20}
                        className={cn(
                          "font-extralight transition-colors",
                          item.active
                            ? "text-gray-900 dark:text-[#7c8cb8]"
                            : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                        )}
                      />
                      {item.label}
                    </div>
                    <Icon
                      name={contactExpanded ? "expand_less" : "expand_more"}
                      size={18}
                      className={cn(
                        "font-extralight transition-colors",
                        item.active
                          ? "text-gray-900 dark:text-[#7c8cb8]"
                          : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-border pl-3 dark:border-gray-700">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub}
                          href="#"
                          className={cn(
                            "block rounded px-2 py-1.5 text-sm",
                            sub === "Details"
                              ? "border-l-2 border-[#2C365D] bg-[#2C365D]/10 -ml-[2px] pl-[10px] font-medium text-[#2C365D] dark:border-[#7c8cb8] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                              : "text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                          )}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  key={item.label}
                  href="#"
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                    item.active
                      ? "bg-gray-100 text-gray-900 dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                      : "text-gray-500 dark:text-gray-300"
                  )}
                >
                  <Icon
                    name={item.icon as "home"}
                    size={20}
                    className={cn(
                      "font-extralight transition-colors",
                      item.active
                        ? "text-gray-900 dark:text-[#7c8cb8]"
                        : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                    )}
                  />
                  {item.label}
                </Link>
              )
            )}
          </nav>
          </div>
          <div className="shrink-0 border-t border-border p-3 dark:border-gray-800">
            <Image src="/PoweredByTallyBadgeDark.svg" alt="Powered by Tally" width={120} height={29} className="w-[120px] h-auto" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Info Bar - anchored to main content */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border bg-gray-100 px-6 py-3 dark:border-gray-800 dark:bg-gray-900/70">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Icon name="home" size={18} className="text-gray-600 dark:text-gray-400" />
              <span className="font-medium">Adam Landry (108382)</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="info" className="inline-flex items-center gap-1">
                <Icon name="bolt" size={14} />
                NMI: 6408270043
              </Badge>
              <Badge variant="success" className="inline-flex items-center gap-1">
                <Icon name="person" size={14} />
                Account Switched
              </Badge>
              <Badge variant="error" className="inline-flex items-center gap-1">
                <Icon name="error" size={14} />
                Card Validated and Rejected
              </Badge>
              <Badge variant="info" className="inline-flex items-center gap-1">
                <Icon name="calendar_today" size={14} />
                Standard
              </Badge>
              <Badge variant="info" className="inline-flex items-center gap-1">
                <Icon name="calendar_today" size={14} />
                B/C:Daily Billing
              </Badge>
              <Badge variant="info" className="inline-flex items-center gap-1">
                <Icon name="person" size={14} />
                A/M:Internal - Adam Landry
              </Badge>
              <Badge variant="success" className="inline-flex items-center gap-1">
                <Icon name="attach_money" size={14} />
                $ Payable balance is $0.00
              </Badge>
              <Badge variant="success" className="inline-flex items-center gap-1">
                <Icon name="attach_money" size={14} />
                $ Total balance is $0.00
              </Badge>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1600px] px-6 py-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/pages" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">Pages</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-gray-900 dark:text-gray-100">Adam Landry (108382) - Contact Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Adam Landry (108382)</h1>
              <button
                type="button"
                onClick={allCardsOpen ? collapseAll : expandAll}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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

            <div className="space-y-6">
              {/* Contact Details */}
              <CollapsibleCard
                title="Contact Details"
                open={cardOpenState["Contact Details"]}
                onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, "Contact Details": open }))}
                showMenu={false}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button variant="outline" size="sm">+Add</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">X Delete</Button>
                    <Button variant="outline" size="sm">More...</Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50 dark:bg-gray-800/60">
                          <TableHead className="w-10 pl-4"><Checkbox /></TableHead>
                          <TableHead>Pending Contact</TableHead>
                          <TableHead>Contact Identifier</TableHead>
                          <TableHead>Contact Type</TableHead>
                          <TableHead>Contact Name</TableHead>
                          <TableHead>Role(s)</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>First Name</TableHead>
                          <TableHead>Last Name</TableHead>
                          <TableHead>Date Of Birth</TableHead>
                          <TableHead className="pr-4">Email Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {CONTACTS.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="pl-4"><Checkbox defaultChecked={contact.id === 1} /></TableCell>
                            <TableCell>{contact.pending}</TableCell>
                            <TableCell>{contact.contactId}</TableCell>
                            <TableCell>{contact.contactType}</TableCell>
                            <TableCell>{contact.contactName}</TableCell>
                            <TableCell>{contact.roles}</TableCell>
                            <TableCell>{contact.title}</TableCell>
                            <TableCell>{contact.firstName}</TableCell>
                            <TableCell>{contact.lastName}</TableCell>
                            <TableCell>{contact.dob}</TableCell>
                            <TableCell className="pr-4">{contact.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CollapsibleCard>

              {/* Content Tabs */}
              <Tabs value={contentTab} onValueChange={setContentTab}>
                <TabsList className="mb-4 h-10 flex-nowrap justify-start gap-1 rounded-lg bg-gray-100 p-1 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  <TabsTrigger value="address">Address</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="identification">Identification</TabsTrigger>
                  <TabsTrigger value="oss">OSS Details</TabsTrigger>
                  <TabsTrigger value="other">Other Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="address" className="mt-0">
                  <CollapsibleCard
                    title="Address"
                    open={cardOpenState["Address"]}
                    onOpenChange={(open) => setCardOpenState((prev) => ({ ...prev, Address: open }))}
                    showMenu={false}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Button variant="outline" size="sm">+Add</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">X Delete</Button>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-100 dark:bg-gray-800/60">
                            <TableHead>Address Type</TableHead>
                            <TableHead>Street Address</TableHead>
                            <TableHead>Suburb</TableHead>
                            <TableHead>State</TableHead>
                            <TableHead>Postcode</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ADDRESSES.map((addr) => (
                            <TableRow key={addr.type}>
                              <TableCell>{addr.type}</TableCell>
                              <TableCell>{addr.street}</TableCell>
                              <TableCell>{addr.suburb}</TableCell>
                              <TableCell>{addr.state}</TableCell>
                              <TableCell>{addr.postcode}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={5} className="h-12 text-muted-foreground" />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleCard>
                </TabsContent>

                <TabsContent value="phone" className="mt-0">
                  <Card className="shadow-none">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Phone content would go here.
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="identification" className="mt-0">
                  <Card className="shadow-none">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Identification content would go here.
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="oss" className="mt-0">
                  <Card className="shadow-none">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      OSS Details content would go here.
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="other" className="mt-0">
                  <Card className="shadow-none">
                    <CardContent className="py-12 text-center text-muted-foreground">
                      Other Contacts content would go here.
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
