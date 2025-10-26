"use client";

import { motion } from "framer-motion";

export default function AuthLayout({
  children,
  headline,
  subline,
}: {
  children: React.ReactNode;
  headline: string;
  subline?: string;
}) {
  return (
    <main className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Left: brand/hero */}
      <div className="relative hidden overflow-hidden border-r bg-slate-50 md:block">
        {/* gradient + code grid */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-10%,rgba(0,0,0,0.06),transparent)]" />
          <div className="absolute inset-x-0 top-24 h-64 bg-gradient-to-b from-white/60 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full flex-col items-start justify-between p-10">
          <div className="space-y-4">
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
              AI Resume Maker
            </span>
            <h1 className="text-3xl font-semibold tracking-tight">
              {headline}
            </h1>
            {subline ? (
              <p className="max-w-md text-sm text-slate-600">{subline}</p>
            ) : null}
          </div>

          {/* faux code preview */}
          <motion.pre
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg rounded-2xl border bg-white p-5 text-xs text-slate-800 shadow-sm ring-1 ring-slate-200"
          >{`{
  "sections": ["summary", "skills", "experience"],
  "template": "Corporate",
  "export": "docx"
}`}</motion.pre>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
