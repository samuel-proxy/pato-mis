"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push("/sacco-member/dashboard"); //Takes member to the dasboard page, when backend is intergrated users will have be authenticated to access data.
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded border border-slate-300 bg-white p-8">
        <h1 className="mb-6 text-xl font-bold text-slate-900">PATO SACCO</h1>

        <h2 className="mb-2 text-lg font-bold text-slate-900">Sign In</h2>
        <p className="mb-6 text-sm text-slate-500">
          Enter your account details to continue.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white text-black opacity-100 placeholder:text-slate-500 outline-none focus:border-blue-900"
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-slate-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                className="w-full px-3 py-2 pr-20 border border-slate-400 rounded bg-white text-black opacity-100 placeholder:text-slate-500 outline-none focus:border-blue-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="h-4 w-4" />
            <label htmlFor="remember" className="text-sm text-slate-600">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Need assistance? Contact your SACCO administrator.
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-slate-600 hover:underline"
        >
          Back to Homepage
        </Link>
      </div>
    </main>
  );
}