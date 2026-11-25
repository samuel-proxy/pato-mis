"use client";

import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembers";
import Card from "@/components/ui/Card";
import MemberForm from "@/components/forms/MemberForm";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];

/** Register a member (FR15, FR16, FR17, FR18). */
export default function RegisterMemberPage() {
  const { ready, msg } = useAuth(ROLES);
  const { register } = useMembers();

  if (!ready) return <p className="text-sm text-slate-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Register a New Member</h1>
        <p className="mt-1 text-sm text-slate-500">
          The membership number is generated automatically and a member login is created.
        </p>
      </div>

      {msg && (
        <p className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-sm">{msg}</p>
      )}

      <Card>
        <MemberForm onSubmit={register} />
      </Card>
    </div>
  );
}
