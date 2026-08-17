import { z } from "zod";

export const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

// Title is required and can't be just whitespace — enforced here so both
// the API route and the frontend form share one source of truth.
export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  priority: priorityEnum.optional().default("MEDIUM"),
  columnId: z.string().min(1, "columnId is required"),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or fewer")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  priority: priorityEnum.optional(),
  columnId: z.string().min(1, "columnId is required").optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
