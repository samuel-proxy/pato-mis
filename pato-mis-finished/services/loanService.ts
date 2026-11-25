import type { DB } from "@/lib/store";
import {
  audit,
  eligibility,
  fmtKES,
  monthlyPayment,
  outstandingLoans,
  repaymentSchedule,
  uid,
} from "@/lib/store";
import type { Loan, LoanApplicationInput, ScheduleRow } from "@/types/loan";
import type { TxnChannel } from "@/types/transaction";

/** Loan eligibility for a member and product (FR03). */
export function getEligibility(db: DB, memberId: string, productId: string) {
  const product = db.products.find((p) => p.id === productId) || db.products[0];
  return eligibility(db, memberId, product);
}

export function outstandingFor(db: DB, memberId: string): number {
  return outstandingLoans(db, memberId);
}

export function getSchedule(loan: Loan): ScheduleRow[] {
  return repaymentSchedule(loan.amountCents, loan.ratePa, loan.termMonths);
}

/** Apply for a loan (FR03). Throws with a plain message when refused. */
export function applyLoan(db: DB, memberId: string, input: LoanApplicationInput): string {
  const me = db.members.find((m) => m.id === memberId);
  if (!me) throw new Error("Member not found.");
  const product = db.products.find((p) => p.id === input.productId) || db.products[0];
  if (!product) throw new Error("Loan product not found.");
  const amountCents = input.amountCents;
  if (!amountCents || amountCents <= 0) throw new Error("Enter a loan amount in KES.");
  const elig = eligibility(db, memberId, product);
  if (amountCents > elig.eligibleCents) throw new Error(`Loan refused: ${elig.reason}`);
  if (input.termMonths > product.maxMonths)
    throw new Error(`Term exceeds the product maximum of ${product.maxMonths} months.`);
  const monthlyC = monthlyPayment(amountCents, product.ratePa, input.termMonths);
  db.loans.unshift({
    id: uid("L"),
    memberId: me.id,
    productId: product.id,
    amountCents,
    termMonths: input.termMonths,
    ratePa: product.ratePa,
    monthlyCents: monthlyC,
    totalInterestCents: monthlyC * input.termMonths - amountCents,
    repaidCents: 0,
    status: "Pending",
    purpose: input.purpose || "Not stated",
    appliedAt: new Date().toISOString(),
  });
  db.txns.unshift({
    id: uid("T"),
    memberId: me.id,
    type: "Loan Application",
    amountCents,
    date: new Date().toISOString(),
    note: `Applied for ${product.name}`,
    channel: "Web",
  });
  audit(db, me.id, "Loan application", `${me.name} applied for ${fmtKES(amountCents)} ${product.name}, ${input.termMonths} months.`);
  return `Loan application submitted for ${fmtKES(amountCents)}. Status: Pending — a Credit Officer will decide.`;
}

/** Approve or reject a loan (FR09, FR10). Eligibility is re-checked at approval. */
export function decideLoan(
  db: DB,
  loanId: string,
  approve: boolean,
  actor: string,
  note?: string
): string {
  const ln = db.loans.find((l) => l.id === loanId);
  if (!ln) throw new Error("Loan not found.");
  if (ln.status !== "Pending") throw new Error(`Loan ${loanId} is already ${ln.status}.`);
  const prod = db.products.find((p) => p.id === ln.productId);
  if (!prod) throw new Error("Loan product not found.");
  const e = eligibility(db, ln.memberId, prod);
  if (approve && ln.amountCents > e.eligibleCents) throw new Error(`Cannot approve: ${e.reason}`);
  ln.status = approve ? "Approved" : "Rejected";
  ln.decidedBy = actor;
  ln.decisionNote = note || undefined;
  audit(db, actor, approve ? "Loan approved" : "Loan rejected", `${loanId} ${ln.memberId} ${fmtKES(ln.amountCents)} — ${note || "no note"}.`);
  return approve ? `${loanId} approved.` : `${loanId} rejected.`;
}

/** Disburse an approved loan (FR12). */
export function disburseLoan(db: DB, loanId: string, actor: string): string {
  const ln = db.loans.find((l) => l.id === loanId);
  if (!ln) throw new Error("Loan not found.");
  if (ln.status !== "Approved")
    throw new Error(`Only an approved loan can be disbursed. Loan ${loanId} is ${ln.status}.`);
  ln.status = "Disbursed";
  ln.disbursedAt = new Date().toISOString();
  db.txns.unshift({
    id: uid("T"),
    memberId: ln.memberId,
    type: "Loan Disbursement",
    amountCents: ln.amountCents,
    date: new Date().toISOString(),
    note: `Disbursed ${loanId}`,
    channel: "Office",
  });
  const m = db.members.find((x) => x.id === ln.memberId);
  if (m) {
    db.sms.unshift({
      id: uid("S"),
      to: m.phone,
      message: `Dear ${m.name.split(" ")[0]}, your loan ${loanId} of ${fmtKES(ln.amountCents)} has been disbursed. Monthly repayment ${fmtKES(ln.monthlyCents)}. - Pato Sacco`,
      status: "Delivered",
      date: new Date().toISOString(),
      kind: "Confirmation",
    });
  }
  audit(db, actor, "Loan disbursed", `${loanId} ${fmtKES(ln.amountCents)} disbursed to ${ln.memberId}.`);
  return `${loanId} disbursed.`;
}

/** A member repays their own loan (FR04). Full repayment clears arrears. */
export function repayMemberLoan(
  db: DB,
  loanId: string,
  amountCents: number,
  actor: string,
  channel: TxnChannel = "Web"
): string {
  const loan = db.loans.find((l) => l.id === loanId);
  if (!loan) throw new Error("Loan not found.");
  if (loan.status !== "Disbursed") throw new Error("Only a disbursed loan can be repaid.");
  if (!amountCents || amountCents <= 0) throw new Error("Enter a repayment amount.");
  const remaining = loan.amountCents - loan.repaidCents;
  if (amountCents > remaining)
    throw new Error(`Amount is more than the outstanding balance ${fmtKES(remaining)}.`);
  loan.repaidCents += amountCents;
  if (loan.repaidCents >= loan.amountCents) {
    loan.status = "Repaid";
    const m = db.members.find((x) => x.id === loan.memberId);
    if (m) m.inArrears = false;
  }
  db.txns.unshift({
    id: uid("T"),
    memberId: loan.memberId,
    type: "Loan Repayment",
    amountCents,
    date: new Date().toISOString(),
    note: `Repayment ${loanId}`,
    channel,
  });
  const me = db.members.find((x) => x.id === loan.memberId);
  if (me) {
    db.sms.unshift({
      id: uid("S"),
      to: me.phone,
      message: `Dear ${me.name.split(" ")[0]}, your loan repayment of ${fmtKES(amountCents)} was received. Balance ${fmtKES(remaining - amountCents)}. - Pato Sacco`,
      status: "Delivered",
      date: new Date().toISOString(),
      kind: "Confirmation",
    });
  }
  audit(db, actor, "Loan repayment", `${me?.name ?? loan.memberId} repaid ${fmtKES(amountCents)} on ${loanId} (${channel}).`);
  return `Repayment of ${fmtKES(amountCents)} recorded for ${loanId}.`;
}

/** A credit officer records a repayment at the office (FR13). */
export function recordOfficeRepayment(
  db: DB,
  loanId: string,
  amountCents: number,
  actor: string
): string {
  const loan = db.loans.find((l) => l.id === loanId);
  if (!loan || !amountCents) throw new Error("Select a loan and enter an amount.");
  loan.repaidCents = Math.min(loan.amountCents, loan.repaidCents + amountCents);
  if (loan.repaidCents >= loan.amountCents) loan.status = "Repaid";
  db.txns.unshift({
    id: uid("T"),
    memberId: loan.memberId,
    type: "Loan Repayment",
    amountCents,
    date: new Date().toISOString(),
    note: `Repayment ${loanId} (office)`,
    channel: "Office",
  });
  audit(db, actor, "Repayment recorded", `${fmtKES(amountCents)} recorded on ${loanId} by ${actor}.`);
  return `Repayment of ${fmtKES(amountCents)} recorded on ${loanId}.`;
}
