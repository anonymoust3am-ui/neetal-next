// app/(routes)/news/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Calendar, BookOpen, TrendingUp, Clock,
  Eye, Heart, ChevronLeft, ChevronRight,
  Filter, ChevronDown, Newspaper, Sparkles,
  MessageCircle, X,
  Share2,
} from "lucide-react";
import { format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Author {
  id: number;
  name: string;
  avatar?: string;
  role?: string;
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  readTime: number;
  author: Author;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  featured?: boolean;
  trending?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockPosts: BlogPost[] = [
  {
    id: 1,
    title: "NEET 2024: Complete Guide to Counseling Process and Seat Allotment",
    slug: "neet-2024-counseling-guide",
    excerpt: "Everything you need to know about NEET counseling 2024. Step-by-step guide to registration, document verification, choice filling, and seat allotment.",
    coverImage: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
    publishedAt: "2024-03-15T10:30:00Z",
    readTime: 8,
    author: { id: 1, name: "Dr. Rajesh Kumar", avatar: "https://ui-avatars.com/api/?name=Dr.+Rajesh+Kumar&background=0D9488&color=fff", role: "Medical Education Expert" },
    category: "Exam Updates",
    tags: ["NEET", "Counseling", "Admissions"],
    views: 15420, likes: 234, comments: 45, featured: true, trending: true,
  },
  {
    id: 2,
    title: "Top 10 Medical Colleges in Jharkhand: Ranking, Fees, and Seats",
    slug: "top-medical-colleges-jharkhand",
    excerpt: "Comprehensive analysis of medical colleges in Jharkhand including AIIMS Deoghar, MGMCH Jamshedpur, and more. Compare fees, seat matrix, and placement records.",
    coverImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=500&fit=crop",
    publishedAt: "2024-03-10T14:15:00Z",
    readTime: 12,
    author: { id: 2, name: "Priya Sharma", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0891B2&color=fff", role: "Education Analyst" },
    category: "College Reviews",
    tags: ["Rankings", "Jharkhand", "Fee Structure"],
    views: 9820, likes: 156, comments: 28, featured: true,
  },
  {
    id: 3,
    title: "How to Prepare for NEET 2025: Expert Tips and Study Plan",
    slug: "neet-2025-preparation-tips",
    excerpt: "Expert-recommended study plan for NEET 2025. Learn time management, important topics, mock test strategies, and common mistakes to avoid.",
    coverImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=500&fit=crop",
    publishedAt: "2024-03-05T09:00:00Z",
    readTime: 10,
    author: { id: 1, name: "Dr. Rajesh Kumar", avatar: "https://ui-avatars.com/api/?name=Dr.+Rajesh+Kumar&background=0D9488&color=fff", role: "Medical Education Expert" },
    category: "Preparation Tips",
    tags: ["NEET", "Study Tips", "Strategy"],
    views: 12450, likes: 312, comments: 67, trending: true,
  },
  {
    id: 4,
    title: "AIIMS Deoghar: New Campus, Facilities, and Admission Process",
    slug: "aiims-deoghar-admission-guide",
    excerpt: "Everything about AIIMS Deoghar — from infrastructure to faculty, hostel facilities, and the complete admission process through INI CET.",
    coverImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&h=500&fit=crop",
    publishedAt: "2024-02-28T11:20:00Z",
    readTime: 7,
    author: { id: 3, name: "Amit Singh", avatar: "https://ui-avatars.com/api/?name=Amit+Singh&background=14B8A6&color=fff", role: "Medical Journalist" },
    category: "Institute Spotlight",
    tags: ["AIIMS", "INI CET", "New Campus"],
    views: 6730, likes: 98, comments: 23,
  },
  {
    id: 5,
    title: "MBBS vs BDS: Which Medical Career Path Should You Choose?",
    slug: "mbbs-vs-bds-career-comparison",
    excerpt: "Detailed comparison between MBBS and BDS courses. Curriculum, career opportunities, earning potential, and future prospects analyzed.",
    coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=500&fit=crop",
    publishedAt: "2024-02-20T16:45:00Z",
    readTime: 9,
    author: { id: 2, name: "Priya Sharma", avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0891B2&color=fff", role: "Education Analyst" },
    category: "Career Guidance",
    tags: ["MBBS", "BDS", "Career"],
    views: 8450, likes: 187, comments: 42,
  },
  {
    id: 6,
    title: "Latest Updates: NMC Releases New Guidelines for Medical Colleges",
    slug: "nmc-new-guidelines-medical-colleges",
    excerpt: "National Medical Commission announces new guidelines for medical colleges. Key changes in curriculum, faculty requirements, and infrastructure norms.",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop",
    publishedAt: "2024-02-15T08:30:00Z",
    readTime: 6,
    author: { id: 1, name: "Dr. Rajesh Kumar", avatar: "https://ui-avatars.com/api/?name=Dr.+Rajesh+Kumar&background=0D9488&color=fff", role: "Medical Education Expert" },
    category: "Regulatory Updates",
    tags: ["NMC", "Guidelines", "Policy"],
    views: 11230, likes: 278, comments: 56, featured: true,
  },
  {
    id: 7,
    title: "Scholarships for Medical Students: Complete Guide 2024",
    slug: "medical-scholarships-guide",
    excerpt: "List of scholarships available for medical students in India. Eligibility criteria, application process, and deadlines for various schemes.",
    coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
    publishedAt: "2024-02-10T13:15:00Z",
    readTime: 8,
    author: { id: 3, name: "Amit Singh", avatar: "https://ui-avatars.com/api/?name=Amit+Singh&background=14B8A6&color=fff", role: "Medical Journalist" },
    category: "Scholarships",
    tags: ["Scholarship", "Financial Aid"],
    views: 5420, likes: 89, comments: 19,
  },
  {
    id: 8,
    title: "How to Crack INI CET: Tips from AIIMS Toppers",
    slug: "ini-cet-preparation-tips",
    excerpt: "Learn from AIIMS toppers about their INI CET preparation strategy. Study materials, time table, and exam day tips for success.",
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop",
    publishedAt: "2024-02-05T10:00:00Z",
    readTime: 11,
    author: { id: 1, name: "Dr. Rajesh Kumar", avatar: "https://ui-avatars.com/api/?name=Dr.+Rajesh+Kumar&background=0D9488&color=fff", role: "Medical Education Expert" },
    category: "Exam Tips",
    tags: ["INI CET", "AIIMS", "Exam Prep"],
    views: 7680, likes: 145, comments: 34, trending: true,
  },
];

const categories: Category[] = [
  { id: "all", name: "All Posts", count: 8 },
  { id: "Exam Updates", name: "Exam Updates", count: 1 },
  { id: "College Reviews", name: "College Reviews", count: 1 },
  { id: "Preparation Tips", name: "Preparation Tips", count: 1 },
  { id: "Institute Spotlight", name: "Institute Spotlight", count: 1 },
  { id: "Career Guidance", name: "Career Guidance", count: 1 },
  { id: "Regulatory Updates", name: "Regulatory Updates", count: 1 },
  { id: "Scholarships", name: "Scholarships", count: 1 },
  { id: "Exam Tips", name: "Exam Tips", count: 1 },
];

const ITEMS_PER_PAGE = 6;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredPosts = mockPosts.filter(post => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.name.toLowerCase().includes(q) ||
      post.tags.some(t => t.toLowerCase().includes(q));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const handleLike = (postId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedPosts(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  };

  const clearFilters = () => { setSearchTerm(""); setSelectedCategory("all"); };
  const hasFilters = searchTerm || selectedCategory !== "all";

  return (
    <section className="relative py-16 mt-20 bg-background min-h-screen">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light border border-primary/20 mb-4">
            <Newspaper className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">Latest Updates & Insights</span>
          </div> */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Medical Education{" "}
            <span className="text-primary">News & Blog</span>
          </h1>
          <p className="text-sm text-foreground-muted leading-relaxed">
            Stay updated with the latest in medical education, exam tips, college reviews, and career guidance.
          </p>
        </motion.div>

        {/* ── Search & Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <div className="bg-surface border border-border rounded-2xl shadow-sm p-4">
            <div className="flex flex-col lg:flex-row gap-3">

              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 h-10 text-sm rounded-xl border border-border
                    bg-input text-foreground placeholder:text-foreground-subtle
                    focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                />
              </div>

              {/* Category toggle */}
              <button
                onClick={() => setShowFilters(v => !v)}
                className={`px-4 h-10 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                  showFilters
                    ? "bg-primary-light border-primary/30 text-primary"
                    : "border-border text-foreground-muted hover:border-primary/30 hover:bg-primary-light hover:text-primary"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                Categories
                <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {/* Trending pill */}
              <div className="flex items-center gap-2 px-3 h-10 bg-warning-light rounded-xl border border-warning/20">
                <TrendingUp className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs font-semibold text-warning">Trending Articles</span>
              </div>

            </div>

            {/* Category Pills */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            selectedCategory === cat.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-foreground-muted hover:bg-hover hover:text-foreground border border-border"
                          }`}
                        >
                          {cat.name}
                          <span className="ml-1 opacity-70">({cat.count})</span>
                        </button>
                      ))}
                    </div>
                    {hasFilters && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={clearFilters}
                          className="text-xs text-error font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Result count ── */}
        <div className="mb-5 flex items-center justify-between text-sm">
          <p className="text-foreground-muted">
            Showing{" "}
            <span className="font-semibold text-foreground">{paginatedPosts.length}</span>
            {" "}of{" "}
            <span className="font-semibold text-foreground">{filteredPosts.length}</span>
            {" "}articles
          </p>
          <div className="flex items-center gap-1.5 text-foreground-subtle">
            <Sparkles className="w-3 h-3 text-warning" />
            <span className="text-xs">Fresh insights daily</span>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredPosts.length === 0 ? (
          <EmptyState onClear={clearFilters} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            <AnimatePresence>
              {paginatedPosts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  //liked={likedPosts.has(post.id)}
                  //onLike={handleLike}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-10 flex justify-center items-center gap-2"
          >
            <PaginationBtn
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationBtn>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border text-foreground-muted hover:border-primary/30 hover:bg-primary-light hover:text-primary"
                }`}
              >
                {page}
              </button>
            ))}

            <PaginationBtn
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationBtn>
          </motion.div>
        )}

      </div>
    </section>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PostCard({
  post,
  index,
}: {
  post: BlogPost;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={() => window.location.href = `/news/${post.slug}`}
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden
        hover:border-primary/30 hover:shadow-md transition-all duration-200 h-full flex flex-col">

        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Label (category) */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 bg-surface/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3">

          {/* Title */}
          <h3 className="text-[15px] font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {post.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-foreground-muted leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>

          {/* Updated Date */}
          <p className="text-[11px] text-foreground-subtle">
            Updated on {format(new Date(post.publishedAt), "MMM dd, yyyy")}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 bg-muted border border-border text-foreground-subtle rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Share */}
          <div className="flex justify-end pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.share?.({
                  title: post.title,
                  text: post.excerpt,
                  url: `${window.location.origin}/news/${post.slug}`,
                });
              }}
              className="p-2 rounded-lg hover:bg-muted transition"
            >
              <Share2 className="w-4 h-4 text-foreground-muted" />
            </button>
          </div>

        </div>
      </div>
    </motion.article>
  );
}

function PaginationBtn({ onClick, disabled, children }: {
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
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
          <div className="h-48 bg-skeleton" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-skeleton rounded-full w-24" />
            <div className="h-5 bg-skeleton rounded-full w-3/4" />
            <div className="h-3 bg-skeleton rounded-full w-full" />
            <div className="h-3 bg-skeleton rounded-full w-2/3" />
            <div className="flex items-center gap-2 pt-1">
              <div className="w-7 h-7 rounded-full bg-skeleton" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-skeleton rounded-full w-24" />
                <div className="h-2 bg-skeleton rounded-full w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-foreground-subtle" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-1">No articles found</h3>
      <p className="text-sm text-foreground-muted mb-4">Try adjusting your search or category filters.</p>
      <button
        onClick={onClear}
        className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}