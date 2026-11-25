"use client";

import { useState } from "react";
import { fmtKES } from "@/lib/store";

const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

interface WithdrawalFormProps {
  savingsCents: number;
  limitCents: number;
  withdrawalPct: number;
  withdrawalCapCents: number;
  onSubmit: (amountKes: number) => boolean;
}

/** Withdrawal request form (FR06). Shows the member's limit before submit. */
export default function WithdrawalForm({
  savingsCents,
  limitCents,
  withdrawalPct,
  withdrawalCapCents,
  onSubmit,
}: WithdrawalFormProps) {
  const [amountKes, setAmountKes] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        Limit: {withdrawalPct}% of savings, capped at {fmtKES(withdrawalCapCents)}. Your limit now:{" "}
        <b>{fmtKES(limitCents)}</b>. Savings balance: <b>{fmtKES(savingsCents)}</b>.
      </p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="block text-sm">
          <span className="text-slate-600">Amount (KES)</span>
          <input
            className={`${inp} mt-1`}
            type="number"
            value={amountKes}
            onChange={(e) => setAmountKes(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          onClick={() => {
            const ok = onSubmit(Number(amountKes) || 0);
            if (ok) setAmountKes("");
          }}
        >
          Submit request
        </button>
      </div>
    </div>
  );
}
