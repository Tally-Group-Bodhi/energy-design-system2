import React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, helperText, id, checked, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start space-x-3">
        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-[#2C365D] focus-within:ring-offset-2">
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            className="peer sr-only"
            checked={checked}
            {...props}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-full transition-colors",
              checked ? "bg-[#2C365D]" : "bg-gray-200 dark:bg-gray-600"
            )}
          />
          <span
            className={cn(
              "pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
              checked ? "translate-x-6" : "translate-x-1"
            )}
          />
        </div>
        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={switchId}
                className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";

export default Switch;

