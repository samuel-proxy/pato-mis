"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembers";
import Card from "@/components/ui/Card";
import MembersTable from "@/components/tables/MembersTable";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["sacco_admin"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Members (FR08): search and open membership files. */
export default function SaccoAdminMembersPage() {
  const { db, ready } = useAuth(ROLES);
  const { search, outstanding } = useMembers();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const members = search(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Members</h1>
          <p className="mt-1 text-sm text-slate-500">{db.members.length} member(s) on record.</p>
        </div>
        <Link
          href="/sacco-admin/members/register"
          className="rounded bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Register Member
        </Link>
      </div>
      <Card>
        <input
          className={inp}
          placeholder="Search by name or membership number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-3">
          <MembersTable
            members={members}
            outstanding={outstanding}
            onOpen={(m) => router.push(`/sacco-admin/members/${m.id}`)}
          />
        </div>
      </Card>
    </div>
  );
}
