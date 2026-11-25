"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const recentMembers = [
  { id: "PATO-002", name: "Mary Wanjiru", status: "Approved", joined: "02 Nov 2026" },
  { id: "PATO-003", name: "Peter Otieno", status: "Pending", joined: "28 Oct 2026" },
  { id: "PATO-004", name: "Ann Wambui", status: "Approved", joined: "15 Oct 2026" },
];

export default function AdminDashboardPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your SACCO management activities.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Total Members</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">12</h2>
          <p className="mt-1 text-xs text-slate-400">Registered members</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Pending Registrations</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">1</h2>
          <p className="mt-1 text-xs text-slate-400">Awaiting approval</p>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Active Loans</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">3</h2>
          <p className="mt-1 text-xs text-slate-400">Pending disbursement</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Recent Member Registrations</h2>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {recentMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium text-slate-800">{member.id}</TableCell>
                <TableCell className="text-slate-700">{member.name}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-1 text-xs ${member.status === "Approved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                    {member.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{member.joined}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
