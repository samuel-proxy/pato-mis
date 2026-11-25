"use client";

import { fmtKES } from "@/lib/store";
import type { Member } from "@/types/member";

/** Simple SVG bar chart of deposits per member. No chart library is used. */
export default function SavingsChart({ members }: { members: Member[] }) {
  const max = Math.max(1, ...members.map((m) => m.depositsCents));
  const width = 420;
  const barHeight = 26;
  const gap = 12;
  const height = members.length * (barHeight + gap) + 10;

  if (members.length === 0) return <p className="text-sm text-slate-500">No members yet.</p>;

  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Deposits per member">
        {members.map((m, i) => {
          const y = 10 + i * (barHeight + gap);
          const barWidth = (m.depositsCents / max) * 220;
          return (
            <g key={m.id}>
              <text x={0} y={y + 17} fontSize={12} fill="#334155">
                {m.name.split(" ")[0]} ({m.id})
              </text>
              <rect
                x={150}
                y={y}
                width={Math.max(barWidth, 4)}
                height={barHeight}
                rx={3}
                fill="#15803d"
              />
              <text x={158 + barWidth} y={y + 17} fontSize={12} fill="#334155">
                {fmtKES(m.depositsCents)}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-xs text-slate-500">
        Total deposits: {fmtKES(members.reduce((a, m) => a + m.depositsCents, 0))}.
      </p>
    </div>
  );
}
