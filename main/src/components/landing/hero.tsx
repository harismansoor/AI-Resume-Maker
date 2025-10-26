"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Container from "@/components/ui/container";
import Badge from "@/components/ui/badge";
import Link from "next/link";

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 400], [0, -30]);
  const y2 = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section className="relative overflow-hidden">
      {/* background grid + glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(600px_300px_at_50%_-10%,rgba(0,0,0,0.08),transparent)]" />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_200px_at_50%_0%,black,transparent)]" />
      </div>

      <Container className="py-16 md:py-24">
        <motion.div style={{ y: y1 }} className="space-y-4">
          <Badge>Built for accuracy • Loved for speed</Badge>
          <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Ship an{" "}
            <span className="underline decoration-sky-400/40">ATS-ready</span>{" "}
            resume in minutes.
          </h1>
          <p className="max-w-2xl text-pretty text-slate-600 md:text-lg">
            AI that actually understands resume structure. Import, generate, and
            tailor — with live, pixel-perfect templates.
          </p>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Start free — 5 credits
            </Link>
            <a
              href="#demo"
              className="rounded-xl border px-5 py-3 text-sm font-medium"
            >
              Try a live demo
            </a>
          </div>
          <p className="text-xs text-slate-500">
            No credit card. Exports and advanced AI require sign-in.
          </p>
        </motion.div>

        {/* floating code card */}
        <motion.div
          style={{ y: y2 }}
          className="mt-10 w-full rounded-2xl border bg-white shadow-sm ring-1 ring-slate-200 md:w-[720px]"
        >
          <div className="border-b bg-slate-50 px-4 py-2 text-xs text-slate-500">
            <span className="font-mono">resume.json</span>
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
            {`{
  "name": "Avery Harper",
  "title": "Product Manager",
  "skills": ["A/B Testing", "SQL", "Roadmapping"],
  "experience": [{"company": "Nimbus", "role": "Sr. PM"}]
}`}
          </pre>
        </motion.div>
      </Container>
    </section>
  );
}
