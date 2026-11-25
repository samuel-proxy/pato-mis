"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const systemStats = [
  { label: "Total SACCOs", value: "5" },
  { label: "Active Users", value: "247" },
  { label: "Total Members", value: "1,200" },
  { label: "Platform Health", value: "OK" },
];

const auditLogs = [
  { id: "LOG-001", user: "admin@sacco.com", action: "Created user", resource: "users", date: "10 Nov 2026" },
  { id: "LOG-002", user: "admin@sacco.com", action: "Updated policy", resource: "policies", date: "09 Nov 2026" },
  { id: "LOG-003", user: "system", action: "Backup completed", resource: "backups", date: "08 Nov 2026" },
];

export default function SystemAdminDashboardPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Platform-wide management and monitoring.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {systemStats.map((stat) => (
          <div key={stat.label}>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 font-bold text-slate-900">Recent Audit Logs</h2>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Log ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>

          <tbody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium text-slate-800">{log.id}</TableCell>
                <TableCell className="text-slate-700">{log.user}</TableCell>
                <TableCell className="text-slate-600">{log.action}</TableCell>
                <TableCell className="text-slate-600">{log.resource}</TableCell>
                <TableCell className="text-slate-600">{log.date}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>
    </section>
  );
}
