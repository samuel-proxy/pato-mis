import type { DB } from "@/lib/store";
import { audit, fmtKES, outstandingLoans, uid } from "@/lib/store";
import type { SavingsBalance } from "@/types/savings";
import type { TxnChannel } from "@/types/transaction";

export function balances(db: DB, memberId: string): SavingsBalance | undefined {
  const m = db.members.find((x) => x.id === memberId);
  if (!m) return undefined;
  return {
    depositsCents: m.depositsCents,
    savingsCents: m.savingsCents,
    outstandingCents: outstandingLoans(db, memberId),
  };
}

/** Withdrawal limit: min(withdrawal % of savings, cap) (FR06). */
export function withdrawalLimit(db: DB, memberId: string): number {
  const m = db.members.find((x) => x.id === memberId);
  if (!m) return 0;
  return Math.min(
    Math.round((m.savingsCents * db.settings.withdrawalPct) / 100),
    db.settings.withdrawalCapCents
  );
}

/** Post a savings contribution (FR07). Throws when below the minimum. */
export function contribute(
  db: DB,
  memberId: string,
  amountCents: number,
  actor: string,
  channel: TxnChannel = "Web"
): string {
  const me = db.members.find((m) => m.id === memberId);
  if (!me) throw new Error("Member not found.");
  if (!amountCents || amountCents < db.settings.minContributionCents)
    throw new Error(`Minimum contribution is ${fmtKES(db.settings.minContributionCents)}.`);
  me.depositsCents += amountCents;
  me.savingsCents += amountCents;
  db.txns.unshift({
    id: uid("T"),
    memberId: me.id,
    type: "Contribution",
    amountCents,
    date: new Date().toISOString(),
    note: "Savings contribution",
    channel,
  });
  audit(db, actor, "Contribution posted", `${me.name} contributed ${fmtKES(amountCents)} (${channel}).`);
  return `Contribution of ${fmtKES(amountCents)} posted. New deposits: ${fmtKES(me.depositsCents)}.`;
}
