"use client";

import React from "react";
import Badge from "@/components/Badge/Badge";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import { Icon } from "@/components/ui/icon";
import EosPageHeader from "../components/eos-page-header";
import EosFilterBar from "../components/eos-filter-bar";
import EosSearchResults from "../components/eos-search-results";
import {
  ENROLLMENT_RESULT_COLUMNS,
  ENROLLMENT_SEARCH_ROWS,
  type EnrollmentResultRow,
} from "../eos-mock-data";

const STATUS_VARIANT: Record<
  EnrollmentResultRow["status"],
  "success" | "warning" | "info" | "error" | "secondary" | "outline"
> = {
  Approved: "success",
  Completed: "success",
  "Pending Review": "warning",
  "In Progress": "info",
  "Awaiting Customer": "secondary",
  Rejected: "error",
};

const SERVICE_ICON: Record<EnrollmentResultRow["serviceType"], string> = {
  Electric: "bolt",
  Gas: "local_fire_department",
  "Electric + Gas": "all_inclusive",
};

function ServiceCell({ type }: { type: EnrollmentResultRow["serviceType"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-900 dark:text-gray-100">
      <Icon name={SERVICE_ICON[type]} size={16} className="text-muted-foreground" />
      {type}
    </span>
  );
}

export default function EnrollmentSearchView() {
  return (
    <div className="space-y-6">
      <EosPageHeader
        icon="search"
        crumbs={[
          { label: "EOS" },
          { label: "Acquisitions" },
          { label: "Enrollment Search" },
        ]}
        title="Enrollment Search"
        description="Find existing enrollments by confirmation, customer, utility area, or sales channel."
      />

      <EosFilterBar
        hasAdvanced
        advancedContent={
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input label="Reference number" />
            <Input label="Utility account number" />
            <Select label="Service type" defaultValue="">
              <option value="">All service types</option>
              <option value="electric">Electric</option>
              <option value="gas">Gas</option>
            </Select>
            <Input label="Application date from" placeholder="YYYY/MM/DD" />
            <Input label="Application date to" placeholder="YYYY/MM/DD" />
            <Select label="Status" defaultValue="">
              <option value="">Any status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="max-w-md">
            <Select label="Enrollment results" defaultValue="" helperText="Filter results by enrollment status">
              <option value="">Select…</option>
              <option value="all">All results</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Input label="Confirmation number" />
            <Input label="Customer name" placeholder="Partial match" />
            <Select label="Utility area" defaultValue="">
              <option value="">All areas</option>
              <option value="tokyo">Tokyo</option>
              <option value="osaka">Osaka</option>
            </Select>
            <Select label="Sales channels" defaultValue="">
              <option value="">All channels</option>
              <option value="direct">Direct</option>
              <option value="partner">Partner</option>
            </Select>
          </div>
        </div>
      </EosFilterBar>

      <EosSearchResults
        columns={ENROLLMENT_RESULT_COLUMNS}
        rows={ENROLLMENT_SEARCH_ROWS.map((row) => [
          <button
            key="confirmation"
            type="button"
            className="font-mono text-xs font-semibold text-[#007A5E] hover:underline"
          >
            {row.confirmationNumber}
          </button>,
          <span key="reference" className="font-mono text-xs text-muted-foreground">
            {row.referenceNumber}
          </span>,
          <span key="utility" className="font-mono text-xs text-muted-foreground">
            {row.utilityAccountNumber}
          </span>,
          <ServiceCell key="service" type={row.serviceType} />,
          <span key="customer" className="font-medium">
            {row.customerName}
          </span>,
          row.salesChannel,
          <span key="partner" className="text-muted-foreground">
            {row.salesChannelPartner}
          </span>,
          <span key="agent" className="font-mono text-xs">
            {row.salesAgentCode}
          </span>,
          <Badge key="status" variant={STATUS_VARIANT[row.status]}>
            {row.status}
          </Badge>,
          <span key="updated" className="whitespace-nowrap text-xs text-muted-foreground">
            {row.updatedDate}
          </span>,
        ])}
        emptyTitle="No enrollments to show"
        emptyDescription="Apply filters and run a search to find enrollments. Use saved searches to reuse common queries."
      />
    </div>
  );
}
