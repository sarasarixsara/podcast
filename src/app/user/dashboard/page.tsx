import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/prisma"

export default async function UserDashboard() {
  const user = await getAuthUser()
  
  if (!user || user.role !== "user") {
    redirect("/login")
  }

  // Obtener podcasts del usuario
  const userPodcasts = await prisma.podcast.findMany({
    where: {
      user_id: user.userId
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Podcasts
              </h1>
              <p className="text-gray-600">RecTelevision Podcast</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, {user.name}
              </span>
              <form action="/api/auth/logout" method="POST">
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Botón Crear Podcast */}
          <div className="mb-6">
            <a
              href="/user/podcast/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + Crear Nuevo Podcast
            </a>
          </div>

          {/* Lista de Podcasts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Tus Podcasts ({userPodcasts.length})
              </h3>
              
              {userPodcasts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No tienes podcasts aún
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Comienza creando tu primer podcast para compartir tu contenido.
                  </p>
                  <a
                    href="/user/podcast/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium"
                  >
                    Crear Mi Primer Podcast
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userPodcasts.map((podcast) => (
                    <div key={podcast.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {podcast.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {podcast.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(podcast.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <a
                            href={`/user/podcast/${podcast.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            Editar
                          </a>
                          <a
                            href={podcast.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Ver
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
