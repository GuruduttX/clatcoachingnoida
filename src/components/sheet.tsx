"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "motion/react";
import { XIcon } from "@phosphor-icons/react";
import { useMediaQuery } from "@/lib/use-media-query";

// Bottom sheet on phones (drag the handle down to dismiss), centred dialog on desktop.
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <SheetPanel key="sheet" onClose={onClose} title={title} description={description}>
          {children}
        </SheetPanel>
      )}
    </AnimatePresence>
  );
}

function SheetPanel({
  onClose,
  title,
  description,
  children,
}: {
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const dragControls = useDragControls();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.y > 110 || info.velocity.y > 600) onClose();
  }

  const panelMotion = isDesktop
    ? {
        initial: { opacity: 0, y: 16, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.97 },
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {
        initial: { y: "100%" },
        animate: { y: 0 },
        exit: { y: "100%" },
        transition: { type: "spring" as const, stiffness: 400, damping: 40 },
      };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        {...panelMotion}
        drag={isDesktop ? false : "y"}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={onDragEnd}
        className="relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-[30px] bg-paper outline-none md:max-w-[440px] md:rounded-[30px] md:shadow-lift"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div
          className="sticky top-0 z-10 touch-none bg-paper/95 px-5 pt-2.5 backdrop-blur md:pt-5"
          onPointerDown={(e) => !isDesktop && dragControls.start(e)}
        >
          <div className="mx-auto mb-3 h-[5px] w-10 rounded-full bg-line-strong md:hidden" />
          <div className="flex items-start justify-between gap-4 pb-3">
            <div>
              <h2 id={titleId} className="font-display text-[26px] font-bold leading-tight tracking-[-0.02em]">
                {title}
              </h2>
              {description && <p className="mt-1 text-sm text-ink-2">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink-2 transition active:scale-90"
            >
              <XIcon size={18} weight="bold" />
            </button>
          </div>
        </div>
        <div className="px-5 pt-2">{children}</div>
      </motion.div>
    </div>
  );
}
