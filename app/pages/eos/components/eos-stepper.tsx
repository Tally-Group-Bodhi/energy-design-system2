"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export type EosStepStatus = "completed" | "active" | "upcoming";

export interface EosStep {
  label: string;
  description?: string;
  status: EosStepStatus;
}

interface EosStepperProps {
  steps: EosStep[];
}

export default function EosStepper({ steps }: EosStepperProps) {
  return (
    <nav aria-label="Progress" className="rounded-xl border border-border bg-white p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-5">
      <ol className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = step.status === "completed";
          const isActive = step.status === "active";

          return (
            <li
              key={step.label}
              className={cn(
                "flex items-center gap-3 sm:flex-1",
                !isLast && "sm:pr-2"
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted &&
                      "bg-[#00D2A2] text-white",
                    isActive &&
                      "border-2 border-[#2C365D] bg-white text-[#2C365D] dark:border-[#7c8cb8] dark:bg-gray-900 dark:text-[#7c8cb8]",
                    step.status === "upcoming" &&
                      "border border-border bg-gray-100 text-muted-foreground dark:bg-gray-800"
                  )}
                  aria-hidden
                >
                  {isCompleted ? (
                    <Icon name="check" size={18} />
                  ) : (
                    index + 1
                  )}
                </span>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wide",
                      isActive
                        ? "text-[#2C365D] dark:text-[#7c8cb8]"
                        : isCompleted
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-muted-foreground"
                    )}
                  >
                    Step {index + 1}
                  </p>
                  <p
                    className={cn(
                      "text-sm leading-tight",
                      isActive || isCompleted
                        ? "font-semibold text-gray-900 dark:text-gray-100"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {!isLast ? (
                <span
                  className={cn(
                    "ml-1 hidden h-px flex-1 sm:block",
                    isCompleted
                      ? "bg-[#00D2A2]"
                      : "bg-border dark:bg-gray-700"
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
