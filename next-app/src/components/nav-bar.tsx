import { Lock } from 'lucide-react';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

import AvatarDropdown from '@/components/avatar-dropdown';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { Session } from '@/lib/types';

export default async function NavBar() {
  const session: Session | null = await auth.api
    .getSession({
      headers: await headers(),
    })
    .catch((e) => {
      console.error(e);
      return null;
    });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between p-4">
        <div className="flex items-center space-x-4 text-sm">
          <Lock strokeWidth={1.5} className="h-6 w-6" />
          <Link href="/" className="underline-offset-4 hover:underline">
            Home
          </Link>
          <Link href="/dashboard" className="underline-offset-4 hover:underline">
            Dashboard
          </Link>
          <Link href="/pricing" className="underline-offset-4 hover:underline">
            Pricing
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {session ? (
            <Suspense fallback={<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />}>
              <AvatarDropdown session={JSON.parse(JSON.stringify(session))} />
            </Suspense>
          ) : (
            <Button asChild variant="outline">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
