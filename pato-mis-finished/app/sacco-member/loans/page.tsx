"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import LoansTable from "@/components/tables/LoansTable";
import LoanSchedule from "@/components/LoanSchedule";
import type { Loan } from "@/types/loan";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** My loans (FR04 repay, FR11 schedule). */
export default function MemberLoansPage() {
  const { db, user, ready, msg } = useAuth(ROLES);
  const { myLoans, repay } = useLoans();
  const [scheduleLoan, setScheduleLoan] = useState<Loan | null>(null);
  const [repayLoanId, setRepayLoanId] = useState("");
  const [repayAmt, setRepayAmt] = useState("");

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;

  function doRepay() {
    const ok = repay(repayLoanId, Number(repayAmt) || 0, "Web");
    if (ok) setRepayAmt("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
          <p className="mt-1 text-sm text-slate-500">View your loans, repay, and see schedules.</p>
        </div>
        <Link
          href="/sacco-member/loans/apply"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Apply for a Loan
        </Link>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Repay a Loan</h3>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm">
            <span className="text-slate-600">Loan</span>
            <select
              className={`${inp} mt-1`}
              value={repayLoanId}
              onChange={(e) => setRepayLoanId(e.target.value)}
            >
              <option value="">Select loan</option>
              {myLoans
                .filter((l) => l.status === "Disbursed")
                .map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.id} — outstanding {((l.amountCents - l.repaidCents) / 100).toLocaleString("en-KE")} KES
                  </option>
                ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Amount (KES)</span>
            <input
              className={`${inp} mt-1`}
              type="number"
              value={repayAmt}
              onChange={(e) => setRepayAmt(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={doRepay}
            className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Record repayment
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">My Loans</h3>
        <LoansTable
          loans={myLoans}
          products={db.products}
          actions={(loan) => (
            <button
              type="button"
              onClick={() => setScheduleLoan(loan)}
              className="rounded border border-slate-400 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
            >
              Schedule
            </button>
          )}
        />
      </Card>

      {scheduleLoan && (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Repayment schedule — {scheduleLoan.id}</h3>
            <button
              type="button"
              onClick={() => setScheduleLoan(null)}
              className="rounded border px-3 py-1 text-sm"
            >
              Close
            </button>
          </div>
          <LoanSchedule loan={scheduleLoan} />
        </Card>
      )}
    </div>
  );
}
