"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/Avatar/Avatar";
import NavigationBar from "@/components/NavigationBar/NavigationBar";
import type { NavigationItem } from "@/components/NavigationBar/NavigationBar";
import DensityToggle from "@/components/crm/DensityToggle";
import { surfaceColours } from "@/lib/tokens/surface-colours";

/* ─── Nav items ─────────────────────────────────────────────────────────── */

const navItems: NavigationItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/crm/dashboard" },
  { id: "cases", label: "Cases", icon: "inbox", href: "/crm/cases" },
  { id: "pipeline", label: "Pipeline", icon: "trending_up", href: "/crm/pipeline" },
  { id: "opportunities", label: "Opportunities", icon: "handshake", href: "/crm/opportunities" },
];

const bottomNavItems: NavigationItem[] = [
  { id: "help", label: "Help & Support", icon: "help_outline", href: "#" },
  { id: "settings", label: "Settings", icon: "settings", href: "#" },
];

/* ─── Layout ────────────────────────────────────────────────────────────── */

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [navCollapsed, setNavCollapsed] = React.useState(false);

  // Determine default active nav id from pathname
  const defaultActiveId = pathname.startsWith("/crm/opportunities")
    ? "opportunities"
    : pathname.startsWith("/crm/pipeline")
      ? "pipeline"
      : pathname.startsWith("/crm/cases")
        ? "cases"
        : "dashboard";

  return (
    <div className="flex h-screen min-w-0 flex-col overflow-hidden">
      {/* ── App Bar ──────────────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center border-b border-border bg-white px-4 dark:bg-gray-800">
        {/* Logo */}
        <Link href="/crm/dashboard" className="mr-6 flex items-center">
          <Image
            src="/Tally_CRM_Logo.svg"
            alt="Tally CRM"
            width={140}
            height={40}
            className="block h-8 w-auto dark:hidden"
            priority
          />
          <Image
            src="/Tally_CRM_Logo_dark.svg"
            alt="Tally CRM"
            width={140}
            height={40}
            className="hidden h-8 w-auto dark:block"
            priority
          />
        </Link>

        {/* Search */}
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-density-md border border-border bg-gray-50 px-3 dark:bg-gray-700">
          <Icon name="search" size="var(--tally-icon-size-md)" className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cases, accounts, opportunities…"
            className="w-full bg-transparent py-2 outline-none placeholder:text-muted-foreground"
            style={{ fontSize: "var(--tally-font-size-sm)" }}
          />
        </div>

        {/* Right side */}
        <div className="ml-6 flex items-center gap-3">
          <DensityToggle />
          <button
            type="button"
            className="relative rounded-density-md p-density-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Notifications"
          >
            <Icon name="notifications" size="var(--tally-icon-size-md)" className="text-muted-foreground" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>PS</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* ── Expanded Navigation ─────────────────────────────────── */}
        <NavigationBar
          items={navItems}
          bottomItems={bottomNavItems}
          defaultActiveId={defaultActiveId}
          collapsed={navCollapsed}
          onCollapsedChange={setNavCollapsed}
          activeColors={{
            bg: "bg-[#E6F7FF]",
            text: "text-[#006180]",
            darkBg: "dark:bg-[#006180]/20",
            darkText: "dark:text-[#80E0FF]",
          }}
        />

        {/* ── Main content ─────────────────────────────────────────── */}
        <main className={`flex min-h-0 min-w-0 flex-1 ${surfaceColours["tally-crm"]}`}>{children}</main>
      </div>
    </div>
  );
}
