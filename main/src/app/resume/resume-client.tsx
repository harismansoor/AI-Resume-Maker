"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

type ResumeListItem = {
  id: string;
  title: string;
  template: string;
  version?: number;
  created_at: string;
  updated_at: string;
};

type ApiListResponse = {
  data?: ResumeListItem[];
  error?: string;
};

export default function ResumesClient() {
  const [items, setItems] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resumes", { cache: "no-store" });
      const json = (await res.json()) as ApiListResponse;
      setItems(Array.isArray(json?.data) ? json.data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(id: string) {
    setConfirmId(null);
    const prev = items;
    // optimistic update
    setItems((curr) => curr.filter((x) => x.id !== id));

    const res = await fetch(`/api/resumes?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      // rollback on failure
      setItems(prev);
      alert("Failed to delete resume");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Resumes</h1>
        <Link
          href="/resume"
          className="rounded-xl bg-neutral-700 px-3 py-2 hover:bg-neutral-600"
        >
          New Resume
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-neutral-800"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 p-8 text-neutral-400">
          No resumes yet. Create one from the builder or import a file.
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between rounded-xl bg-neutral-900 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 truncate font-medium">
                  <span className="truncate">
                    {it.title || "Untitled resume"}
                  </span>
                  {typeof it.version === "number" && (
                    <span className="shrink-0 rounded bg-neutral-800 px-2 py-0.5 text-[10px] tracking-wide">
                      v{it.version}
                    </span>
                  )}
                  <span className="shrink-0 rounded border border-neutral-700 px-2 py-0.5 text-[10px] text-neutral-300">
                    {it.template}
                  </span>
                </div>
                <div className="mt-1 text-xs text-neutral-400">
                  {new Date(it.updated_at ?? it.created_at).toLocaleString()}
                </div>
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <Link
                  href={`/resume?id=${it.id}`}
                  className="rounded-xl bg-neutral-700 px-3 py-2 text-sm hover:bg-neutral-600"
                >
                  Open
                </Link>
                <button
                  onClick={() => setConfirmId(it.id)}
                  className="rounded-xl bg-red-600 px-3 py-2 text-sm hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteModal
        open={!!confirmId}
        title="Delete resume"
        entityName="this resume"
        onCancel={() => setConfirmId(null)}
        onConfirm={() => confirmId && onDelete(confirmId)}
      />
    </div>
  );
}
