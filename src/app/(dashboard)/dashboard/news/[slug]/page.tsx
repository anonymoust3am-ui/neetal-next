'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft, User, Calendar, Tag, ChevronDown, ChevronUp,
  ExternalLink, Share2, BookOpen, Clock, Home, ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { getBlogBySlug, getBlogById, type Blog } from '@/lib/api';
import { HEADER_H } from '@/contexts/SidebarContext';

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin:  'bg-blue-100 text-blue-700',
  twitter:   'bg-sky-100 text-sky-600',
  instagram: 'bg-pink-100 text-pink-600',
  youtube:   'bg-red-100 text-red-600',
  facebook:  'bg-indigo-100 text-indigo-700',
};

function readingTime(content?: string) {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogDetailPage() {
  const params = useParams<{ slug: string }>();

  const slug   = params.slug;

  const [blog, setBlog]       = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const articleRef = useRef<HTMLDivElement>(null);

  /* Reading progress */
  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const visible = window.innerHeight - HEADER_H;
      const scrolled = Math.max(0, -top + HEADER_H);
      const pct = Math.min(100, (scrolled / (height - visible)) * 100);
      setProgress(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [blog]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');

    getBlogBySlug(slug)
      .catch(() => getBlogById(slug))
      .then(setBlog)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Article not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    navigator.share?.({
      title: blog?.title ?? '',
      text: blog?.description ?? '',
      url: window.location.href,
    });
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 animate-pulse space-y-4">
        <div className="h-4 bg-skeleton rounded w-40" />
        <div className="h-8 bg-skeleton rounded w-3/4" />
        <div className="h-4 bg-skeleton rounded w-1/2" />
        <div className="h-64 bg-skeleton rounded-2xl" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 bg-skeleton rounded w-full" />
        ))}
      </div>
    );
  }

  /* ── Error ── */
  if (error || !blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-2xl bg-error-light flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-error" />
        </div>
        <h2 className="text-base font-bold text-foreground mb-1">Article not found</h2>
        <p className="text-sm text-foreground-muted mb-5">{error || 'This article does not exist.'}</p>
        <Link
          href="/dashboard/news"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
            rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>
      </div>
    );
  }

  const cover   = blog.coverImageUrl ?? blog.imageUrl;
  const date    = format(new Date(blog.createdAt), 'MMMM dd, yyyy');
  const minRead = readingTime(blog.content);
  const titleShort = blog.title.length > 40 ? blog.title.slice(0, 40) + '…' : blog.title;

  return (
    <div ref={articleRef} className="max-w-3xl mx-auto px-4 sm:px-6 pb-12"
      style={{ paddingTop: HEADER_H + 16 }}>

      {/* Reading progress bar — fixed just below the app header */}
      <div
        className="fixed left-0 right-0 z-sticky"
        style={{ top: HEADER_H }}
      >
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-primary transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-foreground-muted mb-5 flex-wrap">
        <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="w-3 h-3" />
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-foreground-subtle shrink-0" />
        <Link href="/dashboard/news" className="hover:text-primary transition-colors">
          News & Blog
        </Link>
        <ChevronRight className="w-3 h-3 text-foreground-subtle shrink-0" />
        <span className="text-foreground truncate max-w-[200px] sm:max-w-xs font-medium">
          {titleShort}
        </span>
      </nav>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {blog.tags.map(t => (
            <span key={t}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1
                bg-primary-light text-primary rounded-full border border-primary/20">
              <Tag className="w-2.5 h-2.5" />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight tracking-tight mb-3">
        {blog.title}
      </h1>

      {/* Description */}
      {blog.description && (
        <p className="text-base text-foreground-muted leading-relaxed mb-5">
          {blog.description}
        </p>
      )}

      {/* Author row */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          {blog.author.avatarUrl ? (
            <img src={blog.author.avatarUrl} alt={blog.author.name}
              className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{blog.author.name}</p>
            {blog.author.tag && (
              <p className="text-xs text-foreground-muted">{blog.author.tag}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Clock className="w-3.5 h-3.5" />
            {minRead} min read
          </div>
          <button
            onClick={handleShare}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>
      </div>

      {/* Cover image */}
      {cover && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-border">
          <img src={cover} alt={blog.title} className="w-full object-cover max-h-80" />
        </div>
      )}

      {/* Markdown content */}
      {blog.content ? (
        <article className="prose-blog mb-10">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </article>
      ) : (
        <div className="bg-muted rounded-2xl flex items-center justify-center h-40 mb-10 border border-border">
          <p className="text-sm text-foreground-subtle">No content available.</p>
        </div>
      )}

      {/* FAQs */}
      {blog.faqs && blog.faqs.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {blog.faqs.map(faq => {
              const open = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    'rounded-xl border transition-colors overflow-hidden',
                    open ? 'border-primary/30 bg-primary-light/20' : 'border-border bg-card',
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : faq.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3"
                  >
                    <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                    {open
                      ? <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-foreground-subtle shrink-0" />}
                  </button>
                  {open && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-foreground-muted leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Author bio card */}
      {(blog.author.bio || blog.author.expertise || (blog.author.socialLinks?.length ?? 0) > 0) && (
        <section className="bg-card border border-border rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-foreground-subtle mb-3">
            About the author
          </p>
          <div className="flex items-start gap-4">
            {blog.author.avatarUrl ? (
              <img src={blog.author.avatarUrl} alt={blog.author.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{blog.author.name}</p>
              {blog.author.tag && (
                <p className="text-xs text-primary font-semibold mt-0.5">{blog.author.tag}</p>
              )}
              {blog.author.expertise && (
                <p className="text-xs text-foreground-muted mt-0.5">{blog.author.expertise}</p>
              )}
              {blog.author.bio && (
                <p className="text-xs text-foreground-muted leading-relaxed mt-2">{blog.author.bio}</p>
              )}
              {blog.author.socialLinks && blog.author.socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {blog.author.socialLinks.map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
                        PLATFORM_COLORS[link.platform] ?? 'bg-muted text-foreground-muted',
                      )}
                    >
                      {link.platform}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Back to News — bottom */}
      <div className="mt-10 pt-6 border-t border-border">
        <Link
          href="/dashboard/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted
            hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News & Blog
        </Link>
      </div>

    </div>
  );
}
