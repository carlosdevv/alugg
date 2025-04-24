import Footer from "@/components/footer";
import Nav from "@/components/nav";
import HeroSection from "./components/hero-section";
import PricingSection from "./components/pricing-section";
import SolutionsSection from "./components/solutions-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen mx-auto max-w-[1120px] flex-col">
      <Nav />
      <HeroSection />

      <main className="flex-grow">
        <SolutionsSection />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
