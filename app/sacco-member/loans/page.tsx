"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import {
  AppliedLoan,
  getAppliedLoansSnapshot,
  getServerAppliedLoansSnapshot,
  parseAppliedLoans,
  subscribeToAppliedLoans,
} from "./appliedLoans";

type Loan = AppliedLoan | {
  id: string;
  amount: number;
  purpose: string;
  date: string;
  status: "Approved" | "Cleared";
  balance: number;
};

const initialLoans: Loan[] = [
  {
    id: "L-001",
    amount: 15000,
    purpose: "School Fees",
    date: "10 Oct 2026",
    status: "Approved",
    balance: 9000,
  },
  {
    id: "L-002",
    amount: 8000,
    purpose: "Business Stock",
    date: "05 Aug 2026",
    status: "Cleared",
    balance: 0,
  },
];

export default function LoansPage() {
  const appliedLoansSnapshot = useSyncExternalStore(
    subscribeToAppliedLoans,
    getAppliedLoansSnapshot,
    getServerAppliedLoansSnapshot,
  );
  const loans = useMemo<Loan[]>(
    () => [...initialLoans, ...parseAppliedLoans(appliedLoansSnapshot)],
    [appliedLoansSnapshot],
  );

  return (
    <section className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Loans</h1>
          <p className="mt-1 text-sm text-slate-500">
            View your loan history and apply for a new loan.
          </p>
        </div>

        <Link
          href="/sacco-member/loans/apply"
          className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
        >
          Apply for a Loan
        </Link>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Loan History</h2>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Balance</TableCell>
              </TableRow>
            </TableHead>

            <tbody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium text-slate-800">
                    <Link href={`/sacco-member/loans/${loan.id}`} className="hover:underline">
                      {loan.id}
                    </Link>
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    KSh {loan.amount.toLocaleString("en-KE")}
                  </TableCell>
                  <TableCell className="text-slate-700">{loan.purpose}</TableCell>
                  <TableCell className="text-slate-600">{loan.date}</TableCell>
                  <TableCell>
                    <Badge variant={loan.status === "Approved" ? "success" : "default"}>
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-black">
                    KSh {loan.balance.toLocaleString("en-KE")}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </section>
  );
}
