import type { BetterAuthClientPlugin } from "better-auth/client";
import type { RouteProtectionPlugin } from "./server";

export const routeProtectionClientPlugin = () =>
  ({
    id: "better-auth-route-protection",
    $InferServerPlugin: {} as ReturnType<RouteProtectionPlugin>,
  }) satisfies BetterAuthClientPlugin;