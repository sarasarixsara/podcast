import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"

export default async function Dashboard() {
  const user = await getAuthUser()
  
  if (!user) {
    redirect("/login")
  }

  // Redirigir según el rol del usuario
  if (user.role === "admin") {
    redirect("/admin/dashboard")
  } else {
    redirect("/user/dashboard")
  }
}