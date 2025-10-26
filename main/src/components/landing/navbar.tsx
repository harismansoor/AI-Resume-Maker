"use client";

import Link from "next/link";
import Container from "@/components/ui/container";
import { LogIn } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <Container className="flex h-14 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="font-mono">AI</span> Resume Maker
        </Link>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#features" className="hover:text-black">
            Features
          </a>
          <a href="#demo" className="hover:text-black">
            Live demo
          </a>
          <a href="#templates" className="hover:text-black">
            Templates
          </a>
          <a href="#how-it-works" className="hover:text-black">
            How it works
          </a>
          <a href="#testimonials" className="hover:text-black">
            Proof
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg border px-3 py-1.5 text-sm md:block"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm font-medium text-white"
          >
            Get started <LogIn size={16} />
          </Link>
        </div>
      </Container>
    </header>
  );
}
