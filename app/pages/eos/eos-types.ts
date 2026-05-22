export type EosBrand = "tally-plus" | "eos";

export type EosViewId =
  | "enrollment-search"
  | "application-acceptance"
  | "batch-enroll-payments"
  | "new-enrollment"
  | "customer-account-summary"
  | "customer-billing-accounts"
  | "work-queue-search";

export interface EosViewMeta {
  id: EosViewId;
  title: string;
  brand: EosBrand;
}
