"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { ROLE_LABEL } from "@/lib/constants";
import * as userService from "@/services/userService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** Users (FR21, FR22, FR23): list, change role, deactivate. */
export default function UsersPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">
            {db.users.length} user account(s). Only the system administrator manages users and roles.
          </p>
        </div>
        <Link
          href="/system-admin/users/create"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Create User
        </Link>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {db.users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium text-slate-800">
                  <Link href={`/system-admin/users/${u.id}`} className="hover:underline">
                    {u.username}
                  </Link>
                </TableCell>
                <TableCell className="text-slate-700">{u.name}</TableCell>
                <TableCell>
                  <select
                    className="rounded border px-2 py-1 text-sm"
                    value={u.role}
                    onChange={(e) =>
                      run((d) =>
                        userService.updateRole(d, u.id, e.target.value as Role, user.username)
                      )
                    }
                  >
                    <option value="member">Member</option>
                    <option value="officer">Credit Officer</option>
                    <option value="sacco_admin">Sacco Admin</option>
                    <option value="sysadmin">System Admin</option>
                  </select>
                </TableCell>
                <TableCell>
                  <Badge variant={u.active ? "success" : "danger"}>
                    {u.active ? "Active" : "Deactivated"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => run((d) => userService.toggleActive(d, u.id, user.username))}
                    className="rounded border border-red-600 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                  >
                    {u.active ? "Deactivate" : "Reactivate"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
