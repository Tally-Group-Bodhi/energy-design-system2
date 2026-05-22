import type { NavigationItem } from "@/components/NavigationBar/NavigationBar";
import type { EosBrand, EosViewId } from "./eos-types";

/**
 * EOS top-level navigation modeled on the legacy app's collapsed icon strip.
 * Each top-level item maps to one of the six identity icons:
 *   1. add_circle  — Quick Create
 *   2. apps        — Acquisitions
 *   3. dns         — Customer Accounts (Operations)
 *   4. description — Batch & Documents
 *   5. work        — Work Queue
 *   6. tune        — Admin & Settings (bottom)
 */
export const EOS_FULL_NAV: NavigationItem[] = [
  {
    id: "new-enrollment",
    label: "Quick Create",
    icon: "add_circle",
  },
  {
    id: "acquisitions",
    label: "Acquisitions",
    icon: "apps",
    children: [
      { id: "enrollment-search", label: "Enrollment Search" },
      { id: "application-acceptance", label: "Application Acceptance Form" },
      { id: "acquisition-errors", label: "Acquisition Errors", disabled: true },
      { id: "partial-requests", label: "Partial Requests", disabled: true },
    ],
  },
  {
    id: "operations",
    label: "Customer Accounts",
    icon: "dns",
    children: [
      { id: "customer-account-summary", label: "Customer Account Summary" },
      { id: "customer-billing-accounts", label: "Billing Accounts" },
    ],
  },
  {
    id: "documents",
    label: "Batch & Documents",
    icon: "description",
    children: [
      { id: "batch-enroll-payments", label: "Batch Enroll Payments Upload" },
      { id: "batch-enrollment", label: "Batch Enrollment", disabled: true },
      { id: "batch-enrollment-hv", label: "Batch Enrollment HV", disabled: true },
      { id: "activity-log", label: "Activity Log Details", disabled: true },
    ],
  },
  {
    id: "work-queue-search",
    label: "Work Queue",
    icon: "work",
  },
];

export const EOS_BOTTOM_NAV: NavigationItem[] = [
  { id: "admin", label: "Admin & Settings", icon: "tune", href: "#" },
];

export function getBrandForView(viewId: EosViewId): EosBrand {
  const tallyPlusViews: EosViewId[] = [
    "enrollment-search",
    "application-acceptance",
    "batch-enroll-payments",
    "new-enrollment",
  ];
  return tallyPlusViews.includes(viewId) ? "tally-plus" : "eos";
}

export function getViewTitle(viewId: EosViewId): string {
  const titles: Record<EosViewId, string> = {
    "enrollment-search": "Enrollment Search",
    "application-acceptance": "Application Acceptance Form",
    "batch-enroll-payments": "Batch Enroll Payments Upload",
    "new-enrollment": "New Enrollment",
    "customer-account-summary": "Customer Account Summary",
    "customer-billing-accounts": "Customer Account Summary",
    "work-queue-search": "Work Queue Search",
  };
  return titles[viewId];
}
