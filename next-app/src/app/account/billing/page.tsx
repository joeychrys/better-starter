'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, CalendarDays, Package, User } from 'lucide-react';

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

const fetchCustomerState = async () => {
  const { data: customerState } = await authClient.customer.state();
  return customerState;
};

export default function BillingPage() {
  const { data: customerState, isLoading, error } = useQuery({
    queryKey: ['customer-state'],
    queryFn: fetchCustomerState,
  });

  const handleManageSubscription = async () => {
    try {
      // Redirect to Polar customer portal or subscription management
      // This would need to be implemented based on Polar's customer portal
      console.log('Manage subscription clicked');
    } catch (error) {
      console.error('Failed to manage subscription:', error);
    }
  };

  const handleUpgradePlan = async () => {
    // Redirect to pricing page
    window.location.href = '/pricing';
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Assuming amount is in cents
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-muted-foreground">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
          <p className="text-sm text-destructive">
            Failed to load billing information. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!customerState || customerState.activeSubscriptions.length === 0) {
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
            <Button onClick={handleUpgradePlan}>View Plans</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const activeSubscription = customerState.activeSubscriptions[0]; // Get the first active subscription

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and view usage information.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Top Row: Account Details and Current Plan */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Account Details */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <CardTitle className="text-lg font-medium">Account Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm font-semibold">{customerState.name}</p>
                </div>
              </div>

              {customerState.billingAddress && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Billing Address</p>
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    <p className="font-medium">{customerState.billingAddress.line1}</p>
                    {customerState.billingAddress.line2 && (
                      <p>{customerState.billingAddress.line2}</p>
                    )}
                    <p>
                      {customerState.billingAddress.city}, {customerState.billingAddress.state}{' '}
                      {customerState.billingAddress.postalCode}
                    </p>
                    <p className="text-muted-foreground">{customerState.billingAddress.country}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <CardTitle className="text-lg font-medium">Current Plan</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={
                    activeSubscription.status === 'active'
                      ? 'border-green-200 bg-green-50 text-green-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700'
                  }
                >
                  {activeSubscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">
                    {formatCurrency(activeSubscription.amount, activeSubscription.currency)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    per {activeSubscription.recurringInterval}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Current period ends{' '}
                    {activeSubscription.currentPeriodEnd
                      ? new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>

                {activeSubscription.cancelAtPeriodEnd && (
                  <div className="rounded-md bg-amber-50 p-3 text-center">
                    <p className="text-sm text-amber-800">
                      Subscription will be canceled at period end
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <div className="flex justify-between gap-2 p-4">
              <Button variant="outline" size="sm" className="w-full" onClick={handleUpgradePlan}>
                Change Plan
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Row: Usage spanning full width */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle className="text-lg font-medium">Usage & Credits</CardTitle>
            </div>
            <CardDescription>
              Monitor your current usage and available credits across all meters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerState.activeMeters.length > 0 ? (
              <div className="space-y-4">
                {customerState.activeMeters.map((meter) => {
                  const usagePercentage = meter.creditedUnits > 0
                    ? (meter.consumedUnits / meter.creditedUnits) * 100
                    : 0;

                  return (
                    <div key={meter.id} className="rounded-lg border p-4 w-full">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Credits</span>
                          <span className="text-xs text-muted-foreground">
                            {meter.consumedUnits} / {meter.creditedUnits} used
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{usagePercentage.toFixed(1)}% used</span>
                            <span>{meter.balance} remaining</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">No usage meters available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
