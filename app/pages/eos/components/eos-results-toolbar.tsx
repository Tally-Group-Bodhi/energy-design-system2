"use client";

import Input from "@/components/Input/Input";
import Select from "@/components/Select/Select";
import Button from "@/components/Button/Button";
import { Icon } from "@/components/ui/icon";

interface EosResultsToolbarProps {
  /** Total result count to show as plain text */
  totalCount?: number;
  /** Optional left-aligned content (e.g. extra filters) */
  leftSlot?: React.ReactNode;
  /** Optional placeholder for the filter input */
  filterPlaceholder?: string;
  /** Whether to show the rows-per-page select */
  showPageSize?: boolean;
  defaultPageSize?: string;
  /** Optional bulk actions slot */
  bulkActions?: React.ReactNode;
  /** Optional view options (e.g. export/settings) */
  viewOptions?: React.ReactNode;
}

export default function EosResultsToolbar({
  totalCount,
  leftSlot,
  filterPlaceholder = "Filter results",
  showPageSize = true,
  defaultPageSize = "25",
  bulkActions,
  viewOptions,
}: EosResultsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
      <div className="relative min-w-[200px] flex-1">
        <Icon
          name="search"
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input className="pl-9" placeholder={filterPlaceholder} aria-label={filterPlaceholder} />
      </div>

      {leftSlot}

      {typeof totalCount === "number" ? (
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {totalCount.toLocaleString()} {totalCount === 1 ? "result" : "results"}
        </span>
      ) : null}

      {bulkActions}

      {showPageSize ? (
        <div className="w-24">
          <Select defaultValue={defaultPageSize} aria-label="Rows per page">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </Select>
        </div>
      ) : null}

      {viewOptions ?? (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Export CSV" type="button">
            <Icon name="description" size={18} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Export Excel" type="button">
            <Icon name="table_view" size={18} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Column settings" type="button">
            <Icon name="settings" size={18} />
          </Button>
        </div>
      )}
    </div>
  );
}
