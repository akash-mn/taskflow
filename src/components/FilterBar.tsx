"use client";

import type { Priority } from "@/types";
import { PRIORITIES } from "@/types";

export default function FilterBar({
  priority,
  onPriorityChange,
  search,
  onSearchChange,
}: {
  priority: Priority | "ALL";
  onPriorityChange: (value: Priority | "ALL") => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="priority-filter" className="text-sm text-slate-500">
          Priority
        </label>
        <select
          id="priority-filter"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as Priority | "ALL")}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          <option value="ALL">All</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title…"
          className="w-56 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
