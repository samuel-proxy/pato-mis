"use client";

import { useState } from "react";
import { usePato } from "@/hooks/usePato";
import { audit, fmtKES, outstandingLoans, toCents, uid } from "@/lib/store";
import { USSD_CODE } from "@/lib/constants";
import * as savingsService from "@/services/savingsService";

type Step = "dial" | "menu" | "back" | "repay" | "contribute";

const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/**
 * USSD simulator (FR27) — Africa's Talking is SIMULATED, not a live gateway.
 * Staff choose the member the session acts for; the menu never goes deeper
 * than 3 levels: dial -> menu -> choice / amount.
 */
export default function UssdSimulator() {
  const { db, user, update, msg, setMsg } = usePato();
  const [memberId, setMemberId] = useState("ER-0001");
  const [ussd, setUssd] = useState("");
  const [step, setStep] = useState<Step>("dial");
  const [ussdMsg, setUssdMsg] = useState(
    `Dial ${USSD_CODE} to start. USSD menu has 3 levels or fewer.`
  );

  if (!db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;
  const me = db.members.find((m) => m.id === memberId) ?? db.members[0];
  const myLoans = me ? db.loans.filter((l) => l.memberId === me.id) : [];

  const menuText = `Pato Sacco\n1. Balance\n2. Loan balance\n3. Repay loan\n4. Contribute\n0. Exit`;

  function send() {
    if (!db) return;
    const input = ussd.trim();
    if (step === "dial") {
      if (input === USSD_CODE) {
        setStep("menu");
        setUssdMsg(menuText);
      } else {
        setUssdMsg(`Invalid code. Dial ${USSD_CODE}`);
      }
    } else if (step === "menu") {
      if (input === "1") {
        setUssdMsg(
          me
            ? `Balance — ${me.name}\nDeposits: ${fmtKES(me.depositsCents)}\nSavings: ${fmtKES(me.savingsCents)}\n0. Back`
            : "No member selected."
        );
        setStep("back");
      } else if (input === "2") {
        const o = me ? outstandingLoans(db, me.id) : 0;
        setUssdMsg(`Loan balance: ${fmtKES(o)}\n0. Back`);
        setStep("back");
      } else if (input === "3") {
        setStep("repay");
        setUssdMsg("Enter repayment amount in KES:");
      } else if (input === "4") {
        setStep("contribute");
        setUssdMsg("Enter contribution amount in KES:");
      } else if (input === "0") {
        setStep("dial");
        setUssdMsg(`Thank you for using Pato Sacco. Dial ${USSD_CODE} to start again.`);
      } else {
        setUssdMsg("Invalid choice. Enter 1, 2, 3, 4 or 0.");
      }
    } else if (step === "back") {
      if (input === "0") {
        setStep("menu");
        setUssdMsg(menuText);
      }
    } else if (step === "repay") {
      const loan = myLoans.find((l) => l.status === "Disbursed");
      if (!loan || !me) {
        setUssdMsg("No disbursed loan to repay.");
        setStep("menu");
      } else {
        const amt = toCents(Number(input) || 0);
        if (!amt) {
          setUssdMsg("Enter a valid amount in KES.");
        } else {
          update((d) => {
            const ln = d.loans.find((l) => l.id === loan.id);
            if (!ln) return;
            const rem = ln.amountCents - ln.repaidCents;
            const pay = Math.min(amt, rem);
            ln.repaidCents += pay;
            if (ln.repaidCents >= ln.amountCents) ln.status = "Repaid";
            d.txns.unshift({
              id: uid("T"),
              memberId: ln.memberId,
              type: "Loan Repayment",
              amountCents: pay,
              date: new Date().toISOString(),
              note: `Repayment ${loan.id} via USSD`,
              channel: "USSD",
            });
            d.ussdSessions.unshift(
              `${new Date().toISOString().slice(0, 10)} ${USSD_CODE} ${ln.memberId} Repay ${fmtKES(pay)} - Delivered`
            );
            audit(d, actor, "USSD repayment", `${fmtKES(pay)} repaid on ${loan.id} via USSD.`);
          });
          setUssdMsg(`Repayment of ${fmtKES(amt)} received. Thank you.\n0. Back`);
          setStep("back");
        }
      }
    } else if (step === "contribute") {
      const amt = toCents(Number(input) || 0);
      if (!amt || !me) {
        setUssdMsg("Enter a valid amount in KES.");
      } else {
        update((d) => {
          savingsService.contribute(d, me.id, amt, actor, "USSD");
          d.ussdSessions.unshift(
            `${new Date().toISOString().slice(0, 10)} ${USSD_CODE} ${me.id} Contribute ${fmtKES(amt)} - Delivered`
          );
        }, `Contribution of ${fmtKES(amt)} received via USSD.`);
        setUssdMsg(`Contribution of ${fmtKES(amt)} received. Thank you.\n0. Back`);
        setStep("back");
      }
    }
    setUssd("");
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="text-slate-600">Member this USSD session acts for</span>
        <select
          className={`${inp} mt-1`}
          value={me?.id ?? ""}
          onChange={(e) => {
            setMemberId(e.target.value);
            setStep("dial");
            setUssdMsg(`Dial ${USSD_CODE} to start. USSD menu has 3 levels or fewer.`);
          }}
        >
          {db.members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.id} — {m.name}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm whitespace-pre-wrap text-green-300 min-h-32">
        {ussdMsg}
      </div>

      <div className="flex gap-2">
        <input
          className={inp}
          value={ussd}
          onChange={(e) => setUssd(e.target.value)}
          placeholder={`Type ${USSD_CODE} or 1, 2, 3, 4, 0, or an amount`}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button
          type="button"
          onClick={send}
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Send
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Africa&apos;s Talking is simulated in this prototype — no real USSD session is opened and
        no real SMS is sent. Menu (3 levels or fewer): Level 1 menu → Level 2 choice → Level 3
        amount.
      </p>
      {msg && <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>}

      <h4 className="pt-2 font-semibold text-slate-900">USSD session log</h4>
      {db.ussdSessions.slice(0, 10).map((s, i) => (
        <p key={i} className="text-xs text-slate-600">
          {s}
        </p>
      ))}
      {db.ussdSessions.length === 0 && <p className="text-xs text-slate-500">No USSD sessions yet.</p>}
    </div>
  );
}
