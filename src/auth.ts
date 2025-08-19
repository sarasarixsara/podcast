import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
// @ts-ignore
import { prisma } from "@/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [],
})