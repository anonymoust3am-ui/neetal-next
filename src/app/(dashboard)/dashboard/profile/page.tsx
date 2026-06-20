'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Phone, Mail, MapPin, Globe, Calendar, User,
  Monitor, Smartphone, LogOut, Edit3, Check, X,
  Loader2, AlertCircle, Clock, Lock, Key, Shield, RefreshCw, ChevronRight
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

type SecurityFlow = 
  | { mode: 'idle' }
  | { mode: 'update-email'; step: 'input'; email: string }
  | { mode: 'update-email'; step: 'otp'; email: string; otp: string }
  | { mode: 'enable-email-login'; step: 'input'; email: string; password: string; confirm: string }
  | { mode: 'enable-email-login'; step: 'otp'; email: string; otp: string }
  | { mode: 'change-password'; current: string; next: string; confirm: string };

type TabType = 'profile' | 'security' | 'sessions';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

async function getToken(): Promise<string> {
  const u = auth.currentUser;
  if (!u) throw new Error('Not signed in');
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

/* ─── UI Components ────────────────────────────────────────────────────────── */

function StatusBadge({ children, variant = 'neutral' }: { children: React.ReactNode; variant?: 'neutral' | 'success' | 'warning' | 'error' }) {
  const map = {
    neutral: 'bg-muted text-foreground-muted',
    success: 'bg-success-light text-success border border-success/10',
    warning: 'bg-warning-light text-warning border border-warning/10',
    error:   'bg-error-light text-error border border-error/10',
  };
  return (
    <span className={cn('text-xs font-medium px-2.5 py-0.5 rounded-full tracking-wide shrink-0', map[variant])}>
      {children}
    </span>
  );
}

function MessageBox({ type, msg }: { type: 'error' | 'success'; msg: string }) {
  return (
    <div className={cn(
      'flex items-start gap-2.5 p-3 rounded-md text-sm border',
      type === 'error' ? 'bg-error-light border-error/20 text-error' : 'bg-success-light border-success/20 text-success',
    )}>
      {type === 'error' ? <AlertCircle size={16} className="mt-0.5 shrink-0" /> : <Check size={16} className="mt-0.5 shrink-0" />}
      <span className="font-medium">{msg}</span>
    </div>
  );
}

function CodeFieldInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(6, '').split('').slice(0, 6);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
    }
  }

  function handleChange(i: number, v: string) {
    const digit = v.replace(/\D/g, '').slice(-1);
    const arr = [...digits]; arr[i] = digit;
    onChange(arr.join(''));
    if (digit && i < 5) (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus();
  }

  return (
    <div className="flex gap-2 justify-between max-w-xs mx-auto sm:mx-0 my-2">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i} id={`otp-${i}`} type="text" inputMode="numeric" pattern="[0-9]*"
          maxLength={1} value={digits[i] ?? ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          className="w-10 h-12 text-center text-lg font-bold rounded-md border border-border bg-input text-foreground outline-none focus:border-border-focus shadow-sm"
        />
      ))}
    </div>
  );
}

/* ─── Main Component Page ────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  /* Main States */
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditForm>({ name: '', state: '', city: '', country: '', gender: '', dob: '', alternatePhone: '' });
  const [saving, setSaving] = useState(false);
  const [globalAlert, setGlobalAlert] = useState<AlertState>(null);

  /* Inline Flow States */
  const [secFlow, setSecFlow] = useState<SecurityFlow>({ mode: 'idle' });
  const [secBusy, setSecBusy] = useState(false);
  const [secAlert, setSecAlert] = useState<AlertState>(null);

  /* Sessions Loading States */
  const [sessions, setSessions] = useState<SessionData[] | null>(null);
  const [sessLoading, setSessLoading] = useState(true);
  const [sessError, setSessError] = useState('');
  const [loggingOut, setLoggingOut] = useState<string | null>(null);
  const [logoutAllBusy, setLogoutAllBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name ?? '',
      state: user.state ?? '',
      city: user.city ?? '',
      country: user.country ?? '',
      gender: user.gender ?? '',
      dob: user.dob ?? '',
      alternatePhone: user.alternatePhone ?? ''
    });
  }, [user]);

  const loadSessions = useCallback(async () => {
    setSessLoading(true); setSessError('');
    try {
      const token = await getToken();
      setSessions((await getSessions(token)).sessions);
    } catch (e) {
      setSessError(e instanceof Error ? e.message : 'Could not fetch your active sessions');
    } finally { setSessLoading(false); }
  }, []);

  useEffect(() => { if (activeTab === 'sessions') loadSessions(); }, [activeTab, loadSessions]);

  const handleSaveProfile = async () => {
    if (!form.name.trim()) { setGlobalAlert({ type: 'error', msg: 'Please provide your name.' }); return; }
    setSaving(true); setGlobalAlert(null);
    try {
      const token = await getToken();
      await apiUpdateProfile(token, {
        name: form.name.trim(),
        state: form.state || undefined,
        city: form.city.trim() || undefined,
        country: form.country.trim() || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
        alternatePhone: form.alternatePhone.trim() || undefined,
      });
      await refreshUser();
      setGlobalAlert({ type: 'success', msg: 'Profile updated successfully!' });
      setEditing(false);
    } catch (e) {
      setGlobalAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed to update profile.' });
    } finally { setSaving(false); }
  };

  const handleLogoutSession = async (deviceId: string) => {
    setLoggingOut(deviceId);
    try {
      await logoutDevice(await getToken(), deviceId);
      setSessions(p => p?.filter(s => s.deviceId !== deviceId) ?? null);
    } catch {}
    setLoggingOut(null);
  };

  const handleLogoutAll = async () => {
    setLogoutAllBusy(true);
    try { await logoutRemote(await getToken()); await loadSessions(); } catch {}
    setLogoutAllBusy(false);
  };

  /* Action Handlers */
  const runSendEmailOtp = async (targetEmail: string) => {
    if (!targetEmail.trim()) { setSecAlert({ type: 'error', msg: 'Please enter a valid email address.' }); return; }
    setSecBusy(true); setSecAlert(null);
    try {
      await sendEmailUpdateOtp(await getToken(), targetEmail.trim());
      setSecFlow({ mode: 'update-email', step: 'otp', email: targetEmail.trim(), otp: '' });
    } catch (e) { setSecAlert({ type: 'error', msg: e instanceof Error ? e.message : 'Failed to send verification code.' }); }
    finally { setSecBusy(false); }
  };

  const runVerifyEmailOtp = async () => {
    if (secFlow.mode !== 'update-email' || secFlow.step !== 'otp') return;
    setSecBusy(true); setSecAlert(null);
    try {
      await verifyEmailOtp(await getToken(), secFlow.email, secFlow.otp);
      await refreshUser(); setSecFlow({ mode: 'idle' });
      setGlobalAlert({ type: 'success', msg: 'Your email address has been successfully updated!' });
    } catch (e) { setSecAlert({ type: 'error', msg: 'The code you entered is invalid or expired.' }); }
    finally { setSecBusy(false); }
  };

  const runEnableEmailLogin = async () => {
    if (secFlow.mode !== 'enable-email-login' || secFlow.step !== 'input') return;
    const { email, password, confirm } = secFlow;
    if (!email.trim() || password.length < 8) { setSecAlert({ type: 'error', msg: 'Check your details. Passwords must be at least 8 characters long.' }); return; }
    if (password !== confirm) { setSecAlert({ type: 'error', msg: 'Passwords do not match.' }); return; }
    setSecBusy(true); setSecAlert(null);
    try {
      await enableEmailLogin(await getToken(), email.trim(), password);
      setSecFlow({ mode: 'enable-email-login', step: 'otp', email: email.trim(), otp: '' });
    } catch (e) { setSecAlert({ type: 'error', msg: 'Failed to initiate password login setup.' }); }
    finally { setSecBusy(false); }
  };

  const runVerifyEmailLogin = async () => {
    if (secFlow.mode !== 'enable-email-login' || secFlow.step !== 'otp') return;
    setSecBusy(true); setSecAlert(null);
    try {
      await verifyEmailLogin(await getToken(), secFlow.email, secFlow.otp);
      await refreshUser(); setSecFlow({ mode: 'idle' });
      setGlobalAlert({ type: 'success', msg: 'Password sign-in option is now enabled!' });
    } catch (e) { setSecAlert({ type: 'error', msg: 'The verification code didn\'t match.' }); }
    finally { setSecBusy(false); }
  };

  const runChangePassword = async () => {
    if (secFlow.mode !== 'change-password') return;
    const { current, next, confirm } = secFlow;
    if (next.length < 8 || next !== confirm) { setSecAlert({ type: 'error', msg: 'Please check your new password guidelines or confirmation match.' }); return; }
    setSecBusy(true); setSecAlert(null);
    try {
      await updatePassword(await getToken(), current, next);
      setSecFlow({ mode: 'idle' });
      setGlobalAlert({ type: 'success', msg: 'Password changed successfully.' });
    } catch (e) { setSecAlert({ type: 'error', msg: 'Your current password choice was incorrect.' }); }
    finally { setSecBusy(false); }
  };

  const runDisableEmailLogin = async () => {
    setSecBusy(true); setSecAlert(null);
    try {
      await disableEmailLogin(await getToken());
      await refreshUser();
      setGlobalAlert({ type: 'success', msg: 'Password sign-in has been turned off safely.' });
    } catch (e) { setSecAlert({ type: 'error', msg: 'Failed to turn off password option.' }); }
    finally { setSecBusy(false); }
  };

  if (!user) return null;
  const pct = calcPct(user);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-selection">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        
        {/* Profile Card Header */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg flex items-center justify-center shrink-0 bg-primary text-primary-foreground font-bold text-lg shadow-sm">
                {makeInitials(user.name, user.phone)}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight truncate">{user.name ?? 'My Profile Account'}</h1>
                <p className="text-sm text-foreground-muted mt-0.5">{user.phone}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <StatusBadge variant={user.isProfileComplete ? 'success' : 'warning'}>
                    {user.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </StatusBadge>
                  {user.emailVerified && <StatusBadge variant="success">Email Linked</StatusBadge>}
                </div>
              </div>
            </div>
            
            {!editing && activeTab === 'profile' && (
              <button
                onClick={() => { setGlobalAlert(null); setEditing(true); }}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-md border border-border hover:bg-hover text-sm font-medium transition-colors"
              >
                <Edit3 size={14} /> Edit Details
              </button>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-1 text-xs font-semibold text-foreground-muted">
              <span>Profile Progress</span>
              <span className="font-mono">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-500 rounded-full", pct < 50 ? "bg-error" : pct < 80 ? "bg-warning" : "bg-primary")} 
                style={{ width: `${pct}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Global Notifications Panel */}
        {globalAlert && <div className="mb-5"><MessageBox type={globalAlert.type} msg={globalAlert.msg} /></div>}

        {/* Navigation Tabs Bar */}
        <div className="border-b border-border mb-6 flex gap-2 overflow-x-auto no-scrollbar">
          {([
            { id: 'profile', label: 'My Details' },
            { id: 'security', label: 'Sign-in & Password' },
            { id: 'sessions', label: 'Where You\'re Signed In' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditing(false); setSecFlow({ mode: 'idle' }); setSecAlert(null); }}
              className={cn(
                "px-3 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-all",
                activeTab === tab.id 
                  ? "border-primary text-foreground font-semibold" 
                  : "border-transparent text-foreground-muted hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Display Area */}
        <div className="bg-card border border-border rounded-xl p-5 sm:p-6 shadow-sm">
          
          {/* TAB 1: DETAILS AND INFORMATION */}
          {activeTab === 'profile' && (
            <div>
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">Full Name</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">Gender</label>
                      <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus appearance-none transition-colors">
                        <option value="">Select Gender</option>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">State</label>
                      <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus appearance-none transition-colors">
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">City</label>
                      <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">Country</label>
                      <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-foreground-muted mb-1">Date of Birth</label>
                      <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-foreground-muted mb-1">Backup Phone Number</label>
                      <input type="text" value={form.alternatePhone} onChange={e => setForm({ ...form, alternatePhone: e.target.value })} placeholder="+91 XXXXX XXXXX" className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-border">
                    <button onClick={handleSaveProfile} disabled={saving} className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-primary-hover transition-colors">
                      {saving && <Loader2 size={14} className="animate-spin" />} Save Details
                    </button>
                    <button onClick={() => setEditing(false)} className="h-9 px-4 rounded-md border border-border text-sm text-foreground-muted font-semibold hover:bg-hover transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {([
                    { icon: User, label: 'Full Name', value: user.name },
                    { icon: User, label: 'Gender', value: user.gender },
                    { icon: MapPin, label: 'State Location', value: user.state },
                    { icon: MapPin, label: 'City / Town', value: user.city },
                    { icon: Globe, label: 'Country', value: user.country },
                    { icon: Calendar, label: 'Date of Birth', value: user.dob ? new Date(user.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined },
                    { icon: Phone, label: 'Alternate Phone', value: user.alternatePhone },
                  ]).map((field, index) => (
                    <div key={index} className="flex items-center gap-3.5 py-3 border-b border-border/40 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
                      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground-muted shrink-0 border border-border/30">
                        <field.icon size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground-subtle">{field.label}</p>
                        <p className={cn("text-sm font-medium mt-0.5 truncate", field.value ? "text-foreground" : "text-foreground-subtle italic font-normal")}>
                          {field.value ?? 'Not set yet'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SIGN IN & PASSWORD CONTROLS */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* {secAlert && <StatusCard type={secAlert.type} msg={secAlert.msg} />} */}

              {secFlow.mode === 'idle' && (
                <div className="divide-y divide-border/50">
                  <div className="flex items-center justify-between py-4 first:pt-0">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Phone Number</h4>
                      <p className="text-xs text-foreground-muted mt-0.5">{user.phone}</p>
                    </div>
                    {/* <StatusBadge variant="success">Verified Primary Method</StatusBadge> */}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Email Address</h4>
                      <p className="text-xs text-foreground-muted mt-0.5">{user.email ?? 'No email linked to your account'}</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {user.email ? (
                        <>
                          <StatusBadge variant={user.emailVerified ? 'success' : 'warning'}>{user.emailVerified ? 'Verified' : 'Unverified'}</StatusBadge>
                          <button onClick={() => setSecFlow({ mode: 'update-email', step: 'input', email: user.email ?? '' })} className="text-xs font-bold text-text-link hover:text-text-link-hover hover:underline ml-2">Change</button>
                        </>
                      ) : (
                        <button onClick={() => setSecFlow({ mode: 'update-email', step: 'input', email: '' })} className="text-xs font-bold text-primary hover:underline">Link Email</button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Password Sign-In Option</h4>
                      <p className="text-xs text-foreground-muted mt-0.5">Allows you to sign in with an email and password instead of phone codes.</p>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <StatusBadge variant={user.enableEmailLogin ? 'success' : 'neutral'}>{user.enableEmailLogin ? 'Enabled' : 'Disabled'}</StatusBadge>
                      {user.enableEmailLogin ? (
                        <button onClick={runDisableEmailLogin} disabled={secBusy} className="text-xs font-bold text-error hover:underline ml-2">Turn Off</button>
                      ) : (
                        <button onClick={() => setSecFlow({ mode: 'enable-email-login', step: 'input', email: user.email ?? '', password: '', confirm: '' })} className="text-xs font-bold text-primary hover:underline ml-2">Turn On</button>
                      )}
                    </div>
                  </div>

                  {user.enableEmailLogin && (
                    <div className="flex items-center justify-between py-4 last:pb-0">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Account Password</h4>
                        <p className="text-xs text-foreground-muted mt-0.5 font-mono tracking-widest">••••••••</p>
                      </div>
                      <button onClick={() => setSecFlow({ mode: 'change-password', current: '', next: '', confirm: '' })} className="text-xs font-bold text-text-link hover:text-text-link-hover hover:underline">Update Password</button>
                    </div>
                  )}
                </div>
              )}

              {/* Inline Action Sub-Cards */}
              {secFlow.mode === 'update-email' && secFlow.step === 'input' && (
                <div className="max-w-md space-y-3 bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-bold text-foreground">Change Email Address</h3>
                  <input type="email" placeholder="name@example.com" value={secFlow.email} onChange={e => setSecFlow({ ...secFlow, email: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none focus:border-border-focus transition-colors" />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => runSendEmailOtp(secFlow.email)} disabled={secBusy} className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-primary-hover transition-colors">
                      {secBusy && <Loader2 size={12} className="animate-spin" />} Send Code
                    </button>
                    <button onClick={() => setSecFlow({ mode: 'idle' })} className="h-9 px-4 border border-border text-foreground-muted bg-card rounded-md text-sm font-semibold hover:bg-hover transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {secFlow.mode === 'update-email' && secFlow.step === 'otp' && (
                <div className="max-w-md space-y-3 bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-bold text-foreground">Enter Verification Code</h3>
                  <p className="text-xs text-foreground-muted">We sent a 6-digit verification code to your email at <b>{secFlow.email}</b></p>
                  <CodeFieldInput value={secFlow.otp} onChange={v => setSecFlow({ ...secFlow, otp: v })} />
                  <div className="flex gap-2 pt-1">
                    <button onClick={runVerifyEmailOtp} disabled={secBusy || secFlow.otp.length < 6} className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors">
                      Verify & Save
                    </button>
                    <button onClick={() => setSecFlow({ mode: 'update-email', step: 'input', email: secFlow.email })} className="h-9 px-4 border border-border text-foreground-muted bg-card rounded-md text-sm font-semibold hover:bg-hover transition-colors">Back</button>
                  </div>
                </div>
              )}

              {secFlow.mode === 'enable-email-login' && secFlow.step === 'input' && (
                <div className="max-w-md space-y-3 bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-bold text-foreground">Setup Password Access</h3>
                  <div className="space-y-2">
                    <input type="email" placeholder="Your Email Address" value={secFlow.email} onChange={e => setSecFlow({ ...secFlow, email: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                    <input type="password" placeholder="Create Password (Min 8 characters)" value={secFlow.password} onChange={e => setSecFlow({ ...secFlow, password: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                    <input type="password" placeholder="Confirm Password" value={secFlow.confirm} onChange={e => setSecFlow({ ...secFlow, confirm: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={runEnableEmailLogin} disabled={secBusy} className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors">Continue Setup</button>
                    <button onClick={() => setSecFlow({ mode: 'idle' })} className="h-9 px-4 border border-border text-foreground-muted bg-card rounded-md text-sm font-semibold hover:bg-hover transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {secFlow.mode === 'enable-email-login' && secFlow.step === 'otp' && (
                <div className="max-w-md space-y-3 bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-bold text-foreground">Confirm Email Code</h3>
                  <CodeFieldInput value={secFlow.otp} onChange={v => setSecFlow({ ...secFlow, otp: v })} />
                  <div className="flex gap-2 pt-1">
                    <button onClick={runVerifyEmailLogin} disabled={secBusy || secFlow.otp.length < 6} className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors">Turn On Password</button>
                    <button onClick={() => setSecFlow({ mode: 'idle' })} className="h-9 px-4 border border-border text-foreground-muted bg-card rounded-md text-sm font-semibold hover:bg-hover transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              {secFlow.mode === 'change-password' && (
                <div className="max-w-md space-y-3 bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-sm font-bold text-foreground">Change Password</h3>
                  <div className="space-y-2">
                    <input type="password" placeholder="Current Password" value={secFlow.current} onChange={e => setSecFlow({ ...secFlow, current: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                    <input type="password" placeholder="New Password" value={secFlow.next} onChange={e => setSecFlow({ ...secFlow, next: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                    <input type="password" placeholder="Confirm New Password" value={secFlow.confirm} onChange={e => setSecFlow({ ...secFlow, confirm: e.target.value })} className="w-full h-10 px-3 text-sm rounded-md border border-border bg-input outline-none" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={runChangePassword} disabled={secBusy} className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary-hover transition-colors">Update Password</button>
                    <button onClick={() => setSecFlow({ mode: 'idle' })} className="h-9 px-4 border border-border text-foreground-muted bg-card rounded-md text-sm font-semibold hover:bg-hover transition-colors">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SIGNED IN SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/60 pb-4 gap-2">
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Active Devices</h3>
                  <p className="text-xs text-foreground-muted mt-0.5">These devices are currently logged into your account.</p>
                </div>
                {sessions && sessions.length > 0 && (
                  <button
                    onClick={handleLogoutAll}
                    disabled={logoutAllBusy}
                    className="h-8 px-3 rounded-md border border-error text-error hover:bg-error-light text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    {logoutAllBusy ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />} Sign Out All Other Devices
                  </button>
                )}
              </div>

              {sessLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-foreground-subtle" />
                </div>
              ) : sessError ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-muted rounded-lg border border-border">
                  <p className="text-sm text-foreground-muted font-medium grow">{sessError}</p>
                  <button onClick={loadSessions} className="h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-primary-hover transition-colors"><RefreshCw size={12} /> Retry</button>
                </div>
              ) : sessions && sessions.length > 0 ? (
                <div className="space-y-2">
                  {sessions.map(sess => {
                    const DeviceIcon = sess.deviceType === 'mobile' ? Smartphone : Monitor;
                    const isBusy = loggingOut === sess.deviceId;
                    return (
                      <div key={sess.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border/60 bg-input gap-3">
                        <div className="flex items-start gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-md bg-card border border-border flex items-center justify-center text-foreground-muted shrink-0 shadow-sm">
                            <DeviceIcon size={16} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-foreground truncate">{sess.deviceName ?? (sess.deviceType === 'mobile' ? 'Mobile Phone' : 'Laptop / Desktop')}</h4>
                              {sess.isActive && <span className="inline-block w-1.5 h-1.5 rounded-full bg-success ring-4 ring-success/10 shrink-0" />}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-foreground-muted font-medium mt-0.5">
                              {sess.ipAddress && <span className="font-mono">{sess.ipAddress}</span>}
                              <span className="text-border-strong">•</span>
                              <span className="inline-flex items-center gap-1"><Clock size={11} /> {timeAgo(sess.lastSeen)}</span>
                              {sess.isActive && <span className="text-success font-bold text-[10px] uppercase tracking-wider ml-1">This Device</span>}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleLogoutSession(sess.deviceId)}
                          disabled={isBusy}
                          className="h-8 px-3 rounded-md border border-border text-foreground-muted bg-card hover:bg-hover text-xs font-semibold inline-flex items-center justify-center gap-1 self-end sm:self-center shrink-0 transition-colors"
                        >
                          {isBusy ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />} Log Out Device
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <p className="text-sm text-foreground-subtle">No other device sessions found.</p>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}