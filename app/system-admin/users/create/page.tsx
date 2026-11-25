"use client";

import { useState } from "react";
import Link from "next/link";

export default function CreateUserPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="p-6 md:p-10 max-w-lg">
      <h1 className="text-2xl font-bold text-slate-900">Add User</h1>
      <p className="mt-1 mb-6 text-sm text-slate-500">
        Create a new platform user.
      </p>

      {submitted ? (
        <div className="rounded border border-green-300 bg-green-50 p-4">
          <p className="font-medium text-green-800">User created successfully.</p>
          <Link href="/system-admin/users" className="mt-3 inline-block text-sm text-green-800 hover:underline">
            Back to Users
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
            <input type="text" id="name" name="name" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" id="email" name="email" required className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900" />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
            <select id="role" name="role" className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white outline-none focus:border-blue-900">
              <option value="SACCO Admin">SACCO Admin</option>
              <option value="Credit Officer">Credit Officer</option>
              <option value="Member">Member</option>
              <option value="System Admin">System Admin</option>
            </select>
          </div>

          <button type="submit" className="rounded bg-blue-900 px-4 py-2 text-sm text-white hover:bg-blue-800">
            Create User
          </button>
        </form>
      )}
    </section>
  );
}