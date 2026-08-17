import { prisma } from "@/lib/prisma";
import { Priority } from "@prisma/client";

export type TasksPerColumnRow = {
  column_id: string;
  column_name: string;
  task_count: number;
};

/**
 * Query 1: task count per column on a board.
 * A LEFT JOIN + GROUP BY so columns with zero tasks still show up with 0,
 * instead of just fetching every task and counting in JS.
 */
export async function getTasksPerColumn(
  boardId: string
): Promise<TasksPerColumnRow[]> {
  const rows = await prisma.$queryRaw<
    { column_id: string; column_name: string; task_count: bigint }[]
  >`
    SELECT
      c.id AS column_id,
      c.name AS column_name,
      COUNT(t.id) AS task_count
    FROM columns c
    LEFT JOIN tasks t ON t.column_id = c.id
    WHERE c.board_id = ${boardId}
    GROUP BY c.id, c.name, c."order"
    ORDER BY c."order" ASC
  `;

  // Postgres COUNT(...) comes back as bigint via node-postgres; cast to number
  // since these values will always be small enough to be safe.
  return rows.map((r) => ({ ...r, task_count: Number(r.task_count) }));
}

export type TaskByPriorityRow = {
  id: string;
  title: string;
  priority: Priority;
  column_id: string;
  column_name: string;
  created_at: Date;
};

/**
 * Query 2: tasks with a given priority on a board, newest first.
 * Joins tasks -> columns (to scope by board) and orders by created_at DESC.
 */
export async function getTasksByPriority(
  boardId: string,
  priority: Priority
): Promise<TaskByPriorityRow[]> {
  return prisma.$queryRaw<TaskByPriorityRow[]>`
    SELECT
      t.id,
      t.title,
      t.priority,
      t.column_id,
      c.name AS column_name,
      t.created_at
    FROM tasks t
    JOIN columns c ON c.id = t.column_id
    WHERE c.board_id = ${boardId} AND t.priority = ${priority}::"Priority"
    ORDER BY t.created_at DESC
  `;
}
