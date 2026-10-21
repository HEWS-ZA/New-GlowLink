/**
 * Haptic feedback emulation ported from native mobile behavior
 * Uses Web Vibration API when available on mobile browsers
 */
export function triggerHaptic(pattern: number | number[] = 10) {
  if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors if blocked by browser policy
    }
  }
}
