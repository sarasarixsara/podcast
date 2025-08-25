import { redirect } from "next/navigation"
import Link from "next/link"
import { getAuthUser } from "@/lib/auth"
import { prisma } from "@/prisma"
import DeleteHorarioButton from "@/components/DeleteHorarioButton"

export default async function HorariosDisponibles() {
  const user = await getAuthUser()
  
  if (!user || user.role !== "admin") {
    redirect("/password/login")
  }

  // Obtener todos los horarios disponibles agrupados por fecha
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

  // Agrupar horarios por fecha para mostrar como calendario
  const horariosPorFecha = horariosDisponibles.reduce((acc, horario) => {
    const fechaKey = new Date(horario.date).toDateString()
    if (!acc[fechaKey]) {
      acc[fechaKey] = []
    }
    acc[fechaKey].push(horario)
    return acc
  }, {} as Record<string, typeof horariosDisponibles>)

  // Obtener fechas únicas ordenadas
  const fechasOrdenadas = Object.keys(horariosPorFecha).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calendario de Horarios Disponibles
              </h1>
              <p className="text-gray-600">Vista de calendario con todos los horarios creados</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/agenda"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Volver a Gestión de Agenda
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
          
          {/* Resumen */}
          <div className="bg-white shadow rounded-lg mb-8 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">
                  {horariosDisponibles.length}
                </div>
                <div className="text-sm text-gray-500">Total Horarios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {horariosDisponibles.filter(h => h.isAvailable).length}
                </div>
                <div className="text-sm text-gray-500">Disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {fechasOrdenadas.length}
                </div>
                <div className="text-sm text-gray-500">Días con Horarios</div>
              </div>
            </div>
          </div>

          {/* Calendario de Horarios */}
          <div className="space-y-6">
            {fechasOrdenadas.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay horarios disponibles
                </h3>
                <p className="text-gray-600 mb-4">
                  Aún no se han creado horarios disponibles
                </p>
                <Link
                  href="/admin/agenda"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Crear Primer Horario
                </Link>
              </div>
            ) : (
              fechasOrdenadas.map((fechaKey) => {
                const fecha = new Date(fechaKey)
                const horariosDelDia = horariosPorFecha[fechaKey]
                const esPasado = fecha < new Date()
                
                return (
                  <div key={fechaKey} className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header del día */}
                    <div className={`px-6 py-4 border-b ${
                      esPasado ? 'bg-gray-100' : 'bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`text-lg font-semibold ${
                            esPasado ? 'text-gray-600' : 'text-blue-900'
                          }`}>
                            {fecha.toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className={`text-sm ${
                            esPasado ? 'text-gray-500' : 'text-blue-700'
                          }`}>
                            {horariosDelDia.length} horario{horariosDelDia.length !== 1 ? 's' : ''} 
                            {esPasado && ' (Pasado)'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            esPasado 
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {esPasado ? 'Pasado' : 'Futuro'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Horarios del día */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {horariosDelDia.map((horario) => (
                          <div
                            key={horario.id}
                            className={`border rounded-lg p-4 transition-colors ${
                              horario.isAvailable
                                ? 'border-green-200 bg-green-50 hover:bg-green-100'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            {/* Hora */}
                            <div className="flex items-center justify-between mb-3">
                              <div className={`text-lg font-semibold ${
                                horario.isAvailable ? 'text-green-800' : 'text-gray-600'
                              }`}>
                                {new Date(horario.date).toLocaleTimeString('es-ES', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                horario.isAvailable
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {horario.isAvailable ? 'Disponible' : 'No disponible'}
                              </span>
                            </div>

                            {/* Duración */}
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Duración:</span> {horario.duration} minutos
                            </div>

                            {/* Descripción */}
                            {horario.description && (
                              <div className="text-sm text-gray-600 mb-3">
                                <span className="font-medium">Descripción:</span> {horario.description}
                              </div>
                            )}

                            {/* Citas */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-xs font-medium text-gray-500 mb-2">
                                Citas ({horario.citas.length})
                              </div>
                              {horario.citas.length > 0 ? (
                                <div className="space-y-1">
                                  {horario.citas.map((cita) => (
                                    <div key={cita.id} className="flex items-center justify-between">
                                      <span className="text-xs text-gray-700">
                                        {cita.user.name}
                                      </span>
                                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                                        cita.state === 'aprobada'
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}>
                                        {cita.state}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400">Sin citas solicitadas</div>
                              )}
                            </div>

                            {/* Acciones */}
                            <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
                              <form action={`/api/admin/agenda/${horario.id}/toggle`} method="POST" className="flex-1">
                                <button
                                  type="submit"
                                  className={`w-full text-xs px-3 py-2 rounded-md transition-colors ${
                                    horario.isAvailable
                                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                >
                                  {horario.isAvailable ? 'Desactivar' : 'Activar'}
                                </button>
                              </form>
                              <DeleteHorarioButton
                                horarioId={horario.id}
                                className="text-xs px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                              >
                                Eliminar
                              </DeleteHorarioButton>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Leyenda */}
          <div className="bg-white shadow rounded-lg p-6 mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leyenda</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span className="text-sm text-gray-700">Horario disponible para citas</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
                <span className="text-sm text-gray-700">Horario no disponible</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
                <span className="text-sm text-gray-700">Días futuros</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-sm text-gray-700">Días pasados</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
