import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="container max-w-6xl mx-auto p-8">
            {children}
            <Toaster />
        </div>
    )
}