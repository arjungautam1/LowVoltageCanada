"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { CheckCircle2, X } from "lucide-react";
import { InquirySendError, sendInquiry } from "@/lib/send-inquiry";
import styles from "./sponsorship-modal.module.css";

const inquiryOptions = [
  "Sponsorship or partnership",
  "Story or project",
  "Product or company spotlight",
  "General inquiry",
  "Job opportunities",
];

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const isEmailConfigured = Boolean(serviceId && templateId && publicKey);

type SponsorshipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  planName?: string;
  email: string;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

export function SponsorshipModal({
  isOpen,
  onClose,
  planName = "Sponsorship or partnership",
  email,
}: SponsorshipModalProps) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const requestGeneration = useRef(0);
  const inFlight = useRef(false);

  const closeModal = useCallback(() => {
    requestGeneration.current += 1;
    inFlight.current = false;
    setStatus("idle");
    setErrors({});
    setErrorMessage("");
    onClose();
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      inFlight.current = false;
    }
    return () => {
      document.body.style.overflow = "";
      requestGeneration.current += 1;
      inFlight.current = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function clearError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const replyEmail = String(data.get("email") || "").trim();
    const inquiry = String(data.get("inquiry") || "Sponsorship or partnership");
    const message = String(data.get("message") || "").trim();
    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "Please enter your name.";
    if (!replyEmail) nextErrors.email = "Please enter your email.";
    if (!message) nextErrors.message = "Please add a brief message.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (serviceId && templateId && publicKey) {
      const generation = ++requestGeneration.current;
      inFlight.current = true;
      setStatus("sending");
      setErrorMessage("");

      try {
        await sendInquiry({
          serviceId,
          templateId,
          publicKey,
          templateParams: {
            name,
            company: organization || "Not specified",
            email: replyEmail,
            inquiry: `${inquiry} (${planName})`,
            title: `${inquiry} (${planName})`,
            message,
          },
        });

        if (generation !== requestGeneration.current) return;
        setStatus("success");
      } catch (err: unknown) {
        if (generation !== requestGeneration.current) return;
        setStatus("error");
        setErrorMessage(
          err instanceof InquirySendError
            ? err.message
            : "We couldn’t confirm your inquiry was sent. Your details are still here.",
        );
      } finally {
        if (generation === requestGeneration.current) inFlight.current = false;
      }
    } else {
      // Fallback
      const subject = `Low Voltage Canada: ${inquiry} - ${planName}${organization ? ` (${organization})` : ""}`;
      const body = [
        `Plan/Interest: ${planName}`,
        `Name: ${name}`,
        organization ? `Organization: ${organization}` : "",
        `Email: ${replyEmail}`,
        `Inquiry: ${inquiry}`,
        "",
        message,
      ]
        .filter(Boolean)
        .join("\n");

      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeModal}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className={styles.header}>
          <p className={styles.eyebrow}>PARTNERSHIP & SPONSORSHIP</p>
          <h2 id={`${formId}-title`} className={styles.title}>
            {planName}
          </h2>
          <p className={styles.subtitle}>
            Connect with our team to discuss opportunities, visibility, and
            collaboration across Canada’s low voltage industry.
          </p>
        </div>

        {status === "success" ? (
          <div className={styles.successBox} role="status">
            <strong>
              <CheckCircle2
                size={22}
                style={{
                  display: "inline",
                  verticalAlign: "text-bottom",
                  marginRight: 8,
                }}
              />
              Inquiry sent successfully!
            </strong>
            <p>
              Thank you for your interest in partnering with Low Voltage Canada.
              We’ve received your details and will follow up with you directly.
            </p>
            <button
              type="button"
              className={styles.submit}
              style={{ marginTop: 20 }}
              onClick={closeModal}
            >
              Done
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {!isEmailConfigured && (
              <p className={styles.statusHint}>
                This opens a draft in your email app addressed to{" "}
                <a href={`mailto:${email}`}>{email}</a>. Review and send it
                there.
              </p>
            )}
            {status === "error" && (
              <div className={styles.errorBox} role="alert">
                {errorMessage ||
                  "We couldn’t confirm your inquiry was sent. Your details are still here."}{" "}
                You can email us directly at{" "}
                <a
                  href={`mailto:${email}`}
                  style={{ textDecoration: "underline" }}
                >
                  {email}
                </a>
                .
              </div>
            )}

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor={`${formId}-name`}>Name *</label>
                <input
                  id={`${formId}-name`}
                  name="name"
                  autoComplete="name"
                  disabled={status === "sending"}
                  required
                  maxLength={120}
                  aria-invalid={errors.name ? true : undefined}
                  onChange={() => clearError("name")}
                  autoFocus
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor={`${formId}-email`}>Email *</label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  disabled={status === "sending"}
                  required
                  maxLength={254}
                  aria-invalid={errors.email ? true : undefined}
                  onChange={() => clearError("email")}
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor={`${formId}-organization`}>
                  Organization / Company
                </label>
                <input
                  id={`${formId}-organization`}
                  name="organization"
                  autoComplete="organization"
                  disabled={status === "sending"}
                  maxLength={140}
                  placeholder="e.g. Integrator, Manufacturer, Distributor"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor={`${formId}-inquiry`}>
                  What would you like to discuss?
                </label>
                <select
                  id={`${formId}-inquiry`}
                  name="inquiry"
                  disabled={status === "sending"}
                  defaultValue="Sponsorship or partnership"
                >
                  {inquiryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor={`${formId}-message`}>Your message *</label>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={4}
                disabled={status === "sending"}
                required
                maxLength={2000}
                placeholder="Tell us what you have in mind or ask for pricing and placement details..."
                aria-invalid={errors.message ? true : undefined}
                onChange={() => clearError("message")}
              />
              {errors.message && (
                <p className={styles.error}>{errors.message}</p>
              )}
            </div>

            <button
              className={styles.submit}
              type="submit"
              disabled={status === "sending"}
              aria-busy={status === "sending"}
            >
              {status === "sending"
                ? "Sending…"
                : !isEmailConfigured
                  ? "Open email draft"
                  : status === "error"
                    ? "Try again"
                    : "Send inquiry"}
            </button>
            <p className={styles.statusHint} role="status" aria-live="polite">
              {status === "sending"
                ? "Sending your inquiry. This usually takes a few seconds."
                : ""}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
