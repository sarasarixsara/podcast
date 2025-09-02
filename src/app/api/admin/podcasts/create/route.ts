"use client"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
// import { getAuthUser } from "@/lib/auth"
import { getAuthUser } from "@/lib/auth-static"

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario sea admin
    const authUser = await getAuthUser()
    
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "No autorizado" },
        { status: 401 }
      )
    }

    const { name, url, description, user_id } = await request.json()

    // Validaciones
    if (!name || !url || !description || !user_id) {
      return NextResponse.json(
        { success: false, message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe y es tipo 'user'
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
        role: {
          name: "user"
        }
      },
      include: {
        role: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Usuario no encontrado o no es tipo 'user'" },
        { status: 400 }
      )
    }

    // Verificar si ya existe un podcast con ese nombre
    const existingPodcast = await prisma.podcast.findFirst({
      where: {
        name: name
      }
    })

    if (existingPodcast) {
      return NextResponse.json(
        { success: false, message: "Ya existe un podcast con ese nombre" },
        { status: 400 }
      )
    }

    // Crear el podcast
    const newPodcast = await prisma.podcast.create({
      data: {
        name,
        url,
        description,
        user_id: user_id
      },
      include: {
        user: {
          include: {
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: "Podcast creado exitosamente",
      podcast: newPodcast
    })

  } catch (error) {
    console.error("Error al crear podcast:", error)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
