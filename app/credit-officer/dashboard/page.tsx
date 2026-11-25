"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const loanApplications = [
  { id: "LA-001", member: "John Mwangi", amount: 15000, status: "Pending", submitted: "10 Nov 2026" },
  { id: "LA-002", member: "Mary Wanjiru", amount: 8000, status: "Approved", submitted: "05 Nov 2026" },
  { id: "LA-003", member: "Peter Otieno", amount: 12000, status: "Processing", submitted: "28 Oct 2026" },
];

export default function CreditOfficerDashboardPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Credit Officer Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage loan applications and member loans.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="text-sm font-medium text-slate-500">Pending Applications</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{loanApplications.filter(a => a.status === "Pending").length}</h2>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Approved</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{loanApplications.filter(a => a.status === "Approved").length}</h2>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">Processing</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{loanApplications.filter(a => a.status === "Processing").length}</h2>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Application ID</TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Submitted</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {loanApplications.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="font-medium text-slate-800">{app.id}</TableCell>
              <TableCell className="text-slate-700">{app.member}</TableCell>
              <TableCell>KSh {app.amount.toLocaleString("en-KE")}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${app.status === "Pending" ? "bg-orange-100 text-orange-800" : app.status === "Approved" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                  {app.status}
                </span>
              </TableCell>
              <TableCell className="text-slate-600">{app.submitted}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
