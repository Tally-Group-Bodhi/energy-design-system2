import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-primary",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus-visible:ring-secondary",
        ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
        // Energy design system: primary = default
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary",
        success: "bg-[#008000] text-white hover:bg-[#006600] focus-visible:ring-[#008000]",
        warning: "bg-[#C53B00] text-white hover:bg-[#a03000] focus-visible:ring-[#C53B00]",
        error: "bg-[#C40000] text-white hover:bg-[#a00000] focus-visible:ring-[#C40000]",
        info: "bg-[#0074C4] text-white hover:bg-[#005a9a] focus-visible:ring-[#0074C4]",
      },
      size: {
        sm: "h-8 px-3 rounded-md text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 rounded-lg text-base",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
