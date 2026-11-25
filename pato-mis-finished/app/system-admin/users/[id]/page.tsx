"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ROLE_LABEL } from "@/lib/constants";
import * as userService from "@/services/userService";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];

/** One user: detail, change role (FR22), deactivate / reactivate (FR23). */
export default function UserDetailPage() {
  const { db, user, ready, msg, run } = useAuth(ROLES);
  const params = useParams();

  if (!ready || !db || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const u = db.users.find((x) => x.id === params.id);
  if (!u) return <p className="text-sm text-slate-500">User not found.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          User — {u.name} ({u.username})
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Created {new Date(u.createdAt).toLocaleDateString("en-KE")}
          {u.memberId ? ` • Linked member: ${u.memberId}` : ""}
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <p>Username: <b>{u.username}</b></p>
          <p>Name: <b>{u.name}</b></p>
          <p>Role: <b>{ROLE_LABEL[u.role]}</b></p>
          <p>
            Status:{" "}
            <Badge variant={u.active ? "success" : "danger"}>
              {u.active ? "Active" : "Deactivated"}
            </Badge>
          </p>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 font-bold text-slate-900">Change Role</h3>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block text-sm">
            <span className="text-slate-600">Role</span>
            <select
              className="mt-1 rounded border border-slate-400 px-3 py-2 text-sm"
              value={u.role}
              onChange={(e) =>
                run((d) => userService.updateRole(d, u.id, e.target.value as Role, user.username))
              }
            >
              <option value="member">Member</option>
              <option value="officer">Credit Officer</option>
              <option value="sacco_admin">Sacco Admin</option>
              <option value="sysadmin">System Admin</option>
            </select>
          </label>
          <button
            type="button"
            onClick={() => run((d) => userService.toggleActive(d, u.id, user.username))}
            className="rounded border border-red-600 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            {u.active ? "Deactivate account" : "Reactivate account"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          A deactivated account cannot sign in until it is reactivated.
        </p>
      </Card>
    </div>
  );
}
