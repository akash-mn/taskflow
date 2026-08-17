import { NextResponse } from "next/server";
import { getOrCreateDefaultBoard } from "@/lib/board";
import { getTasksPerColumn } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get("boardId");
    const board = boardId
      ? { id: boardId }
      : await getOrCreateDefaultBoard();

    const rows = await getTasksPerColumn(board.id);
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("GET /api/stats/tasks-per-column failed:", err);
    return NextResponse.json(
      { error: "Failed to load stats. Please try again." },
      { status: 500 }
    );
  }
}
