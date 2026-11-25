"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import LoanChart from "@/components/charts/LoanChart";
import SavingsChart from "@/components/charts/SavingsChart";
import { fmtKES } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];

/** SACCO administrator dashboard: totals, pending work and charts. */
export default function SaccoAdminDashboard() {
  const { db, ready } = useAuth(ROLES);
  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  const totals = {
    members: db.members.length,
    deposits: db.members.reduce((s, m) => s + m.depositsCents, 0),
    savings: db.members.reduce((s, m) => s + m.savingsCents, 0),
    outstanding: db.loans
      .filter((l) => l.status === "Disbursed" || l.status === "Approved")
      .reduce((s, l) => s + (l.amountCents - l.repaidCents), 0),
    pendingLoans: db.loans.filter((l) => l.status === "Pending").length,
    pendingWithdrawals: db.withdrawals.filter((w) => w.status === "Pending").length,
    inArrears: db.members.filter((m) => m.inArrears).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrator Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Members, loans, savings and pending work.</p>
      </div>

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
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Pending Work</h3>
          <p className="text-sm text-slate-700">Loan applications pending: <b>{totals.pendingLoans}</b></p>
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">Loans by Status</h3>
          <LoanChart loans={db.loans} />
        </Card>
        <Card>
          <h3 className="mb-3 font-bold text-slate-900">Deposits per Member</h3>
          <SavingsChart members={db.members} />
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/sacco-admin/members/register"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Register a Member
        </Link>
        <Link
          href="/sacco-admin/loan-products"
          className="rounded border border-slate-400 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Loan Products
        </Link>
      </div>
    </div>
  );
}
