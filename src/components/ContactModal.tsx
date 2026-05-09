"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { ContactForm } from "@/components/ContactForm";
import { track } from "@/lib/analytics";
import { site } from "@/lib/site";

type ContactModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(
  null,
);

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) {
    throw new Error(
      "useContactModal must be used inside <ContactModalProvider>",
    );
  }
  return ctx;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  const open = useCallback(() => {
    triggerRef.current = (document.activeElement as HTMLElement) ?? null;
    setIsOpen(true);
    track("contact-modal-opened");
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Body scroll lock + Esc + focus trap while open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables =
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, close]);

  // Move focus into the dialog on open; restore on close.
  useEffect(() => {
    if (!isOpen) {
      triggerRef.current?.focus();
      return;
    }
    const t = window.setTimeout(() => {
      const focusables =
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      focusables?.[0]?.focus();
    }, 50);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  return (
    <ContactModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {mounted
        ? createPortal(
            <AnimatePresence>
              {isOpen ? (
                <div
                  className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto px-4 py-10 sm:items-center sm:py-16"
                  role="presentation"
                >
                  <motion.div
                    aria-hidden="true"
                    className="fixed inset-0 bg-brand-ink/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    onClick={close}
                  />
                  <motion.div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="contact-modal-title"
                    aria-describedby="contact-modal-desc"
                    className="relative z-10 my-auto w-full max-w-2xl rounded-2xl bg-brand-canvas shadow-2xl"
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-start justify-between gap-6 border-b border-brand-line px-6 pb-5 pt-6 sm:px-8 sm:pt-7">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-teal">
                          Start a project
                        </p>
                        <h2
                          id="contact-modal-title"
                          className="mt-3 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl"
                        >
                          Tell us what you&rsquo;re trying to build.
                        </h2>
                        <p
                          id="contact-modal-desc"
                          className="mt-2 text-sm leading-relaxed text-brand-muted"
                        >
                          Most fields are optional — fill what you can. Or
                          email{" "}
                          <a
                            href={`mailto:${site.email}`}
                            className="text-brand-teal underline-offset-4 hover:underline"
                          >
                            {site.email}
                          </a>
                          .
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="-mr-2 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-muted transition-colors hover:bg-brand-line/60 hover:text-brand-ink focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="px-6 pb-8 pt-6 sm:px-8">
                      <ContactForm />
                    </div>
                  </motion.div>
                </div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </ContactModalContext.Provider>
  );
}
