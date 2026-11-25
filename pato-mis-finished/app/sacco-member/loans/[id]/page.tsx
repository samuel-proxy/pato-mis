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

const ROLES: Role[] = ["member"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** One loan: detail, repayment schedule (FR11) and repayment (FR04). */
export default function MemberLoanDetailPage() {
  const { db, user, ready, msg } = useAuth(ROLES);
  const { repay } = useLoans();
  const params = useParams();
  const [repayAmt, setRepayAmt] = useState("");

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const loan = db.loans.find((l) => l.id === params.id && l.memberId === user.memberId);
  if (!loan) return <p className="text-sm text-slate-500">Loan not found.</p>;
  const loanId = loan.id;

  const product = db.products.find((p) => p.id === loan.productId);

  function doRepay() {
    const ok = repay(loanId, Number(repayAmt) || 0, "Web");
    if (ok) setRepayAmt("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan {loan.id}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {product?.name} • {loan.purpose}
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

      {loan.status === "Disbursed" && (
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">Repay this Loan</h3>
          <div className="flex flex-wrap items-end gap-2">
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
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Repayment Schedule</h3>
        <LoanSchedule loan={loan} />
      </Card>
    </div>
  );
}
