"use client";

import { Card, CardContent } from "@/components/Card/Card";
import { Icon } from "@/components/ui/icon";
import EosSectionHeader from "./eos-section-header";

export interface DetailField {
  label: string;
  value: string;
  /** When provided, the value renders as a tinted token-style link */
  href?: string;
}

interface DetailFieldCardProps {
  title: string;
  fields: DetailField[];
  editable?: boolean;
  emptyMessage?: string;
}

export default function DetailFieldCard({
  title,
  fields,
  editable = true,
  emptyMessage = "No information available",
}: DetailFieldCardProps) {
  return (
    <Card className="overflow-hidden shadow-none">
      <EosSectionHeader
        title={title}
        actions={
          editable ? (
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700"
              aria-label={`Edit ${title}`}
            >
              <Icon name="edit" size={16} />
            </button>
          ) : undefined
        }
      />
      <CardContent className="p-0">
        {fields.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <dl className="divide-y divide-border dark:divide-gray-700">
            {fields.map((field) => (
              <div
                key={field.label}
                className="grid grid-cols-[minmax(140px,42%)_1fr] gap-3 px-4 py-2.5 text-sm"
              >
                <dt className="text-muted-foreground">{field.label}</dt>
                <dd className="font-medium text-gray-900 dark:text-gray-100">
                  {field.href ? (
                    <a
                      href={field.href}
                      className="text-[#00D2A2] hover:underline"
                    >
                      {field.value}
                    </a>
                  ) : (
                    field.value || (
                      <span className="text-muted-foreground">—</span>
                    )
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </CardContent>
    </Card>
  );
}
