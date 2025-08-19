import type { NextAuthConfig } from "next-auth"

// Configuración simple para NextAuth
export default {
    providers: [],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!
                session.user.role = token.role as string
            }
            return session
        }
    }
} satisfies NextAuthConfig