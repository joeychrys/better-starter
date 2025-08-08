import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin, openAPI } from 'better-auth/plugins';
import { Resend } from 'resend';
import { Polar } from "@polar-sh/sdk";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";

import { ResetPasswordEmail } from '@/components/email-templates/reset-password';
import { VerificationEmail } from '@/components/email-templates/verification-email';
import db from '@/db';

const resend = new Resend(process.env.RESEND_API_KEY!);
const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: 'sandbox'
});


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Next Starter <reset@joeychrys.com>',
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmail({ user, url }) as React.ReactElement,
      });
    },
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
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Next Starter <verify@joeychrys.com>',
        to: user.email,
        subject: 'Verify your email address',
        react: VerificationEmail({ user, url }) as React.ReactElement,
      });
    },
  },
  plugins: [
    openAPI(),
    admin(),
    nextCookies(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "f22fe868-afdb-4234-afe7-2766cb373ebd",
              slug: "basic"
            },
            {
              productId: "9813452d-8812-4f49-9d33-a34be797b46b",
              slug: "pro"
            },
            {
              productId: "b85cdce5-fabd-4fb4-b3ff-620893bd795c",
              slug: "tokens"
            }
          ],
          successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?checkout_id={CHECKOUT_ID}`,
        }),
        portal(),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
        }),
      ]
    })
  ],
});
