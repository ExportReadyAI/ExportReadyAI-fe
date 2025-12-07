'use client';

import {
  Navbar,
  HeroSection,
  AboutSection,
  FeaturesSection,
  PainPointsSection,
  UseCasesSection,
  VisionSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <section id="about">
        <AboutSection />
      </section>

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>

      {/* Pain Points & Solutions */}
      <PainPointsSection />

      {/* Use Cases */}
      <section id="use-cases">
        <UseCasesSection />
      </section>

      {/* Vision & Mission */}
      <VisionSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
