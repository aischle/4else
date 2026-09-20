/* Id of the element that marks where the page's dark ground ends.

   The start page puts it at the end of the hero's fade (see the statement
   section in app/[locale]/page.tsx); the nav watches it and swaps to its
   light colours as it passes. A page without the element keeps the light
   bar throughout.

   It lives in its own module so that importing it does not pull the
   Header component into the importing file's refresh boundary. */
export const NAV_THEME_SENTINEL = 'nav-theme-sentinel';
