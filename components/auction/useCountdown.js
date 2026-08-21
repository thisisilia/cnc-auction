import { useEffect, useState } from 'react';

/** "2d : 2h : 34m" (seconds optional) → total seconds. */
function parseCountdown(str) {
  const d = /(\d+)\s*d/.exec(str);
  const h = /(\d+)\s*h/.exec(str);
  const m = /(\d+)\s*m/.exec(str);
  const s = /(\d+)\s*s/.exec(str);
  return (
    (d ? +d[1] : 0) * 86400 + (h ? +h[1] : 0) * 3600 + (m ? +m[1] : 0) * 60 + (s ? +s[1] : 0)
  );
}

/** "50h 33m 57s" — each part carries its unit, so no separator is needed. */
function formatCountdown(total) {
  const pad = (n) => String(n).padStart(2, '0');
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
}

/**
 * Live countdown that ticks down every second from the value the listing gives
 * (not from a real date — it just counts the remaining time). Both the below-
 * hero TimeBar and the sticky bar seed from the same `auction.countdown`, so
 * change it once in the data and every place that shows it moves together.
 */
export function useCountdown(initial) {
  const [seconds, setSeconds] = useState(() => parseCountdown(initial));

  useEffect(() => {
    setSeconds(parseCountdown(initial));
  }, [initial]);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return formatCountdown(seconds);
}
