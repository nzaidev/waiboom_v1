import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Build AI Agents That{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-transparent bg-clip-text">
                  Work For You
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Create, deploy, and scale AI agents that handle customer inquiries, automate tasks, and drive business
                growth.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex -space-x-2">
                <Image
                  src="/mystical-forest-spirit.png"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
                <Image
                  src="/mystical-forest-spirit.png"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
                <Image
                  src="/mystical-forest-spirit.png"
                  alt="User avatar"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-background"
                />
              </div>
              <div className="text-muted-foreground">
                <span className="font-medium">2,000+</span> businesses already using Waiboom
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-2">
              <Image
                src="/ai-agent-dashboard-chat.png"
                alt="Waiboom AI Platform"
                width={600}
                height={600}
                className="rounded-md object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
