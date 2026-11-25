"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { fromCents, toCents } from "@/lib/store";
import * as policyService from "@/services/policyService";
import type { LoanProduct } from "@/types/loan";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Loan product settings (FR19) — same settings the SACCO administrator manages. */
export default function SysAdminLoanProductsPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);
  const [products, setProducts] = useState<LoanProduct[]>([]);

  useEffect(() => {
    if (db) setProducts(JSON.parse(JSON.stringify(db.products)));
  }, [db]);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function save() {
    run((d) => policyService.updateProducts(d, products, actor));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Interest rate, maximum term and ceiling for each loan product.
          </p>
        </div>
        <Link
          href="/system-admin/loan-products/create"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          New Product
        </Link>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        {products.map((p) => (
          <div key={p.id} className="grid gap-3 border-t border-slate-200 py-3 md:grid-cols-4 md:items-end">
            <p className="font-semibold text-slate-900">{p.name}</p>
            <label className="block text-sm">
              <span className="text-slate-600">Interest % p.a.</span>
              <input
                className={`${inp} mt-1`}
                type="number"
                step="0.5"
                value={p.ratePa}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((x) => (x.id === p.id ? { ...x, ratePa: Number(e.target.value) } : x))
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Max months</span>
              <input
                className={`${inp} mt-1`}
                type="number"
                value={p.maxMonths}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((x) => (x.id === p.id ? { ...x, maxMonths: Number(e.target.value) } : x))
                  )
                }
              />
            </label>
            <label className="block text-sm">
              <span className="text-slate-600">Ceiling (KES)</span>
              <input
                className={`${inp} mt-1`}
                type="number"
                value={fromCents(p.ceilingCents)}
                onChange={(e) =>
                  setProducts((prev) =>
                    prev.map((x) =>
                      x.id === p.id ? { ...x, ceilingCents: toCents(Number(e.target.value) || 0) } : x
                    )
                  )
                }
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={save}
          className="mt-3 rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Save product settings
        </button>
      </Card>
    </div>
  );
}
