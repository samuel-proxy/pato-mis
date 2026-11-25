import type { DB } from "@/lib/store";
import { audit, fmtKES, uid } from "@/lib/store";

export type ReminderKind = "Contribution" | "Arrears";

/**
 * Send SMS reminders (FR30 contribution to all members, FR31 arrears only to
 * members in arrears). The gateway is SIMULATED: messages are recorded in the
 * SMS log with status Delivered, as the reference does (FR28).
 */
export function sendSms(db: DB, kind: ReminderKind, actor: string): { sent: number; message: string } {
  const targets = kind === "Arrears" ? db.members.filter((m) => m.inArrears) : db.members;
  targets.forEach((m) =>
    db.sms.unshift({
      id: uid("S"),
      to: m.phone,
      message:
        kind === "Arrears"
          ? `Dear ${m.name.split(" ")[0]}, your loan repayment is overdue. Please pay to avoid penalties. - Pato Sacco`
          : `Dear ${m.name.split(" ")[0]}, your monthly contribution is due. Minimum ${fmtKES(db.settings.minContributionCents)}. Pay via M-Pesa or at the office. - Pato Sacco`,
      status: "Delivered",
      date: new Date().toISOString(),
      kind: kind === "Arrears" ? "Arrears reminder" : "Contribution reminder",
    })
  );
  audit(db, actor, "SMS reminders sent", `${kind} reminders sent to ${targets.length} member(s) via Africa's Talking (simulated).`);
  return { sent: targets.length, message: `${kind} reminders sent to ${targets.length} member(s). See SMS log.` };
}

/**
 * Export the full database as JSON for backup (FR26). The caller downloads
 * the returned string; this function also records the backup in the audit log.
 */
export function exportBackup(db: DB, actor: string): string {
  const json = JSON.stringify(db, null, 2);
  db.settings.lastBackup = new Date().toISOString();
  audit(db, actor, "Backup run", `Scheduled backup (${db.settings.backupSchedule}) exported as JSON.`);
  return json;
}
