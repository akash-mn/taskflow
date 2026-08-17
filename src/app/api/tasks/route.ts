import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createTaskSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    // Never trust the client — empty/whitespace titles are rejected here
    // regardless of what the frontend form already checked.
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  try {
    const column = await prisma.column.findUnique({
      where: { id: parsed.data.columnId },
    });
    if (!column) {
      return NextResponse.json({ error: "Column not found" }, { status: 404 });
    }

    const task = await prisma.task.create({ data: parsed.data });
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks failed:", err);
    return NextResponse.json(
      { error: "Failed to create task. Please try again." },
      { status: 500 }
    );
  }
}
