"use client";

import { useAuth } from "@/hooks/useAuth";
import { useLoans } from "@/hooks/useLoans";
import Card from "@/components/ui/Card";
import LoansTable from "@/components/tables/LoansTable";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];

/** Disbursements (FR12): approved loans waiting to be paid out, and disbursed loans. */
export default function DisbursementsPage() {
  const { db, ready, msg } = useAuth(ROLES);
  const { disburse } = useLoans();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const approved = db.loans.filter((l) => l.status === "Approved");
  const disbursed = db.loans.filter((l) => l.status === "Disbursed" || l.status === "Repaid");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Disbursements</h1>
        <p className="mt-1 text-sm text-slate-500">
          Disburse approved loans. Disbursement records a transaction and sends an SMS
          confirmation to the member.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Approved — Awaiting Disbursement</h3>
        <LoansTable
          loans={approved}
          products={db.products}
          showMember
          actions={(loan) => (
            <button
              type="button"
              onClick={() => disburse(loan.id)}
              className="rounded bg-blue-900 px-3 py-1 text-sm font-medium text-white hover:bg-blue-800"
            >
              Disburse
            </button>
          )}
        />
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Disbursed Loans</h3>
        <LoansTable loans={disbursed} products={db.products} showMember />
      </Card>
    </div>
  );
}
