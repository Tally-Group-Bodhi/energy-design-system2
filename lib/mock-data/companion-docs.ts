import type { CompanionDoc } from "@/lib/companion-docs";

function basicDoc(
  partial: Pick<CompanionDoc, "id" | "title" | "summary" | "category" | "purpose">
): CompanionDoc {
  return {
    ...partial,
    beforeStart: [
      {
        title: "Account verified",
        description: "Complete the identity check and confirm the customer is authorised.",
      },
      {
        title: "Customer need clarified",
        description: "Confirm the reason for the call and what outcome the customer needs.",
      },
    ],
    steps: [
      {
        title: "Open the relevant account",
        location: "Customer account → Service address",
        body: "Confirm the correct account, address and fuel type before taking action.",
      },
      {
        title: "Complete the process",
        location: "Customer account → Related workflow",
        body: "Follow the documented steps for this enquiry type and record a concise interaction note.",
      },
    ],
  };
}

export const companionDocs: CompanionDoc[] = [
  {
    id: "account-balance",
    title: "Account Balance",
    summary:
      "A customer contacts us to check their account balance. This is a simple enquiry — the agent reads the balance and related...",
    category: "account-billing",
    purpose:
      "Help a customer understand their current account balance and explain whether the account is in debt or credit.",
    beforeStart: [
      {
        title: "Account verified",
        description: "Complete the identity check and confirm the customer is authorised.",
      },
      {
        title: "Customer need",
        description: "Confirm whether they also need overdue, payment or next invoice details.",
      },
    ],
    steps: [
      {
        title: "Locate the balance",
        location: "Customer account → Service address banner",
        body:
          "Open the relevant service address. The balance pill shows the current net debt or credit for that account.",
      },
      {
        title: "Provide supporting context",
        location: "Service address → Bill Information",
        body:
          "Use the billing panel to explain the latest invoice, allocation status and due date.",
        referenceRows: [
          { label: "Current balance", value: "Service address banner" },
          { label: "Overdue amount", value: "Financial summary" },
          { label: "Latest invoice", value: "Bill Information" },
          { label: "Next invoice due", value: "Billing cycle information" },
        ],
      },
    ],
  },
  {
    id: "bill-enquiry",
    title: "Bill Enquiry",
    summary:
      "A customer contacts us about their bill — typically asking why it is high, what charges mean, when they were last billed, or...",
    category: "account-billing",
    purpose:
      "Resolve billing questions by comparing the current invoice with prior usage, charges and meter-read information.",
    beforeStart: [
      {
        title: "Correct service selected",
        description: "Confirm the address and fuel type shown on the customer invoice.",
      },
      {
        title: "Invoice available",
        description: "Ask for the invoice number or billing period where possible.",
      },
    ],
    steps: [
      {
        title: "Review bill information",
        location: "Service address → Bill Information → Overview",
        body:
          "Confirm the billing period, invoice amount, issue date, due date and allocation status.",
      },
      {
        title: "Compare usage",
        location: "Service address → Bill Information → Usage",
        body:
          "Compare current usage with the previous period and explain material changes or estimated reads.",
      },
    ],
  },
  basicDoc({
    id: "closed-account-enquiry-debt",
    title: "Closed Account Enquiry / Debt",
    summary:
      "A customer contacts us about an account that has been closed. This is one of the most common call types (#2). Typical reasons...",
    category: "account-billing",
    purpose:
      "Explain the status of a closed account, any remaining debt or credit, and the options available to the customer.",
  }),
  basicDoc({
    id: "invoice-requested",
    title: "Invoice Requested",
    summary:
      "A customer requests a copy of their invoice — they may have lost it, not received it, or need it for a specific purpose (e.g. payment...",
    category: "account-billing",
    purpose:
      "Locate and provide the requested invoice using the approved delivery method for the account.",
  }),
  basicDoc({
    id: "update-account-details",
    title: "Update Account Details",
    summary:
      "A customer contacts us to update their account information — such as name, address, phone number, email, payment method,...",
    category: "account-billing",
    purpose:
      "Update authorised account details accurately while confirming identity and recording the change.",
  }),
  {
    id: "direct-debit",
    title: "Direct Debit",
    summary:
      "A customer contacts us to set up, change, or remove direct debit (DD) as their payment method. Direct debit allows automatic...",
    category: "payments",
    purpose:
      "Help an authorised customer manage their direct debit arrangement safely and accurately.",
    beforeStart: [
      {
        title: "Authority confirmed",
        description: "Only the account holder or an authorised contact can change payment details.",
      },
      {
        title: "Bank details ready",
        description: "The customer must provide the account name, BSB and account number.",
      },
    ],
    steps: [
      {
        title: "Open payment settings",
        location: "Customer account → Financial → Payment methods",
        body:
          "Review the existing arrangement before adding, changing or removing direct debit.",
      },
      {
        title: "Confirm and record consent",
        location: "Payment methods → Direct Debit",
        body:
          "Read the direct debit terms, confirm the effective date and record the customer’s consent.",
      },
    ],
  },
  basicDoc({
    id: "paying-invoice",
    title: "Paying Invoice",
    summary:
      "A customer contacts us to make a payment or has questions about how to pay their energy bill. The agent's goal is to help th...",
    category: "payments",
    purpose:
      "Help the customer make a payment or understand the available payment methods for their invoice.",
  }),
  {
    id: "payment-arrangement",
    title: "Payment Arrangement",
    summary:
      "A customer contacts us because they cannot pay their balance in full and needs to spread payments over time. The agent's goal is...",
    category: "payments",
    purpose:
      "Set up a sustainable arrangement while meeting customer-support and regulatory obligations.",
    beforeStart: [
      {
        title: "Balance reviewed",
        description: "Confirm current debt, overdue amount and active concessions or credits.",
      },
      {
        title: "Capacity discussed",
        description: "Understand what the customer can reasonably pay and how often.",
      },
    ],
    steps: [
      {
        title: "Assess the account",
        location: "Customer account → Financial summary",
        body:
          "Review debt, recent payments, existing arrangements and vulnerability indicators.",
      },
      {
        title: "Create the schedule",
        location: "Financial → Payment arrangements → New",
        body:
          "Enter the agreed amount and frequency, then confirm the first payment date.",
      },
    ],
  },
  basicDoc({
    id: "payment-enquiry",
    title: "Payment Enquiry",
    summary:
      'A customer contacts us with a general enquiry about their payments. Common questions include: "Has my payment been...',
    category: "payments",
    purpose:
      "Answer payment status questions and confirm whether payments have been received, allocated or are pending.",
  }),
  basicDoc({
    id: "payment-extension",
    title: "Payment Extension",
    summary:
      "A customer contacts us because they need more time to pay an invoice before it becomes overdue. A payment extension extend...",
    category: "payments",
    purpose:
      "Extend a payment due date where eligible and explain the new due date to the customer.",
  }),
  basicDoc({
    id: "refund-request",
    title: "Refund Request",
    summary:
      "A customer requests a refund of a credit balance on their account. The agent submits a refund request through the syste...",
    category: "payments",
    purpose:
      "Assess eligibility for a refund and submit the request through the approved system workflow.",
  }),
  basicDoc({
    id: "complaint-escalation",
    title: "Complaint Escalation",
    summary:
      "A customer contacts us to make a formal complaint or to escalate an existing issue they feel hasn't been resolved. The agent must:",
    category: "hardship-compliance",
    purpose:
      "Capture the complaint accurately, follow escalation pathways and keep the customer informed of next steps.",
  }),
  basicDoc({
    id: "concession",
    title: "Concession",
    summary:
      "A customer contacts us to advise of their concession entitlement — typically a government-issued card (e.g. Pensioner Concessio...",
    category: "hardship-compliance",
    purpose:
      "Validate and apply the customer’s concession entitlement and explain any impact on billing.",
  }),
  basicDoc({
    id: "disconnection-for-non-payment",
    title: "Disconnection for Non-Payment",
    summary:
      "A customer contacts us because they have received a disconnection notice, are at risk of disconnection, or have been...",
    category: "hardship-compliance",
    purpose:
      "Assess disconnection status, protect vulnerable customers and present payment or hardship options.",
  }),
  {
    id: "family-violence",
    title: "Family Violence",
    summary:
      "A customer discloses — or an agent identifies — that the customer is experiencing or has experienced family violence. Th...",
    category: "hardship-compliance",
    purpose:
      "Protect customer safety, privacy and access to essential services using the approved specialist process.",
    beforeStart: [
      {
        title: "Safe contact confirmed",
        description: "Check whether it is safe to continue and which channels may be used.",
      },
      {
        title: "Minimum information",
        description: "Do not request evidence or unnecessary details about the customer’s experience.",
      },
    ],
    steps: [
      {
        title: "Apply account protections",
        location: "Customer account → Support flags → Family Violence",
        body:
          "Apply the privacy marker, review contact preferences and suppress unsafe correspondence.",
      },
      {
        title: "Refer to the specialist team",
        location: "Interactions → New specialist referral",
        body:
          "Create a priority referral and tell the customer what will happen next.",
      },
    ],
  },
  {
    id: "hardship-enquiry",
    title: "Hardship Enquiry",
    summary:
      "A customer contacts us because they are experiencing financial...",
    category: "hardship-compliance",
    purpose:
      "Recognise financial hardship, protect the customer and provide the appropriate support pathway.",
    beforeStart: [
      {
        title: "Privacy maintained",
        description: "Use a private, respectful conversation and only record relevant information.",
      },
      {
        title: "Immediate safety checked",
        description: "Identify urgent disconnection, medical or family-violence concerns first.",
      },
    ],
    steps: [
      {
        title: "Record the disclosure",
        location: "Customer account → Support flags",
        body:
          "Select the relevant hardship indicator and record a concise factual note.",
      },
      {
        title: "Review support options",
        location: "Customer account → Assistance",
        body:
          "Discuss payment support, concessions, energy-efficiency help and specialist referral.",
      },
    ],
  },
];
