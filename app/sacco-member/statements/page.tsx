"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const transactions = [
  { id: 1, date: "15 Nov 2026", type: "Savings", description: "Monthly Contribution", amount: 2000 },
  { id: 2, date: "10 Nov 2026", type: "Repayment", description: "Loan Repayment L-001", amount: -1500 },
  { id: 3, date: "01 Nov 2026", type: "Savings", description: "Monthly Contribution", amount: 2000 },
  { id: 4, date: "20 Oct 2026", type: "Withdrawal", description: "Emergency Withdrawal", amount: -3000 },
  { id: 5, date: "15 Oct 2026", type: "Savings", description: "Monthly Contribution", amount: 1500 },
];

export default function StatementsPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Statements</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review your complete financial history.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
        <div>
          <h2 className="font-bold text-slate-900">Transaction History</h2>
          <p className="mt-1 text-xs text-slate-500">All deposits, withdrawals, and loan activities.</p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded border border-slate-400 px-3 py-1 text-sm text-slate-800 hover:bg-slate-100"
        >
          Print Statement
        </button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {transactions.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-slate-600">{item.date}</TableCell>
              <TableCell>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-800">
                  {item.type}
                </span>
              </TableCell>
              <TableCell className="text-slate-700">{item.description}</TableCell>
              <TableCell className={`font-medium ${item.amount > 0 ? "text-green-800" : "text-red-800"}`}>
                {item.amount > 0 ? "+" : "-"} KSh {Math.abs(item.amount).toLocaleString("en-KE")}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <p className="mt-3 text-sm text-slate-500">
        Showing {transactions.length} transactions
      </p>
    </section>
  );
}
