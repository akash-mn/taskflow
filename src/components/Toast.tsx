"use client";

import { useEffect } from "react";

export type ToastMessage = {
  id: number;
  text: string;
  variant: "error" | "success";
};

export default function Toast({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className={`toast-item ${toast.variant === "success" ? "toast-success" : "toast-error"}`}
      onClick={() => onDismiss(toast.id)}
      style={{ cursor: "pointer" }}
    >
      {toast.variant === "success" ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ flexShrink: 0 }}>
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" style={{ flexShrink: 0 }}>
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
      )}
      <span>{toast.text}</span>
    </div>
  );
}
