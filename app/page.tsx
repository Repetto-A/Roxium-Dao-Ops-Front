// app/page.tsx
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle, oklch(0.556 0 0 / 0.35) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
