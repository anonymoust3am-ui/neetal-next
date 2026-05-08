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

  return (
    <div className="fade-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-foreground-muted hover:text-foreground text-sm mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">Verify your number</h2>
          <p className="text-foreground-muted text-xs mt-0.5">
            OTP sent to 🇮🇳 +91{' '}
            <span className="font-semibold text-foreground">
              {phone.slice(0, 5)} {phone.slice(5)}
            </span>
          </p>
        </div>
      </div>

      {/* 6-digit OTP boxes */}
      <div className="flex justify-between gap-2 mb-1" onPaste={onPaste}>
        {otp.map((d, i) => (
          <input
            key={i}
            ref={el => { otpRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => onChange(i, e.target.value)}
            onKeyDown={e => onKey(i, e)}
            className={`
              otp-bounce flex-1 aspect-square max-w-[52px]
              text-center text-xl font-bold rounded-xl border-2
              bg-input outline-none transition-all duration-150
              ${otpErr
                ? 'border-error text-error'
                : d
                  ? 'border-primary text-foreground scale-105 shadow-sm'
                  : 'border-border text-foreground focus:border-primary focus:scale-105'}
            `}
          />
        ))}
      </div>
      <Err msg={otpErr} />

      <div className="flex items-center justify-between mt-3 mb-5">
        <p className="text-xs text-foreground-muted">
          {canResend
            ? "Didn't receive the OTP?"
            : <>Resend in <span className="font-bold text-primary tabular-nums">{secs}s</span></>}
        </p>
        <button
          onClick={onResend}
          disabled={!canResend || loading}
          className="text-xs font-semibold text-primary hover:text-primary-hover disabled:text-foreground-subtle transition-colors"
        >
          Resend OTP
        </button>
      </div>

      {otpFull && (
        <button
          onClick={onVerify}
          disabled={loading}
          className="fade-up w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg py-2.5 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
            : <><Shield className="w-4 h-4" /> Verify &amp; Continue</>}
        </button>
      )}
    </div>
  );
}
