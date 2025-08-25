import { prisma } from "@/prisma";
import bcryptjs from "bcryptjs";

export interface User {
  id: string;
  email: string;
  name: string;
  role_id: number;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  message?: string;
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    if (!email || !password) {
      return { success: false, message: "Email and password are required" };
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials" };
    }

    return {
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        role_id: user.role_id
      }
    };
  } catch (error) {
    console.error("Auth error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) return null;

    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      role_id: user.role_id
    };
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}

// For compatibility with NextAuth route handlers
export const handlers = {
  GET: async () => new Response("Auth endpoint", { status: 200 }),
  POST: async () => new Response("Auth endpoint", { status: 200 })
};

export const auth = null;
export const signOut = () => {};
