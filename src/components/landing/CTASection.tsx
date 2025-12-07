'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-gradient-to-br from-[#F0F9FF] to-[#e0f2fe] rounded-3xl p-12 border-2 border-[#bae6fd] shadow-[0_8px_0_0_#7dd3fc]">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B] rounded-full px-4 py-2 mb-6 shadow-[0_3px_0_0_#d97706]">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold">Start Free Today</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] mb-4">
            Ready to Go Global?
          </h2>
          <p className="text-lg text-[#64748b] mb-8 max-w-2xl mx-auto">
            Join thousands of Indonesian SMEs who are already using ExportReadyAI to simplify their export journey.
            No credit card required. Start for free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-[#0284C7] text-white px-8 py-4 rounded-2xl font-bold text-lg
                         shadow-[0_6px_0_0_#065985] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#065985]
                         active:translate-y-0 active:shadow-[0_4px_0_0_#065985] transition-all"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white text-[#0284C7] px-8 py-4 rounded-2xl font-bold text-lg
                         border-2 border-[#0284C7] hover:bg-[#F0F9FF] transition-all"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-6 text-sm text-[#94a3b8]">
            Free plan includes: AI Assistant • Product Enrichment • Export Analysis • And more
          </p>
        </div>
      </div>
    </section>
  );
}
