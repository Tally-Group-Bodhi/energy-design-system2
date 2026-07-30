import { companionDocs } from "@/lib/mock-data/companion-docs";

export type CompanionDocCategory =
  | "account-billing"
  | "payments"
  | "hardship-compliance";

export type CompanionDocRequirement = {
  title: string;
  description: string;
};

export type CompanionDocReferenceRow = {
  label: string;
  value: string;
};

export type CompanionDocStep = {
  title: string;
  location?: string;
  body: string;
  referenceRows?: CompanionDocReferenceRow[];
};

export type CompanionDoc = {
  id: string;
  title: string;
  summary: string;
  category: CompanionDocCategory;
  purpose: string;
  beforeStart: CompanionDocRequirement[];
  steps: CompanionDocStep[];
};

export interface CompanionDocsProvider {
  listDocs(): Promise<CompanionDoc[]>;
}

/**
 * Development adapter. Replace this provider with an API/CMS implementation
 * without changing the companion widget.
 */
export const localCompanionDocsProvider: CompanionDocsProvider = {
  async listDocs() {
    return companionDocs;
  },
};
