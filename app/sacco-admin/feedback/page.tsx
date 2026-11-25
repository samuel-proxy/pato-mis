"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { loadFeedback, saveFeedback } from "@/lib/feedback";
import type { FeedbackItem } from "@/lib/feedback";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];

/** Member feedback inbox. Feedback is stored locally (it is not one of FR01–FR31). */
export default function FeedbackPage() {
  const { ready } = useAuth(ROLES);
  const [items, setItems] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    setItems(loadFeedback());
  }, []);

  if (!ready) return <p className="text-sm text-slate-500">Loading...</p>;

  function mark(id: string, status: "Open" | "Reviewed") {
    const next = items.map((f) => (f.id === id ? { ...f, status } : f));
    setItems(next);
    saveFeedback(next);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Member Feedback</h1>
        <p className="mt-1 text-sm text-slate-500">Review and respond to member feedback.</p>
      </div>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Member</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <tbody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium text-slate-800">{item.id}</TableCell>
                <TableCell className="text-slate-700">{item.member}</TableCell>
                <TableCell className="text-slate-600">{item.subject}</TableCell>
                <TableCell className="text-slate-500">{item.message}</TableCell>
                <TableCell>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      item.status === "Reviewed"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-600">{item.date}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => mark(item.id, item.status === "Open" ? "Reviewed" : "Open")}
                    className="rounded border border-slate-400 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                  >
                    Mark {item.status === "Open" ? "Reviewed" : "Open"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
        {items.length === 0 && <p className="mt-3 text-sm text-slate-500">No feedback yet.</p>}
      </Card>
    </div>
  );
}
