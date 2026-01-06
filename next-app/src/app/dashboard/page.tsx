'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const fetchCustomerMeters = async () => {
  const { data: customerMeters } = await authClient.customer.state();
  return customerMeters;
};

export default function DashboardPage() {

  const { data: customerMeters } = useQuery({
    queryKey: ['customer-meters'],
    queryFn: fetchCustomerMeters,
  });

  const onClick = async () => {
    const response = await authClient.usage.ingest({
      event: "langgraph-usage",
      metadata: {
        tokensUsed: 1,
      },
    });
    console.log(response);
  };

  useEffect(() => {
    console.log(customerMeters);
  }, [customerMeters]);

  return (
    <div className="container m-8 mx-auto max-w-2xl rounded-lg border p-8">
      <h1 className="text-2xl font-bold">Dashboard Page</h1>
      <p className="text-muted-foreground">Welcome to your dashboard</p>
      <p className="text-muted-foreground">
        This page is protected and can only be accessed by authenticated users.
      </p>
      <Button onClick={onClick}>Ingest Usage</Button>
    </div>
  );
}
