"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const transactions = [
  {
    id: 1,
    description: "Monthly Savings Contribution",
    date: "15 Nov 2026",
    amount: "+ KSh 2,000",
    type: "Savings",
  },
  {
    id: 2,
    description: "Loan Repayment",
    date: "10 Nov 2026",
    amount: "- KSh 1,500",
    type: "Repayment",
  },
  {
    id: 3,
    description: "Monthly Savings Contribution",
    date: "01 Nov 2026",
    amount: "+ KSh 2,000",
    type: "Savings",
  },
];

export default function MemberDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Overview</h2>
        <p className="mb-4 text-sm text-slate-500">
          Here is a summary of your SACCO activities.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Savings</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">KSh 25,000</h3>
            <p className="mt-1 text-xs text-slate-400">Accumulated contributions</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Loan</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">KSh 15,000</h3>
            <p className="mt-1 text-xs text-slate-400">Approved loan amount</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Outstanding Balance</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">KSh 9,000</h3>
            <p className="mt-1 text-xs text-slate-400">Remaining loan balance</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-lg font-bold text-slate-900">Quick Actions</h3>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/sacco-member/loans"
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

      <div>
        <h3 className="mb-3 font-bold text-slate-900">Recent Transactions</h3>

        <p className="text-xs text-slate-500 mb-3">
          A record of your recent savings and loan activities.
        </p>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>

            <tbody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium text-slate-800">
                    {transaction.description}
                  </TableCell>

                  <TableCell className="text-slate-500">{transaction.date}</TableCell>

                  <TableCell>
                    <Badge variant="default">{transaction.type}</Badge>
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        transaction.amount.startsWith("+")
                          ? "font-semibold text-green-700"
                          : "font-semibold text-slate-600"
                      }
                    >
                      {transaction.amount}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}