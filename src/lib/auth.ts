import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export interface AuthUser {
  userId: number
  email: string
  name: string
  role: string
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("session-token")
    
    if (!token) {
      return null
    }

    const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET!) as AuthUser
    return decoded
  } catch (error) {
    console.error("Error verificando token:", error)
    return null
  }
}
