import type { Priority } from "@/types";

const STYLES: Record<Priority, string> = {
  LOW: "bg-slate-100 text-slate-600 ring-slate-200",
  MEDIUM: "bg-amber-100 text-amber-700 ring-amber-200",
  HIGH: "bg-rose-100 text-rose-700 ring-rose-200",
};

const LABELS: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export default function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
