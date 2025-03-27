import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import { routeProtectionClientPlugin } from "@/plugins/route-protection/client"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
    plugins: [
        adminClient(),
        stripeClient({
            subscription: true,
        }),
        routeProtectionClientPlugin()
    ]
})