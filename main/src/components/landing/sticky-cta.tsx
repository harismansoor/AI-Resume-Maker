"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center">
      <div className="flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-lg ring-1 ring-slate-200">
        <span className="hidden text-sm text-slate-700 md:block">
          Ready to build?
        </span>
        <Link
          href="/login"
          className="rounded-full bg-black px-4 py-1.5 text-sm font-medium text-white"
        >
          Get started free
        </Link>
        <a href="#demo" className="rounded-full border px-3 py-1.5 text-sm">
          Try demo
        </a>
      </div>
    </div>
  );
}
