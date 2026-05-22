"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Icon } from "@/components/ui/icon";

export interface EosPageHeaderCrumb {
  label: string;
  href?: string;
}

interface EosPageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  crumbs?: EosPageHeaderCrumb[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export default function EosPageHeader({
  title,
  description,
  icon,
  crumbs,
  actions,
  meta,
}: EosPageHeaderProps) {
  return (
    <header className="mb-6 space-y-3">
      {crumbs && crumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList className="text-xs text-muted-foreground">
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <BreadcrumbItem key={`${crumb.label}-${idx}`}>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium text-gray-900 dark:text-gray-100">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <span className="text-muted-foreground">{crumb.label}</span>
                      <BreadcrumbSeparator className="[&>svg]:size-3" />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#7c8cb8]/15 dark:text-[#7c8cb8]">
              <Icon name={icon} size={22} />
            </span>
          ) : null}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 sm:text-2xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
            {meta ? <div className="mt-2">{meta}</div> : null}
          </div>
        </div>

        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
