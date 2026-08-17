export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  columnId: string;
  createdAt: string;
  updatedAt: string;
};

export type Column = {
  id: string;
  name: string;
  order: number;
  boardId: string;
  tasks: Task[];
};

export type Board = {
  id: string;
  name: string;
  columns: Column[];
};

export const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];
