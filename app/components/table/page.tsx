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
import { useState } from "react";
import Badge from "@/components/Badge/Badge";

const sampleData = [
  { id: 1, name: "Item one", status: "Active", value: 100 },
  { id: 2, name: "Item two", status: "Pending", value: 200 },
  { id: 3, name: "Item three", status: "Active", value: 300 },
  { id: 4, name: "Item four", status: "Inactive", value: 150 },
  { id: 5, name: "Item five", status: "Active", value: 250 },
];

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
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600">
              Tables display data in rows and columns. These variations are
              inspired by{" "}
              <a
                href="https://www.ag-grid.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:no-underline"
              >
                AG Grid
              </a>
              : basic grids, striped rows, compact density, sortable-style
              headers, footers, bordered cells, row selection, and sticky
              headers. Use our Table components with border and foreground
              colours; icons from Material Symbols.
            </p>
          </div>

          {activeTab === "design" && (
            <div className="space-y-16">
              {/* Basic table */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
                  Bordered grid
                </h2>
                <p className="mb-4 max-w-2xl text-sm text-gray-600">
                  Full cell borders for a spreadsheet-like layout.
                </p>
                <div className="rounded-lg border border-border bg-card overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-[#DEDEE1]">
                        <TableHead className="border-r border-[#DEDEE1]">ID</TableHead>
                        <TableHead className="border-r border-[#DEDEE1]">Name</TableHead>
                        <TableHead className="border-r border-[#DEDEE1]">Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id} className="border-b border-[#DEDEE1]">
                          <TableCell className="border-r border-[#DEDEE1] font-medium">{row.id}</TableCell>
                          <TableCell className="border-r border-[#DEDEE1]">{row.name}</TableCell>
                          <TableCell className="border-r border-[#DEDEE1]">{row.status}</TableCell>
                          <TableCell className="text-right">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              {/* With row selection */}
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
                            className="h-4 w-4 rounded border-[#DEDEE1] text-[#2C365D] focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2"
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
                              className="h-4 w-4 rounded border-[#DEDEE1] text-[#2C365D] focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2"
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
              <section className="border-t border-gray-200 pt-16">
                <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">
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
                        <TableHead className="sticky top-0 z-10 border-b border-[#DEDEE1] bg-gray-50 shadow-sm">
                          ID
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-[#DEDEE1] bg-gray-50 shadow-sm">
                          Name
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-[#DEDEE1] bg-gray-50 shadow-sm">
                          Status
                        </TableHead>
                        <TableHead className="sticky top-0 z-10 border-b border-[#DEDEE1] bg-gray-50 text-right shadow-sm">
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
            </div>
          )}

          {activeTab === "code" && (
            <section className="border-t border-gray-200 pt-16">
              <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
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
