"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: "", onValueChange: () => {} });

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value: controlledValue, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "");
    const value = controlledValue !== undefined ? controlledValue : internalValue;

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [controlledValue, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600",
          className
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        data-state={isSelected ? "active" : "inactive"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isSelected
            ? "bg-white text-[#2C365D] shadow-sm"
            : "text-gray-600 hover:text-gray-900",
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(TabsContext);
    const isSelected = selectedValue === value;

    if (!isSelected) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        tabIndex={0}
        className={cn(
          "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C365D] focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

