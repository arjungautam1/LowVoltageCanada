"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import styles from "./contact-form.module.css";

type ContactFormProps = {
  email: string;
  contained?: boolean;
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const inquiryTypes = [
  "Sponsorship or partnership",
  "Story or project",
  "Product or company spotlight",
  "General inquiry",
  "Job opportunities",
];

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export function ContactForm({ email, contained = false }: ContactFormProps) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  function clearError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const replyEmail = String(data.get("email") || "").trim();
    const inquiry = String(data.get("inquiry") || "General inquiry");
    const message = String(data.get("message") || "").trim();
    const nextErrors: FormErrors = {};

    if (!name) nextErrors.name = "Please enter your name.";
    if (!replyEmail) nextErrors.email = "Please enter your email.";
    if (!message) nextErrors.message = "Please add a message.";

    setErrors(nextErrors);

    const firstInvalidField = nextErrors.name
      ? "name"
      : nextErrors.email
        ? "email"
        : nextErrors.message
          ? "message"
          : null;

    if (firstInvalidField) {
      const field = form.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

    // Direct EmailJS send if credentials configured
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
                company: company || "Not specified",
                email: replyEmail,
                inquiry,
                title: inquiry,
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
        form.reset();
      } catch (err: unknown) {
        console.error("EmailJS submission error:", err);
        setStatus("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Could not send the message. Please try emailing directly.",
        );
      }
    } else {
      // Fallback to opening mail draft if template/keys are not yet configured
      const subject = `Low Voltage Canada: ${inquiry}${company ? ` (${company})` : ""}`;
      const body = [
        `Name: ${name}`,
        company ? `Company: ${company}` : "",
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

  const isEmailConfigured = Boolean(serviceId && templateId && publicKey);

  return (
    <section
      id="contact"
      className={`${styles.section}${contained ? ` ${styles.contained}` : ""}`}
      aria-labelledby={`${formId}-heading`}
    >
      <div className={styles.intro}>
        <p className={styles.eyebrow}>LET’S MAKE CONNECTIONS</p>
        <h2 id={`${formId}-heading`}>
          Every good story starts with a conversation.
        </h2>
        <p>
          Share a story, ask about sponsorship, or tell us what your team is
          building.
        </p>
        <p className={styles.hint} id={`${formId}-hint`}>
          {isEmailConfigured ? (
            <>
              Send us a message directly and we’ll reply to you at{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </>
          ) : (
            <>
              This form opens a draft addressed to{" "}
              <a href={`mailto:${email}`}>{email}</a>.
            </>
          )}
        </p>
      </div>

      {status === "success" ? (
        <div className={styles.successBox} role="status">
          <strong>
            <CheckCircle2 size={20} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 8 }} />
            Message sent successfully!
          </strong>
          <p>
            Thank you for reaching out. Your inquiry has been sent to{" "}
            <strong>{email}</strong>. We will review it and get back to you shortly.
          </p>
          <button
            type="button"
            className={styles.submit}
            style={{ marginTop: 16 }}
            onClick={() => setStatus("idle")}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          aria-describedby={`${formId}-hint`}
        >
          {status === "error" && (
            <div className={styles.errorBox} role="alert">
              Failed to send: {errorMessage || "Please check your network."}{" "}
              You can also email us directly at{" "}
              <a href={`mailto:${email}`} style={{ textDecoration: "underline" }}>
                {email}
              </a>.
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${formId}-name`}>Name</label>
              <input
                id={`${formId}-name`}
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={
                  errors.name ? `${formId}-name-error` : undefined
                }
                onChange={() => clearError("name")}
              />
              {errors.name && (
                <p
                  className={styles.error}
                  id={`${formId}-name-error`}
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor={`${formId}-email`}>Email</label>
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
              {errors.email && (
                <p className={styles.error} role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor={`${formId}-company`}>Company / Organization</label>
              <input
                id={`${formId}-company`}
                name="company"
                autoComplete="organization"
                maxLength={140}
                placeholder="e.g. Integrator, Manufacturer, etc."
              />
            </div>

            <div className={styles.field}>
              <label htmlFor={`${formId}-inquiry`}>
                What would you like to discuss?
              </label>
              <select
                id={`${formId}-inquiry`}
                name="inquiry"
                defaultValue="General inquiry"
              >
                {inquiryTypes.map((inquiry) => (
                  <option key={inquiry} value={inquiry}>
                    {inquiry}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor={`${formId}-message`}>Your message</label>
            <textarea
              id={`${formId}-message`}
              name="message"
              rows={5}
              required
              maxLength={2000}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={
                errors.message ? `${formId}-message-error` : undefined
              }
              onChange={() => clearError("message")}
            />
            {errors.message && (
              <p
                className={styles.error}
                id={`${formId}-message-error`}
                role="alert"
              >
                {errors.message}
              </p>
            )}
          </div>

          <button
            className={styles.submit}
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                Sending message...
              </>
            ) : isEmailConfigured ? (
              <>
                Send message <ArrowUpRight size={18} aria-hidden="true" />
              </>
            ) : (
              <>
                Send message <ArrowUpRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      )}
    </section>
  );
}
