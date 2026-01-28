import React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-gray-50 border-gray-200 text-gray-900",
      success:
        "bg-[#D1FAE5] border-[#008000] text-[#008000]",
      warning:
        "bg-[#FEF3C7] border-[#C53B00] text-[#C53B00]",
      error: "bg-[#FEE2E2] border-[#C40000] text-[#C40000]",
      info: "bg-[#DBEAFE] border-[#0074C4] text-[#0074C4]",
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        ref={ref}
        className={cn("mb-1 font-medium leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

