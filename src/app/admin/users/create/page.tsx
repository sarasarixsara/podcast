"use client"

import { useState } from "react"
import Link from "next/link"

interface CreateUserForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: "admin" | "user"
  image?: string
}

export default function CreateUserPage() {
  const [formData, setFormData] = useState<CreateUserForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    image: ""
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    if (formData.role === "user" && !formData.image) {
      setError("La imagen es requerida para usuarios tipo 'user'")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          image: formData.image || "https://via.placeholder.com/150"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Usuario creado exitosamente! ${data.userUrl ? `URL: ${data.userUrl}` : ""}`)
        // Limpiar formulario
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "user",
          image: ""
        })
      } else {
        setError(data.message || "Error al crear usuario")
      }
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Crear Nuevo Usuario
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
            {/* Tipo de Usuario */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Tipo de Usuario *
              </label>
              <select
                id="role"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">Usuario (Owner de Podcast)</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === "user" 
                  ? "Se generará una URL personalizada para sus podcasts" 
                  : "Acceso completo al panel de administración"
                }
              </p>
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Nombre del usuario"
                value={formData.name}
                onChange={handleChange}
              />
              {formData.role === "user" && formData.name && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800 font-medium">
                    URL del usuario: 
                  </p>
                  <a
                    href={`/podcast/${formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:text-green-900 underline"
                  >
                    https://rectelevision.com/podcast/{formData.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="email@ejemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Imagen - Solo requerida para usuarios tipo 'user' */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                URL de Imagen {formData.role === "user" ? "*" : "(Opcional)"}
              </label>
              <input
                id="image"
                name="image"
                type="url"
                required={formData.role === "user"}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={formData.image}
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === "user" 
                  ? "Requerida para usuarios que tendrán podcasts públicos" 
                  : "Opcional para administradores"
                }
              </p>
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Repetir contraseña"
                value={formData.confirmPassword}
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
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Creando usuario..." : "Crear Usuario"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

