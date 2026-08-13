"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/Card/Card";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Badge from "@/components/Badge/Badge";
import Checkbox from "@/components/Checkbox/Checkbox";
import { EaDatePicker } from "../../components/EaDatePicker";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/Dialog/Dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import {
  HOME_HREF,
  ICON_LG,
  ICON_MD,
  NETWORK_SETTLEMENT_HREF,
  EaPortalShell,
  money,
} from "../../components/EaPortalShell";

interface RemittanceRow {
  id: string;
  paymentDate: string;
  participant: string;
  reference: string;
  invoiceCount: number;
  status: "Committed" | "Processing";
  amount: number;
  createdOn: string;
  note: string;
}

const ROWS: RemittanceRow[] = [
  {
    id: "1",
    paymentDate: "12/08/2026",
    participant: "Ausgrid",
    reference: "REM-2026-0812-01",
    invoiceCount: 18,
    status: "Committed",
    amount: 1900112.3,
    createdOn: "11/08/2026",
    note: "",
  },
  {
    id: "2",
    paymentDate: "11/08/2026",
    participant: "Essential Energy",
    reference: "REM-2026-0811-04",
    invoiceCount: 9,
    status: "Processing",
    amount: 790858.79,
    createdOn: "11/08/2026",
    note: "Awaiting bank file",
  },
  {
    id: "3",
    paymentDate: "10/08/2026",
    participant: "Powercor",
    reference: "REM-2026-0810-02",
    invoiceCount: 6,
    status: "Committed",
    amount: 1633440.5,
    createdOn: "09/08/2026",
    note: "",
  },
  {
    id: "4",
    paymentDate: "08/08/2026",
    participant: "SA Power Networks",
    reference: "REM-2026-0808-07",
    invoiceCount: 4,
    status: "Committed",
    amount: 88440.25,
    createdOn: "08/08/2026",
    note: "",
  },
  {
    id: "5",
    paymentDate: "07/08/2026",
    participant: "AusNet Services",
    reference: "REM-2026-0807-03",
    invoiceCount: 12,
    status: "Processing",
    amount: 334220.1,
    createdOn: "07/08/2026",
    note: "Dispute hold",
  },
  {
    id: "6",
    paymentDate: "05/08/2026",
    participant: "CitiPower",
    reference: "REM-2026-0805-01",
    invoiceCount: 3,
    status: "Committed",
    amount: 12400.0,
    createdOn: "05/08/2026",
    note: "",
  },
];

export default function NetworkRemittancePage() {
  const [query, setQuery] = React.useState("");
  const [participant, setParticipant] = React.useState("all");
  const [wizardOpen, setWizardOpen] = React.useState(false);
  const [distributor, setDistributor] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [selected, setSelected] = React.useState<string[]>([]);

  const filtered = ROWS.filter((row) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      row.reference.toLowerCase().includes(q) ||
      row.participant.toLowerCase().includes(q) ||
      row.note.toLowerCase().includes(q);
    const matchesParticipant =
      participant === "all" || row.participant === participant;
    return matchesQuery && matchesParticipant;
  });

  const allSelected =
    filtered.length > 0 && filtered.every((row) => selected.includes(row.id));

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) =>
        prev.filter((id) => !filtered.some((row) => row.id === id)),
      );
      return;
    }
    setSelected((prev) => [
      ...new Set([...prev, ...filtered.map((row) => row.id)]),
    ]);
  }

  function clearFilters() {
    setQuery("");
    setParticipant("all");
  }

  return (
    <EaPortalShell activeNavId="network-remittance">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm text-ea-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={HOME_HREF}
                className="text-ea-green-600 hover:text-ea-green-950"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={NETWORK_SETTLEMENT_HREF}
                className="text-ea-green-600 hover:text-ea-green-950"
              >
                Network settlement
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-ea-gray-600">
              Remittance
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-density-lg text-density-3xl font-semibold text-ea-gray-900">
        Remittance
      </h1>

      <Card className="border-ea-gray-200 bg-white">
        <CardContent className="p-density-xl pt-density-xl">
          <div className="mb-density-lg flex flex-wrap items-end gap-density-md">
            <div className="relative min-w-[280px] flex-1">
              <Icon
                name="search"
                size={ICON_MD}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ea-gray-600"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search invoices by payment reference, participant, etc"
                aria-label="Search remittances"
                className="h-11 rounded-density-md border-ea-gray-300 pl-10"
              />
            </div>
            <div className="w-52">
              <Select
                label="Participant"
                value={participant}
                onChange={(e) => setParticipant(e.target.value)}
                className="h-11 rounded-density-md border-ea-gray-300"
              >
                <option value="all">All participants</option>
                {[...new Set(ROWS.map((row) => row.participant))].map(
                  (name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ),
                )}
              </Select>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-11 items-center rounded-density-md border border-ea-gray-300 px-density-lg text-density-sm font-medium uppercase tracking-wide text-ea-gray-600 hover:bg-ea-gray-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setWizardOpen(true)}
              className="inline-flex h-11 items-center gap-density-sm rounded-density-md border border-[var(--color-ea-success)] px-density-lg text-density-sm font-medium uppercase tracking-wide text-[var(--color-ea-success)] hover:bg-[color-mix(in_srgb,var(--color-ea-success)_8%,white)]"
            >
              <Icon name="add" size={ICON_MD} />
              Create remittance
            </button>
            <button
              type="button"
              aria-label="Table settings"
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-density-md text-ea-gray-600 hover:bg-ea-gray-100"
            >
              <Icon name="settings" size={ICON_LG} />
            </button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-ea-gray-200 hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    onChange={toggleAll}
                    aria-label="Select all remittances"
                  />
                </TableHead>
                <TableHead className="text-ea-gray-600">Payment date</TableHead>
                <TableHead className="text-ea-gray-600">Participant</TableHead>
                <TableHead className="text-ea-gray-600">
                  Payment reference
                </TableHead>
                <TableHead className="text-ea-gray-600">
                  No. of invoices
                </TableHead>
                <TableHead className="text-ea-gray-600">Status</TableHead>
                <TableHead className="text-right text-ea-gray-600">
                  Amount incl. GST
                </TableHead>
                <TableHead className="text-ea-gray-600">Created on</TableHead>
                <TableHead className="text-ea-gray-600">Actions</TableHead>
                <TableHead className="text-ea-gray-600">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} className="border-ea-gray-200">
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelected((prev) =>
                          checked
                            ? [...prev, row.id]
                            : prev.filter((id) => id !== row.id),
                        );
                      }}
                      aria-label={`Select ${row.reference}`}
                    />
                  </TableCell>
                  <TableCell className="tabular-nums text-ea-gray-900">
                    {row.paymentDate}
                  </TableCell>
                  <TableCell className="text-ea-gray-900">
                    {row.participant}
                  </TableCell>
                  <TableCell className="tabular-nums text-ea-gray-600">
                    {row.reference}
                  </TableCell>
                  <TableCell className="tabular-nums text-ea-gray-900">
                    <span className="inline-flex items-center gap-1">
                      {row.invoiceCount}
                      <Icon
                        name="arrow_upward"
                        size={14}
                        className="text-ea-green-600"
                      />
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        row.status === "Committed" ? "success" : "secondary"
                      }
                      className={
                        row.status === "Committed"
                          ? "bg-[var(--color-ea-success)]"
                          : "bg-ea-gray-600"
                      }
                    >
                      {row.status === "Processing" && (
                        <Icon
                          name="progress_activity"
                          size={14}
                          className="mr-1 animate-spin"
                        />
                      )}
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-ea-gray-900">
                    {money.format(row.amount)}
                  </TableCell>
                  <TableCell className="tabular-nums text-ea-gray-600">
                    {row.createdOn}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-density-sm">
                      <button
                        type="button"
                        aria-label={`Print ${row.reference}`}
                        className="text-ea-green-600 hover:text-ea-green-950"
                      >
                        <Icon name="print" size={ICON_MD} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Download ${row.reference}`}
                        className="text-ea-green-600 hover:text-ea-green-950"
                      >
                        <Icon name="download" size={ICON_MD} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-ea-gray-600">
                    {row.note || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-density-lg flex flex-wrap items-center justify-end gap-density-lg text-density-sm text-ea-gray-600">
            <span>Rows per page: 100</span>
            <span>
              1–{filtered.length} of {ROWS.length}
            </span>
            <div className="flex items-center gap-density-xs">
              <button
                type="button"
                aria-label="Previous page"
                className="flex h-9 w-9 items-center justify-center rounded-density-md hover:bg-ea-gray-100"
                disabled
              >
                <Icon name="chevron_left" size={ICON_MD} />
              </button>
              <button
                type="button"
                aria-label="Next page"
                className="flex h-9 w-9 items-center justify-center rounded-density-md hover:bg-ea-gray-100"
                disabled
              >
                <Icon name="chevron_right" size={ICON_MD} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-lg rounded-density-lg border-ea-gray-200">
          <DialogHeader>
            <DialogTitle className="text-ea-green-950">
              Create remittance wizard
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-density-lg py-density-md">
            <Select
              label="Distributor"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              className="h-11 rounded-density-md border-ea-gray-300"
            >
              <option value="">Select distributor</option>
              {[...new Set(ROWS.map((row) => row.participant))].map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
            <EaDatePicker
              label="Due date"
              value={dueDate}
              onChange={setDueDate}
            />
          </div>
          <div className="flex justify-end gap-density-md">
            <button
              type="button"
              onClick={() => setWizardOpen(false)}
              className="inline-flex h-11 items-center rounded-density-md border border-ea-gray-300 px-density-lg text-density-sm font-medium uppercase tracking-wide text-ea-gray-600 hover:bg-ea-gray-100"
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center rounded-density-md border border-ea-green-950 px-density-lg text-density-sm font-medium uppercase tracking-wide text-ea-green-950 hover:bg-ea-green-50"
            >
              Next
            </button>
          </div>
          <DialogClose aria-label="Close">
            <Icon name="close" size={ICON_LG} className="text-ea-gray-600" />
          </DialogClose>
        </DialogContent>
      </Dialog>
    </EaPortalShell>
  );
}
