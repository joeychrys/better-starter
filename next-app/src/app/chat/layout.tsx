"use client";

import { authClient } from "@/lib/auth-client";
import { CopilotKit } from "@copilotkit/react-core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = authClient.useSession();
    const userId = session?.user?.id;

    return (
        <main className="">
            <CopilotKit
                runtimeUrl="/api/copilotkit"
                agent="agent"
                enableInspector={false}
            >
                {children}
            </CopilotKit>
        </main>
    );
}
