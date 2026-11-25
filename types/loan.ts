export type LoanStatus = "Pending" | "Approved" | "Rejected" | "Disbursed" | "Repaid";

export interface LoanProduct {
  id: string;
  name: string;
  ratePa: number;
  maxMonths: number;
  ceilingCents: number;
}

export interface Loan {
  id: string;
  memberId: string;
  productId: string;
  amountCents: number;
  termMonths: number;
  ratePa: number;
  monthlyCents: number;
  totalInterestCents: number;
  repaidCents: number;
  status: LoanStatus;
  purpose: string;
  appliedAt: string;
  decidedBy?: string;
  decisionNote?: string;
  disbursedAt?: string;
}

export interface ScheduleRow {
  month: number;
  paymentCents: number;
  principalCents: number;
  interestCents: number;
  balanceCents: number;
}

export interface LoanApplicationInput {
  productId: string;
  amountCents: number;
  termMonths: number;
  purpose: string;
}
