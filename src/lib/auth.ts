import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Phone Number",
            credentials: {
                phoneNumber: { label: "Phone Number", type: "text", placeholder: "0XXXXXXXXX" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.phoneNumber || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { phoneNumber: credentials.phoneNumber },
                });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.fullName,
                    email: user.phoneNumber, // Overloading email field for phone number
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
                token.phoneNumber = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).phoneNumber = token.phoneNumber;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
    },
};
