"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table/Table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/Card/Card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip/Tooltip";
import Checkbox from "@/components/Checkbox/Checkbox";

type AccountRow = {
  id: string;
  name: string;
  number: string;
  connection: string;
  siteAddress: string;
  status: string;
  accountType: string;
  primaryContact: string;
  email: string;
  mobile: string;
  phone: string;
  lifeSupport: boolean;
  sensitiveCustomer: boolean;
  concession: boolean;
};

const MASKED_NAMES = [
  "Masked_Name_5C31050F48",
  "Masked_Name_4C4A30AE1E",
  "Masked_Name_5CD105A2B3",
  "Masked_Name_DDBAB7E1",
  "Masked_Name_SCD105_Contact",
  "Masked_Name_8E2F9012",
  "Masked_Name_3A1B6C4D",
  "Masked_Name_9F0E7D8C",
];

const SITE_ADDRESSES = [
  "LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502",
  "B NORTHERN POWER STATION RD, P...",
  "12 INDUSTRY AVE, SMITHFIELD NSW 2164",
  "45 SOLAR FARM DRIVE, BROKEN HILL NSW 2880",
  "LOT 22, WIND FARM ESTATE, PORT AUGUSTA SA 5700",
  "78 RENEWABLE WAY, GEELONG VIC 3220",
  "3 GRID CONNECTION RD, NEWCASTLE NSW 2300",
  "UNIT 5, 100 ENERGY ST, MELBOURNE VIC 3000",
];

const EMAIL_SUFFIXES = [
  "testshared-f6d03b4447671e@example.com",
  "testshared-f800354447671E@example.com",
  "Masked_Name_DDBAB.",
  "Masked_Email_2A3B4C@example.com",
];

function buildRow(i: number): AccountRow {
  const name = MASKED_NAMES[i % MASKED_NAMES.length];
  const number = `OCA${23000019 + i}`;
  const connection = String(1000000 + i * 111);
  const siteAddress = SITE_ADDRESSES[i % SITE_ADDRESSES.length];
  const accountType = i % 5 === 0 ? "Generator" : "Occupier";
  const primaryContact = i % 4 === 0 ? "Masked_Name_SCD105_Contact" : `Masked_Name_${(i % 9).toString(16).toUpperCase().padStart(2, "0")}...`;
  const email = i % 3 === 0 ? EMAIL_SUFFIXES[i % EMAIL_SUFFIXES.length] : `Masked_Name_${String(i).padStart(2, "0")}.`;
  return {
    id: String(i + 1),
    name,
    number,
    connection,
    siteAddress,
    status: "Biling",
    accountType,
    primaryContact,
    email,
    mobile: i % 6 === 0 ? "0400123456" : "Masked_Phone",
    phone: i % 5 === 0 ? "0298765432" : "Masked_Phone",
    lifeSupport: false,
    sensitiveCustomer: false,
    concession: false,
  };
}

const TOTAL_ROWS = 70;
const sampleRowData: AccountRow[] = Array.from({ length: TOTAL_ROWS }, (_, i) => buildRow(i));

const RESULTS_PER_PAGE_OPTIONS = [25, 50, 100, 150] as const;

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 3) return [1, 2, 3, 4, "ellipsis", totalPages];
  if (currentPage >= totalPages - 2) return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export default function TablesPage() {
  const [resultsPerPage, setResultsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(String(4));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const totalRows = sampleRowData.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / resultsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const start = (currentPage - 1) * resultsPerPage;
  const end = Math.min(start + resultsPerPage, totalRows);
  const pageData = useMemo(
    () => sampleRowData.slice(start, end),
    [start, end]
  );

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl p-density-xl">
        <div className="mb-density-xxl">
          <h1 className="text-density-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Tables
          </h1>
          <p className="mt-density-xs max-w-3xl text-density-base text-muted-foreground">
            Data table template using the design system{" "}
            <Link href="/components/table" className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]">
              Table
            </Link>{" "}
            component. Use this pattern for accounts, transactions, and contacts. For very large datasets with built-in sorting, filtering, or virtualization, consider{" "}
            <a
              href="https://www.ag-grid.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]"
            >
              AG Grid
            </a>
            {" "}—see the{" "}
            <a
              href="https://github.com/ag-grid/ag-grid-demos"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]"
            >
              official demos
            </a>
            {" "}and{" "}
            <a
              href="https://github.com/ag-grid/ag-grid-demos/tree/main/performance"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]"
            >
              performance demos
            </a>
            {" "}(React, Angular, Vue) for examples, with the same column and data structure as this template.
          </p>
        </div>

        <section className="space-y-density-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-density-lg">Account / customer list (real-use-case)</CardTitle>
              <CardDescription>
                Table with masked data, row selection, and column tool panel. Use TableHeader, TableBody, TableRow, TableHead, and TableCell from the design system. Long text is truncated with tooltips.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <p className="border-b border-border px-density-md py-density-sm text-density-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
                Showing {pageData.length} of {totalRows} results
              </p>
              <div className="flex">
                <div className="min-w-0 flex-1 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                        <TableHead className="w-10 shrink-0 px-density-sm font-semibold text-gray-700 dark:text-gray-300">
                          <Checkbox aria-label="Select all" />
                        </TableHead>
                        <TableHead className="min-w-[120px] font-semibold text-gray-700 dark:text-gray-300">Name</TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-gray-700 dark:text-gray-300">Number</TableHead>
                        <TableHead className="min-w-[90px] font-semibold text-gray-700 dark:text-gray-300">Connection</TableHead>
                        <TableHead className="min-w-[200px] font-semibold text-gray-700 dark:text-gray-300">Site Address</TableHead>
                        <TableHead className="min-w-[80px] font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                        <TableHead className="min-w-[90px] font-semibold text-gray-700 dark:text-gray-300">Account</TableHead>
                        <TableHead className="min-w-[120px] font-semibold text-gray-700 dark:text-gray-300">Primary Contact</TableHead>
                        <TableHead className="min-w-[160px] font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
                        <TableHead className="min-w-[90px] font-semibold text-gray-700 dark:text-gray-300">Mobile</TableHead>
                        <TableHead className="min-w-[90px] font-semibold text-gray-700 dark:text-gray-300">Phone</TableHead>
                        <TableHead className="min-w-[90px] font-semibold text-gray-700 dark:text-gray-300">Life Support</TableHead>
                        <TableHead className="min-w-[100px] font-semibold text-gray-700 dark:text-gray-300">Sensitive Customer</TableHead>
                        <TableHead className="min-w-[80px] font-semibold text-gray-700 dark:text-gray-300">Concession</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pageData.map((row) => {
                        const isSelected = selectedRowId === row.id;
                        const isChecked = selectedIds.has(row.id);
                        return (
                          <TableRow
                            key={row.id}
                            className={`cursor-pointer dark:border-gray-700 ${isSelected ? "bg-[#E6F7FF] dark:bg-[#006180]/20" : ""}`}
                            onClick={() => setSelectedRowId(row.id)}
                          >
                            <TableCell className="w-10 shrink-0 px-density-sm" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isChecked}
                                onChange={(e) => {
                                  setSelectedIds((prev) => {
                                    const next = new Set(prev);
                                    if (e.target.checked) next.add(row.id);
                                    else next.delete(row.id);
                                    return next;
                                  });
                                }}
                                aria-label={`Select row ${row.id}`}
                              />
                            </TableCell>
                            <TableCell className="max-w-[120px] font-medium text-gray-900 dark:text-gray-100">
                              <span className="block truncate" title={row.name}>{row.name}</span>
                            </TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.number}</TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.connection}</TableCell>
                            <TableCell className="max-w-[200px] text-density-sm text-gray-700 dark:text-gray-300">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="block cursor-default truncate" title={row.siteAddress}>{row.siteAddress}</span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs text-density-sm">
                                  {row.siteAddress}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.status}</TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.accountType}</TableCell>
                            <TableCell className="max-w-[120px] text-density-sm text-gray-700 dark:text-gray-300">
                              <span className="block truncate" title={row.primaryContact}>{row.primaryContact}</span>
                            </TableCell>
                            <TableCell className="max-w-[160px] text-density-sm text-gray-700 dark:text-gray-300">
                              <span className="block truncate" title={row.email}>{row.email}</span>
                            </TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.mobile}</TableCell>
                            <TableCell className="text-density-sm text-gray-700 dark:text-gray-300">{row.phone}</TableCell>
                            <TableCell className="px-density-sm">
                              <Checkbox checked={row.lifeSupport} disabled aria-label="Life support" />
                            </TableCell>
                            <TableCell className="px-density-sm">
                              <Checkbox checked={row.sensitiveCustomer} disabled aria-label="Sensitive customer" />
                            </TableCell>
                            <TableCell className="px-density-sm">
                              <Checkbox checked={row.concession} disabled aria-label="Concession" />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex w-10 shrink-0 flex-col items-center gap-density-md border-l border-border bg-gray-50/80 py-density-md dark:border-gray-700 dark:bg-gray-800/40">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="flex flex-col items-center gap-density-xs text-density-xs font-medium text-gray-600 dark:text-gray-400" aria-label="Columns">
                        <Icon name="view_column" size={18} />
                        <span style={{ writingMode: "vertical-rl" }} className="rotate-180">Columns</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Show / hide columns</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="flex flex-col items-center gap-density-xs text-density-xs font-medium text-gray-600 dark:text-gray-400" aria-label="Filters">
                        <Icon name="filter_list" size={18} />
                        <span style={{ writingMode: "vertical-rl" }} className="rotate-180">Filters</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Open filters</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Pagination bar — follows Table component guidelines; density-aware */}
              <div className="flex flex-wrap items-center justify-between gap-density-md border-t border-border px-density-md py-density-sm dark:border-gray-700">
                <div className="flex items-center gap-density-sm">
                  <span className="text-density-sm text-gray-600 dark:text-gray-400">Results per page</span>
                  <div className="flex items-center gap-density-xs">
                    {RESULTS_PER_PAGE_OPTIONS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setResultsPerPage(n);
                          setCurrentPage(1);
                        }}
                        aria-label={`${n} results per page`}
                        aria-pressed={resultsPerPage === n}
                        className={`flex h-density-xl min-w-density-xl items-center justify-center rounded-full px-density-sm text-density-sm font-medium transition-colors ${
                          resultsPerPage === n
                            ? "bg-[#2C365D] text-white dark:bg-gray-200 dark:text-gray-900"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-density-sm">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex items-center gap-density-xs text-density-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:hover:text-gray-400"
                  >
                    <Icon name="chevron_left" size={18} />
                    Previous
                  </button>
                  <div className="flex items-center gap-density-xs">
                    {pageNumbers.map((page, i) =>
                      page === "ellipsis" ? (
                        <span key={`ellipsis-${i}`} className="px-density-xs text-density-sm text-gray-500 dark:text-gray-400">
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                          className={`relative flex h-density-xl min-w-density-xl items-center justify-center rounded-density-sm px-density-sm text-density-sm font-medium transition-colors ${
                            currentPage === page
                              ? "text-[#2C365D] dark:text-white"
                              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                          }`}
                        >
                          {page}
                          {currentPage === page && (
                            <span
                              className="absolute bottom-0 left-density-sm right-density-sm h-density-xs rounded-full bg-[#00D2A2]"
                              aria-hidden
                            />
                          )}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex items-center gap-density-xs text-density-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:hover:text-gray-400"
                  >
                    Next
                    <Icon name="chevron_right" size={18} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AG Grid performance demo — applied as template */}
          <Card>
            <CardHeader>
              <CardTitle className="text-density-lg">AG Grid performance-style template</CardTitle>
              <CardDescription>
                For large datasets (10k+ rows), virtualization, column tool panels, and export, use the{" "}
                <a
                  href="https://github.com/ag-grid/ag-grid-demos/tree/main/performance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]"
                >
                  AG Grid performance demos
                </a>{" "}
                as your example. Apply the same column and data shape as the basic table above (name, number, connection, site address, status, account type, primary contact, email, mobile, phone, life support, sensitive customer, concession).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-density-lg">
              <div>
                <h3 className="mb-density-sm text-density-sm font-semibold text-gray-900 dark:text-gray-100">What the performance demo gives you</h3>
                <ul className="list-inside list-disc space-y-density-xs text-density-sm text-muted-foreground">
                  <li><strong>Row virtualization</strong> — only visible rows rendered; 10k+ rows stay fast.</li>
                  <li><strong>Column tool panel</strong> — show/hide and reorder columns (e.g. “Columns” / “Filters” on the right).</li>
                  <li><strong>Floating filters</strong> — filter per column without a separate panel.</li>
                  <li><strong>Status bar</strong> — row counts, aggregates, selection summary.</li>
                  <li><strong>Export</strong> — CSV (community); Excel (Enterprise).</li>
                  <li><strong>Themes</strong> — Quartz, Alpine, Balham, Material; align with TDS via theme params or CSS variables.</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-density-sm text-density-sm font-semibold text-gray-900 dark:text-gray-100">How to apply it</h3>
                <p className="mb-density-sm text-density-sm text-muted-foreground">
                  Use the{" "}
                  <a
                    href="https://github.com/ag-grid/ag-grid-demos/tree/main/performance/react"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-[#2C365D] underline underline-offset-2 hover:no-underline dark:text-[#7c8cb8]"
                  >
                    React performance demo
                  </a>{" "}
                  as your base: <code className="rounded-density-sm bg-gray-200 px-density-xs py-0.5 text-density-xs dark:bg-gray-700">AgGridProvider</code> + <code className="rounded-density-sm bg-gray-200 px-density-xs py-0.5 text-density-xs dark:bg-gray-700">modules</code> (e.g. <code className="rounded-density-sm bg-gray-200 px-density-xs py-0.5 text-density-xs dark:bg-gray-700">AllCommunityModule</code>). Clone or copy from that repo and swap in this template’s column definitions and row data for consistency across products.
                </p>
                <pre className="overflow-x-auto rounded-density-lg border border-border bg-gray-50 p-density-md text-density-xs text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-200">
{`// Same data shape as this template (accounts / customers)
type AccountRow = {
  id: string;
  name: string;
  number: string;
  connection: string;
  siteAddress: string;
  status: string;
  accountType: string;
  primaryContact: string;
  email: string;
  mobile: string;
  phone: string;
  lifeSupport: boolean;
  sensitiveCustomer: boolean;
  concession: boolean;
};

// In your app: AgGridProvider + AllCommunityModule + AgGridReact
// See: github.com/ag-grid/ag-grid-demos/tree/main/performance/react`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
