import { redirect } from "next/navigation"

export default function HomePage() {
  // Con basePath "/podcast", redirigir al directorio de podcasts
  redirect("/podcast")
}
