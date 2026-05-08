"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableFooter,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/Tooltip/Tooltip";
import { useState } from "react";
import Badge from "@/components/Badge/Badge";

const sampleData = [
  { id: 1, name: "Item one", status: "Active", value: 100 },
  { id: 2, name: "Item two", status: "Pending", value: 200 },
  { id: 3, name: "Item three", status: "Active", value: 300 },
  { id: 4, name: "Item four", status: "Inactive", value: 150 },
  { id: 5, name: "Item five", status: "Active", value: 250 },
];

const RESULTS_PER_PAGE_OPTIONS = [25, 50, 100, 150] as const;
const TOTAL_PAGES = 6;
const DEMO_CURRENT_PAGE = 4;

function PaginationDemo() {
  const [resultsPerPage, setResultsPerPage] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(DEMO_CURRENT_PAGE);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
      {/* Results per page */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-400">Results per page</span>
        <div className="flex items-center gap-1">
          {RESULTS_PER_PAGE_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setResultsPerPage(n)}
              aria-label={`${n} results per page`}
              aria-pressed={resultsPerPage === n}
              className={`flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-sm font-medium transition-colors ${
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
      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:hover:text-gray-400"
        >
          <Icon name="chevron_left" size={18} />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {[1, "ellipsis", 3, 4, 5, 6].map((page, i) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1 text-sm text-gray-500 dark:text-gray-400">
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page as number)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
                className={`relative flex h-8 min-w-8 items-center justify-center rounded px-2 text-sm font-medium transition-colors ${
                  currentPage === page
                    ? "text-[#2C365D] dark:text-white"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {page}
                {currentPage === page && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#00D2A2]"
                    aria-hidden
                  />
                )}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
          disabled={currentPage === TOTAL_PAGES}
          aria-label="Next page"
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:disabled:hover:text-gray-400"
        >
          Next
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </div>
  );
}

export default function TablePage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Table" />
      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              Tables display data in rows and columns.               These variations are
              inspired by{" "}
              <a
                href="https://www.ag-grid.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                AG Grid
              </a>
              . For advanced grids (sorting, filtering, virtualization, performance), see the{" "}
              <a
                href="https://github.com/ag-grid/ag-grid-demos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                official AG Grid demos
              </a>
              {" "}and{" "}
              <a
                href="https://github.com/ag-grid/ag-grid-demos/tree/main/performance"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                performance demos
              </a>
              {" "}(React, Angular, Vue). Here we focus on: basic grids, striped rows, compact density, sortable-style
              headers, footers, bordered cells, row selection, and sticky
              headers. Use our Table components with border and foreground
              colours; icons from Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-16">
              {/* Basic table */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Basic table
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Default data grid with header and body.
                </p>
                <div className="rounded-lg border border-border bg-card">
                  <Table>
                    <TableCaption>Sample data using Energy design system</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Icon name="tag" size={18} />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.slice(0, 3).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Striped rows */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Striped rows
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Alternate row background for easier scanning.
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row, i) => (
                        <TableRow
                          key={row.id}
                          className={i % 2 === 1 ? "bg-gray-50/80" : undefined}
                        >
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Compact / dense */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Compact density
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Reduced padding for more rows on screen.
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="h-8 px-2">ID</TableHead>
                        <TableHead className="h-8 px-2">Name</TableHead>
                        <TableHead className="h-8 px-2">Status</TableHead>
                        <TableHead className="h-8 px-2 text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="p-2 font-medium">{row.id}</TableCell>
                          <TableCell className="p-2">{row.name}</TableCell>
                          <TableCell className="p-2">{row.status}</TableCell>
                          <TableCell className="p-2 text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* With footer */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  With footer
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Totals or summary row in a table footer.
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={3} className="font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {sampleData.reduce((s, r) => s + r.value, 0)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </section>

              {/* Sortable-style headers */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Sortable-style headers
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Headers with sort indicator (visual only; wire up sorting in your app).
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <span className="inline-flex items-center gap-1">
                            ID
                            <Icon name="unfold_more" size={14} className="text-muted-foreground" />
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="inline-flex items-center gap-1">
                            Name
                            <Icon name="unfold_more" size={14} className="text-muted-foreground" />
                          </span>
                        </TableHead>
                        <TableHead>
                          <span className="inline-flex items-center gap-1">
                            Status
                            <Icon name="unfold_more" size={14} className="text-muted-foreground" />
                          </span>
                        </TableHead>
                        <TableHead className="text-right">
                          <span className="inline-flex items-center gap-1 justify-end">
                            Value
                            <Icon name="expand_more" size={14} className="text-muted-foreground" />
                          </span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Bordered / grid */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Bordered grid
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Full cell borders for a spreadsheet-like layout.
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border">
                        <TableHead className="border-r border-border">ID</TableHead>
                        <TableHead className="border-r border-border">Name</TableHead>
                        <TableHead className="border-r border-border">Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id} className="border-b border-border">
                          <TableCell className="border-r border-border font-medium">{row.id}</TableCell>
                          <TableCell className="border-r border-border">{row.name}</TableCell>
                          <TableCell className="border-r border-border">{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Overflowing columns */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Overflowing columns
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                  When columns contain long text (addresses, emails, names), truncate with ellipsis and keep the table scannable. Use horizontal scroll on the table container so users can reveal more columns; expose full content on hover via a tooltip or <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">title</code>.
                </p>
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Icon name="check_circle" size={16} className="text-[#008000] dark:text-green-400" />
                      Do
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Apply <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">max-w-* truncate</code> (or <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">min-w-0</code> in a flex cell) so long content shows an ellipsis.</li>
                      <li>Keep the table in a horizontally scrollable wrapper (<code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">overflow-auto</code>) so wide tables can be panned.</li>
                      <li>Show full text on hover with the design system <strong>Tooltip</strong> or the native <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">title</code> attribute.</li>
                      <li>Give headers a sensible <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">min-width</code> or truncate very long header labels so the column purpose is clear.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Icon name="cancel" size={16} className="text-[#C40000] dark:text-red-400" />
                      Avoid
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Letting every cell wrap so row heights become uneven and the table is hard to scan.</li>
                      <li>Clipping overflow without an ellipsis so users can’t tell content was cut off.</li>
                      <li>Omitting a way to see full content (no tooltip or title) for truncated cells.</li>
                    </ul>
                  </div>
                </div>
                <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Example 1: Truncated cells with tooltip on hover
                </p>
                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Name</TableHead>
                        <TableHead className="min-w-[180px]">Site address</TableHead>
                        <TableHead className="min-w-[120px]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="max-w-[120px] font-medium">
                          <span className="block truncate" title="Acme Industries">Acme Industries</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502">
                                LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="success">Active</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="max-w-[120px] font-medium">
                          <span className="block truncate" title="Beta Energy Co">Beta Energy Co</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700">
                                8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="max-w-[120px] font-medium">
                          <span className="block truncate" title="Gamma Utilities">Gamma Utilities</span>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263">
                                SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="success">Active</Badge></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <p className="mb-4 mt-10 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Example 2: Wide table with horizontal scroll (like account/customer lists)
                </p>
                <p className="mb-4 max-w-2xl text-sm text-gray-600 dark:text-gray-400">
                  Many columns with long content; the table wrapper scrolls horizontally. Truncate address, primary contact, and email; use tooltip or <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">title</code> to show full text on hover.
                </p>
                <div className="rounded-lg border border-border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800/60">
                        <TableHead className="min-w-[100px]">Name</TableHead>
                        <TableHead className="min-w-[90px]">Number</TableHead>
                        <TableHead className="min-w-[100px]">Connection</TableHead>
                        <TableHead className="min-w-[200px]">Site address</TableHead>
                        <TableHead className="min-w-[90px]">Status</TableHead>
                        <TableHead className="min-w-[140px]">Primary contact</TableHead>
                        <TableHead className="min-w-[180px]">Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="max-w-[100px] font-medium">
                          <span className="block truncate" title="Acme Industries">Acme Industries</span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">CON-001</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">NMI 123</TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502">
                                LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              LOT 156, DARETON SOLAR PARK, LOT 158, MILDURA VIC 3502
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="success">Active</Badge></TableCell>
                        <TableCell className="max-w-[140px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="Masked_Name_SCD105_Contact">Masked_Name_SCD105_Contact</span>
                        </TableCell>
                        <TableCell className="max-w-[180px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="testshared-f800354447671E@example.com">testshared-f800354447671E@example.com</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="max-w-[100px] font-medium">
                          <span className="block truncate" title="Beta Energy Co">Beta Energy Co</span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">CON-002</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">NMI 456</TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700">
                                8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              8 NORTHERN POWER STATION RD, PORT AUGUSTA SA 5700
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                        <TableCell className="max-w-[140px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="Masked_Name_A7C1A_Primary">Masked_Name_A7C1A_Primary</span>
                        </TableCell>
                        <TableCell className="max-w-[180px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="testshared-fed0304963D96@example.com">testshared-fed0304963D96@example.com</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="max-w-[100px] font-medium">
                          <span className="block truncate" title="Gamma Utilities">Gamma Utilities</span>
                        </TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">CON-003</TableCell>
                        <TableCell className="text-gray-700 dark:text-gray-300">NMI 789</TableCell>
                        <TableCell className="max-w-[200px] text-gray-700 dark:text-gray-300">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="block cursor-default truncate" title="SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263">
                                SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs text-sm">
                              SOLAR FARM, 11376 AUGUSTA HWY, COONAWARRA SA 5263
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell><Badge variant="success">Active</Badge></TableCell>
                        <TableCell className="max-w-[140px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="Masked_Name_4C4A30_Contact">Masked_Name_4C4A30_Contact</span>
                        </TableCell>
                        <TableCell className="max-w-[180px] text-gray-700 dark:text-gray-300">
                          <span className="block truncate" title="testshared-f800300170146A@example.com">testshared-f800300170146A@example.com</span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* With row selection */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Row selection
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Checkbox column for selecting rows (visual only).
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12 pr-0">
                          <input
                            type="checkbox"
                            aria-label="Select all"
                            className="h-4 w-4 rounded border-border text-[#2C365D] focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2"
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="pr-0">
                            <input
                              type="checkbox"
                              aria-label={`Select ${row.name}`}
                              className="h-4 w-4 rounded border-border text-[#2C365D] focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2"
                            />
                          </TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>
                            <Badge variant={row.status === "Active" ? "default" : "secondary"}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Sticky header */}
              <section className="border-t border-border pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Sticky header
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Header stays visible when scrolling long content. Sticky is
                  applied to each header cell so it works reliably in all
                  browsers.
                </p>
                <div className="max-h-64 overflow-auto rounded-lg border border-border bg-card">
                  <Table disableWrapper className="w-full border-collapse caption-bottom text-sm">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="sticky top-0 z-10 border-b border-border bg-gray-50 shadow-sm">
                          ID
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-border bg-gray-50 shadow-sm">
                          Name
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-border bg-gray-50 shadow-sm">
                          Status
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-border bg-gray-50 text-right shadow-sm">
                          Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...sampleData, ...sampleData.map((r, i) => ({ ...r, id: 10 + i }))].map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* Pagination & data rows guidelines — bottom of page */}
              <section className="border-t border-border pt-16 dark:border-gray-700">
                <h2 className="mb-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  Pagination and data rows
                </h2>
                <p className="mb-6 max-w-3xl text-base leading-6 text-gray-600 dark:text-gray-400">
                  When tables have many rows, provide a results-per-page control and page navigation. Follow these rules for consistency across products.
                </p>
                <div className="mb-10 grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Icon name="check_circle" size={16} className="text-[#008000] dark:text-green-400" />
                      Do
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Use standard results-per-page options: <strong>25, 50, 100, 150</strong>. Default to <strong>25</strong>.</li>
                      <li>Show Previous and Next with clear labels (and arrows). Disable Previous on page 1, Next on the last page.</li>
                      <li>Show a limited set of page numbers (e.g. 1 … 3 4 5 6) and use ellipsis when there are many pages.</li>
                      <li>Indicate the active page with distinct styling (e.g. primary text and accent underline).</li>
                      <li>Place “Results per page” on the left and page navigation on the right of the same bar.</li>
                      <li>Use <code className="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">aria-label</code> and disabled state for accessibility.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-gray-900 dark:text-gray-100">
                      <Icon name="cancel" size={16} className="text-[#C40000] dark:text-red-400" />
                      Avoid
                    </h3>
                    <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <li>Don’t show hundreds of rows without pagination or virtualisation.</li>
                      <li>Don’t use non-standard page sizes (e.g. 17, 33) unless the product has a specific need.</li>
                      <li>Don’t omit the active-page indicator or make it unclear which page is current.</li>
                      <li>Don’t stack results-per-page and pagination on separate rows when space allows a single bar.</li>
                    </ul>
                  </div>
                </div>
                <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Example: pagination bar
                </p>
                <PaginationDemo />
              </section>
            </div>
          )}

          {activeTab === "code" && (
            <section className="border-t border-border pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`import {
  Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, TableCaption,
} from "@/components/Table/Table";

<Table>
  <TableCaption>Caption</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Value</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Item</TableCell>
      <TableCell>100</TableCell>
    </TableRow>
  </TableBody>
</Table>`}</code>
              </pre>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
