'use client';

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchCustomerMeters = async () => {
  const { data: customerMeters } = await authClient.usage.meters.list({
    query: {
      page: 1,
      limit: 100,
    }
  });
  return customerMeters;
};

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data: customerMeters, isLoading, error } = useQuery({
    queryKey: ['customer-meters'],
    queryFn: fetchCustomerMeters,
  });

  const handleUsage = async () => {
    try {
      // Invalidate queries IMMEDIATELY to make data stale and prevent multiple clicks
      await queryClient.invalidateQueries({
        queryKey: ['customer-meters']
      });
      await queryClient.invalidateQueries({
        queryKey: ['customer-state']
      });

      const { data: ingested } = await authClient.usage.ingest({
        event: "agent-usage",
        metadata: {
          questionsAsked: 1,
        }
      });

    } catch (error) {
      console.error('Failed to ingest usage:', error);

      // If usage ingest fails, invalidate again to refresh the correct state
      await queryClient.invalidateQueries({
        queryKey: ['customer-meters']
      });
    }
  };

  // Check if any meter has balance <= 0
  const hasInsufficientBalance = customerMeters?.result?.items?.some(
    (meter: any) => meter.balance <= 0
  ) ?? false;


  return (
    <div className="container m-8 mx-auto max-w-2xl rounded-lg border p-8">

      <h1 className="text-2xl font-bold">Dashboard Page</h1>
      <div>
      </div>
      <p className="text-muted-foreground">Welcome to your dashboard</p>
      <p className="text-muted-foreground">
        This page is protected and can only be accessed by authenticated users.
      </p>
      <Button
        onClick={handleUsage}
        disabled={hasInsufficientBalance || isLoading}
      >
        {hasInsufficientBalance ? 'Insufficient Balance' : 'Ingest Usage'}
      </Button>
    </div>
  );
}
