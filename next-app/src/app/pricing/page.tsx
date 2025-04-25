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

export default function Pricing() {
  const handleBasicPlan = async () => {
    await authClient.subscription.upgrade({
      plan: 'basic',
      successUrl: '/dashboard',
      cancelUrl: '/pricing',
    });
  };

  const handleProPlan = async () => {
    await authClient.subscription.upgrade({
      plan: 'pro',
      successUrl: '/dashboard',
      cancelUrl: '/pricing',
    });
  };

  return (
    <div className="container mx-auto px-5 py-20">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Choose the perfect plan for your AI agent needs. Scale as you grow.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
        {/* Basic Plan */}
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Basic</CardTitle>
            <CardDescription className="pt-1.5">
              Perfect for individuals and small teams
            </CardDescription>
            <div className="mt-4 flex items-end">
              <span className="text-4xl font-bold">$20</span>
              <span className="ml-1.5 pb-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6 pt-2">
            <ul className="space-y-3.5">
              <Feature>Access to 3 AI agents</Feature>
              <Feature>1,000 queries per month</Feature>
              <Feature>Standard response times</Feature>
              <Feature>Basic analytics</Feature>
              <Feature>Email support</Feature>
            </ul>
          </CardContent>

          <CardFooter className="pt-6">
            <Button className="w-full" onClick={handleBasicPlan}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Pro Plan */}
        <Card className="relative flex h-full flex-col border-primary">
          <Badge variant="default" className="absolute right-4 top-4 z-10">
            POPULAR
          </Badge>

          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription className="pt-1.5">For growing businesses and teams</CardDescription>
            <div className="mt-4 flex items-end">
              <span className="text-4xl font-bold">$80</span>
              <span className="ml-1.5 pb-1 text-muted-foreground">/month</span>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6 pt-2">
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
            <Button className="w-full bg-primary" onClick={handleProPlan}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Enterprise Plan */}
        <Card className="flex h-full flex-col">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Enterprise</CardTitle>
            <CardDescription className="pt-1.5">
              For large organizations with specific needs
            </CardDescription>
            <div className="mt-4 flex items-end">
              <span className="text-4xl font-bold">Custom</span>
              <span className="ml-1.5 pb-1 text-muted-foreground"> pricing</span>
            </div>
          </CardHeader>

          <CardContent className="flex-grow px-6 pt-2">
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
            <Button
              className="w-full"
              variant="outline"
              onClick={() => (window.location.href = '/contact')}
            >
              Contact Sales
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-20 text-center">
        <h3 className="mb-4 text-xl font-semibold">Need something specific?</h3>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
          Contact our sales team to customize a plan that perfectly fits your organization&apos;s
          requirements.
        </p>
        <Button variant="outline" size="lg">
          Schedule a Demo
        </Button>
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
    <li className="flex items-start">
      <Check
        className={cn('mr-2.5 h-5 w-5 shrink-0', highlighted ? 'text-primary' : 'text-primary/70')}
      />
      <span className={highlighted ? 'font-medium' : ''}>{children}</span>
    </li>
  );
}
