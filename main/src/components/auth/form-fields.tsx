"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";

export function EmailField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700">
        Email
      </span>
      <div className="relative">
        <input
          type="email"
          autoComplete="email"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 pl-9 outline-none ring-0 focus:border-black"
          placeholder="you@example.com"
        />
        <Mail className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
      </div>
    </label>
  );
}

export function PasswordField({
  value,
  onChange,
  label = "Password",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </span>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          autoComplete="current-password"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 pl-9 pr-9 outline-none ring-0 focus:border-black"
          placeholder="••••••••"
        />
        <Lock className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-2.5 rounded p-1 text-slate-600 hover:bg-slate-100"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
