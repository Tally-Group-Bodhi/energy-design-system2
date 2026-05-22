"use client";

import React from "react";
import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Badge from "@/components/Badge/Badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/Tabs/Tabs";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import DetailFieldCard from "../components/detail-field-card";
import EosPageHeader from "../components/eos-page-header";
import { BILLING_ACCOUNTS } from "../eos-mock-data";

const SUPPLIER_FIELDS = [
  { label: "Postal code", value: "104-6591" },
  { label: "Address 1", value: "東京都" },
  { label: "Address 2", value: "中央区晴海" },
  { label: "Chome", value: "1" },
  { label: "Banchi", value: "8" },
  { label: "Go", value: "12" },
  { label: "Building", value: "晴海トリトンスクエア" },
  { label: "Room no.", value: "" },
];

const CONTACT_FIELDS = [
  { label: "Invoice recipient", value: "株式会社スペースライブラリ" },
  { label: "Corporate name (kanji)", value: "株式会社スペースライブラリ" },
  { label: "Corporate name (kana)", value: "" },
  { label: "Department", value: "管理課" },
  { label: "Contact name", value: "" },
  { label: "Phone", value: "03-6278-5600" },
  { label: "Email", value: "kanri-info@sbls.co.jp" },
];

const AR_FIELDS = [
  { label: "Total balance due", value: "¥19,244,549" },
  { label: "Current", value: "¥18,102,300" },
  { label: "Last invoice due", value: "2026/04/30 — ¥1,142,249" },
  { label: "Last payment", value: "2026/05/10 — ¥1,200,000" },
  { label: "Pending charges", value: "¥0" },
  { label: "Pending invoices", value: "¥0" },
  { label: "Collection status", value: "Current" },
];

function ServiceIcon({ service }: { service: string }) {
  if (service === "Electric") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
        <Icon name="bolt" size={16} />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
      <Icon name="local_fire_department" size={16} />
    </span>
  );
}

export default function CustomerBillingAccountsView() {
  const [selectedId, setSelectedId] = React.useState(BILLING_ACCOUNTS[0].id);
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const filteredAccounts = BILLING_ACCOUNTS.filter(
    (a) =>
      !search ||
      a.id.includes(search) ||
      a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <EosPageHeader
        crumbs={[
          { label: "EOS" },
          { label: "Operations" },
          { label: "Customer Account Summary" },
        ]}
        title="Customer Account Summary"
      />

      <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8FBF5] text-[#007A5E]">
              <Icon name="apartment" size={22} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-gray-900 dark:text-gray-100">
                  株式会社スペースライブラリ
                </h2>
                <span className="font-mono text-sm text-muted-foreground">#2001134444</span>
                <Badge variant="success" className="bg-[#E8FBF5] text-[#007A5E] hover:bg-[#E8FBF5]">
                  Active
                </Badge>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                104-6591 東京都中央区晴海1-8-12
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground sm:text-right">
            Passcode:{" "}
            <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
              ABA0CA59FE
            </span>
          </div>
        </div>
      </section>

      <div className="flex min-h-[560px] gap-0 overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
        {panelOpen ? (
          <aside className="flex w-72 shrink-0 flex-col border-r border-border dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-border px-4 py-3 dark:border-gray-700">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Billing accounts
                </h3>
                <p className="text-xs text-muted-foreground">
                  {filteredAccounts.length} of {BILLING_ACCOUNTS.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Collapse billing accounts panel"
              >
                <Icon name="chevron_left" size={18} />
              </button>
            </div>
            <div className="border-b border-border p-3 dark:border-gray-700">
              <div className="relative">
                <Icon
                  name="search"
                  size={16}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  className="pl-9"
                  placeholder="Search accounts"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search billing accounts"
                />
              </div>
            </div>
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {filteredAccounts.map((account) => {
                const isSelected = selectedId === account.id;
                return (
                  <li key={account.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(account.id)}
                      className={cn(
                        "group flex w-full items-start gap-3 border-l-2 px-3 py-3 text-left transition-colors",
                        isSelected
                          ? "border-l-[#00D2A2] bg-[#E8FBF5]/60 dark:border-l-[#00D2A2] dark:bg-[#00D2A2]/10"
                          : "border-l-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      )}
                    >
                      <ServiceIcon service={account.service} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {account.id}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {account.name}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className="h-4 border-gray-300 px-1.5 text-[10px] font-normal text-muted-foreground"
                          >
                            {account.service}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        ) : (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="flex w-10 shrink-0 flex-col items-center justify-center gap-2 border-r border-border text-xs font-medium text-muted-foreground hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            aria-label="Expand billing accounts panel"
          >
            <Icon name="chevron_right" size={18} />
            <span className="rotate-180 [writing-mode:vertical-rl]">Billing accounts</span>
          </button>
        )}

        <div className="min-w-0 flex-1 overflow-y-auto">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Billing account
                </span>
                <Badge variant="secondary">Marubeni-Commercial</Badge>
              </div>
              <p className="mt-1 font-mono text-base font-semibold text-gray-900 dark:text-gray-100">
                {selectedId}
              </p>
              <p className="text-xs text-muted-foreground">Matter no. S-TE-0000003780</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button">
                <Icon name="mail" size={16} className="mr-1.5" />
                Contact
              </Button>
              <Button variant="primary" size="sm" type="button">
                <Icon name="open_in_new" size={16} className="mr-1.5" />
                My page
              </Button>
            </div>
          </div>

          <div className="p-5">
            <Tabs defaultValue="billing">
              <TabsList className="mb-5">
                {[
                  { value: "billing", label: "Billing Account" },
                  { value: "services", label: "Services" },
                  { value: "contracts", label: "Contracts" },
                  { value: "activity", label: "Activity" },
                  { value: "questionnaire", label: "Questionnaire" },
                ].map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="billing" className="mt-0">
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                  <DetailFieldCard title="Supplier address" fields={SUPPLIER_FIELDS} />
                  <DetailFieldCard title="Authorized contacts" fields={CONTACT_FIELDS} />
                  <div className="space-y-3">
                    <DetailFieldCard title="AR summary" fields={AR_FIELDS} editable={false} />
                    <Button variant="outline" size="sm" type="button" className="w-full">
                      View AR details
                      <Icon name="arrow_forward" size={16} className="ml-1.5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
