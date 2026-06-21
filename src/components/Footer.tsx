"use client";

import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-sidebar-bg text-foreground-muted relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-text-primary) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Link href="/" className="shrink-0">
                <img
                  src="/logo-nobg.png"
                  alt="Neetell Logo"
                  className="h-35 w-auto"
                />
              </Link>
            </div>
            <p className="text-foreground-muted mb-6 leading-relaxed">
              Your trusted partner for NEET counselling guidance. Helping thousands of students achieve their dream of becoming doctors.
            </p>
            {/* <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-card hover:bg-primary flex items-center justify-center transition-all duration-300 hover:text-primary-foreground text-foreground-muted"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div> */}
          </div>

          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'FAQ', href: '/#faq' },
                { label: 'Blog', href: '/news' },
                { label: 'Author', href: '/authors/neetell' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">Counselling</h3>
            <ul className="space-y-3">
              {[
                { label: 'NEET UG', href: '/dashboard' },
                { label: 'College Predictor', href: '/dashboard/predictor' },
                { label: 'Medical Colleges', href: '/dashboard/colleges' },
                { label: 'Compare Colleges', href: '/dashboard/compare' },
                { label: 'Choice Filling', href: '/dashboard/choices' },
                { label: 'State Counselling', href: '/dashboard/counselling' },
              ].map((service) => (
                <li key={service.label}>
                  <Link href={service.href} className="hover:text-primary transition-colors">
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground-muted">123 Medical Street, New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground-muted">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground-muted">support@neetel.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground-muted">
              © 2026 NeeTell. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-foreground-muted hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-foreground-muted hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/authors/neetell" className="text-foreground-muted hover:text-primary transition-colors">
                Authors
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
