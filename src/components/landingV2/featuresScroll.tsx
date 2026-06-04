"use client";

import React, { useRef } from "react";

import Link from "next/link";

import { motion, useScroll, useTransform } from "framer-motion";

import { Cpu, GitCompare, Bell, Bookmark, MapPin, FileText, ArrowRight, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";

import { SectionHeader } from "../ui/SectionHeader";



const features = [

    {

        icon: Cpu,

        title: "College Predictor",

        desc: "Enter rank, category, and quota. Get Safe / Target / Dream classified options with data-backed reasoning.",

        href: "/predictors/college",

        badge: "AI-powered",

        badgeColor: "bg-primary-light text-primary border border-primary/20",

        highlights: ["Category-aware", "State + AIQ", "Multi-round data"],

        imgSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60",

    },

    {

        icon: GitCompare,

        title: "Side-by-side Compare",

        desc: "Compare up to 4 colleges across fees, bond, stipend, hostel, cutoffs and seat matrix in one structured view.",

        href: "/compare",

        badge: null,

        highlights: ["Up to 4 colleges", "10+ parameters", "Export ready"],

        imgSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=60",

    },

    {

        icon: Bell,

        title: "Alerts & Deadlines",

        desc: "Never miss round registration, choice filling windows, or allotment results. Notices translated into action items.",

        href: "/updates",

        badge: "Live",

        badgeColor: "bg-success-light text-success border border-success/20",

        highlights: ["Push alerts", "Round-specific", "Plain language"],

        imgSrc: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",

    },

    {

        icon: Bookmark,

        title: "Saved Shortlist",

        desc: "Save and organise colleges into a personal shortlist. Share with parents or your counsellor for review.",

        href: "/dashboard/shortlist",

        badge: null,

        highlights: ["Smart buckets", "Parent sharing", "Choice export"],

        imgSrc: "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?w=800&auto=format&fit=crop&q=60",

    },

    {

        icon: MapPin,

        title: "State Counselling Guide",

        desc: "Detailed state-wise guidance: authority, eligibility, domicile rules, important dates, and colleges.",

        href: "/counselling/states",

        badge: null,

        highlights: ["28 states", "Domicile-aware", "Eligibility clear"],

        imgSrc: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60",

    },

    {

        icon: FileText,

        title: "Choice Filling Strategy",

        desc: "Build an optimal choice list with guidance on ordering, backup options, and quota strategy.",

        href: "/counselling/choice",

        badge: "Premium",

        badgeColor: "bg-warning-light text-warning border border-warning/20",

        highlights: ["Expert reviewed", "Quota strategy", "Risk analysis"],

        imgSrc: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60",

    },

];



export function FeatureGrid() {

    const trackRef = useRef<HTMLDivElement>(null);



    const { scrollYProgress } = useScroll({

        target: trackRef,

        offset: ["start start", "end end"],

    });



    return (

        // Changed px-4 layouts to custom full-bleed sizes

        <div className="w-full bg-background px-4 sm:px-8 py-12 selection:bg-selection text-foreground">

            <header className="max-w-3xl mx-auto text-center pb-6 pt-6">

                <SectionHeader
                    eyebrow="NEET counselling tools"
                    title="Tools for smarter counselling."
                    description="Predict colleges, compare options, track deadlines, and build smarter choice lists using data-backed insights."
                    align="center"
                    className="mb-2"
                />

            </header>



            {/* Changed from max-w-7xl to full viewport width layout frame */}

            <div ref={trackRef} className="relative h-[450vh] w-full mx-auto">



                {/* Pinned Viewport Frame */}

                <div className="sticky top-[10vh] h-[80vh] w-full flex items-center justify-center overflow-hidden">



                    {/* Main Container Card — Adjusted borders to expand beautifully across full display viewports */}

                    <div className="w-full h-full bg-background grid grid-cols-1 md:grid-cols-10 overflow-hidden relative">



                        {/* LEFT PANEL: Text Content Layers */}

                        <div className="relative md:col-span-4 h-full flex flex-col justify-end p-8 lg:p-12 z-10">

                            <div className="relative w-full h-[80%] overflow-hidden">

                                {features.map((f, i) => {

                                    const Icon = f.icon;



                                    const start = i / features.length;

                                    const end = (i + 1) / features.length;



                                    // High-density snapping thresholds:

                                    // Items now hold position between 25% and 75% of their scrolling phase

                                    const enterEnd = start + (end - start) * 0.25;

                                    const exitStart = start + (end - start) * 0.75;



                                    const y = useTransform(

                                        scrollYProgress,

                                        [start, enterEnd, exitStart, end],

                                        ["100%", "0%", "0%", "-100%"]

                                    );

                                    return (

                                        <motion.div

                                            key={`text-${f.title}`}

                                            style={{ y }}

                                            className="absolute inset-0 flex flex-col justify-center space-y-6 text-left p-2"

                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-md bg-muted border border-border flex items-center justify-center text-primary shadow-sm">

                                                    <Icon size={20} />

                                                </div>

                                                {f.badge && (

                                                    <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-inner font-sans", f.badgeColor)}>

                                                        {f.badge}

                                                    </span>

                                                )}

                                            </div>



                                            <div className="space-y-3">

                                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight font-sans text-foreground">

                                                    {f.title}

                                                </h2>

                                                <div className="w-full h-px bg-border" />

                                                <p className="text-sm text-foreground-muted leading-relaxed font-medium font-sans">

                                                    {f.desc}

                                                </p>

                                            </div>



                                            <div className="pt-2 flex flex-wrap gap-y-2 gap-x-4">

                                                {f.highlights.map((h) => (

                                                    <span key={h} className="flex items-center gap-1.5 text-xs font-semibold text-foreground-muted font-sans">

                                                        <CheckCircle size={14} className="text-success flex-shrink-0" /> {h}

                                                    </span>

                                                ))}

                                            </div>



                                            <div className="pt-2">

                                                <Link

                                                    href={f.href}

                                                    className="inline-flex items-center gap-2 text-sm font-bold text-text-link hover:text-text-link-hover transition-colors group font-sans"

                                                >

                                                    Explore Feature <ArrowRight size={15} className="stroke-[2.5] group-hover:translate-x-1 transition-transform" />

                                                </Link>

                                            </div>

                                        </motion.div>

                                    );

                                })}

                            </div>

                        </div>



                        {/* RIGHT PANEL: Media Image Assets Layers */}

                        <div className="hidden md:block md:col-span-6 relative h-full w-full overflow-hidden bg-muted/20">

                            {features.map((f, i) => {

                                const start = i / features.length;

                                const end = (i + 1) / features.length;



                                const enterEnd = start + (end - start) * 0.25;

                                const exitStart = start + (end - start) * 0.75;



                                // Sync identical locking map array over to the graphic views

                                const y = useTransform(

                                    scrollYProgress,

                                    [start, enterEnd, exitStart, end],

                                    ["100%", "0%", "0%", "-100%"]

                                );





                                return (

                                    <motion.div

                                        key={`image-${f.title}`}

                                        style={{ y }}

                                        className="absolute inset-0 w-full h-full p-10 flex items-center justify-center"

                                    >

                                        <div className="relative w-full h-full rounded-lg overflow-hidden border border-border bg-card p-6 flex items-center justify-center shadow-md">

                                            <img

                                                src={f.imgSrc}

                                                alt={`${f.title} Interface Render`}

                                                className="w-full h-full object-cover rounded-md shadow-sm"

                                                loading="eager"

                                            />

                                        </div>

                                    </motion.div>

                                );

                            })}

                        </div>



                    </div>

                </div>



            </div>

        </div>

    );

}