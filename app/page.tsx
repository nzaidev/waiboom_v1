import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import DemoSection from "@/components/demo-section"
import TemplateCarouselWrapper from "@/components/template-carousel-wrapper"
import PricingCta from "@/components/pricing-cta"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DemoSection />
        <TemplateCarouselWrapper />
        <PricingCta />
      </main>
      <Footer />
    </div>
  )
}
