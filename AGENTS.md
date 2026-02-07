# AGENTS.md

## Project Overview

Next.js 16 (App Router) starter with Better Auth, Drizzle ORM (PostgreSQL), Polar.sh payments, React Query, shadcn/ui, and Tailwind CSS v4. The Next.js app lives in `next-app/`. The git root is the repo root (`better-starter/`).

## Build / Lint / Format Commands

All commands run from `next-app/`:

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build (standalone output)
pnpm lint             # ESLint (flat config)
pnpm lint:fix         # ESLint with auto-fix
pnpm format           # Prettier write
pnpm format:check     # Prettier check (CI uses this)
```

### Database Commands

```bash
pnpm db:generate      # Generate Drizzle migration files
pnpm db:migrate       # Run Drizzle migrations
pnpm db:push          # Push schema directly (no migration file)
pnpm db:studio        # Open Drizzle Studio
```

All db commands use `dotenv -e .env.local` to load env vars. Never use `pnpm dlx` for drizzle-kit -- it's a local devDependency. Do not use the Better Auth CLI (`@better-auth/cli`) for migrations -- it does not work reliably with this setup.

### Docker (Local)

```bash
docker compose -f docker-compose.local.yml up -d   # Start local PostgreSQL
docker compose -f docker-compose.local.yml down     # Stop
```

### Tests

No test framework is configured. No test files exist.

### CI Pipeline (PR to master)

- ESLint (`pnpm lint`)
- Prettier check (`pnpm format:check`)
- Docker build validation (no push)

### Pre-commit Hook

Husky + lint-staged runs on every commit. The `.husky/pre-commit` hook runs `lint-staged` inside `next-app/`, which applies ESLint --fix and Prettier --write to staged files.

## Code Style

### Formatting (Prettier)

- Semicolons: yes
- Single quotes: yes
- Tab width: 2 spaces
- Trailing commas: es5
- Print width: 100
- Plugin: prettier-plugin-tailwindcss (auto-sorts Tailwind classes)

### ESLint

Flat config (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals`. Also uses `eslint-config-prettier` and `eslint-plugin-prettier`.

### TypeScript

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*` -- always use `@/` imports for project files
- Target: ES2017, JSX: react-jsx, moduleResolution: bundler

### Import Ordering

Two groups separated by a blank line:

1. **External packages** (alphabetically): `react`, `next`, third-party libs
2. **Internal `@/` imports** (alphabetically): `@/components`, `@/lib`, etc.

Relative imports (`./`) come last. Type-only imports use inline `import type` syntax. CSS imports go at the very end. `'use client'` directive always on line 1 before any imports.

```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { SignInFormSchema } from '@/lib/schemas';
```

### Naming Conventions

| Element              | Convention     | Example                                  |
|----------------------|----------------|------------------------------------------|
| Files & folders      | kebab-case     | `auth-client.ts`, `email-templates/`     |
| Components           | PascalCase     | `SignInPage`, `AvatarDropdown`           |
| Variables/functions  | camelCase      | `handleDeleteUser`, `isLoading`          |
| Zod schemas          | PascalCase     | `SignInFormSchema`, `UsernameFormSchema`  |
| Schema fragments     | camelCase      | `emailSchema`, `passwordSchema`          |
| DB tables            | singular noun  | `pgTable("user", ...)`, `pgTable("session", ...)` |
| DB columns (SQL)     | snake_case     | `email_verified`, `created_at`           |
| DB fields (Drizzle)  | camelCase      | `emailVerified`, `createdAt`             |
| Query keys           | kebab-case     | `['customer-state']`, `['users-admin-count']` |
| Route groups         | `(name)`       | `(auth)/`                                |
| Constants            | camelCase      | `protectedRoutes`, `buttonVariants`      |

### Types & Interfaces

- Use `interface` for component props and object shapes
- Use `type` for aliases, unions, and inferred types
- Shared types go in `src/lib/types.ts`; component-specific interfaces stay in their file
- Infer form types from Zod: `z.infer<typeof SchemaName>` -- don't duplicate manually
- Form schemas live in `src/lib/schemas.ts`

### Component Patterns

- **Pages**: `export default function PageName()` (named default export, `async` if server-fetching)
- **Shared components**: `export default function ComponentName()` or `export default async function`
- **shadcn/ui**: `React.forwardRef` + `cva` variants + `cn()` + explicit `displayName`
- **Email/icon components**: `export const ComponentName: React.FC<Props> = () => ...`
- **Helper sub-components**: plain `function` at bottom of file, not exported
- **Server components**: default (no directive), use `async` for data fetching
- **Client components**: `'use client'` on line 1

### Error Handling

1. **Auth client operations** -- use `fetchOptions` callbacks:
   ```typescript
   authClient.signIn.email({
     ...data,
     fetchOptions: {
       onRequest: () => setLoading(true),
       onResponse: () => setLoading(false),
       onError: (ctx) => toast.error(ctx.error.message),
       onSuccess: () => router.push('/'),
     },
   });
   ```

2. **Async operations** -- try/catch with `error: unknown` and `instanceof Error`:
   ```typescript
   try {
     await operation();
     toast.success('Done');
   } catch (error: unknown) {
     const msg = error instanceof Error ? error.message : 'Something went wrong';
     toast.error(msg);
   }
   ```

3. **Server-side** -- `.catch()` with redirect:
   ```typescript
   const session = await auth.api.getSession({ headers: await headers() })
     .catch(() => { throw redirect('/sign-in'); });
   ```

Always use `sonner` (`toast`) for user-facing notifications. Never use `alert()` or `console.log` for user feedback.

### Forms

react-hook-form + Zod + shadcn/ui Form components:

```typescript
const form = useForm<z.infer<typeof Schema>>({
  resolver: zodResolver(Schema),
  defaultValues: { ... },
});
```

### State Management

- **Server state**: React Query (`useQuery`, `useQueryClient().invalidateQueries`)
- **Auth state**: `authClient.useSession()` (no wrapper hook)
- **Local UI state**: `useState`
- No global state library (no Zustand/Redux/Jotai)

### UI & Styling

- shadcn/ui (new-york style) with Radix UI primitives
- Icons: `lucide-react` exclusively, sized with `className="h-4 w-4"` or `size={16}`
- Class merging: `cn()` from `@/lib/utils` (clsx + tailwind-merge)
- Dark/light mode via `next-themes`, default dark
- Toasts via `sonner`

## Project Structure

```
next-app/src/
  app/                    # App Router pages & layouts
    (auth)/               # Auth pages (sign-in, sign-up, reset-password)
    account/              # Account management (profile, security, billing)
      {section}/components/         # Page-specific components
      {section}/components/dialogs/ # Page-specific dialogs
    api/auth/[...all]/    # Better Auth catch-all route
  components/             # Shared components
    ui/                   # shadcn/ui primitives (do not edit manually)
    icons/                # SVG icon components
    email-templates/      # React Email templates
    tables/               # Data table compositions (columns + data-table + table-card)
  db/                     # Database connection (index.ts) & schema (schema.ts)
  drizzle/                # Migration files (auto-generated, do not edit)
  hooks/                  # Custom React hooks
  lib/                    # Auth config, auth-client, types, schemas, utils
  providers.tsx           # React Query provider
  proxy.ts                # Route protection middleware
```

## Key Architecture Notes

- **Auth**: Better Auth with email/password, Google OAuth, admin plugin, JWT, Polar payments
- **Database**: PostgreSQL via Drizzle ORM with `node-postgres` (Pool). String-based IDs, not auto-increment.
- **Env vars**: Next.js loads `.env.local` automatically at runtime. CLI tools (drizzle-kit, better-auth CLI) need `dotenv-cli` to load them -- this is already configured in package.json scripts.
- **Third-party clients** (Resend, Polar): lazily instantiated via getter functions in `auth.ts` to avoid crashes when CLI tools load the config without env vars.
- **Deployment**: Dokploy via Docker. Standalone Next.js output. NEXT_PUBLIC_* vars use placeholder pattern replaced at container start by `scripts/entrypoint.sh`.
- **Production migrations**: The Docker image includes `drizzle-kit`, `drizzle-orm`, and `pg` (installed in `/app/drizzle-tools/` to avoid clobbering the standalone `node_modules`) plus the schema and migration files at their original paths. Run migrations from the Dokploy terminal: `drizzle-kit migrate`. Other commands (`push`, `pull`, `studio`) also work. Do not use the Better Auth CLI (`@better-auth/cli`) for migrations -- it does not work reliably with this setup.
