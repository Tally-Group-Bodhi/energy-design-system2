"use client";

import { cn } from "@/lib/utils";

interface EosSectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  /** When true, renders a subtle compact header. Defaults to true. */
  subtle?: boolean;
}

export default function EosSectionHeader({
  title,
  description,
  actions,
  className,
  subtle = true,
}: EosSectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3",
        subtle
          ? "border-border bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          : "border-[#2C365D] bg-[#2C365D] text-white dark:border-gray-950 dark:bg-gray-950",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {subtle ? (
          <span
            className="inline-block h-4 w-1 rounded-sm bg-[#2C365D] dark:bg-[#7c8cb8]"
            aria-hidden
          />
        ) : null}
        <div className="min-w-0">
          <h3
            className={cn(
              "text-sm font-semibold tracking-tight",
              subtle
                ? "text-gray-900 dark:text-gray-100"
                : "text-white"
            )}
          >
            {title}
          </h3>
          {description ? (
            <p
              className={cn(
                "mt-0.5 text-xs",
                subtle ? "text-muted-foreground" : "text-white/80"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-1">{actions}</div> : null}
    </div>
  );
}
