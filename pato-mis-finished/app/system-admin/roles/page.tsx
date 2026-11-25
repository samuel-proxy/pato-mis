"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { ROLE_PERMISSIONS } from "@/lib/permissions";
import { ROLE_LABEL } from "@/lib/constants";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** Roles and their permissions (FR22). User counts come from the live store. */
export default function RolesPage() {
  const { db, ready } = useAuth(ROLES);
  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage user roles and permissions. Roles are assigned on the Users page.
        </p>
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Permissions</TableCell>
              <TableCell>Users</TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {ROLE_PERMISSIONS.map((r) => (
              <TableRow key={r.role}>
                <TableCell className="font-medium text-slate-800">{ROLE_LABEL[r.role]}</TableCell>
                <TableCell className="text-slate-600">{r.description}</TableCell>
                <TableCell className="text-slate-600">{r.actions.join("; ")}</TableCell>
                <TableCell className="text-slate-600">
                  {db.users.filter((u) => u.role === r.role).length}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
