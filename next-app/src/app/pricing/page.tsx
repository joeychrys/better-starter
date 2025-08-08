'use client';

import { Check } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function Pricing() {

  const handleBasicPlan = async () => {
    await authClient.checkout({
      slug: "basic",
    })
  }

  const handleProPlan = async () => {
    await authClient.checkout({
      slug: "pro",
    })
  }

  const handleTokenPurchase = async () => {
    await authClient.checkout({
      slug: "tokens",
    })
  }


  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      {/* Header Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-muted-foreground lg:text-xl">
          Choose the perfect plan for your AI agent needs. Scale as you grow with flexible pricing options.
        </p>
      </div>

      {/* Token Purchase Section */}
      <div className="mx-auto mb-16 max-w-7xl">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="grid gap-8 md:grid-cols-3 md:items-center">
              {/* Left Section - Header */}
              <div className="text-center md:text-left">
                <CardTitle className="mb-3 text-2xl font-bold">Need Extra Tokens?</CardTitle>
                <CardDescription className="text-base">
                  Purchase additional tokens to boost your AI agent capabilities
                </CardDescription>
              </div>

              {/* Middle Section - Pricing */}
              <div className="text-center">
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="ml-2 text-muted-foreground">/10 tokens</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">One-time purchase</p>
              </div>

              {/* Right Section - CTA */}
              <div className="text-center">
                <Button
                  size="lg"
                  className="w-full md:w-auto md:px-8"
                  onClick={handleTokenPurchase}
                >
                  Purchase Tokens
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-7xl gap-6 lg:gap-8 md:grid-cols-3">
        {/* Basic Plan */}
        <Card className="relative flex h-full flex-col">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-semibold">Basic</CardTitle>
            <CardDescription className="text-base mt-2">
              Perfect for individuals and small teams
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold tracking-tight">$20</span>
                <span className="ml-2 text-muted-foreground">/month</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6">
            <ul className="space-y-4">
              <Feature>Access to 3 AI agents</Feature>
              <Feature>1,000 queries per month</Feature>
              <Feature>Standard response times</Feature>
              <Feature>Basic analytics dashboard</Feature>
              <Feature>Email support</Feature>
            </ul>
          </CardContent>

          <CardFooter className="pt-8">
            <Button className="w-full" size="lg" onClick={handleBasicPlan}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative flex h-full flex-col border-primary shadow-lg">
          <Badge variant="default" className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1">
            MOST POPULAR
          </Badge>

          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-semibold">Pro</CardTitle>
            <CardDescription className="text-base mt-2">
              For growing businesses and productive teams
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold tracking-tight">$80</span>
                <span className="ml-2 text-muted-foreground">/month</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6">
            <ul className="space-y-4">
              <Feature highlighted>Access to 10 AI agents</Feature>
              <Feature highlighted>10,000 queries per month</Feature>
              <Feature highlighted>Priority response times</Feature>
              <Feature>Advanced analytics & insights</Feature>
              <Feature>Priority email support</Feature>
              <Feature>Full API access</Feature>
              <Feature>Custom integrations</Feature>
            </ul>
          </CardContent>

          <CardFooter className="pt-8">
            <Button className="w-full" size="lg" onClick={handleProPlan}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="relative flex h-full flex-col">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl font-semibold">Enterprise</CardTitle>
            <CardDescription className="text-base mt-2">
              For large organizations with custom requirements
            </CardDescription>
            <div className="mt-6">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold tracking-tight">Custom</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Pricing tailored to your needs</p>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6">
            <ul className="space-y-4">
              <Feature>Unlimited AI agents</Feature>
              <Feature>Unlimited queries</Feature>
              <Feature>Fastest response times</Feature>
              <Feature>Enterprise analytics suite</Feature>
              <Feature>24/7 dedicated support</Feature>
              <Feature>Advanced API & webhooks</Feature>
              <Feature>Custom AI agent development</Feature>
              <Feature>SLA guarantees</Feature>
              <Feature>Dedicated account manager</Feature>
            </ul>
          </CardContent>

          <CardFooter className="pt-8">
            <Link href="/contact" className="w-full">
              <Button
                className="w-full"
                variant="outline"
                size="lg"
              >
                Contact Sales
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* CTA Section */}
      <div className="mt-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h3 className="mb-4 text-2xl font-semibold">Need something more specific?</h3>
          <p className="mx-auto mb-8 text-lg text-muted-foreground">
            Contact our sales team to customize a plan that perfectly fits your organization's unique requirements and scale.
          </p>
          <Button variant="outline" size="lg" className="px-8">
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

function Feature({
  children,
  highlighted = false,
}: {
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <li className="flex items-start gap-3">
      <Check
        className={cn(
          'h-5 w-5 shrink-0 mt-0.5',
          highlighted ? 'text-primary' : 'text-primary/70'
        )}
      />
      <span className={cn(
        'text-sm leading-relaxed',
        highlighted ? 'font-medium text-foreground' : 'text-muted-foreground'
      )}>
        {children}
      </span>
    </li>
  );
}
