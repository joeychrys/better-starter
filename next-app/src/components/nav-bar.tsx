import { headers } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import AvatarDropdown from "@/components/avatar-dropdown"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { Session } from "@/lib/types"

export default async function NavBar() {
  const session: Session | null = await auth.api
    .getSession({
      headers: await headers(),
    })
    .catch((e) => {
      console.error(e)
      return null
    })

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-6 px-4 sm:px-6">
        {/* Mobile menu */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {session ? (
            <Suspense
              fallback={
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              }
            >
              <AvatarDropdown session={JSON.parse(JSON.stringify(session))} />
            </Suspense>
          ) : (
            <Button size="sm">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
      <Separator />
    </header>
  )
}
