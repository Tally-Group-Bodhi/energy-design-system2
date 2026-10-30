"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs/Tabs";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table/Table";
import { Avatar, AvatarFallback } from "@/components/Avatar/Avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible/Collapsible";
import CollapsibleCard from "@/components/CollapsibleCard/CollapsibleCard";
import DensityModeSwitch from "@/components/DensityModeSwitch/DensityModeSwitch";
import ThemeModeSwitch from "@/components/ThemeModeSwitch/ThemeModeSwitch";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/** Same seamless dark chrome as Tally+ Small Market 1.5 */
const DARKEST_NAVY = "#161B2E";
const DARK_NAVY = "#212946";
const BRAND = "#00D2A2";
const BRAND_ON_DARK = "#00D2A2";

const PANE = "bg-gray-100 dark:bg-gray-900";
const GLASS_CARD =
  "bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-lg shadow-gray-200/40 dark:bg-white/[0.08] dark:border-white/[0.12] dark:shadow-none";
const MUTED = "text-gray-500 dark:text-slate-400";
const LINE = "border-gray-200 dark:border-white/10";
const TAB_LIST =
  "flex h-auto w-full flex-nowrap justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 text-gray-500 shadow-none scrollbar-none dark:border-gray-700 dark:bg-transparent dark:text-slate-400";
const TAB_TRIGGER =
  "-mb-px h-auto shrink-0 rounded-none border-b-2 border-transparent bg-transparent px-5 py-2.5 text-sm font-medium text-gray-500 shadow-none hover:bg-transparent hover:text-gray-700 data-[state=active]:border-[#00D2A2] data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-[#007A5E] data-[state=active]:shadow-none dark:text-slate-400 dark:hover:text-slate-200 dark:data-[state=active]:border-[#00D2A2] dark:data-[state=active]:text-[#00D2A2]";
const PRIMARY_BTN =
  "!bg-[#00D2A2] text-[#12203A] hover:!bg-[#00B48C] focus:ring-[#00D2A2] dark:!bg-[#00D2A2] dark:text-[#12203A] dark:hover:!bg-[#00B48C]";
const CARD = cn("rounded-2xl", GLASS_CARD);

type Screen = "customer" | "search";
type MainTab = "details" | "financial" | "interaction" | "accounts" | "tasks" | "recurring";
type AccountTab = "details" | "pricing" | "utility" | "usage" | "market" | "timeline";
type ActivityTab = "activity" | "document" | "email";
type ActivityFilter = "activity" | "call" | "correspondence" | "system";
type LedgerTab = "ledger" | "plans" | "treatments";
type LedgerKind = "invoice" | "payment" | "adjustments";

const RAIL: { id: Screen; label: string; icon: string }[] = [
  { id: "customer", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
];

const CUSTOMER = {
  initials: "JD",
  name: "Jackson Day",
  firstName: "Jackson",
  lastName: "Day",
  number: "000799848",
  searchNumber: "X000799848",
  balance: "$79.25",
  status: "Open",
  brand: "AMPLY",
  billCycle: "EMAIL",
  billCycleDetail: "Daily Email",
  language: "SPANISH",
  payMethod: "CHEQUE",
  accountsLabel: "2 open · 1 closed",
  lastInvoice: "10/14/2026",
  lastInvoiceDue: "09/30/2026",
  lastReceipt: "09/29/2026",
  current: "$79.25",
  pastDue: "$0.00",
  total: "$79.25",
  phone: "(555) 278-8794",
  phonePlain: "5552788794",
  email: "user799848@example.test",
  state: "TX",
};

const ACCOUNTS = [
  {
    id: "secure-24",
    product: "Secure 24",
    primary: true,
    esi: "ESI000001564901",
    status: "Active" as const,
    connected: "12/15/2023",
    address: "17355 ALDINE WESTFIELD RD 134, HOUSTON, TX 77038",
    summary: {
      accountId: "1797266",
      statusCode: "SWITCHED",
      dateConnected: "12/15/2023",
      contractEnd: "—",
      lifeSupport: "N",
      esiId: "ESI000001564901",
      product: "Secure 24",
      dateTerminated: "—",
      closedReason: "—",
      switchHold: "—",
      status: "OPEN",
      serviceType: "POWER",
      contractStart: "12/13/2026",
      closed: "N",
    },
  },
  {
    id: "rollover",
    product: "Amply Rollover TX Power",
    primary: false,
    esi: "ESI000000120347",
    status: "Closed" as const,
    connected: "07/31/2018",
    address: "16303 IMPERIAL VALLEY DR #408, HOUSTON, TX 770603534",
    summary: {
      accountId: "—",
      statusCode: "CLOSED",
      dateConnected: "07/31/2018",
      contractEnd: "—",
      lifeSupport: "—",
      esiId: "ESI000000120347",
      product: "Amply Rollover TX Power",
      dateTerminated: "—",
      closedReason: "—",
      switchHold: "—",
      status: "CLOSED",
      serviceType: "POWER",
      contractStart: "—",
      closed: "Y",
    },
  },
  {
    id: "green-12",
    product: "Green 12",
    primary: false,
    esi: "ESI000001122334",
    status: "Active" as const,
    connected: "03/02/2024",
    address: "4200 WESTHEIMER RD 210, HOUSTON, TX 77027",
    summary: {
      accountId: "1804412",
      statusCode: "ACTIVE",
      dateConnected: "03/02/2024",
      contractEnd: "03/02/2027",
      lifeSupport: "N",
      esiId: "ESI000001122334",
      product: "Green 12",
      dateTerminated: "—",
      closedReason: "—",
      switchHold: "N",
      status: "OPEN",
      serviceType: "POWER",
      contractStart: "03/02/2024",
      closed: "N",
    },
  },
];

type ActivityCategory = Exclude<ActivityFilter, "activity">;

const ACTIVITIES: {
  letter: string;
  ref: string;
  code: string;
  type: string;
  raised: string;
  assignee: string;
  due: string;
  source: string;
  status: string;
  category: ActivityCategory;
}[] = [
  { letter: "A", ref: "72498832", code: "CT_NOACTION", type: "CRDCONT", raised: "10/24/2026", assignee: "", due: "10/24/2026", source: "22", status: "Task Closed", category: "call" },
  { letter: "A", ref: "70997157", code: "CC_DNPAUTO", type: "CRDCONT", raised: "12/31/2025", assignee: "", due: "12/31/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "C", ref: "69853226", code: "PROD_RO", type: "ADMIN", raised: "12/26/2025", assignee: "100000", due: "01/01/2026", source: "9", status: "Task Closed", category: "correspondence" },
  { letter: "A", ref: "70506003", code: "CT_NOACTION", type: "CRDCONT", raised: "12/23/2025", assignee: "", due: "12/23/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "S", ref: "70506002", code: "CC_DISCON", type: "CRDCONT", raised: "12/19/2025", assignee: "", due: "12/19/2025", source: "9", status: "Task Closed", category: "system" },
  { letter: "A", ref: "70506001", code: "CT_NOACTION", type: "CRDCONT", raised: "12/18/2025", assignee: "", due: "12/18/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "A", ref: "70506004", code: "CT_NOACTION", type: "CRDCONT", raised: "12/17/2025", assignee: "", due: "12/17/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "A", ref: "70506000", code: "CT_NOACTION", type: "CRDCONT", raised: "12/15/2025", assignee: "", due: "12/15/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "A", ref: "69422219", code: "CT_NOACTION", type: "CRDCONT", raised: "12/10/2025", assignee: "", due: "12/10/2025", source: "22", status: "Task Closed", category: "call" },
  { letter: "A", ref: "68671048", code: "BACKOFFICE", type: "BACKOFFICE", raised: "12/01/2025", assignee: "102534", due: "12/01/2025", source: "12", status: "Task Closed", category: "system" },
];

const LEDGER = [
  {
    kind: "invoice" as const,
    title: "Invoice 32732327",
    meta: "Posted 10/15/2026 · Invoice · 32732327",
    key: "Unpaid",
    keySub: "Due 10/31/2026",
    amount: "$79.25",
    credit: false,
    balance: "$79.25",
    mark: "DR",
  },
  {
    kind: "payment" as const,
    title: "Payment 33483010",
    meta: "Posted 09/30/2026 · Receipt · CHEQUE · Batch: Batch #38116",
    key: "Fully Allocated",
    keySub: "",
    amount: "−$114.74",
    credit: true,
    balance: "$0.00",
    mark: "",
  },
  {
    kind: "invoice" as const,
    title: "Invoice 32244957",
    meta: "Posted 09/13/2026 · Invoice · 32244957",
    key: "Paid 1 day early",
    keySub: "Due 10/01/2026",
    amount: "$114.74",
    credit: false,
    balance: "$114.74",
    mark: "DR",
  },
];

const AGING = [
  { label: "1–30", amount: "$0.00", color: "#F5B942" },
  { label: "31–60", amount: "$0.00", color: "#E8560A" },
  { label: "61–90", amount: "$0.00", color: "#C53B00" },
  { label: "90+", amount: "$0.00", color: "#2C365D" },
];

function Field({
  label,
  value,
  emphasize,
  danger,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "break-words text-sm text-foreground",
          emphasize && "text-lg font-semibold tracking-tight",
          danger && "font-medium text-[#C40000]",
        )}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function DetailRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 text-xs">
      <span className="text-gray-400 dark:text-slate-500">{label}</span>
      <span className={cn("text-right font-medium text-gray-800 dark:text-slate-200", danger && "text-[#C40000]")}>{value}</span>
    </div>
  );
}

function EmptyPane({ title }: { title: string }) {
  return (
    <div className={cn(GLASS_CARD, "rounded-2xl px-4 py-10 text-center text-sm shadow-none", MUTED)}>
      {title}
    </div>
  );
}

function InvoiceDonut() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#00D2A2"
        strokeWidth="10"
        strokeDasharray={`${c * 0.92} ${c * 0.08}`}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="48" textAnchor="middle" fontSize="16" fontWeight="600" fill="#181B25">
        12
      </text>
      <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#595767">
        invoices
      </text>
    </svg>
  );
}

export default function UsGlass2Page() {
  const [screen, setScreen] = useState<Screen>("customer");
  const [mainTab, setMainTab] = useState<MainTab>("accounts");
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [accountTab, setAccountTab] = useState<AccountTab>("details");
  const [activityTab, setActivityTab] = useState<ActivityTab>("activity");
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("activity");
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [ledgerTab, setLedgerTab] = useState<LedgerTab>("ledger");
  const [ledgerKind, setLedgerKind] = useState<LedgerKind | "all">("all");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [controlPanelOpen, setControlPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<"Control Panel" | "X-Sell">("Control Panel");
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(false);
  const [displayOptionsPos, setDisplayOptionsPos] = useState<{ bottom: number; left: number } | null>(null);
  const [addressQuery, setAddressQuery] = useState("");
  const [addressFilterOpen, setAddressFilterOpen] = useState(false);
  const [statusChecked, setStatusChecked] = useState(false);
  const [query, setQuery] = useState("");
  const [searchTab, setSearchTab] = useState<"recent" | "search" | "advanced">("recent");
  const searchRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) sidebar.style.display = isExpanded ? "none" : "";
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, [isExpanded]);

  const toggleDisplayOptions = (event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setDisplayOptionsPos({ bottom: window.innerHeight - rect.bottom, left: rect.right + 12 });
    setDisplayOptionsOpen((open) => !open);
  };

  const account = ACCOUNTS.find((item) => item.id === accountId) ?? ACCOUNTS[0];
  const visibleAccounts = ACCOUNTS.filter((item) =>
    item.address.toLowerCase().includes(addressQuery.trim().toLowerCase()),
  );
  const visibleActivities = ACTIVITIES.filter(
    (row) => activityFilter === "activity" || row.category === activityFilter,
  );
  const visibleLedger = LEDGER.filter((row) => ledgerKind === "all" || row.kind === ledgerKind);
  const recentCustomers = useMemo(() => {
    const haystack = `${CUSTOMER.searchNumber} ${CUSTOMER.name} ${CUSTOMER.brand} ${CUSTOMER.state}`.toLowerCase();
    if (!query.trim()) return [CUSTOMER];
    return haystack.includes(query.trim().toLowerCase()) ? [CUSTOMER] : [];
  }, [query]);

  const openCustomer = () => {
    setScreen("customer");
    setMainTab("accounts");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: DARKEST_NAVY }}>
      <header className="flex h-14 shrink-0 items-center gap-4 px-6">
        <div className="flex shrink-0 items-center">
          <Link href="/pages/us-glass-2" className="flex items-center">
            <Image src="/GlassLogoTest_darkmode.svg" alt="Tally Glass" width={140} height={40} className="h-7 w-auto" priority />
          </Link>
        </div>

        <div className="flex flex-1 justify-center">
          <div className="relative w-full max-w-md">
            <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setScreen("search")}
              placeholder="Search Tally US Glass…"
              className="h-10 w-full rounded-lg border-0 pl-10 pr-20 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00D2A2]/50"
              style={{ backgroundColor: DARK_NAVY }}
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs text-gray-400">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button type="button" className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Switch app">
            <Icon name="grid_view" size={20} />
          </button>
          <button type="button" className="relative rounded-lg p-2 text-gray-300 transition-colors hover:bg-white/10 hover:text-white" aria-label="Notifications">
            <Icon name="notifications" size={22} />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#E8560A]" aria-hidden />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-[#12203A] ring-2 ring-[#00D2A2]/30" style={{ backgroundColor: BRAND }}>
            US
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside
          className={cn(
            "flex min-h-0 shrink-0 flex-col overflow-hidden transition-[width] duration-300",
            navCollapsed ? "w-16" : "w-64",
          )}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-visible">
            <nav className={cn("flex flex-col gap-0.5", navCollapsed ? "items-center p-2" : "p-2")} aria-label="US Glass">
              {RAIL.map((item) => {
                const selected = screen === item.id;
                const onSelect = () => (item.id === "customer" ? openCustomer() : setScreen("search"));
                if (navCollapsed) {
                  return (
                    <div key={item.id} className="relative flex w-full justify-center">
                      {selected && (
                        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r" style={{ backgroundColor: BRAND_ON_DARK }} aria-hidden />
                      )}
                      <button
                        type="button"
                        title={item.label}
                        aria-label={item.label}
                        aria-current={selected ? "page" : undefined}
                        onClick={onSelect}
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                          selected ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-gray-400 hover:bg-white/10 hover:text-gray-100",
                        )}
                      >
                        <Icon name={item.icon} size={20} className={selected ? "text-[#00D2A2]" : "text-gray-400"} />
                      </button>
                    </div>
                  );
                }
                return (
                  <div key={item.id} className="relative">
                    {selected && (
                      <span className="absolute left-0 top-5 h-5 w-0.5 -translate-y-1/2 rounded-r" style={{ backgroundColor: BRAND_ON_DARK }} aria-hidden />
                    )}
                    <button
                      type="button"
                      aria-current={selected ? "page" : undefined}
                      onClick={onSelect}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        selected ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-gray-300 hover:bg-white/10 hover:text-gray-100",
                      )}
                    >
                      <Icon name={item.icon} size={20} className={selected ? "text-[#00D2A2]" : "text-gray-400 group-hover:text-gray-100"} />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
          <div className="shrink-0 border-t border-white/10">
            {navCollapsed ? (
              <div className="flex flex-col items-center gap-1 p-2">
                <button type="button" onClick={toggleDisplayOptions} className={cn("flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10 hover:text-gray-100", displayOptionsOpen ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-gray-400")} aria-label="Display options" aria-expanded={displayOptionsOpen}>
                  <Icon name="display_settings" size={20} />
                </button>
                <button type="button" onClick={() => setIsExpanded((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100" aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}>
                  <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={20} />
                </button>
                <button type="button" onClick={() => setNavCollapsed(false)} className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100" aria-label="Expand navigation">
                  <Icon name="chevron_right" size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-1">
                  <button type="button" onClick={toggleDisplayOptions} className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/10 hover:text-gray-100", displayOptionsOpen ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-gray-400")} aria-label="Display options" aria-expanded={displayOptionsOpen}>
                    <Icon name="display_settings" size={18} />
                  </button>
                  <button type="button" onClick={() => setIsExpanded((value) => !value)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100" aria-label={isExpanded ? "Exit full screen" : "Enter full screen"}>
                    <Icon name={isExpanded ? "close_fullscreen" : "open_in_full"} size={18} />
                  </button>
                  <Image src="/PoweredByTallyBadgeREV.svg" alt="Powered by Tally" width={120} height={29} className="h-auto w-[120px]" />
                </div>
                <button type="button" onClick={() => setNavCollapsed(true)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-100" aria-label="Collapse navigation">
                  <Icon name="chevron_left" size={20} />
                </button>
              </div>
            )}
          </div>
        </aside>

        {displayOptionsOpen && displayOptionsPos && (
          <>
            <button type="button" className="fixed inset-0 z-40 cursor-default" aria-label="Close display options" onClick={() => setDisplayOptionsOpen(false)} />
            <div className={cn("fixed z-50 w-56 rounded-xl p-4 shadow-2xl", GLASS_CARD)} style={{ bottom: displayOptionsPos.bottom, left: displayOptionsPos.left }}>
              <p className="mb-3 text-xs font-semibold text-gray-900 dark:text-slate-100">Display options</p>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Density</p>
                  <DensityModeSwitch />
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-slate-500">Theme</p>
                  <ThemeModeSwitch />
                </div>
              </div>
            </div>
          </>
        )}

        <main className={cn("flex min-w-0 flex-1 overflow-hidden rounded-tl-[1.5rem]", !controlPanelOpen && "rounded-tr-[1.5rem]", PANE)}>
          {screen === "customer" && !customerOpen && (
            <button
              type="button"
              onClick={() => setCustomerOpen(true)}
              className="my-3 ml-3 flex w-11 shrink-0 flex-col items-center gap-3 self-stretch rounded-xl border border-border bg-white py-4 text-gray-500 transition-colors hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:text-gray-100"
              aria-label="Open customer panel"
            >
              <Icon name="left_panel_open" size={18} />
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-[#12203A]" style={{ backgroundColor: BRAND }}>
                {CUSTOMER.initials}
              </div>
              <span className="text-[10px] font-semibold tracking-wide [writing-mode:vertical-lr]">{CUSTOMER.name}</span>
            </button>
          )}

          {screen === "customer" && customerOpen && (
            <aside className={cn(GLASS_CARD, "my-3 ml-3 flex min-h-0 w-72 shrink-0 flex-col overflow-y-auto rounded-xl")}>
              <div className="flex flex-col gap-1.5 px-4 pb-1 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-semibold text-[#12203A]" style={{ backgroundColor: BRAND }}>{CUSTOMER.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">{CUSTOMER.name}</h2>
                      <p className="text-sm text-muted-foreground">{CUSTOMER.number}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setCustomerOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10" aria-label="Collapse customer panel">
                    <Icon name="left_panel_close" size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge variant="info" className="px-1.5 py-0 text-xs">Resident</Badge>
                  <Badge variant="success" className="px-1.5 py-0 text-xs">Open</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 px-4 py-3">
                {[
                  ["mail", "Email"],
                  ["call", "Call"],
                  ["forum", "Message"],
                ].map(([icon, label]) => (
                  <button key={label} type="button" className="flex items-center gap-1.5 rounded-md border border-border bg-white px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-gray-50 hover:text-gray-900 dark:border-white/10 dark:bg-transparent dark:hover:bg-white/10">
                    <Icon name={icon} size={15} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 border-y border-border dark:border-white/10">
                {[
                  [CUSTOMER.balance, "Current balance"],
                  ["Open", "Account status"],
                  [CUSTOMER.billCycle, "Bill cycle"],
                  [CUSTOMER.accountsLabel, "Accounts"],
                ].map(([value, label], index) => (
                  <div key={label} className={cn("flex flex-col gap-0.5 px-4 py-2.5", index % 2 === 0 && "border-r border-border dark:border-white/10", index < 2 && "border-b border-border dark:border-white/10")}>
                    <p className="text-xs font-bold uppercase text-gray-900 dark:text-slate-100">{value}</p>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 px-4 py-3">
                {[
                  { title: "Customer details", rows: [["Brand", CUSTOMER.brand], ["Bill cycle", CUSTOMER.billCycle], ["Language", CUSTOMER.language], ["Pay method", CUSTOMER.payMethod]] },
                  { title: "Customer balance", rows: [["Last invoice", CUSTOMER.lastInvoice], ["Invoice due", CUSTOMER.lastInvoiceDue], ["Last receipt", CUSTOMER.lastReceipt], ["Current", CUSTOMER.current], ["Past due", CUSTOMER.pastDue], ["Total", CUSTOMER.total]] },
                  { title: "Primary contact", rows: [["Phone", CUSTOMER.phone], ["Email", CUSTOMER.email]] },
                ].map((block) => (
                  <Collapsible key={block.title} defaultOpen>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-slate-300">
                      {block.title}
                      <Icon name="expand_more" size={16} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-1.5 pb-2">
                        {block.rows.map(([label, value]) => (
                          <DetailRow key={label} label={label} value={value} danger={label === "Past due"} />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </aside>
          )}

          <div className="@container min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1600px] space-y-density-lg px-density-lg py-density-lg">
            {screen === "search" ? (
              <div className="space-y-density-lg">
                <div className="space-y-density-sm">
                  <Breadcrumb>
                    <BreadcrumbList className="text-sm text-gray-700 dark:text-slate-300">
                      <BreadcrumbItem>
                        <BreadcrumbPage className="rounded bg-[#E8FBF5] px-2.5 py-1 font-normal text-[#007A5E] dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]">Customer search</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <h1 className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>Customer search</h1>
                </div>
                <div className={cn(GLASS_CARD, "overflow-hidden rounded-2xl")}>
                <Tabs value={searchTab} onValueChange={(value) => setSearchTab(value as typeof searchTab)}>
                  <div className="mb-density-lg px-density-lg pt-density-sm">
                    <TabsList className={TAB_LIST}>
                      <TabsTrigger value="recent" className={TAB_TRIGGER}>Recent customers</TabsTrigger>
                      <TabsTrigger value="search" className={TAB_TRIGGER}>Search</TabsTrigger>
                      <TabsTrigger value="advanced" className={TAB_TRIGGER}>Advanced search</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="recent" className="mt-0">
                    <div className="mb-density-sm flex items-center justify-between px-density-lg py-density-md">
                      <p className="text-sm font-medium">Recent customers</p>
                      <Button size="sm" variant="ghost" onClick={() => setQuery("")}>Clear</Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {["Customer number", "Customer name", "Brand", "Bill cycle", "State"].map((heading) => (
                            <TableHead key={heading} className="text-[10px] uppercase tracking-wider">{heading}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCustomers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className={cn("py-8 text-center", MUTED)}>No customers match that search.</TableCell>
                          </TableRow>
                        ) : (
                          recentCustomers.map((customer) => (
                            <TableRow key={customer.number} className="cursor-pointer" onClick={openCustomer}>
                              <TableCell className="font-medium text-[#007A5E] dark:text-[#00D2A2]">{customer.searchNumber}</TableCell>
                              <TableCell>{customer.name}</TableCell>
                              <TableCell>{customer.brand}</TableCell>
                              <TableCell>{customer.billCycle}</TableCell>
                              <TableCell>{customer.state}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="search" className="mt-0 px-density-lg py-density-lg">
                    <div className="grid max-w-xl gap-3 sm:grid-cols-2">
                      <label className="text-xs font-medium">
                        Customer number
                        <input value={query} onChange={(event) => setQuery(event.target.value)} className={cn("mt-1 h-10 w-full rounded-lg border px-3 text-sm", LINE)} />
                      </label>
                      <label className="text-xs font-medium">
                        Customer name
                        <input value={query} onChange={(event) => setQuery(event.target.value)} className={cn("mt-1 h-10 w-full rounded-lg border px-3 text-sm", LINE)} />
                      </label>
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => setSearchTab("recent")}>Search</Button>
                  </TabsContent>
                  <TabsContent value="advanced" className="mt-0 px-density-lg py-density-lg">
                    <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
                      {["Brand", "State", "Bill cycle"].map((label) => (
                        <label key={label} className="text-xs font-medium">
                          {label}
                          <input className={cn("mt-1 h-10 w-full rounded-lg border px-3 text-sm", LINE)} />
                        </label>
                      ))}
                    </div>
                    <Button size="sm" className="mt-4" onClick={() => setSearchTab("recent")}>Search</Button>
                  </TabsContent>
                </Tabs>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between gap-density-sm">
                  <Breadcrumb className="min-w-0 overflow-hidden">
                    <BreadcrumbList className="min-w-0 flex-nowrap items-center gap-density-sm text-sm text-gray-700 dark:text-slate-300">
                      <BreadcrumbItem>
                        <button type="button" onClick={openCustomer} className="flex items-center text-gray-700 hover:text-gray-900 dark:text-slate-300" aria-label="Home">
                          <Icon name="home" size={18} className="text-gray-600 dark:text-slate-400" />
                        </button>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                      <BreadcrumbItem>
                        <button type="button" onClick={() => setScreen("search")} className="whitespace-nowrap text-gray-700 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100">
                          Customers
                        </button>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                      <BreadcrumbItem className="min-w-0">
                        <BreadcrumbPage className="truncate rounded bg-[#E8FBF5] px-2.5 py-1 font-normal text-[#007A5E] dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]">
                          {CUSTOMER.number} — {CUSTOMER.name}
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <Link href="/pages/us-glass-2" className={cn("flex shrink-0 items-center rounded-lg p-1.5 hover:bg-[#E8FBF5] dark:hover:bg-[#00D2A2]/20", GLASS_CARD)} title="Tally Glass">
                    <Image src="/GlassLogoTest.svg" alt="Tally Glass" width={80} height={24} className="h-5 w-auto dark:hidden" />
                    <Image src="/GlassLogoTest_darkmode.svg" alt="Tally Glass" width={80} height={24} className="hidden h-5 w-auto dark:block" />
                  </Link>
                </div>

                <div className={cn(GLASS_CARD, "rounded-2xl px-density-lg py-density-lg text-center")}>
                  <p className="text-sm text-gray-700 dark:text-slate-200">
                    {statusChecked
                      ? "Operation status is current. No replay is required."
                      : "Operation recovery checked. New deliberate actions are available; prior source operations are never replayed."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatusChecked(true)}
                    className="mt-1 text-sm font-medium text-[#007A5E] hover:underline dark:text-[#00D2A2]"
                  >
                    Check operation status
                  </button>
                </div>

                <Tabs value={mainTab} onValueChange={(value) => setMainTab(value as MainTab)}>
                  <div className="mb-density-xl">
                    <TabsList className={TAB_LIST}>
                      <TabsTrigger value="details" className={TAB_TRIGGER}>Details</TabsTrigger>
                      <TabsTrigger value="financial" className={TAB_TRIGGER}>Financial</TabsTrigger>
                      <TabsTrigger value="interaction" className={TAB_TRIGGER}>Interaction</TabsTrigger>
                      <TabsTrigger value="accounts" className={TAB_TRIGGER}>Accounts</TabsTrigger>
                      <TabsTrigger value="tasks" className={TAB_TRIGGER}>Tasks</TabsTrigger>
                      <TabsTrigger value="recurring" className={TAB_TRIGGER}>Recurring events</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="details" className="mt-0">
                    <div className="mb-density-lg">
                      <h2 className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>Customer details</h2>
                    </div>
                    <div className="space-y-density-xl">
                    <CollapsibleCard title="Summary" showMenu={false} className={CARD}>
                      <div className="grid gap-density-xl sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Name" value={CUSTOMER.name} />
                        <Field label="First name" value={CUSTOMER.firstName} />
                        <Field label="Last name" value={CUSTOMER.lastName} />
                        <Field label="Email address" value={CUSTOMER.email} />
                        <Field label="Phone" value={CUSTOMER.phonePlain} />
                        <Field label="Mobile" value="—" />
                        <Field label="Customer type" value="RESIDENT" />
                        <Field label="Language" value={CUSTOMER.language} />
                        <Field label="Priority" value="Standard" />
                        <Field label="Bill cycle" value={CUSTOMER.billCycleDetail} />
                        <Field label="Invoice delivery" value="EMAIL" />
                        <Field label="Email documents" value="Y" />
                        <Field label="Payment method" value={CUSTOMER.payMethod} />
                        <Field label="Treatment" value="Collections Low" />
                        <Field label="Credit status" value="Standard Credit Control Procedures Apply" />
                        <Field label="Promo" value="—" />
                        <Field label="A/C manager" value="—" />
                      </div>
                      <p className={cn("pt-density-md text-xs", MUTED)}>Bill cycle and treatment use lookup descriptions.</p>
                      <div className="mt-density-lg flex justify-end">
                        <Button size="sm" className={PRIMARY_BTN}>Edit</Button>
                      </div>
                    </CollapsibleCard>
                    <CollapsibleCard title="Billing address" showMenu={false} className={CARD}>
                      <div className="grid gap-density-xl sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Postal addr 1" value="8287 Fake Mailbox Rd" />
                        <Field label="Postal addr 2" value="—" />
                        <Field label="City" value="Anytown" />
                        <Field label="State" value="TX" />
                        <Field label="Zip" value="88785" />
                      </div>
                    </CollapsibleCard>
                    </div>
                  </TabsContent>

                  <TabsContent value="financial" className="mt-0 space-y-density-xl">
                    <div className={cn(GLASS_CARD, "grid gap-density-lg rounded-2xl p-density-lg lg:grid-cols-[220px_160px_1fr] lg:items-center")}>
                      <div>
                        <p className="text-sm text-muted-foreground">Current total</p>
                        <p className="mt-density-sm font-semibold tracking-tight text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-4xl)" }}>{CUSTOMER.total}</p>
                        <p className="mt-2 text-xs">Total {CUSTOMER.total} · Current {CUSTOMER.current}</p>
                        <p className={cn("mt-1 text-xs", MUTED)}>
                          Last invoice {CUSTOMER.lastInvoice} · Due {CUSTOMER.lastInvoiceDue} · Last receipt {CUSTOMER.lastReceipt}
                        </p>
                      </div>
                      <div className="flex justify-center">
                        <InvoiceDonut />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Aging mix</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {AGING.map((bucket) => (
                            <div key={bucket.label} className="flex items-center gap-2 text-sm">
                              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: bucket.color }} />
                              <span className={MUTED}>{bucket.label}</span>
                              <span className="font-medium">{bucket.amount}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 inline-flex rounded-lg bg-[#F3F4F6] p-1 text-xs dark:bg-white/10">
                          {["1 yr", "2 yr", "3 yr", "All"].map((period, index) => (
                            <span key={period} className={cn("rounded-md px-2.5 py-1", index === 0 ? "bg-white font-semibold text-[#007A5E] shadow-sm dark:bg-slate-800 dark:text-white" : MUTED)}>
                              {period}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Tabs value={ledgerTab} onValueChange={(value) => setLedgerTab(value as LedgerTab)} className={cn(GLASS_CARD, "rounded-2xl px-density-lg pb-density-lg pt-density-sm")}>
                      <div className="mb-density-xl">
                        <TabsList className={TAB_LIST}>
                          <TabsTrigger value="ledger" className={TAB_TRIGGER}>Ledger</TabsTrigger>
                          <TabsTrigger value="plans" className={TAB_TRIGGER}>Payment plans</TabsTrigger>
                          <TabsTrigger value="treatments" className={TAB_TRIGGER}>Invoice treatments</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="ledger" className="mt-0">
                        <div className="mb-density-lg flex flex-wrap items-center gap-density-sm">
                          <div className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-white/10">
                          {([
                            ["invoice", "Invoice"],
                            ["payment", "Payments"],
                            ["adjustments", "Adjustments"],
                          ] as const).map(([id, label]) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setLedgerKind((current) => (current === id ? "all" : id))}
                              className={cn(
                                "rounded-md px-2.5 py-1 text-xs font-medium",
                                ledgerKind === id ? "bg-white text-[#007A5E] shadow-sm dark:bg-white/10 dark:text-white" : "text-gray-500 hover:text-gray-800",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                          </div>
                          <div className="ml-auto flex h-9 min-w-[220px] items-center gap-2 rounded-lg bg-[#E9E9EB] px-3 text-sm text-gray-500 dark:bg-white/10">
                            <Icon name="search" size={16} />
                            <span>Transaction ID, Invoice ID</span>
                          </div>
                          <Button size="sm" className={PRIMARY_BTN}>Create adjustment</Button>
                          <Button size="sm" variant="secondary">Add payment</Button>
                          <Button size="sm" variant="outline">Balance transfer</Button>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {["Posted transaction", "Key dates", "Amount", "Running balance"].map((heading) => (
                                <TableHead key={heading}>{heading}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visibleLedger.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className={cn("py-8 text-center", MUTED)}>No transactions in this view.</TableCell>
                              </TableRow>
                            ) : (
                              visibleLedger.map((row) => (
                                <TableRow key={row.title}>
                                  <TableCell>
                                    <p className="font-medium">{row.title}</p>
                                    <p className={cn("text-xs", MUTED)}>{row.meta}</p>
                                  </TableCell>
                                  <TableCell>
                                    <p>{row.key}</p>
                                    {row.keySub && <p className={cn("text-xs", MUTED)}>{row.keySub}</p>}
                                  </TableCell>
                                  <TableCell className={row.credit ? "font-medium text-[#008000]" : "font-medium"}>{row.amount}</TableCell>
                                  <TableCell>
                                    <span className="font-medium">{row.balance}</span>
                                    {row.mark && <span className={cn("ml-2 text-[10px] font-semibold", MUTED)}>{row.mark}</span>}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </TabsContent>
                      <TabsContent value="plans" className="mt-0"><EmptyPane title="No payment plans." /></TabsContent>
                      <TabsContent value="treatments" className="mt-0"><EmptyPane title="No invoice treatments." /></TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="interaction" className="mt-0">
                    <Tabs value={activityTab} onValueChange={(value) => setActivityTab(value as ActivityTab)} className={cn(GLASS_CARD, "rounded-2xl px-density-lg pb-density-lg pt-density-lg")}>
                      <div className="mb-density-lg">
                        <p className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>Activity list</p>
                        <p className="mt-density-xs text-sm text-muted-foreground">114 activities</p>
                      </div>
                      <div className="mb-density-xl">
                        <TabsList className={TAB_LIST}>
                          <TabsTrigger value="activity" className={TAB_TRIGGER}>Activity</TabsTrigger>
                          <TabsTrigger value="document" className={TAB_TRIGGER}>Document</TabsTrigger>
                          <TabsTrigger value="email" className={TAB_TRIGGER}>Email</TabsTrigger>
                        </TabsList>
                      </div>
                      <TabsContent value="activity" className="mt-0">
                        <div className="mb-density-lg flex flex-wrap items-center gap-density-sm">
                          <div className="inline-flex rounded-lg bg-gray-100 p-1 dark:bg-white/10">
                          {([
                            ["activity", "Activity"],
                            ["call", "Call note"],
                            ["correspondence", "Correspondence"],
                            ["system", "System event"],
                          ] as const).map(([id, label]) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setActivityFilter(id)}
                              className={cn(
                                "rounded-md px-2.5 py-1 text-xs font-medium",
                                activityFilter === id ? "bg-white text-[#007A5E] shadow-sm dark:bg-white/10 dark:text-white" : "text-gray-500 hover:text-gray-800",
                              )}
                            >
                              {label}
                            </button>
                          ))}
                          </div>
                          <div className="ml-auto flex items-center gap-2">
                            <Button size="sm" variant="ghost">Advanced search</Button>
                            <Button size="sm" variant="secondary">New activity</Button>
                          </div>
                        </div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {["", "Ref no.", "Quick code", "Type", "Date raised", "Assignee", "Due date", "Source", "Status", ""].map((heading) => (
                                <TableHead key={heading || "mark"}>{heading}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visibleActivities.map((row) => (
                              <React.Fragment key={row.ref}>
                                <TableRow>
                                  <TableCell>
                                    <span className={cn(
                                      "inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold",
                                      row.letter === "C" && "bg-[#D1FAE5] text-[#008000]",
                                      row.letter === "S" && "bg-[#E6F7FF] text-[#0074C4]",
                                      row.letter === "A" && "bg-[#FEF3C7] text-[#C53B00]",
                                    )}>
                                      {row.letter}
                                    </span>
                                  </TableCell>
                                  <TableCell className="font-medium text-[#007A5E] dark:text-[#00D2A2]">{row.ref}</TableCell>
                                  <TableCell>{row.code}</TableCell>
                                  <TableCell>{row.type}</TableCell>
                                  <TableCell>{row.raised}</TableCell>
                                  <TableCell>{row.assignee || "—"}</TableCell>
                                  <TableCell>{row.due}</TableCell>
                                  <TableCell>{row.source}</TableCell>
                                  <TableCell>{row.status}</TableCell>
                                  <TableCell>
                                    <button
                                      type="button"
                                      aria-label={`Toggle ${row.ref}`}
                                      onClick={() => setExpandedActivity((current) => (current === row.ref ? null : row.ref))}
                                      className={MUTED}
                                    >
                                      <Icon name={expandedActivity === row.ref ? "expand_less" : "expand_more"} size={18} />
                                    </button>
                                  </TableCell>
                                </TableRow>
                                {expandedActivity === row.ref && (
                                  <TableRow>
                                    <TableCell colSpan={10} className={cn("text-xs", MUTED)}>
                                      {row.code} · {row.type} · raised {row.raised} · {row.status}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </React.Fragment>
                            ))}
                          </TableBody>
                        </Table>
                        <p className={cn("px-2 py-3 text-xs", MUTED)}>Showing 1–{visibleActivities.length} of 114</p>
                      </TabsContent>
                      <TabsContent value="document" className="mt-0"><EmptyPane title="No documents." /></TabsContent>
                      <TabsContent value="email" className="mt-0"><EmptyPane title="No emails." /></TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="accounts" className="mt-0">
                    <div className="mb-density-lg flex flex-wrap items-center gap-density-md">
                      <h2 className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>Accounts</h2>
                      <Badge className="bg-gray-100 text-[10px] font-semibold text-gray-600 dark:bg-white/10 dark:text-slate-300">{visibleAccounts.length}</Badge>
                      <Button size="sm" className={cn("gap-1", PRIMARY_BTN)}>
                        <Icon name="add" size={14} />
                        Add
                      </Button>
                      <div className="ml-auto">
                        <Button size="sm" variant="ghost" className="gap-1" onClick={() => setAddressFilterOpen((open) => !open)}>
                          <Icon name="filter_alt" size={14} />
                          Filter by address
                        </Button>
                      </div>
                    </div>
                    {addressFilterOpen && (
                      <input
                        value={addressQuery}
                        onChange={(event) => setAddressQuery(event.target.value)}
                        placeholder="Filter by address"
                        className={cn("h-10 w-full max-w-sm rounded-lg border px-3 text-sm", LINE)}
                      />
                    )}
                    <div className={cn(CARD, "overflow-hidden")}>
                      <div className="flex flex-col @lg:flex-row @lg:items-stretch">
                        <div
                          className="flex w-full shrink-0 flex-col gap-1 border-b border-gray-200 bg-gray-50/80 p-2 @lg:w-60 @lg:border-b-0 @lg:border-r dark:border-white/10 dark:bg-white/[0.03]"
                          role="listbox"
                          aria-label="Accounts"
                        >
                          {visibleAccounts.length === 0 ? (
                            <p className={cn("rounded-lg px-2.5 py-3 text-xs", MUTED)}>No accounts match that address.</p>
                          ) : (
                            visibleAccounts.map((item) => {
                              const selected = item.id === account.id;
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  title={item.address}
                                  onClick={() => setAccountId(item.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-left transition-colors",
                                    selected
                                      ? "border-2 border-[#00D2A2] bg-white text-gray-900 dark:bg-gray-900 dark:text-slate-100"
                                      : "text-gray-700 hover:bg-white dark:text-slate-300 dark:hover:bg-white/10",
                                  )}
                                >
                                  <span className="min-w-0 flex-1">
                                    <span className="flex items-center gap-1.5">
                                      <span className="truncate text-xs font-semibold text-gray-900 dark:text-slate-100">{item.product}</span>
                                      {item.primary && (
                                        <Badge className="shrink-0 bg-[#E8FBF5] px-1 py-0 text-[9px] font-semibold uppercase tracking-wide text-[#007A5E] dark:bg-[#00D2A2]/20 dark:text-[#00D2A2]">
                                          Primary
                                        </Badge>
                                      )}
                                    </span>
                                    <span className="mt-0.5 block truncate font-mono text-[11px] leading-4 text-[#007A5E] dark:text-[#00D2A2]">{item.esi}</span>
                                    <span className={cn("mt-0.5 flex items-center gap-1 text-[11px] font-medium leading-4", item.status === "Active" ? "text-[#008000]" : MUTED)}>
                                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", item.status === "Active" ? "bg-[#008000]" : "bg-[#595767]")} />
                                      {item.status}
                                    </span>
                                    <span className="mt-0.5 block truncate text-[11px] leading-4 text-gray-500 dark:text-slate-400">{item.address}</span>
                                  </span>
                                  {selected && <Icon name="chevron_right" size={16} className="shrink-0 text-[#00D2A2]" />}
                                </button>
                              );
                            })
                          )}
                        </div>

                        <div className="min-w-0 flex-1 px-density-lg py-density-lg">
                          <div className="mb-density-md">
                            <h3 className="font-semibold text-gray-900 dark:text-slate-100" style={{ fontSize: "var(--tally-font-size-lg)" }}>{account.product}</h3>
                            <p className="mt-density-xs font-mono text-sm text-[#007A5E] dark:text-[#00D2A2]">{account.esi}</p>
                          </div>
                          <Tabs value={accountTab} onValueChange={(value) => setAccountTab(value as AccountTab)}>
                            <div className="mb-density-lg">
                              <TabsList className={TAB_LIST}>
                                <TabsTrigger value="details" className={TAB_TRIGGER}>Account details</TabsTrigger>
                                <TabsTrigger value="pricing" className={TAB_TRIGGER}>Pricing</TabsTrigger>
                                <TabsTrigger value="utility" className={TAB_TRIGGER}>Utility</TabsTrigger>
                                <TabsTrigger value="usage" className={TAB_TRIGGER}>Usage</TabsTrigger>
                                <TabsTrigger value="market" className={TAB_TRIGGER}>Market</TabsTrigger>
                                <TabsTrigger value="timeline" className={TAB_TRIGGER}>Timeline</TabsTrigger>
                              </TabsList>
                            </div>
                            <TabsContent value="details" className="mt-0">
                              <div className="grid gap-density-xl sm:grid-cols-2 lg:grid-cols-3">
                                <Field label="Account ID" value={account.summary.accountId} />
                                <Field label="ESI ID" value={account.summary.esiId} />
                                <Field label="Status" value={account.summary.status} />
                                <Field label="Status code" value={account.summary.statusCode} />
                                <Field label="Product" value={account.summary.product} />
                                <Field label="Service type" value={account.summary.serviceType} />
                                <Field label="Date connected" value={account.summary.dateConnected} />
                                <Field label="Date terminated" value={account.summary.dateTerminated} />
                                <Field label="Contract start" value={account.summary.contractStart} />
                                <Field label="Contract end" value={account.summary.contractEnd} />
                                <Field label="Closed reason" value={account.summary.closedReason} />
                                <Field label="Closed?" value={account.summary.closed} />
                                <Field label="Life support" value={account.summary.lifeSupport} />
                                <Field label="Switch hold" value={account.summary.switchHold} />
                              </div>
                            </TabsContent>
                            <TabsContent value="pricing" className="mt-0"><p className={cn("py-6 text-sm", MUTED)}>No pricing on file.</p></TabsContent>
                            <TabsContent value="utility" className="mt-0"><p className={cn("py-6 text-sm", MUTED)}>No utility details on file.</p></TabsContent>
                            <TabsContent value="usage" className="mt-0"><p className={cn("py-6 text-sm", MUTED)}>No usage on file.</p></TabsContent>
                            <TabsContent value="market" className="mt-0"><p className={cn("py-6 text-sm", MUTED)}>No market details on file.</p></TabsContent>
                            <TabsContent value="timeline" className="mt-0"><p className={cn("py-6 text-sm", MUTED)}>No timeline events.</p></TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0">
                    <EmptyPane title="No tasks." />
                  </TabsContent>
                  <TabsContent value="recurring" className="mt-0">
                    <EmptyPane title="No recurring events." />
                  </TabsContent>
                </Tabs>
              </>
            )}
            </div>
          </div>
        </main>

        <aside
          className={cn(
            "dark shrink-0 overflow-hidden bg-[#161B2E] transition-[width,padding] duration-300 ease-in-out",
            controlPanelOpen ? "w-80 p-3" : "w-14 py-4",
          )}
          aria-label="Control panel"
        >
          {!controlPanelOpen ? (
            <div className="flex h-full flex-col items-center gap-2">
              {([
                ["Control Panel", "tune"],
                ["X-Sell", "sell"],
              ] as const).map(([tab, icon]) => (
                <button
                  key={tab}
                  type="button"
                  aria-label={`Open ${tab}`}
                  title={tab}
                  onClick={() => {
                    setPanelTab(tab);
                    setControlPanelOpen(true);
                  }}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    panelTab === tab ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-slate-400 hover:bg-white/10 hover:text-slate-100",
                  )}
                >
                  <Icon name={icon} size={20} />
                </button>
              ))}
            </div>
          ) : (
            <div className={cn(GLASS_CARD, "flex h-full min-w-[290px] flex-col overflow-hidden rounded-2xl")}>
              <div className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex items-center gap-1 px-3 pb-2 pt-3">
                  <div className="flex flex-1 gap-1">
                    {(["Control Panel", "X-Sell"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setPanelTab(tab)}
                        className={cn(
                          "whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium",
                          panelTab === tab ? "bg-[#00D2A2]/20 text-[#00D2A2]" : "text-slate-500 hover:text-slate-300",
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setControlPanelOpen(false)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
                    aria-label="Close control panel"
                  >
                    <Icon name="right_panel_close" size={16} />
                  </button>
                </div>
                {panelTab === "Control Panel" ? (
                  <>
                    <div className="flex gap-2 border-b border-white/[0.06] p-3.5">
                      {([
                        ["check_box", "Tasks"],
                        ["add_comment", "New interaction"],
                        ["filter_alt", "Filter"],
                        ["layers", "Work items"],
                      ] as const).map(([icon, label], index) => (
                        <button
                          key={icon}
                          type="button"
                          aria-label={label}
                          className={cn(
                            "flex flex-1 items-center justify-center rounded-xl border px-1 py-2",
                            index === 0
                              ? "border-[#00D2A2]/30 bg-[#00D2A2]/20 text-[#00D2A2]"
                              : "border-white/[0.08] bg-white/[0.04] text-slate-400",
                          )}
                        >
                          <Icon name={icon} size={17} />
                        </button>
                      ))}
                    </div>
                    <div className="px-3.5 pt-3.5">
                      <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#00D2A2]/25 bg-[#00D2A2]/10 px-3 py-2.5 text-[13px] font-semibold text-[#00D2A2]">
                        <Icon name="add" size={16} />
                        Create new task
                      </button>
                    </div>
                    <div className="space-y-3 px-3.5 pt-3.5">
                      <div>
                        <p className="text-xs font-medium text-[#00D2A2]">What account is the task for?</p>
                        <p className="mt-1.5 border-b border-white/10 pb-2 text-sm text-slate-100">{CUSTOMER.number} {CUSTOMER.name}</p>
                      </div>
                      <input type="text" placeholder="Search for a specific task" className="w-full border-b-2 border-[#00D2A2] bg-transparent pb-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none" />
                    </div>
                  </>
                ) : (
                  <p className="px-3.5 py-3.5 text-sm text-slate-400">Offers available for this account.</p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
