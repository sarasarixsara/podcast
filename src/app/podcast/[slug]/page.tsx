import { notFound } from "next/navigation"
import { prisma } from "@/prisma"
import UserPodcastClient from "./UserPodcastClient"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Componente servidor principal
export default async function UserPodcastPage({ params }: PageProps) {
  const { slug } = await params
  
  // Buscar el usuario por slug
  const user = await prisma.user.findFirst({
    where: {
      slug: slug,
      role: {
        name: "user"
      }
    },
    include: {
      role: true,
      podcasts: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  })

  // Si no existe el usuario o no es tipo 'user', mostrar 404
  if (!user) {
    notFound()
  }

  // Pasar los datos al componente cliente
  return <UserPodcastClient user={user} />
}

// Generar metadata dinámicamente
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  const user = await prisma.user.findFirst({
    where: {
      slug: slug,
      role: {
        name: "user"
      }
    },
    include: {
      podcasts: true
    }
  })

  if (!user) {
    return {
      title: "Usuario no encontrado",
    }
  }

  return {
    title: `${user.name} - Podcasts | RecTelevision`,
    description: `Descubre todos los podcasts de ${user.name}. ${user.podcasts.length} podcast${user.podcasts.length !== 1 ? 's' : ''} disponible${user.podcasts.length !== 1 ? 's' : ''}.`,
    openGraph: {
      title: `${user.name} - Podcasts`,
      description: `Podcasts de ${user.name} en RecTelevision`,
      images: [user.image || "https://via.placeholder.com/150"],
    },
  }
}
