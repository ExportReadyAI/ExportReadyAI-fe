'use client';

import { Globe, Zap, Shield } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#F0F9FF] text-[#0284C7] px-4 py-2 rounded-full text-sm font-bold mb-4">
            About the Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0C4A6E] mb-6">
            The Future of Indonesian Exports
          </h2>
        </div>

        {/* Description */}
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-[#475569] leading-relaxed mb-16">
          <p>
            <strong className="text-[#0C4A6E]">ExportReadyAI</strong> is Indonesia&apos;s first AI-powered export platform,
            built specifically for small and medium enterprises ready to compete on the world stage. We combine intelligent
            automation with deep export expertise to eliminate the complexity that holds back international growth.
          </p>
          <p>
            From generating HS codes and SKUs in seconds to analyzing market opportunities across 50+ countries,
            our platform handles the heavy lifting so you can focus on what you do best: creating amazing products.
            Every feature is designed with one goal: making export accessible, profitable, and scalable for Indonesian businesses.
          </p>
          <p>
            Whether you&apos;re shipping your first container or expanding into new markets, ExportReadyAI provides
            the intelligence, tools, and connections you need to succeed. Join a new generation of Indonesian exporters
            who are rewriting the rules of global trade.
          </p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-[#F0F9FF] to-white p-8 rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
            <div className="w-14 h-14 bg-[#0284C7] rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_0_0_#065985]">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">AI-Powered Intelligence</h3>
            <p className="text-[#64748b]">
              Not just another chatbot. Purpose-built AI trained on Indonesian export regulations and global trade practices.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#F0F9FF] to-white p-8 rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
            <div className="w-14 h-14 bg-[#22C55E] rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_0_0_#16a34a]">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">Built for Indonesian SMEs</h3>
            <p className="text-[#64748b]">
              Designed around local challenges, local products, and the unique realities of Indonesian business.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#F0F9FF] to-white p-8 rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]">
            <div className="w-14 h-14 bg-[#F59E0B] rounded-2xl flex items-center justify-center mb-6 shadow-[0_4px_0_0_#d97706]">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">Accuracy You Can Trust</h3>
            <p className="text-[#64748b]">
              HS code recommendations verified against official databases, not AI guesses. Export with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
