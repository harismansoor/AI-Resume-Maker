"use client";
import { useEffect } from "react";

type Props = {
  open: boolean;
  title?: string;
  entityName?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDeleteModal({
  open,
  title = "Delete",
  entityName = "this item",
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    if (open) window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900 p-6 shadow-xl">
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>
        <p className="mb-6 text-sm text-neutral-300">
          Are you sure you want to delete {entityName}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl bg-neutral-700 px-4 py-2 hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
