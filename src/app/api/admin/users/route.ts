import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
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
