"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface CollapsibleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface CollapsibleTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export interface CollapsibleContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, defaultOpen = false, onOpenChange, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const setOpen = React.useCallback(
      (newOpen: boolean) => {
        if (controlledOpen === undefined) {
          setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
      },
      [controlledOpen, onOpenChange]
    );

    return (
      <CollapsibleContext.Provider value={{ open, setOpen }}>
        <div ref={ref} className={cn("", className)} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  CollapsibleTriggerProps
>(({ className, asChild, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      ref,
      onClick: () => setOpen(!open),
      "aria-expanded": open,
      "aria-controls": `collapsible-content`,
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn("", className)}
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls="collapsible-content"
      {...props}
    >
      {children}
    </button>
  );
});
CollapsibleTrigger.displayName = "CollapsibleTrigger";

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  CollapsibleContentProps
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext);

  return (
    <div
      ref={ref}
      id="collapsible-content"
      className={cn(
        "overflow-hidden transition-all",
        open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
      aria-hidden={!open}
      {...props}
    >
      {children}
    </div>
  );
});
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };

