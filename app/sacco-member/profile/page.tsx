"use client";

export default function ProfilePage() {
  const member = {
    name: "Samuel Musyoka",
    id: "PATO-001",
    email: "samuelmusyoka473@gmail.com",
    phone: "+254 700 123456",
    role: "Member",
    joined: "15 Jan 2024",
  };

  return (
    <section className="p-6 md:p-10 max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account details.
        </p>
      </div>

      <div className="border border-slate-300 rounded p-4">
        <div className="space-y-3 text-sm">
          <p className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500">Full Name</span>
            <span className="font-medium text-slate-900">{member.name}</span>
          </p>
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
            <span className="text-slate-500">Role</span>
            <span className="font-medium text-slate-900">{member.role}</span>
          </p>
          <p className="flex justify-between pb-2">
            <span className="text-slate-500">Joined</span>
            <span className="font-medium text-slate-900">{member.joined}</span>
          </p>
        </div>
      </div>
    </section>
  );
}