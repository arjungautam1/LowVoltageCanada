// Sanity project IDs and dataset names are public identifiers, not credentials.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
export const apiVersion = "2026-10-01";
export const isSanityConfigured = Boolean(projectId);
