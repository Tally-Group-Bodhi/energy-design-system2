"use client";

import React from "react";
import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Badge from "@/components/Badge/Badge";
import Button from "@/components/Button/Button";
import { Card, CardContent } from "@/components/Card/Card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/DropdownMenu/DropdownMenu";
import { Icon } from "@/components/ui/icon";
import EosPageHeader from "../components/eos-page-header";
import EosSectionHeader from "../components/eos-section-header";
import EosResultsToolbar from "../components/eos-results-toolbar";
import { WORK_QUEUE_ROWS } from "../eos-mock-data";

const CATEGORY_LINKS = [
  { label: "Comment", count: 12 },
  { label: "Drop warning call targets", count: 4 },
  { label: "Dunning email", count: 8 },
  { label: "Invoicing", count: 23 },
  { label: "Target for forced cancellation notice", count: 2 },
  { label: "Transactions", count: 17 },
  { label: "Usage", count: 6 },
];

function PriorityBadge({ priority }: { priority: string }) {
  const variant: "error" | "warning" | "outline" =
    priority === "High" ? "error" : priority === "Normal" ? "warning" : "outline";
  return (
    <Badge variant={variant} className="text-[10px]">
      {priority}
    </Badge>
  );
}

export default function WorkQueueSearchView() {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const allSelected =
    selectedCount > 0 && selectedCount === WORK_QUEUE_ROWS.length;

  const toggleAll = (next: boolean) => {
    const newState: Record<string, boolean> = {};
    if (next) WORK_QUEUE_ROWS.forEach((r) => (newState[r.taskId] = true));
    setSelected(newState);
  };

  return (
    <div className="space-y-6">
      <EosPageHeader
        icon="work"
        crumbs={[
          { label: "EOS" },
          { label: "Operations" },
          { label: "Work Queue Search" },
        ]}
        title="Work Queue"
        description="Track and resolve open tasks assigned to you and your team."
        actions={
          <>
            <Button variant="outline" size="sm" type="button">
              <Icon name="filter_alt" size={16} className="mr-1.5" />
              Saved views
            </Button>
            <Button variant="primary" size="sm" type="button">
              <Icon name="add" size={16} className="mr-1.5" />
              New task
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-4">
          <Card className="overflow-hidden shadow-none">
            <EosSectionHeader title="Refine search" />
            <CardContent className="space-y-4 p-4">
              <Select label="Division" defaultValue="">
                <option value="">All divisions</option>
                <option value="commercial">Marubeni-Commercial</option>
              </Select>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                  Status
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["Open", "In progress", "Closed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors " +
                        (s === "Open"
                          ? "border-[#00D2A2] bg-[#E8FBF5] text-[#007A5E]"
                          : "border-border bg-white text-muted-foreground hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Select label="Interaction type" defaultValue="">
                <option value="">All types</option>
              </Select>
              <Input label="Filter search" placeholder="Subject, ID, account…" />
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-none">
            <EosSectionHeader title="By category" />
            <CardContent className="p-2">
              <ul>
                {CATEGORY_LINKS.map((cat) => (
                  <li key={cat.label}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <span className="truncate">{cat.label}</span>
                      <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:bg-gray-800">
                        {cat.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
          <EosSectionHeader
            title="Search results"
            description={`${WORK_QUEUE_ROWS.length} open tasks`}
            actions={
              <>
                <Button variant="ghost" size="icon" aria-label="Export PDF">
                  <Icon name="picture_as_pdf" size={18} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Export Excel">
                  <Icon name="table_view" size={18} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Refresh">
                  <Icon name="refresh" size={18} />
                </Button>
              </>
            }
          />

          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-gray-50/60 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/40">
            <span className="text-xs font-medium text-muted-foreground">
              Active filters:
            </span>
            <Badge
              variant="outline"
              className="gap-1 border-gray-300 bg-white px-2 py-0.5 text-xs font-normal text-gray-700"
            >
              <span className="text-muted-foreground">Status:</span>
              Open
              <button
                type="button"
                aria-label="Remove status filter"
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
              >
                <Icon name="close" size={12} />
              </button>
            </Badge>
          </div>

          <EosResultsToolbar
            totalCount={WORK_QUEUE_ROWS.length}
            filterPlaceholder="Filter by subject, ID, reporter…"
            bulkActions={
              selectedCount > 0 ? (
                <div className="flex items-center gap-2 rounded-md border border-[#2C365D]/20 bg-[#2C365D]/5 px-2 py-1.5 dark:border-[#7c8cb8]/30 dark:bg-[#7c8cb8]/10">
                  <span className="text-xs font-medium text-[#2C365D] dark:text-[#7c8cb8]">
                    {selectedCount} selected
                  </span>
                  <Button variant="ghost" size="sm" type="button">
                    Approve
                  </Button>
                  <Button variant="ghost" size="sm" type="button">
                    Assign
                  </Button>
                  <Button variant="ghost" size="sm" type="button">
                    Close
                  </Button>
                </div>
              ) : null
            }
          />

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800/60">
                  <TableHead className="w-8">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  {[
                    "Task",
                    "Subject",
                    "Reporter",
                    "Assignee",
                    "Created",
                    "Due",
                    "Priority",
                    "Status",
                    "",
                  ].map((col, i) => (
                    <TableHead
                      key={`${col}-${i}`}
                      className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {WORK_QUEUE_ROWS.map((row) => (
                  <TableRow key={row.taskId} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border"
                        checked={!!selected[row.taskId]}
                        onChange={(e) =>
                          setSelected((prev) => ({
                            ...prev,
                            [row.taskId]: e.target.checked,
                          }))
                        }
                        aria-label={`Select task ${row.taskId}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col leading-tight">
                        <button
                          type="button"
                          className="text-left font-mono text-sm font-semibold text-[#00D2A2] hover:underline"
                        >
                          #{row.reference}
                        </button>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {row.taskId} · {row.billingAccount}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px]">
                      <p className="line-clamp-2 text-sm text-gray-900 dark:text-gray-100">
                        {row.subject}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.reporter}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2C365D] text-[10px] font-semibold text-white dark:bg-[#7c8cb8]">
                          {row.assignee
                            .split(" ")
                            .map((s) => s[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                        <span className="text-xs text-gray-900 dark:text-gray-100">
                          {row.assignee}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {row.created}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">{row.dueDate}</TableCell>
                    <TableCell>
                      <PriorityBadge priority={row.priority} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">
                        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="icon" aria-label="Approve task">
                          <Icon name="check" size={16} className="text-[#008000]" />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="Reject task">
                          <Icon name="close" size={16} className="text-[#C40000]" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              aria-label="More actions"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <Icon name="more_vert" size={16} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Update status</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Icon name="play_arrow" size={16} className="mr-2" />
                              Start
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icon name="pause" size={16} className="mr-2" />
                              Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icon name="info" size={16} className="mr-2" />
                              Request info
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Icon name="person_add" size={16} className="mr-2" />
                              Reassign
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">
                              <Icon name="delete" size={16} className="mr-2" />
                              Cancel task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-gray-50/60 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/30">
            <span className="text-xs text-muted-foreground">
              Showing 1–{WORK_QUEUE_ROWS.length} of {WORK_QUEUE_ROWS.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" aria-label="Previous page" disabled>
                <Icon name="chevron_left" size={16} />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next page" disabled>
                <Icon name="chevron_right" size={16} />
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
