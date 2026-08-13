"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import NavigationBar, {
  type NavigationItem,
} from "@/components/NavigationBar/NavigationBar";
import { Icon } from "@/components/ui/icon";
import { getClientBrand } from "@/lib/tokens/client-brands";

export const brand = getClientBrand("energy-australia");
export const { colours, chart } = brand;

export const [ACCENT, GREEN_MID, GREEN_MARK, GREEN_LIGHT, NEUTRAL] =
  chart.series;

export const ICON_SM = "var(--tally-icon-size-sm)";
export const ICON_MD = "var(--tally-icon-size-md)";
export const ICON_LG = "var(--tally-icon-size-lg)";

export const HOME_HREF = "/pages/ci-portal/energy-australia";
export const ACCOUNTS_HREF = "/pages/ci-portal/energy-australia/accounts";
export const SETTLEMENTS_HREF = "/pages/ci-portal/energy-australia/settlements";
export const SETTLEMENT_CASE_HREF =
  "/pages/ci-portal/energy-australia/settlements/cases/11755";
export const NETWORK_SETTLEMENT_HREF =
  "/pages/ci-portal/energy-australia/network-settlement";
export const NETWORK_REMITTANCE_HREF =
  "/pages/ci-portal/energy-australia/network-settlement/remittance";

export const money = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export const ACCOUNT = {
  id: "100001",
  name: "EnergyAustralia — Commercial Portfolio",
  balance: 31562307.28,
  status: "Active",
  serviceType: "Unknown",
  billingAddressee: "",
  billingAddress: "Level 19, 570 George Street, Sydney NSW 2000",
  isParent: true,
  contact: {
    type: "Primary",
    fullName: "Sam Rivera",
    preferredMethod: "Email",
    landline: "",
    mobile: "",
    email: "ci.portal@energyaustralia.com.au",
    address: "Level 19, 570 George Street, Sydney NSW 2000",
  },
  business: {
    name: "EnergyAustralia Pty Ltd",
    abn: "",
  },
};

/** Shared left nav — hrefs point at the pages we have so far. */
export const NAV_ITEMS: NavigationItem[] = [
  { id: "home", label: "Home", icon: "dashboard", href: HOME_HREF },
  {
    id: "accounts",
    label: "Accounts",
    icon: "account_tree",
    children: [
      { id: "accounts-list", label: "Accounts", href: ACCOUNTS_HREF },
      { id: "accounts-documents", label: "Documents", href: "#" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "attach_money",
    children: [
      { id: "finance-invoices", label: "Invoices", href: "#" },
      { id: "finance-payments", label: "Payments", href: "#" },
    ],
  },
  {
    id: "settlements",
    label: "Settlements",
    icon: "account_balance",
    children: [
      { id: "settlements-home", label: "Home", href: SETTLEMENTS_HREF },
      { id: "settlements-swap", label: "Swap contracts", href: "#" },
      { id: "settlements-candi", label: "CANDI demand", href: "#" },
      { id: "settlements-export", label: "Export history", href: "#" },
    ],
  },
  {
    id: "network-settlement",
    label: "Network settlement",
    icon: "lan",
    children: [
      {
        id: "network-home",
        label: "Home",
        href: NETWORK_SETTLEMENT_HREF,
      },
      { id: "network-files", label: "Files", href: "#" },
      { id: "network-invoices", label: "Invoices", href: "#" },
      {
        id: "network-remittance",
        label: "Remittance",
        href: NETWORK_REMITTANCE_HREF,
      },
      { id: "network-disputes", label: "Disputes", href: "#" },
      { id: "network-distributors", label: "Distributors", href: "#" },
      { id: "network-reconciliation", label: "Reconciliation", href: "#" },
    ],
  },
  {
    id: "behavioural-dr",
    label: "Behavioural DR",
    icon: "psychology",
    children: [
      { id: "bdr-events", label: "Events", href: "#" },
      { id: "bdr-performance", label: "Performance", href: "#" },
    ],
  },
  {
    id: "progressive-purchase",
    label: "Progressive purchase",
    icon: "paid",
    children: [
      { id: "pp-positions", label: "Positions", href: "#" },
      { id: "pp-trades", label: "Trades", href: "#" },
    ],
  },
  {
    id: "tariff-optimisation",
    label: "Tariff optimisation",
    icon: "tune",
    children: [
      { id: "tariff-scenarios", label: "Scenarios", href: "#" },
      { id: "tariff-recommendations", label: "Recommendations", href: "#" },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    icon: "manage_accounts",
    children: [
      { id: "admin-users", label: "Users", href: "#" },
      { id: "admin-roles", label: "Roles and permissions", href: "#" },
    ],
  },
  {
    id: "site-admin",
    label: "Site admin",
    icon: "admin_panel_settings",
    children: [
      { id: "site-admin-sites", label: "Sites", href: "#" },
      { id: "site-admin-meters", label: "Meters", href: "#" },
    ],
  },
];

export const BOTTOM_NAV_ITEMS: NavigationItem[] = [
  { id: "support", label: "Support", icon: "help", href: "#" },
];

export function EaPortalShell({
  activeNavId,
  children,
}: {
  activeNavId: string;
  children: React.ReactNode;
}) {
  const [navCollapsed, setNavCollapsed] = React.useState(false);

  const appBarButton =
    "flex h-11 w-11 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white";

  return (
    <div
      className="ea-brand flex h-screen flex-col bg-ea-gray-25 text-ea-gray-900"
      style={{ fontFamily: brand.fontFamily }}
    >
      <header className="flex h-14 shrink-0 items-center gap-density-md bg-ea-green-950 pl-density-sm text-white">
        <button
          type="button"
          onClick={() => setNavCollapsed((c) => !c)}
          aria-label={navCollapsed ? "Expand navigation" : "Collapse navigation"}
          className={appBarButton}
        >
          <Icon name="menu" size={ICON_LG} />
        </button>

        <Link
          href={HOME_HREF}
          className="flex items-center"
          aria-label="EnergyAustralia C&I Portal home"
        >
          <Image
            {...brand.logos.reversed}
            alt="EnergyAustralia"
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="ml-auto flex items-center gap-density-sm">
          <button
            type="button"
            aria-label="Notifications, 3 unread"
            className={`relative ${appBarButton}`}
          >
            <Icon name="notifications" size={ICON_LG} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-ea-green-600" />
          </button>

          <button
            type="button"
            className="flex min-h-11 items-center gap-density-xs rounded-full px-density-md text-density-base text-white transition-colors hover:bg-white/10"
          >
            Rasindu Roohansa
            <Icon name="expand_more" size={ICON_LG} />
          </button>

          <div className="flex h-14 w-14 items-center justify-center bg-ea-green-800 text-density-base font-medium text-white">
            RR
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <NavigationBar
          items={NAV_ITEMS}
          bottomItems={BOTTOM_NAV_ITEMS}
          defaultActiveId={activeNavId}
          collapsed={navCollapsed}
          onCollapsedChange={setNavCollapsed}
          activeColors={brand.navActiveColors}
        />
        <main className={`min-w-0 flex-1 overflow-y-auto ${brand.surfaceClass}`}>
          <div className="mx-auto max-w-[1600px] px-density-xl py-density-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
