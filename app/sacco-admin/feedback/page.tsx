"use client";

import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";

const feedback = [
  { id: "FB-001", member: "John Mwangi", subject: "Loan Processing Speed", message: "The loan approval process was very fast and convenient. Thank you.", status: "Reviewed", date: "10 Nov 2026" },
  { id: "FB-002", member: "Mary Wanjiru", subject: "Mobile App Issue", message: "I am unable to view my statements on the mobile app. Please assist.", status: "Open", date: "08 Nov 2026" },
  { id: "FB-003", member: "Peter Otieno", subject: "Savings Interest", message: "Can you provide more information on the savings interest rate?", status: "Open", date: "05 Nov 2026" },
];

export default function FeedbackPage() {
  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Member Feedback</h1>
        <p className="mt-1 text-sm text-slate-500">Review and respond to member feedback.</p>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Member</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>

        <tbody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium text-slate-800">{item.id}</TableCell>
              <TableCell className="text-slate-700">{item.member}</TableCell>
              <TableCell className="text-slate-600">{item.subject}</TableCell>
              <TableCell className="text-slate-500">{item.message}</TableCell>
              <TableCell>
                <span className={`rounded-full px-2 py-1 text-xs ${item.status === "Reviewed" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell className="text-slate-600">{item.date}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </section>
  );
}
