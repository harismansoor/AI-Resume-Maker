"use client";

import { useState, FormEvent } from "react";
import type { ResumeData, ResumeSectionId } from "@/types/resume";
import TemplateMinimal from "@/components/templates/TemplateMinimal";
import TemplateElegant from "@/components/templates/TemplateElegant";
import { TemplatePicker } from "@/components/resume/TemplatePicker";

export default function ResumeBuilderClient() {
  // ---------- Form fields ----------
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experienceYears, setExperienceYears] = useState<number>(0);
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [achievements, setAchievements] = useState("");
  const [projects, setProjects] = useState("");

  // ---------- UI state ----------
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Structured resume + template/sections ----------
  const [data, setData] = useState<ResumeData | null>(null);
  const [template, setTemplate] = useState<string>("minimal");
  const [sections, setSections] = useState<ResumeSectionId[]>([
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
    "achievements",
  ]);

  function toggleSection(s: ResumeSectionId) {
    setSections((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function onGenerate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/generate-structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          location,
          jobTitle,
          experienceYears: Number(experienceYears) || 0,
          skills,
          education,
          achievements,
          projects,
          includeSections: sections,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to generate");
      setData(json.data as ResumeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function onDownloadDocx() {
    const node = document.querySelector("#resume") as HTMLElement | null;
    const html = node ? node.outerHTML : "";
    if (!html) {
      alert("Nothing to export yet. Generate a resume first.");
      return;
    }

    const res = await fetch("/api/export-docx", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename: "resume" }),
    });

    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d?.error || "Failed to export");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Builder Form */}
      <form onSubmit={onGenerate} className="rounded-xl border p-4 space-y-3">
        <h2 className="mb-2 text-lg font-semibold">Build Your Resume</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-sm">Full Name</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Haris Mansoor"
              required
            />
          </div>

          <div>
            <label className="text-sm">Role / Title</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Frontend Developer"
              required
            />
          </div>

          <div>
            <label className="text-sm">Years of Experience</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              type="number"
              min={0}
              value={experienceYears}
              onChange={(e) =>
                setExperienceYears(parseInt(e.target.value || "0", 10))
              }
            />
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="haris@example.com"
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="########"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm">Location</label>
            <input
              className="w-full rounded border bg-transparent px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Hong Kong"
            />
          </div>
        </div>

        <div>
          <label className="text-sm">
            Key Skills (comma or line separated)
          </label>
          <textarea
            className="w-full rounded border bg-transparent px-3 py-2"
            rows={2}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Next.js, Tailwind CSS"
          />
        </div>

        <div>
          <label className="text-sm">Education (freeform)</label>
          <textarea
            className="w-full rounded border bg-transparent px-3 py-2"
            rows={2}
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g., BSc Computer Science — HKU, 2021"
          />
        </div>

        <div>
          <label className="text-sm">Achievements (optional)</label>
          <textarea
            className="w-full rounded border bg-transparent px-3 py-2"
            rows={2}
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            placeholder="Hackathon Winner 2023; Employee of the Month"
          />
        </div>

        <div>
          <label className="text-sm">Projects (optional)</label>
          <textarea
            className="w-full rounded border bg-transparent px-3 py-2"
            rows={2}
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            placeholder="AI Resume Builder; Portfolio Website"
          />
        </div>

        {/* Template + Section controls */}
        <TemplatePicker value={template} onChange={setTemplate} />

        <div className="space-y-2">
          <div className="text-sm mt-3">Sections</div>
          {(
            [
              "summary",
              "skills",
              "experience",
              "education",
              "projects",
              "achievements",
              "certifications",
              "languages",
            ] as ResumeSectionId[]
          ).map((s) => (
            <label
              key={s}
              className="mr-3 inline-flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={sections.includes(s)}
                onChange={() => toggleSection(s)}
              />
              {s}
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white/10 px-4 py-2 font-medium hover:bg-white/20"
        >
          {loading ? "Generating…" : "Generate Resume (−1 credit)"}
        </button>

        {error && (
          <p className="rounded bg-red-500/10 p-2 text-sm text-red-300 mt-2">
            {error}
          </p>
        )}
      </form>

      {/* Right: Preview */}
      <div className="rounded-xl border p-4">
        <h2 className="mb-3 text-lg font-semibold">Preview</h2>

        {!data ? (
          <p className="text-sm opacity-70">Your AI resume will appear here.</p>
        ) : (
          <>
            <div className="max-h-[70vh] overflow-auto rounded border bg-white p-0 text-black">
              {/* Each template renders a node with id="resume" so we can export its HTML */}
              {template === "minimal" ? <TemplateMinimal data={data} /> : null}
              {template === "elegant" ? <TemplateElegant data={data} /> : null}
            </div>

            <div className="mt-3">
              <button
                className="rounded border px-3 py-2 hover:bg-white/10"
                onClick={onDownloadDocx}
              >
                Download as Word (.docx)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
