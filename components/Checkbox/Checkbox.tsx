import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, id, ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={checkboxId}
          ref={ref}
          className={cn(
            "h-4 w-4 rounded border-[#DEDEE1] text-[#2C365D] transition-colors",
            "focus:ring-2 focus:ring-[#2C365D] focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="mt-1 text-sm text-gray-600">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export default Checkbox;

