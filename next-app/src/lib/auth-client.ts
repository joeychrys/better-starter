import { stripeClient } from "@better-auth/stripe/client"
import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:3000", // the base url of your auth server
    plugins: [adminClient(), stripeClient({

        subscription: true,
    })]
})