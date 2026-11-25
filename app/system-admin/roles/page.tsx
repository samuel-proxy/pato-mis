"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const roles = [
  { id: "ROL-001", name: "System Admin", description: "Full system access", users: 3 },
  { id: "ROL-002", name: "SACCO Admin", description: "Manage members and loans", users: 8 },
  { id: "ROL-003", name: "Credit Officer", description: "Process loan applications", users: 12 },
  { id: "ROL-004", name: "Member", description: "Standard member access", users: 250 },
];

export default function RolesPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
        <p className="mt-1 text-sm text-slate-500">Manage user roles and permissions.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Role ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Users</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium text-slate-800">{role.id}</TableCell>
              <TableCell className="text-slate-700">{role.name}</TableCell>
              <TableCell className="text-slate-600">{role.description}</TableCell>
              <TableCell className="text-slate-600">{role.users}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
