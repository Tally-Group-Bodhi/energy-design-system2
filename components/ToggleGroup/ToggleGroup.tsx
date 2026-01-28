"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Toggle from "@/components/Toggle/Toggle";

export interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export interface ToggleGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const ToggleGroupContext = React.createContext<{
  type: "single" | "multiple";
  value: string | string[];
  onValueChange: (value: string) => void;
}>({
  type: "single",
  value: "",
  onValueChange: () => {},
});

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const { type, value: currentValue, onValueChange } = React.useContext(ToggleGroupContext);
    const isPressed =
      type === "single"
        ? currentValue === value
        : Array.isArray(currentValue) && currentValue.includes(value);

    return (
      <Toggle
        ref={ref}
        pressed={isPressed}
        onPressedChange={() => onValueChange(value)}
        className={cn(
          "data-[state=on]:bg-[#2C365D] data-[state=on]:text-white",
          className
        )}
        {...props}
      />
    );
  }
);
ToggleGroupItem.displayName = "ToggleGroupItem";

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type = "single", value, onValueChange, children, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      type === "multiple" ? [] : ""
    );
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (itemValue: string) => {
      if (type === "single") {
        const newValue = currentValue === itemValue ? "" : itemValue;
        setInternalValue(newValue);
        onValueChange?.(newValue);
      } else {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const newValue = currentArray.includes(itemValue)
          ? currentArray.filter((v) => v !== itemValue)
          : [...currentArray, itemValue];
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }
    };

    return (
      <ToggleGroupContext.Provider
        value={{
          type,
          value: currentValue,
          onValueChange: handleValueChange,
        }}
      >
        <div
          ref={ref}
          role="group"
          className={cn("inline-flex items-center gap-1", className)}
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = "ToggleGroup";

export { ToggleGroup, ToggleGroupItem };

