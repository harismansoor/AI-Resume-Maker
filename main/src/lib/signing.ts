import { createHmac, timingSafeEqual } from 'crypto';

const NAME = 'demo_auth';
const ALGO = 'sha256';
const MAX_AGE = 60 * 60 * 6; // 6 hours

export function getDemoCookieName() {
  return NAME;
}

export function sign(value: string, secret: string) {
  const sig = createHmac(ALGO, secret).update(value).digest('hex');
  return `${value}.${sig}`;
}

export function verify(signed: string, secret: string) {
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return false;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac(ALGO, secret).update(value).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const DEMO_COOKIE_MAX_AGE = MAX_AGE;
