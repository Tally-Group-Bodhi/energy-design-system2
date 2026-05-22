export const WORK_QUEUE_ROWS = [
  {
    taskId: "100000",
    billingAccount: "000011420511",
    reference: "2001134444",
    subject: "請求書送付先変更のご依頼",
    priority: "Normal",
    reporter: "System",
    created: "2026/05/20 09:15",
    assignee: "MrbProdAdmin",
    dueDate: "2026/05/25",
    status: "Open",
  },
  {
    taskId: "100001",
    billingAccount: "000011420512",
    reference: "2001134445",
    subject: "契約内容確認のお問い合わせ",
    priority: "High",
    reporter: "Customer Portal",
    created: "2026/05/19 14:32",
    assignee: "Unassigned",
    dueDate: "2026/05/22",
    status: "Open",
  },
];

export const BILLING_ACCOUNTS = [
  {
    id: "000011420511",
    name: "株式会社スペースライブラリ",
    service: "Electric",
    selected: true,
  },
  {
    id: "000011420512",
    name: "株式会社スペースライブラリ — Site B",
    service: "Electric",
    selected: false,
  },
  {
    id: "000011420513",
    name: "株式会社スペースライブラリ — Gas",
    service: "Gas",
    selected: false,
  },
];

export const BATCH_UPLOAD_ROWS = [
  {
    fileName: "batch_payments_may_2026.xlsx",
    date: "2026/05/18",
    status: "Completed",
    createdBy: "ExtEOSMrbUatAdmin",
    recordCount: 142,
    division: "Marubeni-Commercial",
  },
  {
    fileName: "batch_payments_apr_2026.xlsx",
    date: "2026/04/22",
    status: "Processing",
    createdBy: "ExtEOSMrbUatAdmin",
    recordCount: 98,
    division: "Marubeni-Commercial",
  },
];

export const ENROLLMENT_RESULT_COLUMNS = [
  { key: "confirmation", label: "Confirmation Number", locked: true, width: 200 },
  { key: "reference", label: "Reference Number", width: 160 },
  { key: "utility", label: "Utility Account Number", width: 220 },
  { key: "service", label: "Service Type", width: 160 },
  { key: "customer", label: "Customer Name", width: 260 },
  { key: "channel", label: "Sales Channels", width: 140 },
  { key: "partner", label: "Sales Channel Partner", width: 200 },
  { key: "agent", label: "Sales Agent Code", width: 160 },
  { key: "status", label: "Application details and status", width: 200 },
  { key: "updated", label: "Updated Date", width: 160 },
];

export interface EnrollmentResultRow {
  confirmationNumber: string;
  referenceNumber: string;
  utilityAccountNumber: string;
  serviceType: "Electric" | "Gas" | "Electric + Gas";
  customerName: string;
  salesChannel: "Direct" | "Partner" | "Web" | "Phone";
  salesChannelPartner: string;
  salesAgentCode: string;
  status:
    | "Approved"
    | "Pending Review"
    | "In Progress"
    | "Rejected"
    | "Awaiting Customer"
    | "Completed";
  updatedDate: string;
}

export const ENROLLMENT_SEARCH_ROWS: EnrollmentResultRow[] = [
  {
    confirmationNumber: "ENR-2026-001284",
    referenceNumber: "REF-9920841",
    utilityAccountNumber: "03101120005031101099",
    serviceType: "Electric",
    customerName: "株式会社スペースライブラリ",
    salesChannel: "Direct",
    salesChannelPartner: "Marubeni-Commercial",
    salesAgentCode: "AGT-0142",
    status: "Approved",
    updatedDate: "2026/05/22 09:14",
  },
  {
    confirmationNumber: "ENR-2026-001283",
    referenceNumber: "REF-9920840",
    utilityAccountNumber: "03101120006042410590",
    serviceType: "Gas",
    customerName: "東京エネルギーソリューションズ株式会社",
    salesChannel: "Partner",
    salesChannelPartner: "Tokyo Energy Partners",
    salesAgentCode: "AGT-0098",
    status: "Pending Review",
    updatedDate: "2026/05/22 08:47",
  },
  {
    confirmationNumber: "ENR-2026-001282",
    referenceNumber: "REF-9920839",
    utilityAccountNumber: "03101120007301210799",
    serviceType: "Electric + Gas",
    customerName: "大阪ビルマネジメント合同会社",
    salesChannel: "Web",
    salesChannelPartner: "—",
    salesAgentCode: "AGT-0211",
    status: "In Progress",
    updatedDate: "2026/05/21 17:32",
  },
  {
    confirmationNumber: "ENR-2026-001281",
    referenceNumber: "REF-9920838",
    utilityAccountNumber: "03101120008309210132",
    serviceType: "Electric",
    customerName: "サンライズ商事株式会社",
    salesChannel: "Phone",
    salesChannelPartner: "Tokyo Energy Partners",
    salesAgentCode: "AGT-0142",
    status: "Awaiting Customer",
    updatedDate: "2026/05/21 14:09",
  },
  {
    confirmationNumber: "ENR-2026-001280",
    referenceNumber: "REF-9920837",
    utilityAccountNumber: "03101120009310110143",
    serviceType: "Electric",
    customerName: "Nagoya Manufacturing Co., Ltd.",
    salesChannel: "Direct",
    salesChannelPartner: "Marubeni-Commercial",
    salesAgentCode: "AGT-0076",
    status: "Completed",
    updatedDate: "2026/05/21 11:21",
  },
  {
    confirmationNumber: "ENR-2026-001279",
    referenceNumber: "REF-9920836",
    utilityAccountNumber: "03101120010210320441",
    serviceType: "Gas",
    customerName: "京都グリーンエナジー株式会社",
    salesChannel: "Partner",
    salesChannelPartner: "Kansai Power Agency",
    salesAgentCode: "AGT-0188",
    status: "Rejected",
    updatedDate: "2026/05/20 16:58",
  },
  {
    confirmationNumber: "ENR-2026-001278",
    referenceNumber: "REF-9920835",
    utilityAccountNumber: "03101120011402190112",
    serviceType: "Electric + Gas",
    customerName: "Fukuoka Logistics Holdings",
    salesChannel: "Direct",
    salesChannelPartner: "Marubeni-Commercial",
    salesAgentCode: "AGT-0142",
    status: "Approved",
    updatedDate: "2026/05/20 10:12",
  },
  {
    confirmationNumber: "ENR-2026-001277",
    referenceNumber: "REF-9920834",
    utilityAccountNumber: "03101120012503820920",
    serviceType: "Electric",
    customerName: "横浜オフィスタワーズ株式会社",
    salesChannel: "Web",
    salesChannelPartner: "—",
    salesAgentCode: "AGT-0211",
    status: "Completed",
    updatedDate: "2026/05/19 15:44",
  },
];
