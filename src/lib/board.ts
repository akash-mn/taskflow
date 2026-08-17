import { prisma } from "@/lib/prisma";

const DEFAULT_COLUMNS = ["To Do", "In Progress", "Done"];

/**
 * The assignment only requires viewing "a board" — not multi-board
 * management — so the app auto-provisions one default board (with the
 * standard three columns) the first time it's requested. This means the
 * app also works on a completely fresh database even before `prisma db seed`
 * has been run.
 */
export async function getOrCreateDefaultBoard() {
  const existing = await prisma.board.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existing) return existing;

  return prisma.board.create({
    data: {
      name: "TaskFlow Board",
      columns: {
        create: DEFAULT_COLUMNS.map((name, order) => ({ name, order })),
      },
    },
  });
}

export async function getBoardWithTasks(boardId: string) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });
}
