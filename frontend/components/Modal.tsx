"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Reusable rounded-xl modal built on the native <dialog> element —
 * focusable, Esc-dismissable, backdrop click closes. Flat Surface card,
 * no shadows, per the design system.
 */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open ]);

  function onBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === ref.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={onBackdropClick}
      aria-label={title}
      className="m-auto w-full max-w-lg rounded-xl border border-slate-700 bg-brand-surface p-0 text-slate-50 backdrop:bg-black/60"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-sora text-xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="btn-ghost !px-3 !py-1"
          >
            ✕
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}
