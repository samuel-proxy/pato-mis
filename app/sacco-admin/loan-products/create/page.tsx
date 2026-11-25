"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import * as policyService from "@/services/policyService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Create a new loan product (FR19). */
export default function CreateLoanProductPage() {
  const { user, ready, msg, run } = useAuth(ROLES);
  const router = useRouter();
  const [name, setName] = useState("");
  const [ratePa, setRatePa] = useState("12");
  const [maxMonths, setMaxMonths] = useState("24");
  const [ceilingKes, setCeilingKes] = useState("500000");

  if (!ready || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function create() {
    const ok = run((d) =>
      policyService.createProduct(
        d,
        { name, ratePa: Number(ratePa) || 0, maxMonths: Number(maxMonths) || 12, ceilingKes: Number(ceilingKes) || 0 },
        actor
      )
    );
    if (ok) router.push("/sacco-admin/loan-products");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Loan Product</h1>
        <p className="mt-1 text-sm text-slate-500">Add a loan product members can apply for.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">Product name</span>
            <input className={`${inp} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Education Loan" />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Interest % p.a.</span>
            <input className={`${inp} mt-1`} type="number" step="0.5" value={ratePa} onChange={(e) => setRatePa(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Max months</span>
            <input className={`${inp} mt-1`} type="number" value={maxMonths} onChange={(e) => setMaxMonths(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Ceiling (KES)</span>
            <input className={`${inp} mt-1`} type="number" value={ceilingKes} onChange={(e) => setCeilingKes(e.target.value)} />
          </label>
        </div>
        <button
          type="button"
          onClick={create}
          className="mt-4 rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Create product
        </button>
      </Card>
    </div>
  );
}
