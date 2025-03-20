import db from "@/db";
import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI } from "better-auth/plugins";
import Stripe from "stripe";

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
      }),
    emailAndPassword: {  
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        openAPI(),
        admin(),
        nextCookies(),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            subscription: {
                enabled: true,
                plans: async () => {
                    const plans = await db.query.plan.findMany({
                        where: (plan, { eq }) => eq(plan.type, "dev")
                    });
                    return plans.map(plan => ({
                        name: plan.name,
                        priceId: plan.priceId || undefined,
                    }));
                }
            }
        })
    ]
})