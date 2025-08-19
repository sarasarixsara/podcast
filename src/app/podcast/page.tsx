import { prisma } from "@/prisma"
import Link from "next/link"
import UserAvatar from "@/components/UserAvatar"

export default async function PodcastIndexPage() {
  // Obtener todos los usuarios tipo 'user' con sus podcasts
  const users = await prisma.user.findMany({
    where: {
      role: {
        name: "user"
      },
      slug: {
        not: null
      }
    },
    include: {
      role: true,
      podcasts: {
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900">
                RecTelevision Podcasts
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Descubre contenido de calidad de nuestros creadores
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Estadísticas */}
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">
                  {users.length}
                </div>
                <div className="text-gray-600">Creadores</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {users.reduce((total, user) => total + user.podcasts.length, 0)}
                </div>
                <div className="text-gray-600">Podcasts</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  100%
                </div>
                <div className="text-gray-600">Contenido Original</div>
              </div>
            </div>
          </div>

          {/* Lista de Creadores */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Nuestros Creadores
              </h2>
            </div>
            
            {users.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay creadores disponibles
                </h3>
                <p className="text-gray-500">
                  Aún no tenemos creadores de podcasts registrados. ¡Vuelve pronto!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {users.map((user) => (
                  <Link
                    key={user.id}
                    href={`/podcast/${user.slug}`}
                    className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-6 transition-colors duration-200 border border-gray-200 hover:border-indigo-300"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <UserAvatar 
                        src={user.image}
                        alt={user.name}
                        size="medium"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {user.podcasts.length} podcast{user.podcasts.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    
                    {user.podcasts.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Último podcast:</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.podcasts[0].name}
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center text-indigo-600">
                      <span className="text-sm font-medium">Ver podcasts</span>
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 RecTelevision. Plataforma de podcasts de calidad.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export const metadata = {
  title: "RecTelevision Podcasts - Directorio de Creadores",
  description: "Descubre contenido de calidad de nuestros creadores de podcasts en RecTelevision.",
}
