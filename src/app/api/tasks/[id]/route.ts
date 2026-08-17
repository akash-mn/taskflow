import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { updateTaskSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH also handles "move" — moving a task is just updating its columnId,
// same as editing title/description/priority.
export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "No fields provided to update" },
      { status: 400 }
    );
  }

  try {
    if (parsed.data.columnId) {
      const column = await prisma.column.findUnique({
        where: { id: parsed.data.columnId },
      });
      if (!column) {
        return NextResponse.json(
          { error: "Target column not found" },
          { status: 404 }
        );
      }
    }

    const task = await prisma.task.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error(`PATCH /api/tasks/${id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to update task. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error(`DELETE /api/tasks/${id} failed:`, err);
    return NextResponse.json(
      { error: "Failed to delete task. Please try again." },
      { status: 500 }
    );
  }
}
