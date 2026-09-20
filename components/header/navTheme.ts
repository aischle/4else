/* The marks the start page puts down the fade between its dark hero ground
   and the page ground. The nav watches all three and takes its colours from
   whichever ground it is over:

     START  the fade begins — the nav drops its dark tint here and runs on
            blur alone, so it mirrors the gradient exactly instead of
            washing it with a tint that no longer matches
     TEXT   the ground has passed the middle of the fade — the nav's own
            text switches from light to ink
     END    the fade has arrived at the page ground — the nav takes the
            light glass back

   A page without them, like the 404, keeps the light bar throughout.

   They live in their own module so that importing them does not pull the
   Header component into the importing file's refresh boundary. */

export const NAV_FADE_START = 'nav-fade-start';
export const NAV_FADE_TEXT = 'nav-fade-text';
export const NAV_FADE_END = 'nav-fade-end';

export const NAV_FADE_MARKS = [NAV_FADE_START, NAV_FADE_TEXT, NAV_FADE_END] as const;
