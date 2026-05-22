"use client";

import React from "react";
import EosShell from "./eos-shell";
import type { EosViewId } from "./eos-types";
import EnrollmentSearchView from "./views/enrollment-search";
import ApplicationAcceptanceView from "./views/application-acceptance";
import BatchEnrollPaymentsView from "./views/batch-enroll-payments";
import NewEnrollmentView from "./views/new-enrollment";
import CustomerAccountSummaryView from "./views/customer-account-summary";
import CustomerBillingAccountsView from "./views/customer-billing-accounts";
import WorkQueueSearchView from "./views/work-queue-search";

const VIEW_COMPONENTS: Record<EosViewId, React.ComponentType> = {
  "enrollment-search": EnrollmentSearchView,
  "application-acceptance": ApplicationAcceptanceView,
  "batch-enroll-payments": BatchEnrollPaymentsView,
  "new-enrollment": NewEnrollmentView,
  "customer-account-summary": CustomerAccountSummaryView,
  "customer-billing-accounts": CustomerBillingAccountsView,
  "work-queue-search": WorkQueueSearchView,
};

export default function EosPage() {
  const [activeView, setActiveView] = React.useState<EosViewId>("enrollment-search");
  const ActiveComponent = VIEW_COMPONENTS[activeView];

  React.useEffect(() => {
    const root = document.querySelector(".flex.h-screen.overflow-hidden");
    const sidebar = root?.querySelector(":scope > aside");
    if (sidebar instanceof HTMLElement) {
      sidebar.style.display = "none";
    }
    return () => {
      if (sidebar instanceof HTMLElement) sidebar.style.display = "";
    };
  }, []);

  return (
    <EosShell activeView={activeView} onViewChange={setActiveView}>
      <ActiveComponent />
    </EosShell>
  );
}
