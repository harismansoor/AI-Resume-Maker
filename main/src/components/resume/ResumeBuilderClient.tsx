"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TemplatePicker } from "@/components/resume/TemplatePicker";
import ImportResumeBox from "@/components/resume/ImportResumeBox";
import TemplateMinimal from "@/components/templates/TemplateMinimal";
import TemplateElegant from "@/components/templates/TemplateElegant";
import TemplateCorporate from "@/components/templates/TemplateCorporate";
import type { ResumeData } from "@/types/resume";
import type { ImportedData } from "@/types/import";

/** Map template names to components */
const TEMPLATE_REGISTRY: Record<string, ComponentType<{ data: ResumeData }>> = {
  Minimal: TemplateMinimal,
  Elegant: TemplateElegant,
  Corporate: TemplateCorporate,
};

/** Sections stored with the resume */
type SectionsJSON = Record<string, boolean>;

/** API payloads / responses */
type ResumePayload = {
  title: string;
  template: string;
  sections: SectionsJSON;
  data: ResumeData;
  parent_id?: string | null;
};

type SaveResponse = { id: string; version?: number; error?: string };

type ResumeRow = {
  id: string;
  title: string;
  template: string;
  sections: Record<string, unknown>;
  data: ResumeData;
  parent_id?: string | null;
  version?: number;
  created_at?: string;
  updated_at?: string;
};

type ResumesGetResponse =
  | { data: ResumeRow[]; error?: string }
  | { data: ResumeRow; error?: string }
  | { error: string };

type GenerateStructuredResponse = { resume: ResumeData; error?: string };

/** Tone & Style types (for generation controls) */
type Tone = "Professional" | "Academic" | "Creative" | "Friendly";
type Style = "Concise" | "Balanced" | "Detailed";

/** Draft helpers (localStorage) */
const DRAFT_KEY = "resume_builder_draft";

type DraftShape = {
  title: string;
  template: string;
  sections: SectionsJSON;
  data: ResumeData;
};

function loadDraft(): DraftShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as DraftShape;
  } catch {}
  return null;
}
function saveDraft(draft: DraftShape) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}
function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

/** Apply sections toggles to the data before rendering */
function applySections(data: ResumeData, sections: SectionsJSON): ResumeData {
  // shallow clone to avoid mutating state
  const out: ResumeData = { ...(data as object) } as ResumeData;

  // Summary
  if (!sections.summary) {
    (out as unknown as { summary?: unknown }).summary = undefined;
  }
  // Skills
  if (!sections.skills) {
    (out as unknown as { skills?: unknown }).skills = [];
  }
  // Experience
  if (!sections.experience) {
    (out as unknown as { experience?: unknown }).experience = [];
  }
  // Projects
  if (!sections.projects) {
    (out as unknown as { projects?: unknown }).projects = [];
  }
  // Education
  if (!sections.education) {
    (out as unknown as { education?: unknown }).education = [];
  }

  return out;
}

export default function ResumeBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentResumeId = useMemo(
    () => searchParams.get("id") ?? null,
    [searchParams]
  );

  // ---- core state ----
  const [title, setTitle] = useState<string>("My Resume");
  const [template, setTemplate] = useState<string>("Minimal");
  const [sections, setSections] = useState<SectionsJSON>({
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
  });

  // Initialize as empty object casted to ResumeData; filled by generate/import/load
  const [data, setData] = useState<ResumeData>({} as ResumeData);

  // ---- ui state ----
  const [prompt, setPrompt] = useState<string>(
    "Software Engineer with 2 years, focus on React/Next.js + Node."
  );
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);

  /** Tone & Style */
  const [tone, setTone] = useState<Tone>("Professional");
  const [style, setStyle] = useState<Style>("Balanced");

  /** Draft presence banner */
  const [hasDraft, setHasDraft] = useState(false);

  // ---- load existing resume by id ----
  useEffect(() => {
    async function loadById(id: string) {
      setLoadingExisting(true);
      try {
        const res = await fetch(`/api/resumes?id=${id}`, { cache: "no-store" });
        const json = (await res.json()) as ResumesGetResponse;

        if ("error" in json && json.error) return;

        let row: ResumeRow | null = null;
        if ("data" in json) {
          const d = (json as { data: unknown }).data;
          if (Array.isArray(d)) {
            row = (d[0] as ResumeRow) ?? null;
          } else if (d && typeof d === "object") {
            row = d as ResumeRow;
          }
        }

        if (row) {
          if (typeof row.title === "string") setTitle(row.title || "My Resume");
          if (typeof row.template === "string")
            setTemplate(row.template || "Minimal");
          if (row.sections && typeof row.sections === "object") {
            const s: SectionsJSON = {};
            for (const [k, v] of Object.entries(row.sections)) {
              s[k] = Boolean(v);
            }
            setSections(s);
          }
          if (row.data && typeof row.data === "object") {
            setData(row.data as ResumeData);
          }
        }
      } finally {
        setLoadingExisting(false);
      }
    }

    if (currentResumeId) void loadById(currentResumeId);
  }, [currentResumeId]);

  // ---- check for draft on mount (new resume only) ----
  useEffect(() => {
    if (currentResumeId) return;
    const draft = loadDraft();
    if (draft) setHasDraft(true);
  }, [currentResumeId]);

  // ---- autosave draft (new resume only) ----
  useEffect(() => {
    if (currentResumeId) return;
    const draft: DraftShape = { title, template, sections, data };
    saveDraft(draft);
  }, [currentResumeId, title, template, sections, data]);

  function restoreDraft() {
    const draft = loadDraft();
    if (!draft) return;
    setTitle(draft.title);
    setTemplate(draft.template);
    setSections(draft.sections);
    setData(draft.data);
    setHasDraft(false);
  }

  // ---- actions ----
  async function onGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-structured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, tone, style }),
      });
      const json = (await res.json()) as GenerateStructuredResponse;
      if (!res.ok || json.error)
        throw new Error(json.error || "Failed to generate");
      setData(json.resume);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Generation failed";
      alert(message);
    } finally {
      setGenerating(false);
    }
  }

  async function onDownloadDocx() {
    setDownloading(true);
    try {
      const container = document.getElementById("resume-preview");
      if (!container) throw new Error("Preview not found");
      const html = container.innerHTML;

      const res = await fetch("/api/export-docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, filename: `${title || "resume"}.docx` }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Export failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "resume"}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Export failed";
      alert(message);
    } finally {
      setDownloading(false);
    }
  }

  async function saveNew() {
    setSaving(true);
    try {
      const payload: ResumePayload = { title, template, sections, data };
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as SaveResponse;
      if (!res.ok || json.error)
        throw new Error(json.error || "Failed to save");
      if (json.id) {
        clearDraft();
        router.push(`/resume?id=${json.id}`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function saveUpdate(id: string) {
    setSaving(true);
    try {
      const payload: ResumePayload = { title, template, sections, data };
      const res = await fetch(`/api/resumes?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Failed to update");
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to update";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  async function saveAsCopy(parentId: string) {
    setSaving(true);
    try {
      const payload: ResumePayload = {
        title,
        template,
        sections,
        data,
        parent_id: parentId,
      };
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as SaveResponse;
      if (!res.ok || json.error)
        throw new Error(json.error || "Failed to save copy");
      if (json.id) {
        clearDraft();
        router.push(`/resume?id=${json.id}`);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save copy";
      alert(message);
    } finally {
      setSaving(false);
    }
  }

  /** Import callback — matches ImportResumeBox props */
  function handleImported(imported: ImportedData) {
    const maybe: unknown = imported as unknown;
    if (maybe && typeof maybe === "object") {
      const obj = maybe as { data?: unknown; title?: unknown };
      if (obj.data && typeof obj.data === "object")
        setData(obj.data as ResumeData);
      if (typeof obj.title === "string") setTitle(obj.title);
    }
  }

  const TemplateComponent =
    TEMPLATE_REGISTRY[template] ?? TEMPLATE_REGISTRY.Minimal;

  // Build effective data with sections applied (live)
  const effectiveData = useMemo(
    () => applySections(data, sections),
    [data, sections]
  );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[240px] flex-1">
          <label className="mb-1 block text-sm text-neutral-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl bg-neutral-900 px-3 py-2 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600"
            placeholder="My Resume"
          />
        </div>

        <div className="min-w-[220px]">
          <label className="mb-1 block text-sm text-neutral-400">
            Template
          </label>
          <TemplatePicker value={template} onChange={setTemplate} />
        </div>

        <div className="flex items-center gap-2">
          {!currentResumeId ? (
            <button
              onClick={saveNew}
              disabled={saving}
              className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          ) : (
            <>
              <button
                onClick={() => saveUpdate(currentResumeId)}
                disabled={saving}
                className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => saveAsCopy(currentResumeId)}
                disabled={saving}
                className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save as Copy"}
              </button>
            </>
          )}
          <button
            onClick={onDownloadDocx}
            disabled={downloading}
            className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600 disabled:opacity-50"
          >
            {downloading ? "Downloading…" : "Download as Word"}
          </button>
        </div>
      </div>

      {/* Draft restore banner */}
      {!currentResumeId && hasDraft && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-yellow-600/40 bg-yellow-900/20 p-3 text-sm">
          <div>A local draft was found for this page.</div>
          <div className="flex gap-2">
            <button
              onClick={restoreDraft}
              className="rounded-xl bg-yellow-700 px-3 py-1 hover:bg-yellow-600"
            >
              Restore draft
            </button>
            <button
              onClick={() => {
                clearDraft();
                setHasDraft(false);
              }}
              className="rounded-xl border border-yellow-700 px-3 py-1 hover:bg-yellow-700/40"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="rounded-xl border border-neutral-800 p-4">
            <div className="mb-2 text-sm text-neutral-400">AI Prompt</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-neutral-900 px-3 py-2 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600"
            />

            {/* Tone & Style controls */}
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <label className="text-sm text-neutral-400">
                Tone
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as Tone)}
                  className="mt-1 w-full rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-neutral-800 focus:ring-neutral-600"
                >
                  <option>Professional</option>
                  <option>Academic</option>
                  <option>Creative</option>
                  <option>Friendly</option>
                </select>
              </label>

              <label className="text-sm text-neutral-400">
                Style
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as Style)}
                  className="mt-1 w-full rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-neutral-800 focus:ring-neutral-600"
                >
                  <option>Concise</option>
                  <option>Balanced</option>
                  <option>Detailed</option>
                </select>
              </label>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={onGenerate}
                disabled={generating}
                className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600 disabled:opacity-50"
              >
                {generating ? "Generating…" : "Generate Resume (−1 credit)"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 p-4">
            <div className="mb-2 text-sm text-neutral-400">Import Resume</div>
            <ImportResumeBox onImported={handleImported} />
          </div>

          <div className="rounded-xl border border-neutral-800 p-4">
            <div className="mb-2 text-sm text-neutral-400">Sections</div>
            <div className="space-y-2">
              {["summary", "skills", "experience", "projects", "education"].map(
                (k) => (
                  <label key={k} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(sections[k])}
                      onChange={(e) =>
                        setSections((s) => ({ ...s, [k]: e.target.checked }))
                      }
                    />
                    <span className="capitalize">{k}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-neutral-400">
              {loadingExisting ? "Loading…" : "Live Preview"}
            </div>
          </div>
          <div
            id="resume-preview"
            className="rounded-xl border border-neutral-800 bg-white p-6 text-black"
          >
            <TemplateComponent data={effectiveData} />
          </div>
        </div>
      </div>
    </div>
  );
}
