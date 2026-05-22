"use client";

import React from "react";
import Button from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import { Icon } from "@/components/ui/icon";
import DetailFieldCard from "../components/detail-field-card";
import EosPageHeader from "../components/eos-page-header";

const ACCOUNT_OWNER_FIELDS = [
  { label: "Government / private flag", value: "Private" },
  { label: "Customer code", value: "0133943" },
  { label: "Partner name", value: "" },
  { label: "Company name", value: "株式会社スペースライブラリ" },
  { label: "Postal code", value: "104-6591" },
  { label: "Address 1", value: "東京都" },
  { label: "Address 2", value: "中央区" },
  { label: "Chome", value: "" },
  { label: "Banchi", value: "" },
  { label: "Go", value: "" },
  { label: "Building name", value: "" },
  { label: "Room no.", value: "" },
];

const PRIMARY_CONTACT_FIELDS = [
  { label: "Full name", value: "" },
  { label: "Name (kana)", value: "" },
  { label: "Department", value: "管理課" },
  { label: "Phone (main)", value: "03-6278-5600" },
  { label: "Email", value: "kanri-info@sbls.co.jp" },
  { label: "Company name", value: "株式会社スペースライブラリ" },
  { label: "Company name (kana)", value: "" },
];

const PROFILE_FIELDS = [
  { label: "Customer status", value: "Active" },
  { label: "Customer type", value: "Commercial" },
  { label: "Black customer", value: "No" },
  { label: "VIP", value: "No" },
  { label: "Do not call", value: "No" },
  { label: "Do not mail", value: "No" },
  { label: "Do not email", value: "No" },
];

export default function CustomerAccountSummaryView() {
  const [showMore, setShowMore] = React.useState(true);

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
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex min-w-0 gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8FBF5] text-[#007A5E] dark:bg-[#00D2A2]/15 dark:text-[#00D2A2]">
              <Icon name="apartment" size={26} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-gray-900 dark:text-gray-100 sm:text-xl">
                  株式会社スペースライブラリ
                </h2>
                <span className="font-mono text-sm text-muted-foreground">
                  #2001134444
                </span>
                <Badge variant="success" className="bg-[#E8FBF5] text-[#007A5E] hover:bg-[#E8FBF5]">
                  <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#00D2A2]" aria-hidden />
                  Active
                </Badge>
                <Badge variant="outline">Commercial</Badge>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Icon name="location_on" size={14} />
                  104-6591 東京都中央区晴海1-8-12
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon name="phone" size={14} />
                  03-6278-5600
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMore((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[#00D2A2] hover:underline"
                aria-expanded={showMore}
              >
                <Icon name={showMore ? "expand_less" : "expand_more"} size={16} />
                {showMore ? "Show less" : "Show more"}
              </button>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="text-xs text-muted-foreground">
              Passcode:{" "}
              <span className="ml-1 rounded bg-gray-100 px-1.5 py-0.5 font-mono font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                ABA0CA59FE
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" type="button">
                <Icon name="link" size={16} className="mr-1.5" />
                Link my page
              </Button>
              <Button variant="outline" size="sm" type="button">
                <Icon name="receipt_long" size={16} className="mr-1.5" />
                Billing
              </Button>
              <Button variant="primary" size="sm" type="button">
                <Icon name="edit" size={16} className="mr-1.5" />
                Edit account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {showMore ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <DetailFieldCard title="Account owner" fields={ACCOUNT_OWNER_FIELDS} />
          <div className="space-y-4">
            <DetailFieldCard title="Primary contact" fields={PRIMARY_CONTACT_FIELDS} />
            <DetailFieldCard
              title="Extended attributes"
              fields={[]}
              editable
              emptyMessage="No extended attributes have been set. Add them to capture custom data for this account."
            />
          </div>
          <div className="space-y-4">
            <DetailFieldCard title="Profile" fields={PROFILE_FIELDS} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
