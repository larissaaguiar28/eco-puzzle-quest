import React from "react";
import { QuizProvider } from "@/contexts/QuizContext";
import { AppSidebar } from "@/components/AppSidebar";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { PuzzlePanel } from "@/components/PuzzlePanel";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScarcitySection } from "@/components/sections/ScarcitySection";
import { ClimateSection } from "@/components/sections/ClimateSection";
import { CTASection } from "@/components/sections/CTASection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { ContradictionsSection } from "@/components/sections/ContradictionsSection";
import { FAQSection } from "@/components/sections/FAQSection";

const Index = () => {
  return (
    <QuizProvider>
      <div className="flex w-full">
        <AppSidebar />
        <main className="ml-14 flex-1 w-full">
          <HeroSection />
          <ScarcitySection />
          <ClimateSection />
          <CTASection />
          <TimelineSection />
          <ContradictionsSection />
          <FAQSection />

          {/* Footer */}
          <footer className="bg-primary py-8 text-center text-primary-foreground">
            <p className="text-sm opacity-80">
              © 2026 EcoVida — Plataforma de Sustentabilidade. Todos os direitos reservados.
            </p>
          </footer>
        </main>
        <AccessibilityMenu />
        <PuzzlePanel />
      </div>
    </QuizProvider>
  );
};

export default Index;
