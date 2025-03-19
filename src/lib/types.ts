import { auth } from "@/lib/auth";

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
export type UserAccounts = {
    id: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    accountId: string;
    scopes: string[];
}[];