export interface ContributionInput {
  amountCents: number;
  channel: "Web" | "USSD" | "Office";
}

export interface SavingsBalance {
  depositsCents: number;
  savingsCents: number;
  outstandingCents: number;
}
