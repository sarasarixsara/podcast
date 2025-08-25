import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validaciones
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    console.log("Intentando iniciar sesión para:", email);

    // Intentar iniciar sesión
    const result = await signIn(email, password);
    console.log("Resultado de autenticación:", result);

    if (result.success && result.user) {
      // Crear token simple (Base64)
      const tokenPayload = {
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role_id: result.user.role_id,
        timestamp: Date.now(),
      };

      const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

      // Crear respuesta
      const response = NextResponse.json(
        {
          message: "Inicio de sesión exitoso",
          user: result.user,
        },
        { status: 200 }
      );

      // Configurar cookie
      response.cookies.set("session-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        { message: result.message || "Credenciales inválidas" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error detallado en login:", error);
    return NextResponse.json(
      {
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


