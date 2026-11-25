"use client";

import { useState } from "react";
import type { MemberRegistrationInput } from "@/types/member";

const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

interface MemberFormProps {
  /** Returns the new membership number on success, null when refused. */
  onSubmit: (input: MemberRegistrationInput) => string | null;
}

/** Register a member (FR15, FR16). The membership number is generated on save (FR17) and a login is created (FR18). */
export default function MemberForm({ onSubmit }: MemberFormProps) {
  const [name, setName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [idVerified, setIdVerified] = useState(true);
  const [result, setResult] = useState("");

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-slate-600">Full name</span>
          <input className={`${inp} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">National ID (8 digits)</span>
          <input className={`${inp} mt-1`} value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Phone</span>
          <input
            className={`${inp} mt-1`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07..."
          />
        </label>
        <label className="block text-sm">
          <span className="text-slate-600">Email</span>
          <input className={`${inp} mt-1`} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={idVerified}
          onChange={(e) => setIdVerified(e.target.checked)}
        />
        ID verified (FR16)
      </label>

      <p className="text-xs text-slate-500">
        On save: membership number is generated automatically (ER-####, FR17), duplicate National
        IDs are rejected, and a member login is created (FR18) with password member123.
      </p>

      <button
        type="button"
        className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        onClick={() => {
          const id = onSubmit({ name, nationalId, phone, email, idVerified });
          if (id) {
            setResult(`New member ${id} — ${name}. Login created: username ${id}, password member123. ID ${idVerified ? "verified" : "not verified"}.`);
            setName("");
            setNationalId("");
            setPhone("");
            setEmail("");
          } else {
            setResult("");
          }
        }}
      >
        Register member
      </button>

      {result && (
        <p className="rounded border border-green-200 bg-green-50 p-2 text-sm text-green-900">{result}</p>
      )}
    </div>
  );
}
