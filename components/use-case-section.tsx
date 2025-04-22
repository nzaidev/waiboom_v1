"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ShoppingBag, Briefcase, BarChart3, Shield } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function UseCaseSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const templates = [
    {
      title: "Real Estate",
      description: "Create AI agents that handle property inquiries, schedule viewings, and qualify leads 24/7.",
      icon: <Building2 className="h-12 w-12 text-blue-600" />,
      features: ["Lead qualification", "Property matching", "Viewing scheduling"],
    },
    {
      title: "E-commerce",
      description: "Build shopping assistants that help customers find products, answer questions, and increase sales.",
      icon: <ShoppingBag className="h-12 w-12 text-blue-600" />,
      features: ["Product recommendations", "Order tracking", "Customer support"],
    },
    {
      title: "Freelance",
      description: "Deploy AI agents that handle client inquiries, project scoping, and appointment booking.",
      icon: <Briefcase className="h-12 w-12 text-blue-600" />,
      features: ["Client onboarding", "Project scoping", "Scheduling"],
    },
    {
      title: "Marketing & SEO",
      description: "Implement AI agents that analyze trends, optimize content, and boost your online visibility.",
      icon: <BarChart3 className="h-12 w-12 text-blue-600" />,
      features: ["Content optimization", "Keyword research", "Performance analytics"],
    },
    {
      title: "Cyber Security",
      description: "Deploy AI agents that monitor threats, detect vulnerabilities, and protect your digital assets.",
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      features: ["Threat detection", "Vulnerability scanning", "Security alerts"],
    },
  ]

  const visibleTemplates = () => {
    // For mobile: show 1, tablet: show 2, desktop: show 3
    const isMobile = window.innerWidth < 768
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024

    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3
    const totalItems = templates.length

    const items = []
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % totalItems
      items.push(templates[index])
    }

    return { items, itemsToShow }
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % templates.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + templates.length) % templates.length)
  }

  // Auto-rotate carousel
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, isPaused])

  // Pause rotation when hovering
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <section id="templates" className="py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready-to-Use Templates</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get started quickly with industry-specific templates designed for your business needs.
            </p>
          </div>
        </div>

        <div
          className="relative mt-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={carouselRef}
        >
          {/* Left Navigation Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/30 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous template"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Templates Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
            {typeof window !== "undefined" &&
              visibleTemplates().items.map((template, index) => (
                <Card key={`${template.title}-${index}`} className="flex flex-col h-full transition-all duration-300">
                  <CardHeader>
                    <div className="mb-4">{template.icon}</div>
                    <CardTitle className="text-xl">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {template.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="mr-2 h-2 w-2 rounded-full bg-blue-600"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View Template
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/20 hover:bg-black/30 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
            aria-label="Next template"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-blue-600 w-4" : "bg-gray-300"
                }`}
                aria-label={`Go to template ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
