"use client";

import { usePato } from "@/hooks/usePato";
import Table, { TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { fmtDate } from "@/lib/store";
import * as notificationService from "@/services/notificationService";

/**
 * SMS reminders and log (FR28, FR30, FR31). The gateway is SIMULATED:
 * messages are recorded in the SMS log with status Delivered. Gateway
 * callbacks (FR29) are therefore simulated too — no live delivery report
 * can arrive until a real gateway is connected.
 */
export default function SmsPanel() {
  const { db, user, commit, msg, setMsg } = usePato();

  if (!db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function send(kind: "Contribution" | "Arrears") {
    try {
      const copy = JSON.parse(JSON.stringify(db));
      const result = notificationService.sendSms(copy, kind, actor);
      commit(copy, result.message);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => send("Contribution")}
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Send contribution reminders
        </button>
        <button
          type="button"
          onClick={() => send("Arrears")}
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Send arrears reminders
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Contribution reminders go to all members; arrears reminders go only to members in arrears.
        Delivery status is tracked for every SMS (FR28). Gateway callbacks are simulated as
        Delivered (FR29) — no live Africa&apos;s Talking connection exists in this prototype.
      </p>
      {msg && <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>To</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Kind</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <tbody>
          {db.sms.slice(0, 20).map((s) => (
            <TableRow key={s.id}>
              <TableCell className="text-slate-700">{s.to}</TableCell>
              <TableCell className="text-slate-600">{s.message}</TableCell>
              <TableCell className="text-slate-600">{s.kind}</TableCell>
              <TableCell className="text-slate-700">{s.status}</TableCell>
              <TableCell className="text-slate-600">{fmtDate(s.date)}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      {db.sms.length === 0 && <p className="text-sm text-slate-500">No SMS sent yet.</p>}
    </div>
  );
}
