"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import LoansTable from "@/components/tables/LoansTable";
import TransactionsTable from "@/components/tables/TransactionsTable";
import { fmtKES, outstandingLoans } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];

/** Membership file (FR08): details, loans and transactions for one member. */
export default function SaccoAdminMemberDetailPage() {
  const { db, ready } = useAuth(ROLES);
  const params = useParams();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const m = db.members.find((x) => x.id === params.id);
  if (!m) return <p className="text-sm text-slate-500">Member not found.</p>;

  const loans = db.loans.filter((l) => l.memberId === m.id);
  const txns = db.txns.filter((t) => t.memberId === m.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Membership file — {m.name} ({m.id})
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          National ID: {m.nationalId} {m.idVerified ? "(verified)" : "(not verified)"} • Phone:{" "}
          {m.phone} • Email: {m.email} • Joined: {m.joined}
        </p>
      </div>

      <Card>
        <div className="grid gap-2 text-sm sm:grid-cols-3">
          <p>Deposits: <b>{fmtKES(m.depositsCents)}</b></p>
          <p>Savings: <b>{fmtKES(m.savingsCents)}</b></p>
          <p>Outstanding loans: <b>{fmtKES(outstandingLoans(db, m.id))}</b></p>
          <p>
            Status:{" "}
            {m.inArrears ? (
              <b className="text-red-600">In arrears</b>
            ) : (
              <b className="text-green-700">Good standing</b>
            )}
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Loans</h3>
        <LoansTable loans={loans} products={db.products} />
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Transactions</h3>
        <TransactionsTable txns={txns} />
      </Card>
    </div>
  );
}
