'use client';

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUsage = async () => {
  const { data: customerMeters } = await authClient.usage.meters.list({
    query: {
      page: 1,
      limit: 100,
    }
  });

  return customerMeters;
}

export default function DashboardPage() {
  const queryClient = useQueryClient();

  const { data: customerMeters, isLoading, error } = useQuery({
    queryKey: ['customer-meters'],
    queryFn: fetchUsage,
  });

  const handleUsage = async () => {
    try {
      const { data: ingested } = await authClient.usage.ingest({
        event: "agent-usage",
        metadata: {
          questionsAsked: 1,
        }
      });

      // Invalidate customer-state to refresh billing data
      await queryClient.invalidateQueries({
        queryKey: ['customer-state']
      });

    } catch (error) {
      console.error('Failed to ingest usage:', error);
    }
  }


  return (
    <div className="container m-8 mx-auto max-w-2xl rounded-lg border p-8">

      <h1 className="text-2xl font-bold">Dashboard Page</h1>
      <div>
        <pre>{JSON.stringify(customerMeters, null, 2)}</pre>
      </div>
      <p className="text-muted-foreground">Welcome to your dashboard</p>
      <p className="text-muted-foreground">
        This page is protected and can only be accessed by authenticated users.
      </p>
      <Button onClick={handleUsage}>Ingest Usage</Button>
    </div>
  );
}
