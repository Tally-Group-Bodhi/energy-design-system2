"use client";

import * as React from "react";
import { format, parse, isValid } from "date-fns";
import Calendar from "@/components/Calendar/Calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/Popover/Popover";
import { Icon } from "@/components/ui/icon";
import { ICON_MD } from "./SnowyPortalShell";

/**
 * Date field for the Snowy Hydro portal: the trigger matches the DS Input, and the
 * panel is the DS Calendar rather than the browser's own picker, which ignores
 * every token we set.
 *
 * `value` / `onChange` are ISO `yyyy-MM-dd` so this drops straight into state
 * that previously backed an `<input type="date">`.
 */
export function SnowyDatePicker({
  label,
  value,
  onChange,
  className = "",
  align = "start",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const [open, setOpen] = React.useState(false);
  const inputId = React.useId();

  const selected = React.useMemo(() => {
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  return (
    <div className={`w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-gray-900"
      >
        {label}
      </label>

      <Popover open={open} onOpenChange={setOpen} className="w-full">
        <PopoverTrigger
          id={inputId}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          className="flex h-11 w-full items-center justify-between gap-density-sm rounded-density-md border border-snowy-gray-300 bg-white px-density-md text-left text-sm text-snowy-gray-900"
        >
          <span className="truncate tabular-nums">
            {selected ? format(selected, "dd/MM/yyyy") : "Select date"}
          </span>
          <Icon
            name="calendar_today"
            size={ICON_MD}
            className="shrink-0 text-snowy-gray-600"
          />
        </PopoverTrigger>

        <PopoverContent
          align={align}
          className="snowy-calendar w-auto rounded-density-md border-snowy-gray-200 p-0 shadow-lg"
        >
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              if (date) onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
            captionLayout="dropdown"
            startMonth={new Date(2020, 0)}
            endMonth={new Date(2030, 11)}
            weekStartsOn={1}
            className="[--cell-size:2.25rem]"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
