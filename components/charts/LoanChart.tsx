"use client";

import { fmtKES } from "@/lib/store";
import type { Loan } from "@/types/loan";

const STATUS_ORDER = ["Pending", "Approved", "Disbursed", "Repaid", "Rejected"] as const;
const STATUS_COLORS: Record<string, string> = {
  Pending: "#f59e0b",
  Approved: "#2563eb",
  Disbursed: "#16a34a",
  Repaid: "#0e7490",
  Rejected: "#dc2626",
};

/** Simple SVG bar chart of loans by status. No chart library is used. */
export default function LoanChart({ loans }: { loans: Loan[] }) {
  const counts = STATUS_ORDER.map((s) => ({
    label: s,
    count: loans.filter((l) => l.status === s).length,
    amount: loans.filter((l) => l.status === s).reduce((a, l) => a + l.amountCents, 0),
  }));
  const max = Math.max(1, ...counts.map((c) => c.count));
  const width = 420;
  const barHeight = 26;
  const gap = 12;
  const height = counts.length * (barHeight + gap) + 10;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Loans by status">
        {counts.map((c, i) => {
          const y = 10 + i * (barHeight + gap);
          const barWidth = (c.count / max) * 240;
          return (
            <g key={c.label}>
              <text x={0} y={y + 17} fontSize={12} fill="#334155" width={70}>
                {c.label}
              </text>
              <rect
                x={80}
                y={y}
                width={Math.max(barWidth, c.count > 0 ? 4 : 0)}
                height={barHeight}
                rx={3}
                fill={STATUS_COLORS[c.label]}
              />
              <text x={88 + barWidth} y={y + 17} fontSize={12} fill="#334155">
                {c.count} loan(s) — {fmtKES(c.amount)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-xs text-slate-500">
        Total: {loans.length} loan(s), {fmtKES(loans.reduce((a, l) => a + l.amountCents, 0))}.
      </p>
    </div>
  );
}
