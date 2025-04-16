"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function Pricing() {

    const handleBasicPlan = async () => {
        await authClient.subscription.upgrade({
            plan: "basic",
            successUrl: "/dashboard",
            cancelUrl: "/pricing",
        })
    }


    return (
        <div className="container py-20 px-5 mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose the perfect plan for your AI agent needs. Scale as you grow.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Basic Plan */}
                <Card className="flex flex-col h-full">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl">Basic</CardTitle>
                        <CardDescription className="pt-1.5">Perfect for individuals and small teams</CardDescription>
                        <div className="mt-4 flex items-end">
                            <span className="text-4xl font-bold">$20</span>
                            <span className="text-muted-foreground ml-1.5 pb-1">/month</span>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow pt-2 px-6">
                        <ul className="space-y-3.5">
                            <Feature>Access to 3 AI agents</Feature>
                            <Feature>1,000 queries per month</Feature>
                            <Feature>Standard response times</Feature>
                            <Feature>Basic analytics</Feature>
                            <Feature>Email support</Feature>
                        </ul>
                    </CardContent>

                    <CardFooter className="pt-6">
                        <Button className="w-full" onClick={handleBasicPlan}>Get Started</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan */}
                <Card className="flex flex-col h-full relative border-primary">
                    <Badge variant="default" className="absolute top-4 right-4 z-10">
                        POPULAR
                    </Badge>

                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl">Pro</CardTitle>
                        <CardDescription className="pt-1.5">For growing businesses and teams</CardDescription>
                        <div className="mt-4 flex items-end">
                            <span className="text-4xl font-bold">$100</span>
                            <span className="text-muted-foreground ml-1.5 pb-1">/month</span>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow pt-2 px-6">
                        <ul className="space-y-3.5">
                            <Feature highlighted>Access to 10 AI agents</Feature>
                            <Feature highlighted>10,000 queries per month</Feature>
                            <Feature highlighted>Faster response times</Feature>
                            <Feature>Advanced analytics</Feature>
                            <Feature>Priority email support</Feature>
                            <Feature>API access</Feature>
                            <Feature>Custom integrations</Feature>
                        </ul>
                    </CardContent>

                    <CardFooter className="pt-6">
                        <Button className="w-full bg-primary" onClick={() => authClient.subscription.upgrade({
                            plan: "pro",
                            successUrl: "/dashboard",
                            cancelUrl: "/pricing",
                        })}>
                            Get Started
                        </Button>
                    </CardFooter>
                </Card>

                {/* Enterprise Plan */}
                <Card className="flex flex-col h-full">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-2xl">Enterprise</CardTitle>
                        <CardDescription className="pt-1.5">For large organizations with specific needs</CardDescription>
                        <div className="mt-4 flex items-end">
                            <span className="text-4xl font-bold">Custom</span>
                            <span className="text-muted-foreground ml-1.5 pb-1"> pricing</span>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-grow pt-2 px-6">
                        <ul className="space-y-3.5">
                            <Feature>Unlimited AI agents</Feature>
                            <Feature>Unlimited queries</Feature>
                            <Feature>Fastest response times</Feature>
                            <Feature>Enterprise-grade analytics</Feature>
                            <Feature>24/7 dedicated support</Feature>
                            <Feature>Advanced API access</Feature>
                            <Feature>Custom AI agent development</Feature>
                            <Feature>SLA guarantees</Feature>
                            <Feature>Dedicated account manager</Feature>
                        </ul>
                    </CardContent>

                    <CardFooter className="pt-6">
                        <Button className="w-full" variant="outline" onClick={() => window.location.href = "/contact"}>Contact Sales</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-20 text-center">
                <h3 className="text-xl font-semibold mb-4">Need something specific?</h3>
                <p className="mb-8 text-muted-foreground max-w-2xl mx-auto">
                    Contact our sales team to customize a plan that perfectly fits your organization's requirements.
                </p>
                <Button variant="outline" size="lg">
                    Schedule a Demo
                </Button>
            </div>
        </div>
    );
}

function Feature({ children, highlighted = false }: { children: React.ReactNode; highlighted?: boolean }) {
    return (
        <li className="flex items-start">
            <Check className={cn(
                "h-5 w-5 mr-2.5 shrink-0",
                highlighted ? "text-primary" : "text-primary/70"
            )} />
            <span className={highlighted ? "font-medium" : ""}>{children}</span>
        </li>
    );
}
