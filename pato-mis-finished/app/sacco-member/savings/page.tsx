"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { fmtKES, toCents } from "@/lib/store";
import * as savingsService from "@/services/savingsService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Savings and contributions (FR07). */
export default function SavingsPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);
  const [amount, setAmount] = useState("");

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const me = db.members.find((m) => m.id === user.memberId);
  if (!me) return <p className="text-sm text-slate-500">No member record found for this account.</p>;
  const memberId = me.id;
  const actor = user.username;

  const myContributions = db.txns.filter(
    (t) => t.memberId === me.id && t.type === "Contribution"
  );

  function postContribution() {
    const ok = run((d) =>
      savingsService.contribute(d, memberId, toCents(Number(amount) || 0), actor, "Web")
    );
    if (ok) setAmount("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Savings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Deposits {fmtKES(me.depositsCents)} • Savings {fmtKES(me.savingsCents)} • Contributions
          increase your deposits and your loan eligibility.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-2 font-bold text-slate-900">Post a Savings Contribution</h3>
        <p className="mb-3 text-sm text-slate-600">
          Minimum monthly contribution: {fmtKES(db.settings.minContributionCents)}.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm">
            <span className="text-slate-600">Amount (KES)</span>
            <input
              className={`${inp} mt-1`}
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={postContribution}
            className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Post contribution
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">My Contributions</h3>
        <TransactionsTable txns={myContributions} />
      </Card>
    </div>
  );
}
