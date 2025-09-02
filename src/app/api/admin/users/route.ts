"use client"
import { NextResponse } from "next/server"
import { prisma } from "@/prisma"
// import { getAuthUser } from "@/lib/auth"
import { getAuthUser } from "@/lib/auth-static"

export async function GET() {
  try {
    // Verificar que el usuario sea admin
    const authUser = await getAuthUser()
    
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      )
    }

    // Obtener todos los usuarios con sus roles
    const users = await prisma.user.findMany({
      include: {
        role: true
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json({
      success: true,
      users: users
    })

  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
