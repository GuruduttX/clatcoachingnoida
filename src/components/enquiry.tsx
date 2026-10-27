"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CircleNotchIcon, PaperPlaneTiltIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import { Sheet } from "@/components/sheet";
import { INTERESTS, STAGES } from "@/lib/cms/enquiries";
import { haptic } from "@/lib/haptics";
import { site, whatsappLink } from "@/lib/site";
import { button } from "@/lib/ui";

export type EnquirySource =
  | "enquiry-sheet"
  | "visit"
  | "scholarship"
  | "admissions"
  | "course"
  | "batches"
  | "article"
  | "study-planner"
  | "results"
  | "faculty"
  | "other";

type EnquiryContextValue = { open: (interest?: string, source?: EnquirySource) => void };

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used inside <EnquiryProvider>");
  return ctx;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; interest?: string; source?: EnquirySource; key: number }>({
    open: false,
    key: 0,
  });
  const open = useCallback((interest?: string, source?: EnquirySource) => {
    haptic();
    setState((s) => ({ open: true, interest, source, key: s.key + 1 }));
  }, []);
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  return (
    <EnquiryContext.Provider value={{ open }}>
      {children}
      <Sheet
        open={state.open}
        onClose={close}
        title="Talk to a counsellor"
        description="Leave your number and we'll call you back, usually within a few hours."
      >
        <EnquiryForm key={state.key} interest={state.interest} source={state.source} onDone={close} />
      </Sheet>
    </EnquiryContext.Provider>
  );
}

export const fieldClass =
  "h-12 w-full rounded-2xl border border-transparent bg-mist px-4 text-base outline-none transition placeholder:text-ink-3 focus:border-ink focus:bg-paper";

export function EnquiryForm({
  interest,
  source = "enquiry-sheet",
  onDone,
  submitLabel = "Request a call back",
  compact,
}: {
  interest?: string;
  source?: EnquirySource;
  onDone?: () => void;
  submitLabel?: string;
  /** Name and number only, for inline forms where the full form looks too long. */
  compact?: boolean;
}) {
  const router = useRouter();
  // When the form appeared, so the server can spot instant bot submissions.
  const loadedAt = useRef(0);
  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stage, setStage] = useState<string>();
  const [choice, setChoice] = useState(interest ?? "Not sure yet");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const interestOptions = INTERESTS.includes(choice) ? INTERESTS : [choice, ...INTERESTS];

  const whatsappMessage = [
    "Hi, I'd like a counselling call for the Noida centre.",
    name && `Name: ${name}`,
    stage && `Currently in: ${stage}`,
    `Interested in: ${choice}`,
  ]
    .filter(Boolean)
    .join("\n");

  async function submit(form: HTMLFormElement) {
    setError(null);
    setBusy(true);
    haptic(12);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          stage,
          programInterest: choice,
          source,
          pageUrl: window.location.href,
          formLoadedAt: loadedAt.current,
          company: (form.elements.namedItem("company") as HTMLInputElement | null)?.value,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      onDone?.();
      router.push(`/thank-you?name=${encodeURIComponent(name.split(" ")[0])}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      haptic(30);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      className={compact ? "space-y-4" : "space-y-6 pt-2"}
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      {/* Honeypot: invisible to people, filled in by bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] size-px opacity-0" />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Student&apos;s name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            minLength={2}
            placeholder="e.g. Ananya"
            className={`${fieldClass} mt-2`}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Mobile number</span>
          <span className="relative mt-2 block">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base font-semibold text-ink-3">
              +91
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d\s-]/g, "").slice(0, 14))}
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              required
              placeholder="98765 43210"
              className={`${fieldClass} pl-13 tabular`}
            />
          </span>
        </label>
      </div>

      {!compact && (
        <>
          <ChipGroup label="Currently in" options={STAGES} value={stage} onChange={setStage} />
          <ChipGroup label="Interested in" options={interestOptions} value={choice} onChange={setChoice} />
        </>
      )}

      {error && (
        <p role="alert" className="rounded-2xl bg-brand-tint px-4 py-3 text-sm font-semibold text-brand-deep">
          {error}
        </p>
      )}

      <div className={compact ? "space-y-3" : "space-y-3 pt-1"}>
        <button type="submit" disabled={busy} className={`${button("primary", "lg")} w-full disabled:opacity-70`}>
          {busy ? (
            <CircleNotchIcon size={20} weight="bold" className="animate-spin" />
          ) : (
            <PaperPlaneTiltIcon size={20} weight="fill" />
          )}
          {busy ? "Sending…" : submitLabel}
        </button>
        {compact ? (
          <p className="text-center text-sm text-ink-2">
            Or{" "}
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-line-strong underline-offset-4"
            >
              WhatsApp us
            </a>{" "}
            ·{" "}
            <a href={site.phoneHref} className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
              Call {site.phone}
            </a>
          </p>
        ) : (
          <>
            <a
              href={whatsappLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onDone?.()}
              className={`${button("quiet", "lg")} w-full`}
            >
              <WhatsappLogoIcon size={20} weight="fill" className="text-[#25d366]" />
              Chat on WhatsApp instead
            </a>
            <p className="text-center text-sm text-ink-2">
              Prefer to talk now?{" "}
              <a href={site.phoneHref} className="font-semibold text-ink underline decoration-line-strong underline-offset-4">
                Call {site.phone}
              </a>
            </p>
          </>
        )}
      </div>
    </form>
  );
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
}) {
  const groupId = useId();
  return (
    <fieldset>
      <legend className="text-sm font-semibold">{label}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <label key={option} className="relative cursor-pointer">
              <input
                type="radio"
                name={groupId}
                value={option}
                checked={selected}
                onChange={() => {
                  haptic(5);
                  onChange(option);
                }}
                className="peer sr-only"
              />
              <motion.span
                whileTap={{ scale: 0.93 }}
                className={`relative block rounded-full border px-4 py-2 text-sm font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand ${
                  selected ? "border-transparent text-white" : "border-line text-ink-2"
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId={`chip-${groupId}`}
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  />
                )}
                <span className="relative">{option}</span>
              </motion.span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
