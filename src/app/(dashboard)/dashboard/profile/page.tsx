'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Phone, Mail, MapPin, Globe, Calendar, User,
  Monitor, Smartphone, LogOut, Edit3, Check, X,
  Loader2, AlertCircle, Clock, Lock, Key, Shield, RefreshCw, ChevronRight,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  updateProfile as apiUpdateProfile,
  getSessions, logoutDevice, logoutRemote,
  sendEmailUpdateOtp, verifyEmailOtp, resendEmailVerification,
  enableEmailLogin, verifyEmailLogin, updatePassword, disableEmailLogin,
  type SessionData,
} from '@/lib/api';

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Chandigarh','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];
const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface EditForm {
  name: string; state: string; city: string;
  country: string; gender: string; dob: string; alternatePhone: string;
}

type AlertState = { type: 'error' | 'success'; msg: string } | null;

type EmailModal =
  | { mode: 'update-email';        step: 'input'; email: string }
  | { mode: 'update-email';        step: 'otp';   email: string; otp: string }
  | { mode: 'enable-email-login';  step: 'input'; email: string; password: string; confirm: string }
  | { mode: 'enable-email-login';  step: 'otp';   email: string; otp: string }
  | { mode: 'change-password';     current: string; next: string; confirm: string }
  | { mode: 'resend-verify' }
  | null;

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

async function getToken(): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('Not authenticated');
  return u.getIdToken();
}

function makeInitials(name?: string, phone?: string) {
  if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (phone) return phone.slice(-2);
  return '?';
}

function calcPct(user: ReturnType<typeof useAuth>['user']) {
  if (!user) return 0;
  const fields = [user.name, user.email, user.state, user.city, user.country, user.gender, user.dob, user.alternatePhone];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function timeAgo(iso: string) {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : new Date(iso).toLocaleDateString('en-IN');
}

/* ─── Primitive UI ───────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
      {children}
    </p>
  );
}

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error';
function Badge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const map: Record<BadgeVariant, string> = {
    neutral: 'bg-muted text-foreground-muted',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    error:   'bg-error-light text-error',
  };
  return (
    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', map[variant])}>
      {children}
    </span>
  );
}

function InfoAlert({ type, msg }: { type: 'error' | 'success'; msg: string }) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
      type === 'error' ? 'bg-error-light text-error' : 'bg-success-light text-success',
    )}>
      {type === 'error' ? <AlertCircle size={14} /> : <Check size={14} />}
      {msg}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
        {label}
      </span>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', disabled }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type} value={value} disabled={disabled}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9 px-3 text-sm rounded-lg w-full outline-none
        bg-muted border border-border text-foreground
        placeholder:text-foreground-subtle
        focus:border-border-focus focus:bg-surface
        disabled:opacity-50 transition-colors"
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void;
  options: string[]; placeholder?: string;
}) {
  return (
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="h-9 px-3 text-sm rounded-lg w-full outline-none appearance-none
        bg-muted border border-border text-foreground
        focus:border-border-focus transition-colors"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function IconBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
      bg-muted border border-border">
      {children}
    </div>
  );
}

function BtnPrimary({ children, onClick, disabled, loading, className = '' }: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; loading?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled || loading}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium',
        'bg-primary text-primary-foreground hover:bg-primary-hover',
        'disabled:opacity-60 transition-colors', className,
      )}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {children}
    </button>
  );
}

function BtnGhost({ children, onClick, disabled, className = '' }: {
  children: React.ReactNode; onClick?: () => void;
  disabled?: boolean; className?: string;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium',
        'border border-border text-foreground-muted',
        'hover:bg-hover hover:text-foreground',
        'disabled:opacity-60 transition-colors', className,
      )}
    >
      {children}
    </button>
  );
}

/* ─── Modal ──────────────────────────────────────────────────────────────────── */

function Modal({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-modal-backdrop flex items-center justify-center p-4 bg-overlay">
      <div className="bg-modal border border-border rounded-xl shadow-lg w-full max-w-md z-modal">
        <div className="flex items-start justify-between p-5 pb-0">
          <div>
            <p className="text-base font-semibold text-foreground">{title}</p>
            {subtitle && <p className="text-sm text-foreground-subtle mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1 rounded-lg text-foreground-subtle hover:bg-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── OTP input ──────────────────────────────────────────────────────────────── */

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i]) {
      (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handleChange(i: number, v: string) {
    const digit = v.replace(/\D/g, '').slice(-1);
    const arr = [...digits]; arr[i] = digit;
    onChange(arr.join(''));
    if (digit) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    onChange(e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).padEnd(6, ''));
  }

  return (
    <div className="flex gap-2 justify-center my-4">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i} id={`otp-${i}`} type="text" inputMode="numeric"
          maxLength={1} value={digits[i] ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-semibold rounded-lg
            border border-border bg-muted text-foreground outline-none
            focus:border-border-focus focus:bg-surface transition-colors"
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════════ */

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  /* edit */
  const [editing, setEditing]     = useState(false);
  const [form, setForm]           = useState<EditForm>({ name: '', state: '', city: '', country: '', gender: '', dob: '', alternatePhone: '' });
  const [saving, setSaving]       = useState(false);
  const [infoAlert, setInfoAlert] = useState<AlertState>(null);

  /* sessions */
  const [sessions, setSessions]         = useState<SessionData[] | null>(null);
  const [sessLoading, setSessLoading]   = useState(true);
  const [sessError, setSessError]       = useState('');
  const [loggingOut, setLoggingOut]     = useState<string | null>(null);
  const [logoutAllBusy, setLogoutAllBusy] = useState(false);

  /* modal */
  const [emailModal, setEmailModal] = useState<EmailModal>(null);
  const [modalBusy, setModalBusy]   = useState(false);
  const [modalAlert, setModalAlert] = useState<AlertState>(null);

  /* sync form */
  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name ?? '', state: user.state ?? '', city: user.city ?? '', country: user.country ?? '', gender: user.gender ?? '', dob: user.dob ?? '', alternatePhone: user.alternatePhone ?? '' });
  }, [user]);

  /* load sessions */
  const loadSessions = useCallback(async () => {
    setSessLoading(true); setSessError('');
    try {
      const token = await getToken();
      setSessions((await getSessions(token)).sessions);
    } catch (e) {
      setSessError(e instanceof Error ? e.message : 'Failed to load sessions');
    } finally { setSessLoading(false); }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  /* save profile */
  const handleSave = async () => {
    if (!form.name.trim()) { setInfoAlert({ type: 'error', msg: 'Full name is required' }); return; }
    setSaving(true); setInfoAlert(null);
    try {
      const token = await getToken();
      await apiUpdateProfile(token, {
        name: form.name.trim(),
        state: form.state || undefined, city: form.city.trim() || undefined,
        country: form.country.trim() || undefined, gender: form.gender || undefined,
        dob: form.dob || undefined, alternatePhone: form.alternatePhone.trim() || undefined,
      });
      await refreshUser();
      setInfoAlert({ type: 'success', msg: 'Profile updated successfully' });
      setEditing(false);
    } catch (e) {
      setInfoAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Update failed' });
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    if (user) setForm({ name: user.name ?? '', state: user.state ?? '', city: user.city ?? '', country: user.country ?? '', gender: user.gender ?? '', dob: user.dob ?? '', alternatePhone: user.alternatePhone ?? '' });
    setInfoAlert(null); setEditing(false);
  };

  /* sessions */
  const handleLogoutSession = async (deviceId: string) => {
    setLoggingOut(deviceId);
    try { await logoutDevice(await getToken(), deviceId); setSessions(p => p?.filter(s => s.deviceId !== deviceId) ?? null); } catch {}
    setLoggingOut(null);
  };

  const handleLogoutAll = async () => {
    setLogoutAllBusy(true);
    try { await logoutRemote(await getToken()); await loadSessions(); } catch {}
    setLogoutAllBusy(false);
  };

  /* modal helpers */
  const openModal  = (m: NonNullable<EmailModal>) => { setEmailModal(m); setModalAlert(null); };
  const closeModal = () => { setEmailModal(null); setModalAlert(null); };

  /* email update */
  const handleSendEmailOtp = async () => {
    if (emailModal?.mode !== 'update-email' || emailModal.step !== 'input') return;
    if (!emailModal.email.trim()) { setModalAlert({ type: 'error', msg: 'Enter a valid email' }); return; }
    setModalBusy(true); setModalAlert(null);
    try {
      await sendEmailUpdateOtp(await getToken(), emailModal.email.trim());
      setEmailModal({ mode: 'update-email', step: 'otp', email: emailModal.email.trim(), otp: '' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed to send OTP' }); }
    finally { setModalBusy(false); }
  };

  const handleVerifyEmailOtp = async () => {
    if (emailModal?.mode !== 'update-email' || emailModal.step !== 'otp') return;
    if (emailModal.otp.length < 6) { setModalAlert({ type: 'error', msg: 'Enter the 6-digit OTP' }); return; }
    setModalBusy(true); setModalAlert(null);
    try {
      await verifyEmailOtp(await getToken(), emailModal.email, emailModal.otp);
      await refreshUser(); closeModal();
      setInfoAlert({ type: 'success', msg: 'Email updated and verified' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Invalid OTP' }); }
    finally { setModalBusy(false); }
  };

  const handleResendVerify = async () => {
    if (!user?.email) return;
    setModalBusy(true); setModalAlert(null);
    try {
      await resendEmailVerification(await getToken(), user.email);
      setModalAlert({ type: 'success', msg: 'Verification email sent' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed' }); }
    finally { setModalBusy(false); }
  };

  /* enable email login */
  const handleEnableEmailLogin = async () => {
    if (emailModal?.mode !== 'enable-email-login' || emailModal.step !== 'input') return;
    const { email, password, confirm } = emailModal;
    if (!email.trim()) { setModalAlert({ type: 'error', msg: 'Enter a valid email' }); return; }
    if (password.length < 8) { setModalAlert({ type: 'error', msg: 'Password must be at least 8 characters' }); return; }
    if (password !== confirm) { setModalAlert({ type: 'error', msg: 'Passwords do not match' }); return; }
    setModalBusy(true); setModalAlert(null);
    try {
      await enableEmailLogin(await getToken(), email.trim(), password);
      setEmailModal({ mode: 'enable-email-login', step: 'otp', email: email.trim(), otp: '' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed' }); }
    finally { setModalBusy(false); }
  };

  const handleVerifyEmailLogin = async () => {
    if (emailModal?.mode !== 'enable-email-login' || emailModal.step !== 'otp') return;
    if (emailModal.otp.length < 6) { setModalAlert({ type: 'error', msg: 'Enter the 6-digit OTP' }); return; }
    setModalBusy(true); setModalAlert(null);
    try {
      await verifyEmailLogin(await getToken(), emailModal.email, emailModal.otp);
      await refreshUser(); closeModal();
      setInfoAlert({ type: 'success', msg: 'Email login enabled' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Invalid OTP' }); }
    finally { setModalBusy(false); }
  };

  /* change password */
  const handleChangePassword = async () => {
    if (emailModal?.mode !== 'change-password') return;
    const { current, next, confirm } = emailModal;
    if (!current) { setModalAlert({ type: 'error', msg: 'Enter your current password' }); return; }
    if (next.length < 8) { setModalAlert({ type: 'error', msg: 'New password must be at least 8 characters' }); return; }
    if (next !== confirm) { setModalAlert({ type: 'error', msg: 'Passwords do not match' }); return; }
    setModalBusy(true); setModalAlert(null);
    try {
      await updatePassword(await getToken(), current, next);
      closeModal(); setInfoAlert({ type: 'success', msg: 'Password updated successfully' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed' }); }
    finally { setModalBusy(false); }
  };

  /* disable email login */
  const handleDisableEmailLogin = async () => {
    setModalBusy(true); setModalAlert(null);
    try {
      await disableEmailLogin(await getToken());
      await refreshUser(); closeModal();
      setInfoAlert({ type: 'success', msg: 'Email login disabled' });
    } catch (e) { setModalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed' }); }
    finally { setModalBusy(false); }
  };

  const pct = calcPct(user);
  const ini = makeInitials(user?.name, user?.phone);

  if (!user) return null;

  /* ══ RENDER ══════════════════════════════════════════════════════════════ */
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5 pt-18">

        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">My Profile</h1>
          <p className="text-sm text-foreground-subtle mt-0.5">
            Manage your personal information, security, and active sessions
          </p>
        </div>

        {/* ── 1. Profile header card ──────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0
                bg-primary-light text-lg font-bold text-primary">
                {ini}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground leading-tight">
                  {user.name ?? 'No name set'}
                </p>
                <p className="text-sm text-foreground-subtle mt-0.5">{user.phone}</p>
                {user.email && <p className="text-xs text-foreground-subtle">{user.email}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant={user.isProfileComplete ? 'success' : 'warning'}>
                    {user.isProfileComplete ? 'Profile complete' : 'Incomplete'}
                  </Badge>
                  {user.phoneVerified  && <Badge variant="success">Phone verified</Badge>}
                  {user.emailVerified  && <Badge variant="success">Email verified</Badge>}
                  {user.enableEmailLogin && <Badge variant="success">Email login on</Badge>}
                </div>
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => { setInfoAlert(null); setEditing(true); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0
                  border border-border text-sm font-medium text-foreground-muted
                  hover:bg-hover hover:text-foreground transition-colors"
              >
                <Edit3 size={13} /> Edit profile
              </button>
            )}
          </div>

          {/* Completion bar */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground-subtle">Profile completeness</span>
              <span className="text-xs font-semibold text-foreground-muted">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  pct < 40 ? 'bg-error' : pct < 75 ? 'bg-warning' : 'bg-primary',
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            {!user.isProfileComplete && (
              <p className="text-xs text-foreground-subtle mt-1.5">
                Add name, state, city and email to complete your profile.
              </p>
            )}
          </div>
        </div>

        {/* ── 2. Personal information ─────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>Personal information</SectionLabel>

          {infoAlert && <div className="mt-3 mb-4"><InfoAlert type={infoAlert.type} msg={infoAlert.msg} /></div>}

          {editing ? (
            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name *">
                  <TextInput value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Your full name" />
                </Field>
                <Field label="Gender">
                  <SelectInput value={form.gender} onChange={v => setForm(f => ({ ...f, gender: v }))} options={GENDERS} placeholder="Select gender" />
                </Field>
                <Field label="State">
                  <SelectInput value={form.state} onChange={v => setForm(f => ({ ...f, state: v }))} options={STATES} placeholder="Select state" />
                </Field>
                <Field label="City">
                  <TextInput value={form.city} onChange={v => setForm(f => ({ ...f, city: v }))} placeholder="Your city" />
                </Field>
                <Field label="Country">
                  <TextInput value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} placeholder="Country" />
                </Field>
                <Field label="Date of birth">
                  <TextInput type="date" value={form.dob} onChange={v => setForm(f => ({ ...f, dob: v }))} />
                </Field>
                <Field label="Alternate phone">
                  <TextInput value={form.alternatePhone} onChange={v => setForm(f => ({ ...f, alternatePhone: v }))} placeholder="+91XXXXXXXXXX" />
                </Field>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <BtnPrimary onClick={handleSave} loading={saving} disabled={saving}>
                  {!saving && <Check size={13} />} Save changes
                </BtnPrimary>
                <BtnGhost onClick={handleCancel} disabled={saving}>
                  <X size={13} /> Cancel
                </BtnGhost>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2">
              {([
                { icon: User,     label: 'Full name',      value: user.name },
                { icon: User,     label: 'Gender',         value: user.gender },
                { icon: MapPin,   label: 'State',          value: user.state },
                { icon: MapPin,   label: 'City',           value: user.city },
                { icon: Globe,    label: 'Country',        value: user.country },
                { icon: Calendar, label: 'Date of birth',  value: user.dob ? new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined },
                { icon: Phone,    label: 'Alternate phone', value: user.alternatePhone },
              ] as const).map(({ icon: Icon, label, value }) => (
                <div key={label}
                  className="flex items-center gap-3 py-2.5 border-b border-border/50
                    last:border-0 sm:[&:nth-last-child(2)]:border-0"
                >
                  <Icon size={14} className="text-foreground-subtle shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground-subtle font-medium">{label}</p>
                    <p className={cn('text-sm font-medium truncate', value ? 'text-foreground' : 'text-foreground-subtle italic')}>
                      {value ?? 'Not set'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. Account & security ───────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <SectionLabel>Account &amp; security</SectionLabel>

          <div className="mt-4 flex flex-col divide-y divide-border/50">

            {/* Phone */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <IconBox><Phone size={14} className="text-foreground-subtle" /></IconBox>
                <div>
                  <p className="text-sm font-medium text-foreground">Phone number</p>
                  <p className="text-xs text-foreground-subtle">{user.phone}</p>
                </div>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <IconBox><Mail size={14} className="text-foreground-subtle" /></IconBox>
                <div>
                  <p className="text-sm font-medium text-foreground">Email address</p>
                  <p className="text-xs text-foreground-subtle">{user.email ?? 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {user.email ? (
                  <>
                    <Badge variant={user.emailVerified ? 'success' : 'warning'}>
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                    {!user.emailVerified && (
                      <button onClick={() => openModal({ mode: 'resend-verify' })}
                        className="text-xs font-semibold text-primary hover:underline">
                        Verify
                      </button>
                    )}
                    <button onClick={() => openModal({ mode: 'update-email', step: 'input', email: user.email ?? '' })}
                      className="text-xs font-semibold text-foreground-muted hover:text-primary hover:underline">
                      Change
                    </button>
                  </>
                ) : (
                  <>
                    <Badge variant="neutral">Not set</Badge>
                    <button onClick={() => openModal({ mode: 'update-email', step: 'input', email: '' })}
                      className="text-xs font-semibold text-primary hover:underline">
                      Add email
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Email login */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <IconBox><Lock size={14} className="text-foreground-subtle" /></IconBox>
                <div>
                  <p className="text-sm font-medium text-foreground">Email login</p>
                  <p className="text-xs text-foreground-subtle">
                    {user.enableEmailLogin
                      ? `Sign in with email & password${user.emailLoginVerified ? '' : ' (unverified)'}`
                      : 'Sign in using email & password'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={user.enableEmailLogin ? 'success' : 'neutral'}>
                  {user.enableEmailLogin ? 'Enabled' : 'Disabled'}
                </Badge>
                {user.enableEmailLogin ? (
                  <button
                    onClick={() => openModal({ mode: 'enable-email-login', step: 'input', email: user.email ?? '', password: '', confirm: '' })}
                    className="text-xs font-semibold text-error hover:underline">
                    Disable
                  </button>
                ) : (
                  <button
                    onClick={() => openModal({ mode: 'enable-email-login', step: 'input', email: user.email ?? '', password: '', confirm: '' })}
                    className="text-xs font-semibold text-primary hover:underline">
                    Enable
                  </button>
                )}
              </div>
            </div>

            {/* Change password */}
            {user.enableEmailLogin && (
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <IconBox><Key size={14} className="text-foreground-subtle" /></IconBox>
                  <div>
                    <p className="text-sm font-medium text-foreground">Password</p>
                    <p className="text-xs text-foreground-subtle tracking-widest">••••••••</p>
                  </div>
                </div>
                <button
                  onClick={() => openModal({ mode: 'change-password', current: '', next: '', confirm: '' })}
                  className="text-xs font-semibold text-primary hover:underline">
                  Change
                </button>
              </div>
            )}

            {/* Security note */}
            <div className="flex items-start gap-3 py-3">
              <IconBox><Shield size={14} className="text-foreground-subtle" /></IconBox>
              <div>
                <p className="text-sm font-medium text-foreground">Account security</p>
                <p className="text-xs text-foreground-subtle mt-0.5">
                  Your primary login is via OTP on {user.phone}. Email login is an optional secondary method.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Active sessions ──────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
            <div>
              <SectionLabel>Active sessions</SectionLabel>
              <p className="text-xs text-foreground-subtle mt-0.5">Devices currently signed in to your account</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleLogoutSession('')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                  border border-border text-xs font-medium text-foreground-muted
                  hover:bg-hover transition-colors"
              >
                <LogOut size={12} /> This device
              </button>
              {sessions && sessions.length > 0 && (
                <button
                  onClick={handleLogoutAll} disabled={logoutAllBusy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                    border border-error/40 text-xs font-medium text-error
                    hover:bg-error-light disabled:opacity-60 transition-colors"
                >
                  {logoutAllBusy ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                  Sign out all
                </button>
              )}
            </div>
          </div>

          {sessLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-foreground-subtle" />
            </div>
          ) : sessError ? (
            <div className="flex items-center gap-3">
              <InfoAlert type="error" msg={sessError} />
              <button onClick={loadSessions}
                className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {sessions.map(sess => {
                const DevIcon = sess.deviceType === 'mobile' ? Smartphone : Monitor;
                const busy = loggingOut === sess.deviceId;
                return (
                  <div key={sess.id}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl
                      bg-muted border border-border/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                        bg-surface border border-border">
                        <DevIcon size={15} className="text-foreground-subtle" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {sess.deviceName ?? (sess.deviceType === 'mobile' ? 'Mobile device' : 'Desktop / Web')}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {sess.ipAddress && (
                            <span className="text-xs text-foreground-subtle">{sess.ipAddress}</span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-foreground-subtle">
                            <Clock size={10} /> {timeAgo(sess.lastSeen)}
                          </span>
                          {sess.isActive && (
                            <span className="flex items-center gap-1 text-xs font-medium text-success">
                              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleLogoutSession(sess.deviceId)} disabled={busy}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ml-3 shrink-0
                        text-xs font-medium text-error hover:bg-error-light
                        disabled:opacity-60 transition-colors"
                    >
                      {busy ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
                      Sign out
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-foreground-subtle text-center py-6">
              No active sessions found
            </p>
          )}
        </div>

      </div>

      {/* ══ MODALS ═══════════════════════════════════════════════════════════ */}

      {/* Update / Add email — input */}
      {emailModal?.mode === 'update-email' && emailModal.step === 'input' && (
        <Modal
          title={user.email ? 'Change email address' : 'Add email address'}
          subtitle="We'll send a 6-digit OTP to verify ownership."
          onClose={closeModal}
        >
          {modalAlert && <div className="mb-4"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          <Field label="New email address">
            <TextInput type="email" value={emailModal.email}
              onChange={v => setEmailModal({ ...emailModal, email: v })} placeholder="you@example.com" />
          </Field>
          <div className="flex gap-2 mt-4">
            <BtnPrimary onClick={handleSendEmailOtp} loading={modalBusy} disabled={modalBusy}>
              <ChevronRight size={13} /> Send OTP
            </BtnPrimary>
            <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
          </div>
        </Modal>
      )}

      {/* Update email — OTP */}
      {emailModal?.mode === 'update-email' && emailModal.step === 'otp' && (
        <Modal
          title="Verify your email"
          subtitle={`Enter the 6-digit OTP sent to ${emailModal.email}`}
          onClose={closeModal}
        >
          {modalAlert && <div className="mb-2"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          <OtpInput value={emailModal.otp} onChange={v => setEmailModal({ ...emailModal, otp: v })} />
          <div className="flex gap-2 mt-2">
            <BtnPrimary onClick={handleVerifyEmailOtp} loading={modalBusy}
              disabled={modalBusy || emailModal.otp.length < 6}>
              <Check size={13} /> Verify &amp; save
            </BtnPrimary>
            <BtnGhost onClick={() => setEmailModal({ mode: 'update-email', step: 'input', email: emailModal.email })}>
              Back
            </BtnGhost>
          </div>
          <p className="text-xs text-foreground-subtle mt-3">
            Didn&apos;t receive it?{' '}
            <button onClick={handleSendEmailOtp} disabled={modalBusy}
              className="text-primary font-semibold hover:underline disabled:opacity-50">
              Resend OTP
            </button>
          </p>
        </Modal>
      )}

      {/* Resend verification */}
      {emailModal?.mode === 'resend-verify' && (
        <Modal title="Verify email address" subtitle={`A verification link will be sent to ${user.email}`} onClose={closeModal}>
          {modalAlert && <div className="mb-4"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          <div className="flex gap-2">
            <BtnPrimary onClick={handleResendVerify} loading={modalBusy} disabled={modalBusy}>
              <Mail size={13} /> Send verification email
            </BtnPrimary>
            <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
          </div>
        </Modal>
      )}

      {/* Enable / disable email login — input */}
      {emailModal?.mode === 'enable-email-login' && emailModal.step === 'input' && (
        <Modal
          title={user.enableEmailLogin ? 'Disable email login' : 'Enable email login'}
          subtitle={user.enableEmailLogin
            ? 'This will remove password-based access to your account.'
            : 'Set a password to allow signing in with your email.'}
          onClose={closeModal}
        >
          {modalAlert && <div className="mb-4"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          {user.enableEmailLogin ? (
            <div className="flex gap-2">
              <BtnPrimary onClick={handleDisableEmailLogin} loading={modalBusy} disabled={modalBusy}
                className="!bg-error hover:!bg-error">
                Confirm disable
              </BtnPrimary>
              <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Field label="Email">
                <TextInput type="email" value={emailModal.email}
                  onChange={v => setEmailModal({ ...emailModal, email: v })} placeholder="you@example.com" />
              </Field>
              <Field label="Password">
                <TextInput type="password" value={emailModal.password}
                  onChange={v => setEmailModal({ ...emailModal, password: v })} placeholder="Min. 8 characters" />
              </Field>
              <Field label="Confirm password">
                <TextInput type="password" value={emailModal.confirm}
                  onChange={v => setEmailModal({ ...emailModal, confirm: v })} placeholder="Re-enter password" />
              </Field>
              <div className="flex gap-2 mt-1">
                <BtnPrimary onClick={handleEnableEmailLogin} loading={modalBusy} disabled={modalBusy}>
                  <ChevronRight size={13} /> Continue
                </BtnPrimary>
                <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Enable email login — OTP */}
      {emailModal?.mode === 'enable-email-login' && emailModal.step === 'otp' && (
        <Modal title="Verify your email" subtitle={`Enter the 6-digit OTP sent to ${emailModal.email}`} onClose={closeModal}>
          {modalAlert && <div className="mb-2"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          <OtpInput value={emailModal.otp} onChange={v => setEmailModal({ ...emailModal, otp: v })} />
          <div className="flex gap-2 mt-2">
            <BtnPrimary onClick={handleVerifyEmailLogin} loading={modalBusy}
              disabled={modalBusy || emailModal.otp.length < 6}>
              <Check size={13} /> Verify &amp; enable
            </BtnPrimary>
            <BtnGhost onClick={() => setEmailModal({ mode: 'enable-email-login', step: 'input', email: emailModal.email, password: '', confirm: '' })}>
              Back
            </BtnGhost>
          </div>
        </Modal>
      )}

      {/* Change password */}
      {emailModal?.mode === 'change-password' && (
        <Modal title="Change password" subtitle="Enter your current password and choose a new one." onClose={closeModal}>
          {modalAlert && <div className="mb-4"><InfoAlert type={modalAlert.type} msg={modalAlert.msg} /></div>}
          <div className="flex flex-col gap-3">
            <Field label="Current password">
              <TextInput type="password" value={emailModal.current}
                onChange={v => setEmailModal({ ...emailModal, current: v })} placeholder="••••••••" />
            </Field>
            <Field label="New password">
              <TextInput type="password" value={emailModal.next}
                onChange={v => setEmailModal({ ...emailModal, next: v })} placeholder="Min. 8 characters" />
            </Field>
            <Field label="Confirm new password">
              <TextInput type="password" value={emailModal.confirm}
                onChange={v => setEmailModal({ ...emailModal, confirm: v })} placeholder="Re-enter new password" />
            </Field>
            <div className="flex gap-2 mt-1">
              <BtnPrimary onClick={handleChangePassword} loading={modalBusy} disabled={modalBusy}>
                <Check size={13} /> Update password
              </BtnPrimary>
              <BtnGhost onClick={closeModal}>Cancel</BtnGhost>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}