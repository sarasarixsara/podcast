import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rutas públicas que no requieren autenticación
  const isPublicRoute = pathname.startsWith("/password/") || 
                       pathname.startsWith("/podcast/") ||
                       pathname === "/podcast" ||
                       pathname === "/"
  
  // Rutas protegidas
  const isProtectedRoute = pathname.startsWith("/dashboard") || 
                          pathname.startsWith("/admin") || 
                          pathname.startsWith("/user")

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar el token de autenticación
  if (isProtectedRoute) {
    const token = request.cookies.get("session-token")
    
    if (!token) {
      // Redirigir al login si no hay token
      return NextResponse.redirect(new URL("/password/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}