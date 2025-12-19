import * as Sentry from 'sentry-expo';

export function initSentry() {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

  // No DSN configured: do nothing.
  if (!dsn) return;

  Sentry.init({
    dsn,
    enableInExpoDevelopment: false,
    debug: false,
  });
}
