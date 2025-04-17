"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { Mail } from "lucide-react"


export default function EmailCard() {
    const { data: session } = authClient.useSession()

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
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                    <Mail className="h-5 w-5" />
                    <CardTitle className="text-lg font-medium">Email verification</CardTitle>
                </div>
                <CardDescription>
                    Verify your email address to secure your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                        <div className="flex items-center gap-2">
                            {session.user.emailVerified ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                            ) : (
                                <Badge variant="destructive" >Not verified</Badge>
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
            </CardContent>
        </Card>
    )
}
