'use client';

import { Rocket, Play, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0C4A6E] via-[#0369a1] to-[#0284C7]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#F59E0B] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7DD3FC] rounded-full blur-3xl" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 animate-bounce hidden md:block">
        <div className="w-16 h-16 bg-[#F59E0B] rounded-2xl flex items-center justify-center shadow-lg rotate-12">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-20 animate-pulse hidden md:block">
        <div className="w-12 h-12 bg-[#22C55E] rounded-xl flex items-center justify-center shadow-lg -rotate-12">
          <Rocket className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-white/90 text-sm font-medium">AI-Powered Export Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Export Smarter.
          <br />
          <span className="text-[#7DD3FC]">Grow Global.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-4 leading-relaxed">
          The AI-powered platform transforming Indonesian SMEs into world-class exporters.
          From compliance to connections, everything you need to go global, in one place.
        </p>

        {/* Tagline */}
        <p className="text-lg text-[#F59E0B] font-semibold mb-10">
          &quot;Your export journey, simplified by AI.&quot;
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="group flex items-center gap-2 bg-white text-[#0C4A6E] px-8 py-4 rounded-2xl font-bold text-lg
                       shadow-[0_6px_0_0_#e0f2fe] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#e0f2fe]
                       active:translate-y-0 active:shadow-[0_4px_0_0_#e0f2fe] transition-all"
          >
            Start Exporting Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg
                       hover:bg-white/20 hover:border-white/50 transition-all"
          >
            <Play className="w-5 h-5" />
            See How It Works
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">50+</p>
            <p className="text-white/60 text-sm mt-1">Countries Supported</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">10K+</p>
            <p className="text-white/60 text-sm mt-1">Products Processed</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-white">98%</p>
            <p className="text-white/60 text-sm mt-1">HS Code Accuracy</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
