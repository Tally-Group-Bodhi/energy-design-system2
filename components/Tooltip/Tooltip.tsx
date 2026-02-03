"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  children: React.ReactNode;
  delayDuration?: number;
}

export interface TooltipTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export interface TooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

const Tooltip = ({ children, delayDuration = 300 }: TooltipProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  TooltipTriggerProps
>(({ className, asChild, children, ...props }, ref) => {
  const { setOpen } = React.useContext(TooltipContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      onMouseEnter: () => setOpen(true),
      onMouseLeave: () => setOpen(false),
    } as React.Attributes & { onMouseEnter: () => void; onMouseLeave: () => void });
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipContentProps
>(({ className, side = "top", children, ...props }, ref) => {
  const { open } = React.useContext(TooltipContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  if (!open) return null;

  const sideClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
  };

  return (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 rounded-md border border-[#DEDEE1] bg-[#2C365D] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95",
        sideClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent };

