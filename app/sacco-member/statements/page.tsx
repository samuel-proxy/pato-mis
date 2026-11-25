"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import TransactionsTable from "@/components/tables/TransactionsTable";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];

/** Member statement (FR05): transactions, newest first, up to 20 rows. */
export default function StatementsPage() {
  const { db, user, ready } = useAuth(ROLES);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const myTxns = db.txns.filter((t) => t.memberId === user.memberId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Statements</h1>
        <p className="mt-1 text-sm text-slate-500">
          A record of your savings, loans and repayments. Balances are derived from transactions
          and member records.
        </p>
      </div>
      <Card>
        <TransactionsTable txns={myTxns} />
      </Card>
    </div>
  );
}
