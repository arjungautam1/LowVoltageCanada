"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
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
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setStatus("idle");
      setErrors({});
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function clearError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
      setStatus("sending");
      setErrorMessage("");

      try {
        const response = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: {
                name,
                company: organization || "Not specified",
                email: replyEmail,
                inquiry: `${inquiry} (${planName})`,
                title: `${inquiry} (${planName})`,
                message,
              },
            }),
          },
        );

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText || "Failed to send message");
        }

        setStatus("success");
      } catch (err: unknown) {
        console.error("EmailJS submission error:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Could not send the inquiry. Please email us directly.",
        );
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
        if (e.target === e.currentTarget) onClose();
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
          onClick={onClose}
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
              onClick={onClose}
            >
              Done
            </button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {status === "error" && (
              <div className={styles.errorBox} role="alert">
                Failed to send: {errorMessage || "Network error."} You can email
                us directly at{" "}
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
            >
              {status === "sending" ? (
                <>
                  <Loader2
                    size={18}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Sending inquiry...
                </>
              ) : (
                "Send inquiry"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
