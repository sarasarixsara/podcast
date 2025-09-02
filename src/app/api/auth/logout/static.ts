// Archivo de funciones estáticas para reemplazar la API route

import { removeAuthUser } from "@/lib/auth-static";

export function handleLogout() {
  removeAuthUser();
  window.location.href = "/password/login";
}
