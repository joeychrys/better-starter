import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import LinkedAccountsCard from "./components/linked-accounts-card"
import ProfileCard from "./components/profile-card"

export default async function ProfilePage() {
    const [session, userAccounts] =
        await Promise.all([
            auth.api.getSession({
                headers: await headers(),
            }),
            auth.api.listUserAccounts({
                headers: await headers(),
            })
        ]).catch((e) => {
            console.log(e)
            throw redirect("/sign-in")
        })

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Profile details</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your profile information.
                </p>
            </div>

            <div className="bg-card rounded-lg p-4 sm:p-6 space-y-6">
                <ProfileCard session={JSON.parse(JSON.stringify(session))} />
                <LinkedAccountsCard userAccounts={JSON.parse(JSON.stringify(userAccounts))} />
            </div>
        </div>
    )
}
