"use client";

import { Icon } from "@/components/ui/icon";

interface EosEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EosEmptyState({
  icon = "search",
  title,
  description,
  action,
  className,
}: EosEmptyStateProps) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center " +
        (className ?? "")
      }
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-muted-foreground dark:bg-gray-800">
        <Icon name={icon} size={28} />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
