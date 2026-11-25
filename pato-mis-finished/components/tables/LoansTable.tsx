"use client";

import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { fmtKES } from "@/lib/store";
import { statusVariant } from "@/lib/utils";
import type { Loan, LoanProduct } from "@/types/loan";

interface LoansTableProps {
  loans: Loan[];
  products: LoanProduct[];
  showMember?: boolean;
  /** Optional per-row actions (Approve / Reject / Disburse / Schedule). */
  actions?: (loan: Loan) => React.ReactNode;
}

/** Loans table, used by member, officer and admin screens. */
export default function LoansTable({ loans, products, showMember, actions }: LoansTableProps) {
  if (loans.length === 0) return <p className="text-sm text-slate-500">No loans found.</p>;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Loan</TableCell>
          {showMember && <TableCell>Member</TableCell>}
          <TableCell>Product</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Monthly</TableCell>
          <TableCell>Outstanding</TableCell>
          <TableCell>Status</TableCell>
          {actions && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <tbody>
        {loans.map((l) => {
          const p = products.find((x) => x.id === l.productId);
          return (
            <TableRow key={l.id}>
              <TableCell className="font-medium text-slate-800">
                <Link href={`/sacco-member/loans/${l.id}`} className="hover:underline">
                  {l.id}
                </Link>
              </TableCell>
              {showMember && <TableCell className="text-slate-700">{l.memberId}</TableCell>}
              <TableCell className="text-slate-700">{p?.name ?? l.productId}</TableCell>
              <TableCell className="text-slate-700">{fmtKES(l.amountCents)}</TableCell>
              <TableCell className="text-slate-700">{fmtKES(l.monthlyCents)}</TableCell>
              <TableCell className="text-slate-700">{fmtKES(l.amountCents - l.repaidCents)}</TableCell>
              <TableCell>
                <Badge variant={statusVariant(l.status)}>{l.status}</Badge>
              </TableCell>
              {actions && <TableCell>{actions(l)}</TableCell>}
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  );
}
