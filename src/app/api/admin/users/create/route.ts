import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/prisma"
import { getAuthUser } from "@/lib/auth"
import bcryptjs from "bcryptjs"

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

    const { name, email, password, role, image } = await request.json()

    // Validaciones
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Todos los campos requeridos deben ser completados" },
        { status: 400 }
      )
    }

    if (role === "user" && !image) {
      return NextResponse.json(
        { success: false, message: "La imagen es requerida para usuarios tipo 'user'" },
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
        { success: false, message: "El usuario o email ya existe" },
        { status: 400 }
      )
    }

    // Buscar el rol en la base de datos
    const roleRecord = await prisma.role.findUnique({
      where: { name: role }
    })

    if (!roleRecord) {
      return NextResponse.json(
        { success: false, message: "Rol no válido" },
        { status: 400 }
      )
    }

    // Hashear la contraseña
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Generar slug para usuarios tipo 'user'
    let slug = null
    if (role === "user") {
      // Crear slug limpio del nombre
      slug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remover acentos
        .replace(/\s+/g, '') // Remover espacios
        .replace(/[^a-z0-9]/g, '') // Solo letras y números
    }

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role_id: roleRecord.id,
        image: image || "https://via.placeholder.com/150",
        slug: slug, // Guardar el slug
      },
      include: {
        role: true
      }
    })

    // URL para usuarios tipo 'user'
    let userUrl = null
    if (slug) {
      userUrl = `https://rectelevision.com/podcast/${slug}`
    }

    return NextResponse.json({
      success: true,
      message: "Usuario creado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role.name
      },
      userUrl: userUrl
    }, { status: 201 })

  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
