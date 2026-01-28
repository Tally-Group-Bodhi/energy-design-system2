"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SliderProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      value || defaultValue || [min]
    );
    const currentValue = value !== undefined ? value : internalValue;
    const sliderValue = Array.isArray(currentValue) ? currentValue[0] : currentValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(e.target.value)];
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    const percentage = ((sliderValue - min) / (max - min)) * 100;

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={sliderValue}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-full bg-[#2C365D]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div
          className="absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-[#2C365D] bg-white shadow-sm transition-colors"
          style={{ left: `${percentage}%` }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export default Slider;

