'use client';

import { useQuery } from '@tanstack/react-query';
import { BarChart3, ChevronDown, CreditCard, Gift, Package, RefreshCw, User } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';

// Collapsible JSON viewer component
function JsonViewer({ data, label }: { data: unknown; label: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-2">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
          View Raw {label}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="bg-muted mt-3 h-72 rounded-md border">
          <pre className="p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}

// Format currency helper
const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

// Format date helper
const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to extract items from paginated response
const getItems = (data: any): any[] => {
  if (!data) return [];
  if (data.result?.items) return data.result.items;
  if (Array.isArray(data)) return data;
  if (data.items) return data.items;
  return [];
};

// Helper to get pagination info
const getPagination = (data: any): { totalCount: number; maxPage: number } | null => {
  if (!data) return null;
  if (data.result?.pagination) return data.result.pagination;
  if (data.pagination) return data.pagination;
  return null;
};

export default function UsagePage() {
  // Fetch customer state
  const {
    data: customerState,
    isLoading: stateLoading,
    error: stateError,
    refetch: refetchState,
  } = useQuery({
    queryKey: ['customer-state'],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });

  // Fetch orders
  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data } = await authClient.customer.orders.list({
        query: { page: 1, limit: 100 },
      });
      return data;
    },
  });

  // Fetch benefits
  const {
    data: benefits,
    isLoading: benefitsLoading,
    error: benefitsError,
    refetch: refetchBenefits,
  } = useQuery({
    queryKey: ['customer-benefits'],
    queryFn: async () => {
      const { data } = await authClient.customer.benefits.list({
        query: { page: 1, limit: 100 },
      });
      return data;
    },
  });

  // Fetch customer meters (usage)
  const {
    data: meters,
    isLoading: metersLoading,
    error: metersError,
    refetch: refetchMeters,
  } = useQuery({
    queryKey: ['customer-meters'],
    queryFn: async () => {
      const { data } = await authClient.usage.meters.list({
        query: { page: 1, limit: 100 },
      });
      return data;
    },
  });

  const isLoading = stateLoading || ordersLoading || benefitsLoading || metersLoading;

  const refetchAll = () => {
    refetchState();
    refetchOrders();
    refetchBenefits();
    refetchMeters();
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Polar SDK Data Explorer</h1>
          <p className="text-muted-foreground text-sm">
            Explore all available data from the Polar Better Auth SDK
          </p>
        </div>
        <Button onClick={refetchAll} variant="outline" size="sm" disabled={isLoading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Customer State Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle className="text-lg">Customer State</CardTitle>
          </div>
          <CardDescription>
            Complete customer state from authClient.customer.state()
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stateError ? (
            <div className="text-destructive text-sm">
              Error: {stateError instanceof Error ? stateError.message : 'Failed to load'}
            </div>
          ) : !customerState ? (
            <p className="text-muted-foreground text-sm">No customer state available</p>
          ) : (
            <div className="space-y-6">
              {/* Customer Info Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Name</p>
                  <p className="font-medium">{customerState.name || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">Email</p>
                  <p className="font-medium">{customerState.email || 'N/A'}</p>
                </div>
              </div>

              {/* Billing Address */}
              {customerState.billingAddress && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm font-medium">Billing Address</p>
                    <div className="bg-muted/30 rounded-lg border p-4 text-sm">
                      {customerState.billingAddress.line1 && (
                        <p>{customerState.billingAddress.line1}</p>
                      )}
                      {customerState.billingAddress.line2 && (
                        <p>{customerState.billingAddress.line2}</p>
                      )}
                      <p>
                        {[
                          customerState.billingAddress.city,
                          customerState.billingAddress.state,
                          customerState.billingAddress.postalCode,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="text-muted-foreground">
                        {customerState.billingAddress.country}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Active Subscriptions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-medium">Active Subscriptions</p>
                  <Badge variant="secondary">
                    {customerState.activeSubscriptions?.length || 0}
                  </Badge>
                </div>
                {customerState.activeSubscriptions?.length > 0 ? (
                  <div className="grid gap-2">
                    {customerState.activeSubscriptions.map((sub: any) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="text-muted-foreground h-4 w-4" />
                          <div>
                            <p className="text-sm font-medium">{sub.productName || sub.id}</p>
                            {sub.amount && sub.currency && (
                              <p className="text-muted-foreground text-xs">
                                {formatCurrency(sub.amount, sub.currency)}/{sub.recurringInterval}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                          {sub.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No active subscriptions</p>
                )}
              </div>

              <Separator />

              {/* Active Meters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm font-medium">Active Meters</p>
                  <Badge variant="secondary">{customerState.activeMeters?.length || 0}</Badge>
                </div>
                {customerState.activeMeters?.length > 0 ? (
                  <div className="grid gap-3">
                    {customerState.activeMeters.map((meter: any) => {
                      const usagePercentage =
                        meter.creditedUnits > 0
                          ? (meter.consumedUnits / meter.creditedUnits) * 100
                          : 0;
                      return (
                        <div key={meter.id} className="space-y-3 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{meter.name || 'Credits'}</span>
                            <span className="text-muted-foreground text-xs">
                              {meter.consumedUnits} / {meter.creditedUnits} used
                            </span>
                          </div>
                          <Progress value={Math.min(usagePercentage, 100)} className="h-2" />
                          <div className="text-muted-foreground flex justify-between text-xs">
                            <span>{usagePercentage.toFixed(1)}% used</span>
                            <span>{meter.balance} remaining</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No active meters</p>
                )}
              </div>

              <JsonViewer data={customerState} label="Customer State JSON" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabs for Orders, Benefits, Meters */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Orders
            {getPagination(orders) && (
              <Badge variant="secondary" className="ml-1">
                {getPagination(orders)?.totalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="benefits" className="gap-2">
            <Gift className="h-4 w-4" />
            Benefits
            {getPagination(benefits) && (
              <Badge variant="secondary" className="ml-1">
                {getPagination(benefits)?.totalCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="meters" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Meters
            {getPagination(meters) && (
              <Badge variant="secondary" className="ml-1">
                {getPagination(meters)?.totalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order History</CardTitle>
              <CardDescription>Orders from authClient.customer.orders.list()</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersError ? (
                <div className="text-destructive text-sm">
                  Error: {ordersError instanceof Error ? ordersError.message : 'Failed to load'}
                </div>
              ) : !orders ? (
                <p className="text-muted-foreground text-sm">No orders data available</p>
              ) : getItems(orders).length === 0 ? (
                <p className="text-muted-foreground text-sm">No orders found</p>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getItems(orders).map((order: any, i: number) => (
                        <TableRow key={order.id || i}>
                          <TableCell className="font-mono text-xs">
                            {order.invoiceNumber || `${order.id?.slice(0, 8)}...`}
                          </TableCell>
                          <TableCell>{order.product?.name || order.description || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'paid' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {order.totalAmount && order.currency
                              ? formatCurrency(order.totalAmount, order.currency)
                              : 'N/A'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <JsonViewer data={orders} label="Orders JSON" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Benefit Grants</CardTitle>
              <CardDescription>Benefits from authClient.customer.benefits.list()</CardDescription>
            </CardHeader>
            <CardContent>
              {benefitsError ? (
                <div className="text-destructive text-sm">
                  Error: {benefitsError instanceof Error ? benefitsError.message : 'Failed to load'}
                </div>
              ) : !benefits ? (
                <p className="text-muted-foreground text-sm">No benefits data available</p>
              ) : getItems(benefits).length === 0 ? (
                <p className="text-muted-foreground text-sm">No benefits found</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {getItems(benefits).map((grant: any, i: number) => (
                      <div key={grant.id || i} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{grant.benefit?.description || grant.id}</p>
                            <p className="text-muted-foreground text-xs">
                              Type: {grant.benefit?.type?.replace('_', ' ') || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {grant.isRevoked ? (
                              <Badge variant="destructive">Revoked</Badge>
                            ) : grant.isGranted ? (
                              <Badge>Granted</Badge>
                            ) : (
                              <Badge variant="secondary">Pending</Badge>
                            )}
                          </div>
                        </div>

                        {/* Meter credit properties */}
                        {grant.benefit?.type === 'meter_credit' && grant.benefit?.properties && (
                          <div className="bg-muted/50 grid gap-2 rounded-lg p-3 text-sm sm:grid-cols-3">
                            <div>
                              <span className="text-muted-foreground">Units: </span>
                              <span className="font-medium">{grant.benefit.properties.units}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Rollover: </span>
                              <span className="font-medium">
                                {grant.benefit.properties.rollover ? 'Yes' : 'No'}
                              </span>
                            </div>
                            {grant.properties?.lastCreditedUnits && (
                              <div>
                                <span className="text-muted-foreground">Last Credited: </span>
                                <span className="font-medium">
                                  {grant.properties.lastCreditedUnits} units
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="text-muted-foreground flex justify-between text-xs">
                          <span>Granted: {formatDate(grant.grantedAt)}</span>
                          {grant.revokedAt && <span>Revoked: {formatDate(grant.revokedAt)}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <JsonViewer data={benefits} label="Benefits JSON" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meters Tab */}
        <TabsContent value="meters">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Meters</CardTitle>
              <CardDescription>Meters from authClient.usage.meters.list()</CardDescription>
            </CardHeader>
            <CardContent>
              {metersError ? (
                <div className="text-destructive text-sm">
                  Error: {metersError instanceof Error ? metersError.message : 'Failed to load'}
                </div>
              ) : !meters ? (
                <p className="text-muted-foreground text-sm">No meters data available</p>
              ) : getItems(meters).length === 0 ? (
                <p className="text-muted-foreground text-sm">No meters found</p>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {getItems(meters).map((meter: any, i: number) => {
                      const consumedUnits = meter.consumedUnits ?? 0;
                      const creditedUnits = meter.creditedUnits ?? 0;
                      const balance = meter.balance ?? 0;
                      const usagePercentage =
                        creditedUnits > 0 ? (consumedUnits / creditedUnits) * 100 : 0;

                      return (
                        <div key={meter.id || i} className="space-y-4 rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">
                                {meter.meter?.name || meter.name || `Meter ${i + 1}`}
                              </p>
                              <p className="text-muted-foreground font-mono text-xs">{meter.id}</p>
                            </div>
                            <Badge variant="outline">{balance} remaining</Badge>
                          </div>
                          <div className="space-y-2">
                            <Progress value={Math.min(usagePercentage, 100)} className="h-3" />
                            <div className="text-muted-foreground flex justify-between text-sm">
                              <span>Consumed: {consumedUnits}</span>
                              <span>Credited: {creditedUnits}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <JsonViewer data={meters} label="Meters JSON" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <p className="text-muted-foreground text-center text-xs">
        Data fetched from Polar Better Auth SDK
      </p>
    </div>
  );
}
