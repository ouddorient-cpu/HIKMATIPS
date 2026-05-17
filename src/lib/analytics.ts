import { getAnalytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getApp } from 'firebase/app';

export async function logEvent(eventName: string, params?: Record<string, string | number>) {
  try {
    const supported = await isSupported();
    if (!supported) return;
    const analytics = getAnalytics(getApp());
    firebaseLogEvent(analytics, eventName, params);
  } catch {}
}
