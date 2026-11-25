"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const logs = [
  { id: "LOG-001", timestamp: "10 Nov 2026 14:30", user: "admin@sacco.com", action: "Created user", resource: "users", ip: "10.0.0.1" },
  { id: "LOG-002", timestamp: "09 Nov 2026 09:15", user: "admin@sacco.com", action: "Updated policy", resource: "policies", ip: "10.0.0.1" },
  { id: "LOG-003", timestamp: "08 Nov 2026 06:00", user: "system", action: "Backup completed", resource: "backups", ip: "127.0.0.1" },
  { id: "LOG-004", timestamp: "07 Nov 2026 18:45", user: "officer@sacco.com", action: "Approved loan", resource: "loans/L-001", ip: "10.0.0.2" },
];

export default function AuditLogsPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
        <p className="mt-1 text-sm text-slate-500">View all system activity logs.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Log ID</TableCell>
            <TableCell>Timestamp</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Resource</TableCell>
            <TableCell>IP Address</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium text-slate-800">{log.id}</TableCell>
              <TableCell className="text-slate-600">{log.timestamp}</TableCell>
              <TableCell className="text-slate-700">{log.user}</TableCell>
              <TableCell className="text-slate-600">{log.action}</TableCell>
              <TableCell className="text-slate-600">{log.resource}</TableCell>
              <TableCell className="text-slate-500">{log.ip}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
