import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      id,
      children,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[#C40000] focus-visible:ring-[#C40000]"
              : "border-[#DEDEE1]",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        {helperText && (
          <p
            className={cn(
              "mt-2 text-sm",
              error ? "text-[#C40000]" : "text-gray-600"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;

