'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Building2, MapPin, BedDouble, Users,
  Banknote, GraduationCap, ExternalLink, Phone, Mail,
  Globe, CheckCircle2, Loader2, Home, Navigation,
  Plane, BookOpen, Languages, Video,
  CalendarDays, User, AlertCircle, ChevronRight,
  ImageIcon, Info, Hotel,
} from 'lucide-react';

const API = 'http://localhost:8000';

// ─── types ────────────────────────────────────────────────────────────────────
interface ContactPerson {
  name?: string;
  designation?: string;
  emails?: string[];
  phone_nos?: string[];
}

// Some API fields may be plain strings OR objects like {id, name, short_name}
type StrOrObj = string | { id?: number; name?: string; short_name?: string } | null | undefined;

interface InstituteDetail {
  id: number;
  name: string;
  state: StrOrObj;
  institute_type: StrOrObj;
  local_distinction?: StrOrObj;
  institute_management?: StrOrObj;
  logo_url?: string;
  cover_url?: string;
  updated_at?: string;

  seats?: { count?: number };
  beds?: { count?: number };

  fee?: { range?: { min?: number; max?: number } };
  university?: { id?: number; name?: string; short_name?: string } | string;

  about?: {
    about_text?: string;
    institute_established_year?: number | string;
  };

  image_urls?: string[];

  location?: {
    google_maps_url?: string;
    latitude?: number;
    longitude?: number;
    address?: {
      address_line_1?: string;
      city?: string;
      district?: string;
      pincode?: string;
    };
  };

  airport?: {
    name?: string;
    distance?: string | number;
    link?: string;
  };

  website?: { url?: string };

  general_information?: {
    courses?: (string | { id?: number; name?: string; short_name?: string })[];
    languages?: string[];
  };

  contact_person?: ContactPerson;
  dean?: ContactPerson;
  nodal_officer?: ContactPerson;

  hostel?: {
    mens_hostel_availability?: boolean | string;
    womens_hostel_availability?: boolean | string;
    details?: string;
  };

  hostel_fee?: {
    content?: string;
    links?: { label?: string; url?: string }[];
  };

  mbbs_exam_result?: {
    availability?: boolean | string;
    links?: { label?: string; url?: string }[];
  };

  info_links?: {
    links?: { label?: string; url?: string }[];
  };

  social?: {
    twitter?: string;
    youtube_channels?: { name?: string; label?: string; url?: string }[];
  };

  tabs_to_display?: string[];
}

// ─── helpers ─────────────────────────────────────────────────────────────────
/** Safely extract a display string from a value that might be a plain string
 *  or an API object like { id, name, short_name }. */
function str(v: StrOrObj | string | undefined): string {
  if (!v) return '';
  if (typeof v === 'string') return v;
  return v.name ?? v.short_name ?? '';
}

function fmtFee(n?: number) {
  if (!n) return '—';
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString()}`;
}

function avail(v?: boolean | string) {
  if (v === true || v === 'true' || v === '1' || v === 'yes') return true;
  if (v === false || v === 'false' || v === '0' || v === 'no') return false;
  return null;
}

const TYPE_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  'INI (Institute of National Importance)': { bg: '#ccfbf1', text: '#0f766e', dot: '#0d9488' },
  'Government Institute': { bg: '#dcfce7', text: '#15803d', dot: '#16a34a' },
  'Deemed': { bg: '#ede9fe', text: '#6d28d9', dot: '#7c3aed' },
  'Private Institute (State University)': { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Private University': { bg: '#fef3c7', text: '#b45309', dot: '#d97706' },
  'State Society/PPP (State University)': { bg: '#e0f2fe', text: '#0369a1', dot: '#0ea5e9' },
  'AFMS': { bg: '#fee2e2', text: '#b91c1c', dot: '#dc2626' },
};
function ts(t: string) { return TYPE_STYLE[t] ?? { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' }; }

const GRAD = [
  'linear-gradient(135deg,#0f766e,#0d9488)',
  'linear-gradient(135deg,#6d28d9,#7c3aed)',
  'linear-gradient(135deg,#0369a1,#0ea5e9)',
  'linear-gradient(135deg,#b45309,#d97706)',
  'linear-gradient(135deg,#b91c1c,#dc2626)',
];

const TABS = [
  { key: 'overview', label: 'Overview', icon: Info },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'accommodation', label: 'Accommodation', icon: Hotel },
  { key: 'contact', label: 'Contact', icon: Phone },
  { key: 'media', label: 'Media & Links', icon: Video },
];

// ─── sub-components ──────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle mb-4">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <p className="text-xs text-foreground-subtle w-36 shrink-0 font-medium pt-0.5">{label}</p>
      <div className="text-xs font-semibold text-foreground flex-1 leading-relaxed">{value}</div>
    </div>
  );
}

function ContactCard({ person, role, accent }: { person: ContactPerson; role: string; accent: string }) {
  const hasName = !!person.name;
  const hasEmails = person.emails && person.emails.length > 0;
  const hasPhones = person.phone_nos && person.phone_nos.length > 0;
  if (!hasName && !hasEmails && !hasPhones) return null;
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + '18' }}>
          <User size={16} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>{role}</p>
          {hasName && <p className="text-sm font-bold text-foreground leading-snug">{person.name}</p>}
          {person.designation && <p className="text-xs text-foreground-subtle">{person.designation}</p>}
        </div>
      </div>
      {hasEmails && (
        <div className="space-y-1.5 mb-2">
          {person.emails!.map((e, i) => (
            <a key={i} href={`mailto:${e}`}
              className="flex items-center gap-2 text-xs text-primary font-medium hover:underline">
              <Mail size={11} className="shrink-0" /> {e}
            </a>
          ))}
        </div>
      )}
      {hasPhones && (
        <div className="space-y-1.5">
          {person.phone_nos!.map((p, i) => (
            <a key={i} href={`tel:${p}`}
              className="flex items-center gap-2 text-xs text-foreground-muted font-medium hover:text-foreground">
              <Phone size={11} className="shrink-0" /> {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function AvailBadge({ val, trueLabel = 'Available', falseLabel = 'Not Available' }:
  { val?: boolean | string; trueLabel?: string; falseLabel?: string }) {
  const a = avail(val);
  if (a === null) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${a ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
      }`}>
      {a ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
      {a ? trueLabel : falseLabel}
    </span>
  );
}

function LinkList({ links }: { links?: { label?: string; url?: string }[] }) {
  if (!links?.length) return null;
  return (
    <div className="space-y-2">
      {links.map((l, i) => l.url ? (
        <a key={i} href={l.url} target="_blank" rel="noreferrer"
          className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
          <ExternalLink size={11} className="shrink-0" />
          {l.label || l.url}
        </a>
      ) : null)}
    </div>
  );
}

// ─── tab panels ──────────────────────────────────────────────────────────────
function TabOverview({ data }: { data: InstituteDetail }) {
  const feeMin = data.fee?.range?.min ?? 0;
  const feeMax = data.fee?.range?.max ?? 0;
  const courses = data.general_information?.courses ?? [];
  const languages = data.general_information?.languages ?? [];

  return (
    <div className="space-y-5">

      {/* about */}
      {data.about?.about_text && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>About</SectionTitle>
          <p className="text-sm text-foreground leading-relaxed">{data.about.about_text}</p>
        </div>
      )}

      {/* fee breakdown */}
      {(feeMin > 0 || feeMax > 0) && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Fee Range</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-success/8 border border-success/20 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-success/70 mb-1">Minimum Fee</p>
              <p className="text-2xl font-black text-success">{fmtFee(feeMin)}</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">per year</p>
            </div>
            <div className="rounded-xl bg-error/8 border border-error/20 p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-error/70 mb-1">Maximum Fee</p>
              <p className="text-2xl font-black text-error">{fmtFee(feeMax)}</p>
              <p className="text-[10px] text-foreground-subtle mt-0.5">per year</p>
            </div>
          </div>
          <p className="text-[11px] text-foreground-subtle mt-3 leading-relaxed">
            Fee varies by category. Govt college fees are typically for UR/OBC; SC/ST may differ.
          </p>
        </div>
      )}

      {/* general info */}
      <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
        <SectionTitle>General Information</SectionTitle>
        <InfoRow label="Institute Name" value={data.name} />
        <InfoRow label="State" value={str(data.state)} />
        <InfoRow label="Institute Type" value={str(data.institute_type)} />
        {data.university && <InfoRow label="University" value={typeof data.university === 'string' ? data.university : (data.university.name ?? '')} />}
        {data.institute_management && <InfoRow label="Management" value={str(data.institute_management)} />}
        {data.about?.institute_established_year && (
          <InfoRow label="Established" value={String(data.about.institute_established_year)} />
        )}
        {data.local_distinction && <InfoRow label="Distinction" value={str(data.local_distinction)} />}
        {data.website?.url && (
          <InfoRow label="Website" value={
            <a href={data.website.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-primary hover:underline">
              <Globe size={11} /> {data.website.url}
            </a>
          } />
        )}
        {data.updated_at && (
          <InfoRow label="Last Updated" value={new Date(data.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} />
        )}
      </div>

      {/* courses & languages */}
      {(courses.length > 0 || languages.length > 0) && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          {courses.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={14} className="text-primary" />
                <p className="text-xs font-bold text-foreground">Courses Offered</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {courses.map((c, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {str(c as StrOrObj)}
                  </span>
                ))}
              </div>
            </>
          )}
          {languages.length > 0 && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <Languages size={14} className="text-secondary" />
                <p className="text-xs font-bold text-foreground">Languages</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, i) => (
                  <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    {l}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* MBBS results */}
      {data.mbbs_exam_result && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>MBBS Exam Results</SectionTitle>
          <div className="mb-3">
            <AvailBadge val={data.mbbs_exam_result.availability} trueLabel="Results Available" falseLabel="Results Not Available" />
          </div>
          <LinkList links={data.mbbs_exam_result.links} />
        </div>
      )}
    </div>
  );
}

function TabLocation({ data }: { data: InstituteDetail }) {
  const loc = data.location;
  const air = data.airport;
  if (!loc && !air) return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle gap-2">
      <MapPin size={28} />
      <p className="text-sm font-medium">No location data available</p>
    </div>
  );

  const addr = loc?.address;
  const addressParts = [addr?.address_line_1, addr?.city, addr?.district, addr?.pincode].filter(Boolean);

  return (
    <div className="space-y-5">
      {loc && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Address</SectionTitle>

          {(loc.latitude && loc.longitude) && (
            <div className="rounded-2xl overflow-hidden border border-border mt-4">
              <iframe
                width="100%"
                height="250"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}&z=15&output=embed`}
                className="w-full h-[250px] border-0"
              />
            </div>
          )}

          {addressParts.length > 0 && (
            <div className="flex items-start gap-3 mb-4 mt-5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={15} className="text-primary" />
              </div>
              <div>
                {addr?.address_line_1 && <p className="text-sm font-semibold text-foreground">{addr.address_line_1}</p>}
                <p className="text-sm text-foreground-muted">
                  {[addr?.city, addr?.district, addr?.pincode].filter(Boolean).join(', ')}
                </p>
                <p className="text-xs text-foreground-subtle mt-0.5">{str(data.state)}</p>
              </div>
            </div>
          )}

          {loc.google_maps_url && (
            <a
              href={loc.google_maps_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors w-full justify-center"
              style={{ boxShadow: '0 2px 12px rgba(13,148,136,0.25)' }}
            >
              <Navigation size={13} /> Open in Google Maps
            </a>
          )}

          {(loc.latitude && loc.longitude) && (
            <p className="text-[10px] text-foreground-subtle mt-2 text-center font-mono">
              {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
            </p>
          )}
        </div>
      )}

      {air && (air.name || air.distance) && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Nearest Airport</SectionTitle>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center">
              <Plane size={16} className="text-sky-500" />
            </div>
            <div>
              {air.name && <p className="text-sm font-bold text-foreground">{air.name}</p>}
              {air.distance && (
                <p className="text-xs text-foreground-muted">Distance: {air.distance}</p>
              )}
            </div>
          </div>
          {air.link && (
            <a href={air.link} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline">
              <ExternalLink size={11} /> Airport directions
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function TabAccommodation({ data }: { data: InstituteDetail }) {
  const hostel = data.hostel;
  const fee = data.hostel_fee;
  if (!hostel && !fee) return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle gap-2">
      <Hotel size={28} />
      <p className="text-sm font-medium">No accommodation data available</p>
    </div>
  );

  return (
    <div className="space-y-5">
      {hostel && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Hostel Availability</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-foreground-subtle mb-2">Men&apos;s Hostel</p>
              <AvailBadge val={hostel.mens_hostel_availability} />
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-wide text-foreground-subtle mb-2">Women&apos;s Hostel</p>
              <AvailBadge val={hostel.womens_hostel_availability} />
            </div>
          </div>
          {hostel.details && (
            <p className="text-sm text-foreground leading-relaxed">{hostel.details}</p>
          )}
        </div>
      )}

      {fee && (fee.content || (fee.links && fee.links.length > 0)) && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Hostel Fee</SectionTitle>
          {fee.content && <p className="text-sm text-foreground leading-relaxed mb-4">{fee.content}</p>}
          <LinkList links={fee.links} />
        </div>
      )}
    </div>
  );
}

function TabContact({ data }: { data: InstituteDetail }) {
  const hasAny = data.contact_person || data.dean || data.nodal_officer;
  if (!hasAny) return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle gap-2">
      <Phone size={28} />
      <p className="text-sm font-medium">No contact data available</p>
    </div>
  );

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {data.contact_person && <ContactCard person={data.contact_person} role="Director / Head" accent="#0d9488" />}
      {data.dean && <ContactCard person={data.dean} role="Dean" accent="#7c3aed" />}
      {data.nodal_officer && <ContactCard person={data.nodal_officer} role="Nodal Officer" accent="#0ea5e9" />}
    </div>
  );
}

function TabMedia({ data }: { data: InstituteDetail }) {
  const youtubeChannels = data.social?.youtube_channels ?? [];
  const twitter = data.social?.twitter;
  const infoLinks = data.info_links?.links ?? [];
  const hasAny = youtubeChannels.length > 0 || twitter || infoLinks.length > 0;

  if (!hasAny) return (
    <div className="flex flex-col items-center justify-center py-16 text-foreground-subtle gap-2">
      <Video size={28} />
      <p className="text-sm font-medium">No media data available</p>
    </div>
  );

  return (
    <div className="space-y-5">

      {twitter && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Twitter / X</SectionTitle>
          <a href={twitter} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-sky-500 hover:underline">
            <ExternalLink size={16} /> {twitter}
          </a>
        </div>
      )}

      {youtubeChannels.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>YouTube Channels</SectionTitle>
          <div className="space-y-3">
            {youtubeChannels.map((ch, i) => (
              ch.url ? (
                <a key={i} href={ch.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:border-red-400 transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <Video size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{ch.label ?? ch.name ?? 'YouTube Channel'}</p>
                    <p className="text-[10px] text-foreground-subtle truncate">{ch.url}</p>
                  </div>
                  <ChevronRight size={14} className="text-foreground-subtle group-hover:text-foreground shrink-0" />
                </a>
              ) : null
            ))}
          </div>
        </div>
      )}

      {infoLinks.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
          <SectionTitle>Information Links</SectionTitle>
          <div className="space-y-2">
            {infoLinks.map((l, i) => l.url ? (
              <a key={i} href={l.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border hover:border-primary transition-colors group">
                <ExternalLink size={13} className="text-foreground-subtle group-hover:text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground">{l.label || l.url}</span>
              </a>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InstituteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgErr, setImgErr] = useState(false);
  const [logoErr, setLogoErr] = useState(false);
  const [tab, setTab] = useState('overview');
  const [gallery, setGallery] = useState<string[]>([]);
  const [galIdx, setGalIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/api/institute/${id}`)
      .then(r => r.json())
      .then(j => {
        const d = j.data ?? j;
        setData(d);
        setGallery(d.image_urls ?? []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={28} className="animate-spin text-primary" />
        <p className="text-sm text-foreground-muted">Loading college details…</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <Building2 size={40} className="text-foreground-subtle" />
      <p className="text-base font-bold text-foreground">College not found</p>
      <Link href="/dashboard/colleges" className="text-sm text-primary font-semibold flex items-center gap-1">
        <ArrowLeft size={14} /> Back to Colleges
      </Link>
    </div>
  );

  const style = ts(str(data.institute_type));
  const feeMin = data.fee?.range?.min ?? 0;
  const feeMax = data.fee?.range?.max ?? 0;
  const grad = GRAD[data.id % GRAD.length];
  const seats = data.seats?.count;
  const beds = data.beds?.count;

  return (
    <div className="min-h-screen bg-background">

      {/* ── hero cover ── */}
      <div className="relative h-52 sm:h-64 w-full overflow-hidden">
        {!imgErr && data.cover_url ? (
          <img
            src={data.cover_url} alt=""
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full" style={{ background: grad }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-4 left-6 flex items-center gap-2 text-white/80 text-xs font-medium">
          <Link href="/dashboard" className="hover:text-white flex items-center gap-1"><Home size={12} /> Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/colleges" className="hover:text-white">Colleges</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-[160px]">{data.name}</span>
        </div>

        <Link
          href="/dashboard/colleges"
          className="absolute top-4 right-6 flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 transition-colors"
        >
          <ArrowLeft size={13} /> All Colleges
        </Link>
      </div>

      <div className="px-4 sm:px-6 lg:px-10 max-w-[1200px] mx-auto -mt-10 relative z-10 pb-20">

        {/* ── identity card ── */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-lg mb-5 flex items-start gap-4 flex-wrap">
          <div className="w-16 h-16 rounded-2xl bg-white border-2 border-border shadow-md overflow-hidden shrink-0">
            {!logoErr && data.logo_url ? (
              <img src={data.logo_url} alt="" className="w-full h-full object-contain p-1" onError={() => setLogoErr(true)} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Building2 size={22} className="text-foreground-subtle" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <h1 className="text-xl font-black text-foreground leading-snug flex-1">{data.name}</h1>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
                style={{ background: style.bg, color: style.text }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                {str(data.institute_type).replace(' (Institute of National Importance)', '')}
              </div>
            </div>

            {data.university && str(data.university as StrOrObj) && (
              <p className="text-sm text-foreground-muted mb-2">{typeof data.university === 'string' ? data.university : data.university.name}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-foreground-muted bg-muted px-2.5 py-1 rounded-full border border-border">
                <MapPin size={10} /> {str(data.state)}
              </span>
              {data.about?.institute_established_year && (
                <span className="flex items-center gap-1 text-xs font-semibold text-foreground-muted bg-muted px-2.5 py-1 rounded-full border border-border">
                  <CalendarDays size={10} /> Est. {data.about.institute_established_year}
                </span>
              )}
              {data.local_distinction && (
                <span className="text-xs font-semibold bg-accent-light text-accent px-2.5 py-1 rounded-full">
                  {str(data.local_distinction)}
                </span>
              )}
              <span className="text-xs font-mono text-foreground-subtle bg-muted px-2.5 py-1 rounded-full border border-border">
                ID #{data.id}
              </span>
            </div>
          </div>
        </div>

        {/* ── key stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { icon: Users, label: 'Total Seats', value: seats != null ? seats.toLocaleString() : '—', accent: '#0d9488' },
            { icon: BedDouble, label: 'Hospital Beds', value: beds != null ? beds.toLocaleString() : '—', accent: '#7c3aed' },
            { icon: Banknote, label: 'Min Fee / yr', value: fmtFee(feeMin), accent: '#0ea5e9' },
            { icon: Banknote, label: 'Max Fee / yr', value: fmtFee(feeMax), accent: '#d97706' },
          ].map(({ icon: Icon, label, value, accent }) => (
            <div key={label} className="flex flex-col gap-2 bg-surface border border-border rounded-2xl p-4 shadow-sm">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent + '18' }}>
                <Icon size={17} style={{ color: accent }} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-foreground-subtle">{label}</p>
                <p className="text-xl font-black text-foreground mt-0.5 tabular-nums leading-tight">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── photo gallery ── */}
        {gallery.length > 0 && (
          <div className="mb-5 bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={14} className="text-foreground-subtle" />
              <p className="text-xs font-bold text-foreground">Photo Gallery</p>
              <span className="text-[10px] text-foreground-subtle ml-auto">{gallery.length} photos</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {gallery.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setGalIdx(i)}
                  className="shrink-0 w-40 h-28 rounded-xl overflow-hidden border border-border hover:border-primary transition-colors focus:outline-none"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_288px] gap-5">

          {/* ── main content (tabs) ── */}
          <div>
            {/* tab bar */}
            <div className="flex gap-1 bg-muted rounded-2xl p-1 mb-5 overflow-x-auto">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${tab === t.key
                      ? 'bg-surface text-foreground shadow-sm border border-border'
                      : 'text-foreground-subtle hover:text-foreground'
                    }`}
                >
                  <t.icon size={12} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* tab content */}
            {tab === 'overview' && <TabOverview data={data} />}
            {tab === 'location' && <TabLocation data={data} />}
            {tab === 'accommodation' && <TabAccommodation data={data} />}
            {tab === 'contact' && <TabContact data={data} />}
            {tab === 'media' && <TabMedia data={data} />}
          </div>

          {/* ── right sidebar ── */}
          <div className="space-y-4">

            {/* CTA actions */}
            <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle mb-3">Actions</p>
              <Link href="/dashboard/shortlist"
                className="flex items-center justify-center gap-2 h-10 w-full rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
                style={{ boxShadow: '0 2px 12px rgba(13,148,136,0.25)' }}>
                + Add to Shortlist
              </Link>
              <Link href="/dashboard/compare"
                className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted transition-colors">
                Compare with Another
              </Link>
              <Link href="/dashboard/predictor"
                className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border border-primary/30 bg-primary-light text-xs font-semibold text-primary hover:bg-primary/10 transition-colors">
                Check My Chances
              </Link>
              {data.website?.url && (
                <a href={data.website.url} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 h-10 w-full rounded-xl border border-border bg-surface text-xs font-semibold text-foreground-muted hover:bg-muted transition-colors">
                  <Globe size={12} /> Official Website
                </a>
              )}
            </div>

            {/* quick facts */}
            <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle mb-3">Quick Facts</p>
              <div className="space-y-3">
                {[
                  seats != null && { label: 'Total Seats', value: seats.toLocaleString(), icon: Users },
                  beds != null && { label: 'Hospital Beds', value: beds.toLocaleString(), icon: BedDouble },
                  { label: 'State', value: str(data.state), icon: MapPin },
                  str(data.university as StrOrObj) && { label: 'University', value: str(data.university as StrOrObj), icon: GraduationCap },
                  { label: 'Type', value: str(data.institute_type).replace(' (Institute of National Importance)', ''), icon: Building2 },
                  data.about?.institute_established_year && { label: 'Established', value: String(data.about.institute_established_year), icon: CalendarDays },
                ].filter(Boolean).map(item => {
                  const { label, value, icon: Icon } = item as { label: string; value: string; icon: React.ElementType };
                  return (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                        <Icon size={13} className="text-foreground-subtle" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-foreground-subtle font-medium">{label}</p>
                        <p className="text-xs font-semibold text-foreground leading-snug">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* location peek */}
            {(data.location?.address?.city || data.location?.address?.address_line_1) && (
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">Location</p>
                  <button onClick={() => setTab('location')} className="text-[10px] text-primary font-semibold">View →</button>
                </div>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {[data.location.address?.address_line_1, data.location.address?.city, str(data.state)].filter(Boolean).join(', ')}
                </p>
                {data.location.google_maps_url && (
                  <a href={data.location.google_maps_url} target="_blank" rel="noreferrer"
                    className="mt-2 flex items-center gap-1 text-[11px] text-primary font-semibold hover:underline">
                    <Navigation size={10} /> Directions
                  </a>
                )}
              </div>
            )}

            {/* hostel peek */}
            {data.hostel && (
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle">Hostel</p>
                  <button onClick={() => setTab('accommodation')} className="text-[10px] text-primary font-semibold">Details →</button>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground-subtle">Men&apos;s</span>
                    <AvailBadge val={data.hostel.mens_hostel_availability} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground-subtle">Women&apos;s</span>
                    <AvailBadge val={data.hostel.womens_hostel_availability} />
                  </div>
                </div>
              </div>
            )}

            {/* back nav */}
            <Link
              href="/dashboard/colleges"
              className="flex items-center gap-2 text-sm font-semibold text-foreground-muted hover:text-foreground transition-colors px-1"
            >
              <ArrowLeft size={14} /> Back to all colleges
            </Link>
          </div>
        </div>
      </div>

      {/* ── lightbox ── */}
      {galIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setGalIdx(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={gallery[galIdx]}
              alt=""
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => setGalIdx(i => i! > 0 ? i! - 1 : gallery.length - 1)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20"
              >← Prev</button>
              <span className="text-white/60 text-sm">{galIdx + 1} / {gallery.length}</span>
              <button
                onClick={() => setGalIdx(i => i! < gallery.length - 1 ? i! + 1 : 0)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20"
              >Next →</button>
            </div>
            <button
              onClick={() => setGalIdx(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg font-bold flex items-center justify-center"
            >×</button>
          </div>
        </div>
      )}

    </div>
  );
}
