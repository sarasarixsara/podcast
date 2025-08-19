import { notFound } from "next/navigation"
import { prisma } from "@/prisma"
import UserAvatar from "@/components/UserAvatar"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              {/* Imagen del usuario */}
              <UserAvatar 
                src={user.image}
                alt={user.name}
                size="large"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-600">Creador de Podcasts</p>
              </div>
            </div>
            
            {/* Branding */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Powered by</p>
              <p className="text-lg font-semibold text-indigo-600">RecTelevision</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Información del creador */}
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Sobre {user.name}
            </h2>
            <p className="text-gray-600">
              Bienvenido al espacio de podcasts de {user.name}. Aquí encontrarás todos los episodios y contenido disponible.
            </p>
          </div>

          {/* Lista de Podcasts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Podcasts ({user.podcasts.length})
              </h2>
            </div>
            
            {user.podcasts.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay podcasts disponibles
                </h3>
                <p className="text-gray-500">
                  {user.name} aún no ha publicado ningún podcast. ¡Vuelve pronto para ver el contenido!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {user.podcasts.map((podcast) => (
                  <div key={podcast.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {podcast.name}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {podcast.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <a
                            href={podcast.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h8M7 7h10a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z" />
                            </svg>
                            Escuchar Podcast
                          </a>
                          <span className="text-sm text-gray-500">
                            Publicado el {new Date(podcast.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer de la página */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 RecTelevision. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
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
