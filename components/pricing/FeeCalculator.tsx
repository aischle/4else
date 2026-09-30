'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './FeeCalculator.module.css';

/* ============================================================
   4else — the pricing page's fee calculator
   ------------------------------------------------------------
   The page's only client component (the billing toggle is CSS,
   see app/[locale]/(site)/preise/page.module.css). A ticket price
   from CHF 5 to 300 in steps of 5, default 45; the fee is
   4.8 % + CHF 0.20, rounded to the Rappen, and the payout is the
   rest. The rate lives here and in the page's copy
   (preise.feeRate / feeFixed, and the start page's FAQ): change
   them together.
   ============================================================ */

const RATE = 0.048;
const FIXED = 0.2;

export function FeeCalculator() {
  const t = useTranslations('preise');
  const id = useId();
  const [ticket, setTicket] = useState(45);

  const fee = Math.round((ticket * RATE + FIXED) * 100) / 100;
  const payout = ticket - fee;
  const chf = (amount: number, decimals = 2) => t('calcAmount', { amount: amount.toFixed(decimals) });

  return (
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
        <div className={styles.figure}>
          <span className={styles.figureLabel}>{t('calcFee')}</span>
          <b className={styles.figureValue}>{chf(fee)}</b>
        </div>
        <div className={styles.figure}>
          <span className={styles.figureLabel}>{t('calcPayout')}</span>
          <b className={`${styles.figureValue} ${styles.payout}`}>{chf(payout)}</b>
        </div>
      </div>
    </div>
  );
}
