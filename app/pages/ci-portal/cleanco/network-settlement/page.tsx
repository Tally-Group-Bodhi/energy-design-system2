"use client";

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
  HOME_HREF,
  NETWORK_SETTLEMENT_HREF,
  CleanCoPortalShell,
  money,
} from "../components/CleanCoPortalShell";

interface Participant {
  name: string;
  initial: string;
  tone: "orange" | "purple" | "success";
  nextInvoiceDue: string;
  dueAmount: number;
  disputedAmount: number;
}

const PARTICIPANTS: Participant[] = [
  {
    name: "Ausgrid",
    initial: "A",
    tone: "orange",
    nextInvoiceDue: "21/08/2026",
    dueAmount: 5964300.6,
    disputedAmount: 1900112.3,
  },
  {
    name: "Essential Energy",
    initial: "E",
    tone: "success",
    nextInvoiceDue: "27/08/2026",
    dueAmount: 3559146.6,
    disputedAmount: 790858.79,
  },
  {
    name: "Energex Limited",
    initial: "E",
    tone: "purple",
    nextInvoiceDue: "N/A",
    dueAmount: 0,
    disputedAmount: 2982,
  },
  {
    name: "Plus ES",
    initial: "P",
    tone: "orange",
    nextInvoiceDue: "N/A",
    dueAmount: 0,
    disputedAmount: 0,
  },
  {
    name: "Endeavour Energy",
    initial: "E",
    tone: "purple",
    nextInvoiceDue: "18/08/2026",
    dueAmount: 2144800.15,
    disputedAmount: 120450.0,
  },
  {
    name: "Ergon Energy",
    initial: "E",
    tone: "success",
    nextInvoiceDue: "30/08/2026",
    dueAmount: 980220.4,
    disputedAmount: 0,
  },
  {
    name: "SA Power Networks",
    initial: "S",
    tone: "orange",
    nextInvoiceDue: "15/08/2026",
    dueAmount: 1422660.9,
    disputedAmount: 88440.25,
  },
  {
    name: "CitiPower",
    initial: "C",
    tone: "purple",
    nextInvoiceDue: "22/08/2026",
    dueAmount: 875330.0,
    disputedAmount: 12400.0,
  },
  {
    name: "Powercor",
    initial: "P",
    tone: "success",
    nextInvoiceDue: "22/08/2026",
    dueAmount: 1633440.5,
    disputedAmount: 0,
  },
  {
    name: "United Energy",
    initial: "U",
    tone: "orange",
    nextInvoiceDue: "19/08/2026",
    dueAmount: 720110.8,
    disputedAmount: 4550.0,
  },
  {
    name: "AusNet Services",
    initial: "A",
    tone: "purple",
    nextInvoiceDue: "25/08/2026",
    dueAmount: 2011880.0,
    disputedAmount: 334220.1,
  },
  {
    name: "Jemena",
    initial: "J",
    tone: "success",
    nextInvoiceDue: "N/A",
    dueAmount: 0,
    disputedAmount: 0,
  },
  {
    name: "TasNetworks",
    initial: "T",
    tone: "orange",
    nextInvoiceDue: "28/08/2026",
    dueAmount: 412660.0,
    disputedAmount: 0,
  },
  {
    name: "Evoenergy",
    initial: "E",
    tone: "purple",
    nextInvoiceDue: "16/08/2026",
    dueAmount: 288940.75,
    disputedAmount: 9120.0,
  },
  {
    name: "Horizon Power",
    initial: "H",
    tone: "success",
    nextInvoiceDue: "N/A",
    dueAmount: 0,
    disputedAmount: 0,
  },
];

const TONE_CLASS = {
  orange: "bg-cleanco-cyan-50 text-cleanco-cyan-700",
  purple: "bg-cleanco-cyan-50 text-cleanco-cyan-950",
  success: "bg-[color-mix(in_srgb,var(--color-cleanco-success)_12%,white)] text-[var(--color-cleanco-success)]",
} as const;

function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <article className="rounded-density-lg border border-cleanco-gray-200 bg-white p-density-lg">
      <div className="mb-density-md flex items-center gap-density-md">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-density-sm font-semibold ${TONE_CLASS[participant.tone]}`}
        >
          {participant.initial}
        </span>
        <h3 className="truncate text-density-base font-semibold uppercase tracking-wide text-cleanco-gray-900">
          {participant.name}
        </h3>
      </div>
      <dl className="space-y-density-sm text-density-sm">
        <div className="flex items-center justify-between gap-density-md">
          <dt className="text-cleanco-gray-700">Next invoice due</dt>
          <dd className="tabular-nums text-cleanco-gray-900">
            {participant.nextInvoiceDue}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-density-md">
          <dt className="text-cleanco-gray-700">Due amount</dt>
          <dd className="tabular-nums text-cleanco-gray-900">
            {money.format(participant.dueAmount)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-density-md">
          <dt className="text-cleanco-gray-700">Disputed amount</dt>
          <dd className="tabular-nums text-cleanco-gray-900">
            {money.format(participant.disputedAmount)}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export default function NetworkSettlementHomePage() {
  return (
    <CleanCoPortalShell activeNavId="network-home">
      <Breadcrumb className="mb-density-md">
        <BreadcrumbList className="text-density-sm text-cleanco-gray-700">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={HOME_HREF}
                className="text-cleanco-cyan-700 hover:text-cleanco-cyan-950"
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={NETWORK_SETTLEMENT_HREF}
                className="text-cleanco-cyan-700 hover:text-cleanco-cyan-950"
              >
                Network settlement
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-cleanco-gray-700">Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-density-lg">
        <h1 className="text-density-3xl font-semibold text-cleanco-gray-900">
          Nuos
        </h1>
        <p className="mt-density-xs text-density-base text-cleanco-gray-700">
          Summary of participants
        </p>
      </div>

      <Card className="border-cleanco-gray-200 bg-white">
        <CardContent className="p-density-xl pt-density-xl">
          <h2 className="mb-density-lg text-density-lg font-semibold text-cleanco-cyan-950">
            Participant
          </h2>
          <div className="grid grid-cols-1 gap-density-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PARTICIPANTS.map((participant) => (
              <ParticipantCard
                key={participant.name}
                participant={participant}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </CleanCoPortalShell>
  );
}
