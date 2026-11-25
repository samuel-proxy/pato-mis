"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateLoanProductPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="p-6 md:p-10 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Create Loan Product</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Add a new loan product across all SACCOs.
      </p>

      {submitted ? (
        <div className="rounded border border-green-300 bg-green-50 p-4">
          <p className="font-medium text-green-800">Loan product created successfully.</p>
          <Link href="/system-admin/loan-products" className="mt-3 inline-block text-sm text-green-800 hover:underline">
            Back to Loan Products
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
            <input type="text" id="name" name="name" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
          </div>

          <div>
            <label htmlFor="interest" className="block text-sm font-medium text-slate-700">Interest Rate (%)</label>
            <input type="number" id="interest" name="interest" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="min" className="block text-sm font-medium text-slate-700">Min Amount</label>
              <input type="number" id="min" name="min" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
            </div>
            <div>
              <label htmlFor="max" className="block text-sm font-medium text-slate-700">Max Amount</label>
              <input type="number" id="max" name="max" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
            </div>
          </div>

          <div>
            <label htmlFor="term" className="block text-sm font-medium text-slate-700">Term (months)</label>
            <input type="number" id="term" name="term" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
          </div>

          <button type="submit" className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Create Product
          </button>
        </form>
      )}
    </section>
  );
}