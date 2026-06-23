'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Loader2, Sparkles, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile, type UpdateProfileBody, type UserProfile } from '@/lib/api';

type ProfileField = 'score' | 'rank' | 'prefExam' | 'category' | 'gender' | 'dob' | 'alternatePhone';
type ProfileForm = Record<ProfileField, string>;

type ProfileStep = {
  id: string;
  title: string;
  eyebrow: string;
  fields: ProfileField[];
};

const STORAGE_PREFIX = 'neetell.profile-onboarding.dismissed.';

const steps: ProfileStep[] = [
  {
    id: 'neet',
    eyebrow: 'Start here',
    title: 'Personalize your predictions',
    fields: ['score', 'rank', 'prefExam'],
  },
  {
    id: 'profile',
    eyebrow: 'Counselling',
    title: 'Basic counselling details',
    fields: ['category', 'gender', 'dob'],
  },
  {
    id: 'contact',
    eyebrow: 'Optional',
    title: 'Backup contact',
    fields: ['alternatePhone'],
  },
];

const categoryOptions = ['General', 'EWS', 'OBC', 'SC', 'ST', 'PwD'];
const genderOptions = ['Male', 'Female', 'Other'];
const examOptions = ['NEET UG', 'NEET PG', 'INI CET', 'FMGE'];

const fieldControlClass =
  'h-12 w-full rounded-xl border border-border bg-muted/40 px-3 text-sm font-semibold text-foreground outline-none transition placeholder:text-muted-foreground/70 hover:border-primary/35 focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/10';

const fieldLabels: Record<ProfileField, string> = {
  score: 'Score',
  rank: 'All India rank',
  prefExam: 'Exam',
  category: 'Category',
  gender: 'Gender',
  dob: 'Date of birth',
  alternatePhone: 'Alternate phone',
};

function emptyProfileForm(user: UserProfile | null): ProfileForm {
  return {
    score: user?.score && user.score > 0 ? String(user.score) : '',
    rank: user?.rank && user.rank > 0 ? String(user.rank) : '',
    prefExam: user?.prefExam ?? '',
    category: user?.category ?? '',
    gender: user?.gender ?? '',
    dob: user?.dob ? user.dob.slice(0, 10) : '',
    alternatePhone: user?.alternatePhone ?? '',
  };
}

function isBlank(value?: string | null) {
  return !value || !value.trim();
}

function isMissingNumber(value?: number | null) {
  return value === undefined || value === null || Number(value) <= 0;
}

function getMissingFields(user: UserProfile | null): ProfileField[] {
  if (!user) return [];

  const hasPriorityDetails =
    !isMissingNumber(user.score) &&
    !isMissingNumber(user.rank) &&
    !isBlank(user.prefExam);

  if (hasPriorityDetails) return [];

  const fields: ProfileField[] = [];
  if (isMissingNumber(user.score)) fields.push('score');
  if (isMissingNumber(user.rank)) fields.push('rank');
  if (isBlank(user.prefExam)) fields.push('prefExam');
  if (isBlank(user.category)) fields.push('category');
  if (isBlank(user.gender)) fields.push('gender');
  if (isBlank(user.dob)) fields.push('dob');
  if (isBlank(user.alternatePhone)) fields.push('alternatePhone');
  return fields;
}

function getActiveSteps(missingFields: ProfileField[]) {
  return steps
    .map((step) => ({ ...step, fields: step.fields.filter((field) => missingFields.includes(field)) }))
    .filter((step) => step.fields.length > 0);
}

function buildPayload(form: ProfileForm, missingFields: ProfileField[]): UpdateProfileBody {
  const payload: UpdateProfileBody = {};
  const hasValue = (field: ProfileField) => missingFields.includes(field) && form[field].trim();

  if (hasValue('prefExam')) payload.prefExam = form.prefExam.trim();
  if (hasValue('category')) payload.category = form.category.trim();
  if (hasValue('gender')) payload.gender = form.gender.trim();
  if (hasValue('dob')) payload.dob = form.dob;
  if (hasValue('alternatePhone')) payload.alternatePhone = form.alternatePhone.trim();

  if (hasValue('rank')) {
    const rank = Number(form.rank);
    if (Number.isFinite(rank) && rank > 0) payload.rank = rank;
  }

  if (hasValue('score')) {
    const score = Number(form.score);
    if (Number.isFinite(score) && score > 0) payload.score = score;
  }

  return payload;
}

function completionText(total: number, missing: number) {
  const ready = Math.max(0, total - missing);
  return `${ready}/${total}`;
}

export function ProfileOnboardingPrompt() {
  const { user, firebaseUser, refreshUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<ProfileForm>(() => emptyProfileForm(null));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const missingFields = useMemo(() => getMissingFields(user), [user]);
  const activeSteps = useMemo(() => getActiveSteps(missingFields), [missingFields]);
  const missingKey = missingFields.join('|');
  const storageKey = user?.id ? `${STORAGE_PREFIX}${user.id}` : '';
  const activeStep = activeSteps[Math.min(stepIndex, Math.max(0, activeSteps.length - 1))];
  const progress = activeSteps.length ? ((Math.min(stepIndex, activeSteps.length - 1) + 1) / activeSteps.length) * 100 : 0;

  useEffect(() => {
    setForm(emptyProfileForm(user));
    setStepIndex(0);
    setError('');
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !missingFields.length || typeof window === 'undefined') {
      setOpen(false);
      return;
    }

    const dismissed = window.localStorage.getItem(`${STORAGE_PREFIX}${user.id}`);
    setOpen(!dismissed);
  }, [user?.id, missingFields.length, missingKey]);

  const dismiss = () => {
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, JSON.stringify({
        dismissedAt: new Date().toISOString(),
        fields: missingFields,
      }));
    }
    setOpen(false);
  };

  const updateField = (field: ProfileField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError('');
  };

  const updateInputField = (field: ProfileField, value: string) => {
    const cleanValue = field === 'rank' || field === 'score'
      ? value.replace(/\D/g, '')
      : value;
    updateField(field, cleanValue);
  };

  const goNext = () => {
    setStepIndex((current) => Math.min(current + 1, activeSteps.length - 1));
  };

  const goBack = () => {
    setStepIndex((current) => Math.max(0, current - 1));
  };

  const save = async () => {
    if (!firebaseUser) return;

    const payload = buildPayload(form, missingFields);
    if (!Object.keys(payload).length) {
      dismiss();
      return;
    }

    setSaving(true);
    setError('');
    try {
      const token = await firebaseUser.getIdToken();
      await updateProfile(token, payload);
      await refreshUser();
      dismiss();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  if (!open || !user || !activeStep) return null;

  const isLastStep = stepIndex >= activeSteps.length - 1;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/72 px-4 py-4 backdrop-blur-md sm:p-6">
      <div className="max-h-[calc(100dvh-2rem)] w-full max-w-[22rem] overflow-y-auto rounded-2xl border border-border bg-card shadow-[0_24px_90px_rgba(15,23,42,0.24)] sm:max-w-xl">
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative px-4 py-4 sm:px-6 sm:py-5">
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close profile prompt"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="pr-10">
            <div className="mb-3 flex items-center gap-2">
              {/* <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:h-9 sm:w-9">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span> */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary sm:text-[11px]">
                  {activeStep.eyebrow}
                </p>
                <h2 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
                  {activeStep.title}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground sm:gap-2 sm:text-xs">
              <span className="rounded-full bg-muted px-2.5 py-1">
                Step {Math.min(stepIndex, activeSteps.length - 1) + 1}/{activeSteps.length}
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {completionText(7, missingFields.length)} complete
              </span>
            </div>
          </div>

          <div
            key={activeStep.id}
            className="mt-4 animate-[profileStepIn_260ms_ease-out] space-y-2.5 sm:mt-5 sm:space-y-3"
          >
            {activeStep.fields.map((field) => (
              <div key={field}>
                <label className="mb-1.5 block text-xs font-semibold text-foreground sm:text-sm">
                  {fieldLabels[field]}
                </label>
                {field === 'category' ? (
                  <select
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    className={`${fieldControlClass} appearance-none`}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field === 'gender' ? (
                  <select
                    value={form.gender}
                    onChange={(event) => updateField('gender', event.target.value)}
                    className={`${fieldControlClass} appearance-none`}
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : field === 'prefExam' ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {examOptions.map((option) => {
                      const selected = form.prefExam === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateField('prefExam', option)}
                          className={`h-12 rounded-xl border px-3 text-sm font-semibold transition ${
                            selected
                              ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                              : 'border-border bg-muted/40 text-foreground hover:border-primary/35 hover:bg-background'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    value={form[field]}
                    onChange={(event) => updateInputField(field, event.target.value)}
                    type={field === 'dob' ? 'date' : field === 'alternatePhone' ? 'tel' : 'text'}
                    inputMode={field === 'rank' || field === 'score' || field === 'alternatePhone' ? 'numeric' : undefined}
                    pattern={field === 'rank' || field === 'score' ? '[0-9]*' : undefined}
                    placeholder={
                      field === 'score'
                        ? 'Example: 612'
                        : field === 'rank'
                          ? 'Example: 44995'
                          : field === 'alternatePhone'
                            ? '+91 alternate number'
                            : undefined
                    }
                    className={`${fieldControlClass} no-number-spinner`}
                  />
                )}
              </div>
            ))}
          </div>

          {error ? (
            <p className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive sm:mt-4 sm:text-sm">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-end gap-3 sm:mt-5">
            {/* <Link
              href="/dashboard/profile"
              onClick={dismiss}
              className="hidden text-sm font-semibold text-muted-foreground transition hover:text-foreground sm:inline"
            >
              Full profile
            </Link> */}

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={stepIndex > 0 ? goBack : dismiss}
                className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl border border-border px-4 text-xs font-semibold text-muted-foreground transition hover:text-foreground sm:h-11 sm:flex-none sm:text-sm"
              >
                {stepIndex > 0 ? <ChevronLeft className="h-4 w-4" /> : null}
                {stepIndex > 0 ? 'Back' : 'Skip'}
              </button>

              {isLastStep ? (
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="flex h-10 flex-[1.4] items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-11 sm:flex-none sm:text-sm"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Save
                </button>
              ) : (
                <button
                  type="button"
                  onClick={goNext}
                  className="flex h-10 flex-[1.4] items-center justify-center gap-1 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 sm:h-11 sm:flex-none sm:text-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes profileStepIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .no-number-spinner::-webkit-outer-spin-button,
        .no-number-spinner::-webkit-inner-spin-button {
          margin: 0;
          -webkit-appearance: none;
        }

        .no-number-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}
