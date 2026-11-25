"use client";

import { useMemo } from "react";
import { usePato } from "@/hooks/usePato";
import type { DB } from "@/lib/store";
import { toCents } from "@/lib/store";
import * as loanService from "@/services/loanService";
import type { Loan, ScheduleRow } from "@/types/loan";
import type { TxnChannel } from "@/types/transaction";

/** Loans for the current user, with the loan actions bound to the store. */
export function useLoans() {
  const { db, user, run } = usePato();

  const loans = useMemo(() => db?.loans ?? [], [db]);
  const myLoans = useMemo(
    () => (user?.memberId ? loans.filter((l) => l.memberId === user.memberId) : []),
    [loans, user]
  );
  const pendingLoans = useMemo(() => loans.filter((l) => l.status === "Pending"), [loans]);

  /** Run a service function on a copy of the database and commit it. */
  function act(fn: (d: DB) => string): boolean {
    if (!db || !user) return false;
    return run(fn);
  }

  return {
    loans,
    myLoans,
    pendingLoans,
    /** Eligibility for the signed-in member and a product (FR03). */
    eligibility: (productId: string) =>
      db && user?.memberId
        ? loanService.getEligibility(db, user.memberId, productId)
        : { eligibleCents: 0, reason: "" },
    schedule: (loan: Loan): ScheduleRow[] => loanService.getSchedule(loan),
    apply: (input: { productId: string; amountKes: number; termMonths: number; purpose: string }) =>
      user?.memberId
        ? act((d) =>
            loanService.applyLoan(d, user.memberId as string, {
              productId: input.productId,
              amountCents: toCents(input.amountKes || 0),
              termMonths: input.termMonths,
              purpose: input.purpose,
            })
          )
        : false,
    repay: (loanId: string, amountKes: number, channel: TxnChannel = "Web") =>
      user
        ? act((d) =>
            loanService.repayMemberLoan(d, loanId, toCents(amountKes || 0), user.username, channel)
          )
        : false,
    decide: (loanId: string, approve: boolean, note?: string) =>
      user ? act((d) => loanService.decideLoan(d, loanId, approve, user.username, note)) : false,
    disburse: (loanId: string) =>
      user ? act((d) => loanService.disburseLoan(d, loanId, user.username)) : false,
    officerRepay: (loanId: string, amountKes: number) =>
      user
        ? act((d) => loanService.recordOfficeRepayment(d, loanId, toCents(amountKes || 0), user.username))
        : false,
  };
}
