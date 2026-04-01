import HeroSection from "./_components/HeroSection";
import TrustStripSection from "./_components/TrustStripSection";
import CoreMissionSection from "./_components/CoreMissionSection";
import FeaturesSection from "./_components/FeaturesSection";
import SecuritySection from "./_components/SecuritySection";
import HowItWorksSection from "./_components/HowItWorksSection";
import TestimonialsSection from "./_components/TestimonialsSection";
import LandingFAQSection from "./_components/LandingFAQSection";
import CTAPanelSection from "./_components/CTAPanelSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustStripSection />
      <CoreMissionSection />
      <FeaturesSection />
      <SecuritySection />
      <HowItWorksSection />
      <TestimonialsSection />
      <LandingFAQSection />
      <CTAPanelSection />
    </main>
  );
}
