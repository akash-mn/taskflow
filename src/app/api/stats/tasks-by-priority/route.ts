import { NextResponse } from "next/server";
import { Priority } from "@prisma/client";
import { getOrCreateDefaultBoard } from "@/lib/board";
import { getTasksByPriority } from "@/lib/queries";
import { priorityEnum } from "@/lib/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const priorityParam = searchParams.get("priority");

    const parsedPriority = priorityEnum.safeParse(priorityParam);
    if (!parsedPriority.success) {
      return NextResponse.json(
        { error: "priority query param must be LOW, MEDIUM, or HIGH" },
        { status: 400 }
      );
    }

    const board = boardId ? { id: boardId } : await getOrCreateDefaultBoard();
    const rows = await getTasksByPriority(
      board.id,
      parsedPriority.data as Priority
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/stats/tasks-by-priority failed:", err);
    return NextResponse.json(
      { error: "Failed to load stats. Please try again." },
      { status: 500 }
    );
  }
}
