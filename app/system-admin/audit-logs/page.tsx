"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { fmtDate } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** Audit log (FR25): append-only, no delete. Every login, decision, repayment, registration and user change is recorded. */
export default function AuditLogsPage() {
  const { db, ready } = useAuth(ROLES);
  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-500">
          View all system activity logs. Entries cannot be edited or deleted.
        </p>
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Log ID</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actor</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Detail</TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {db.audit.slice(0, 50).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-slate-800">{a.id}</TableCell>
                <TableCell className="text-slate-600">{fmtDate(a.date)}</TableCell>
                <TableCell className="text-slate-700">{a.actor}</TableCell>
                <TableCell className="text-slate-600">{a.action}</TableCell>
                <TableCell className="text-slate-600">{a.detail}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {db.audit.length === 0 && <p className="mt-3 text-sm text-slate-500">No audit entries yet.</p>}
      </Card>
    </div>
  );
}
