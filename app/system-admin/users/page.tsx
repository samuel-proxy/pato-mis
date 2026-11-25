"use client";

import Link from "next/link";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const users = [
  { id: "USR-001", name: "Jane Admin", email: "jane@patosacco.co.ke", role: "SACCO Admin", status: "Active" },
  { id: "USR-002", name: "John Officer", email: "john@patosacco.co.ke", role: "Credit Officer", status: "Active" },
  { id: "USR-003", name: "Mary Member", email: "mary@patosacco.co.ke", role: "Member", status: "Suspended" },
];

export default function UsersPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage platform users and their access.</p>
        </div>

        <Link href="/system-admin/users/create" className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
          Add User
        </Link>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium text-slate-800">{user.id}</TableCell>
              <TableCell className="text-slate-700">{user.name}</TableCell>
              <TableCell className="text-slate-600">{user.email}</TableCell>
              <TableCell className="text-slate-700">{user.role}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <Link href={`/system-admin/users/${user.id}`} className="text-sm text-blue-900 hover:underline">
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
