import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    // Eliminar la cookie de sesión
    const cookieStore = cookies()
    cookieStore.delete("session-token")

    // Redirigir al login
    return NextResponse.redirect(new URL("/login", request.url))
  } catch (error) {
    console.error("Error en logout:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
