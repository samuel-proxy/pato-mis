"use client";

import { useState } from "react";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const withdrawals = [
  { id: 1, date: "10 Nov 2026", amount: 3000, method: "M-Pesa", status: "Completed" },
  { id: 2, date: "01 Oct 2026", amount: 5000, method: "Bank Transfer", status: "Completed" },
];

export default function WithdrawalsPage() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Withdrawals</h1>
        <p className="mt-1 text-sm text-slate-500">
          Request a withdrawal from your savings account.
        </p>
      </div>

      <div className="max-w-lg space-y-5">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
              Amount (KSh)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-slate-700">
              Payment Method
            </label>
            <select
              id="method"
              name="method"
              required
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900"
            >
              <option value="">Select method</option>
              <option value="m-pesa">M-Pesa</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
          >
            Request Withdrawal
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Withdrawal History</h2>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {withdrawals.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-slate-600">{item.date}</TableCell>
                <TableCell className="font-medium text-slate-900">
                  KSh {item.amount.toLocaleString("en-KE")}
                </TableCell>
                <TableCell className="text-slate-700">{item.method}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    {item.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
