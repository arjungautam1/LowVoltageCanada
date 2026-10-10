type InquiryRequest = {
  name: string;
  company: string;
  email: string;
  inquiry: string;
  message: string;
};

type InquiryErrorCode = "timeout" | "network" | "rejected";

const messages: Record<InquiryErrorCode, string> = {
  timeout:
    "Sending took longer than expected. We couldn’t confirm delivery. Your message is still here.",
  network:
    "We couldn’t confirm your message was sent. Your message is still here.",
  rejected: "Your message couldn’t be sent. Your message is still here.",
};

export class InquirySendError extends Error {
  readonly code: InquiryErrorCode;

  constructor(code: InquiryErrorCode) {
    super(messages[code]);
    this.name = "InquirySendError";
    this.code = code;
  }
}

/** A deadline keeps both forms recoverable even if the provider stops responding. */
export async function sendInquiry(inquiry: InquiryRequest): Promise<void> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      reject(new InquirySendError("timeout"));
      controller.abort();
    }, 12_000);
  });

  try {
    const response = await Promise.race([
      fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(inquiry),
      }),
      deadline,
    ]);

    if (!response.ok) throw new InquirySendError("rejected");
  } catch (error) {
    if (error instanceof InquirySendError) throw error;
    throw new InquirySendError(
      controller.signal.aborted ? "timeout" : "network",
    );
  } finally {
    clearTimeout(timeout);
  }
}
