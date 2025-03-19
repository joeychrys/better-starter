"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, BarChart3, CalendarDays, CreditCard, Package, Receipt } from "lucide-react"

export default function BillingPage() {
    // Mock subscription data
    const subscription = {
        status: "active",
        plan: "Pro",
        billingCycle: "monthly",
        amount: "$12.99",
        renewalDate: "April 15, 2023",
        usage: {
            storage: {
                used: 7.5,
                total: 15,
                unit: "GB"
            },
            features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"]
        }
    }

    // Mock payment history
    const paymentHistory = [
        { id: "INV-001", date: "Mar 1, 2023", amount: "$12.99", status: "paid" },
        { id: "INV-002", date: "Feb 1, 2023", amount: "$12.99", status: "paid" },
        { id: "INV-003", date: "Jan 1, 2023", amount: "$12.99", status: "paid" },
    ]

    // Mock payment method
    const paymentMethod = {
        type: "Credit Card",
        last4: "4242",
        expiry: "04/25",
        name: "John Doe"
    }

    // Calculate percentage for display
    const storagePercentage = (subscription.usage.storage.used / subscription.usage.storage.total) * 100;
    const apiPercentage = 84.21;
    const bandwidthPercentage = 51.2;
    const projectsPercentage = 50;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your subscription and payment methods.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Current Plan */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Package className="h-5 w-5" />
                            <CardTitle className="text-lg font-medium">Current Plan</CardTitle>
                        </div>
                        <CardDescription>
                            Your subscription plan and usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{subscription.plan} Plan</h3>
                                <p className="text-sm text-muted-foreground">{subscription.billingCycle} billing</p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {subscription.status}
                            </Badge>
                        </div>

                        <div className="bg-muted p-4 rounded-md mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">Storage Usage</span>
                                <span className="text-sm text-muted-foreground">
                                    {subscription.usage.storage.used} / {subscription.usage.storage.total} {subscription.usage.storage.unit}
                                </span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all"
                                    style={{ width: `${storagePercentage}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Features included:</h4>
                            <ul className="space-y-1">
                                {subscription.usage.features.map((feature, index) => (
                                    <li key={index} className="text-sm flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-sm">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Renews on {subscription.renewalDate}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="flex flex-col xs:flex-row gap-2 w-full">
                            <Button variant="outline" size="sm" className="w-full">Change Plan</Button>
                            <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">Cancel Plan</Button>
                        </div>
                    </CardFooter>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5" />
                            <CardTitle className="text-lg font-medium">Payment Method</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your payment information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md p-4 mb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="font-medium">{paymentMethod.type}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Ending in {paymentMethod.last4}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Expires {paymentMethod.expiry}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="font-medium">{paymentMethod.name}</div>
                                    <Badge variant="outline" className="mt-1">Default</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">Billing address</h3>
                            <Button variant="link" className="p-0 h-auto">Edit</Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>123 Main Street</p>
                            <p>Apt 4B</p>
                            <p>New York, NY 10001</p>
                            <p>United States</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">Update Payment Method</Button>
                    </CardFooter>
                </Card>

                {/* Usage & Analytics */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-5 w-5" />
                            <CardTitle className="text-lg font-medium">Usage & Analytics</CardTitle>
                        </div>
                        <CardDescription>
                            Monitor your account usage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">API Calls</span>
                                    <span className="text-sm text-muted-foreground">
                                        8,421 / 10,000
                                    </span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all"
                                        style={{ width: `${apiPercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">Bandwidth</span>
                                    <span className="text-sm text-muted-foreground">
                                        256 MB / 500 MB
                                    </span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all"
                                        style={{ width: `${bandwidthPercentage}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">Projects</span>
                                    <span className="text-sm text-muted-foreground">
                                        5 / Unlimited
                                    </span>
                                </div>
                                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-primary h-full transition-all"
                                        style={{ width: `${projectsPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                            <AlertCircle className="h-4 w-4" />
                            <span>You're approaching your API call limit</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">View Detailed Analytics</Button>
                    </CardFooter>
                </Card>

                {/* Payment History */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <Receipt className="h-5 w-5" />
                            <CardTitle className="text-lg font-medium">Payment History</CardTitle>
                        </div>
                        <CardDescription>
                            View your recent payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {paymentHistory.map((payment, index) => (
                                <div key={payment.id}>
                                    {index > 0 && <Separator className="my-2" />}
                                    <div className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium">{payment.id}</p>
                                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{payment.amount}</p>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {payment.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" className="w-full">View All Invoices</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}