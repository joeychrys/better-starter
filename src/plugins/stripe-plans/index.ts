import { createAuthClient } from "better-auth/client";
import type { BetterAuthPlugin } from "better-auth"

export const stripePlansPlugin = () => (
    {
        id: "stripe-plans",
        schema: {
            plans: {
                fields: {
                    type:{
                        type: "string",
                        required: true,
                    },
                    name: {
                        type: "string",
                        required: true,
                    },
                    priceId: {
                        type: "string",
                    },
                    lookupKey: {
                        type: "string", 
                    },
                    annualDiscountPriceId: {
                        type: "string",
                    },
                    limits: {
                        type: "string",
                    },
                    group: {
                        type: "string",
                    },
                    freeTrialDays: {
                        type: "number",
                    },
                }
            }
        }

    } satisfies BetterAuthPlugin
)