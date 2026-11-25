"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import LoansTable from "@/components/tables/LoansTable";
import LoanSchedule from "@/components/LoanSchedule";
import type { Loan } from "@/types/loan";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Loan applications — approve / reject / disburse (FR09, FR10, FR12, FR11). */
export default function LoanApplicationsPage() {
  const { db, ready, msg } = useAuth(ROLES);
  const { loans, decide, disburse } = useLoans();
  const [decisionNote, setDecisionNote] = useState("");
  const [scheduleLoan, setScheduleLoan] = useState<Loan | null>(null);

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Approve or reject applications. Eligibility is re-checked at approval.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">All Applications</h3>
        <LoansTable
          loans={loans}
          products={db.products}
          showMember
          actions={(loan) => (
            <span className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setScheduleLoan(loan)}
                className="rounded border border-slate-400 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
              >
                Schedule
              </button>
              {loan.status === "Pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => decide(loan.id, true, decisionNote)}
                    className="rounded bg-blue-900 px-2 py-1 text-xs font-medium text-white hover:bg-blue-800"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => decide(loan.id, false, decisionNote)}
                    className="rounded border border-red-600 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </>
              )}
              {loan.status === "Approved" && (
                <button
                  type="button"
                  onClick={() => disburse(loan.id)}
                  className="rounded bg-blue-900 px-2 py-1 text-xs font-medium text-white hover:bg-blue-800"
                >
                  Disburse
                </button>
              )}
            </span>
          )}
        />
        <div className="mt-3">
          <label className="block text-sm">
            <span className="text-slate-600">Decision note (used for the next Approve / Reject)</span>
            <input
              className={`${inp} mt-1`}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Eligibility re-checked, deposits cover loan"
            />
          </label>
        </div>
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
