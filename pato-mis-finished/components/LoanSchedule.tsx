"use client";

import { fmtKES, repaymentSchedule } from "@/lib/store";
import type { Loan } from "@/types/loan";

/** Reducing-balance repayment schedule for a loan (FR11). */
export default function LoanSchedule({ loan }: { loan: Loan }) {
  const rows = repaymentSchedule(loan.amountCents, loan.ratePa, loan.termMonths);
  return (
    <div>
      <p className="text-sm text-slate-700">
        {loan.id} — {fmtKES(loan.amountCents)}, {loan.termMonths} months, {loan.ratePa}% p.a.
        Monthly: <b>{fmtKES(loan.monthlyCents)}</b> • Total interest:{" "}
        <b>{fmtKES(loan.totalInterestCents)}</b> • Total to repay:{" "}
        <b>{fmtKES(loan.monthlyCents * loan.termMonths)}</b>
      </p>
      <div className="mt-3 max-h-80 overflow-y-auto overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-200 text-left text-slate-900">
            <tr>
              <th className="px-3 py-2">Month</th>
              <th className="px-3 py-2">Payment</th>
              <th className="px-3 py-2">Principal</th>
              <th className="px-3 py-2">Interest</th>
              <th className="px-3 py-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.month} className="border-t border-slate-200">
                <td className="px-3 py-2">{r.month}</td>
                <td className="px-3 py-2">{fmtKES(r.paymentCents)}</td>
                <td className="px-3 py-2">{fmtKES(r.principalCents)}</td>
                <td className="px-3 py-2">{fmtKES(r.interestCents)}</td>
                <td className="px-3 py-2">{fmtKES(r.balanceCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
