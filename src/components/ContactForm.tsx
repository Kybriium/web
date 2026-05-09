"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import {
  budgetLabels,
  budgetRanges,
  companySizeLabels,
  companySizeOptions,
  contactFormDefaults,
  contactSchema,
  dataSensitivityLabels,
  dataSensitivityLevels,
  projectTypeLabels,
  projectTypes,
  timelineLabels,
  timelineOptions,
  type ContactPayload,
} from "@/lib/validation/contact";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

type TurnstileOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  theme?: "light" | "dark" | "auto";
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";

function loadTurnstile(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(
      TURNSTILE_SCRIPT_ID,
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("load")), {
        once: true,
      });
      return;
    }
    const script = document.createElement("script");
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("load"));
    document.head.appendChild(script);
  });
}

function TurnstileWidget({
  siteKey,
  onToken,
}: {
  siteKey: string;
  onToken: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
          "error-callback": () => onTokenRef.current(null),
          "expired-callback": () => onTokenRef.current(null),
          theme: "light",
        });
      })
      .catch(() => onTokenRef.current(null));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already removed */
        }
      }
    };
  }, [siteKey]);

  return <div ref={containerRef} />;
}

const inputClass =
  "block w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-base text-brand-ink placeholder:text-brand-muted transition-colors focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-accent/40 aria-[invalid=true]:border-red-700/60";

const optionLabel =
  "flex items-start gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm leading-snug text-brand-ink transition-colors hover:bg-brand-line/30 has-[:checked]:border-brand-teal has-[:checked]:bg-brand-teal/5";

function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-brand-ink"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-700">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="mt-2 text-xs text-brand-muted">{hint}</p> : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Fieldset({
  legend,
  required,
  error,
  children,
}: {
  legend: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-brand-ink">
        {legend}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-red-700">
            *
          </span>
        ) : null}
      </legend>
      {children}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function ContactForm() {
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  // Defer Turnstile init until the visitor actually engages with the form.
  // Without this, every landing-page visit would mount the widget and hit
  // Cloudflare for users who never intend to submit anything.
  const [hasInteracted, setHasInteracted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ContactPayload>({
    defaultValues: contactFormDefaults,
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    setValue("turnstileToken", turnstileToken ?? "");
  }, [turnstileToken, setValue]);

  const onSubmit: SubmitHandler<ContactPayload> = async (values) => {
    if (turnstileSiteKey && !turnstileToken) {
      setError("turnstileToken", {
        type: "manual",
        message: "Please complete the challenge below before sending.",
      });
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    const enriched = { ...values, ...getAttribution() };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched),
      });

      if (res.status === 200) {
        setStatus("success");
        track("contact-submitted", {
          budget: values.budget,
          projectTypes: values.projectTypes.length,
        });
        return;
      }

      if (res.status === 429) {
        setStatus("error");
        setErrorMessage(
          "Too many requests. Please try again in a little while, or email us directly.",
        );
        return;
      }

      setStatus("error");
      setErrorMessage(
        `Something went wrong. Please email us directly at ${site.email}.`,
      );
    } catch {
      setStatus("error");
      setErrorMessage(
        `Something went wrong. Please email us directly at ${site.email}.`,
      );
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-brand-teal/30 bg-brand-teal/5 p-8 sm:p-10"
      >
        <h3 className="text-xl font-semibold tracking-tight text-brand-teal">
          Thanks — we&rsquo;ll reply within one business day.
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-brand-ink">
          If anything&rsquo;s urgent in the meantime, write to{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-brand-teal underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={() => {
        if (!hasInteracted) {
          setHasInteracted(true);
          track("contact-form-engaged");
        }
      }}
      noValidate
      className="space-y-8"
    >
      {/* honeypot — visually hidden, screen-reader-hidden, never auto-completed */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Don&rsquo;t fill this in
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label="Name" required error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </Field>
        <Field
          id="company"
          label="Company"
          required
          error={errors.company?.message}
        >
          <input
            id="company"
            type="text"
            autoComplete="organization"
            className={inputClass}
            aria-invalid={!!errors.company}
            {...register("company")}
          />
        </Field>
      </div>

      <Field
        id="email"
        label="Work email"
        required
        error={errors.email?.message}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Fieldset
        legend="What kind of project?"
        required
        error={errors.projectTypes?.message}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {projectTypes.map((value) => (
            <label key={value} className={optionLabel}>
              <input
                type="checkbox"
                value={value}
                className="mt-0.5 h-4 w-4 rounded border-brand-line text-brand-teal focus:ring-brand-accent/40"
                {...register("projectTypes")}
              />
              <span>{projectTypeLabels[value]}</span>
            </label>
          ))}
        </div>
      </Fieldset>

      <Field
        id="brief"
        label="What are you trying to build or solve?"
        required
        hint="At least 50 characters. The more concrete, the more useful our reply."
        error={errors.brief?.message}
      >
        <textarea
          id="brief"
          rows={6}
          className={inputClass}
          aria-invalid={!!errors.brief}
          {...register("brief")}
        />
      </Field>

      <Fieldset
        legend="Budget range"
        required
        error={errors.budget?.message}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {budgetRanges.map((value) => (
            <label key={value} className={optionLabel}>
              <input
                type="radio"
                value={value}
                className="h-4 w-4 border-brand-line text-brand-teal focus:ring-brand-accent/40"
                {...register("budget")}
              />
              <span>{budgetLabels[value]}</span>
            </label>
          ))}
        </div>
      </Fieldset>

      <details className="group rounded-2xl border border-brand-line bg-white">
        <summary className="cursor-pointer list-none px-6 py-4 text-sm font-medium text-brand-ink marker:hidden hover:bg-brand-line/30">
          More detail (optional — helps us reply faster){" "}
          <span
            aria-hidden="true"
            className="float-right text-brand-muted transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="space-y-6 border-t border-brand-line px-6 pb-6 pt-6">
          <Field
            id="scale"
            label="Expected scale"
            hint="Roughly how many users / records / requests per month?"
          >
            <input
              id="scale"
              type="text"
              className={inputClass}
              {...register("scale")}
            />
          </Field>

          <Field id="dataSensitivity" label="Data sensitivity">
            <select
              id="dataSensitivity"
              className={inputClass}
              {...register("dataSensitivity")}
            >
              <option value="">—</option>
              {dataSensitivityLevels.map((v) => (
                <option key={v} value={v}>
                  {dataSensitivityLabels[v]}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="integrations"
            label="Existing systems to integrate with"
            hint="e.g. Microsoft 365, RingCentral, Salesforce, internal databases."
          >
            <input
              id="integrations"
              type="text"
              className={inputClass}
              {...register("integrations")}
            />
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="timeline" label="Timeline">
              <select
                id="timeline"
                className={inputClass}
                {...register("timeline")}
              >
                <option value="">—</option>
                {timelineOptions.map((v) => (
                  <option key={v} value={v}>
                    {timelineLabels[v]}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="companySize" label="Company size">
              <select
                id="companySize"
                className={inputClass}
                {...register("companySize")}
              >
                <option value="">—</option>
                {companySizeOptions.map((v) => (
                  <option key={v} value={v}>
                    {companySizeLabels[v]}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="sector" label="Sector">
              <input
                id="sector"
                type="text"
                className={inputClass}
                {...register("sector")}
              />
            </Field>
            <Field id="source" label="How did you hear about us?">
              <input
                id="source"
                type="text"
                className={inputClass}
                {...register("source")}
              />
            </Field>
          </div>
        </div>
      </details>

      {turnstileSiteKey && hasInteracted ? (
        <div>
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
          />
          {errors.turnstileToken?.message ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {errors.turnstileToken.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex h-12 items-center justify-center rounded-full bg-brand-teal px-7 text-sm font-medium text-brand-canvas transition-colors duration-200 hover:bg-brand-ink disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send enquiry"}
          {status !== "submitting" ? (
            <span
              aria-hidden="true"
              className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
            >
              →
            </span>
          ) : null}
        </button>
        {errorMessage ? (
          <p role="alert" className="text-sm text-red-700">
            {errorMessage}
          </p>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-brand-muted">
        By submitting this form, you agree to be contacted about your enquiry.
        See our{" "}
        <a
          href="/privacy"
          className="text-brand-teal underline-offset-4 hover:underline"
        >
          privacy notice
        </a>
        .
      </p>
    </form>
  );
}
