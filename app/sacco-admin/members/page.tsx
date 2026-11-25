"use client";

import Link from "next/link";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const members = [
  { id: "PATO-001", name: "John Mwangi", phone: "+254 700 123456", status: "Approved", joined: "15 Jan 2024" },
  { id: "PATO-002", name: "Mary Wanjiru", phone: "+254 711 223344", status: "Approved", joined: "02 Nov 2026" },
  { id: "PATO-003", name: "Peter Otieno", phone: "+254 722 334455", status: "Pending", joined: "28 Oct 2026" },
  { id: "PATO-004", name: "Ann Wambui", phone: "+254 733 445566", status: "Approved", joined: "15 Oct 2026" },
];

export default function MembersPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="mt-1 text-sm text-slate-500">
            View and manage all registered members.
          </p>
        </div>

        <Link
          href="/sacco-admin/members/register"
          className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800"
        >
          Register Member
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Member ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Joined</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium text-slate-800">{member.id}</TableCell>
              <TableCell className="text-slate-700">{member.name}</TableCell>
              <TableCell className="text-slate-600">{member.phone}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${member.status === "Approved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {member.status}
                </span>
              </TableCell>
              <TableCell className="text-slate-600">{member.joined}</TableCell>
              <TableCell>
                <Link href={`/sacco-admin/members/${member.id}`} className="text-sm text-blue-900 hover:underline">
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
