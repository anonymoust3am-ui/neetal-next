'use client';

import React from 'react';
import { Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  phone: string;
  otp: string[];
  otpErr: string;
  secs: number;
  canResend: boolean;
  loading: boolean;
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (i: number, v: string) => void;
  onKey: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onVerify: () => void;
  onResend: () => void;
  onBack: () => void;
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1.5 text-error text-xs mt-1.5 font-medium animate-[fadeUp_0.2s_ease_both]">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

export default function OtpStep({
  phone, otp, otpErr, secs, canResend, loading,
  otpRefs, onChange, onKey, onPaste, onVerify, onResend, onBack,
}: Props) {
  const otpFull = otp.every(d => d !== '');
  const maskedPhone = `${phone.slice(0, 2)}*** ***${phone.slice(-2)}`;

  return (
    <div className="fade-up">
      <button
        onClick={onBack}
        className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-black text-foreground-muted transition-colors hover:text-foreground sm:mb-5 sm:h-auto sm:border-0 sm:bg-transparent sm:px-0 sm:text-sm sm:font-medium"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="mb-6 text-center sm:mb-5 sm:flex sm:items-center sm:gap-3 sm:text-left">
        <div className="mx-auto mb-3 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary sm:mx-0 sm:mb-0 sm:h-11 sm:w-11 sm:rounded-full sm:bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-black leading-tight tracking-tight text-foreground sm:text-lg sm:font-bold sm:tracking-normal">Enter OTP</h2>
          <p className="mx-auto mt-1 max-w-[230px] text-xs font-medium leading-relaxed text-foreground-muted sm:mx-0 sm:mt-0.5 sm:max-w-none sm:leading-normal">
            Sent to{' '}
            <span className="font-semibold text-foreground">
              <span className="sm:hidden">+91 {maskedPhone}</span>
              <span className="hidden sm:inline">+91 {phone.slice(0, 5)} {phone.slice(5)}</span>
            </span>
          </p>
        </div>
      </div>

      {/* 6-digit OTP boxes */}
      <div className="mx-auto mb-2 grid max-w-[318px] grid-cols-6 gap-2 sm:mb-1 sm:flex sm:max-w-none sm:justify-between sm:gap-2" onPaste={onPaste}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { otpRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => onChange(i, e.target.value)}
            onKeyDown={e => {
              onKey(i, e);
              if (e.key === 'Enter' && otpFull && !loading) {
                onVerify();
              }
            }}
            className={`
              otp-bounce h-12 min-w-0 rounded-2xl border text-center text-xl font-black
              bg-input outline-none transition-all duration-150 sm:aspect-square sm:h-auto sm:max-w-[52px] sm:flex-1 sm:rounded-xl sm:border-2 sm:font-bold
              ${otpErr
                ? 'border-error bg-error-light text-error'
                : d
                  ? 'border-primary bg-primary-light text-primary shadow-sm sm:scale-105'
                  : 'border-border text-foreground focus:border-primary focus:bg-card sm:focus:scale-105'}
            `}
          />
        ))}
      </div>
      <Err msg={otpErr} />

      <div className="mb-5 mt-4 flex items-center justify-center gap-3 sm:mt-3 sm:justify-between">
        <p className="text-xs text-foreground-muted">
          {canResend
            ? <span className="hidden sm:inline">Didn&apos;t receive the OTP?</span>
            : <>Resend in <span className="font-bold text-primary tabular-nums">{secs}s</span></>}
        </p>
        <button
          onClick={onResend}
          disabled={!canResend || loading}
          className="rounded-full px-2 py-1 text-xs font-black text-primary transition-colors hover:bg-primary-light hover:text-primary-hover disabled:text-foreground-subtle disabled:hover:bg-transparent sm:px-0 sm:py-0 sm:font-semibold"
        >
          Resend OTP
        </button>
      </div>

      <button
        onClick={onVerify}
        disabled={!otpFull || loading}
        className="fade-up flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-black text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] disabled:bg-disabled disabled:text-foreground-subtle sm:h-auto sm:rounded-lg sm:py-2.5 sm:font-semibold"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
          : <><Shield className="w-4 h-4" /> Verify</>}
      </button>
    </div>
  );
}
