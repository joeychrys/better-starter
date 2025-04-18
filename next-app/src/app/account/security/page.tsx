import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import EmailCard from "./components/email-card";
import PasswordCard from "./components/password-card";
import SessionsCard from "./components/sessions-card";

export default async function SecurityPage() {
    const [activeSessions, userAccounts]=
        await Promise.all([
            auth.api.listSessions({
                headers: await headers(),
            }),
            auth.api.listUserAccounts({
                headers: await headers(),
            })
        ]).catch((e) => {
            console.log(e);
            throw redirect("/sign-in");
        });


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account security settings.
                </p>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 space-y-6">
                <EmailCard />
                {
                    userAccounts.length < 1 && (
                        <PasswordCard />
                    )
                }
                <SessionsCard
                    activeSessions={JSON.parse(JSON.stringify(activeSessions))}
                />
            </div>
        </div>
    )
}
