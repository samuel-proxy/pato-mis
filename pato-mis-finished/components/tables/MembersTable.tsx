"use client";

import Badge from "@/components/ui/Badge";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { fmtKES } from "@/lib/store";
import type { Member } from "@/types/member";

interface MembersTableProps {
  members: Member[];
  outstanding: (memberId: string) => number;
  onOpen?: (member: Member) => void;
}

/** Member records table (FR08). */
export default function MembersTable({ members, outstanding, onOpen }: MembersTableProps) {
  if (members.length === 0) return <p className="text-sm text-slate-500">No members found.</p>;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Member</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Deposits</TableCell>
          <TableCell>Savings</TableCell>
          <TableCell>Outstanding</TableCell>
          <TableCell>Arrears</TableCell>
          {onOpen && <TableCell></TableCell>}
        </TableRow>
      </TableHead>
      <tbody>
        {members.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium text-slate-800">{m.id}</TableCell>
            <TableCell className="text-slate-700">{m.name}</TableCell>
            <TableCell className="text-slate-700">{m.phone}</TableCell>
            <TableCell className="text-slate-700">{fmtKES(m.depositsCents)}</TableCell>
            <TableCell className="text-slate-700">{fmtKES(m.savingsCents)}</TableCell>
            <TableCell className="text-slate-700">{fmtKES(outstanding(m.id))}</TableCell>
            <TableCell>
              <Badge variant={m.inArrears ? "danger" : "success"}>
                {m.inArrears ? "In arrears" : "Good standing"}
              </Badge>
            </TableCell>
            {onOpen && (
              <TableCell>
                <button
                  type="button"
                  onClick={() => onOpen(m)}
                  className="rounded border border-slate-400 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Open file
                </button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
