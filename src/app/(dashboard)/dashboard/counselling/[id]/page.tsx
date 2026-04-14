'use client';

import { useState } from 'react';
import {
    Calendar, MapPin, Globe, Users, FileText, BookOpen, Clock, CheckCircle,
    AlertCircle, ChevronRight, Share2, BookmarkIcon, GitCompare, Download,
    Printer, MessageCircle, Bell, GraduationCap, Award, Target, TrendingUp,
    HelpCircle, ExternalLink
} from 'lucide-react';
import { cn } from '../../choices/page';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TimelineEvent {
    id: number;
    title: string;
    date: string;
    description: string;
    status: 'upcoming' | 'ongoing' | 'completed';
}

interface ChoiceItem {
    id: number;
    college: string;
    rank: number;
    preference: number;
    status: 'allotted' | 'waiting' | 'not_allotted';
}

interface Announcement {
    id: number;
    title: string;
    date: string;
    content: string;
    important: boolean;
}

interface CounsellingData {
    id: string;
    title: string;
    type: string;
    banner: string;
    description: string;
    website: string;
    quotas: string[];
    registrationDates: {
        start: string;
        end: string;
    };
    prospectusUrl: string;
    stats: {
        totalSeats: number;
        participatingColleges: number;
        registeredCandidates: number;
    };
    timeline: TimelineEvent[];
    choiceList: ChoiceItem[];
    announcements: Announcement[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const COUNSELLING_DATA: Record<string, CounsellingData> = {
    'mcc-neet-ug': {
        id: 'mcc-neet-ug',
        title: 'NEET UG Counselling 2025',
        type: 'Undergraduate Medical',
        banner: 'MCC - Medical Counselling Committee',
        description: 'Centralized online counselling for admission to 15% AIQ seats in all government medical and dental colleges across India.',
        website: 'https://mcc.nic.in',
        quotas: ['AIQ - 15%', 'Central Universities', 'Deemed Universities', 'Armed Forces Medical College'],
        registrationDates: {
            start: '15 June 2025',
            end: '30 June 2025',
        },
        prospectusUrl: '/prospectus/mcc-neet-ug-2025.pdf',
        stats: {
            totalSeats: 45000,
            participatingColleges: 612,
            registeredCandidates: 1650000,
        },
        timeline: [
            { id: 1, title: 'Round 1 Registration', date: '15-30 June 2025', description: 'Online registration and fee payment', status: 'upcoming' },
            { id: 2, title: 'Round 1 Choice Filling', date: '20 June - 5 July 2025', description: 'Fill and lock your college preferences', status: 'upcoming' },
            { id: 3, title: 'Round 1 Seat Allotment', date: '10 July 2025', description: 'Results announcement', status: 'upcoming' },
            { id: 4, title: 'Round 1 Reporting', date: '12-18 July 2025', description: 'Document verification at allotted colleges', status: 'upcoming' },
            { id: 5, title: 'Round 2 Registration', date: '25-30 July 2025', description: 'Fresh registration for round 2', status: 'upcoming' },
            { id: 6, title: 'Round 2 Choice Filling', date: '28 July - 10 Aug 2025', description: 'Modify or fill new choices', status: 'upcoming' },
            { id: 7, title: 'Round 2 Seat Allotment', date: '15 Aug 2025', description: 'Round 2 results', status: 'upcoming' },
            { id: 8, title: 'Mop-up Round', date: '25 Aug - 15 Sep 2025', description: 'Final round for vacant seats', status: 'upcoming' },
        ],
        choiceList: [
            { id: 1, college: 'AIIMS New Delhi', rank: 42815, preference: 1, status: 'allotted' },
            { id: 2, college: 'JIPMER Puducherry', rank: 52800, preference: 2, status: 'waiting' },
            { id: 3, college: 'Maulana Azad Medical College', rank: 49800, preference: 3, status: 'allotted' },
            { id: 4, college: 'VMMC & Safdarjung Hospital', rank: 89622, preference: 4, status: 'not_allotted' },
            { id: 5, college: 'Grant Medical College', rank: 62140, preference: 5, status: 'waiting' },
        ],
        announcements: [
            { id: 1, title: 'Important Dates Released', date: '01 June 2025', content: 'Counselling schedule for NEET UG 2025 has been announced. Check timeline for all rounds.', important: true },
            { id: 2, title: 'Choice Filling Guidelines', date: '05 June 2025', content: 'Watch the video tutorial for choice filling strategy and preference order.', important: false },
            { id: 3, title: 'Document Verification', date: '08 June 2025', content: 'List of required documents for verification process has been updated.', important: true },
            { id: 4, title: 'State Quota Counselling', date: '10 June 2025', content: 'Separate registration required for state quota counselling.', important: false },
        ],
    },
};

// ─── Components ───────────────────────────────────────────────────────────────

function ActionButton({ icon: Icon, label, onClick, variant = 'default' }: {
    icon: any;
    label: string;
    onClick?: () => void;
    variant?: 'default' | 'primary';
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-150',
                variant === 'primary'
                    ? 'bg-primary text-primary-foreground border-primary hover:bg-primary-hover'
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-sm'
            )}
        >
            <Icon size={20} className={variant === 'primary' ? 'text-primary-foreground' : 'text-primary'} />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const statusColors = {
        upcoming: 'bg-border text-foreground-muted',
        ongoing: 'bg-warning-light text-warning border-warning/20',
        completed: 'bg-success-light text-success border-success/20',
    };

    const dotColors = {
        upcoming: 'bg-border',
        ongoing: 'bg-warning',
        completed: 'bg-success',
    };

    return (
        <div className="relative pl-6 pb-6 last:pb-0">
            {index !== 7 && (
                <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" />
            )}
            <div className="absolute left-0 top-1">
                <div className={cn('w-3.5 h-3.5 rounded-full border-2 bg-card', dotColors[event.status])} />
            </div>
            <div className={cn('p-3 rounded-lg border', statusColors[event.status])}>
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-foreground">{event.title}</h3>
                    <span className="text-sm text-foreground-subtle flex items-center gap-1">
                        <Calendar size={10} /> {event.date}
                    </span>
                </div>
                <p className="text-sm text-foreground-muted">{event.description}</p>
            </div>
        </div>
    );
}

function ChoiceCard({ item }: { item: ChoiceItem }) {
    const statusConfig = {
        allotted: { label: 'Allotted', cls: 'bg-success-light text-success', icon: CheckCircle },
        waiting: { label: 'Waiting', cls: 'bg-warning-light text-warning', icon: Clock },
        not_allotted: { label: 'Not Allotted', cls: 'bg-error-light text-error', icon: AlertCircle },
    };

    const config = statusConfig[item.status];
    const Icon = config.icon;

    return (
        <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 transition-all duration-150">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{item.preference}</span>
                    <span className="text-xs font-semibold text-foreground">•</span>
                    <h3 className="text-xs font-semibold text-foreground">{item.college}</h3>
                </div>
                <p className="text-sm text-foreground-muted">Rank: {item.rank.toLocaleString('en-IN')}</p>
            </div>
            <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold', config.cls)}>
                <Icon size={12} />
                <span>{config.label}</span>
            </div>
        </div>
    );
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
    return (
        <div className={cn(
            'p-3 rounded-lg border transition-all duration-150',
            announcement.important
                ? 'bg-warning-light border-warning/20'
                : 'bg-card border-border hover:border-primary/30'
        )}>
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                    {announcement.important && <AlertCircle size={12} className="text-warning" />}
                    {announcement.title}
                </h3>
                <span className="text-sm text-foreground-subtle flex items-center gap-1">
                    <Calendar size={10} /> {announcement.date}
                </span>
            </div>
            <p className="text-sm text-foreground-muted">{announcement.content}</p>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default async function CounsellingDetailPage({ params }: { params: { id: string } }) {
    const [saved, setSaved] = useState(false);
    const [compared, setCompared] = useState(false);

    const { id } = await params;

    const data = COUNSELLING_DATA[id] || COUNSELLING_DATA['mcc-neet-ug'];


    return (
        <div className="min-h-screen bg-background pb-16">
            <div className="max-w-[1400px] mx-auto px-6 py-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm text-foreground-muted mb-4">
                    <span className="hover:text-primary cursor-pointer">Home</span>
                    <ChevronRight size={14} />
                    <span className="hover:text-primary cursor-pointer">Counselling</span>
                    <ChevronRight size={14} />
                    <span className="text-foreground font-medium">{data.title}</span>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 mb-6 border border-primary/20">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary">
                                    {data.type}
                                </span>
                                <span className="text-sm text-foreground-muted">• {data.banner}</span>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-3">{data.title}</h1>
                            <p className="text-base text-foreground-muted max-w-2xl mb-4">{data.description}</p>

                            {/* Quick Links */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <a
                                    href={data.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                                >
                                    <Globe size={14} /> Official Website <ExternalLink size={12} />
                                </a>
                                <a
                                    href={data.prospectusUrl}
                                    className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                                >
                                    <FileText size={14} /> Prospectus
                                </a>
                                <button className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-primary transition-colors">
                                    <Printer size={14} /> Print
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSaved(!saved)}
                                className={cn(
                                    'w-9 h-9 rounded-lg border flex items-center justify-center transition-colors',
                                    saved
                                        ? 'border-primary/30 text-primary bg-primary-light'
                                        : 'border-border text-foreground-subtle hover:border-primary/30 hover:text-primary'
                                )}
                            >
                                <BookmarkIcon size={16} fill={saved ? 'currentColor' : 'none'} />
                            </button>
                            <button
                                onClick={() => setCompared(!compared)}
                                className={cn(
                                    'w-9 h-9 rounded-lg border flex items-center justify-center transition-colors',
                                    compared
                                        ? 'border-primary/30 text-primary bg-primary-light'
                                        : 'border-border text-foreground-subtle hover:border-primary/30 hover:text-primary'
                                )}
                            >
                                <GitCompare size={16} />
                            </button>
                            <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-foreground-subtle hover:border-primary/30 hover:text-primary transition-colors">
                                <Share2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
                        <div>
                            <p className="text-sm text-foreground-subtle mb-1">Total Seats</p>
                            <p className="text-xl font-bold text-foreground">{data.stats.totalSeats.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-foreground-subtle mb-1">Participating Colleges</p>
                            <p className="text-xl font-bold text-foreground">{data.stats.participatingColleges}</p>
                        </div>
                        <div>
                            <p className="text-sm text-foreground-subtle mb-1">Registered Candidates</p>
                            <p className="text-xl font-bold text-foreground">{data.stats.registeredCandidates.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Quotas and Registration Info */}
                {/* <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users size={16} className="text-primary" />
                            <h2 className="text-xs font-semibold text-foreground">Available Quotas</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {data.quotas.map((quota, idx) => (
                                <span key={idx} className="text-sm px-2.5 py-1 rounded-full bg-muted border border-border text-foreground-muted">
                                    {quota}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={16} className="text-primary" />
                            <h2 className="text-xs font-semibold text-foreground">Registration Period</h2>
                        </div>
                        <p className="text-base font-semibold text-foreground">
                            {data.registrationDates.start} - {data.registrationDates.end}
                        </p>
                        <button className="mt-2 text-sm text-primary hover:underline flex items-center gap-1">
                            Register Now <ChevronRight size={12} />
                        </button>
                    </div>
                </div> */}

                {/* Tool Shortcut Action Boxes */}
                {/* <div className="mb-6">
                    <h2 className="text-lg font-semibold text-foreground mb-3">Tools & Resources</h2>
                    <div className="grid grid-cols-5 gap-3">
                        <ActionButton icon={Target} label="College Predictor" variant="primary" />
                        <ActionButton icon={TrendingUp} label="Cutoff Trends" />
                        <ActionButton icon={GraduationCap} label="Fee Calculator" />
                        <ActionButton icon={Award} label="Rank Analyzer" />
                        <ActionButton icon={MessageCircle} label="Ask Doubt" />
                    </div>
                </div> */}

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Left: Timeline */}
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-primary" />
                                <h2 className="text-lg font-semibold text-foreground">Counselling Timeline</h2>
                            </div>
                            <button className="text-sm text-primary hover:underline flex items-center gap-1">
                                View All <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            {data.timeline.map((event, idx) => (
                                <TimelineItem key={event.id} event={event} index={idx} />
                            ))}
                        </div>
                    </div>

                    {/* Right: Choice List */}
                    <div className="bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <BookOpen size={18} className="text-primary" />
                                <h2 className="text-lg font-semibold text-foreground">Your Choice List</h2>
                            </div>
                            <button className="text-sm text-primary hover:underline flex items-center gap-1">
                                Edit Preferences <ChevronRight size={12} />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {data.choiceList.map((item) => (
                                <ChoiceCard key={item.id} item={item} />
                            ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-border">
                            <button className="w-full py-2 text-sm font-semibold text-primary bg-primary-light rounded-lg hover:bg-primary/20 transition-colors">
                                Download Choice List
                            </button>
                        </div>
                    </div>
                </div>

                {/* Announcements Section */}
                <div className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Bell size={18} className="text-primary" />
                            <h2 className="text-lg font-semibold text-foreground">Important Announcements</h2>
                        </div>
                        <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {data.announcements.map((announcement) => (
                            <AnnouncementCard key={announcement.id} announcement={announcement} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}