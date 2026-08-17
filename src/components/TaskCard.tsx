"use client";

import type { Column, Task } from "@/types";

const PRIORITY_CLASS: Record<Task["priority"], string> = {
  LOW: "priority-low",
  MEDIUM: "priority-medium",
  HIGH: "priority-high",
};

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  LOW: "Low Priority",
  MEDIUM: "Moderate Priority",
  HIGH: "High Priority",
};

export default function TaskCard({
  task,
  columns,
  onEdit,
  onDelete,
  onMove,
}: {
  task: Task;
  columns: Column[];
  onEdit: () => void;
  onDelete: () => void;
  onMove: (columnId: string) => void;
}) {
  const priorityClass = PRIORITY_CLASS[task.priority];
  const priorityLabel = PRIORITY_LABEL[task.priority];

  // Current column name for the status badge
  const currentColumn = columns.find((c) => c.id === task.columnId);
  const columnLabel = currentColumn?.name ?? "Unknown";

  return (
    <div className={`task-card ${priorityClass}`} onClick={onEdit}>
      {/* Coloured top stripe */}
      <div className="task-card-priority-bar" />

      {/* Card body */}
      <div className="task-card-top">
        <span className="task-priority-label">{priorityLabel}</span>
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
      </div>

      {/* Divider */}
      <div className="task-card-divider" />

      {/* Status row — always visible */}
      <div
        className="task-card-status-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Status badge with hidden <select> overlay */}
        <label className="task-status-badge" aria-label="Move task to column">
          {/* Dot indicator */}
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background:
                task.priority === "LOW"
                  ? "#22c55e"
                  : task.priority === "MEDIUM"
                  ? "#f97316"
                  : "#ef4444",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {columnLabel}
          {/* Hidden native select for moving */}
          <select
            value={task.columnId}
            onChange={(e) => onMove(e.target.value)}
            aria-label={`Move "${task.title}" to another column`}
          >
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        {/* Edit / Delete */}
        <div className="task-card-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label={`Edit "${task.title}"`}
            className="task-action-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.506l-3 .8a.5.5 0 0 1-.612-.612l.8-3a2 2 0 0 1 .506-.878l8.5-8.5Z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label={`Delete "${task.title}"`}
            className="task-action-btn delete-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Date row — always visible */}
      <div className="task-card-date-row">
        <svg viewBox="0 0 16 16" fill="currentColor" style={{ width: 11, height: 11, flexShrink: 0 }}>
          <path fillRule="evenodd" d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0ZM8 3a.75.75 0 0 1 .75.75v3.5h2a.75.75 0 0 1 0 1.5H7.25A.75.75 0 0 1 6.5 8V3.75A.75.75 0 0 1 8 3Z" clipRule="evenodd" />
        </svg>
        {new Date(task.createdAt).toLocaleDateString("en-GB")}
      </div>
    </div>
  );
}
