import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, openAPI } from "better-auth/plugins";
import Stripe from "stripe";
import db from "@/db";
import { stripePlans } from "./stripe-plans";
import { Resend } from "resend";
import { VerificationEmail } from "@/components/email-templates/verification-email";


const resend = new Resend(process.env.RESEND_API_KEY!)
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!)


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
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
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            await resend.emails.send({
                from: "Next Starter <verify@joeychrys.com>",
                to: user.email,
                subject: 'Verify your email address',
                react: VerificationEmail({ user, url }),
            })
        }
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
                plans: stripePlans
            }
        }),
    ]
})