"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useMembers } from "@/hooks/useMembers";
import Card from "@/components/ui/Card";
import MembersTable from "@/components/tables/MembersTable";
import type { Role } from "@/types/user";

const ROLES: Role[] = ["officer"];
const inp =
  "w-full border border-slate-400 rounded px-3 py-2 text-sm bg-white text-black outline-none focus:border-blue-900";

/** Member records (FR08). */
export default function OfficerMembersPage() {
  const { db, ready } = useAuth(ROLES);
  const { search, outstanding } = useMembers();
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!ready || !db) return <p className="text-sm text-slate-500">Loading...</p>;
  const members = search(query);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Members</h1>
        <p className="mt-1 text-sm text-slate-500">Open a membership file to see loans and transactions.</p>
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
            onOpen={(m) => router.push(`/credit-officer/members/${m.id}`)}
          />
        </div>
      </Card>
    </div>
  );
}
