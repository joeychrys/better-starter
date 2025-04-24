"use client"

import { KeyRound } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function PasswordCard({ user }: { user: User }) {
    const [sending, setSending] = useState<boolean>(false)


    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <KeyRound className="h-5 w-5" />
                    <CardTitle className="text-lg font-medium">Password</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Update your password to keep your account secure. Email will be sent to your account email.
                        </p>
                    </div>
                    <Button disabled={sending} variant="destructive" onClick={async () => {
                        setSending(true)
                        await authClient.forgetPassword({
                            email: user.email,
                            redirectTo: "/reset-password",
                            fetchOptions: {
                                onResponse: () => {
                                    toast.success("Email sent to reset your password")
                                    setSending(true)
                                },
                                onRequest: () => {
                                    setSending(true)
                                },
                                onError: (ctx) => {
                                    toast.error(ctx.error.message)
                                    setSending(false)
                                }
                            }
                        })
                    }}>
                        {sending ? "Email Sent" : "Send Reset Link"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
