"use client";

import { Mail, Phone, MapPin } from 'lucide-react';

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
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Neetel
              </span>
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
              {['About Us', 'Features', 'Pricing', 'Success Stories', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-bold text-lg mb-6">Counselling</h3>
            <ul className="space-y-3">
              {['NEET UG', 'NEET PG', 'NEET MDS', 'INICET', 'AIAPGET', 'State Counselling'].map((service) => (
                <li key={service}>
                  <a href="#" className="hover:text-primary transition-colors">
                    {service}
                  </a>
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
              © 2026 Neetel. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-foreground-muted hover:text-primary transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}