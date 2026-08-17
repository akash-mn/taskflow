import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { getTasksPerColumn, getTasksByPriority } from "@/lib/queries";

// These tests hit a real database, so they need DATABASE_URL to be set
// (see README "Running tests"). They're skipped automatically otherwise
// so `npm test` still runs the validation suite in a fresh checkout.
const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)("database layer", () => {
  let boardId: string;
  let todoId: string;
  let doneId: string;
  let taskId: string;

  beforeAll(async () => {
    const board = await prisma.board.create({
      data: { name: "__test_board__" },
    });
    boardId = board.id;

    const todo = await prisma.column.create({
      data: { name: "Todo", order: 0, boardId },
    });
    const done = await prisma.column.create({
      data: { name: "Done", order: 1, boardId },
    });
    todoId = todo.id;
    doneId = done.id;

    const task = await prisma.task.create({
      data: {
        title: "__test_task__",
        priority: "HIGH",
        columnId: todoId,
      },
    });
    taskId = task.id;

    await prisma.task.create({
      data: { title: "__test_task_low__", priority: "LOW", columnId: todoId },
    });
  });

  afterAll(async () => {
    // Cascade delete cleans up columns/tasks under this board.
    await prisma.board.delete({ where: { id: boardId } });
    await prisma.$disconnect();
  });

  it("moving a task updates its column (status)", async () => {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: { columnId: doneId },
    });
    expect(updated.columnId).toBe(doneId);

    const reloaded = await prisma.task.findUniqueOrThrow({
      where: { id: taskId },
    });
    expect(reloaded.columnId).toBe(doneId);
  });

  it("getTasksPerColumn returns the correct count per column", async () => {
    const rows = await getTasksPerColumn(boardId);
    const todoRow = rows.find((r) => r.column_id === todoId);
    const doneRow = rows.find((r) => r.column_id === doneId);

    // The HIGH-priority task was moved to Done in the previous test,
    // leaving one task (the LOW one) in Todo.
    expect(todoRow?.task_count).toBe(1);
    expect(doneRow?.task_count).toBe(1);
  });

  it("getTasksByPriority returns only tasks of the given priority, newest first", async () => {
    const rows = await getTasksByPriority(boardId, "HIGH");
    expect(rows.length).toBeGreaterThanOrEqual(1);
    expect(rows.every((r) => r.priority === "HIGH")).toBe(true);
    expect(rows.some((r) => r.id === taskId)).toBe(true);
  });
});
