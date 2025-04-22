import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ShoppingBag, Briefcase } from "lucide-react"

export default function UseCaseSection() {
  const templates = [
    {
      title: "Real Estate",
      description: "Create AI agents that handle property inquiries, schedule viewings, and qualify leads 24/7.",
      icon: <Building2 className="h-12 w-12 text-violet-600" />,
      features: ["Lead qualification", "Property matching", "Viewing scheduling"],
    },
    {
      title: "E-commerce",
      description: "Build shopping assistants that help customers find products, answer questions, and increase sales.",
      icon: <ShoppingBag className="h-12 w-12 text-violet-600" />,
      features: ["Product recommendations", "Order tracking", "Customer support"],
    },
    {
      title: "Freelance",
      description: "Deploy AI agents that handle client inquiries, project scoping, and appointment booking.",
      icon: <Briefcase className="h-12 w-12 text-violet-600" />,
      features: ["Client onboarding", "Project scoping", "Scheduling"],
    },
  ]

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {templates.map((template, index) => (
            <Card key={index} className="flex flex-col h-full">
              <CardHeader>
                <div className="mb-4">{template.icon}</div>
                <CardTitle className="text-xl">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {template.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-violet-600"></div>
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
      </div>
    </section>
  )
}
