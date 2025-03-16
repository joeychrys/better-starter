"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function BillingPage() {
    return (
        <div className="max-w-md mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Billing</CardTitle>
                    <CardDescription>
                        Manage your billing information and subscription
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Billing functionality is not implemented in this demo.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}