import { Button } from "@/components/ui/button"

export default function PricingCta() {
  return (
    <section id="pricing" className="py-16 bg-gradient-to-b from-violet-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join thousands of businesses already using Waiboom to automate customer interactions and grow their
              revenue.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
            <Button size="lg" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              View Pricing
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            No credit card required. Free plan includes 100 AI interactions per month.
          </p>
        </div>
      </div>
    </section>
  )
}
