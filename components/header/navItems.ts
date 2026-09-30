/* ============================================================
   4else — the main navigation's items
   ------------------------------------------------------------
   One list for both the desktop links and the mobile menu, so
   the two cannot drift apart. `key` is the `nav` message key.
   An item with a `route` has a page of its own (typed Link);
   the rest are same-page anchors or "#" placeholders, which
   the wip dialog catches (CLAUDE.md §5d).
   ============================================================ */

export type NavItem = {
  key: 'services' | 'about' | 'pricing' | 'inspiration' | 'contact';
  route?: '/inspirationen' | '/kontakt' | '/preise';
  href?: string;
  /** Lit up: the visitor is on this page or inside it. */
  active?: boolean;
  /** aria-current="page": the visitor is on exactly this page. */
  current?: boolean;
};
