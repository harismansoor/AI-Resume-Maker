"use client";

import { useState } from "react";

function getErrorMessage(e: unknown) {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return "Unknown error";
  }
}

export default function GenerateClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [experience, setExperience] = useState<number | "">("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onGenerate(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          experience: Number(experience || 0),
          skills,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      setResult(data.text);
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 max-w-xl space-y-4">
      <form onSubmit={onGenerate} className="space-y-4 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">AI Resume Summary</h2>

        <div className="space-y-2">
          <label className="block text-sm">Job Title</label>
          <input
            className="w-full rounded-lg border bg-transparent px-3 py-2 outline-none focus:ring"
            placeholder="Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Years of Experience</label>
          <input
            type="number"
            min={0}
            className="w-full rounded-lg border bg-transparent px-3 py-2 outline-none focus:ring"
            placeholder="3"
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value === "" ? "" : Number(e.target.value))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm">Key Skills</label>
          <textarea
            className="min-h-[96px] w-full rounded-lg border bg-transparent px-3 py-2 outline-none focus:ring"
            placeholder="React, TypeScript, Next.js, Tailwind CSS"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white/10 px-4 py-2 font-medium hover:bg_white/20 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate (–1 credit)"}
        </button>

        {error && (
          <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="space-y-2 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Result</h3>
            <button
              className="rounded border px-2 py-1 text-sm hover:bg-white/10"
              onClick={() => navigator.clipboard.writeText(result)}
            >
              Copy
            </button>
          </div>
          <textarea
            className="min-h-[140px] w-full resize-y rounded border bg-transparent p-2"
            readOnly
            value={result}
          />
        </div>
      )}
    </div>
  );
}
