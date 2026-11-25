"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const contributions = [
  { id: 1, date: "15 Nov 2026", reference: "SAV-001", description: "Monthly Contribution", amount: 2000, status: "Confirmed" },
  { id: 2, date: "01 Nov 2026", reference: "SAV-002", description: "Monthly Contribution", amount: 2000, status: "Confirmed" },
  { id: 3, date: "15 Oct 2026", reference: "SAV-003", description: "Monthly Contribution", amount: 1500, status: "Confirmed" },
  { id: 4, date: "01 Oct 2026", reference: "SAV-004", description: "Monthly Contribution", amount: 2000, status: "Confirmed" },
  { id: 5, date: "15 Sep 2026", reference: "SAV-005", description: "Monthly Contribution", amount: 1500, status: "Confirmed" },
];

export default function SavingsPage() {
  const totalSavings = contributions.reduce((total, item) => total + item.amount, 0);

  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Savings</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your savings balance and contribution history.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Total Savings</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            KSh {totalSavings.toLocaleString("en-KE")}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Accumulated contributions</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Total Contributions</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{contributions.length}</h2>
          <p className="mt-1 text-xs text-slate-400">Confirmed transactions</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Latest Contribution</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">KSh 2,000</h2>
          <p className="mt-1 text-xs text-slate-400">15 November 2026</p>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-3">
          <div>
            <h2 className="font-bold text-slate-900">Contribution History</h2>
            <p className="mt-1 text-xs text-slate-500">A record of your savings contributions.</p>
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
              <TableCell>Reference</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {contributions.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-slate-600">{item.date}</TableCell>
                <TableCell className="font-medium text-slate-800">{item.reference}</TableCell>
                <TableCell className="text-slate-700">{item.description}</TableCell>
                <TableCell className="font-semibold text-slate-900">
                  KSh {item.amount.toLocaleString("en-KE")}
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>

        <p className="mt-3 text-sm text-slate-500">
          Showing {contributions.length} contributions
        </p>
      </div>
    </section>
  );
}
