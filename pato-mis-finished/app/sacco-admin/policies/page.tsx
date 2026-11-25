"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { fromCents, toCents } from "@/lib/store";
import * as policyService from "@/services/policyService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Contribution policy (FR20) and the credit rules it drives. */
export default function PoliciesPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);
  const [minContribution, setMinContribution] = useState("1000");
  const [multiplier, setMultiplier] = useState("3");
  const [withdrawalPct, setWithdrawalPct] = useState("50");
  const [withdrawalCap, setWithdrawalCap] = useState("50000");

  useEffect(() => {
    if (db) {
      setMinContribution(String(fromCents(db.settings.minContributionCents)));
      setMultiplier(String(db.settings.depositMultiplier));
      setWithdrawalPct(String(db.settings.withdrawalPct));
      setWithdrawalCap(String(fromCents(db.settings.withdrawalCapCents)));
    }
  }, [db]);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function save() {
    run((d) =>
      policyService.updateSettings(
        d,
        {
          minContributionCents: toCents(Number(minContribution) || 0),
          depositMultiplier: Number(multiplier) || 3,
          withdrawalPct: Number(withdrawalPct) || 50,
          withdrawalCapCents: toCents(Number(withdrawalCap) || 0),
        },
        actor
      )
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Policies</h1>
        <p className="mt-1 text-sm text-slate-500">
          Contribution policy and the credit rules it drives (FR20, FR03, FR06).
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Contribution Policy</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">Minimum monthly contribution (KES)</span>
            <input className={`${inp} mt-1`} type="number" value={minContribution} onChange={(e) => setMinContribution(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Deposit multiplier for loans (x)</span>
            <input className={`${inp} mt-1`} type="number" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Withdrawal limit (% of savings)</span>
            <input className={`${inp} mt-1`} type="number" value={withdrawalPct} onChange={(e) => setWithdrawalPct(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Withdrawal cap (KES)</span>
            <input className={`${inp} mt-1`} type="number" value={withdrawalCap} onChange={(e) => setWithdrawalCap(e.target.value)} />
          </label>
        </div>
        <button
          type="button"
          onClick={save}
          className="mt-4 rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Save policy
        </button>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Credit Rules in Force</h3>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            Loan eligibility: deposits x {db.settings.depositMultiplier} minus outstanding loans,
            capped at the loan product ceiling.
          </li>
          <li>No new loan while a member is in arrears.</li>
          <li>Eligibility is re-checked by the credit officer at approval.</li>
          <li>
            Withdrawal limit: {db.settings.withdrawalPct}% of savings, capped at{" "}
            {fromCents(db.settings.withdrawalCapCents).toLocaleString("en-KE")} KES.
          </li>
          <li>Repayments use a reducing-balance schedule.</li>
        </ul>
      </Card>
    </div>
  );
}
