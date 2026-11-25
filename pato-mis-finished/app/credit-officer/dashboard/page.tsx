"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import LoansTable from "@/components/tables/LoansTable";
import LoanChart from "@/components/charts/LoanChart";
import { fmtKES } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];

/** Credit officer dashboard: totals, pending work and recent loans. */
export default function OfficerDashboard() {
  const { db, ready, msg } = useAuth(ROLES);
  const { pendingLoans } = useLoans();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  const totals = {
    members: db.members.length,
    deposits: db.members.reduce((s, m) => s + m.depositsCents, 0),
    outstanding: db.loans
      .filter((l) => l.status === "Disbursed" || l.status === "Approved")
      .reduce((s, l) => s + (l.amountCents - l.repaidCents), 0),
    repayments: db.txns.filter((t) => t.type === "Loan Repayment").reduce((s, t) => s + t.amountCents, 0),
    pendingWithdrawals: db.withdrawals.filter((w) => w.status === "Pending").length,
    inArrears: db.members.filter((m) => m.inArrears).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credit Officer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Loan applications, disbursements and repayments.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Members</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.members}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Deposits</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.deposits)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loans Outstanding</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.outstanding)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Repayments Received</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.repayments)}</h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Pending Work</h3>
          <p className="text-sm text-slate-700">Loan applications pending: <b>{pendingLoans.length}</b></p>
          <p className="text-sm text-slate-700">Withdrawal requests pending: <b>{totals.pendingWithdrawals}</b></p>
          <p className="text-sm text-slate-700">Members in arrears: <b>{totals.inArrears}</b></p>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Recent Loans</h3>
          {db.loans.slice(0, 3).map((l) => (
            <p key={l.id} className="text-sm text-slate-700">
              {l.id} — {l.memberId} — {fmtKES(l.amountCents)} — {l.status}
            </p>
          ))}
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Recent Activity</h3>
          {db.audit.slice(0, 3).map((a) => (
            <p key={a.id} className="text-sm text-slate-700">
              {a.action} — {a.detail}
            </p>
          ))}
        </Card>
      </div>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Loans by Status</h3>
        <LoanChart loans={db.loans} />
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Pending Loan Applications</h3>
        <LoansTable loans={pendingLoans} products={db.products} showMember />
      </Card>
    </div>
  );
}
