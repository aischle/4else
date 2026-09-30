'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './FeeCalculator.module.css';

/* ============================================================
   4else — the pricing page's fee panel (TWINT example)
   ------------------------------------------------------------
   The whole Eisviolett column of the payment panel, and the
   page's only client component (the billing toggle is CSS).
   From Beatrice's change request (30 Sep 2026):
   - a switch "Kursverwaltung (Free / Premium) | Connect",
     Kursverwaltung by default;
   - the big rate follows it: 4.8 % or 2 %, TWINT only, and NO
     fixed surcharge (TWINT has none in this model; the old
     "+ CHF 0.20" must not come back as an average);
   - fee = ticket × rate, payout = ticket − fee, two decimals.
     Her check: CHF 130 → 6.24 / 123.76 and 2.60 / 127.40.
   Licence costs are not included, as the note under it says.
   The other payment methods and licences belong on the detail
   page. Keep the rates in step with the page's FAQ and the
   start page's (faq.f2Answer).
   ============================================================ */

const RATES = { course: 0.048, connect: 0.02 } as const;
type Plan = keyof typeof RATES;

export function FeeCalculator() {
  const t = useTranslations('preise');
  const id = useId();
  const [plan, setPlan] = useState<Plan>('course');
  const [ticket, setTicket] = useState(45);

  const fee = Math.round(ticket * RATES[plan] * 100) / 100;
  const payout = ticket - fee;
  const chf = (amount: number, decimals = 2) => t('calcAmount', { amount: amount.toFixed(decimals) });

  return (
    <div className={styles.panel}>
      <fieldset className={styles.switch}>
        <legend className={styles.srOnly}>{t('feePlanLabel')}</legend>
        {(['course', 'connect'] as const).map((option) => (
          <label key={option} className={styles.option}>
            <input
              type="radio"
              name={`${id}-plan`}
              value={option}
              checked={plan === option}
              onChange={() => setPlan(option)}
              className={styles.optionInput}
            />
            <span className={styles.optionText}>
              {option === 'course' ? (
                <>
                  {t('feePlanCourse')} <span className={styles.optionDetail}>{t('feePlanCourseDetail')}</span>
                </>
              ) : (
                t('feePlanConnect')
              )}
            </span>
          </label>
        ))}
      </fieldset>

      <div className={styles.figure} aria-live="polite">
        <span className={styles.eyebrow}>{t('feeEyebrow')}</span>
        <b className={styles.rate}>{plan === 'course' ? t('feeRateCourse') : t('feeRateConnect')}</b>
      </div>

      <div className={styles.card}>
        <div className={styles.row}>
          <label htmlFor={`${id}-ticket`} className={styles.label}>
            {t('calcTicket')}
          </label>
          <output htmlFor={`${id}-ticket`} className={styles.ticket}>
            {chf(ticket, 0)}
          </output>
        </div>
        <input
          id={`${id}-ticket`}
          type="range"
          min={5}
          max={300}
          step={5}
          value={ticket}
          onChange={(event) => setTicket(Number(event.target.value))}
          aria-valuetext={chf(ticket, 0)}
          className={styles.range}
        />
        <div className={styles.result} aria-live="polite">
          <div className={styles.amount}>
            <span className={styles.amountLabel}>{t('calcFee')}</span>
            <b className={styles.amountValue}>{chf(fee)}</b>
          </div>
          <div className={styles.amount}>
            <span className={styles.amountLabel}>{t('calcPayout')}</span>
            <b className={`${styles.amountValue} ${styles.payout}`}>{chf(payout)}</b>
          </div>
        </div>
      </div>

      <p className={styles.note}>{t('calcNote')}</p>
    </div>
  );
}
