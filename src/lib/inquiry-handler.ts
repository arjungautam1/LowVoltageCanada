import { Resend } from "resend";

function failure(status: number, reason?: string) {
  if (reason) {
    console.error(`[Inquiry API] Rejected (${status}): ${reason}`);
  }
  return Response.json({ error: "Unable to send your message." }, { status });
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);

    if (originUrl.origin === requestUrl.origin) return true;

    const hostHeader = (
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      requestUrl.host
    ).toLowerCase();
    const originHost = originUrl.host.toLowerCase();

    // Match exact host or compare without port
    if (
      originHost === hostHeader ||
      originHost.replace(/:\d+$/, "") === hostHeader.replace(/:\d+$/, "")
    ) {
      return true;
    }

    // Handle www vs non-www
    const bareOrigin = originHost.replace(/^www\./, "");
    const bareHost = hostHeader.replace(/^www\./, "");
    if (bareOrigin === bareHost) return true;

    // Allow production domain
    if (bareOrigin === "lowvoltagecanada.com") return true;

    // Allow Vercel preview domains if request is on Vercel
    if (
      bareOrigin.endsWith(".vercel.app") &&
      bareHost.endsWith(".vercel.app")
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/** Only validated inquiries can reach the fixed, server-configured inbox. */
export async function handleInquiry(request: Request): Promise<Response> {
  if (!isAllowedOrigin(request)) {
    return failure(
      403,
      `Origin mismatch: origin="${request.headers.get("origin")}", url="${request.url}", host="${request.headers.get("x-forwarded-host") || request.headers.get("host")}"`,
    );
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return failure(415, "Invalid Content-Type");
  }
  if (Number(request.headers.get("content-length")) > 16_384) {
    return failure(413, "Content too large");
  }

  let input: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 16_384) return failure(413, "Body length too large");
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return failure(400, "Malformed JSON body");
    }
    input = parsed as Record<string, unknown>;
  } catch {
    return failure(400, "JSON parse error");
  }

  const fields = ["name", "email", "company", "inquiry", "message"] as const;
  if (fields.some((field) => typeof input[field] !== "string")) {
    return failure(400, "Missing required fields or field not a string");
  }
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
  ) {
    return failure(400, "Field validation failed");
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return failure(503, "Missing RESEND_API_KEY");
  }

  function cleanSender(raw: string | undefined): string {
    if (!raw) return "Low Voltage Canada <contact@lowvoltagecanada.com>";
    let trimmed = raw
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim();
    if (trimmed.includes("onboarding@resend.dev")) {
      return "Low Voltage Canada <contact@lowvoltagecanada.com>";
    }
    const match = trimmed.match(/^([^<]*)<([^>]+)>/);
    if (match) {
      const name = match[1].trim();
      const email = match[2].trim();
      return name ? `${name} <${email}>` : email;
    }
    trimmed = trimmed.replace(/[)>.,;]+$/, "");
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return `Low Voltage Canada <${trimmed}>`;
    }
    return "Low Voltage Canada <contact@lowvoltagecanada.com>";
  }

  function cleanRecipient(raw: string | undefined): string {
    if (!raw) return "contact@lowvoltagecanada.com";
    let trimmed = raw
      .trim()
      .replace(/^["']|["']$/g, "")
      .trim();
    const match = trimmed.match(/<([^>]+)>/);
    if (match) trimmed = match[1].trim();
    trimmed = trimmed.replace(/[)>.,;]+$/, "");
    if (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) &&
      trimmed !== "arjungautam2357@gmail.com"
    ) {
      return trimmed;
    }
    return "contact@lowvoltagecanada.com";
  }

  const recipient = cleanRecipient(process.env.CONTACT_TO_EMAIL);
  const sender = cleanSender(process.env.RESEND_FROM_EMAIL);

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
    if (error || !data?.id) {
      return failure(
        502,
        `Resend error: ${JSON.stringify(error)} (from=${sender}, to=${recipient})`,
      );
    }
    return Response.json({ sent: true });
  } catch (err: unknown) {
    return failure(
      502,
      `Exception sending: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}
