"use client";

import React from "react";
import Button from "@/components/Button/Button";
import Badge from "@/components/Badge/Badge";
import { Icon } from "@/components/ui/icon";

export interface ActiveFilterChip {
  id: string;
  label: string;
  value: string;
  onRemove?: () => void;
}

interface EosFilterBarProps {
  /** Filter inputs (a grid of selects/inputs) */
  children: React.ReactNode;
  /** Currently applied filter chips shown above the form */
  activeChips?: ActiveFilterChip[];
  onClearAll?: () => void;
  onSearch?: () => void;
  hasAdvanced?: boolean;
  advancedContent?: React.ReactNode;
  /** Show count of applied filters next to advanced toggle */
  advancedCount?: number;
}

export default function EosFilterBar({
  children,
  activeChips,
  onClearAll,
  onSearch,
  hasAdvanced = false,
  advancedContent,
  advancedCount = 0,
}: EosFilterBarProps) {
  const [advancedOpen, setAdvancedOpen] = React.useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-white dark:border-gray-700 dark:bg-gray-900">
      {activeChips && activeChips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-gray-50/60 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800/40">
          <span className="text-xs font-medium text-muted-foreground">
            Active filters:
          </span>
          {activeChips.map((chip) => (
            <Badge
              key={chip.id}
              variant="outline"
              className="gap-1 border-gray-300 bg-white px-2 py-0.5 text-xs font-normal text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <span className="font-medium text-muted-foreground">
                {chip.label}:
              </span>
              <span>{chip.value}</span>
              {chip.onRemove ? (
                <button
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove ${chip.label} filter`}
                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Icon name="close" size={12} />
                </button>
              ) : null}
            </Badge>
          ))}
          {onClearAll ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-gray-900 hover:underline dark:hover:text-gray-100"
            >
              Clear all
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="p-4 sm:p-5">{children}</div>

      {hasAdvanced && advancedContent ? (
        <div className="border-t border-border dark:border-gray-700">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#2C365D] hover:bg-gray-50 dark:text-[#7c8cb8] dark:hover:bg-gray-800/40"
            aria-expanded={advancedOpen}
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon
                name={advancedOpen ? "expand_less" : "expand_more"}
                size={18}
              />
              {advancedOpen ? "Hide advanced search" : "Show advanced search"}
              {advancedCount > 0 ? (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {advancedCount}
                </Badge>
              ) : null}
            </span>
          </button>
          {advancedOpen ? (
            <div className="border-t border-border bg-gray-50/40 p-4 dark:border-gray-700 dark:bg-gray-800/20 sm:p-5">
              {advancedContent}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border bg-gray-50/60 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/30">
        <Button variant="ghost" size="sm" type="button" onClick={onClearAll}>
          Clear
        </Button>
        <Button variant="primary" size="sm" type="button" onClick={onSearch}>
          <Icon name="search" size={16} className="mr-1.5" />
          Search
        </Button>
      </div>
    </section>
  );
}
