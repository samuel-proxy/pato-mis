"use client";

import { useState } from "react";
import Link from "next/link";
import { saveAppliedLoan } from "@/app/sacco-member/loans/appliedLoans";

export default function ApplyLoanPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const purpose = formData.get("purpose");
    const duration = Number(formData.get("duration"));

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      typeof purpose !== "string" ||
      !purpose ||
      !Number.isInteger(duration) ||
      duration <= 0
    ) {
      return;
    }

    saveAppliedLoan({
      id: `L-${Date.now()}`,
      amount,
      purpose,
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Applied",
      balance: 0,
      duration,
    });
    setSubmitted(true);
  }

  return (
    <section className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-slate-900">Apply for a Loan</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Fill in the details below to submit a loan application.
      </p>

      {submitted ? (
        <div className="rounded border border-green-300 bg-green-50 p-4">
          <p className="font-medium text-green-800">
            Your loan application has been submitted.
          </p>
          <p className="mt-1 text-sm text-green-700">
            You can track its status on the Loans page.
          </p>
          <Link
            href="/sacco-member/loans"
            className="mt-3 inline-block text-sm text-green-800 hover:underline"
          >
            Back to Loans
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
              Loan Amount (KSh)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              required
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
              Purpose
            </label>
            <select
              id="purpose"
              name="purpose"
              required
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            >
              <option value="">Select a purpose</option>
              <option value="school-fees">School Fees</option>
              <option value="business">Business Stock</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700">
              Repayment Period (months)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              step="1"
              required
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            ></textarea>
          </div>

          <button
            type="submit"
            className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
          >
            Submit Application
          </button>
        </form>
      )}
    </section>
  );
}