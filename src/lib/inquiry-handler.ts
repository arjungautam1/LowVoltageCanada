import { Resend } from "resend";

function failure(status: number, reason?: string, request?: Request) {
  if (reason) {
    console.error(`[Inquiry API] Rejected (${status}): ${reason}`);
  }
  const showDebug =
    request?.headers.get("x-debug") === "1" ||
    (request ? new URL(request.url).searchParams.get("debug") === "1" : false);
  return Response.json(
    showDebug
      ? { error: "Unable to send your message.", detail: reason }
      : { error: "Unable to send your message." },
    { status },
  );
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
    if (originHost === hostHeader || originHost.replace(/:\d+$/, "") === hostHeader.replace(/:\d+$/, "")) {
      return true;
    }

    // Handle www vs non-www
    const bareOrigin = originHost.replace(/^www\./, "");
    const bareHost = hostHeader.replace(/^www\./, "");
    if (bareOrigin === bareHost) return true;

    // Allow production domain
    if (bareOrigin === "lowvoltagecanada.com") return true;

    // Allow Vercel preview domains if request is on Vercel
    if (bareOrigin.endsWith(".vercel.app") && bareHost.endsWith(".vercel.app")) {
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
      request,
    );
  }
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return failure(415, "Invalid Content-Type", request);
  }
  if (Number(request.headers.get("content-length")) > 16_384) {
    return failure(413, "Content too large", request);
  }

  let input: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 16_384) return failure(413, "Body length too large", request);
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return failure(400, "Malformed JSON body", request);
    }
    input = parsed as Record<string, unknown>;
  } catch {
    return failure(400, "JSON parse error", request);
  }

  const fields = ["name", "email", "company", "inquiry", "message"] as const;
  if (fields.some((field) => typeof input[field] !== "string")) {
    return failure(400, "Missing required fields or field not a string", request);
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
    return failure(400, "Field validation failed", request);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return failure(503, "Missing RESEND_API_KEY", request);
  }

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
    const keyInfo = `keyPrefix=${apiKey.slice(0, 7)}, keyLen=${apiKey.length}`;
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
        `Resend error: ${JSON.stringify(error)} (${keyInfo}, from=${sender}, to=${recipient})`,
        request,
      );
    }
    return Response.json({ sent: true });
  } catch (err: unknown) {
    return failure(
      502,
      `Exception sending: ${err instanceof Error ? err.message : String(err)}`,
      request,
    );
  }
}

