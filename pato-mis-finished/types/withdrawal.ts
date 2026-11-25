export type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

export interface Withdrawal {
  id: string;
  memberId: string;
  amountCents: number;
  status: WithdrawalStatus;
  requestedAt: string;
  processedBy?: string;
}
