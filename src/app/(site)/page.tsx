"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TemplatesSection } from "@/components/sections/templates-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TemplatesSection />
      <CTASection />
    </div>
  );
}
