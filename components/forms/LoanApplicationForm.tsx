"use client";

import { useState } from "react";
import { fmtKES, monthlyPayment } from "@/lib/store";
import type { LoanProduct } from "@/types/loan";

const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

interface LoanApplicationFormProps {
  products: LoanProduct[];
  getEligibility: (productId: string) => { eligibleCents: number; reason: string };
  onSubmit: (input: {
    productId: string;
    amountKes: number;
    termMonths: number;
    purpose: string;
  }) => boolean;
}

/** Loan application form (FR03). Shows eligibility and the monthly repayment before submit. */
export default function LoanApplicationForm({
  products,
  getEligibility,
  onSubmit,
}: LoanApplicationFormProps) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [amountKes, setAmountKes] = useState("");
  const [termMonths, setTermMonths] = useState("12");
  const [purpose, setPurpose] = useState("");

  const product = products.find((p) => p.id === productId) || products[0];
  const elig = product ? getEligibility(product.id) : { eligibleCents: 0, reason: "" };
  const amountCents = Math.round((Number(amountKes) || 0) * 100);
  const monthly =
    product && amountCents > 0
      ? monthlyPayment(amountCents, product.ratePa, Number(termMonths) || 12)
      : 0;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">Loan product</span>
          <select className={`${inp} mt-1`} value={productId} onChange={(e) => setProductId(e.target.value)}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.ratePa}% p.a., max {p.maxMonths} months, ceiling {fmtKES(p.ceilingCents)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Amount (KES)</span>
          <input
            className={`${inp} mt-1`}
            type="number"
            value={amountKes}
            onChange={(e) => setAmountKes(e.target.value)}
            placeholder="e.g. 50000"
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Term (months)</span>
          <input
            className={`${inp} mt-1`}
            type="number"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Purpose</span>
          <input
            className={`${inp} mt-1`}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Business stock"
          />
        </label>
      </div>

      {product && <p className="text-sm text-slate-700">{elig.reason}</p>}
      {monthly > 0 && (
        <p className="text-sm text-slate-700">
          Monthly repayment: <b>{fmtKES(monthly)}</b> • Total interest:{" "}
          <b>{fmtKES(monthly * (Number(termMonths) || 12) - amountCents)}</b> • Total to repay:{" "}
          <b>{fmtKES(monthly * (Number(termMonths) || 12))}</b>
        </p>
      )}

      <button
        type="button"
        className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        onClick={() => {
          const ok = onSubmit({
            productId,
            amountKes: Number(amountKes) || 0,
            termMonths: Number(termMonths) || 12,
            purpose,
          });
          if (ok) {
            setAmountKes("");
            setPurpose("");
          }
        }}
      >
        Submit application
      </button>
    </div>
  );
}
