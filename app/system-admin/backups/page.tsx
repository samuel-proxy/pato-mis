"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const backups = [
  { id: "BKP-001", date: "10 Nov 2026", size: "2.4 MB", status: "Completed" },
  { id: "BKP-002", date: "09 Nov 2026", size: "2.3 MB", status: "Completed" },
  { id: "BKP-003", date: "08 Nov 2026", size: "0 MB", status: "Failed" },
];

export default function BackupsPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backups</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage system backups.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Backup ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {backups.map((backup) => (
            <TableRow key={backup.id}>
              <TableCell className="font-medium text-slate-800">{backup.id}</TableCell>
              <TableCell className="text-slate-700">{backup.date}</TableCell>
              <TableCell className="text-slate-600">{backup.size}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${backup.status === "Completed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {backup.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
