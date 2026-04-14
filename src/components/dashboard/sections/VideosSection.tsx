import Link from 'next/link';
import { Play, ChevronRight } from 'lucide-react';

const ACCENT = ['#0d9488', '#7c3aed', '#0ea5e9', '#d97706', '#16a34a'];

interface VideoCardProps { title: string; dur: string; views: string; idx: number; }

function VideoCard({ title, dur, views, idx }: VideoCardProps) {
  const a = ACCENT[idx % ACCENT.length];
  return (
    <div className="group bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all shrink-0 w-52 cursor-pointer">
      <div className="h-28 flex items-center justify-center relative" style={{ background: a + '18' }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: a + '30' }}>
          <Play size={14} style={{ color: a }} className="ml-0.5" fill="currentColor" />
        </div>
        <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded font-mono">
          {dur}
        </span>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">{title}</p>
        <p className="text-[10px] text-foreground-subtle mt-1">{views} views</p>
      </div>
    </div>
  );
}

const VIDEOS = [
  { title: 'MCC Round 2 — Everything You Need To Know',   dur: '18:24', views: '124K' },
  { title: 'How to Fill Choice List Strategically',        dur: '12:05', views: '98K'  },
  { title: 'AIIMS vs Government — Which First?',           dur: '22:10', views: '210K' },
  { title: 'Cutoff Trends 2024 Deep Dive',                 dur: '31:47', views: '67K'  },
  { title: 'State Quota vs AIQ — Full Comparison Guide',   dur: '15:33', views: '88K'  },
];

export function VideosSection() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Play size={15} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground">Recommended Videos</h2>
        </div>
        <Link href="/dashboard/videos" className="text-xs text-primary font-semibold flex items-center gap-0.5">
          See all <ChevronRight size={11} />
        </Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {VIDEOS.map((v, i) => (
          <VideoCard key={i} idx={i} title={v.title} dur={v.dur} views={v.views} />
        ))}
      </div>
    </div>
  );
}
