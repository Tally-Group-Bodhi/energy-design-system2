"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/Card/Card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table/Table";
import { Icon } from "@/components/ui/icon";
import {
  HOME_HREF,
  ICON_LG,
  ICON_MD,
  SETTLEMENTS_HREF,
  EaPortalShell,
} from "../../../components/EaPortalShell";

const CASE_TABS = [
  "Main",
  "TNI details",
  "Site details",
  "RM17",
  "Files",
  "Insights",
] as const;

const HISTORY = [
  {
    label: "Preliminary Case 11545",
    due: "Due Tue 07-Apr-2026",
    colour: "var(--color-ea-green-300)",
  },
  {
    label: "Final Case 11576",
    due: "Due Fri 24-Apr-2026",
    colour: "var(--color-ea-success)",
  },
  {
    label: "Rev 0",
    due: "",
    colour: "var(--color-ea-gray-300)",
  },
  {
    label: "Wk 20 Rev 1 Case 11755",
    due: "Due Tue 11-Aug-2026",
    colour: "var(--color-ea-green-600)",
    current: true,
  },
  {
    label: "Wk 30 Rev 2",
    due: "Due Thu 22-Oct-2026",
    colour: "var(--color-ea-gray-300)",
  },
];

const COMPARISON = [
  {
    description: "Pre UFE MWh",
    aemo: "63,727.41",
    billed: "63,608.34",
    difference: "-119.07",
    percentage: "-0.19%",
  },
  {
    description: "Pre UFE $",
    aemo: "3,960,112.80",
    billed: "3,949,981.40",
    difference: "-10,131.40",
    percentage: "-0.26%",
  },
  {
    description: "UFE MWh",
    aemo: "2,890.12",
    billed: "2,820.05",
    difference: "-70.07",
    percentage: "-2.42%",
  },
  {
    description: "UFE $",
    aemo: "184,220.00",
    billed: "179,680.00",
    difference: "-4,540.00",
    percentage: "-2.46%",
  },
  {
    description: "Total Settlement MWh",
    aemo: "66,617.53",
    billed: "66,428.39",
    difference: "-189.14",
    percentage: "-0.28%",
  },
  {
    description: "Total Settlement $",
    aemo: "4,144,332.80",
    billed: "4,129,661.40",
    difference: "-14,671.40",
    percentage: "-0.35%",
  },
];

const JOBS = [
  {
    title: "Aemo TNI Data",
    detail:
      "Settlement system has loaded the 5MS TNI level meter data from EMMS SET ENERGY TRANSACTION.",
  },
  {
    title: "Level 2 Data",
    detail:
      "Settlement system has loaded the Level 2 Nmi Day data from AEMO.",
  },
  {
    title: "Billing Meter Data",
    detail:
      "Settlement system has loaded the billing meter data from internal billing system.",
  },
];

export default function SettlementCasePage() {
  const [tab, setTab] = React.useState<(typeof CASE_TABS)[number]>("Main");

  return (
    <EaPortalShell activeNavId="settlements-home">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm text-ea-gray-600">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={HOME_HREF}
                className="text-ea-green-600 hover:text-ea-green-950"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={SETTLEMENTS_HREF}
                className="text-ea-green-600 hover:text-ea-green-950"
              >
                Settlements
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-ea-gray-600">
              Cases
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-ea-gray-600">
              Case 11755
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="mb-density-lg text-density-3xl font-semibold text-ea-gray-900">
        Settlement Case 11755 — RREV1
      </h1>

      <div
        role="tablist"
        aria-label="Case sections"
        className="mb-density-lg flex flex-wrap border-b border-ea-gray-200"
      >
        {CASE_TABS.map((item) => {
          const active = tab === item;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item)}
              className={`border-b-2 px-density-lg py-density-md text-density-sm font-medium uppercase tracking-wide ${
                active
                  ? "border-ea-green-600 text-ea-green-600"
                  : "border-transparent text-ea-gray-600 hover:text-ea-gray-900"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {tab !== "Main" ? (
        <Card className="border-ea-gray-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center gap-density-sm p-density-xxl pt-density-xxl text-center">
            <Icon
              name="construction"
              size={ICON_LG}
              className="text-ea-green-600"
            />
            <p className="text-density-lg font-medium text-ea-green-950">
              {tab} is coming next
            </p>
            <p className="max-w-md text-density-sm text-ea-gray-600">
              Main is fully mocked. The remaining case tabs will follow the same
              EnergyAustralia chrome.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-density-lg xl:grid-cols-2">
          <Card className="border-ea-gray-200 bg-white">
            <CardContent className="flex h-full flex-col p-density-xl pt-density-xl">
              <h2 className="text-density-lg font-semibold text-ea-green-950">
                Case History Wk:13-2026 22-Mar — 28-Mar
              </h2>
              <p className="mt-density-xs text-density-sm text-ea-gray-600">
                Started Mon 10-Aug-2026 09:14 · Completed Mon 10-Aug-2026 11:02
              </p>

              <ol className="relative mt-density-lg space-y-density-lg border-l-2 border-ea-gray-200 pl-density-lg">
                {HISTORY.map((item) => (
                  <li key={item.label} className="relative">
                    <span
                      className="absolute -left-[calc(var(--tally-spacing-lg)+5px)] top-1 h-3 w-3 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: item.colour }}
                    />
                    <p
                      className={`text-density-sm font-semibold ${
                        item.current
                          ? "text-ea-green-950"
                          : "text-ea-gray-900"
                      }`}
                    >
                      {item.label}
                    </p>
                    {item.due && (
                      <p className="text-density-xs text-ea-gray-600">
                        {item.due}
                      </p>
                    )}
                  </li>
                ))}
              </ol>

              <button
                type="button"
                className="mt-auto inline-flex min-h-11 w-full items-center justify-center gap-density-sm rounded-density-md px-density-lg text-density-sm font-medium uppercase tracking-wide text-white"
                style={{ backgroundColor: "var(--color-ea-green-950)" }}
              >
                <Icon name="autorenew" size={ICON_MD} />
                Re-trigger revision adjustment
              </button>
            </CardContent>
          </Card>

          <Card className="border-ea-gray-200 bg-white">
            <CardContent className="p-density-xl pt-density-xl">
              <h2 className="mb-density-md text-density-lg font-semibold text-ea-green-950">
                Comparison
              </h2>
              <Table>
                <TableHeader>
                  <TableRow className="border-ea-gray-200 hover:bg-transparent">
                    <TableHead className="text-ea-gray-600">
                      Description
                    </TableHead>
                    <TableHead className="text-right text-ea-gray-600">
                      AEMO
                    </TableHead>
                    <TableHead className="text-right text-ea-gray-600">
                      Billed
                    </TableHead>
                    <TableHead className="text-right text-ea-gray-600">
                      Difference
                    </TableHead>
                    <TableHead className="text-right text-ea-gray-600">
                      Percentage
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARISON.map((row) => (
                    <TableRow
                      key={row.description}
                      className="border-ea-gray-200"
                    >
                      <TableCell className="font-medium text-ea-gray-900">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-ea-gray-600">
                        {row.aemo}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-ea-gray-600">
                        {row.billed}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-ea-gray-600">
                        {row.difference}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-ea-gray-600">
                        {row.percentage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-ea-gray-200 bg-white xl:col-span-2">
            <CardContent className="p-density-xl pt-density-xl">
              <h2 className="mb-density-md text-density-lg font-semibold text-ea-green-950">
                Job details
              </h2>
              <ul className="space-y-density-md">
                {JOBS.map((job) => (
                  <li
                    key={job.title}
                    className="flex items-start gap-density-md rounded-density-lg border border-[var(--color-ea-success)]/30 bg-[color-mix(in_srgb,var(--color-ea-success)_8%,white)] p-density-lg"
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--color-ea-success)] text-white">
                      <Icon name="check" size={ICON_MD} />
                    </span>
                    <div>
                      <p className="text-density-base font-semibold text-ea-gray-900">
                        {job.title}
                      </p>
                      <p className="mt-density-xs text-density-sm text-ea-gray-600">
                        {job.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </EaPortalShell>
  );
}
