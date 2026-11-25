"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function MemberDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const member = {
    id: id,
    name: "John Mwangi",
    email: "john.mwangi@example.com",
    phone: "+254 700 123456",
    idNumber: "12345678",
    status: "Approved",
    joined: "15 Jan 2024",
    savings: 25000,
    loanBalance: 9000,
  };

  return (
    <section className="p-6 md:p-10 max-w-md space-y-6">
      <div>
        <Link href="/sacco-admin/members" className="text-sm text-slate-600 hover:underline">
          Back to Members
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{member.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Member {member.id}</p>
      </div>

      <div className="border border-slate-300 rounded p-4">
        <div className="space-y-3 text-sm">
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Member ID</span>
            <span className="font-medium text-slate-900">{member.id}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Email</span>
            <span className="font-medium text-slate-900">{member.email}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Phone</span>
            <span className="font-medium text-slate-900">{member.phone}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">National ID</span>
            <span className="font-medium text-slate-900">{member.idNumber}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Status</span>
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">{member.status}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Joined</span>
            <span className="font-medium text-slate-900">{member.joined}</span>
          </p>
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Total Savings</span>
            <span className="font-medium text-slate-900">KSh {member.savings.toLocaleString("en-KE")}</span>
          </p>
          <p className="flex justify-between pb-2">
            <span className="text-slate-500">Loan Balance</span>
            <span className="font-medium text-slate-900">KSh {member.loanBalance.toLocaleString("en-KE")}</span>
          </p>
        </div>
      </div>
    </section>
  );
}