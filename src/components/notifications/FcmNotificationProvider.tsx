'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { MessagePayload } from 'firebase/messaging';
import {
  FaBell,
  FaCircleCheck,
  FaChevronRight,
  FaTriangleExclamation,
  FaXmark,
} from 'react-icons/fa6';
import {
  clearFcmPermissionPromptSnooze,
  getFcmEnabledPreference,
  getOrCreateFcmDeviceId,
  getWebFcmDeviceMetadata,
  getStoredFirebaseMessagingToken,
  isFcmPermissionPromptSnoozed,
  markFirebaseMessagingTokenRefreshed,
  onFirebaseForegroundMessage,
  registerFirebaseMessagingServiceWorker,
  requestFirebaseMessagingToken,
  setFcmEnabledPreference,
  shouldRefreshFirebaseMessagingToken,
  snoozeFcmPermissionPrompt,
} from '@/lib/firebaseMessaging';
import { useAuth } from '@/contexts/AuthContext';
import { registerFcmToken } from '@/lib/api';

type ToastMessage = {
  id: string;
  title: string;
  body?: string;
  image?: string;
  link: string;
  cta?: string;
  time?: string;
  category?: string;
};

function payloadToToast(payload: MessagePayload): ToastMessage {
  const data = payload.data ?? {};
  const notification = payload.notification;

  return {
    id: data.notificationId ?? data.id ?? String(Date.now()),
    title: data.title ?? notification?.title ?? 'New Neetell update',
    body: data.body ?? notification?.body,
    image: data.image ?? notification?.image,
    time: data.time ?? 'Just now',
    category: data.category ?? data.type ?? 'Counselling update',
    link:
      data.link ??
      data.url ??
      data.href ??
      data.click_action ??
      payload.fcmOptions?.link ??
      '/dashboard/notifications',
    cta: data.cta ?? data.actionLabel ?? 'View update',
  };
}

function NotificationToast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  const external = toast.link.startsWith('http');

  return (
    <div className="fixed inset-x-3 bottom-24 z-[1300] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[420px]">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface/98 shadow-[0_18px_55px_rgba(15,23,42,0.20)] ring-1 ring-white/10 backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-info" />

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                <FaBell size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wider text-foreground">
                  Neetell Alert
                </p>
                <p className="truncate text-[10px] font-semibold text-foreground-subtle">
                  {toast.category} · {toast.time}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground-subtle transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <FaXmark size={12} />
            </button>
          </div>

          <div className="flex gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black leading-snug text-foreground sm:text-[15px]">{toast.title}</p>
              {toast.body && (
                <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-foreground-muted">
                  {toast.body}
                </p>
              )}
            </div>

            {toast.image && (
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:h-20 sm:w-24">
                <img src={toast.image} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
            {/* <Link
              href="/dashboard/notifications"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-muted px-3 text-xs font-bold text-foreground-muted transition-colors hover:bg-hover hover:text-foreground"
            >
              Inbox
            </Link> */}
            <Link
              href={toast.link}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              onClick={onClose}
              className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-black text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
            >
              {toast.cta}
              <FaChevronRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EnableNotificationsPrompt({
  onEnable,
  onDismiss,
  busy,
}: {
  onEnable: () => void;
  onDismiss: () => void;
  busy: boolean;
}) {
  return (
    <div className="fixed inset-x-3 bottom-24 z-[1290] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px]">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface/98 shadow-[0_18px_50px_rgba(15,23,42,0.18)] ring-1 ring-white/10 backdrop-blur-xl">
        <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary" />
        <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
            <FaBell size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-foreground">Enable browser alerts</p>
            <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
              Receive counselling deadlines, allotment updates, and important notices on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground-subtle hover:bg-muted"
            aria-label="Dismiss notification permission prompt"
          >
            <FaXmark size={12} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={onDismiss}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-muted px-3 text-xs font-bold text-foreground-muted hover:bg-hover"
          >
            Later
          </button>
          <button
            type="button"
            onClick={onEnable}
            disabled={busy}
            className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-black text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            <FaCircleCheck size={12} />
            {busy ? 'Enabling...' : 'Enable alerts'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export function FcmNotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, firebaseUser, loading } = useAuth();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [promptSnoozed, setPromptSnoozed] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const canPrompt = useMemo(
    () =>
      !loading &&
      Boolean(user) &&
      notificationsEnabled !== false &&
      permission === 'default' &&
      !promptDismissed &&
      !promptSnoozed,
    [loading, notificationsEnabled, permission, promptDismissed, promptSnoozed, user]
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission);
    setPromptSnoozed(isFcmPermissionPromptSnoozed());
    setNotificationsEnabled(getFcmEnabledPreference());
    getOrCreateFcmDeviceId();
    registerFirebaseMessagingServiceWorker().catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 7000);

    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!user || !firebaseUser || permission !== 'granted' || notificationsEnabled !== true) return;

    let cancelled = false;

    if (!shouldRefreshFirebaseMessagingToken()) return;

    requestFirebaseMessagingToken()
      .then(async fcmToken => {
        if (fcmToken && !cancelled) {
          const authToken = await firebaseUser.getIdToken();
          if (cancelled) return;
          await registerFcmToken(authToken, {
            token: fcmToken,
            ...getWebFcmDeviceMetadata(),
          });
          if (cancelled) return;
          markFirebaseMessagingTokenRefreshed();
          setFcmEnabledPreference(true);
          setNotificationsEnabled(true);
        }
      })
      .catch(error => {
        console.warn('Could not initialize or register Firebase Cloud Messaging.', error);
      });

    return () => {
      cancelled = true;
    };
  }, [firebaseUser, notificationsEnabled, permission, user]);

  useEffect(() => {
    if (!user || permission !== 'granted' || notificationsEnabled !== true) return;

    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    onFirebaseForegroundMessage(payload => {
      if (cancelled) return;
      setToast(payloadToToast(payload));
    }).then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [notificationsEnabled, permission, user]);

  const handleEnable = async () => {
    setBusy(true);
    try {
      const token = await requestFirebaseMessagingToken();
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission);
      }
      if (token) {
        if (firebaseUser) {
          const authToken = await firebaseUser.getIdToken();
          await registerFcmToken(authToken, {
            token,
            ...getWebFcmDeviceMetadata(),
          });
          markFirebaseMessagingTokenRefreshed();
          setFcmEnabledPreference(true);
          setNotificationsEnabled(true);
          clearFcmPermissionPromptSnooze();
          setPromptSnoozed(false);
        }
      } else if (getStoredFirebaseMessagingToken()) {
        console.info('FCM token is already stored for this browser.');
      }
    } catch (error) {
      console.warn('Notification permission or FCM token request failed.', error);
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {children}
      {canPrompt && (
        <EnableNotificationsPrompt
          busy={busy}
          onEnable={handleEnable}
          onDismiss={() => {
            snoozeFcmPermissionPrompt(12);
            setPromptSnoozed(true);
            setPromptDismissed(true);
          }}
        />
      )}
      {toast && <NotificationToast toast={toast} onClose={() => setToast(null)} />}
    </>
  );
}
