"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { fmtDate, fmtKES } from "@/lib/store";
import type { Txn } from "@/types/transaction";

interface TransactionsTableProps {
  txns: Txn[];
  /** Hide the member column on member-only screens. */
  showMember?: boolean;
}

/** Transaction list / member statement (FR05). Shows up to 20 rows (NFR02). */
export default function TransactionsTable({ txns, showMember }: TransactionsTableProps) {
  if (txns.length === 0) return <p className="text-sm text-slate-500">No transactions found.</p>;
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            {showMember && <TableCell>Member</TableCell>}
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Channel</TableCell>
          </TableRow>
        </TableHead>
        <tbody>
          {txns.slice(0, 20).map((t) => (
            <TableRow key={t.id}>
              <TableCell className="text-slate-700">{fmtDate(t.date)}</TableCell>
              {showMember && <TableCell className="text-slate-700">{t.memberId}</TableCell>}
              <TableCell className="text-slate-700">{t.type}</TableCell>
              <TableCell className="font-medium text-slate-800">{fmtKES(t.amountCents)}</TableCell>
              <TableCell className="text-slate-600">{t.note}</TableCell>
              <TableCell className="text-slate-600">{t.channel}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <p className="mt-2 text-xs text-slate-500">Showing up to 20 rows (NFR02).</p>
    </>
  );
}
