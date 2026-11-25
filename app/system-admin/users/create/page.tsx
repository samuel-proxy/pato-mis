"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Card from "@/components/ui/Card";
import * as userService from "@/services/userService";
import { ROLE_LABEL } from "@/lib/constants";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sysadmin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Create a user account (FR21). */
export default function CreateUserPage() {
  const { user, ready, msg, run } = useAuth(ROLES);
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");

  if (!ready || !user) return <p className="text-sm text-slate-500">Loading...</p>;
  const actor = user.username;

  function create() {
    const ok = run((d) =>
      userService.createUser(d, { username, password, name, role }, actor)
    );
    if (ok) router.push("/system-admin/users");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create User Account</h1>
        <p className="mt-1 text-sm text-slate-500">
          Only the system administrator creates user accounts and assigns roles.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-slate-600">Username</span>
            <input className={`${inp} mt-1`} value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Full name</span>
            <input className={`${inp} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Password</span>
            <input className={`${inp} mt-1`} value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-slate-600">Role</span>
            <select className={`${inp} mt-1`} value={role} onChange={(e) => setRole(e.target.value as Role)}>
              {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={create}
          className="mt-4 rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Create user
        </button>
      </Card>
    </div>
  );
}
