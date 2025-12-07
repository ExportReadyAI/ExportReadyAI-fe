'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rocket, Sparkles, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#e0f2fe]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0284C7] rounded-xl flex items-center justify-center shadow-[0_3px_0_0_#065985]">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-[#0C4A6E]">ExportReadyAI</h1>
              <div className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#F59E0B]" />
                <span className="text-[10px] text-[#F59E0B] font-bold">AI Powered</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#64748b] font-medium hover:text-[#0284C7] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[#0284C7] font-bold hover:bg-[#F0F9FF] rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#0284C7] text-white font-bold rounded-xl
                         shadow-[0_3px_0_0_#065985] hover:-translate-y-0.5 hover:shadow-[0_4px_0_0_#065985]
                         active:translate-y-0 active:shadow-[0_2px_0_0_#065985] transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[#F0F9FF] transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#0C4A6E]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0C4A6E]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#e0f2fe]">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-[#64748b] font-medium hover:bg-[#F0F9FF] rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-3 text-center text-[#0284C7] font-bold hover:bg-[#F0F9FF] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-3 text-center bg-[#0284C7] text-white font-bold rounded-xl
                             shadow-[0_3px_0_0_#065985]"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
