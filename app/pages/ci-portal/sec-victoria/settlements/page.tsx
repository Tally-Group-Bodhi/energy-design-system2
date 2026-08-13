"use client";

import * as React from "react";
import Link from "next/link";
import { format, parse } from "date-fns";
import { Card, CardContent } from "@/components/Card/Card";
import Calendar, { CalendarDayButton } from "@/components/Calendar/Calendar";
import Select from "@/components/Select/Select";
import { SecDatePicker } from "../components/SecDatePicker";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Icon } from "@/components/ui/icon";
import {
  HOME_HREF,
  ICON_MD,
  ICON_SM,
  SETTLEMENTS_HREF,
  SETTLEMENT_CASE_HREF,
  SecPortalShell,
  money,
} from "../components/SecPortalShell";

type DashTab = "current" | "calendar";

interface SettlementCard {
  code: string;
  title: string;
  due: string;
  caseId: string;
  /** ISO date the case is due — drives the calendar view. */
  dueDate: string;
  period: string;
  settlementAud: number;
  settlementMwh: number;
  differenceAud: number;
  differenceMwh: number;
  complete?: boolean;
}

interface WeekGroup {
  label: string;
  cards: SettlementCard[];
}

const WEEKS: WeekGroup[] = [
  {
    label: "Week 32 — 9/8/2026 to 15/8/2026",
    cards: [
      {
        code: "R1",
        title: "Week 13 Rev1",
        due: "Due Tuesday",
        caseId: "11755",
        dueDate: "2026-08-11",
        period: "22/03/26 to 28/03/26",
        settlementAud: 3929661,
        settlementMwh: 63608,
        differenceAud: -10131,
        differenceMwh: 119,
        complete: true,
      },
      {
        code: "F",
        title: "Week 13 Final",
        due: "Due Friday",
        caseId: "11576",
        dueDate: "2026-08-14",
        period: "22/03/26 to 28/03/26",
        settlementAud: 4012450,
        settlementMwh: 64102,
        differenceAud: 4200,
        differenceMwh: 86,
        complete: true,
      },
      {
        code: "R2",
        title: "Week 12 Rev2",
        due: "Due Thursday",
        caseId: "11490",
        dueDate: "2026-08-13",
        period: "15/03/26 to 21/03/26",
        settlementAud: 3788120,
        settlementMwh: 61244,
        differenceAud: -2210,
        differenceMwh: 44,
        complete: true,
      },
      {
        code: "P",
        title: "Week 14 Prelim",
        due: "Due Tuesday",
        caseId: "11802",
        dueDate: "2026-08-11",
        period: "29/03/26 to 04/04/26",
        settlementAud: 3554010,
        settlementMwh: 59810,
        differenceAud: 0,
        differenceMwh: 0,
      },
    ],
  },
  {
    label: "Week 31 — 2/8/2026 to 8/8/2026",
    cards: [
      {
        code: "R1",
        title: "Week 12 Rev1",
        due: "Due Tuesday",
        caseId: "11340",
        dueDate: "2026-08-04",
        period: "15/03/26 to 21/03/26",
        settlementAud: 3611220,
        settlementMwh: 60440,
        differenceAud: -880,
        differenceMwh: 12,
        complete: true,
      },
      {
        code: "F",
        title: "Week 11 Final",
        due: "Due Friday",
        caseId: "11210",
        dueDate: "2026-08-07",
        period: "08/03/26 to 14/03/26",
        settlementAud: 3499000,
        settlementMwh: 59120,
        differenceAud: 1550,
        differenceMwh: 28,
        complete: true,
      },
      {
        code: "P",
        title: "Week 13 Prelim",
        due: "Due Tuesday",
        caseId: "11545",
        dueDate: "2026-08-04",
        period: "22/03/26 to 28/03/26",
        settlementAud: 3880100,
        settlementMwh: 62890,
        differenceAud: -340,
        differenceMwh: 9,
        complete: true,
      },
    ],
  },
];

function formatMwh(value: number) {
  return `${new Intl.NumberFormat("en-AU").format(value)} MWh`;
}

function SettlementWeekCard({ card }: { card: SettlementCard }) {
  return (
    <Link
      href={card.caseId === "11755" ? SETTLEMENT_CASE_HREF : SETTLEMENTS_HREF}
      className="block rounded-density-lg border border-sec-gray-200 bg-white p-density-lg transition-colors hover:border-sec-orange-600/40"
    >
      <div className="mb-density-md flex items-start gap-density-md">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sec-gray-100 text-density-sm font-semibold text-sec-gray-600">
          {card.code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-density-base font-semibold text-sec-purple-950">
            {card.title}
          </p>
          <p className="text-density-sm text-sec-purple-600">{card.due}</p>
        </div>
        {card.complete && (
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--color-sec-success)] text-white">
            <Icon name="check" size={ICON_SM} />
          </span>
        )}
      </div>
      <div className="space-y-density-xs text-density-sm text-sec-gray-600">
        <p className="tabular-nums">
          {card.caseId} | {card.period}
        </p>
        <p>
          Settlement:{" "}
          <span className="tabular-nums text-sec-gray-900">
            {money.format(card.settlementAud)} | {formatMwh(card.settlementMwh)}
          </span>
        </p>
        <p>
          Difference:{" "}
          <span className="tabular-nums text-sec-gray-900">
            {money.format(card.differenceAud)} | {formatMwh(card.differenceMwh)}
          </span>
        </p>
      </div>
    </Link>
  );
}

const ALL_CARDS = WEEKS.flatMap((week) => week.cards);

function toIso(date: Date) {
  return format(date, "yyyy-MM-dd");
}

function fromIso(iso: string) {
  return parse(iso, "yyyy-MM-dd", new Date());
}

/** Month view of the same weekly cases, marked on the days they fall due. */
function SettlementCalendar() {
  const dueIsoDates = React.useMemo(
    () => new Set(ALL_CARDS.map((card) => card.dueDate)),
    []
  );
  const [selected, setSelected] = React.useState<Date | undefined>(() =>
    fromIso(WEEKS[0].cards[0].dueDate)
  );

  /* Memoised so react-day-picker keeps the same day buttons mounted across
     renders and doesn't drop keyboard focus mid-navigation. */
  const components = React.useMemo(
    () => ({
      DayButton: (props: React.ComponentProps<typeof CalendarDayButton>) => (
        <CalendarDayButton {...props} className="relative">
          {props.children}
          {dueIsoDates.has(toIso(props.day.date)) && (
            <span
              aria-hidden="true"
              className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${
                props.modifiers.selected
                  ? "bg-sec-orange-300"
                  : "bg-sec-orange-600"
              }`}
            />
          )}
        </CalendarDayButton>
      ),
    }),
    [dueIsoDates]
  );

  const dayCards = selected
    ? ALL_CARDS.filter((card) => card.dueDate === toIso(selected))
    : [];

  return (
    <div className="grid items-start gap-density-xl lg:grid-cols-[auto_1fr]">
      <div>
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          defaultMonth={selected}
          weekStartsOn={1}
          components={components}
          className="sec-calendar rounded-density-md border border-sec-gray-200 bg-white [--cell-size:2.75rem]"
        />
        <p className="mt-density-md flex items-center gap-density-xs text-density-xs text-sec-gray-600">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-sec-orange-600"
          />
          Marked days have settlement cases due
        </p>
      </div>

      <div>
        <h2 className="mb-density-md text-density-lg font-semibold text-sec-gray-900">
          {selected
            ? `Due ${format(selected, "EEEE d MMMM yyyy")}`
            : "Select a date"}
        </h2>
        {dayCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-density-md xl:grid-cols-2">
            {dayCards.map((card) => (
              <SettlementWeekCard key={card.caseId} card={card} />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-density-sm rounded-density-lg border border-dashed border-sec-gray-300 p-density-lg text-density-sm text-sec-gray-600">
            <Icon
              name="event_available"
              size={ICON_MD}
              className="text-sec-gray-600"
            />
            Nothing due on this date.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettlementsHomePage() {
  const [tab, setTab] = React.useState<DashTab>("current");
  const [participant, setParticipant] = React.useState("SECVIC");
  const [goWeek, setGoWeek] = React.useState("2026-08-09");

  return (
    <SecPortalShell activeNavId="settlements-home">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm text-sec-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={HOME_HREF}
                className="text-sec-purple-600 hover:text-sec-purple-950"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-sec-gray-600">
              Settlements
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-density-lg flex flex-wrap items-end justify-between gap-density-lg">
        <div>
          <h1 className="text-density-3xl font-semibold text-sec-gray-900">
            Settlements
          </h1>
          <p className="mt-density-xs text-density-base text-sec-gray-600">
            Weekly dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-density-md">
          <div className="w-44">
            <Select
              label="Participant code"
              value={participant}
              onChange={(e) => setParticipant(e.target.value)}
              className="h-11 rounded-density-md border-sec-gray-300"
            >
              <option value="SECVIC">SECVIC</option>
              <option value="SNOWYNRG">SNOWYNRG</option>
            </Select>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center gap-density-sm rounded-density-md border border-sec-gray-300 px-density-lg text-density-sm text-sec-gray-600 opacity-60"
          >
            <Icon name="calendar_today" size={ICON_MD} />
            Current week
          </button>
          <div className="w-44">
            <SecDatePicker
              label="Go week"
              value={goWeek}
              onChange={setGoWeek}
              align="end"
            />
          </div>
        </div>
      </div>

      <Card className="border-sec-gray-200 bg-white">
        <CardContent className="p-density-xl pt-density-xl">
          <div
            role="tablist"
            aria-label="Settlements views"
            className="mb-density-lg flex border-b border-sec-gray-200"
          >
            {(
              [
                { value: "current", label: "Current" },
                { value: "calendar", label: "Calendar" },
              ] as const
            ).map((item) => {
              const active = tab === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.value)}
                  className={`border-b-2 px-density-lg py-density-md text-density-sm font-medium uppercase tracking-wide ${
                    active
                      ? "border-sec-orange-600 text-sec-orange-600"
                      : "border-transparent text-sec-gray-600 hover:text-sec-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "current" ? (
            <div className="space-y-density-xl">
              {WEEKS.map((week) => (
                <section key={week.label}>
                  <h2 className="mb-density-md text-density-lg font-semibold text-sec-gray-900">
                    {week.label}
                  </h2>
                  <div className="grid grid-cols-1 gap-density-md md:grid-cols-2 xl:grid-cols-4">
                    {week.cards.map((card) => (
                      <SettlementWeekCard key={card.caseId} card={card} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <SettlementCalendar />
          )}
        </CardContent>
      </Card>
    </SecPortalShell>
  );
}
