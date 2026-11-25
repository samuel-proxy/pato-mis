"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import WithdrawalForm from "@/components/forms/WithdrawalForm";
import { fmtKES, fmtDate, toCents } from "@/lib/store";
import * as savingsService from "@/services/savingsService";
import * as withdrawalService from "@/services/withdrawalService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];

/** Withdrawals (FR06): request within the limit and track requests. */
export default function WithdrawalsPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const me = db.members.find((m) => m.id === user.memberId);
  if (!me) return <p className="text-sm text-slate-500">No member record found for this account.</p>;

  const limit = savingsService.withdrawalLimit(db, me.id);
  const myWithdrawals = db.withdrawals.filter((w) => w.memberId === me.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Withdrawals</h1>
        <p className="mt-1 text-sm text-slate-500">Request a withdrawal within your limit.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Request a Withdrawal</h3>
        <WithdrawalForm
          savingsCents={me.savingsCents}
          limitCents={limit}
          withdrawalPct={db.settings.withdrawalPct}
          withdrawalCapCents={db.settings.withdrawalCapCents}
          onSubmit={(amountKes) =>
            run((d) =>
              withdrawalService.requestWithdrawal(d, me.id, toCents(amountKes || 0), user.username)
            )
          }
        />
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">My Withdrawal Requests</h3>
        {myWithdrawals.length === 0 && (
          <p className="text-sm text-slate-500">No withdrawal requests yet.</p>
        )}
        {myWithdrawals.map((w) => (
          <div
            key={w.id}
            className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 py-2 text-sm"
          >
            <span>
              {w.id} — {fmtKES(w.amountCents)} — {fmtDate(w.requestedAt)}
            </span>
            <Badge variant={w.status === "Approved" ? "success" : w.status === "Rejected" ? "danger" : "default"}>
              {w.status}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}
