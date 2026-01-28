import React from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
}

export interface RadioItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, label, helperText, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {label && (
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-900">
              {label}
            </label>
            {helperText && (
              <p
                className={cn(
                  "mt-1 text-sm",
                  error ? "text-[#C40000]" : "text-gray-600"
                )}
              >
                {helperText}
              </p>
            )}
          </div>
        )}
        <div className="space-y-2">{children}</div>
      </div>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

const RadioItem = React.forwardRef<HTMLInputElement, RadioItemProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-center space-x-3">
        <input
          type="radio"
          id={radioId}
          ref={ref}
          className={cn(
            "h-4 w-4 border-[#DEDEE1] text-[#2C365D] transition-colors",
            "focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        <label
          htmlFor={radioId}
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  }
);
RadioItem.displayName = "RadioItem";

export { RadioGroup, RadioItem };

