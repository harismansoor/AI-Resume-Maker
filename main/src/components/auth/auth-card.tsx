"use client";

import { motion } from "framer-motion";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-200"
    >
      <div className="mb-5 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
      {footer ? (
        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      ) : null}
    </motion.div>
  );
}
