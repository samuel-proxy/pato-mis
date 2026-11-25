"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import LoanChart from "@/components/charts/LoanChart";
import { fmtKES } from "@/lib/store";
import { audit } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** System report (FR24): SACCO-wide figures and loans by status. */
export default function ReportsPage() {
  const { db, user, ready, msg, update } = useAuth(ROLES);
  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  const totals = {
    members: db.members.length,
    deposits: db.members.reduce((s, m) => s + m.depositsCents, 0),
    savings: db.members.reduce((s, m) => s + m.savingsCents, 0),
    outstanding: db.loans
      .filter((l) => l.status === "Disbursed" || l.status === "Approved")
      .reduce((s, l) => s + (l.amountCents - l.repaidCents), 0),
    repayments: db.txns.filter((t) => t.type === "Loan Repayment").reduce((s, t) => s + t.amountCents, 0),
    pendingLoans: db.loans.filter((l) => l.status === "Pending").length,
    pendingWithdrawals: db.withdrawals.filter((w) => w.status === "Pending").length,
    inArrears: db.members.filter((m) => m.inArrears).length,
  };

  function generateReport() {
    update(
      (d) => audit(d, actor, "System report generated", "System report viewed."),
      "Report generated and logged in the audit trail."
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Generate and view SACCO reports.</p>
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
          <p className="text-sm font-medium text-slate-500">Total Savings</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.savings)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loans Outstanding</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.outstanding)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Repayments</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.repayments)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending Loans</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.pendingLoans}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending Withdrawals</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.pendingWithdrawals}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Members in Arrears</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.inArrears}</h3>
        </div>
      </div>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Loans by Status</h3>
        <LoanChart loans={db.loans} />
      </Card>

      <button
        type="button"
        onClick={generateReport}
        className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
      >
        Generate system report
      </button>
    </div>
  );
}
