import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("session-token");

  if (token) {
    // Invalidar la cookie estableciendo maxAge a 0
    cookieStore.set("session-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }

  // Redirigir al login
  return NextResponse.redirect(new URL('/password/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
