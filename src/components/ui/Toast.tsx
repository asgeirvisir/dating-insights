"use client";

import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

export default function Toast({
  message,
  visible,
  onDismiss,
  duration = 3000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  // Hide immediately when visible becomes false (render-time adjustment)
  const [prevVisible, setPrevVisible] = useState(visible);
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (!visible) {
      setShow(false);
    }
  }

  const dismiss = useCallback(() => {
    setShow(false);
    // Wait for the exit animation to finish before calling onDismiss
    setTimeout(onDismiss, 300);
  }, [onDismiss]);

  useEffect(() => {
    if (visible) {
      // Trigger the enter animation on the next frame
      requestAnimationFrame(() => setShow(true));
      const timer = setTimeout(dismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-surface-elevated px-5 py-3 shadow-lg shadow-black/30 border border-neutral-800 font-body text-sm text-content-secondary transition-all duration-300 ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      }`}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="cursor-pointer text-content-muted hover:text-content-primary transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
