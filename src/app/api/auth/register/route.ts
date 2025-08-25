import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import bcryptjs from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { name: name }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario o email ya existe" },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: 2, // Por defecto rol de usuario (no admin)
        image: "https://via.placeholder.com/150", // Imagen por defecto
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''), // Crear slug
      }
    })

    return NextResponse.json(
      { message: "Usuario creado exitosamente", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

