// A short buzz on Android, the closest the web gets to a native tap feedback.
// iOS Safari has no vibration API, so this is silently a no-op there.
export function haptic(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {}
}
