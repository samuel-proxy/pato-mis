"use client";

import { useState } from "react";

const inp =
  "mt-1 w-full px-3 py-2 border border-slate-400 rounded bg-white text-black outline-none focus:border-blue-900";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  error?: string;
}

/** Sign-in form (FR01). Usernames, not email addresses — members sign in with their membership number. */
export default function LoginForm({ onSubmit, error }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(username, password);
      }}
    >
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. ER-0001"
          required
          className={inp}
        />
      </div>

      <div>
        <div className="flex justify-between">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Password
          </label>
        </div>
        <div className="mt-1 relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full px-3 py-2 pr-20 border border-slate-400 rounded bg-white text-black outline-none focus:border-blue-900"
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

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded bg-blue-900 py-2 text-sm font-medium text-white hover:bg-blue-800"
      >
        Sign In
      </button>
    </form>
  );
}
