"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { BACKUP_SCHEDULES } from "@/lib/constants";
import * as notificationService from "@/services/notificationService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Scheduled backup (FR26): set the schedule and export the database as JSON. */
export default function BackupsPage() {
  const { db, user, ready, msg, run, update } = useAuth(ROLES);

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function runBackup() {
    // Export through the service (records lastBackup + audit entry), then download.
    let json = "";
    const ok = run((d) => {
      json = notificationService.exportBackup(d, actor);
      return "Backup exported as JSON.";
    });
    if (!ok || !json) return;
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pato-mis-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Backups</h1>
        <p className="mt-1 text-sm text-slate-500">View and manage system backups.</p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <h3 className="mb-2 font-bold text-slate-900">Scheduled Backup</h3>
        <p className="mb-3 text-sm text-slate-600">
          Backups export the full database as JSON. In the real system this would run on a schedule
          to cloud storage (FR26). In this prototype the backup runs when you click below.
        </p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm">
            <span className="text-slate-600">Backup schedule</span>
            <select
              className={`${inp} mt-1`}
              value={db.settings.backupSchedule}
              onChange={(e) =>
                update((d) => {
                  d.settings.backupSchedule = e.target.value;
                })
              }
            >
              {BACKUP_SCHEDULES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={runBackup}
            className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Run backup now (Export JSON)
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          Last backup:{" "}
          <b>
            {db.settings.lastBackup
              ? new Date(db.settings.lastBackup).toLocaleString("en-KE")
              : "Never"}
          </b>
        </p>
      </Card>
    </div>
  );
}
