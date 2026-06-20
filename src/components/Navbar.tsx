'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Menu, X, ChevronDown, LayoutDashboard,
    Smartphone, LogOut, User, Settings, BookOpen,
    Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarOpen, setAvatarOpen] = useState(false);
    const { toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        setAvatarOpen(false);
        setIsOpen(false);
        await logout();
        router.replace('/auth');
    };

    const initials = user?.name
        ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : (user?.phone ?? '?').slice(-2);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-navbar/80 backdrop-blur-xl border-b border-border">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex items-center justify-between h-16">

                    {/* ─── Logo ─── */}
                    <Link href="/" className="shrink-0">
                        <img
                            src="/logo-nobg.png"
                            alt="Neetell Logo"
                            className="h-35 w-auto"
                        />
                    </Link>

                    {/* ─── Desktop Nav Links ─── */}
                    <div className="hidden lg:flex items-center gap-1">

                        {/* Explore */}
                        {/* <DropdownMenu label="Explore">
                            <DropItem href="/explore/institutes">Institutes</DropItem>
                            <DropItem href="/explore/colleges">Colleges</DropItem>
                        </DropdownMenu> */}

                        {/* Counselling */}
                        <DropdownMenu label="Counselling">
                            <DropItem href="/dashboard">NEET UG</DropItem>
                            {/* <DropItem href="/counselling/neet-pg">NEET PG</DropItem>
                            <DropItem href="/counselling/inicet">INICET</DropItem> */}
                        </DropdownMenu>

                        <button
                            onClick={() => {
                                const el = document.getElementById('pricing');
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                            Pricing
                        </button>
                        <NavLink href="/news">Blogs & News</NavLink>

                        {/* Dashboard — only when logged in */}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                        )}

                    </div>

                    {/* ─── Right Section ─── */}
                    <div className="hidden lg:flex items-center gap-2">

                        <ThemeToggle showLabel={false} height={30} width={30} />

                        {user ? (
                            /* ── Avatar + Dropdown ── */
                            <div className="relative">
                                <button
                                    onClick={() => setAvatarOpen(v => !v)}
                                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-border hover:border-primary bg-muted/40 hover:bg-muted transition-all"
                                >
                                    <Avatar initials={initials} />
                                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                                        {(user.name ?? user.phone ?? '').split(' ')[0]}
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {avatarOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 6 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-56 bg-dropdown border border-border rounded-xl shadow-lg overflow-hidden"
                                        >
                                            {/* User info */}
                                            <div className="px-4 py-3 border-b border-border">
                                                <p className="text-sm font-semibold text-foreground">{user.name ?? '—'}</p>
                                                <p className="text-xs text-muted-foreground truncate">{user.email ?? user.phone}</p>
                                            </div>

                                            {/* Nav Items */}
                                            <DropItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>
                                                Dashboard
                                            </DropItem>
                                            <DropItem href="/dashboard/profile" icon={<User className="w-4 h-4" />}>
                                                Profile
                                            </DropItem>

                                            {/* 🔥 Get App CTA */}
                                            <div className="px-3 py-2">
                                                <a
                                                    href="/download" // change to your app link (Play Store / APK / landing page)
                                                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Get App
                                                </a>
                                            </div>

                                            {/* Logout */}
                                            <div className="border-t border-border">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-red-500 hover:bg-dropdown-hover transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Log out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            /* ── Logged-out CTAs ── */
                            <>
                                <Link
                                    href="/auth"
                                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary border border-border rounded-full hover:border-primary transition-all"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/app"
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary-hover transition-all shadow-sm"
                                >
                                    <Smartphone className="w-4 h-4" />
                                    Get App
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ─── Mobile Icons ─── */}
                    <div className="lg:hidden flex items-center gap-1">
                        {/* Dashboard icon — only when logged in */}
                        {user && (
                            <Link
                                href="/dashboard"
                                className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                            </Link>
                        )}
                        {/* Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-foreground"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                </div>
            </div>

            {/* ─── Mobile Menu ─── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-navbar border-t border-border overflow-hidden"
                    >
                        <div className="px-4 py-5 space-y-1">

                            <MobileLink href="/explore/institutes">Institutes</MobileLink>
                            <MobileLink href="/explore/colleges">Colleges</MobileLink>
                            <MobileLink href="/counselling/neet-ug">NEET UG</MobileLink>
                            <MobileLink href="/counselling/neet-pg">NEET PG</MobileLink>
                            <MobileLink href="/counselling/inicet">INICET</MobileLink>
                            <MobileLink href="/pricing">Pricing</MobileLink>
                            <MobileLink href="/news">Blogs & News</MobileLink>

                            {user && (
                                <MobileLink href="/dashboard">
                                    <LayoutDashboard className="w-4 h-4 inline mr-1.5" />
                                    Dashboard
                                </MobileLink>
                            )}

                            <div className="pt-4 flex items-center gap-2 border-t border-border">
                                <button onClick={toggleTheme} className="p-2 bg-muted rounded-lg shrink-0">
                                    <ThemeToggle showLabel={false} height={20} width={20} />
                                </button>

                                {user ? (
                                    <>
                                        <div className="flex items-center gap-2 flex-1">
                                            <Avatar initials={initials} size="sm" />
                                            <span className="text-sm font-medium truncate">{user.name ?? user.phone}</span>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-1 px-3 py-2 text-sm text-red-500 border border-red-200 rounded-full"
                                        >
                                            <LogOut className="w-3.5 h-3.5" />
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth" className="flex-1 text-center border border-border rounded-full py-2 text-sm font-medium">
                                            Login
                                        </Link>
                                        <Link href="/app" className="flex-1 flex justify-center items-center gap-1.5 bg-primary text-primary-foreground rounded-full py-2 text-sm font-semibold">
                                            <Smartphone className="w-4 h-4" />
                                            Get App
                                        </Link>
                                    </>
                                )}
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors">
            {children}
        </Link>
    );
}

function DropdownMenu({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-muted transition-colors">
                {label}
                <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-dropdown border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
                {children}
            </div>
        </div>
    );
}

function DropItem({ href, icon, children }: { href: string; icon?: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link href={href} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-dropdown-hover transition-colors">
            {icon && <span className="text-muted-foreground">{icon}</span>}
            {children}
        </Link>
    );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            {children}
        </Link>
    );
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
    const sz = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm';
    return (
        <div className={`${sz} rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0`}>
            {initials}
        </div>
    );
}