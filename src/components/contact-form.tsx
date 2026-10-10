"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "./contact-form.module.css";

type ContactFormProps = {
  email: string;
  contained?: boolean;
};

type FormErrors = {
  name?: string;
  message?: string;
};

const inquiryTypes = [
  "Story or project",
  "Product or company spotlight",
  "Job opportunity or event",
  "Sponsorship or partnership",
  "General inquiry",
];

export function ContactForm({ email, contained = false }: ContactFormProps) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});

  function clearError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
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
    if (!message) nextErrors.message = "Please add a message.";

    setErrors(nextErrors);

    const firstInvalidField = nextErrors.name
      ? "name"
      : nextErrors.message
        ? "message"
        : null;

    if (firstInvalidField) {
      const field = form.elements.namedItem(firstInvalidField);
      if (field instanceof HTMLElement) field.focus();
      return;
    }

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
          This form opens a draft in your email app addressed to{" "}
          <a href={`mailto:${email}`}>{email}</a>. You’ll review and send it
          there.
        </p>
      </div>

      <form
        className={styles.form}
        action={`mailto:${email}`}
        method="post"
        encType="text/plain"
        onSubmit={openEmailDraft}
        aria-describedby={`${formId}-hint`}
      >
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
            />
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

        <button className={styles.submit} type="submit">
          Open email draft <ArrowUpRight size={18} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}
