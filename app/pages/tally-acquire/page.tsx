"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/Breadcrumb/Breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/Card/Card";
import Badge from "@/components/Badge/Badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const LEFT_NAV_ITEMS = [
  { id: "home", label: "Home", icon: "home" },
  { id: "lookups", label: "Lookups", icon: "search" },
  { id: "compliance", label: "Compliance", icon: "rule" },
  { id: "users", label: "Users", icon: "group" },
  { id: "imports", label: "Imports", icon: "file_upload" },
  { id: "exports", label: "Exports", icon: "file_download" },
];

const ADMIN_TILES = [
  { id: "plan-collections", label: "Plan Collections", icon: "payments" },
  { id: "products", label: "Products", icon: "flag" },
  { id: "distributors", label: "Distributors", icon: "electrical_services" },
  { id: "solar", label: "Solar", icon: "solar_power" },
  { id: "bundles", label: "Bundles", icon: "hub" },
  { id: "best-offer", label: "Best Offer", icon: "thumb_up" },
  { id: "billing-provider", label: "Billing Provider", icon: "account_balance" },
  { id: "warnings", label: "Warnings", icon: "warning" },
  { id: "clear-cache", label: "Clear Cache", icon: "delete" },
];

export default function TallyAcquirePage() {
  const [activeNavId, setActiveNavId] = React.useState("home");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top App Bar */}
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-white px-6 dark:border-gray-800 dark:bg-gray-950/90">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            {/* Light mode logo */}
            <Image
              src="/TallyAcquire.svg"
              alt="Tally Acquire"
              width={140}
              height={40}
              className="h-8 w-auto block dark:hidden"
              priority
            />
            {/* Dark mode logo */}
            <Image
              src="/TallyAcquire_darkmode.svg"
              alt="Tally Acquire"
              width={140}
              height={40}
              className="h-8 w-auto hidden dark:block"
              priority
            />
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex flex-1 justify-center">
          <div className="relative hidden w-full max-w-md md:block">
            <Icon
              name="search"
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <input
              type="search"
              placeholder="Search"
              className="h-10 w-full rounded-lg border border-border bg-gray-50 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-[#2C365D] focus:outline-none focus:ring-1 focus:ring-[#2C365D] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100"
          >
            <Icon name="notifications" size={20} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2C365D] text-sm font-medium text-white">
            BB
          </div>
        </div>
      </header>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {/* Left Navigation */}
        <aside className="flex w-64 shrink-0 flex-col overflow-hidden border-r border-border bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <nav className="flex flex-col gap-1 p-2">
              {LEFT_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNavId(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    activeNavId === item.id
                      ? "bg-[#2C365D]/10 text-[#2C365D] dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                  )}
                >
                  <Icon
                    name={item.icon as "home"}
                    size={20}
                    className={cn(
                      "font-extralight transition-colors",
                      activeNavId === item.id
                        ? "text-[#2C365D] dark:text-[#7c8cb8]"
                        : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-100"
                    )}
                  />
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-2 border-t border-border p-3 text-xs text-muted-foreground dark:border-gray-800">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <span className="flex items-center gap-2">
                <Icon name="description" size={16} className="text-gray-500 dark:text-gray-400" />
                Documentation
              </span>
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <span className="flex items-center gap-2">
                <Icon name="smart_toy" size={16} className="text-gray-500 dark:text-gray-400" />
                Agent
              </span>
            </button>
            <div className="pt-1">
              <div className="flex w-full items-center justify-center rounded-full bg-transparent px-2 py-1.5">
                <Image
                  src="/PoweredByTallyBadgeDark.svg"
                  alt="Powered by Tally"
                  width={120}
                  height={29}
                  className="h-auto w-[120px]"
                />
              </div>
              <p className="mt-1 text-[10px] text-gray-500 dark:text-gray-400 text-center">
                Version ebb9985 • Updated 28th Jan 2026 07:11am
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-6 py-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-4">
              <BreadcrumbList className="items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="flex items-center text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      <Icon name="home" size={18} className="text-gray-600 dark:text-gray-400" />
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-gray-400 [&>svg]:size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-normal text-gray-900 dark:text-gray-100">
                    Admin
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
            </div>

            {/* System Warnings Banner */}
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
              <div className="flex gap-3">
                <Icon
                  name="warning"
                  size={20}
                  className="mt-0.5 text-amber-500 dark:text-amber-300"
                />
                <div className="space-y-1">
                  <p className="font-semibold">System Warnings</p>
                  <p>
                    There are 20 Welcome Pack/Contracts in quarantine, please{" "}
                    <button className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200">
                      review
                    </button>{" "}
                    /{" "}
                    <button className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200">
                      dismiss
                    </button>
                    .
                  </p>
                  <p>
                    There are 52 active warnings, please{" "}
                    <button className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200">
                      review
                    </button>{" "}
                    /{" "}
                    <button className="underline underline-offset-2 hover:text-amber-700 dark:hover:text-amber-200">
                      dismiss
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Tiles */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {ADMIN_TILES.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className="group flex h-32 flex-col items-start justify-between rounded-xl border border-border bg-white px-5 py-4 text-left shadow-none transition-colors hover:border-[#2C365D]/40 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#7c8cb8]/50 dark:hover:bg-gray-900/80"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2C365D]/10 text-[#2C365D] transition-colors group-hover:bg-[#2C365D]/15 dark:bg-[#7c8cb8]/20 dark:text-[#7c8cb8]">
                    <Icon name={tile.icon as "home"} size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {tile.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Configure and manage related settings.
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

