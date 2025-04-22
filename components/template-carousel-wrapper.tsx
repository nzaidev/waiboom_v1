"use client"

import dynamic from "next/dynamic"
import UseCaseSectionFallback from "@/components/use-case-section-fallback"

// Dynamically import the carousel component with no SSR to avoid hydration issues
const UseCaseSection = dynamic(() => import("@/components/use-case-section"), {
  ssr: false,
  loading: () => <UseCaseSectionFallback />,
})

export default function TemplateCarouselWrapper() {
  return <UseCaseSection />
}
