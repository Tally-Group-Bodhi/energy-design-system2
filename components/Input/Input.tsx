import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-gray-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[#C40000] focus-visible:ring-[#C40000]"
              : "border-[#DEDEE1]",
            className
          )}
          {...props}
        />
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
Input.displayName = "Input";

export default Input;

