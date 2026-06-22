'use client';

import type { MessagePayload, Messaging } from 'firebase/messaging';
import { firebaseApp } from '@/lib/firebase';

const FCM_TOKEN_STORAGE_KEY = 'neetell_fcm_token';
const FCM_DEVICE_ID_STORAGE_KEY = 'neetell_fcm_device_id';
const FCM_ENABLED_STORAGE_KEY = 'neetell_fcm_enabled';
const FCM_PROMPT_SNOOZE_UNTIL_STORAGE_KEY = 'neetell_fcm_prompt_snooze_until';
const FCM_TOKEN_REFRESHED_AT_STORAGE_KEY = 'neetell_fcm_token_refreshed_at';
const FCM_TOKEN_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const FCM_SW_PATH = '/firebase-messaging-sw.js';

export type ForegroundMessageHandler = (payload: MessagePayload) => void;

async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;

  const { getMessaging, isSupported } = await import('firebase/messaging');
  const supported = await isSupported().catch(() => false);
  if (!supported) return null;

  return getMessaging(firebaseApp);
}

export async function registerFirebaseMessagingServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  return navigator.serviceWorker.register(FCM_SW_PATH);
}

export async function requestFirebaseMessagingToken() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.warn('NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing. FCM token generation is disabled.');
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  const messaging = await getMessagingIfSupported();
  if (!messaging) return null;

  const { getToken } = await import('firebase/messaging');
  const serviceWorkerRegistration = await registerFirebaseMessagingServiceWorker();

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: serviceWorkerRegistration ?? undefined,
  });

  if (token) {
    localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
  }

  return token || null;
}

export function getStoredFirebaseMessagingToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(FCM_TOKEN_STORAGE_KEY);
}

export function clearStoredFirebaseMessagingToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
  localStorage.removeItem(FCM_TOKEN_REFRESHED_AT_STORAGE_KEY);
}

export function shouldRefreshFirebaseMessagingToken() {
  if (typeof window === 'undefined') return false;

  const raw = localStorage.getItem(FCM_TOKEN_REFRESHED_AT_STORAGE_KEY);
  if (!raw) return true;

  const refreshedAt = Number(raw);
  if (!Number.isFinite(refreshedAt)) return true;

  return Date.now() - refreshedAt >= FCM_TOKEN_REFRESH_INTERVAL_MS;
}

export function markFirebaseMessagingTokenRefreshed() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FCM_TOKEN_REFRESHED_AT_STORAGE_KEY, String(Date.now()));
}

export function getOrCreateFcmDeviceId() {
  if (typeof window === 'undefined') return undefined;

  const existing = localStorage.getItem(FCM_DEVICE_ID_STORAGE_KEY);
  if (existing) return existing;

  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(FCM_DEVICE_ID_STORAGE_KEY, id);
  return id;
}

export function getStoredFcmDeviceId() {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem(FCM_DEVICE_ID_STORAGE_KEY) ?? undefined;
}

export function getFcmEnabledPreference() {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(FCM_ENABLED_STORAGE_KEY);
  if (value === null) return null;
  return value === 'true';
}

export function setFcmEnabledPreference(enabled: boolean) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FCM_ENABLED_STORAGE_KEY, String(enabled));
}

export function snoozeFcmPermissionPrompt(hours = 12) {
  if (typeof window === 'undefined') return;
  const until = Date.now() + hours * 60 * 60 * 1000;
  localStorage.setItem(FCM_PROMPT_SNOOZE_UNTIL_STORAGE_KEY, String(until));
}

export function isFcmPermissionPromptSnoozed() {
  if (typeof window === 'undefined') return false;
  const raw = localStorage.getItem(FCM_PROMPT_SNOOZE_UNTIL_STORAGE_KEY);
  if (!raw) return false;

  const until = Number(raw);
  if (!Number.isFinite(until) || until <= Date.now()) {
    localStorage.removeItem(FCM_PROMPT_SNOOZE_UNTIL_STORAGE_KEY);
    return false;
  }

  return true;
}

export function clearFcmPermissionPromptSnooze() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FCM_PROMPT_SNOOZE_UNTIL_STORAGE_KEY);
}

export function getWebFcmDeviceMetadata() {
  if (typeof window === 'undefined') {
    return { deviceType: 'web' as const };
  }

  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string; brands?: { brand: string; version: string }[] };
  };
  const platform = nav.userAgentData?.platform || navigator.platform || 'Web';
  const browser = nav.userAgentData?.brands?.find(brand => !brand.brand.includes('Brand'))?.brand;

  return {
    deviceType: 'web' as const,
    deviceName: browser ? `${browser} on ${platform}` : `Web browser on ${platform}`,
    deviceId: getOrCreateFcmDeviceId(),
  };
}

export async function onFirebaseForegroundMessage(handler: ForegroundMessageHandler) {
  const messaging = await getMessagingIfSupported();
  if (!messaging) return () => {};

  const { onMessage } = await import('firebase/messaging');
  return onMessage(messaging, handler);
}
