'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Search, BookOpen, TrendingUp, ChevronLeft, ChevronRight,
  Filter, ChevronDown, Sparkles, X, Share2, User, Tag,
} from 'lucide-react';
import { format } from 'date-fns';
import { getBlogs, type Blog } from '@/lib/api';

function cn(...cls: (string | false | null | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}

const LIMIT = 9;

export default function NewsPage() {
  const [blogs, setBlogs]           = useState<Blog[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  const [search, setSearch]   = useState('');
  const [tag, setTag]         = useState('');
  const [showFilter, setShowFilter] = useState(false);

  /* Debounced fetch */
  const fetchBlogs = useCallback(async (p: number, s: string, t: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await getBlogs({ page: p, limit: LIMIT, search: s || undefined, tag: t || undefined });
      setBlogs(res.blogs);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  /* Re-fetch when filters change (debounced for search) */
  useEffect(() => {
    const id = setTimeout(() => fetchBlogs(page, search, tag), search ? 400 : 0);
    return () => clearTimeout(id);
  }, [page, search, tag, fetchBlogs]);

  /* Reset to page 1 when filters change */
  useEffect(() => { setPage(1); }, [search, tag]);

  const clearFilters = () => { setSearch(''); setTag(''); };
  const hasFilters = !!(search || tag);

  return (
    <div className="pt-6 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

      {/* Hero */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light border border-primary/20
          rounded-full text-xs font-semibold text-primary mb-3">
          <Sparkles className="w-3 h-3" />
          Fresh insights daily
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-2">
          Medical Education <span className="text-primary">News & Blog</span>
        </h1>
        <p className="text-sm text-foreground-muted max-w-lg mx-auto leading-relaxed">
          Latest insights, exam tips, college reviews and career guidance for NEET aspirants.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles, topics…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 h-10 text-sm rounded-xl border border-border
                bg-input text-foreground placeholder:text-foreground-subtle
                focus:border-primary outline-none transition-colors"
            />
          </div>

          <button
            onClick={() => setShowFilter(v => !v)}
            className={cn(
              'h-10 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors',
              showFilter
                ? 'bg-primary-light border-primary/30 text-primary'
                : 'border-border text-foreground-muted hover:bg-hover',
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter by tag
            <ChevronDown className={cn('w-3 h-3 transition-transform', showFilter && 'rotate-180')} />
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="h-10 px-3 rounded-xl border border-border text-sm text-error
                font-medium flex items-center gap-1.5 hover:bg-error-light transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {showFilter && (
          <div className="pt-4 mt-4 border-t border-border">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle mb-3">
              Filter by tag
            </p>
            <div className="flex flex-wrap gap-2">
              {['NEET', 'Exam Tips', 'College Reviews', 'Counselling', 'Study Plan', 'Career'].map(t => (
                <button
                  key={t}
                  onClick={() => setTag(prev => prev === t ? '' : t)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors',
                    tag === t
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted text-foreground-muted border-border hover:bg-hover',
                  )}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result count */}
      {!loading && !error && (
        <div className="flex items-center justify-between text-sm mb-5">
          <p className="text-foreground-muted">
            <span className="font-semibold text-foreground">{total}</span> article{total !== 1 ? 's' : ''}
            {hasFilters && ' matching your filters'}
          </p>
          <div className="flex items-center gap-1.5 text-foreground-subtle text-xs">
            <TrendingUp className="w-3 h-3 text-success" />
            Page {page} of {totalPages}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchBlogs(page, search, tag)} />
      ) : blogs.length === 0 ? (
        <EmptyState onClear={clearFilters} hasFilters={hasFilters} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map(blog => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2">
          <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="w-4 h-4" />
          </PageBtn>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | '…')[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === '…' ? (
                <span key={`e${i}`} className="w-9 text-center text-foreground-subtle text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={cn(
                    'w-9 h-9 rounded-xl text-sm font-semibold transition-all',
                    page === p
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border text-foreground-muted hover:bg-primary-light hover:text-primary hover:border-primary/30',
                  )}
                >
                  {p}
                </button>
              ),
            )
          }

          <PageBtn onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </PageBtn>
        </div>
      )}
    </div>
  );
}

/* ─── Blog Card ──────────────────────────────────────────────────────────── */

function BlogCard({ blog }: { blog: Blog }) {
  const cover = blog.coverImageUrl ?? blog.imageUrl;
  const slug  = blog.slug ?? blog.id;
  const date  = format(new Date(blog.createdAt), 'MMM dd, yyyy');

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.share?.({
      title: blog.title,
      text: blog.description ?? '',
      url: `${window.location.origin}/news/${slug}`,
    });
  };

  return (
    <Link href={`/news/${slug}`} className="group block h-full">
      <article className="bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col
        hover:border-primary/30 hover:shadow-md transition-all duration-200">

        {/* Cover */}
        <div className="relative h-44 overflow-hidden bg-muted shrink-0">
          {cover ? (
            <img
              src={cover}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-muted">
              <BookOpen className="w-10 h-10 text-primary/40" />
            </div>
          )}
          {blog.tags.length > 0 && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-1 bg-card/90 backdrop-blur-sm text-primary text-xs font-bold rounded-full">
                {blog.tags[0]}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2.5 flex-1">
          <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {blog.title}
          </h3>

          {blog.description && (
            <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">
              {blog.description}
            </p>
          )}

          {/* Author + date */}
          <div className="flex items-center gap-2 mt-auto pt-1">
            {blog.author.avatarUrl ? (
              <img src={blog.author.avatarUrl} alt={blog.author.name}
                className="w-6 h-6 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-light flex items-center justify-center shrink-0">
                <User className="w-3 h-3 text-primary" />
              </div>
            )}
            <span className="text-xs text-foreground-muted truncate">{blog.author.name}</span>
            <span className="text-foreground-subtle text-xs ml-auto shrink-0">{date}</span>
          </div>

          {/* Tags */}
          {blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {blog.tags.slice(0, 3).map(t => (
                <span key={t}
                  className="text-xs px-1.5 py-0.5 bg-muted border border-border text-foreground-subtle rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex justify-end">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-3.5 h-3.5 text-foreground-muted" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function PageBtn({ onClick, disabled, children }: {
  onClick: () => void; disabled: boolean; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-9 h-9 rounded-xl border border-border text-foreground-muted
        hover:border-primary/30 hover:bg-primary-light hover:text-primary
        disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center"
    >
      {children}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="h-44 bg-skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-skeleton rounded-full w-3/4" />
            <div className="h-3 bg-skeleton rounded-full w-full" />
            <div className="h-3 bg-skeleton rounded-full w-2/3" />
            <div className="flex items-center gap-2 pt-2">
              <div className="w-6 h-6 rounded-full bg-skeleton shrink-0" />
              <div className="h-3 bg-skeleton rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-error-light flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-error" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">Failed to load articles</p>
      <p className="text-xs text-foreground-muted mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-foreground-subtle" />
      </div>
      <p className="text-sm font-semibold text-foreground mb-1">No articles found</p>
      <p className="text-xs text-foreground-muted mb-4">
        {hasFilters ? 'Try adjusting your filters.' : 'Check back soon for new content.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
