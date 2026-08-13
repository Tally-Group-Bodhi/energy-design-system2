"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "@/components/Card/Card";
import Checkbox from "@/components/Checkbox/Checkbox";
import Input from "@/components/Input/Input";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Tabs, TabsContent } from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";
import {
  ACCOUNT,
  ACCENT,
  CYAN_MARK,
  CYAN_LIGHT,
  CYAN_MID,
  HOME_HREF,
  ICON_LG,
  ICON_MD,
  ICON_SM,
  CleanCoPortalShell,
  chart,
  colours,
  money,
} from "../components/CleanCoPortalShell";

const ACCOUNT_TABS = [
  { value: "general", label: "General" },
  { value: "hierarchy", label: "Hierarchy" },
  { value: "data", label: "Data" },
  { value: "sites", label: "Sites" },
  { value: "finance", label: "Finance" },
  { value: "documents", label: "Documents" },
] as const;

type TabValue = (typeof ACCOUNT_TABS)[number]["value"];

const MONTHLY_CONSUMPTION = [
  { month: "Aug-25", offPeak: 55, peak: 60, generation: 1.45 },
  { month: "Sep-25", offPeak: 50, peak: 58, generation: 1.62 },
  { month: "Oct-25", offPeak: 52, peak: 60, generation: 1.85 },
  { month: "Nov-25", offPeak: 55, peak: 63, generation: 2.15 },
  { month: "Dec-25", offPeak: 60, peak: 73, generation: 2.45 },
  { month: "Jan-26", offPeak: 62, peak: 76, generation: 2.68 },
  { month: "Feb-26", offPeak: 56, peak: 65, generation: 2.3 },
  { month: "Mar-26", offPeak: 55, peak: 64, generation: 1.95 },
  { month: "Apr-26", offPeak: 52, peak: 60, generation: 1.42 },
  { month: "May-26", offPeak: 57, peak: 67, generation: 1.05 },
  { month: "Jun-26", offPeak: 56, peak: 64, generation: 0.72 },
  { month: "Jul-26", offPeak: 60, peak: 71, generation: 1.05 },
  { month: "Aug-26", offPeak: 26, peak: 29, generation: 0.58 },
].map((d) => ({
  ...d,
  offPeak: d.offPeak * 1_000_000,
  peak: d.peak * 1_000_000,
  generation: d.generation * 1_000_000,
}));

const HIERARCHY_CHILDREN = [
  { id: "100002", name: "DEECA Agriculture Victoria", sites: 42 },
  { id: "100022", name: "ALPINE RESORTS VICTORIA", sites: 8 },
  { id: "100031", name: "Ambulance Victoria", sites: 64 },
  { id: "100045", name: "CenITex", sites: 19 },
  { id: "100058", name: "Court Services Victoria", sites: 37 },
  { id: "100067", name: "Department of Education", sites: 812 },
  { id: "100074", name: "Department of Health", sites: 221 },
  { id: "100089", name: "Department of Justice and Community Safety", sites: 156 },
  { id: "100093", name: "Department of Transport and Planning", sites: 98 },
  { id: "100104", name: "Emergency Management Victoria", sites: 27 },
  { id: "100118", name: "Parks Victoria", sites: 73 },
  { id: "100129", name: "Victoria Police", sites: 184 },
];

const DATA_SECTIONS: {
  title: string;
  items: { title: string; description: string; icon: string; art: string }[];
}[] = [
  {
    title: "Downloads",
    items: [
      {
        title: "Nem12/13 data",
        description: "Interval metering data in NEM12/NEM13 format",
        icon: "download",
        art: "database",
      },
      {
        title: "Detailed usage",
        description: "Site-level consumption for the selected period",
        icon: "download",
        art: "monitoring",
      },
      {
        title: "Invoice extract",
        description: "Billing line items for child accounts",
        icon: "download",
        art: "receipt_long",
      },
      {
        title: "Contract schedule",
        description: "Active contracts and tariff assignments",
        icon: "download",
        art: "assignment",
      },
    ],
  },
  {
    title: "Life support",
    items: [
      {
        title: "Life support",
        description: "Data grid including all child accounts",
        icon: "monitoring",
        art: "medical_services",
      },
    ],
  },
  {
    title: "Profile",
    items: [
      {
        title: "Consumption",
        description: "Consumption by quality",
        icon: "bar_chart",
        art: "bolt",
      },
      {
        title: "Time of use",
        description: "Consumption by time of use",
        icon: "bar_chart",
        art: "schedule",
      },
      {
        title: "Demand profile",
        description: "Half-hourly demand across the portfolio",
        icon: "bar_chart",
        art: "show_chart",
      },
      {
        title: "Generation",
        description: "On-site generation by site",
        icon: "bar_chart",
        art: "solar_power",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Cost breakdown by charge",
        description: "Share of invoice by charge category",
        icon: "payments",
        art: "pie_chart",
      },
      {
        title: "Detailed finance",
        description: "Line-item finance export for the account",
        icon: "payments",
        art: "account_balance",
      },
    ],
  },
];

const axisTick = { fill: chart.axis, fontSize: 10 };
const tooltipStyle: React.CSSProperties = {
  borderRadius: "var(--tally-radius-md)",
  border: `1px solid ${chart.grid}`,
  fontSize: "var(--tally-font-size-sm)",
  color: colours.text,
  boxShadow: "0 4px 12px rgb(28 32 36 / 0.08)",
};
const inMillions = (value: number) => `${Math.round(value / 1_000_000)}M`;
const formatKwh = (value: number | undefined) =>
  `${new Intl.NumberFormat("en-AU", { maximumFractionDigits: 0 }).format(value ?? 0)} kWh`;

// ── Shared chrome for the account page ──────────────────────────────────────

function AccountHeader() {
  return (
    <div className="mb-density-lg flex flex-wrap items-start justify-between gap-density-lg">
      <div>
        <h1 className="flex items-center gap-density-sm text-density-3xl font-semibold text-cleanco-gray-900">
          Account: {ACCOUNT.id}
          <Icon name="chevron_right" size={ICON_LG} className="text-cleanco-cyan-700" />
        </h1>
        <p className="mt-density-xs text-density-base text-cleanco-gray-700">
          {ACCOUNT.name}
        </p>
      </div>
      <p className="text-density-lg font-medium text-cleanco-cyan-700">
        Account balance: {money.format(ACCOUNT.balance)}
      </p>
    </div>
  );
}

function AccountTabs({
  value,
  onValueChange,
}: {
  value: TabValue;
  onValueChange: (value: TabValue) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Account sections"
      className="mb-density-lg flex w-full gap-0 overflow-x-auto border-b border-cleanco-gray-200"
    >
      {ACCOUNT_TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(tab.value)}
            className={`shrink-0 border-b-2 px-density-lg py-density-md text-density-sm font-medium uppercase tracking-wide transition-colors ${
              active
                ? "border-cleanco-cyan-700 text-cleanco-cyan-700"
                : "border-transparent text-cleanco-gray-700 hover:text-cleanco-gray-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/** Label / value row used across General and Hierarchy summary cards. */
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-density-sm gap-y-1 py-density-sm">
      <dt className="min-w-[10rem] text-density-sm font-semibold text-cleanco-gray-900">
        {label}:
      </dt>
      <dd className="text-density-sm text-cleanco-gray-700">{children}</dd>
    </div>
  );
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-cleanco-gray-200 bg-white ${className}`}>
      <CardContent className="p-density-xl pt-density-xl">
        <h2 className="mb-density-md text-density-lg font-semibold text-cleanco-cyan-700">
          {title}
        </h2>
        {children}
      </CardContent>
    </Card>
  );
}

/** Brand-tinted icon chip for the trailing side of each data tile. */
function DataTileArt({ icon }: { icon: string }) {
  return (
    <span
      className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-cleanco-cyan-50"
      aria-hidden="true"
    >
      <Icon name={icon} size={28} className="text-cleanco-cyan-700" />
    </span>
  );
}

function DataTile({
  title,
  description,
  icon,
  art,
}: {
  title: string;
  description: string;
  icon: string;
  art: string;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-stretch gap-density-md rounded-density-lg border border-cleanco-gray-200 bg-white p-density-lg text-left transition-colors hover:border-cleanco-cyan-700/40 hover:bg-cleanco-cyan-50"
    >
      <div className="min-w-0 flex-1">
        <div className="mb-density-sm flex items-center gap-density-sm">
          <Icon name={icon} size={ICON_MD} className="text-cleanco-gray-700" />
          <span className="truncate text-density-base font-semibold text-cleanco-gray-900">
            {title}
          </span>
        </div>
        <p className="text-density-sm text-cleanco-gray-700">{description}</p>
      </div>
      <DataTileArt icon={art} />
    </button>
  );
}

function MonthlyConsumptionChart() {
  return (
    <Card className="border-cleanco-gray-200 bg-white">
      <CardContent className="p-density-xl pt-density-xl">
        <div className="mb-density-md flex items-center justify-between gap-density-md">
          <h3 className="text-density-lg font-medium text-cleanco-cyan-950">
            Monthly consumption
          </h3>
          <button
            type="button"
            aria-label="Expand monthly consumption"
            className="flex h-9 w-9 items-center justify-center rounded-density-md text-cleanco-gray-700 transition-colors hover:bg-cleanco-cyan-50 hover:text-cleanco-cyan-950"
          >
            <Icon name="open_in_full" size={ICON_MD} />
          </button>
        </div>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={MONTHLY_CONSUMPTION}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={chart.grid} vertical={false} />
              <XAxis
                dataKey="month"
                tick={axisTick}
                axisLine={{ stroke: chart.grid }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={48}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                tick={axisTick}
                tickFormatter={inMillions}
                axisLine={false}
                tickLine={false}
                width={44}
                label={{
                  value: "kWh",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: chart.axis, fontSize: 10 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={axisTick}
                tickFormatter={inMillions}
                axisLine={false}
                tickLine={false}
                width={44}
                label={{
                  value: "Generation",
                  angle: 90,
                  position: "insideRight",
                  style: { fill: chart.axis, fontSize: 10 },
                }}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={formatKwh} />
              <Bar
                yAxisId="left"
                dataKey="offPeak"
                name="Off-peak"
                stackId="consumption"
                fill={CYAN_LIGHT}
                barSize={22}
                isAnimationActive={false}
              />
              <Bar
                yAxisId="left"
                dataKey="peak"
                name="Peak"
                stackId="consumption"
                fill={ACCENT}
                barSize={22}
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="generation"
                name="Generation"
                stroke={CYAN_MARK}
                strokeWidth={2}
                dot={{ r: 2.5, fill: CYAN_MARK }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-density-sm flex flex-wrap items-center justify-center gap-x-density-lg gap-y-density-xs">
          {[
            { label: "Off-peak", colour: CYAN_LIGHT },
            { label: "Peak", colour: ACCENT },
            { label: "Generation", colour: CYAN_MARK },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-density-sm text-density-xs text-cleanco-gray-700"
            >
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: item.colour }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ── Tab panels ──────────────────────────────────────────────────────────────

function GeneralTab() {
  return (
    <div className="grid grid-cols-1 gap-density-lg lg:grid-cols-2">
      <SectionCard title="Account details">
        <dl>
          <DetailRow label="Account status">{ACCOUNT.status}</DetailRow>
          <DetailRow label="Parent account">
            <Checkbox
              checked={ACCOUNT.isParent}
              readOnly
              aria-label="Parent account"
              className="accent-[var(--color-cleanco-cyan-950)]"
            />
          </DetailRow>
          <DetailRow label="Billing addressee">
            {ACCOUNT.billingAddressee || "—"}
          </DetailRow>
          <DetailRow label="Billing address">{ACCOUNT.billingAddress}</DetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Contact information">
        <dl>
          <DetailRow label="Contact type">{ACCOUNT.contact.type}</DetailRow>
          <DetailRow label="Full name">{ACCOUNT.contact.fullName}</DetailRow>
          <DetailRow label="Preferred contact method">
            {ACCOUNT.contact.preferredMethod}
          </DetailRow>
          <DetailRow label="Landline phone">
            {ACCOUNT.contact.landline || "—"}
          </DetailRow>
          <DetailRow label="Mobile phone">
            {ACCOUNT.contact.mobile || "—"}
          </DetailRow>
          <DetailRow label="Email">{ACCOUNT.contact.email}</DetailRow>
          <DetailRow label="Address">{ACCOUNT.contact.address}</DetailRow>
        </dl>
      </SectionCard>

      <SectionCard title="Business information" className="lg:col-span-1">
        <dl>
          <DetailRow label="Business name">{ACCOUNT.business.name}</DetailRow>
          <DetailRow label="ABN / ACN">{ACCOUNT.business.abn || "—"}</DetailRow>
        </dl>
      </SectionCard>
    </div>
  );
}

function HierarchyTab() {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(ACCOUNT.id);

  const children = HIERARCHY_CHILDREN.filter((child) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      child.id.includes(q) || child.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="grid grid-cols-1 gap-density-lg xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <Card className="border-cleanco-gray-200 bg-white">
        <CardContent className="p-density-xl pt-density-xl">
          <div className="relative mb-density-md">
            <Icon
              name="search"
              size={ICON_MD}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cleanco-gray-700"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search hierarchy"
              className="h-11 rounded-density-md border-cleanco-gray-300 pl-10"
            />
          </div>

          <ul className="space-y-density-xs">
            <li>
              <button
                type="button"
                onClick={() => setSelectedId(ACCOUNT.id)}
                className={`flex w-full items-center gap-density-sm rounded-density-md px-density-md py-density-sm text-left transition-colors ${
                  selectedId === ACCOUNT.id
                    ? "bg-cleanco-cyan-50 text-cleanco-cyan-950"
                    : "text-cleanco-gray-700 hover:bg-cleanco-gray-100"
                }`}
              >
                <Icon name="expand_more" size={ICON_SM} />
                <Icon name="group" size={ICON_MD} />
                <span className="min-w-0 flex-1 truncate text-density-sm font-medium">
                  {ACCOUNT.id} {ACCOUNT.name}
                </span>
                <span className="tabular-nums text-density-sm text-cleanco-gray-700">
                  {HIERARCHY_CHILDREN.length}
                </span>
              </button>
            </li>

            {children.map((child) => (
              <li key={child.id} className="pl-density-xl">
                <button
                  type="button"
                  onClick={() => setSelectedId(child.id)}
                  className={`flex w-full items-center gap-density-sm rounded-density-md px-density-md py-density-sm text-left transition-colors ${
                    selectedId === child.id
                      ? "bg-cleanco-cyan-50 text-cleanco-cyan-950"
                      : "text-cleanco-gray-900 hover:bg-cleanco-gray-100"
                  }`}
                >
                  <Icon name="chevron_right" size={ICON_SM} className="text-cleanco-gray-700" />
                  <Icon name="person" size={ICON_MD} className="text-cleanco-gray-700" />
                  <span className="min-w-0 flex-1 truncate text-density-sm">
                    {child.id}: {child.name}
                  </span>
                  <span className="tabular-nums text-density-sm text-cleanco-gray-700">
                    {child.sites}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-density-lg">
        <SectionCard title={`Account: ${ACCOUNT.id}`}>
          <p className="mb-density-md text-density-base font-semibold text-cleanco-gray-900">
            {ACCOUNT.name}
          </p>
          <dl>
            <DetailRow label="Account status">{ACCOUNT.status}</DetailRow>
            <DetailRow label="Account balance">
              {money.format(ACCOUNT.balance)}
            </DetailRow>
            <DetailRow label="Parent account">—</DetailRow>
            <DetailRow label="Account service type">
              {ACCOUNT.serviceType}
            </DetailRow>
            <DetailRow label="Billing addressee">
              {ACCOUNT.billingAddressee || "—"}
            </DetailRow>
            <DetailRow label="Billing address">{ACCOUNT.billingAddress}</DetailRow>
          </dl>
        </SectionCard>

        <MonthlyConsumptionChart />
      </div>
    </div>
  );
}

function DataTab() {
  return (
    <div className="space-y-density-xl">
      {DATA_SECTIONS.map((section) => (
        <section key={section.title}>
          <h2 className="mb-density-md text-density-lg font-semibold text-cleanco-gray-900">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 gap-density-md sm:grid-cols-2 xl:grid-cols-4">
            {section.items.map((item) => (
              <DataTile key={item.title} {...item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ComingSoonTab({ label }: { label: string }) {
  return (
    <Card className="border-cleanco-gray-200 bg-white">
      <CardContent className="flex flex-col items-center justify-center gap-density-sm p-density-xxl pt-density-xxl text-center">
        <Icon name="construction" size={ICON_LG} className="text-cleanco-cyan-700" />
        <p className="text-density-lg font-medium text-cleanco-cyan-950">
          {label} is coming next
        </p>
        <p className="max-w-md text-density-sm text-cleanco-gray-700">
          This tab is stubbed so the account chrome stays complete. We will fill
          it in as we build out the remaining account views.
        </p>
      </CardContent>
    </Card>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function CleanCoAccountDetailsPage() {
  const [tab, setTab] = React.useState<TabValue>("general");

  return (
    <CleanCoPortalShell activeNavId="accounts-list">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm text-cleanco-gray-700">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={HOME_HREF} className="text-cleanco-cyan-700 hover:text-cleanco-cyan-950">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/pages/ci-portal/cleanco/accounts"
                className="text-cleanco-cyan-700 hover:text-cleanco-cyan-950"
              >
                Accounts
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-cleanco-gray-700">
              Account details
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <AccountHeader />

      <Tabs value={tab} onValueChange={(next) => setTab(next as TabValue)}>
        <AccountTabs value={tab} onValueChange={setTab} />
        <TabsContent value="general" className="mt-0">
          <GeneralTab />
        </TabsContent>
        <TabsContent value="hierarchy" className="mt-0">
          <HierarchyTab />
        </TabsContent>
        <TabsContent value="data" className="mt-0">
          <DataTab />
        </TabsContent>
        <TabsContent value="sites" className="mt-0">
          <ComingSoonTab label="Sites" />
        </TabsContent>
        <TabsContent value="finance" className="mt-0">
          <ComingSoonTab label="Finance" />
        </TabsContent>
        <TabsContent value="documents" className="mt-0">
          <ComingSoonTab label="Documents" />
        </TabsContent>
      </Tabs>
    </CleanCoPortalShell>
  );
}
