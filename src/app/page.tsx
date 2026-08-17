"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { Board, Priority, Task } from "@/types";
import { api, ApiError } from "@/lib/api";
import BoardColumn from "@/components/BoardColumn";
import TaskModal, { type TaskFormValues } from "@/components/TaskModal";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast, { type ToastMessage } from "@/components/Toast";
import Sidebar from "@/components/Sidebar";

type ModalState =
  | { mode: "closed" }
  | { mode: "create"; columnId: string }
  | { mode: "edit"; task: Task };

export default function Home() {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const [priorityFilter, setPriorityFilter] = useState<Priority | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const [modal, setModal] = useState<ModalState>({ mode: "closed" });
  const [submitting, setSubmitting] = useState(false);
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const pushToast = useCallback(
    (text: string, variant: ToastMessage["variant"] = "error") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, text, variant }]);
    },
    []
  );
  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadBoard = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.get<Board>("/api/board");
      setBoard(data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong loading the board.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBoard();
  }, [loadBoard]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const filteredColumns = useMemo(() => {
    if (!board) return [];
    const query = search.trim().toLowerCase();
    return board.columns.map((column) => ({
      column,
      visibleTasks: column.tasks.filter((task) => {
        const matchesPriority =
          priorityFilter === "ALL" || task.priority === priorityFilter;
        const matchesSearch =
          query.length === 0 || task.title.toLowerCase().includes(query);
        return matchesPriority && matchesSearch;
      }),
    }));
  }, [board, priorityFilter, search]);

  async function handleCreate(values: TaskFormValues, columnId: string) {
    setSubmitting(true);
    try {
      await api.post("/api/tasks", { ...values, columnId });
      setModal({ mode: "closed" });
      await loadBoard();
      pushToast("Task created successfully.", "success");
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : "Failed to create task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(values: TaskFormValues, taskId: string) {
    setSubmitting(true);
    try {
      await api.patch(`/api/tasks/${taskId}`, values);
      setModal({ mode: "closed" });
      await loadBoard();
      pushToast("Task updated successfully.", "success");
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : "Failed to update task.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMove(task: Task, columnId: string) {
    if (columnId === task.columnId || !board) return;
    const previousBoard = board;
    setBoard({
      ...board,
      columns: board.columns.map((c) => ({
        ...c,
        tasks:
          c.id === task.columnId
            ? c.tasks.filter((t) => t.id !== task.id)
            : c.id === columnId
            ? [{ ...task, columnId }, ...c.tasks]
            : c.tasks,
      })),
    });

    try {
      await api.patch(`/api/tasks/${task.id}`, { columnId });
    } catch (err) {
      setBoard(previousBoard);
      pushToast(err instanceof ApiError ? err.message : "Failed to move task.");
    }
  }

  async function handleDelete() {
    if (!taskPendingDelete) return;
    const task = taskPendingDelete;
    setTaskPendingDelete(null);
    try {
      await api.delete(`/api/tasks/${task.id}`);
      await loadBoard();
      pushToast("Task deleted.", "success");
    } catch (err) {
      pushToast(err instanceof ApiError ? err.message : "Failed to delete task.");
    }
  }

  const totalTasks = board?.columns.reduce((sum, col) => sum + col.tasks.length, 0) ?? 0;

  return (
    <div className="app-layout" data-theme={theme}>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Sidebar */}
      <Sidebar board={board} />

      {/* Main area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <h1 className="topbar-title">{board?.name ?? "TaskFlow"}</h1>
            <p className="topbar-subtitle">
              {totalTasks} tasks{board ? `, updated just now` : ""}
            </p>
          </div>
          <div className="topbar-right">
            {/* Theme toggle */}
            <button
              className="theme-toggle"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 0 1 .26.77 7 7 0 0 0 9.958 7.967.75.75 0 0 1 1.067.853A8.5 8.5 0 1 1 6.647 1.921a.75.75 0 0 1 .808.083Z" clipRule="evenodd" />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>

            {/* Add Task button */}
            {board && (
              <button
                className="btn-add-task"
                onClick={() =>
                  board.columns[0] &&
                  setModal({ mode: "create", columnId: board.columns[0].id })
                }
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                New Task
              </button>
            )}
          </div>
        </header>

        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span className="breadcrumb-item">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M8.543 2.232a.75.75 0 0 0-1.085 0l-5.25 5.5A.75.75 0 0 0 2.75 9H4v4a1 1 0 0 0 1 1h2v-3h2v3h2a1 1 0 0 0 1-1V9h1.25a.75.75 0 0 0 .543-1.268l-5.25-5.5Z" />
            </svg>
            Home
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h5.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12A1.5 1.5 0 0 1 14 5.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 3 12.5v-9Z" />
            </svg>
            {board?.name ?? "TaskFlow"}
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item active">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M2.5 3.5A1.5 1.5 0 0 1 4 2h8a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 12 14H4a1.5 1.5 0 0 1-1.5-1.5v-9Zm6.75.25a.75.75 0 0 0-1.5 0v3h-3a.75.75 0 0 0 0 1.5h3v3a.75.75 0 0 0 1.5 0v-3h3a.75.75 0 0 0 0-1.5h-3v-3Z" clipRule="evenodd" />
            </svg>
            Task
          </span>
        </nav>

        {/* Toolbar */}
        <div className="board-toolbar">
          <button className="toolbar-btn active" aria-label="Pipeline view">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z" clipRule="evenodd" />
            </svg>
            Pipeline view
          </button>

          {/* Filter / Search */}
          <div className="filter-bar" style={{ marginLeft: "auto" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                style={{ position: "absolute", left: 8, color: "var(--text-tertiary)", pointerEvents: "none" }}
              >
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks…"
                className="filter-input"
              />
            </div>

            <button className="toolbar-btn" aria-label="Filter">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.59l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z" clipRule="evenodd" />
              </svg>
              Filter
            </button>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | "ALL")}
              className="filter-select"
              aria-label="Filter by priority"
            >
              <option value="ALL">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <button className="toolbar-btn" aria-label="Sort">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M2.24 6.8a.75.75 0 0 0 1.06-.04l1.95-2.1v8.59a.75.75 0 0 0 1.5 0V4.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0L2.2 5.74a.75.75 0 0 0 .04 1.06Zm8 6.4a.75.75 0 0 0-.04 1.06l3.25 3.5a.75.75 0 0 0 1.1 0l3.25-3.5a.75.75 0 1 0-1.1-1.02l-1.95 2.1V6.75a.75.75 0 0 0-1.5 0v8.59l-1.95-2.1a.75.75 0 0 0-1.06-.04Z" clipRule="evenodd" />
              </svg>
              Sort
            </button>
          </div>
        </div>

        {/* Board content */}
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p className="loading-text">Loading board…</p>
          </div>
        )}

        {!loading && loadError && (
          <div className="error-state">
            <div className="error-card">
              <p className="error-title">Couldn&apos;t load the board</p>
              <p className="error-msg">{loadError}</p>
              <button
                className="btn-primary"
                onClick={() => {
                  setLoading(true);
                  loadBoard();
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!loading && !loadError && board && (
          <div className="board-area">
            {filteredColumns.map(({ column, visibleTasks }) => (
              <BoardColumn
                key={column.id}
                column={column}
                allColumns={board.columns}
                visibleTasks={visibleTasks}
                totalTaskCount={column.tasks.length}
                onAddTask={() => setModal({ mode: "create", columnId: column.id })}
                onEditTask={(task) => setModal({ mode: "edit", task })}
                onDeleteTask={(task) => setTaskPendingDelete(task)}
                onMoveTask={handleMove}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {modal.mode !== "closed" && (
        <TaskModal
          key={modal.mode === "edit" ? modal.task.id : `create-${modal.columnId}`}
          open
          mode={modal.mode === "edit" ? "edit" : "create"}
          initial={modal.mode === "edit" ? modal.task : null}
          columnName={
            modal.mode === "create"
              ? board?.columns.find((c) => c.id === modal.columnId)?.name
              : undefined
          }
          submitting={submitting}
          onClose={() => setModal({ mode: "closed" })}
          onSubmit={(values) => {
            if (modal.mode === "create") handleCreate(values, modal.columnId);
            if (modal.mode === "edit") handleEdit(values, modal.task.id);
          }}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={taskPendingDelete !== null}
        title="Delete this task?"
        description={
          taskPendingDelete
            ? `"${taskPendingDelete.title}" will be permanently removed.`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setTaskPendingDelete(null)}
      />
    </div>
  );
}
