import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './TicketCard.module.css';

/* ============================================================
   4else — the sample ticket in the hero
   ------------------------------------------------------------
   A glass card that shows what a 4else ticket looks like: the
   event above, the ticket stub below the dashed line. Its
   contents are the design's sample event, not real data — the
   strings live in the "hero" namespace like the rest of the
   hero copy.

   The avatar stack is decorative (the initials say nothing on
   their own); "9 Anmeldungen" next to it carries the meaning.
   ============================================================ */

const avatars = [
  { id: 'ticketAvatar1', tone: styles.avatarLilac },
  { id: 'ticketAvatar2', tone: styles.avatarLime },
  { id: 'ticketAvatar3', tone: styles.avatarPeach },
] as const;

export function TicketCard() {
  const t = useTranslations('hero');

  return (
    <aside className={styles.ticket} aria-label={t('ticketLabel')}>
      <div className={styles.event}>
        <div className={styles.thumb}>
          <Image
            src="/images/home/mascot-thumb.png"
            alt=""
            width={390}
            height={510}
            sizes="92px"
            className={styles.thumbImage}
          />
        </div>

        <div className={styles.details}>
          <div className={styles.statusRow}>
            <span className={styles.date}>{t('ticketDate')}</span>
            <span className={styles.status}>
              <i className={styles.statusDot} aria-hidden="true" />
              {t('ticketStatus')}
            </span>
          </div>

          <div className={styles.titleBlock}>
            <b className={styles.title}>{t('ticketTitle')}</b>
            <span className={styles.place}>{t('ticketPlace')}</span>
          </div>

          <div className={styles.attendees}>
            <div className={styles.avatars} aria-hidden="true">
              {avatars.map(({ id, tone }) => (
                <span key={id} className={`${styles.avatar} ${tone}`}>
                  {t(id)}
                </span>
              ))}
              <span className={`${styles.avatar} ${styles.avatarMore}`}>+</span>
            </div>
            <span className={styles.count}>{t('ticketCount')}</span>
          </div>
        </div>
      </div>

      <div className={styles.stub}>
        <div className={styles.holder}>
          <span className={styles.icon}>
            <TicketIcon />
          </span>
          <div className={styles.holderText}>
            <span className={styles.holderName}>{t('ticketHolder')}</span>
            <span className={styles.code}>{t('ticketCode')}</span>
          </div>
        </div>

        <div className={styles.payment}>
          <b className={styles.price}>{t('ticketPrice')}</b>
          <QrTile />
        </div>
      </div>
    </aside>
  );
}

function TicketIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 9.5V7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.5a2.5 2.5 0 0 0 0 5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2.5a2.5 2.5 0 0 0 0-5Z" />
      <path d="M15 6.5v11" strokeDasharray="2 3" />
    </svg>
  );
}

/* A drawn placeholder, not a scannable code. */
function QrTile() {
  const code = [
    [20, 20], [26, 22], [30, 28], [22, 28],
    [18, 6], [18, 12], [6, 18], [12, 18],
  ];
  const finders = [[6, 6], [24, 6], [6, 24]];

  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={styles.qr} aria-hidden="true">
      <rect width="40" height="40" rx="8" className={styles.qrGround} />
      {finders.map(([x, y]) => (
        <rect key={`f${x}-${y}`} x={x} y={y} width="10" height="10" className={styles.qrInk} />
      ))}
      {finders.map(([x, y]) => (
        <rect
          key={`h${x}-${y}`}
          x={x + 3}
          y={y + 3}
          width="4"
          height="4"
          className={styles.qrGround}
        />
      ))}
      {code.map(([x, y]) => (
        <rect key={`c${x}-${y}`} x={x} y={y} width="4" height="4" className={styles.qrInk} />
      ))}
    </svg>
  );
}
