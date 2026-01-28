import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "info" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "bg-[#2C365D] text-white",
      secondary: "bg-[#00D2A2] text-white",
      success: "bg-[#008000] text-white",
      warning: "bg-[#C53B00] text-white",
      error: "bg-[#C40000] text-white",
      info: "bg-[#0074C4] text-white",
      outline: "border border-[#2C365D] text-[#2C365D] bg-transparent",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export default Badge;

