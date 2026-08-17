"use client";

import { useState } from "react";
import type { Priority, Task } from "@/types";
import { PRIORITIES } from "@/types";

export type TaskFormValues = {
  title: string;
  description: string;
  priority: Priority;
};

export default function TaskModal({
  open,
  mode,
  initial,
  columnName,
  submitting,
  onSubmit,
  onClose,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Task | null;
  columnName?: string;
  submitting: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "MEDIUM");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), priority });
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 className="modal-title">
            {mode === "create" ? "Create New Task" : "Edit Task"}
            {columnName && (
              <span className="modal-subtitle">in {columnName}</span>
            )}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--text-tertiary)",
              cursor: "pointer",
            }}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Title <span className="form-required">*</span>
            </label>
            <input
              id="task-title"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Lead Qualification"
              className="form-input"
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional details…"
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-priority" className="form-label">
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="form-select"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0) + p.slice(1).toLowerCase()} Priority
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting
                ? "Saving…"
                : mode === "create"
                ? "Create Task"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
