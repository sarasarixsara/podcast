import { NextResponse } from "next/server";

export async function POST() {
  // Eliminar la cookie de sesión
  const response = NextResponse.redirect(
    new URL('/password/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
  );
  
  // Borrar la cookie en la respuesta
  response.cookies.delete("session-token");
  
  return response;
}
  

 