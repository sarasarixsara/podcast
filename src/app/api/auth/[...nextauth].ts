import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                const password = credentials.password as string;
                const hashedPassword = user.password as string;
                if (!user || !bcrypt.compareSync(password, hashedPassword)) {
                    throw new Error("Invalid credentials");
                }

                return { id: user.id, email: user.email };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
});
