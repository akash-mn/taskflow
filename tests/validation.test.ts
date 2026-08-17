import { describe, it, expect } from "vitest";
import { createTaskSchema, updateTaskSchema } from "@/lib/validation";

describe("createTaskSchema", () => {
  it("rejects an empty title", () => {
    const result = createTaskSchema.safeParse({
      title: "",
      columnId: "col_1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only title", () => {
    const result = createTaskSchema.safeParse({
      title: "   ",
      columnId: "col_1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing columnId", () => {
    const result = createTaskSchema.safeParse({ title: "Do the thing" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid task and defaults priority to MEDIUM", () => {
    const result = createTaskSchema.safeParse({
      title: "Ship the feature",
      columnId: "col_1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe("MEDIUM");
    }
  });

  it("trims whitespace from the title", () => {
    const result = createTaskSchema.safeParse({
      title: "  Ship the feature  ",
      columnId: "col_1",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Ship the feature");
    }
  });

  it("rejects an invalid priority value", () => {
    const result = createTaskSchema.safeParse({
      title: "Task",
      columnId: "col_1",
      priority: "URGENT",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("rejects an empty title on edit", () => {
    const result = updateTaskSchema.safeParse({ title: "" });
    expect(result.success).toBe(false);
  });

  it("allows a partial update with just a columnId (move)", () => {
    const result = updateTaskSchema.safeParse({ columnId: "col_2" });
    expect(result.success).toBe(true);
  });
});
