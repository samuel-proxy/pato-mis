"use client";

export default function ReportsPage() {
  const reports = [
    { id: "RPT-001", title: "Savings Summary", type: "Financial", period: "Monthly", lastGenerated: "10 Nov 2026" },
    { id: "RPT-002", title: "Loan Performance", type: "Financial", period: "Monthly", lastGenerated: "09 Nov 2026" },
    { id: "RPT-003", title: "Member Registration", type: "Administrative", period: "Quarterly", lastGenerated: "01 Oct 2026" },
    { id: "RPT-004", title: "Audit Summary", type: "Security", period: "Monthly", lastGenerated: "05 Nov 2026" },
  ];

  return (
    <section className="p-6 md:p-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Generate and view SACCO reports.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => (
          <div key={report.id} className="rounded border border-slate-300 bg-white p-4">
            <h3 className="font-bold text-slate-900">{report.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{report.type} | {report.period}</p>
            <p className="mt-2 text-xs text-slate-400">Last generated: {report.lastGenerated}</p>
          </div>
        ))}
      </div>
    </section>
  );
}