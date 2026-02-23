import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

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
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "flex h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-10 py-2 text-sm text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-[#C40000] focus-visible:ring-[#C40000]"
                : "border-border",
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
          <span
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center justify-center text-gray-500 dark:text-gray-400"
            aria-hidden
          >
            <Icon name="expand_more" size={20} />
          </span>
        </div>
        {helperText && (
          <p
            className={cn(
              "mt-2 text-sm",
              error ? "text-[#C40000]" : "text-gray-600 dark:text-gray-400"
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

