'use client';

import { Target, Rocket, Globe } from 'lucide-react';

export default function VisionSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0C4A6E] via-[#0369a1] to-[#0284C7] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#F59E0B] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Vision */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Target className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-white/90 text-sm font-medium">Our Vision</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              Indonesian Products Belong on Shelves Around the World
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              We believe Indonesian products deserve global recognition. Not because of pity or government programs,
              but because they genuinely compete and win on quality, uniqueness, and value.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              ExportReadyAI exists to remove every barrier between great Indonesian products and their global customers.
              We&apos;re building the infrastructure for a new era of Indonesian trade, where a furniture maker in Jepara,
              a coffee roaster in Toraja, or a skincare producer in Bali can access the same export intelligence
              and global reach as multinational corporations.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B] rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-bold">Our Mission</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Empower 100,000 Indonesian SMEs to Become Successful Exporters by 2030
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-[#7DD3FC]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Creating Jobs</p>
                  <p className="text-white/60 text-sm">Export success drives local employment</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Generating Foreign Exchange</p>
                  <p className="text-white/60 text-sm">Strengthening Indonesian economy</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Proving World-Class Quality</p>
                  <p className="text-white/60 text-sm">Great products can come from anywhere</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-[#7DD3FC] font-semibold text-lg italic">
                &quot;The future of Indonesian exports is intelligent, connected, and unstoppable. We&apos;re here to build it.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
