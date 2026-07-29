/**
 * Session years shown in the admin dropdowns, e.g. ["2021-22", ..., "2026-27"].
 * Current calendar year plus the previous 5, oldest first.
 */
export function getSessionYears(count = 6): string[] {
  const current = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const start = current - (count - 1) + i;
    return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  });
}
