"use client";

import Calendar from "@/components/Calendar/Calendar";
import PageBanner from "@/components/PageBanner/PageBanner";
import TabNavigation from "@/components/TabNavigation/TabNavigation";
import { useState } from "react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("design");

  const tabs = [
    { id: "design", label: "Design" },
    { id: "code", label: "Code" },
  ];

  return (
    <>
      <PageBanner title="Calendar" />

      <TabNavigation
        tabs={tabs}
        defaultTab="design"
        onTabChange={setActiveTab}
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="max-w-3xl text-lg leading-7 text-gray-600 dark:text-gray-400">
              A calendar component that allows users to select a date or a range
              of dates. Built on top of{" "}
              <a
                href="https://daypicker.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2C365D] underline dark:text-[#7c8cb8]"
              >
                React DayPicker
              </a>
              .
            </p>
          </div>

          {activeTab === "design" && (
            <>
              <BasicCalendarSection />
              <RangeCalendarSection />
              <MonthYearSelectorSection />
              <PresetsSection />
              <DateTimePickerSection />
              <BookedDatesSection />
              <CustomCellSizeSection />
              <WeekNumbersSection />
            </>
          )}

          {activeTab === "code" && <CodeSection />}
        </div>
      </div>
    </>
  );
}

/* ─── Basic Calendar ────────────────────────────────────────────────── */

function BasicCalendarSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Basic
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        A basic calendar with single date selection. Use{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          mode=&quot;single&quot;
        </code>{" "}
        to allow selecting one date.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border border-border bg-background"
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Range Calendar ────────────────────────────────────────────────── */

function RangeCalendarSection() {
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Range Calendar
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Use{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          mode=&quot;range&quot;
        </code>{" "}
        to enable date range selection. Use{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          numberOfMonths=&#123;2&#125;
        </code>{" "}
        to display multiple months.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-lg border border-border bg-background"
        />
        {range?.from && (
          <p className="text-sm text-muted-foreground">
            {range.to ? (
              <>
                <span className="font-medium text-foreground">{format(range.from, "PPP")}</span>
                {" – "}
                <span className="font-medium text-foreground">{format(range.to, "PPP")}</span>
              </>
            ) : (
              <>
                Selected from: <span className="font-medium text-foreground">{format(range.from, "PPP")}</span>
              </>
            )}
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Month and Year Selector ───────────────────────────────────────── */

function MonthYearSelectorSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Month and Year Selector
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Use{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          captionLayout=&quot;dropdown&quot;
        </code>{" "}
        to show month and year dropdown selectors for quick navigation.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          startMonth={new Date(1970, 0)}
          endMonth={new Date(2030, 11)}
          className="rounded-lg border border-border bg-background"
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Presets ────────────────────────────────────────────────────────── */

function PresetsSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const presets = [
    { label: "Today", date: new Date() },
    { label: "Tomorrow", date: addDays(new Date(), 1) },
    { label: "In 3 days", date: addDays(new Date(), 3) },
    { label: "In a week", date: addDays(new Date(), 7) },
    { label: "In 2 weeks", date: addDays(new Date(), 14) },
  ];

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Presets
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Combine the calendar with preset buttons for quick date selection.
      </p>
      <div className="flex flex-col items-start gap-4">
        <div className="flex rounded-lg border border-border bg-background">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <div className="flex flex-col gap-1 border-l border-border p-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setDate(preset.date)}
                className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                  date && format(date, "yyyy-MM-dd") === format(preset.date, "yyyy-MM-dd")
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Date and Time Picker ──────────────────────────────────────────── */

function DateTimePickerSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Date and Time Picker
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Combine a calendar with time inputs for selecting both a date and time
        range.
      </p>
      <div className="flex flex-col items-start gap-4">
        <div className="rounded-lg border border-border bg-background">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
          />
          <div className="border-t border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/50"
                />
              </div>
            </div>
          </div>
        </div>
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>{" "}
            from {startTime} to {endTime}
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Booked Dates ──────────────────────────────────────────────────── */

function BookedDatesSection() {
  const [date, setDate] = useState<Date | undefined>();

  const bookedDays = [
    addDays(new Date(), 1),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
    { from: addDays(new Date(), 8), to: addDays(new Date(), 12) },
  ];

  const bookedStyle = {
    textDecoration: "line-through",
    opacity: 0.4,
  };

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Booked Dates
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Disable specific dates or date ranges to show unavailable/booked days.
        Users cannot select disabled dates.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={bookedDays}
          modifiers={{ booked: bookedDays }}
          modifiersStyles={{ booked: bookedStyle }}
          className="rounded-lg border border-border bg-background"
        />
        {date ? (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Dates with strikethrough are booked and cannot be selected.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Custom Cell Size ──────────────────────────────────────────────── */

function CustomCellSizeSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Custom Cell Size
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Customize the size of calendar cells using the{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          --cell-size
        </code>{" "}
        CSS variable. You can make it responsive using breakpoint-specific
        values.
      </p>
      <div className="flex flex-wrap items-start gap-6">
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Default (2rem)
          </p>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-border bg-background"
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Large (2.75rem)
          </p>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-border bg-background [--cell-size:2.75rem]"
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Week Numbers ──────────────────────────────────────────────────── */

function WeekNumbersSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <section className="mb-16 border-t border-border pt-16">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        Week Numbers
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Use{" "}
        <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm dark:bg-gray-700">
          showWeekNumber
        </code>{" "}
        to display ISO week numbers alongside the calendar.
      </p>
      <div className="flex flex-col items-start gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          showWeekNumber
          className="rounded-lg border border-border bg-background"
        />
        {date && (
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">{format(date, "PPP")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

/* ─── Code Tab ──────────────────────────────────────────────────────── */

function CodeSection() {
  return (
    <>
      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Installation
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`npm install react-day-picker date-fns`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Basic Usage
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`import Calendar from "@/components/Calendar/Calendar";
import { useState } from "react";

function MyComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
    />
  );
}`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Range Selection
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`import Calendar from "@/components/Calendar/Calendar";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

function MyComponent() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-lg border"
    />
  );
}`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Month and Year Dropdown
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
  startMonth={new Date(1970, 0)}
  endMonth={new Date(2030, 11)}
  className="rounded-lg border"
/>`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Disabled / Booked Dates
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`import { addDays } from "date-fns";

const bookedDays = [
  addDays(new Date(), 1),
  addDays(new Date(), 2),
  { from: addDays(new Date(), 8), to: addDays(new Date(), 12) },
];

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={bookedDays}
  className="rounded-lg border"
/>`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Custom Cell Size
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`{/* Using CSS custom property */}
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:2.75rem]"
/>

{/* Responsive sizing */}
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:2rem] md:[--cell-size:2.75rem]"
/>`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Week Numbers
        </h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  showWeekNumber
  className="rounded-lg border"
/>`}</code>
        </pre>
      </section>

      <section className="mb-16 border-t border-border pt-16">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Props
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The Calendar component accepts all{" "}
          <a
            href="https://daypicker.dev/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2C365D] underline dark:text-[#7c8cb8]"
          >
            React DayPicker props
          </a>
          , plus the following:
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-100 dark:bg-gray-800">
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                  Prop
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                  Default
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">mode</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">&quot;single&quot; | &quot;range&quot; | &quot;multiple&quot;</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Selection mode</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">selected</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">Date | DateRange | Date[]</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Currently selected value</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">onSelect</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">function</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Callback on date selection</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">captionLayout</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">&quot;label&quot; | &quot;dropdown&quot;</td>
                <td className="px-4 py-3 text-muted-foreground">&quot;label&quot;</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Caption layout style</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">numberOfMonths</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">number</td>
                <td className="px-4 py-3 text-muted-foreground">1</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Number of months to display</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">showWeekNumber</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">boolean</td>
                <td className="px-4 py-3 text-muted-foreground">false</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Show ISO week numbers</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">showOutsideDays</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">boolean</td>
                <td className="px-4 py-3 text-muted-foreground">true</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Show days from adjacent months</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">disabled</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">Matcher | Matcher[]</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Days to disable</td>
              </tr>
              <tr className="bg-background">
                <td className="px-4 py-3 font-mono text-xs text-gray-900 dark:text-gray-100">className</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">string</td>
                <td className="px-4 py-3 text-muted-foreground">—</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Additional CSS classes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
