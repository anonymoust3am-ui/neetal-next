'use client';

import { Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  phone: string;
  setPhone: (v: string) => void;
  phoneErr: string;
  setPhoneErr: (v: string) => void;
  loading: boolean;
  onSend: () => void;
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-error animate-[fadeUp_0.2s_ease_both] sm:mt-1.5 sm:text-xs">
      <AlertCircle className="h-3 w-3 flex-shrink-0 sm:h-3.5 sm:w-3.5" />
      {msg}
    </p>
  );
}

export default function PhoneStep({ phone, setPhone, phoneErr, setPhoneErr, loading, onSend }: Props) {
  return (
    <div className="fade-up">
      <div className="mb-3 sm:mb-5">
        <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-foreground-muted sm:mb-1.5 sm:text-sm sm:font-medium sm:normal-case sm:tracking-normal sm:text-foreground">
          Mobile Number
        </label>
        <div
          className={`flex items-center overflow-hidden rounded-lg border ${phoneErr ? 'border-error' : 'border-border'} bg-input transition-colors focus-within:border-border-focus sm:rounded-md`}
        >
          <div className="flex flex-shrink-0 cursor-default select-none items-center gap-1.5 border-r border-border bg-muted px-2.5 py-2.5 sm:px-3">
            <span className="text-sm leading-none sm:text-base">🇮🇳</span>
            <span className="text-xs font-semibold text-foreground sm:text-sm">+91</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            autoFocus
            onChange={e => {
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
              setPhoneErr('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && phone.length === 10 && !loading) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="10-digit number"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm tracking-wide text-foreground outline-none placeholder:text-foreground-subtle"
          />
          {phone.length === 10 && (
            <CheckCircle className="mr-3 h-4 w-4 flex-shrink-0 text-success" />
          )}
        </div>
        <Err msg={phoneErr} />
      </div>

      <button
        onClick={onSend}
        disabled={loading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-black text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60 sm:h-auto sm:py-2.5 sm:font-semibold"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</>
          : <><Phone className="w-4 h-4" /> Send OTP</>}
      </button>

      <p className="mt-2 text-center text-[10px] leading-snug text-foreground-muted sm:mt-4 sm:text-xs sm:leading-relaxed">
        <span className="sm:hidden">
          <a href="#" className="text-link hover:underline underline-offset-2">Terms</a>
          {' & '}
          <a href="#" className="text-link hover:underline underline-offset-2">Privacy</a>
          {' '}apply.
        </span>
        <span className="hidden sm:inline">
          By continuing you agree to our{' '}
          <a href="#" className="text-link hover:underline underline-offset-2">Terms</a>
          {' & '}
          <a href="#" className="text-link hover:underline underline-offset-2">Privacy Policy</a>
        </span>
      </p>
    </div>
  );
}
