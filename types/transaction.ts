export type TxnType =
  | "Contribution"
  | "Loan Repayment"
  | "Withdrawal"
  | "Loan Disbursement"
  | "Loan Application";

export type TxnChannel = "Web" | "USSD" | "Office";

export interface Txn {
  id: string;
  memberId: string;
  type: TxnType;
  amountCents: number;
  date: string;
  note: string;
  channel: TxnChannel;
}

export interface SmsLog {
  id: string;
  to: string;
  message: string;
  status: "Delivered" | "Pending" | "Failed";
  date: string;
  kind: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  detail: string;
  date: string;
}
