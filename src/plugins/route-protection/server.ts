import type { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";

export type RouteProtectionPlugin = typeof routeProtectionPlugin;

export interface ProtectedRoute {
  path: string;
  requiresAuth: boolean;
  roles: string[];
}


export function routeProtectionPlugin() {
  const plugin: BetterAuthPlugin = {
    id: "better-auth-route-protection",
    schema: {
      protectedRoutes: {
        fields: {
          path: {
            type: "string",
            unique: true,
            required: true,
            input: true,
          },
          requiresAuth: {
            type: "boolean",
            input: true,
            required: true,
          },
          roles: {
            type: "string",
            input: true,
            required: true,
          }
        }
      }
    },
    endpoints: {
      getProtectedRoutes: createAuthEndpoint(
        "/protected-routes",
        {
          method: "GET",
        },
        async (ctx) => {
          // Get protected routes from database
          const protectedRoutes = await ctx.context.adapter.findMany<ProtectedRoute>({
            model: "protectedRoutes",
          });

          return ctx.json(protectedRoutes);
        }
      )
    }
  };

  return plugin;
}
