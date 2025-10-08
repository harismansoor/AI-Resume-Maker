"use client";

import { useState } from "react";

export default function ResumeBuilderClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [jobTitle, setJobTitle] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">("");
  const [skills, setSkills] = useState(""); // comma/lines
  const [education, setEducation] = useState(""); // freeform
  const [achievements, setAchievements] = useState("");
  const [projects, setProjects] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHtml(null);

    try {
      const res = await fetch("/api/generate-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          location,
          jobTitle,
          experienceYears: Number(experienceYears || 0),
          skills,
          education,
          achievements,
          projects,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");
      setHtml(data.html);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const disabled =
    loading || !name || !jobTitle || !skills || experienceYears === "";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Form */}
      <form onSubmit={onGenerate} className="space-y-4 rounded-xl border p-4">
        <h2 className="text-lg font-semibold">Build Your Resume</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm">Full Name</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Role / Title</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Email</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Phone</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Location</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Years of Experience</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              type="number"
              min={0}
              value={experienceYears}
              onChange={(e) =>
                setExperienceYears(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm">
            Key Skills (comma or line separated)
          </label>
          <textarea
            className="min-h-[80px] w-full rounded border bg-transparent px-3 py-2"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Education (freeform)</label>
          <textarea
            className="min-h-[80px] w-full rounded border bg-transparent px-3 py-2"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Achievements (optional)</label>
          <textarea
            className="min-h-[80px] w-full rounded border bg-transparent px-3 py-2"
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm">Projects (optional)</label>
          <textarea
            className="min-h-[80px] w-full rounded border bg-transparent px-3 py-2"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-white/10 px-4 py-2 font-medium hover:bg-white/20 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Resume (–1 credit)"}
        </button>

        {error && (
          <p className="rounded bg-red-500/10 p-2 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      {/* Right: Preview */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 text-lg font-semibold">Preview</h2>
        {!html ? (
          <p className="text-sm opacity-70">Your AI resume will appear here.</p>
        ) : (
          <div
            className="max-h-[70vh] overflow-auto rounded border bg-white p-6 text-black"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
