// lib/format.ts — Shared formatting utilities

/**
 * Truncate a long ID for display, keeping a prefix and suffix.
 * "abcdef1234567890xyzw" → "abcdef12…xyzw"
 */
export function truncateId(
  id: string,
  prefixLen = 8,
  suffixLen = 4,
): string {
  if (id.length <= prefixLen + suffixLen + 3) return id;
  return `${id.slice(0, prefixLen)}\u2026${id.slice(-suffixLen)}`;
}

/**
 * Format an ISO date string for display.
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
