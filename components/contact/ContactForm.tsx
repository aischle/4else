'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import buttons from '@/components/ui/Button.module.css';
import styles from './ContactForm.module.css';

/* ============================================================
   4else — contact form
   ------------------------------------------------------------
   The card from the design: topic chips, the fields, and the
   consent row. The topic chips and the notice after submitting
   are state, which is why this is a client component. Every
   topic shares one message placeholder; the chosen topic is
   kept for the POST once a handler exists.

   There is no backend yet. Submitting therefore does NOT show
   the design's success state — that copy promises an answer
   within 24 hours and a copy in the sender's inbox, and nothing
   sends either. It shows a notice instead, saying plainly that
   the form is not connected and offering the e-mail address.

   When a handler exists: POST the fields plus the topic in
   onSubmit, and replace the notice with the success state from
   the handoff (design_handoff_4else_kontakt/README.md §2), but
   without its 24-hour promise: Beatrice declined that deadline
   (September 2026), so the badge reads "Persönliche Antwort".

   Validation is the browser's own, but its messages are not: a
   browser writes them in its interface language, so an English
   Chrome would say "Please fill out this field" on a German page.
   Each required field therefore sets a German message from the
   messages file when it turns up invalid, and clears it again as
   soon as it is edited, so the browser re-checks the new value.
   ============================================================ */

const TOPICS = [1, 2, 3, 4, 5, 6] as const;

type Field = HTMLInputElement | HTMLTextAreaElement;

export function ContactForm() {
  const t = useTranslations('kontakt');
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(1);
  const [notice, setNotice] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  /* Spread onto every field with a constraint. */
  const validation = {
    onInvalid: (event: FormEvent<Field>) => {
      const field = event.currentTarget;
      const { valueMissing, typeMismatch } = field.validity;
      if (valueMissing) {
        field.setCustomValidity(
          field.type === 'checkbox' ? t('validationConsent') : t('validationRequired'),
        );
      } else if (typeMismatch) {
        field.setCustomValidity(t('validationEmail'));
      }
    },
    onChange: (event: FormEvent<Field>) => event.currentTarget.setCustomValidity(''),
  };

  const rich = {
    privacy: (chunks: ReactNode) => (
      <a href="#" className={styles.inlineLink}>
        {chunks}
      </a>
    ),
    mail: (chunks: ReactNode) => (
      <a href={`mailto:${t('c1Email')}`} className={styles.inlineLink}>
        {chunks}
      </a>
    ),
  };

  if (notice) {
    return (
      <div className={styles.card}>
        <div className={styles.notice} role="status" tabIndex={-1} ref={noticeRef}>
          <span className={styles.noticeIcon}>
            <PlugIcon />
          </span>
          <h2 className={styles.noticeTitle}>{t('noticeTitle')}</h2>
          <p className={styles.noticeBody}>{t.rich('noticeBody', rich)}</p>
          <button
            type="button"
            onClick={() => setNotice(false)}
            className={`${buttons.pill} ${buttons.outline}`}
          >
            {t('noticeBack')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{t('formEyebrow')}</p>
        <h2 className={styles.heading}>{t('formHeading')}</h2>
      </div>

      <div className={styles.topics} role="group" aria-label={t('topicsLabel')}>
        {TOPICS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={topic === n}
            onClick={() => setTopic(n)}
            className={`${styles.chip}${topic === n ? ` ${styles.chipActive}` : ''}`}
          >
            {t(`topic${n}`)}
          </button>
        ))}
      </div>

      <form
        className={styles.fields}
        onSubmit={(event) => {
          /* Native validation has already passed at this point. */
          event.preventDefault();
          setNotice(true);
          requestAnimationFrame(() => noticeRef.current?.focus());
        }}
      >
        <label className={styles.field}>
          <span className={styles.label}>{t('nameLabel')}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            required
            {...validation}
            placeholder={t('namePlaceholder')}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t('emailLabel')}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            {...validation}
            placeholder={t('emailPlaceholder')}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t('orgLabel')} <span className={styles.hint}>{t('orgHint')}</span>
          </span>
          <input
            type="text"
            name="organisation"
            autoComplete="organization"
            placeholder={t('orgPlaceholder')}
            className={styles.input}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t('phoneLabel')} <span className={styles.hint}>{t('phoneHint')}</span>
          </span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder={t('phonePlaceholder')}
            className={styles.input}
          />
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className={styles.label}>{t('messageLabel')}</span>
          <textarea
            name="message"
            rows={5}
            required
            {...validation}
            placeholder={t('messagePlaceholder')}
            className={`${styles.input} ${styles.textarea}`}
          />
        </label>

        <div className={styles.footerRow}>
          <label className={styles.consent}>
            <input
              type="checkbox"
              name="consent"
              required
              {...validation}
              className={styles.checkbox}
            />
            <span>{t.rich('consent', rich)}</span>
          </label>
          <button type="submit" className={`${buttons.pill} ${buttons.violet}`}>
            {t('submit')} <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}

function PlugIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 2v5M15 2v5" />
      <path d="M6 7h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V7Z" />
      <path d="M12 16v6" />
    </svg>
  );
}
