"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { fmtKES } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Record loan repayments at the office (FR13). */
export default function RepaymentsPage() {
  const { db, ready, msg } = useAuth(ROLES);
  const { officerRepay } = useLoans();
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const disbursed = db.loans.filter((l) => l.status === "Disbursed");
  const repayments = db.txns.filter((t) => t.type === "Loan Repayment");

  function record() {
    const ok = officerRepay(loanId, Number(amount) || 0);
    if (ok) setAmount("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Repayments</h1>
        <p className="mt-1 text-sm text-slate-500">Record a loan repayment received at the office.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Record a Loan Repayment (office)</h3>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm">
            <span className="text-slate-600">Loan</span>
            <select className={`${inp} mt-1`} value={loanId} onChange={(e) => setLoanId(e.target.value)}>
              <option value="">Select loan</option>
              {disbursed.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.memberId} — outstanding {fmtKES(l.amountCents - l.repaidCents)}
                </option>
              ))}
            </select>
          </label>
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
            onClick={record}
            className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Record repayment
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Recent Repayments</h3>
        <TransactionsTable txns={repayments} showMember />
      </Card>
    </div>
  );
}
