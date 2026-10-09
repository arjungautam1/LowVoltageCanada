/** Page params preserve URL encoding in this Next.js version; metadata params do not. */
export function decodeRouteSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
