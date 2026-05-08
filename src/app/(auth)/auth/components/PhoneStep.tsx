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
    <p className="flex items-center gap-1.5 text-error text-xs mt-1.5 font-medium animate-[fadeUp_0.2s_ease_both]">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
      {msg}
    </p>
  );
}

export default function PhoneStep({ phone, setPhone, phoneErr, setPhoneErr, loading, onSend }: Props) {
  return (
    <div className="fade-up">
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-1.5">
          Mobile Number
        </label>
        <div
          className={`flex items-center border ${phoneErr ? 'border-error' : 'border-border'} focus-within:border-border-focus rounded-md overflow-hidden bg-input transition-colors`}
        >
          <div className="flex items-center gap-1.5 px-3 py-2.5 bg-muted border-r border-border select-none flex-shrink-0 cursor-default">
            <span className="text-base leading-none">🇮🇳</span>
            <span className="text-sm font-semibold text-foreground">+91</span>
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
            onKeyDown={e => e.key === 'Enter' && onSend()}
            placeholder="Enter 10-digit number"
            className="flex-1 px-3 py-2.5 bg-transparent text-foreground placeholder:text-foreground-subtle outline-none text-sm tracking-wide"
          />
          {phone.length === 10 && (
            <CheckCircle className="w-4 h-4 text-success mr-3 flex-shrink-0" />
          )}
        </div>
        <Err msg={phoneErr} />
      </div>

      <button
        onClick={onSend}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary-hover rounded-lg py-2.5 font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending OTP…</>
          : <><Phone className="w-4 h-4" /> Send OTP</>}
      </button>

      <p className="text-center text-xs text-foreground-muted mt-4 leading-relaxed">
        By continuing you agree to our{' '}
        <a href="#" className="text-link hover:underline underline-offset-2">Terms</a>
        {' & '}
        <a href="#" className="text-link hover:underline underline-offset-2">Privacy Policy</a>
      </p>
    </div>
  );
}
