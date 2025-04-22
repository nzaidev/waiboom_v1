import ChatDemo from "@/components/chat-demo"

export default function DemoSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-violet-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">See Waiboom in Action</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Experience how our AI agents handle real-world scenarios with human-like understanding and precision.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-4xl mt-12">
          <ChatDemo />
        </div>
      </div>
    </section>
  )
}
