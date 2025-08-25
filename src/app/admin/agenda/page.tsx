import { redirect } from "next/navigation"
import Link from "next/link"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/prisma"
import DeleteButton from "@/components/DeleteButton"

export default async function AdminAgenda() {
  const user = await getAuthUser()
  
  if (!user || user.role !== "admin") {
    redirect("/password/login")
  }

  // Obtener todas las citas con información del usuario y horario
  const citas = await prisma.cita.findMany({
    include: {
      user: true,
      horarioDisponible: true
    },
    orderBy: {
      horarioDisponible: {
        date: "desc"
      }
    }
  })

  // Obtener todos los horarios disponibles
  const horariosDisponibles = await prisma.horarioDisponible.findMany({
    orderBy: {
      date: "asc"
    },
    include: {
      citas: {
        include: {
          user: true
        }
      }
    }
  })

  // Estadísticas de citas
  const citasAprobadas = citas.filter(cita => cita.state === "aprobada").length
  const citasRechazadas = citas.filter(cita => cita.state === "rechazada").length
  const totalCitas = citas.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestión de Agenda
              </h1>
              <p className="text-gray-600">Administrar horarios y citas disponibles</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Volver al Dashboard
              </Link>
              <span className="text-sm text-gray-700">
                {user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">T</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Citas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {totalCitas}
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
                      <span className="text-white font-semibold">A</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Aprobadas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {citasAprobadas}
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
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">R</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rechazadas
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {citasRechazadas}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/agenda/create"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Crear Horario Disponible</span>
                </Link>
                
                <Link
                  href="/admin/agenda/disponibles"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-sm font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Ver Horarios Disponibles</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Lista de Citas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Todas las Citas Solicitadas
              </h3>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {citas.map((cita) => (
                      <tr key={cita.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {cita.user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cita.user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            {new Date(cita.horarioDisponible.date).toLocaleString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            <br />
                            <span className="text-xs text-gray-400">
                              Duración: {cita.horarioDisponible.duration} min
                            </span>
                            {cita.horarioDisponible.description && (
                              <>
                                <br />
                                <span className="text-xs text-gray-600">
                                  {cita.horarioDisponible.description}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cita.state === 'aprobada' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {cita.state}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {cita.state === 'rechazada' && (
                              <form action={`/api/admin/citas/${cita.id}/aprobar`} method="POST">
                                <button
                                  type="submit"
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Aprobar
                                </button>
                              </form>
                            )}
                            {cita.state === 'aprobada' && (
                              <form action={`/api/admin/citas/${cita.id}/rechazar`} method="POST">
                                <button
                                  type="submit"
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Rechazar
                                </button>
                              </form>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {citas.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No hay citas solicitadas aún
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
