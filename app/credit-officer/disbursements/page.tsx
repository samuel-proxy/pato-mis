"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const disbursements = [
  { id: "DIS-001", loan: "L-001", member: "John Mwangi", amount: 15000, date: "12 Oct 2026", status: "Completed" },
  { id: "DIS-002", loan: "L-002", member: "Mary Wanjiru", amount: 8000, date: "20 Oct 2026", status: "Pending" },
];

export default function DisbursementsPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Disbursements</h1>
        <p className="mt-1 text-sm text-slate-500">Track loan disbursement payments to members.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Disbursement ID</TableCell>
            <TableCell>Loan</TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {disbursements.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-800">{item.id}</TableCell>
              <TableCell className="text-slate-700">{item.loan}</TableCell>
              <TableCell className="text-slate-600">{item.member}</TableCell>
              <TableCell>KSh {item.amount.toLocaleString("en-KE")}</TableCell>
              <TableCell className="text-slate-600">{item.date}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${item.status === "Completed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {item.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
