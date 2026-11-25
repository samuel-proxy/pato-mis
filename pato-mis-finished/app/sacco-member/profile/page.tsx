"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { fmtKES, outstandingLoans } from "@/lib/store";
import { addFeedback } from "@/lib/feedback";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["member"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Member profile: own record, account and feedback. */
export default function ProfilePage() {
  const { db, user, ready, msg, reset, setMsg } = useAuth(ROLES);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const memberName = user.name;
  const me = db.members.find((m) => m.id === user.memberId);

  function sendFeedback() {
    if (!subject.trim() || !message.trim()) {
      setMsg("Subject and message are required.");
      return;
    }
    addFeedback(memberName, subject.trim(), message.trim());
    setSubject("");
    setMessage("");
    setSent(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">Your membership record and account.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Membership Record</h3>
        {me ? (
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p>Name: <b>{me.name}</b></p>
            <p>Membership number: <b>{me.id}</b></p>
            <p>National ID: <b>{me.nationalId}</b> {me.idVerified ? "(verified)" : "(not verified)"}</p>
            <p>Phone: <b>{me.phone}</b></p>
            <p>Email: <b>{me.email}</b></p>
            <p>Joined: <b>{me.joined}</b></p>
            <p>Deposits: <b>{fmtKES(me.depositsCents)}</b></p>
            <p>Savings: <b>{fmtKES(me.savingsCents)}</b></p>
            <p>Outstanding loans: <b>{fmtKES(outstandingLoans(db, me.id))}</b></p>
            <p>
              Status:{" "}
              {me.inArrears ? (
                <b className="text-red-600">In arrears</b>
              ) : (
                <b className="text-green-700">Good standing</b>
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-500">No member record linked to this account.</p>
        )}
        <p className="mt-3 text-sm text-slate-600">
          Signed in as <b>{user.username}</b> ({user.name}).
        </p>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Send Feedback</h3>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="text-slate-600">Subject</span>
            <input className={`${inp} mt-1`} value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Message</span>
            <textarea
              className={`${inp} mt-1`}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <button
            type="button"
            onClick={sendFeedback}
            className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Send feedback
          </button>
          {sent && <p className="text-sm text-green-700">Thank you — your feedback was sent to the SACCO administrator.</p>}
        </div>
      </Card>

      <Card>
        <h3 className="mb-2 font-bold text-slate-900">Demo Data</h3>
        <p className="text-sm text-slate-600">
          This prototype stores its data in your browser only. Resetting restores the seeded demo
          data (Mary, James and Grace, their loans and settings).
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded border border-slate-400 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          Reset demo data
        </button>
      </Card>
    </div>
  );
}
