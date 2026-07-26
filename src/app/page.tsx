'use client';

import React, { useState } from 'react';
import { FunnelModals } from '@/components/funnel/FunnelModals';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesGrid } from '@/components/landing/FeaturesGrid';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { HowItWorksFlow } from '@/components/landing/HowItWorksFlow';
import { DashboardPreviewSection } from '@/components/landing/DashboardPreviewSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { SecuritySection } from '@/components/landing/SecuritySection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<
    'DEMO' | 'CREATE_ORG' | 'CONSULTATION' | 'WATCH_DEMO' | 'CONTACT_SALES' | null
  >(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header Navigation */}
      <LandingHeader onOpenModal={setActiveModal} />

      {/* Hero Section */}
      <HeroSection onOpenModal={setActiveModal} />

      {/* Features Showcase Grid */}
      <FeaturesGrid />

      {/* Benefits & Impact Section */}
      <BenefitsSection />

      {/* Conversion & Activation Flow */}
      <HowItWorksFlow />

      {/* Interactive UI Preview */}
      <DashboardPreviewSection />

      {/* Testimonials & Success Metrics */}
      <TestimonialsSection />

      {/* Security & Compliance */}
      <SecuritySection />

      {/* Final Call to Action */}
      <CTASection onOpenModal={setActiveModal} />

      {/* Footer */}
      <LandingFooter />

      {/* Interactive Modal Engine */}
      <FunnelModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
