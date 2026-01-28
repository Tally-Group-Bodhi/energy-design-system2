import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export interface ButtonGroupSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export interface ButtonGroupTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex",
          orientation === "horizontal"
            ? "flex-row [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>button:not(:first-child)]:border-l-0"
            : "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>button:not(:first-child)]:border-t-0",
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

const ButtonGroupSeparator = React.forwardRef<
  HTMLDivElement,
  ButtonGroupSeparatorProps
>(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-[#DEDEE1]",
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-full w-px min-h-[1.5rem]",
        className
      )}
      {...props}
    />
  );
});
ButtonGroupSeparator.displayName = "ButtonGroupSeparator";

const ButtonGroupText = React.forwardRef<HTMLDivElement, ButtonGroupTextProps>(
  ({ className, asChild, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>;
      const childProps = childElement.props || {};
      const combinedClassName = cn(
        "px-3 py-2 text-sm font-medium text-[#595767]",
        className,
        childProps.className
      );
      return React.cloneElement(childElement, {
        ...childProps,
        ...props,
        className: combinedClassName,
      });
    }

    return (
      <div
        ref={ref}
        className={cn("px-3 py-2 text-sm font-medium text-[#595767]", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ButtonGroupText.displayName = "ButtonGroupText";

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };

