import { cookies } from "next/headers";
import { prisma } from "@/prisma";

interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role_id: number;
  timestamp: number;
}

export async function getAuthUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session-token")?.value;

    if (!token) {
      console.log("No se encontró token de sesión");
      return null;
    }

    // Decodificar el token (Base64)
    const decodedData = Buffer.from(token, 'base64').toString();
    const payload = JSON.parse(decodedData) as TokenPayload;
    
    // Verificar si el token ha expirado (7 días)
    const now = Date.now();
    const expiryTime = payload.timestamp + (7 * 24 * 60 * 60 * 1000);
    if (now > expiryTime) {
      console.log("Token expirado");
      return null;
    }

    // Obtener usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { id: parseInt(payload.userId) },
      include: { role: true }
    });

    if (!user) {
      console.log("Usuario no encontrado en la base de datos");
      return null;
    }

    return {
      id: user.id,
      userId: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role.name,
    };
  } catch (error) {
    console.error("Error al verificar la autenticación:", error);
    return null;
  }
}
