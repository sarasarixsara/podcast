import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Define a proper interface for the JWT decoded token
interface DecodedToken {
  id: number;
  email: string;
  name?: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    let decoded: DecodedToken
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as DecodedToken
    } catch (error) {
      console.error('Error al verificar el token:', error)
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    // Verificar que el usuario no sea admin (solo users pueden solicitar citas)
    if (decoded.role === 'admin') {
      return NextResponse.json({ error: 'Los administradores no pueden solicitar citas' }, { status: 403 })
    }

    // Obtener datos del formulario
    const formData = await request.formData() as FormData;
    const horario_id = formData.get('horario_id') as string

    if (!horario_id) {
      return NextResponse.json({ error: 'ID de horario requerido' }, { status: 400 })
    }

    // Verificar que el horario existe y está disponible
    const horario = await prisma.horarioDisponible.findUnique({
      where: { id: parseInt(horario_id) },
      include: { citas: true }
    })

    if (!horario) {
      return NextResponse.json({ error: 'Horario no encontrado' }, { status: 404 })
    }

    // Verificar que el horario no esté ya reservado
    if (horario.citas.length > 0) {
      return NextResponse.json({ error: 'Este horario ya está reservado' }, { status: 400 })
    }

    // Verificar que el usuario no tenga ya una cita para este horario
    const citaExistente = await prisma.cita.findFirst({
      where: {
        user_id: decoded.id,
        horario_disponible_id: parseInt(horario_id)
      }
    })

    if (citaExistente) {
      return NextResponse.json({ error: 'Ya has solicitado una cita para este horario' }, { status: 400 })
    }

    // Crear la nueva cita con estado 'pendiente'
    const nuevaCita = await prisma.cita.create({
      data: {
        user_id: decoded.id,
        horario_disponible_id: parseInt(horario_id),
        state: 'aprobada' // Por defecto aprobada, pero podríamos usar 'pendiente' si agregamos ese estado
      },
      include: {
        horarioDisponible: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Cita solicitada exitosamente',
        cita: nuevaCita
      }, 
      { status: 201 }
    )

  } catch (err) {
    console.error("Error al solicitar cita:", err);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
