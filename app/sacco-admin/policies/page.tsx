"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const policies = [
  { id: "POL-001", title: "Loan Eligibility Criteria", type: "Loan Policy", status: "Active", lastUpdated: "10 Oct 2026" },
  { id: "POL-002", title: "Savings Interest Rate", type: "Savings Policy", status: "Active", lastUpdated: "05 Sep 2026" },
  { id: "POL-003", title: "Withdrawal Fees", type: "Transaction Policy", status: "Suspended", lastUpdated: "12 Aug 2026" },
];

export default function PoliciesPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Policies</h1>
        <p className="mt-1 text-sm text-slate-500">Manage SACCO policies and regulations.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Policy ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Last Updated</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {policies.map((policy) => (
            <TableRow key={policy.id}>
              <TableCell className="font-medium text-slate-800">{policy.id}</TableCell>
              <TableCell className="text-slate-700">{policy.title}</TableCell>
              <TableCell className="text-slate-600">{policy.type}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${policy.status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {policy.status}
                </span>
              </TableCell>
              <TableCell className="text-slate-600">{policy.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
