'use client';

import { XCircle, CheckCircle, ArrowRight } from 'lucide-react';

const painPoints = [
  "I don't know where to start with export documentation.",
  "Finding the right HS code takes hours of research.",
  "I'm not sure if my product can legally enter certain countries.",
  "Pricing for international buyers feels like guesswork.",
  "I can't find reliable buyers or trustworthy forwarders.",
  "Everything is manual, fragmented, and inefficient.",
];

const solutions = [
  { title: "AI that understands exports", desc: "Purpose-built intelligence trained on Indonesian export regulations and global trade practices." },
  { title: "All-in-one platform", desc: "Products, compliance, pricing, catalogs, buyers, forwarders, and learning. Seamlessly connected." },
  { title: "Built for Indonesian SMEs", desc: "Designed around local challenges, local products, and Indonesian business realities." },
  { title: "Accuracy you can trust", desc: "HS code recommendations verified against official databases, not AI guesses." },
  { title: "From knowledge to action", desc: "Every insight comes with clear next steps, not just information." },
  { title: "Scale without complexity", desc: "Enterprise-grade capabilities with startup simplicity." },
];

export default function PainPointsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Pain Points */}
          <div>
            <span className="inline-block bg-[#fef2f2] text-[#EF4444] px-4 py-2 rounded-full text-sm font-bold mb-4">
              The Challenge
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] mb-8">
              Exporting Shouldn&apos;t Be This Hard
            </h2>
            <div className="space-y-4">
              {painPoints.map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#fef2f2] rounded-2xl border-2 border-[#fecaca]"
                >
                  <XCircle className="w-6 h-6 text-[#EF4444] flex-shrink-0 mt-0.5" />
                  <p className="text-[#0C4A6E] font-medium">&quot;{point}&quot;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <span className="inline-block bg-[#f0fdf4] text-[#22C55E] px-4 py-2 rounded-full text-sm font-bold mb-4">
              Our Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0C4A6E] mb-8">
              Why ExportReadyAI Is Different
            </h2>
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#f0fdf4] rounded-2xl border-2 border-[#bbf7d0]"
                >
                  <CheckCircle className="w-6 h-6 text-[#22C55E] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#0C4A6E]">{solution.title}</p>
                    <p className="text-sm text-[#64748b] mt-1">{solution.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-[#0284C7] text-white px-8 py-4 rounded-2xl font-bold text-lg
                       shadow-[0_6px_0_0_#065985] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#065985]
                       active:translate-y-0 active:shadow-[0_4px_0_0_#065985] transition-all"
          >
            Experience the Difference
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
