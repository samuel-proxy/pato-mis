"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/forms/LoginForm";
import { login } from "@/services/authService";
import { roleHome } from "@/lib/auth";
import { DEMO_LOGINS, ROLE_LABEL } from "@/lib/constants";

/** Sign in (FR01). Credentials are checked against the store; wrong passwords and deactivated accounts are refused. */
export default function LoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin(username: string, password: string) {
    const result = login(username, password);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError("");
    router.push(roleHome(result.user.role));
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded border border-slate-300 bg-white p-8">
        <h1 className="mb-6 text-xl font-bold text-slate-900">PATO SACCO</h1>

        <h2 className="mb-2 text-lg font-bold text-slate-900">Sign In</h2>
        <p className="mb-6 text-sm text-slate-500">Enter your account details to continue.</p>

        <LoginForm onSubmit={handleLogin} error={error} />

        <p className="mt-4 text-xs text-slate-500">
          Login is required on every page. Sessions last 8 hours. Demo data is stored in your
          browser only.
        </p>

        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="mb-2 font-semibold text-slate-900">Demo logins</p>
          <ul className="space-y-1 text-slate-700">
            {DEMO_LOGINS.map((d) => (
              <li key={d.username}>
                <b>{ROLE_LABEL[d.role]}:</b> {d.username} / {d.password}
                {d.name ? ` — ${d.name}` : ""}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need assistance? Contact your SACCO administrator.
        </p>

        <Link href="/" className="mt-4 block text-center text-sm text-slate-600 hover:underline">
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}
