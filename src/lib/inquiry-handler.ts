import { Resend } from "resend";

function failure(status: number) {
  return Response.json({ error: "Unable to send your message." }, { status });
}

/** Only validated inquiries can reach the fixed, server-configured inbox. */
export async function handleInquiry(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return failure(403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return failure(415);
  }
  if (Number(request.headers.get("content-length")) > 16_384)
    return failure(413);

  let input: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 16_384) return failure(413);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return failure(400);
    input = parsed as Record<string, unknown>;
  } catch {
    return failure(400);
  }

  const fields = ["name", "email", "company", "inquiry", "message"] as const;
  if (fields.some((field) => typeof input[field] !== "string"))
    return failure(400);
  const name = (input.name as string).trim();
  const email = (input.email as string).trim();
  const company = (input.company as string).trim();
  const inquiry = (input.inquiry as string).trim();
  const message = (input.message as string).trim();
  if (
    !name ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    company.length > 140 ||
    !inquiry ||
    inquiry.length > 160 ||
    /[\r\n]/.test(inquiry) ||
    !message ||
    message.length > 2000
  )
    return failure(400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return failure(503);

  const configuredTo = process.env.CONTACT_TO_EMAIL?.trim();
  const recipient =
    configuredTo && configuredTo !== "arjungautam2357@gmail.com"
      ? configuredTo
      : "contact@lowvoltagecanada.com";

  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const sender =
    configuredFrom && !configuredFrom.includes("onboarding@resend.dev")
      ? configuredFrom
      : "Low Voltage Canada <contact@lowvoltagecanada.com>";

  try {
    const { data, error } = await new Resend(apiKey).emails.send(
      {
        from: sender,
        to: [recipient],
        replyTo: email,
        subject: `Low Voltage Canada: ${inquiry}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "Not specified"}`,
          `Inquiry: ${inquiry}`,
          "",
          message,
        ].join("\n"),
      },
      { signal: AbortSignal.timeout(10_000) },
    );
    if (error || !data?.id) return failure(502);
    return Response.json({ sent: true });
  } catch {
    return failure(502);
  }
}
