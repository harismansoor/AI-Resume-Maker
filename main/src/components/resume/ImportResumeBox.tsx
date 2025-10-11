"use client";

import React from "react";

export type ImportedData = {
  name?: string;
  role?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    links?: string[];
  };
  summary?: string;
  skills?: string[];
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    year?: string;
    details?: string[];
  }>;
  projects?: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    bullets?: string[];
  }>;
  achievements?: string[];
  certifications?: string[];
  languages?: string[];
};

type Props = {
  onImported: (data: ImportedData) => void;
};

export default function ImportResumeBox({ onImported }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic guard
    const okTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!okTypes.includes(file.type) && !/\.(pdf|docx)$/i.test(file.name)) {
      setError("Please upload a .pdf or .docx file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Max 10 MB.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/import", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Import failed");
      onImported(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
      // allow re-uploading the same file
      e.target.value = "";
    }
  }

  return (
    <div className="rounded border p-3 mb-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Import Existing Résumé</div>
          <p className="text-xs opacity-70">
            Upload a .docx or .pdf. We’ll extract and load it into the template.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onChange}
            disabled={loading}
          />
          {loading ? "Importing…" : "Choose File"}
        </label>
      </div>
      {error && (
        <p className="mt-2 rounded bg-red-500/10 border border-red-500/40 text-red-300 text-xs p-2">
          {error}
        </p>
      )}
    </div>
  );
}
