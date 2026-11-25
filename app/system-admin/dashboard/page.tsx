"use client";

import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import { fmtKES } from "@/lib/store";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** System administrator dashboard: platform totals and recent activity. */
export default function SystemAdminDashboard() {
  const { db, ready } = useAuth(ROLES);
  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;

  const totals = {
    users: db.users.length,
    activeUsers: db.users.filter((u) => u.active).length,
    members: db.members.length,
    deposits: db.members.reduce((s, m) => s + m.depositsCents, 0),
    outstanding: db.loans
      .filter((l) => l.status === "Disbursed" || l.status === "Approved")
      .reduce((s, l) => s + (l.amountCents - l.repaidCents), 0),
    pendingLoans: db.loans.filter((l) => l.status === "Pending").length,
    auditEntries: db.audit.length,
    lastBackup: db.settings.lastBackup,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Administrator Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Users, members, loans and platform health.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">User Accounts</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.users}</h3>
          <p className="mt-1 text-xs text-slate-400">{totals.activeUsers} active</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Members</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{totals.members}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Deposits</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.deposits)}</h3>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Loans Outstanding</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{fmtKES(totals.outstanding)}</h3>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Platform</h3>
          <p className="text-sm text-slate-700">Audit log entries: <b>{totals.auditEntries}</b></p>
          <p className="text-sm text-slate-700">Pending loan applications: <b>{totals.pendingLoans}</b></p>
          <p className="text-sm text-slate-700">
            Last backup:{" "}
            <b>{totals.lastBackup ? new Date(totals.lastBackup).toLocaleString("en-KE") : "Never"}</b>
          </p>
          <p className="text-sm text-slate-700">Backup schedule: <b>{db.settings.backupSchedule}</b></p>
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Users by Role</h3>
          {(["member", "officer", "sacco_admin", "sysadmin"] as const).map((r) => (
            <p key={r} className="text-sm text-slate-700">
              {r}: <b>{db.users.filter((u) => u.role === r).length}</b>
            </p>
          ))}
        </Card>
        <Card>
          <h3 className="mb-2 font-bold text-slate-900">Recent Activity</h3>
          {db.audit.slice(0, 4).map((a) => (
            <p key={a.id} className="text-sm text-slate-700">
              {a.action} — {a.detail}
            </p>
          ))}
        </Card>
      </div>
    </div>
  );
}
