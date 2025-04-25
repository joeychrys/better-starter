'use client';

import { Subscription } from '@better-auth/stripe';
import { BarChart3, CalendarDays, Check, Package } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data: subscriptions } = await authClient.subscription.list();

        // Get the active subscription
        const activeSubscription = subscriptions?.find(
          (sub) => sub.status === 'active' || sub.status === 'trialing'
        );

        setSubscription(activeSubscription || null);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      await authClient.subscription.cancel({
        returnUrl: '/account/billing',
      });

      // Redirect to Stripe portal will happen automatically
    } catch (error) {
      console.error('Failed to initiate cancellation:', error);
    }
  };

  const handleChangePlan = async () => {
    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  // Default usage values if no active subscription
  const usageData = {
    storage: {
      used: 0,
      total: 0,
      unit: 'GB',
    },
    features: [
      'Access to 3 AI agents',
      '1,000 queries per month',
      'Standard response times',
      'Basic analytics',
      'Email support',
    ],
    apiCalls: { used: 0, total: 0 },
    bandwidth: { used: 0, total: 0 },
    projects: { used: 0, total: 0 },
  };

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
          className={cn(
            'mr-2.5 h-5 w-5 shrink-0',
            highlighted ? 'text-primary' : 'text-primary/70'
          )}
        />
        <span className={highlighted ? 'font-medium' : ''}>{children}</span>
      </li>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have an active subscription.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>Choose a plan to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You currently don&apos;t have an active subscription. Select a plan to access premium
              features.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePlan}>View Plans</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <CardTitle className="text-lg font-medium capitalize">
                  {subscription.plan} Plan
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className={
                  subscription.status === 'active'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : subscription.status === 'trialing'
                      ? 'border-blue-200 bg-blue-50 text-blue-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                }
              >
                {subscription.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div>
              <h4 className="mb-2 font-medium">Features included:</h4>
              <ul className="space-y-1">
                {usageData.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Feature highlighted={index === 0}>{feature}</Feature>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {subscription.periodEnd
                  ? `Current period ends on ${new Date(subscription.periodEnd).toLocaleDateString()}`
                  : 'Subscription active'}
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="xs:flex-row flex w-full flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full" onClick={handleChangePlan}>
                Change Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleCancelSubscription}
                disabled={subscription.cancelAtPeriodEnd}
              >
                {subscription.cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Cancel Plan'}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Usage & Analytics */}
        <Card>
          <CardHeader className="pb-2">
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle className="text-lg font-medium">Usage & Analytics</CardTitle>
            </div>
            <CardDescription>Monitor your account usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">API Calls</span>
                  <span className="text-sm text-muted-foreground">
                    {usageData.apiCalls.used.toLocaleString()} /{' '}
                    {usageData.apiCalls.total === Infinity
                      ? 'Unlimited'
                      : usageData.apiCalls.total.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${10}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Bandwidth</span>
                  <span className="text-sm text-muted-foreground">
                    {usageData.bandwidth.used} MB /{' '}
                    {usageData.bandwidth.total === Infinity
                      ? 'Unlimited'
                      : `${usageData.bandwidth.total} MB`}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${20}%` }} />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Projects</span>
                  <span className="text-sm text-muted-foreground">
                    {usageData.projects.used} /{' '}
                    {usageData.projects.total === Infinity ? 'Unlimited' : usageData.projects.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${5}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              View Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
