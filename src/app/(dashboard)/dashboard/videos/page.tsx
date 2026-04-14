'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, Star, Share2, EyeOff, MoreVertical, Play } from 'lucide-react';

interface Video {
  id: number;
  section: string;
  college: string;
  title: string;
  desc: string;
  date: string;
  duration: string;
  fav: boolean;
  hidden: boolean;
}

const INITIAL_VIDEOS: Video[] = [
  { id: 1, section: 'Counselling basics', college: 'AIIMS Delhi', title: 'NEET UG counselling process explained', desc: 'Complete walkthrough of MCC round 1 to stray vacancy rounds.', date: '12 Apr 2025', duration: '28:14', fav: false, hidden: false },
  { id: 2, section: 'Counselling basics', college: 'JIPMER', title: 'State quota vs AIQ — what you must know', desc: 'How seats are divided between state and all-India quota.', date: '10 Apr 2025', duration: '19:42', fav: true, hidden: false },
  { id: 3, section: 'Counselling basics', college: 'Maulana Azad', title: 'Choice filling masterclass for NEET 2025', desc: 'Step-by-step guide to filling preferences for maximum allotment chance.', date: '8 Apr 2025', duration: '34:07', fav: false, hidden: false },
  { id: 4, section: 'Counselling basics', college: 'AFMC', title: 'Understanding allotment letters and reporting', desc: 'Documents, fees, and how the college reporting process works.', date: '5 Apr 2025', duration: '15:55', fav: false, hidden: false },
  { id: 5, section: 'Cutoff analysis', college: 'AIIMS Delhi', title: 'AIIMS Delhi 2024 cutoff deep-dive', desc: 'Category-wise, round-wise cutoff trends with 2025 projections.', date: '3 Apr 2025', duration: '41:20', fav: true, hidden: false },
  { id: 6, section: 'Cutoff analysis', college: 'JIPMER', title: 'JIPMER Puducherry cutoff trends', desc: 'Historical opening and closing ranks with state-wise analysis.', date: '1 Apr 2025', duration: '22:38', fav: false, hidden: false },
  { id: 7, section: 'Cutoff analysis', college: 'Maulana Azad', title: 'Govt vs deemed college cutoffs compared', desc: 'Why government college cutoffs are shifting and what it means for you.', date: '29 Mar 2025', duration: '18:10', fav: false, hidden: false },
  { id: 8, section: 'Cutoff analysis', college: 'AFMC', title: 'AFMC cutoff and eligibility explained', desc: 'Special criteria, medical fitness, and AIR cutoffs for AFMC 2025.', date: '27 Mar 2025', duration: '25:00', fav: false, hidden: false },
  { id: 9, section: 'Interview & tips', college: 'AIIMS Delhi', title: 'How topper Aryan cleared AIIMS in first attempt', desc: 'Personal strategy, study schedule, and revision techniques from a 720 scorer.', date: '25 Mar 2025', duration: '52:18', fav: false, hidden: false },
  { id: 10, section: 'Interview & tips', college: 'JIPMER', title: 'Last 30 days revision strategy for NEET', desc: 'What to revise, what to drop, and how to manage exam anxiety.', date: '22 Mar 2025', duration: '37:45', fav: true, hidden: false },
  { id: 11, section: 'Interview & tips', college: 'Maulana Azad', title: 'Common counselling mistakes to avoid', desc: 'Top 10 mistakes during NEET counselling that cost students their preferred college.', date: '20 Mar 2025', duration: '29:33', fav: false, hidden: false },
  { id: 12, section: 'Interview & tips', college: 'AFMC', title: 'PwD category counselling — rights and process', desc: 'Horizontal reservation and how PwD seats are allotted.', date: '18 Mar 2025', duration: '16:50', fav: false, hidden: false },
];

const COLLEGES = ['All colleges', 'AIIMS Delhi', 'JIPMER', 'Maulana Azad', 'AFMC'];

const THUMB_COLORS = [
  { bg: 'bg-primary-light', text: 'text-primary' },
  { bg: 'bg-secondary-light', text: 'text-secondary' },
  { bg: 'bg-accent-light', text: 'text-accent' },
  { bg: 'bg-success-light', text: 'text-success' },
  { bg: 'bg-warning-light', text: 'text-warning' },
];

function VideoCard({
  video,
  onFav,
  onHide,
  activeMenu,
  setActiveMenu,
}: {
  video: Video;
  onFav: (id: number) => void;
  onHide: (id: number) => void;
  activeMenu: number | null;
  setActiveMenu: (id: number | null) => void;
}) {
  const thumb = THUMB_COLORS[video.id % THUMB_COLORS.length];
  const isOpen = activeMenu === video.id;

  return (
    <div
      className="bg-card border border-border rounded-xl overflow-visible relative
      hover:border-border-strong hover:shadow-sm transition-all duration-150 cursor-pointer"
    >
      <div
        className={`${thumb.bg} w-full aspect-video rounded-t-xl relative flex
        items-center justify-center overflow-hidden`}
      >
        {video.fav && (
          <span
            className="absolute top-1.5 left-1.5 w-[22px] h-[22px] rounded-full
            bg-black/50 flex items-center justify-center z-10"
          >
            <Star size={11} fill="#f59e0b" stroke="#f59e0b" />
          </span>
        )}

        <span
          className={`w-8 h-8 bg-white/90 rounded-full flex items-center
          justify-center ${thumb.text}`}
        >
          <Play size={13} fill="currentColor" stroke="none" />
        </span>

        <span
          className="absolute bottom-1.5 right-1.5 bg-black/70 text-white
          text-[10px] font-semibold px-1.5 py-0.5 rounded"
        >
          {video.duration}
        </span>
      </div>

      <div className="p-2.5">
        <p
          className="text-xs font-semibold text-foreground leading-snug mb-1
          line-clamp-2"
        >
          {video.title}
        </p>

        <p
          className="text-sm text-foreground-muted leading-snug line-clamp-2
          mb-2"
        >
          {video.desc}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-subtle">
            {video.date}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(isOpen ? null : video.id);
            }}
            className="w-6 h-6 flex items-center justify-center rounded-md text-foreground-subtle
              hover:bg-hover hover:text-foreground-muted transition-colors"
          >
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute right-2 bottom-9 w-44 bg-card border border-border
            rounded-lg shadow-md z-50 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onFav(video.id);
              setActiveMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium
              text-warning hover:bg-warning-light transition-colors"
          >
            <Star size={13} />
            {video.fav
              ? "Remove from favourites"
              : "Add to favourites"}
          </button>

          <hr className="border-border" />

          <button
            onClick={() => {
              setActiveMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium
              text-info hover:bg-info-light transition-colors"
          >
            <Share2 size={13} /> Share
          </button>

          <hr className="border-border" />

          <button
            onClick={() => {
              onHide(video.id);
              setActiveMenu(null);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium
              text-foreground-muted hover:bg-hover transition-colors"
          >
            <EyeOff size={13} /> Hide
          </button>
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [query, setQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [favOnly, setFavOnly] = useState(false);
  const [activeCol, setActiveCol] = useState('All colleges');

  const toggleFav = (id: number) =>
    setVideos(vs => vs.map(v => v.id === id ? { ...v, fav: !v.fav } : v));

  const hideVideo = (id: number) =>
    setVideos(vs => vs.map(v => v.id === id ? { ...v, hidden: true } : v));

  const visible = videos.filter(v => {
    if (v.hidden) return false;
    if (favOnly && !v.fav) return false;
    if (activeCol !== 'All colleges' && v.college !== activeCol) return false;
    const q = query.toLowerCase();
    if (q && !v.title.toLowerCase().includes(q) && !v.desc.toLowerCase().includes(q)) return false;
    return true;
  });

  useEffect(() => {
    const close = () => setActiveMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const sections = [...new Set(visible.map(v => v.section))];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Videos</h1>
        <p className="text-md text-foreground-muted mt-0.5">
          Lectures, walkthroughs, and exam prep content
        </p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2
            text-foreground-subtle pointer-events-none" />
          <input
            type="text"
            placeholder="Search videos…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-[38px] pl-9 pr-3 border border-border rounded-lg bg-card
              text-base text-foreground placeholder:text-foreground-subtle
              focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={() => setFavOnly(v => !v)}
          className={`flex items-center gap-1.5 h-[38px] px-4 rounded-lg border text-base
            font-medium transition-colors whitespace-nowrap
            ${favOnly
              ? 'bg-warning-light border-warning/30 text-warning'
              : 'bg-card border-border text-foreground-muted hover:bg-hover'}`}
        >
          <Star size={13} fill={favOnly ? 'currentColor' : 'none'} />
          Favourites
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap mb-5">
        {COLLEGES.map(col => (
          <button
            key={col}
            onClick={() => setActiveCol(col)}
            className={`h-[30px] px-3.5 rounded-full border text-md font-medium
              transition-colors whitespace-nowrap
              ${activeCol === col
                ? 'bg-primary border-primary text-primary-foreground'
                : 'bg-card border-border text-foreground-muted hover:border-border-strong hover:text-foreground'}`}
          >
            {col}
          </button>
        ))}
      </div>

      <hr className="border-border mb-6" />

      {sections.length === 0 ? (
        <p className="text-center text-base text-foreground-subtle py-16">
          No videos match your filters.
        </p>
      ) : (
        sections.map(sec => {
          const sectionVideos = visible.filter(v => v.section === sec);
          return (
            <div key={sec} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">{sec}</h2>
                  <span className="text-md text-foreground-subtle">
                    {sectionVideos.length} video{sectionVideos.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button className="text-md font-medium text-primary hover:underline">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3.5">
                {sectionVideos.map(v => (
                  <VideoCard
                    key={v.id}
                    video={v}
                    onFav={toggleFav}
                    onHide={hideVideo}
                    activeMenu={activeMenu}
                    setActiveMenu={setActiveMenu}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}