"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoanSchedule from "@/components/LoanSchedule";
import { fmtKES } from "@/lib/store";
import { statusVariant } from "@/lib/utils";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** One loan application: detail, schedule, approve / reject / disburse (FR09, FR10, FR12). */
export default function LoanApplicationDetailPage() {
  const { db, ready, msg } = useAuth(ROLES);
  const { decide, disburse } = useLoans();
  const params = useParams();
  const [decisionNote, setDecisionNote] = useState("");

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const loan = db.loans.find((l) => l.id === params.id);
  if (!loan) return <p className="text-sm text-slate-500">Loan application not found.</p>;

  const member = db.members.find((m) => m.id === loan.memberId);
  const product = db.products.find((p) => p.id === loan.productId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan Application {loan.id}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {member?.name} ({loan.memberId}) • {product?.name} • {loan.purpose}
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p>Amount: <b>{fmtKES(loan.amountCents)}</b></p>
          <p>Monthly repayment: <b>{fmtKES(loan.monthlyCents)}</b></p>
          <p>Term: <b>{loan.termMonths} months</b> at <b>{loan.ratePa}% p.a.</b></p>
          <p>Repaid: <b>{fmtKES(loan.repaidCents)}</b></p>
          <p>Outstanding: <b>{fmtKES(loan.amountCents - loan.repaidCents)}</b></p>
          <p>
            Status: <Badge variant={statusVariant(loan.status)}>{loan.status}</Badge>
          </p>
          <p>Total interest: <b>{fmtKES(loan.totalInterestCents)}</b></p>
          <p>Applied: <b>{new Date(loan.appliedAt).toLocaleDateString("en-KE")}</b></p>
          {loan.decidedBy && <p>Decided by: <b>{loan.decidedBy}</b></p>}
          {loan.decisionNote && <p>Decision note: <b>{loan.decisionNote}</b></p>}
          {loan.disbursedAt && <p>Disbursed: <b>{new Date(loan.disbursedAt).toLocaleDateString("en-KE")}</b></p>}
        </div>
      </Card>

      {(loan.status === "Pending" || loan.status === "Approved") && (
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">Decision</h3>
          <label className="block text-sm">
            <span className="text-slate-600">Decision note</span>
            <input
              className={`${inp} mt-1`}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Eligibility re-checked, deposits cover loan"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {loan.status === "Pending" && (
              <>
                <button
                  type="button"
                  onClick={() => decide(loan.id, true, decisionNote)}
                  className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => decide(loan.id, false, decisionNote)}
                  className="rounded border border-red-600 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Reject
                </button>
              </>
            )}
            {loan.status === "Approved" && (
              <button
                type="button"
                onClick={() => disburse(loan.id)}
                className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Disburse
              </button>
            )}
          </div>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Repayment Schedule</h3>
        <LoanSchedule loan={loan} />
      </Card>
    </div>
  );
}
