import { NextResponse } from "next/server";
import { getOrCreateDefaultBoard, getBoardWithTasks } from "@/lib/board";

export async function GET() {
  try {
    const board = await getOrCreateDefaultBoard();
    const full = await getBoardWithTasks(board.id);

    if (!full) {
      return NextResponse.json({ error: "Board not found" }, { status: 404 });
    }

    return NextResponse.json(full, { status: 200 });
  } catch (err) {
    console.error("GET /api/board failed:", err);
    return NextResponse.json(
      { error: "Failed to load board. Please try again." },
      { status: 500 }
    );
  }
}
