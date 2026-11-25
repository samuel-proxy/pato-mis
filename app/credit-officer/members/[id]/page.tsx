"use client";

import { useParams } from "next/navigation";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

export default function CreditOfficerMemberDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const member = {
    id: id,
    name: "John Mwangi",
    email: "john.mwangi@example.com",
    phone: "+254 700 123456",
    savings: 25000,
    loans: [
      { id: "L-001", amount: 15000, balance: 9000, status: "Active" },
    ],
  };

  return (
    <section className="p-6 md:p-10 max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{member.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Member {member.id}</p>
      </div>

      <div className="border border-slate-300 rounded p-4">
        <div className="space-y-3 text-sm">
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-900">{member.email}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Phone</span>
            <span className="font-medium text-slate-900">{member.phone}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Total Savings</span>
            <span className="font-medium text-slate-900">KSh {member.savings.toLocaleString("en-KE")}</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Active Loans</h2>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Loan ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {member.loans.map((loan) => (
              <TableRow key={loan.id}>
                <TableCell className="font-medium text-slate-800">{loan.id}</TableCell>
                <TableCell>KSh {loan.amount.toLocaleString("en-KE")}</TableCell>
                <TableCell className="font-semibold text-slate-900">KSh {loan.balance.toLocaleString("en-KE")}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs ${loan.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                    {loan.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}