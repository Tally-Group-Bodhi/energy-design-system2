"use client";

import { Calendar as CalendarPrimitive, CalendarDayButton } from "@/components/ui/calendar";
import type { ComponentProps } from "react";

export type CalendarProps = ComponentProps<typeof CalendarPrimitive>;

export default function Calendar(props: CalendarProps) {
  return <CalendarPrimitive {...props} />;
}

export { CalendarDayButton };
