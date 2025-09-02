"use client"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
// import { getAuthUser } from "@/lib/auth"
import { getAuthUser } from "@/lib/auth-static"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" }, 
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const description = formData.get('description') as string
    const duration = parseInt(formData.get('duration') as string)

    if (!date || !time || !duration) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" }, 
        { status: 400 }
      )
    }

    // Combinar fecha y hora
    const dateTime = new Date(`${date}T${time}:00`)

    // Verificar que la fecha no sea en el pasado
    if (dateTime < new Date()) {
      return NextResponse.json(
        { error: "No se pueden crear horarios en el pasado" }, 
        { status: 400 }
      )
    }

    // Crear el horario disponible
    await prisma.horarioDisponible.create({
      data: {
        date: dateTime,
        description: description || null,
        duration: duration,
        isAvailable: true
      }
    })

    return NextResponse.redirect(new URL('/admin/agenda', request.url))
  } catch (error) {
    console.error('Error creando horario:', error)
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    )
  }
}
