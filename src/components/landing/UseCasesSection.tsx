'use client';

import { Rocket, TrendingUp, Palette, UtensilsCrossed, Briefcase } from 'lucide-react';

const useCases = [
  {
    icon: Rocket,
    title: 'First-Time Exporters',
    description: "You have an amazing product, but export feels like a foreign language. ExportReadyAI guides you step-by-step, from documentation basics to landing your first international order.",
    testimonial: '"We shipped our first container to Singapore within 3 months of joining."',
    color: '#0284C7',
    bgColor: '#F0F9FF',
    borderColor: '#bae6fd',
  },
  {
    icon: TrendingUp,
    title: 'Experienced SME Exporters',
    description: "You're already exporting, but scaling feels heavy. Automate repetitive work, expand into new markets confidently, and manage everything from one dashboard.",
    testimonial: '"What used to take 2 days now takes 2 hours."',
    color: '#22C55E',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  {
    icon: Palette,
    title: 'Craft & Artisan Producers',
    description: 'Your handmade products deserve a global audience. We help you position, price, and present your crafts to buyers who value authenticity and quality.',
    testimonial: '"Buyers from Japan and Germany found us through the ExportReadyAI catalog."',
    color: '#8B5CF6',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
  },
  {
    icon: UtensilsCrossed,
    title: 'Food & Beverage Producers',
    description: 'Navigate complex food safety certifications, halal requirements, and ingredient regulations. Export with compliance, not anxiety.',
    testimonial: '"The compliance analysis saved us from a major labeling issue before shipment."',
    color: '#F59E0B',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  {
    icon: Briefcase,
    title: 'Export Managers & Consultants',
    description: 'Serve more clients with less effort. Use our AI tools to accelerate research, standardize processes, and deliver better outcomes.',
    testimonial: '"I can now support 3x more SME clients with the same team."',
    color: '#EC4899',
    bgColor: '#fdf2f8',
    borderColor: '#fbcfe8',
  },
];

export default function UseCasesSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#8B5CF6]/10 text-[#8B5CF6] px-4 py-2 rounded-full text-sm font-bold mb-4">
            Who It&apos;s For
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0C4A6E] mb-6">
            Built for Every Exporter
          </h2>
          <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
            Whether you&apos;re just starting or already scaling globally, ExportReadyAI adapts to your journey.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]
                           hover:shadow-[0_6px_0_0_#bae6fd] hover:-translate-y-1 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: useCase.bgColor, border: `2px solid ${useCase.borderColor}` }}
                >
                  <Icon className="w-7 h-7" style={{ color: useCase.color }} />
                </div>
                <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">{useCase.title}</h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">{useCase.description}</p>
                <div
                  className="p-4 rounded-2xl italic text-sm font-medium"
                  style={{ backgroundColor: useCase.bgColor, color: useCase.color }}
                >
                  {useCase.testimonial}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
