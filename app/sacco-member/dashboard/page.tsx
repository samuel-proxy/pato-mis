"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import TransactionsTable from "@/components/tables/TransactionsTable";
import SavingsChart from "@/components/charts/SavingsChart";
import { fmtKES, outstandingLoans } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];

/** Member dashboard (FR02 balances, FR03 eligibility). */
export default function MemberDashboard() {
  const { db, user, ready } = useAuth(ROLES);
  const { myLoans, eligibility } = useLoans();

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const me = db.members.find((m) => m.id === user.memberId);
  if (!me) return <p className="text-sm text-slate-500">No member record found for this account.</p>;

  const product = db.products[0];
  const elig = product ? eligibility(product.id) : { eligibleCents: 0, reason: "" };
  const outstanding = outstandingLoans(db, me.id);
  const myTxns = db.txns.filter((t) => t.memberId === me.id);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Overview</h2>
        <p className="mb-4 text-sm text-slate-500">Here is a summary of your SACCO activities.</p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Savings</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(me.savingsCents)}</h3>
            <p className="mt-1 text-xs text-slate-400">Accumulated contributions</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Deposits</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(me.depositsCents)}</h3>
            <p className="mt-1 text-xs text-slate-400">Deposits drive loan eligibility</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(outstanding)}</h3>
            <p className="mt-1 text-xs text-slate-400">Remaining loan balance</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Max You Can Borrow</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(elig.eligibleCents)}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {me.inArrears ? "In arrears — no new loan" : "Deposits x 3 less outstanding loans"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">My Loan Eligibility</h3>
          <p className="text-sm text-slate-700">{elig.reason}</p>
          <p className="mt-2 text-sm text-slate-700">
            Status:{" "}
            {me.inArrears ? (
              <span className="font-semibold text-red-600">In arrears</span>
            ) : (
              <span className="font-semibold text-green-700">Good standing</span>
            )}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Rule: deposits x {db.settings.depositMultiplier}, minus outstanding loans, capped at
            product ceiling. No new loan while in arrears.
          </p>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Loan Products</h3>
          {db.products.map((p) => (
            <p key={p.id} className="mb-1 text-sm text-slate-700">
              <b>{p.name}</b> — {p.ratePa}% p.a., max {p.maxMonths} months, ceiling{" "}
              {fmtKES(p.ceilingCents)}
            </p>
          ))}
        </Card>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-bold text-slate-900">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/sacco-member/loans/apply"
            className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm transition hover:border-blue-300 hover:bg-slate-50"
          >
            <span className="font-semibold">Apply for a Loan</span>
            <p className="mt-1 text-xs text-slate-400">Submit a new loan application.</p>
          </Link>
          <Link
            href="/sacco-member/savings"
            className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm transition hover:border-blue-300 hover:bg-slate-50"
          >
            <span className="font-semibold text-green-600">View Savings</span>
            <p className="mt-1 text-xs text-slate-400">Check your savings contributions.</p>
          </Link>
          <Link
            href="/sacco-member/statements"
            className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm transition hover:border-blue-300 hover:bg-slate-50"
          >
            <span className="font-semibold text-green-600">View Statements</span>
            <p className="mt-1 text-xs text-slate-400">Review your financial records.</p>
          </Link>
        </div>
      </div>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">My Deposits</h3>
        <SavingsChart members={[me]} />
      </Card>

      <div>
        <h3 className="mb-3 font-bold text-slate-900">Recent Transactions</h3>
        <p className="mb-3 text-xs text-slate-500">
          A record of your recent savings and loan activities. ({myLoans.length} loan(s) on record.)
        </p>
        <TransactionsTable txns={myTxns} />
      </div>
    </div>
  );
}
