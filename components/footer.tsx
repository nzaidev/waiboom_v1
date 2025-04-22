import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2024 Waiboom. All rights reserved.
        </p>
        <nav className="flex items-center space-x-4 text-sm font-medium">
          <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
