'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import {
  User, Mail, MapPin, ChevronDown, Camera, CheckCircle,
  AlertCircle, Loader2, Gift, ChevronUp, Building2,
  UserCheck, Users, GraduationCap,
} from 'lucide-react';
import {
  FaGoogle, FaYoutube, FaInstagram, FaFacebook,
  FaWhatsapp, FaUserFriends, FaSchool, FaNewspaper,
} from 'react-icons/fa';

// ─── Constants ──────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh',
  'Puducherry', 'Andaman & Nicobar Islands', 'Lakshadweep',
  'Dadra & Nagar Haveli and Daman & Diu',
];

const EXAMS = [
  'NEET UG', 'NEET PG', 'INI-CET', 'AIIMS PG', 'JIPMER PG', 'NEET SS',
  'FMGE / MCI Screening', 'USMLE Step 1', 'USMLE Step 2 CK',
  'PLAB 1 & 2', 'PGI Chandigarh', 'AMC (Australia)', 'Other',
];

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

const ROLES = [
  { value: 'student',   label: 'Student',          Icon: GraduationCap },
  { value: 'parent',    label: 'Parent / Guardian', Icon: Users },
  { value: 'counselor', label: 'Counselor',         Icon: UserCheck },
  { value: 'coaching',  label: 'Coaching Center',   Icon: Building2 },
  { value: 'other',     label: 'Other',             Icon: User },
];

const SOURCES = [
  { value: 'Google Search',    label: 'Google',    Icon: FaGoogle },
  { value: 'YouTube',          label: 'YouTube',   Icon: FaYoutube },
  { value: 'Instagram',        label: 'Instagram', Icon: FaInstagram },
  { value: 'Facebook',         label: 'Facebook',  Icon: FaFacebook },
  { value: 'WhatsApp',         label: 'WhatsApp',  Icon: FaWhatsapp },
  { value: 'Friend / Referral',label: 'Friend',    Icon: FaUserFriends },
  { value: 'School or College', label: 'School',   Icon: FaSchool },
  { value: 'Coaching Center',  label: 'Coaching',  Icon: Building2 },
  { value: 'Blog / Article',   label: 'Blog',      Icon: FaNewspaper },
  { value: 'Other',            label: 'Other',     Icon: User },
];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ProfileStepProps {
  phone: string;
  pic: string | null;
  setPic: (v: string | null) => void;
  setPicFile: (v: File | null) => void;
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  stateVal: string;
  setStateVal: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  exam: string;
  setExam: (v: string) => void;
  source: string;
  setSource: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  refCode: string;
  setRefCode: (v: string) => void;
  showRef: boolean;
  setShowRef: (v: boolean) => void;
  pErr: Record<string, string>;
  setPErr: (v: Record<string, string>) => void;
  loading: boolean;
  onCreateAccount: () => void;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-error animate-[fadeUp_0.2s_ease_both] sm:mt-1 sm:text-xs">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-0.5 block text-[10px] font-black uppercase tracking-wider text-foreground-muted sm:mb-1 sm:text-xs sm:font-medium sm:normal-case sm:tracking-normal sm:text-foreground">
      {children}
    </label>
  );
}

function DropSelect({
  label, value, onChange, options, err, placeholder, required,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; err?: string; placeholder: string; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref}>
      <Label>{label}{required && <span className="text-error ml-0.5">*</span>}</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`flex w-full items-center justify-between rounded-lg border bg-input px-3 py-2.5 text-xs text-foreground sm:rounded-md sm:py-2 ${err ? 'border-error' : 'border-border'}`}
        >
          <span className={value ? '' : 'text-foreground-muted'}>{value || placeholder}</span>
          <ChevronDown className="w-3.5 h-3.5 text-foreground-muted flex-shrink-0" />
        </button>
        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-surface shadow-lg sm:rounded-md">
            <div className="max-h-44 overflow-y-auto">
              {options.map(o => (
                <div
                  key={o}
                  onClick={() => { onChange(o); setOpen(false); }}
                  className="cursor-pointer px-3 py-2 text-xs hover:bg-muted"
                >
                  {o}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Err msg={err} />
    </div>
  );
}

type IconOption = { value: string; label: string; Icon: React.ComponentType<{ className?: string }> };

function IconDropSelect({
  label, options, value, onChange, err, required,
}: {
  label: string; options: IconOption[]; value: string;
  onChange: (v: string) => void; err?: string; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref}>
      <Label>{label}{required && <span className="text-error ml-0.5">*</span>}</Label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className={`flex w-full items-center justify-between rounded-lg border bg-input px-3 py-2.5 text-xs text-foreground sm:rounded-md sm:py-2 ${err ? 'border-error' : 'border-border'}`}
        >
          {selected
            ? <span className="flex items-center gap-1.5"><selected.Icon className="w-3.5 h-3.5" />{selected.label}</span>
            : <span className="text-foreground-muted">Select…</span>}
          <ChevronDown className="w-3.5 h-3.5 text-foreground-muted flex-shrink-0" />
        </button>
        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-surface shadow-lg sm:rounded-md">
            <div className="max-h-44 overflow-y-auto">
              {options.map(({ value: v, label: lbl, Icon }) => (
                <div
                  key={v}
                  onClick={() => { onChange(v); setOpen(false); }}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-xs hover:bg-muted"
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {lbl}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Err msg={err} />
    </div>
  );
}

// ─── ProfileStep ─────────────────────────────────────────────────────────────

export default function ProfileStep({
  phone, pic, setPic, setPicFile, fullName, setFullName,
  email, setEmail, stateVal, setStateVal, city, setCity,
  exam, setExam, source, setSource, role, setRole, gender, setGender,
  refCode, setRefCode, showRef, setShowRef, pErr, setPErr,
  loading, onCreateAccount,
}: ProfileStepProps) {
  return (
    <div className="fade-up space-y-2.5 sm:space-y-3">

      {/* ── Photo + Name ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="relative flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted sm:h-12 sm:w-12">
            {pic
              ? <img src={pic} alt="Profile" className="w-full h-full object-cover" />
              : <User className="h-5 w-5 text-foreground-muted sm:h-6 sm:w-6" />}
          </div>
          <label className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-primary shadow transition-all hover:bg-primary-hover sm:h-5 sm:w-5">
            <Camera className="h-2.5 w-2.5 text-primary-foreground" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setPicFile(f);
                const r = new FileReader();
                r.onload = ev => setPic(ev.target?.result as string);
                r.readAsDataURL(f);
              }}
            />
          </label>
        </div>

        <div className="flex-1 min-w-0">
          <Label>Full Name<span className="text-error ml-0.5">*</span></Label>
          <div className={`flex items-center rounded-lg border bg-input transition-colors focus-within:border-border-focus sm:rounded-md ${pErr.name ? 'border-error' : 'border-border'}`}>
            <input
              type="text"
              value={fullName}
              onChange={e => { setFullName(e.target.value); setPErr({ ...pErr, name: '' }); }}
              placeholder="e.g. Rahul Sharma"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-foreground outline-none placeholder:text-foreground-subtle sm:py-2"
            />
          </div>
          <Err msg={pErr.name} />
        </div>
      </div>

      {/* ── Phone (immutable) ──────────────────────────────────────────────── */}
      <div className="flex select-none items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 sm:rounded-md">
        <span className="text-sm leading-none">🇮🇳</span>
        <span className="text-xs text-foreground">+91 {phone}</span>
        <div className="ml-auto flex items-center gap-1 text-success">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs font-semibold">Verified</span>
        </div>
      </div>

      {/* ── Email ──────────────────────────────────────────────────────────── */}
      <div>
        <Label>Email <span className="text-foreground-muted font-normal">(optional)</span></Label>
        <div className="flex items-center rounded-lg border border-border bg-input transition-colors focus-within:border-border-focus sm:rounded-md">
          <Mail className="w-3.5 h-3.5 text-foreground-muted ml-3 flex-shrink-0" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-foreground outline-none placeholder:text-foreground-subtle sm:py-2"
          />
        </div>
      </div>

      {/* ── State + City ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        <DropSelect
          label="State" value={stateVal} required
          onChange={v => { setStateVal(v); setPErr({ ...pErr, state: '' }); }}
          options={INDIAN_STATES} err={pErr.state} placeholder="Select state"
        />
        <div>
          <Label>City<span className="text-error ml-0.5">*</span></Label>
          <div className={`flex items-center rounded-lg border bg-input transition-colors focus-within:border-border-focus sm:rounded-md ${pErr.city ? 'border-error' : 'border-border'}`}>
            <MapPin className="w-3.5 h-3.5 text-foreground-muted ml-3 flex-shrink-0" />
            <input
              type="text"
              value={city}
              onChange={e => { setCity(e.target.value); setPErr({ ...pErr, city: '' }); }}
              placeholder="Mumbai"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-foreground outline-none placeholder:text-foreground-subtle sm:px-2 sm:py-2"
            />
          </div>
          <Err msg={pErr.city} />
        </div>
      </div>

      {/* ── Target Exam ────────────────────────────────────────────────────── */}
      <DropSelect
        label="Target Exam" value={exam} required
        onChange={v => { setExam(v); setPErr({ ...pErr, exam: '' }); }}
        options={EXAMS} err={pErr.exam} placeholder="Select target exam"
      />

      {/* ── Source + Role ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
        <IconDropSelect
          label="How did you find us?" options={SOURCES} value={source} required
          onChange={v => { setSource(v); setPErr({ ...pErr, source: '' }); }}
          err={pErr.source}
        />
        <IconDropSelect
          label="I am a…" options={ROLES} value={role} required
          onChange={v => { setRole(v); setPErr({ ...pErr, role: '' }); }}
          err={pErr.role}
        />
      </div>

      {/* ── Gender ────────────────────────────────────────────────────────── */}
      <DropSelect
        label="Gender" value={gender}
        onChange={setGender}
        options={GENDERS} placeholder="Select gender (optional)"
      />

      {/* ── Referral code ─────────────────────────────────────────────────── */}
      <div>
        <button
          type="button"
          onClick={() => setShowRef(!showRef)}
          className="group flex items-center gap-1.5 text-[11px] text-foreground-muted transition-colors hover:text-foreground sm:text-xs"
        >
          <Gift className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
          <span>Have a referral code?</span>
          {showRef ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showRef && (
          <div className="mt-1.5 fade-up">
            <div className="flex items-center rounded-lg border border-border bg-input transition-colors focus-within:border-border-focus sm:rounded-md">
              <Gift className="w-3.5 h-3.5 text-foreground-muted ml-3 flex-shrink-0" />
              <input
                type="text"
                value={refCode}
                onChange={e => setRefCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="flex-1 bg-transparent px-3 py-2 text-xs font-mono uppercase tracking-widest text-foreground outline-none placeholder:text-foreground-subtle"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Create Account ─────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onCreateAccount}
        disabled={loading}
        className="mt-0.5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-black text-primary-foreground transition-all hover:bg-primary-hover active:scale-[0.98] disabled:opacity-60 sm:mt-1 sm:h-auto sm:py-2.5 sm:font-semibold"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</>
          : <><CheckCircle className="w-4 h-4" /> Create Account</>}
      </button>
    </div>
  );
}
