/**
 * Pure path helpers for activity photo packs. No Supabase import, so this is
 * safe to use from client components as well as route handlers.
 *
 * Packs live in Supabase Storage as:
 *   bucket "gmhspkt1"  ->  activities/<category>/<session-year>/<title>/<file>
 */

export const ACTIVITIES_BUCKET = "gmhspkt1";
export const ACTIVITIES_ROOT = "activities";

export const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|svg|avif|bmp)$/i;

const ILLEGAL_SEGMENT_CHARS = /[\\/:*?"<>|]/g;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1f\x7f]/g;

/** Strip characters that are illegal (or ambiguous) in a storage key segment. */
export function sanitizeSegment(segment: string): string {
  return segment
    .replace(ILLEGAL_SEGMENT_CHARS, "_")
    .replace(CONTROL_CHARS, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Accept the historical filesystem-style path ("gmhspkt1/activities/...") as
 * well as the bucket-relative one, and always return bucket-relative.
 */
export function normalizeActivityPath(input: string): string {
  let p = input.replace(/^\/+/, "").replace(/\/+$/, "");
  if (p.startsWith(`${ACTIVITIES_BUCKET}/`)) p = p.slice(ACTIVITIES_BUCKET.length + 1);
  return p;
}

/** Guard against traversal or writes outside activities/. */
export function isSafeActivityPath(input: string): boolean {
  const p = normalizeActivityPath(input);
  if (!p.startsWith(`${ACTIVITIES_ROOT}/`)) return false;
  return !p.split("/").some((seg) => seg === "" || seg === "." || seg === "..");
}

export function activityPackPath(category: string, year: string, title: string): string {
  return [ACTIVITIES_ROOT, sanitizeSegment(category), sanitizeSegment(year), sanitizeSegment(title)].join("/");
}

/** "activities/fit-india/2025-26/YOGA" -> {category, year, title} */
export function parsePackPath(input: string): { category: string; year: string; title: string } | null {
  const parts = normalizeActivityPath(input).split("/");
  if (parts.length !== 4 || parts[0] !== ACTIVITIES_ROOT) return null;
  return { category: parts[1], year: parts[2], title: parts[3] };
}
