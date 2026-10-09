"use client";

import { useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

export function ShareButton() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }
  return (
    <div className="share-control">
      <button className="share-button" onClick={copyLink}>
        {status === "copied" ? <Check size={16} /> : <LinkIcon size={16} />}{" "}
        {status === "copied" ? "Link copied" : "Copy story link"}
      </button>
      <span
        role="status"
        className={status === "failed" ? "share-error" : "sr-only"}
      >
        {status === "copied"
          ? "Story link copied to clipboard."
          : status === "failed"
            ? "Copy the URL from your address bar to share this story."
            : ""}
      </span>
    </div>
  );
}
