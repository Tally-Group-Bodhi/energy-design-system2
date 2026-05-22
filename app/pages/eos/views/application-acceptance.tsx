"use client";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import { Icon } from "@/components/ui/icon";
import EosPageHeader from "../components/eos-page-header";
import EosFilterBar from "../components/eos-filter-bar";
import EosSearchResults from "../components/eos-search-results";

const COLUMNS = [
  "Confirmation Number",
  "Reference Number",
  "Utility Account Number",
  "Service Type",
  "Customer Name",
  "Sales Channels",
  "Sales Channel Partner",
  "Sales Agent Code",
  "Application Date From",
  "Application Status",
];

export default function ApplicationAcceptanceView() {
  return (
    <div className="space-y-6">
      <EosPageHeader
        icon="assignment_turned_in"
        crumbs={[
          { label: "EOS" },
          { label: "Acquisitions" },
          { label: "Application Acceptance" },
        ]}
        title="Application Acceptance Form"
        description="Search and accept incoming applications from agencies and partners."
        actions={
          <Button variant="primary" size="sm" type="button">
            <Icon name="upload_file" size={16} className="mr-1.5" />
            Upload applications
          </Button>
        }
      />

      <EosFilterBar>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Select label="Agency" defaultValue="">
            <option value="">All agencies</option>
            <option value="agency-a">Agency A</option>
          </Select>
          <Input label="SPID" />
          <Input label="Customer name" placeholder="Partial match" />
          <Input label="Customer name (kana)" placeholder="Partial match" />
          <Input label="Application date from" placeholder="YYYY/MM/DD" />
          <Input label="Application date to" placeholder="YYYY/MM/DD" />
          <Select label="Area" defaultValue="">
            <option value="">All areas</option>
            <option value="east">East</option>
          </Select>
          <Input label="Phone number" placeholder="Partial match" />
        </div>
      </EosFilterBar>

      <EosSearchResults
        columns={COLUMNS}
        recordCount={0}
        emptyTitle="No applications match your filters"
        emptyDescription="Try broadening the date range or clearing some filters."
        emptyIcon="inbox"
      />
    </div>
  );
}
