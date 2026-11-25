import type { DB } from "@/lib/store";
import { audit, fmtKES, uid } from "@/lib/store";
import { withdrawalLimit } from "@/services/savingsService";

/** Request a withdrawal (FR06). Throws when the amount is invalid or over the limit. */
export function requestWithdrawal(
  db: DB,
  memberId: string,
  amountCents: number,
  actor: string
): string {
  const me = db.members.find((m) => m.id === memberId);
  if (!me) throw new Error("Member not found.");
  const limit = withdrawalLimit(db, memberId);
  if (!amountCents || amountCents <= 0) throw new Error("Enter a withdrawal amount.");
  if (amountCents > limit)
    throw new Error(
      `Withdrawal limit is ${fmtKES(limit)} (${db.settings.withdrawalPct}% of savings, capped at ${fmtKES(db.settings.withdrawalCapCents)}).`
    );
  if (amountCents > me.savingsCents) throw new Error("Amount exceeds your savings balance.");
  db.withdrawals.unshift({
    id: uid("W"),
    memberId: me.id,
    amountCents,
    status: "Pending",
    requestedAt: new Date().toISOString(),
  });
  audit(db, actor, "Withdrawal requested", `${me.name} requested withdrawal ${fmtKES(amountCents)}.`);
  return `Withdrawal request for ${fmtKES(amountCents)} submitted. Status: Pending.`;
}

/** Approve or reject a withdrawal request (FR14). */
export function processWithdrawal(
  db: DB,
  withdrawalId: string,
  approve: boolean,
  actor: string
): string {
  const w = db.withdrawals.find((x) => x.id === withdrawalId);
  if (!w) throw new Error("Withdrawal not found.");
  if (w.status !== "Pending") throw new Error(`Withdrawal ${withdrawalId} is already ${w.status}.`);
  w.status = approve ? "Approved" : "Rejected";
  w.processedBy = actor;
  if (approve) {
    const m = db.members.find((x) => x.id === w.memberId);
    if (m) {
      m.savingsCents = Math.max(0, m.savingsCents - w.amountCents);
      db.txns.unshift({
        id: uid("T"),
        memberId: w.memberId,
        type: "Withdrawal",
        amountCents: w.amountCents,
        date: new Date().toISOString(),
        note: `Withdrawal ${w.id} approved`,
        channel: "Office",
      });
    }
  }
  audit(
    db,
    actor,
    approve ? "Withdrawal approved" : "Withdrawal rejected",
    `${w.id} ${fmtKES(w.amountCents)} for ${w.memberId}.`
  );
  return approve ? "Withdrawal approved and paid." : "Withdrawal rejected.";
}
