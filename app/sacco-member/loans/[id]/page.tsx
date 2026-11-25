"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";

const loan = {
  id: "L-001",
  amount: 15000,
  purpose: "School Fees",
  date: "10 Oct 2026",
  status: "Approved",
  balance: 9000,
  duration: 12,
};

const repayments = [
  { id: 1, date: "10 Nov 2026", amount: 1500, method: "M-Pesa" },
  { id: 2, date: "10 Oct 2026", amount: 1500, method: "M-Pesa" },
  { id: 3, date: "10 Sep 2026", amount: 1500, method: "Cash" },
];

export default function LoanDetailPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <Link href="/sacco-member/loans" className="text-sm text-slate-600 hover:underline">
          Back to Loans
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Loan {loan.id}</h1>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Loan Details</h2>

        <div className="max-w-md space-y-2 text-sm">
          <p className="flex justify-between">
            <span className="text-slate-500">Amount</span>
            <span className="font-medium text-slate-900">KSh {loan.amount.toLocaleString("en-KE")}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Purpose</span>
            <span className="font-medium text-slate-900">{loan.purpose}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Date Issued</span>
            <span className="font-medium text-slate-900">{loan.date}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Duration</span>
            <span className="font-medium text-slate-900">{loan.duration} months</span>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Status</span>
            <Badge variant="success">{loan.status}</Badge>
          </p>
          <p className="flex justify-between">
            <span className="text-slate-500">Outstanding Balance</span>
            <span className="font-medium text-slate-900">KSh {loan.balance.toLocaleString("en-KE")}</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Repayment History</h2>

        <div className="max-w-md">
          {repayments.map((item) => (
            <div key={item.id} className="flex justify-between border-b border-slate-200 py-2 text-sm">
              <span className="text-slate-600">{item.date}</span>
              <span className="text-slate-500">{item.method}</span>
              <span className="font-medium text-slate-900">
                KSh {item.amount.toLocaleString("en-KE")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}