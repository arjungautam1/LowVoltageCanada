import { handleInquiry } from "@/lib/inquiry-handler";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return handleInquiry(request);
}
