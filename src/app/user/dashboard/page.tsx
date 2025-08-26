import { redirect } from "next/navigation"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/prisma"
// import Link from "next/link"

// Añade esta línea para marcar la página como dinámica
export const dynamic = 'force-dynamic';

export default async function UserDashboard() {
  const user = await getAuthUser()
  
  if (!user || user.role !== "user") {
    redirect("/password/login")
  }

  // Obtener podcasts del usuario
  const userPodcasts = await prisma.podcast.findMany({
    where: {
      user_id: parseInt(user.userId) // Convertir string a integer
    },
    orderBy: { createdAt: "desc" }
  })

  // Obtener horarios disponibles para agendar
  const horariosDisponibles = await prisma.horarioDisponible.findMany({
    where: {
      isAvailable: true,
      date: {
        gte: new Date() // Solo horarios futuros
      }
    },
    orderBy: { date: "asc" },
    include: {
      citas: {
        where: {
          state: "aprobada"
        }
      }
    }
  })

  // Obtener citas del usuario
  const misCitas = await prisma.cita.findMany({
    where: {
      user_id: parseInt(user.userId) // Convertir string a integer
    },
    include: {
      horarioDisponible: true
    },
    orderBy: {
      horarioDisponible: {
        date: "asc"
      }
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard de Usuario
              </h1>
              <p className="text-gray-600">Mis podcasts y agenda de citas</p>
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
          
          {/* Estadísticas del Usuario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">P</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Mis Podcasts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {userPodcasts.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">C</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Mis Citas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {misCitas.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">H</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Horarios Disponibles
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {horariosDisponibles.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horarios Disponibles para Agendar */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                📅 Horarios Disponibles para Agendar
              </h3>
              
              {horariosDisponibles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No hay horarios disponibles en este momento</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {horariosDisponibles.map((horario) => {
                    const yaAgendado = horario.citas.length > 0
                    return (
                      <div
                        key={horario.id}
                        className={`border rounded-lg p-4 transition-colors ${
                          yaAgendado
                            ? 'border-gray-200 bg-gray-50'
                            : 'border-green-200 bg-green-50 hover:bg-green-100'
                        }`}
                      >
                        {/* Fecha y Hora */}
                        <div className="mb-3">
                          <div className="text-lg font-semibold text-gray-900">
                            {new Date(horario.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="text-xl font-bold text-indigo-600">
                            {new Date(horario.date).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>

                        {/* Duración */}
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Duración:</span> {horario.duration} minutos
                        </div>

                        {/* Descripción */}
                        {horario.description && (
                          <div className="text-sm text-gray-600 mb-4">
                            <span className="font-medium">Descripción:</span> {horario.description}
                          </div>
                        )}

                        {/* Estado y Acción */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          {yaAgendado ? (
                            <div className="text-center">
                              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Ya reservado
                              </span>
                            </div>
                          ) : (
                            <form action="/api/user/citas/solicitar" method="POST">
                              <input type="hidden" name="horario_id" value={horario.id} />
                              <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                              >
                                Solicitar Cita
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mis Citas Solicitadas */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                📋 Mis Citas Solicitadas
              </h3>
              
              {misCitas.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No has solicitado ninguna cita aún</p>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duración
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {misCitas.map((cita) => (
                        <tr key={cita.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">
                                {new Date(cita.horarioDisponible.date).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-indigo-600 font-semibold">
                                {new Date(cita.horarioDisponible.date).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cita.horarioDisponible.duration} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              cita.state === 'aprobada' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {cita.state === 'aprobada' ? '✅ Aprobada' : '⏳ Pendiente'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cita.horarioDisponible.description || 'Sin descripción'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Mis Podcasts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                🎙️ Mis Podcasts
              </h3>
              
              {/* Botón Crear Podcast */}
              <div className="mb-6">
                <a
                  href="/user/podcast/new"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  + Crear Nuevo Podcast
                </a>
              </div>

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

