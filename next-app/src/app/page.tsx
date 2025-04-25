import { CheckCircle, Code, Database, Lock, Palette, Zap } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  return (
    <div className="container mx-auto space-y-16 px-4 py-12">
      {/* Hero Section */}
      <section className="space-y-6 py-12 text-center">
        <Badge variant="outline" className="px-3 py-1 text-sm">
          Next.js Starter Template
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
          Your Ultimate <span className="text-primary">Next.js</span> Starter
        </h1>
        <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
          A comprehensive starting point for your Next.js projects with authentication, UI
          components, and everything you need to build modern web applications.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/your-repo/nextjs-starter" target="_blank">
              View on GitHub
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Everything You Need</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            This template includes all the essential features to kickstart your Next.js project
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-primary" />}
            title="Authentication Ready"
            description="Secure authentication system with sign-up, sign-in, and user management already implemented."
          />
          <FeatureCard
            icon={<Palette className="h-10 w-10 text-primary" />}
            title="UI Component Library"
            description="Beautiful, accessible UI components built with Tailwind CSS and Radix UI."
          />
          <FeatureCard
            icon={<Database className="h-10 w-10 text-primary" />}
            title="Database Integration"
            description="Ready-to-use database setup with migrations and type safety."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Performance Optimized"
            description="Built with performance in mind, ensuring fast load times and smooth user experiences."
          />
          <FeatureCard
            icon={<Code className="h-10 w-10 text-primary" />}
            title="TypeScript Support"
            description="Full TypeScript support for type safety and better developer experience."
          />
          <FeatureCard
            icon={<CheckCircle className="h-10 w-10 text-primary" />}
            title="Best Practices"
            description="Follows industry best practices for code organization, security, and accessibility."
          />
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="border transition-all hover:shadow-md">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
