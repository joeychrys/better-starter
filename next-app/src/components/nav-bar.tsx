// components/NavBar.tsx
import AvatarDropdown from "@/components/avatar-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/types";
import { Lock } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";


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
        <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between p-4 h-16">
                <div className="flex items-center space-x-4 text-sm text-primary/80">
                    <Lock strokeWidth={1.5} className="w-6 h-6" />
                    <Link href="/" className="hover:underline underline-offset-4">
                        Home
                    </Link>
                    <Link href="/dashboard" className="hover:underline underline-offset-4">
                        Dashboard
                    </Link>
                    <Link href="/pricing" className="hover:underline underline-offset-4">
                        Pricing
                    </Link>
                    <Link href="/agents" className="hover:underline underline-offset-4">
                        Agents
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    {session ? (
                        <Suspense fallback={<div className="w-8 h-8 rounded-full bg-muted animate-pulse" />}>
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
