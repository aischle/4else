/* ============================================================
   4else — FAQ numbering
   ------------------------------------------------------------
   The "(01)" in front of a question is derived from its
   position, not stored with the copy: removing a pair then
   renumbers the rest by itself, and a translation cannot drift
   out of order.
   ============================================================ */

export function faqNumber(index: number) {
  return `(${String(index + 1).padStart(2, '0')})`;
}
