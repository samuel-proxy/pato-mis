"use client";

import Link from "next/link";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const members = [
  { id: "PATO-001", name: "John Mwangi", loans: 1, balance: 9000 },
  { id: "PATO-002", name: "Mary Wanjiru", loans: 1, balance: 7200 },
  { id: "PATO-003", name: "Peter Otieno", loans: 0, balance: 0 },
];

export default function CreditOfficerMembersPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <p className="mt-1 text-sm text-slate-500">View member loan summaries.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Member ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Active Loans</TableCell>
            <TableCell>Outstanding Balance</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium text-slate-800">{member.id}</TableCell>
              <TableCell className="text-slate-700">{member.name}</TableCell>
              <TableCell className="text-slate-600">{member.loans}</TableCell>
              <TableCell className="font-semibold text-slate-900">KSh {member.balance.toLocaleString("en-KE")}</TableCell>
              <TableCell>
                <Link href={`/credit-officer/members/${member.id}`} className="text-sm text-blue-900 hover:underline">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
