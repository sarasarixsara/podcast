"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  id: number
  name: string
  email: string
  slug: string
}

interface CreatePodcastForm {
  name: string
  url: string
  description: string
  user_id: string
}

// Add this interface for the API response user type
interface UserWithRole extends User {
  role: {
    id: number;
    name: string;
  }
}

export default function CreatePodcastPage() {
  const [formData, setFormData] = useState<CreatePodcastForm>({
    name: "",
    url: "",
    description: "",
    user_id: ""
  })
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [loadingUsers, setLoadingUsers] = useState(true)

  // Cargar usuarios tipo 'user' al montar el componente
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      const data = await response.json()
      
      if (response.ok) {
        // Use the proper type instead of any
        const userTypeUsers = data.users.filter((user: UserWithRole) => user.role.name === "user")
        setUsers(userTypeUsers)
      } else {
        setError("Error al cargar usuarios")
      }
    } catch (err) {
      // Changed from error to err to avoid the unused variable warning
      console.log(err)
      setError("Error al conectar con el servidor")
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validaciones
    if (!formData.name || !formData.url || !formData.description || !formData.user_id) {
      setError("Todos los campos son requeridos")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/podcasts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          url: formData.url,
          description: formData.description,
          user_id: parseInt(formData.user_id)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Podcast "${formData.name}" creado exitosamente!`)
        // Limpiar formulario
        setFormData({
          name: "",
          url: "",
          description: "",
          user_id: ""
        })
      } else {
        setError(data.message || "Error al crear podcast")
      }
    } catch (err) {
      console.error("Error al crear podcast:", err)
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const selectedUser = users.find(user => user.id === parseInt(formData.user_id))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crear Nuevo Podcast
              </h1>
              <p className="text-gray-600">Panel de Administración</p>
            </div>
            <Link 
              href="/admin/dashboard"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto py-6 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Seleccionar Usuario Owner */}
            <div>
              <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                Usuario Owner del Podcast *
              </label>
              {loadingUsers ? (
                <div className="mt-1 text-sm text-gray-500">Cargando usuarios...</div>
              ) : (
                <>
                  <select
                    id="user_id"
                    name="user_id"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formData.user_id}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar usuario...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {selectedUser && (
                    <p className="mt-1 text-xs text-green-600">
                      URL del usuario: https://rectelevision.com/podcast/{selectedUser.slug}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Nombre del Podcast */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre del Podcast *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Ej: Sin Filtros"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* URL del Podcast */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL del Podcast *
              </label>
              <input
                id="url"
                name="url"
                type="url"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://ejemplo.com/mi-podcast"
                value={formData.url}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                URL donde se puede acceder al podcast (Spotify, Apple Podcasts, etc.)
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Descripción del podcast..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Mensajes */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            {/* Botón Submit */}
            <div>
              <button
                type="submit"
                disabled={loading || loadingUsers}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Creando podcast..." : "Crear Podcast"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

