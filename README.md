# TaskFlow
![TaskFlow Dashboard Overview](screenshots/Screenshot (3499).png)
*Overview of the TaskFlow board showing columns and tasks.*

![TaskFlow Task List](screenshots/Screenshot (3500).png)
*Detailed view of tasks with priority and column placement.*

A lightweight Trello-style task board — Board → Columns → Tasks — built for the
take-home assignment. Next.js 16 (App Router) frontend and backend in one
project, PostgreSQL (via Supabase) as the database, Prisma as the query layer.

**Stack:** Next.js 16 (TypeScript, App Router) · Tailwind CSS 4 · Prisma 6 ·
PostgreSQL (Supabase) · Zod (validation) · Vitest (tests)

No login/auth — intentionally, since the assignment lists user accounts as
out of scope.

---

## 1. Setup (from a fresh clone)

### Prerequisites
- Node.js 20+
- A PostgreSQL database. The easiest path is a free [Supabase](https://supabase.com) project; any Postgres works.

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure your database connection
cp .env.example .env
# then edit .env and paste in your Supabase (or other Postgres) connection strings

# 3. Generate the Prisma client
npx prisma generate

# 4. Create the database tables
npx prisma migrate dev --name init

# 5. Seed sample data (a demo board with 3 columns and 7 tasks)
npm run seed

# 6. Start the app
npm run dev
```

Open http://localhost:3000 — you should see "TaskFlow Demo Board" with
seeded tasks across To Do / In Progress / Done.

> If you skip step 5, the app still works — the first page load
> auto-creates an empty default board with the three standard columns
> (see `src/lib/board.ts`), so a fresh database is never a blank error page.

### Running tests

```bash
npm test
```

- `tests/validation.test.ts` runs standalone (no DB needed) — covers title
  validation (empty/whitespace titles rejected, defaults applied, etc.).
- `tests/db.test.ts` hits the real database directly: it creates a temporary
  test board, moves a task between columns and asserts the column updates,
  and calls both raw-SQL query functions directly and checks the rows they
  return. It automatically skips if `DATABASE_URL` isn't set, so `npm test`
  never fails on a checkout with no database yet — but with your `.env`
  configured it exercises the real thing.

### Deploying

The easiest path is Vercel:
1. Push this repo to GitHub and import it in Vercel.
2. Add `DATABASE_URL` and `DIRECT_URL` as environment variables (same values as your `.env`).
3. Deploy. Then run `npx prisma migrate deploy` once (locally, pointed at the
   production DB, or via a one-off Vercel deploy hook) to apply migrations,
   and `npm run seed` if you want sample data in production.

---

## 2. Database

Schema lives in [`prisma/schema.prisma`](./prisma/schema.prisma) — this is
the source of truth; Prisma generates `migrations/*/migration.sql` from it,
which is the literal `CREATE TABLE` SQL that gets run against Postgres.

```
Board (boards)
  id          text primary key
  name        text not null
  created_at  timestamp not null default now()

Column (columns)
  id          text primary key
  name        text not null
  order       int not null default 0
  board_id    text not null  -> references boards(id) on delete cascade
  created_at  timestamp not null default now()

Task (tasks)
  id           text primary key
  title        text not null
  description  text
  priority     "Priority" enum ('LOW','MEDIUM','HIGH') not null default 'MEDIUM'
  column_id    text not null  -> references columns(id) on delete cascade
  created_at   timestamp not null default now()
  updated_at   timestamp not null
```

A task's "status" is simply which column it belongs to (`column_id`) — there's
no separate status field, since that would just be a second, redundant
foreign key to duplicate what the column relation already expresses.

### The two non-trivial queries

Both live in [`src/lib/queries.ts`](./src/lib/queries.ts) as hand-written SQL via
Prisma's `$queryRaw` (not `findMany` + counting in JS), and are exercised
directly in `tests/db.test.ts`:

**Tasks per column, for a board** — `GET /api/stats/tasks-per-column`
```sql
SELECT c.id AS column_id, c.name AS column_name, COUNT(t.id) AS task_count
FROM columns c
LEFT JOIN tasks t ON t.column_id = c.id
WHERE c.board_id = $1
GROUP BY c.id, c.name, c."order"
ORDER BY c."order" ASC
```
(LEFT JOIN so empty columns still show up with a count of 0.)

**Tasks by priority for a board, newest first** — `GET /api/stats/tasks-by-priority?priority=HIGH`
```sql
SELECT t.id, t.title, t.priority, t.column_id, c.name AS column_name, t.created_at
FROM tasks t
JOIN columns c ON c.id = t.column_id
WHERE c.board_id = $1 AND t.priority = $2
ORDER BY t.created_at DESC
```

### Seed data

[`prisma/seed.ts`](./prisma/seed.ts) wipes and recreates one demo board with
3 columns and 7 tasks spread across all three priorities, so `npm run seed`
always leaves the database in a known, non-empty state.

---

## 3. Notable decisions / assumptions

- **Single board, auto-provisioned.** The spec asks to "view a board," not
  manage multiple boards, so the UI always shows one board and the schema
  supports multiple boards without the UI needing to expose that yet.
- **Move via dropdown, not drag-and-drop.** Per the assignment's own
  guidance ("a working dropdown beats a broken drag-and-drop"), each task
  card has a column `<select>`. Drag-and-drop was the one stretch goal I
  considered but skipped in favor of spending remaining time on tests and
  error handling.
- **Filtering happens client-side** against the already-loaded board data
  (fast, no extra round trip) — search is included as the "nice to have."
  The two required *analytical* queries (counts, priority) are separate,
  dedicated endpoints/functions that hit the DB directly, since that's what
  section 2.5 is actually checking.
- **Optimistic move updates.** Moving a task updates the UI immediately and
  rolls back with an error toast if the request fails, so drag-free moving
  still feels responsive.
- **No soft deletes / audit trail** — out of scope per the brief, deletes are
  hard deletes.

## 4. What I'd add with more time

- Drag-and-drop (react-dnd / dnd-kit) as a progressive enhancement over the
  dropdown, keeping the dropdown as a fallback for accessibility.
- Column reordering and the ability to create/rename/delete columns from the UI.
- Per-board switching in the UI now that the schema already supports it.
- Optimistic updates for create/edit/delete (currently those refetch the
  whole board; move is the only fully optimistic one).
- Rate limiting / basic abuse protection on the API routes if this were ever
  exposed beyond a single team's internal use.

## 5. Time spent

Roughly 4–5 hours across schema design, API routes, the frontend, and tests/README.

## 6. Something I found interesting

Digging into Prisma's raw-SQL escape hatch (`$queryRaw`) for the two required
queries was a good reminder of how much an ORM's default `findMany` +
`_count` conveniences quietly assume — e.g. getting a LEFT JOIN behavior
(so zero-task columns still appear) out of Prisma's relational query API
isn't as direct as just writing the SQL by hand.
