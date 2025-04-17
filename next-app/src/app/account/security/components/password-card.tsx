"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KeyRound } from "lucide-react"
import PasswordChangeDialog from "./dialogs/password-change-dialog"

export default function PasswordCard() {
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
                            Update your password to keep your account secure
                        </p>
                    </div>
                    <PasswordChangeDialog />
                </div>
            </CardContent>
        </Card>
    )
}
