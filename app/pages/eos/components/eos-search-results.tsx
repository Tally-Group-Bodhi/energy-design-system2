"use client";

import React from "react";
import Button from "@/components/Button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import EosSectionHeader from "./eos-section-header";
import EosResultsToolbar from "./eos-results-toolbar";

/** Column definition. Strings normalize to { label, key: label }. */
export interface EosColumn {
  /** Stable id; defaults to label */
  key?: string;
  label: string;
  /** Initially locked to the left edge */
  locked?: boolean;
  /** Fixed pixel width when locked (defaults to 180) */
  width?: number;
}

interface EosSearchResultsProps {
  title?: string;
  columns: Array<string | EosColumn>;
  /** Optional rows where each entry is an array of cells aligned to `columns`. */
  rows?: Array<Array<React.ReactNode>>;
  /** Override the displayed count; defaults to rows.length when rows are provided. */
  recordCount?: number;
  showSubmit?: boolean;
  submitDisabled?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string;
}

function normalizeColumns(columns: Array<string | EosColumn>): EosColumn[] {
  return columns.map((c) =>
    typeof c === "string"
      ? { key: c, label: c }
      : { key: c.key ?? c.label, label: c.label, locked: c.locked, width: c.width }
  );
}

export default function EosSearchResults({
  title = "Search Results",
  columns,
  rows,
  recordCount,
  showSubmit = true,
  submitDisabled = true,
  emptyTitle = "No results yet",
  emptyDescription = "Refine your filters and run the search to populate this table.",
  emptyIcon = "search",
}: EosSearchResultsProps) {
  const resolvedCount = recordCount ?? rows?.length ?? 0;
  const normalized = React.useMemo(() => normalizeColumns(columns), [columns]);

  const [lockedSet, setLockedSet] = React.useState<Set<string>>(
    () => new Set(normalized.filter((c) => c.locked).map((c) => c.key!))
  );

  const toggleLock = (key: string) => {
    setLockedSet((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  /** Locked columns in column order (left-to-right pin order). */
  const lockedOrdered = React.useMemo(
    () => normalized.filter((c) => lockedSet.has(c.key!)),
    [normalized, lockedSet]
  );

  /** Map columnKey -> left offset (px) for sticky positioning. */
  const lockOffsets = React.useMemo(() => {
    const offsets = new Map<string, number>();
    let acc = 0;
    lockedOrdered.forEach((c) => {
      offsets.set(c.key!, acc);
      acc += c.width ?? 180;
    });
    return offsets;
  }, [lockedOrdered]);

  const lastLockedKey = lockedOrdered[lockedOrdered.length - 1]?.key;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
      <EosSectionHeader
        title={title}
        description={
          resolvedCount === 0
            ? "Run a search to see results"
            : `${resolvedCount.toLocaleString()} ${resolvedCount === 1 ? "result" : "results"}`
        }
        actions={
          <>
            {lockedSet.size > 0 ? (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setLockedSet(new Set())}
                aria-label="Unlock all columns"
              >
                <Icon name="lock_open" size={16} className="mr-1" />
                Unlock all
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" aria-label="Export CSV" type="button">
              <Icon name="description" size={18} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Export Excel" type="button">
              <Icon name="table_view" size={18} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Column settings" type="button">
              <Icon name="settings" size={18} />
            </Button>
          </>
        }
      />

      <EosResultsToolbar totalCount={resolvedCount} />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 dark:bg-gray-800/60">
              {normalized.map((col, colIndex) => {
                const isLocked = lockedSet.has(col.key!);
                const isLastLocked = isLocked && col.key === lastLockedKey;
                const left = isLocked ? lockOffsets.get(col.key!) : undefined;

                return (
                  <TableHead
                    key={col.key}
                    style={{
                      ...(isLocked
                        ? {
                            position: "sticky",
                            left,
                            minWidth: col.width ?? 180,
                            zIndex: 20,
                          }
                        : null),
                    }}
                    className={cn(
                      "group whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300",
                      isLocked && "bg-gray-50 dark:bg-gray-800/60",
                      isLastLocked &&
                        "after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border dark:after:bg-gray-700"
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      <button
                        type="button"
                        onClick={() => toggleLock(col.key!)}
                        aria-label={isLocked ? `Unlock ${col.label}` : `Lock ${col.label}`}
                        aria-pressed={isLocked}
                        title={isLocked ? "Unpin column" : "Pin column to left"}
                        className={cn(
                          "rounded p-0.5 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700",
                          isLocked
                            ? "text-[#2C365D] opacity-100 dark:text-[#7c8cb8]"
                            : "text-muted-foreground opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                        )}
                      >
                        <Icon
                          name={isLocked ? "push_pin" : "push_pin"}
                          size={12}
                          className={isLocked ? "" : "rotate-45"}
                        />
                      </button>
                    </span>
                    {colIndex === 0 ? null : null}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {resolvedCount === 0 ? (
              <TableRow className="bg-white hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-900">
                <TableCell colSpan={normalized.length} className="p-0">
                  <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-muted-foreground dark:bg-gray-800">
                      <Icon name={emptyIcon} size={24} />
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {emptyTitle}
                      </p>
                      {emptyDescription ? (
                        <p className="max-w-sm text-sm text-muted-foreground">
                          {emptyDescription}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows?.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/40"
                >
                  {row.map((cell, cellIndex) => {
                    const col = normalized[cellIndex];
                    if (!col) return null;
                    const isLocked = lockedSet.has(col.key!);
                    const isLastLocked = isLocked && col.key === lastLockedKey;
                    const left = isLocked ? lockOffsets.get(col.key!) : undefined;

                    return (
                      <TableCell
                        key={cellIndex}
                        style={{
                          ...(isLocked
                            ? {
                                position: "sticky",
                                left,
                                minWidth: col.width ?? 180,
                                zIndex: 10,
                              }
                            : null),
                        }}
                        className={cn(
                          "whitespace-nowrap text-sm text-gray-900 dark:text-gray-100",
                          isLocked && "bg-inherit",
                          isLastLocked &&
                            "after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border dark:after:bg-gray-700"
                        )}
                      >
                        {cell}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border bg-gray-50/60 px-4 py-2 text-xs text-muted-foreground dark:border-gray-700 dark:bg-gray-800/30">
        <span>
          {resolvedCount.toLocaleString()} {resolvedCount === 1 ? "record" : "records"} found
        </span>
        {lockedSet.size > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Icon name="push_pin" size={12} />
            {lockedSet.size} {lockedSet.size === 1 ? "column" : "columns"} locked
          </span>
        ) : null}
      </div>

      {showSubmit ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-gray-50/60 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/30">
          <span className="text-xs text-muted-foreground">
            Select one or more rows to enable actions
          </span>
          <Button variant="primary" size="sm" disabled={submitDisabled}>
            Submit
          </Button>
        </div>
      ) : null}
    </section>
  );
}
