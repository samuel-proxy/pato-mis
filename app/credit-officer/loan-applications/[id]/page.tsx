"use client";

import { useParams } from "next/navigation";

export default function LoanApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const application = {
    id: id,
    member: "John Mwangi",
    amount: 15000,
    purpose: "School Fees",
    status: "Pending",
    submitted: "10 Nov 2026",
  };

  return (
    <section className="p-6 md:p-10 max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan Application {application.id}</h1>
      </div>

      <div className="border border-slate-300 rounded p-4">
        <div className="space-y-3 text-sm">
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Member</span>
            <span className="font-medium text-slate-900">{application.member}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Amount</span>
            <span className="font-medium text-slate-900">KSh {application.amount.toLocaleString("en-KE")}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Purpose</span>
            <span className="font-medium text-slate-900">{application.purpose}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Status</span>
            <span className={`rounded-full px-2 py-1 text-xs ${application.status === "Approved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
              {application.status}
            </span>
          </p>
          <p className="flex justify-between pb-2">
            <span className="text-slate-500">Submitted</span>
            <span className="font-medium text-slate-900">{application.submitted}</span>
          </p>
        </div>
      </div>
    </section>
  );
}