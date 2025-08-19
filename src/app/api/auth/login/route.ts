import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import bcryptjs from "bcryptjs"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log("🔍 Login attempt:", { email, password: "***" })

    if (!email || !password) {
      console.log("❌ Missing credentials")
      return NextResponse.json(
        { success: false, message: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    })

    console.log("👤 User found:", user ? { id: user.id, email: user.email, role: user.role.name } : "null")

    if (!user) {
      console.log("❌ User not found")
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isPasswordValid = await bcryptjs.compare(password, user.password)
    console.log("🔑 Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("❌ Invalid password")
      return NextResponse.json(
        { success: false, message: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name
      },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "7d" }
    )

    console.log("✅ Login successful for:", user.email)

    // Configurar cookie
    const cookieStore = cookies()
    cookieStore.set("session-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 // 7 días
    })

    // Retornar éxito con información del usuario
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.name
      }
    })

  } catch (error) {
    console.error("❌ Error en login:", error)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
