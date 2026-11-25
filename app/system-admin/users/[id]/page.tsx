"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const user = {
    id: id,
    name: "Jane Admin",
    email: "jane@patosacco.co.ke",
    role: "SACCO Admin",
    status: "Active",
    created: "01 Jan 2024",
  };

  return (
    <section className="p-6 md:p-10 max-w-md space-y-6">
      <div>
        <Link href="/system-admin/users" className="text-sm text-slate-600 hover:underline">
          Back to Users
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{user.name}</h1>
        <p className="mt-1 text-sm text-slate-500">User {user.id}</p>
      </div>

      <div className="border border-slate-300 rounded p-4">
        <div className="space-y-3 text-sm">
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-900">{user.email}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Role</span>
            <span className="font-medium text-slate-900">{user.role}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Status</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">{user.status}</span>
          </p>
          <p className="flex justify-between pb-2">
            <span className="text-slate-500">Created</span>
            <span className="font-medium text-slate-900">{user.created}</span>
          </p>
        </div>
      </div>
    </section>
  );
}