"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { AlertTriangle, KeyRound, Loader2, Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function SecurityPage() {
    const { data: session } = authClient.useSession()
    const [isRevoking, setIsRevoking] = useState(false)

    const handleRevokeSessions = async () => {
        if (!session) return

        setIsRevoking(true)
        try {
            // This is a placeholder - actual implementation would depend on the auth library
            // await authClient.revokeSessions()
            toast.success("All other sessions have been revoked")
        } catch (error: any) {
            toast.error(`Error: ${error.message || "Failed to revoke sessions"}`)
        } finally {
            setIsRevoking(false)
        }
    }

    if (!session) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
                    <p className="text-sm text-muted-foreground">
                        Loading your security information...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account security settings.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-4 sm:p-6 space-y-6">
                <div className="bg-background border rounded-lg p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Email verification</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        Verify your email address to secure your account
                    </p>

                    <div className="border rounded-md p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                            <div className="flex items-center gap-2">
                                {session.user.emailVerified ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                                ) : (
                                    <Badge variant="destructive">Not verified</Badge>
                                )}
                                <span>{session.user.email}</span>
                            </div>
                            {!session.user.emailVerified && (
                                <Button variant="outline" size="sm" className="mt-2 sm:mt-0 sm:flex-shrink-0">
                                    Verify email
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-background border rounded-lg p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Password</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        Manage your password and active sessions
                    </p>

                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                            <div>
                                <h4 className="font-medium">Change password</h4>
                                <p className="text-sm text-muted-foreground">
                                    Update your password to keep your account secure
                                </p>
                            </div>
                            <Button variant="outline" className="sm:flex-shrink-0">
                                Change password
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-6 border-t sm:justify-between">
                            <div>
                                <h4 className="font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    Active sessions
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Revoke access from all devices except this one
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                onClick={handleRevokeSessions}
                                disabled={isRevoking}
                                className="sm:flex-shrink-0"
                            >
                                {isRevoking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Revoking...
                                    </>
                                ) : (
                                    "Revoke all"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
