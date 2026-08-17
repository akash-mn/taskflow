import { PrismaClient, Priority } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Wipe existing data (dev-friendly, idempotent seed)
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();

  const board = await prisma.board.create({
    data: { name: "TaskFlow Demo Board" },
  });

  const [todo, inProgress, done] = await Promise.all([
    prisma.column.create({
      data: { name: "To Do", order: 0, boardId: board.id },
    }),
    prisma.column.create({
      data: { name: "In Progress", order: 1, boardId: board.id },
    }),
    prisma.column.create({
      data: { name: "Done", order: 2, boardId: board.id },
    }),
  ]);

  await prisma.task.createMany({
    data: [
      {
        title: "Set up project repo",
        description: "Initialize Next.js app, Tailwind, and Prisma.",
        priority: Priority.HIGH,
        columnId: done.id,
      },
      {
        title: "Design database schema",
        description: "Board → Column → Task with foreign keys.",
        priority: Priority.HIGH,
        columnId: done.id,
      },
      {
        title: "Build task creation form",
        description: "Title required, description + priority optional.",
        priority: Priority.MEDIUM,
        columnId: inProgress.id,
      },
      {
        title: "Wire up drag/drop or dropdown move control",
        description: null,
        priority: Priority.MEDIUM,
        columnId: inProgress.id,
      },
      {
        title: "Add priority filter",
        description: "Filter visible tasks by Low / Medium / High.",
        priority: Priority.LOW,
        columnId: todo.id,
      },
      {
        title: "Write backend tests",
        description: "Validation, move logic, and a direct DB query test.",
        priority: Priority.HIGH,
        columnId: todo.id,
      },
      {
        title: "Deploy to Vercel",
        description: "Point DATABASE_URL at the Supabase Postgres instance.",
        priority: Priority.MEDIUM,
        columnId: todo.id,
      },
    ],
  });

  console.log("Seed complete:", {
    board: board.name,
    columns: [todo.name, inProgress.name, done.name],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
