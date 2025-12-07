'use client';

import {
  MessageSquare,
  Sparkles,
  FileCheck,
  TrendingUp,
  Calculator,
  BookOpen,
  Users,
  GraduationCap,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'AI Export Assistant',
    punchline: '24/7 export expert, always ready to help.',
    description: 'Ask anything about export documentation, certifications, regulations, or pricing. Get accurate answers instantly.',
    color: '#0284C7',
    shadowColor: '#065985',
  },
  {
    icon: Sparkles,
    title: 'Smart Product Enrichment',
    punchline: 'From local product to export-ready in 60 seconds.',
    description: 'Auto-generate HS codes, international SKUs, English B2B descriptions, and marketing highlights with AI.',
    color: '#F59E0B',
    shadowColor: '#d97706',
  },
  {
    icon: FileCheck,
    title: 'Export Compliance Analysis',
    punchline: 'Know before you ship.',
    description: 'Analyze your product\'s export readiness for any destination country. Get compliance scores and next-step recommendations.',
    color: '#22C55E',
    shadowColor: '#16a34a',
  },
  {
    icon: TrendingUp,
    title: 'Market Intelligence',
    punchline: 'Find the best markets, backed by data.',
    description: 'Discover which countries offer the highest potential for your products with AI-powered market analysis.',
    color: '#8B5CF6',
    shadowColor: '#7c3aed',
  },
  {
    icon: Calculator,
    title: 'Dynamic Pricing Calculator',
    punchline: 'Price with confidence, profit with clarity.',
    description: 'Calculate EXW, FOB, and CIF pricing with real-time exchange rates. Understand your margins and quote with precision.',
    color: '#EC4899',
    shadowColor: '#db2777',
  },
  {
    icon: BookOpen,
    title: 'Digital Catalog',
    punchline: 'Your products, professionally presented.',
    description: 'Create professional export catalogs with AI-generated descriptions, technical specs, and product safety information.',
    color: '#06B6D4',
    shadowColor: '#0891b2',
  },
  {
    icon: Users,
    title: 'Buyer & Forwarder Network',
    punchline: 'The right connections, curated for you.',
    description: 'Access verified international buyers and trusted freight forwarders with transparent ratings and reviews.',
    color: '#EF4444',
    shadowColor: '#dc2626',
  },
  {
    icon: GraduationCap,
    title: 'Export Learning Hub',
    punchline: 'Knowledge that accelerates growth.',
    description: 'Comprehensive educational materials on export documentation, certifications, regulations, and best practices.',
    color: '#14B8A6',
    shadowColor: '#0d9488',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#F59E0B]/10 text-[#F59E0B] px-4 py-2 rounded-full text-sm font-bold mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#0C4A6E] mb-6">
            Everything You Need to Export
          </h2>
          <p className="text-xl text-[#64748b] max-w-2xl mx-auto">
            Powerful tools designed to simplify every step of your export journey, from product preparation to global sales.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white p-6 rounded-3xl border-2 border-[#e0f2fe] shadow-[0_4px_0_0_#e0f2fe]
                           hover:shadow-[0_6px_0_0_#bae6fd] hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: feature.color,
                    boxShadow: `0 4px 0 0 ${feature.shadowColor}`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#0C4A6E] mb-2">{feature.title}</h3>
                <p className="text-sm font-semibold text-[#0284C7] mb-3">{feature.punchline}</p>
                <p className="text-sm text-[#64748b] leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
