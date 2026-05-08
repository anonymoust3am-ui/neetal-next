'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, GraduationCap } from 'lucide-react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { completeProfile, loginOrRegister } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import LeftPanel from './components/LeftPanel';
import PhoneStep from './components/PhoneStep';
import OtpStep from './components/OtpStep';
import ProfileStep from './components/ProfileStep';
import type { ProfileStepProps } from './components/ProfileStep';
import Link from 'next/link';

type Step = 'phone' | 'otp' | 'profile';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const { user, loading: authLoading, refreshUser } = useAuth();

  // ── Step ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('phone');

  // Redirect once auth is resolved — skip if user is mid-profile-setup
  useEffect(() => {
    if (!authLoading && user && step !== 'profile') {
      router.replace(redirectTo);
    }
  }, [authLoading, user, router, step, redirectTo]);

  // ── Phone ─────────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [phoneErr, setPhoneErr] = useState('');

  // ── OTP ───────────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [otpErr, setOtpErr] = useState('');
  const [secs, setSecs] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Profile ───────────────────────────────────────────────────────────────
  const [pic, setPic] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [city, setCity] = useState('');
  const [exam, setExam] = useState('');
  const [source, setSource] = useState('');
  const [role, setRole] = useState('');
  const [gender, setGender] = useState('');
  const [refCode, setRefCode] = useState('');
  const [showRef, setShowRef] = useState(false);
  const [pErr, setPErr] = useState<Record<string, string>>({});

  // ── Loading / error ───────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState('');

  // ── Firebase refs ─────────────────────────────────────────────────────────
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  // ── OTP countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'otp') return;
    if (secs <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, step]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getVerifier = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible' },
      );
    }
    return recaptchaVerifierRef.current;
  };

  const clearVerifier = () => {
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;
  };

  const firebaseErrMsg = (err: unknown): string => {
    const code = (err as { code?: string }).code ?? '';
    const map: Record<string, string> = {
      'auth/invalid-phone-number': 'Invalid phone number. Please check and try again.',
      'auth/too-many-requests': 'Too many attempts. Please wait a while and try again.',
      'auth/captcha-check-failed': 'reCAPTCHA failed. Please refresh and try again.',
      'auth/invalid-verification-code': 'Incorrect OTP. Please check and try again.',
      'auth/code-expired': 'OTP has expired. Please request a new one.',
      'auth/missing-phone-number': 'Phone number is required.',
    };
    return map[code] ?? (err instanceof Error ? err.message : 'Something went wrong. Please try again.');
  };

  // ── Phone handlers ────────────────────────────────────────────────────────

  const sendOtp = async () => {
    if (!phone) { setPhoneErr('Phone number is required'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setPhoneErr('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setLoading(true);
    setGlobalErr('');
    try {
      const verifier = getVerifier();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      confirmationResultRef.current = result;
      setOtp(Array(6).fill(''));
      setOtpErr('');
      setSecs(45);
      setCanResend(false);
      setStep('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch (err) {
      clearVerifier();
      setPhoneErr(firebaseErrMsg(err));
    } finally {
      setLoading(false);
    }
  };

  // ── OTP handlers ──────────────────────────────────────────────────────────

  const changeOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n); setOtpErr('');
    if (v && i < 5) setTimeout(() => otpRefs.current[i + 1]?.focus(), 10);
  };

  const keyOtp = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) otpRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const pasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const d = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const n = [...otp]; d.split('').forEach((c, i) => { n[i] = c; }); setOtp(n);
    setTimeout(() => otpRefs.current[Math.min(d.length, 5)]?.focus(), 10);
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) { setOtpErr('Please enter the complete 6-digit OTP'); return; }
    if (!confirmationResultRef.current) {
      setOtpErr('Session expired. Please go back and resend OTP.');
      return;
    }
    setLoading(true);
    setGlobalErr('');
    try {
      const credential = await confirmationResultRef.current.confirm(code);
      const token = await credential.user.getIdToken();
      const { user: apiUser } = await loginOrRegister(token);
      if (!apiUser.isProfileComplete) {
        setStep('profile');
      }
      // Profile complete: the useEffect watching AuthContext.user handles the redirect (using redirectTo)
    } catch (err) {
      setOtpErr(firebaseErrMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    setGlobalErr('');
    clearVerifier();
    try {
      const verifier = getVerifier();
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifier);
      confirmationResultRef.current = result;
      setOtp(Array(6).fill('')); setOtpErr('');
      setSecs(45); setCanResend(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    } catch (err) {
      clearVerifier();
      setGlobalErr(firebaseErrMsg(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Profile submit ────────────────────────────────────────────────────────

  const createAccount = async () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.name = 'Full name is required';
    if (!stateVal) e.state = 'Please select your state';
    if (!exam) e.exam = 'Please select your target exam';
    if (!source) e.source = 'Please tell us how you found us';
    if (!role) e.role = 'Please select your role';
    setPErr(e);
    if (Object.keys(e).length) return;

    const user = auth.currentUser;
    if (!user) {
      setGlobalErr('Session expired. Please start over.');
      setStep('phone');
      return;
    }

    setLoading(true);
    setGlobalErr('');
    try {
      const token = await user.getIdToken();
      await completeProfile(token, {
        name: fullName.trim(),
        state: stateVal,
        city: city.trim() || undefined,
        email: email.trim() || undefined,
        gender: gender || undefined,
        // profilePic: would need to upload to storage first — skip for now
      });
      await refreshUser();
      router.push(redirectTo);
    } catch (err) {
      setGlobalErr(err instanceof Error ? err.message : 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  const stepN = step === 'phone' ? 0 : step === 'otp' ? 1 : 2;

  const profileProps: ProfileStepProps = {
    phone, pic, setPic, fullName, setFullName,
    email, setEmail, stateVal, setStateVal, city, setCity,
    exam, setExam, source, setSource, role, setRole, gender, setGender,
    refCode, setRefCode, showRef, setShowRef, pErr, setPErr,
    loading,
    onCreateAccount: createAccount,
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.28s ease both; }
        .otp-bounce:focus { transform: scale(1.08); }
      `}</style>

      {/* Invisible reCAPTCHA mount point */}
      <div id="recaptcha-container" className='display-none' />

      <div className="min-h-screen bg-background flex">

        {/* Left Swiper panel */}
        <LeftPanel />

        {/* Right form panel */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-[440px]">

            {/* Logo above steps */}
            <Link href="/" className="shrink-0">
              <img
                src="/logo-nobg.png"
                alt="Neetell Logo"
                className="h-35 w-auto"
              />
            </Link>

            {/* Step breadcrumb */}
            <div className="flex items-center gap-1 sm:gap-2 mb-5">
              {['Phone', 'OTP', 'Profile'].map((lbl, i) => (
                <React.Fragment key={lbl}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${i < stepN
                        ? 'bg-primary text-primary-foreground'
                        : i === stepN
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-foreground-muted'
                      }`}>
                      {i < stepN ? <Check className="w-3.5 h-3.5" /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium hidden sm:block truncate transition-colors ${i === stepN ? 'text-foreground' : 'text-foreground-muted'
                      }`}>{lbl}</span>
                  </div>
                  {i < 2 && (
                    <div
                      className="flex-1 h-px transition-all duration-500"
                      style={{ background: i < stepN ? 'var(--color-primary)' : 'var(--color-border)' }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Card */}
            <div className="bg-card border border-border rounded-2xl shadow-md overflow-hidden">
              <div className="h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${((stepN + 1) / 3) * 100}%` }}
                />
              </div>

              <div className={step === 'profile' ? 'p-4' : 'p-5 sm:p-6'}>

                {/* Global error banner */}
                {globalErr && (
                  <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-xs font-medium fade-up">
                    {globalErr}
                  </div>
                )}

                {step === 'phone' && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-0.5">Enter your number</h2>
                    <p className="text-foreground-muted text-sm mb-5">
                      Sign in or create an account with your mobile number.
                    </p>
                    <PhoneStep
                      phone={phone}
                      setPhone={setPhone}
                      phoneErr={phoneErr}
                      setPhoneErr={setPhoneErr}
                      loading={loading}
                      onSend={sendOtp}
                    />
                  </div>
                )}

                {step === 'otp' && (
                  <OtpStep
                    phone={phone}
                    otp={otp}
                    otpErr={otpErr}
                    secs={secs}
                    canResend={canResend}
                    loading={loading}
                    otpRefs={otpRefs}
                    onChange={changeOtp}
                    onKey={keyOtp}
                    onPaste={pasteOtp}
                    onVerify={verifyOtp}
                    onResend={resendOtp}
                    onBack={() => {
                      clearVerifier();
                      confirmationResultRef.current = null;
                      setStep('phone');
                      setOtp(Array(6).fill(''));
                      setOtpErr('');
                    }}
                  />
                )}

                {step === 'profile' && (
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-3">Set up your profile</h2>
                    <ProfileStep {...profileProps} />
                  </div>
                )}

              </div>
            </div>

            <p className="text-center text-xs text-foreground-muted mt-4">
              © {new Date().getFullYear()} NeeTell · All rights reserved
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
