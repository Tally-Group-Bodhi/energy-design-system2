"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import {
  EOS_ENVIRONMENTS,
  type EosGlassEnvironment,
} from "./eos-glass-theme";

interface EnvironmentSwitchProps {
  value: EosGlassEnvironment;
  onChange: (next: EosGlassEnvironment) => void;
  className?: string;
}

/** Segmented Residential / C&I switch that sits in the EOS Glass header chrome. */
export default function EnvironmentSwitch({
  value,
  onChange,
  className,
}: EnvironmentSwitchProps) {
  return (
    <div
      role="tablist"
      aria-label="Customer segment"
      className={cn(
        "flex items-center gap-0.5 rounded-full border p-0.5",
        "border-[#D1D1D6] bg-[#E9E9EB] dark:border-white/15 dark:bg-white/[0.06]",
        className
      )}
    >
      {EOS_ENVIRONMENTS.map((environment) => {
        const isActive = environment.id === value;
        return (
          <button
            key={environment.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(environment.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D2A2]/50",
              isActive
                ? "bg-white text-[#2C365D] shadow-sm dark:bg-[#00D2A2] dark:text-[#12203A]"
                : "text-[#8E8E93] hover:bg-black/[0.04] hover:text-[#1C1C1E] dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            )}
          >
            <Icon name={environment.icon} size={16} className="shrink-0" />
            <span className="hidden sm:inline">{environment.label}</span>
          </button>
        );
      })}
    </div>
  );
}
