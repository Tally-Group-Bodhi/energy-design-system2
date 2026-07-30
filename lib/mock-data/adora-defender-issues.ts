/** Sourced from energyCo Invoice Validation AI.xlsx — Issues tab */

export type AdoraIssueStatus = "FAIL" | "WARN";

export interface AdoraDefenderIssue {
  eventId: string;
  status: AdoraIssueStatus;
  section: string;
  description: string;
  fileName: string;
  invoiceNumber: string;
  reviewed: boolean;
}

export const adoraDefenderIssues: AdoraDefenderIssue[] = [
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2024-06_Invoices_Invoice_T1044966.pdf/1778230903541509", "status": "FAIL", "section": "Supply, Site & Network Details", "description": "The NMI 'VAAA000298-1' on the invoice summary does not match the NMIs '219832574, 219832737' listed in the detailed meter table, indicating a potential mismatch between the billed account and the detailed consumption data.", "fileName": "2026-energyCo/energyCo_2024-06_Invoices_Invoice_T1044966.pdf", "invoiceNumber": "T1044966", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2024-06_Invoices_Invoice_T1044966.pdf/1778230903541509", "status": "FAIL", "section": "Opening Balance & Financial Roll-Up", "description": "The stated GST of $4,520.73 differs from 10% of the calculated taxable subtotal ($45,305.84 * 0.10 = $4,530.58) by $9.85, which is more than the acceptable one-cent rounding tolerance.", "fileName": "2026-energyCo/energyCo_2024-06_Invoices_Invoice_T1044966.pdf", "invoiceNumber": "T1044966", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045339.pdf/1778231075989596", "status": "FAIL", "section": "Detailed Charges & Calculations", "description": "AEMO Market Fees and Charges are included in the 'Subtotal' on which GST is calculated, violating the rule that AEMO Pool charges must be excluded from GST calculations.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045339.pdf", "invoiceNumber": "T1045339", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045339.pdf/1778231075989596", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "The stated GST amount ($556.85) differs from 10% of the 'Subtotal' ($5,582.30 * 0.10 = $558.23) by more than one cent ($1.38).", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045339.pdf", "invoiceNumber": "T1045339", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045341.pdf/1778231076067385", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "The stated GST amount ($1,302.94) differs from 10% of the subtotal ($13,078.08) by more than one cent ($4.87 difference). Even when considering AEMO charges as GST-exempt, the difference remains more than one cent.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045341.pdf", "invoiceNumber": "T1045341", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045337.pdf/1778231076065338", "status": "WARN", "section": "Invoice Summary & Key Dates", "description": "The due date (13 DEC 2021) is 31 days after the issue date (12 NOV 2021), which is one day longer than the 30-day period implied by the template's example.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045337.pdf", "invoiceNumber": "T1045337", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045337.pdf/1778231076065338", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "The stated GST amount ($696.86) differs from 10% of the subtotal ($6,985.86 * 0.10 = $698.59) by more than one cent ($1.73 difference).", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045337.pdf", "invoiceNumber": "T1045337", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf/1778231076434639", "status": "FAIL", "section": "Detailed Charges & Calculations", "description": "Calculation error for 'Pool Charges NSW' in AEMO Market Fees and Charges. Expected $1,800.85, found $1,809.86.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf", "invoiceNumber": "T1045343", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf/1778231076434639", "status": "FAIL", "section": "Detailed Charges & Calculations", "description": "Calculation error for 'Ancillary Fees' in AEMO Market Fees and Charges. Expected -$583.56, found -$586.31.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf", "invoiceNumber": "T1045343", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf/1778231076434639", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "Significant discrepancy in GST calculation. Stated GST is $40,031.22, but 10% of the subtotal ($402,122.15) is $40,212.22. The difference is $180.99.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045343.pdf", "invoiceNumber": "T1045343", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045362.pdf/1778231076550245", "status": "FAIL", "section": "Invoice Summary & Key Dates", "description": "The due date (26 NOV 2021) is 14 days after the issue date (12 NOV 2021), but the expected due date should be 30 days after the issue date.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045362.pdf", "invoiceNumber": "T1045362", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045362.pdf/1778231076550245", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "The stated Tax (GST) of $38,185.88 differs significantly from 10% of the taxable subtotal ($380,289.40, which is Subtotal $383,568.78 minus non-taxable AEMO Market Fees and Charges $3,279.38), which would be $38,028.94. The difference is $156.94, which is more than the acceptable 1 cent rounding tolerance.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045362.pdf", "invoiceNumber": "T1045362", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045359.pdf/1778231076476249", "status": "WARN", "section": "Opening Balance & Financial Roll-Up", "description": "Stated GST ($1,220.27) differs from 10% of the taxable subtotal ($12,162.57, excluding AEMO charges) which is $1,216.26. It also differs from the sum of 10% of individual taxable line items ($1,216.26). The discrepancy of $4.01 is more than one cent.", "fileName": "2026-energyCo/energyCo_2021-11_Invoices_Invoice_T1045359.pdf", "invoiceNumber": "T1045359", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046384.pdf/1778231272106051", "status": "WARN", "section": "Usage Summary", "description": "Average daily use and total greenhouse gas emissions are marked as 'NA' despite a usage graph being present.", "fileName": "2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046384.pdf", "invoiceNumber": "T1046384", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046382.pdf/1778231270509944", "status": "WARN", "section": "Invoice Summary & Key Dates", "description": "Due date (22 SEP 2025) is 31 days after the issue date (22 AUG 2025), which is one day more than the expected 30 days. This may be due to a public holiday, but cannot be confirmed without external data.", "fileName": "2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046382.pdf", "invoiceNumber": "T1046382", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046385.pdf/1778231272676563", "status": "FAIL", "section": "Detailed Charges & Calculations", "description": "The 'Paper Bill Fee' under 'AEMO Market Fees and Charges' has GST applied ($0.70 on $7.00), which contradicts the general rule that AEMO Pool charges are excluded from GST calculations.", "fileName": "2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046385.pdf", "invoiceNumber": "T1046385", "reviewed": false},
  {"eventId": "tally-ml-poc-raw-invoices/2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046385.pdf/1778231272676563", "status": "WARN", "section": "Detailed Charges & Calculations", "description": "The 'Paper Bill Fee' under 'AEMO Market Fees and Charges' does not display a quantity or rate, which is inconsistent with the template's presentation of other fixed charges (e.g., 'Network Charges (SBD) Fixed') and other AEMO charges ('Pool Charges SA') which include quantity and rate columns.", "fileName": "2026-energyCo/energyCo_2025-08_Invoices_Invoice_T1046385.pdf", "invoiceNumber": "T1046385", "reviewed": false},
];

export type AdoraDefenderDrillDown = "Fail" | "Warning";

export interface AdoraDefenderSection {
  section: string;
  findings: AdoraDefenderIssue[];
}

function groupIssuesBySection(drillDown: AdoraDefenderDrillDown): AdoraDefenderSection[] {
  const status = drillDown === "Fail" ? "FAIL" : "WARN";
  const grouped = new Map<string, AdoraDefenderIssue[]>();
  for (const issue of adoraDefenderIssues) {
    if (issue.status !== status) continue;
    const list = grouped.get(issue.section) ?? [];
    list.push(issue);
    grouped.set(issue.section, list);
  }
  return Array.from(grouped.entries())
    .map(([section, findings]) => ({ section, findings }))
    .sort((a, b) => b.findings.length - a.findings.length);
}

export const adoraDefenderSections: Record<AdoraDefenderDrillDown, AdoraDefenderSection[]> = {
  Fail: groupIssuesBySection("Fail"),
  Warning: groupIssuesBySection("Warning"),
};

export const adoraDefenderOutcomeCounts = {
  fail: 7,
  warning: 10,
  totalFindings: 17,
} as const;
