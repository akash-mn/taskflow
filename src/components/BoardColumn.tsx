"use client";

import type { Column, Task } from "@/types";
import TaskCard from "@/components/TaskCard";

const COLUMN_ACCENTS = [
  "col-accent-purple",
  "col-accent-indigo",
  "col-accent-blue",
  "col-accent-green",
  "col-accent-orange",
  "col-accent-pink",
  "col-accent-cyan",
];

export default function BoardColumn({
  column,
  allColumns,
  visibleTasks,
  totalTaskCount,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: {
  column: Column;
  allColumns: Column[];
  visibleTasks: Task[];
  totalTaskCount: number;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onMoveTask: (task: Task, columnId: string) => void;
}) {
  const accentClass = COLUMN_ACCENTS[column.order % COLUMN_ACCENTS.length];

  return (
    <div className="board-column">
      {/* Column Header */}
      <div className="column-header">
        <div className="column-header-left">
          <div className={`column-accent ${accentClass}`} />
          <h2 className="column-name">{column.name}</h2>
        </div>
        <div className="column-actions">
          <button
            onClick={onAddTask}
            aria-label={`Add task to ${column.name}`}
            className="col-action-btn add-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>
          <button
            aria-label={`More options for ${column.name}`}
            className="col-action-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM8.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM15.5 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Column Meta */}
      <div className="column-meta">
        <span>{totalTaskCount} Task{totalTaskCount !== 1 ? "s" : ""}</span>
        <span>Updated just now</span>
      </div>

      {/* Tasks */}
      <div className="column-tasks">
        {visibleTasks.length === 0 && (
          <p className="column-empty">
            {totalTaskCount === 0 ? "No tasks yet — add one!" : "No tasks match the filter"}
          </p>
        )}
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            columns={allColumns}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task)}
            onMove={(columnId) => onMoveTask(task, columnId)}
          />
        ))}
      </div>
    </div>
  );
}
