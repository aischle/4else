import { Header } from '@/components/header/Header';
import { Footer } from '@/components/footer/Footer';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

/* ============================================================
   4else — the site frame
   ------------------------------------------------------------
   Nav, footer and the scroll-to-top button for the real pages. It is a route group, so it
   adds nothing to any URL: /kontakt stays /kontakt.

   The 404 lives one level up, outside this group, which is how
   it gets the html, the fonts and the German of the locale
   layout without the nav and the footer. A notFound() thrown in
   here finds it, because this group has no not-found of its own.
   ============================================================ */

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="appContent">{children}</div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
