"use client";

import { FcGoogle } from "react-icons/fc";
import { Github } from "lucide-react";

export default function OAuthButtons({
  onGoogle,
  onGithub,
}: {
  onGoogle?: () => void | Promise<void>;
  onGithub?: () => void | Promise<void>;
}) {
  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={onGoogle}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
      >
        <FcGoogle /> Continue with Google
      </button>
      <button
        type="button"
        onClick={onGithub}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
      >
        <Github size={16} /> Continue with GitHub
      </button>
    </div>
  );
}
