"use client"

import React, { useState } from "react"
import AuthForm from "@/components/AuthForm"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setAuthUser } from "@/lib/auth-static" // Importa la nueva función

const Login: React.FC = () => {
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      // Para versión estática, simulamos una API
      // En producción podrías usar una API externa o serverless function
      const mockUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          password: "admin123",
          role_id: 1,
        },
        {
          id: 2,
          name: "Regular User",
          email: "user@example.com",
          password: "user123",
          role_id: 2,
        },
      ]

      const user = mockUsers.find(
        (u) => u.email === data.email && u.password === data.password
      )

      if (user) {
        // Guardar en localStorage - no need to destructure since we're not using the variables
        setAuthUser({
          id: user.id,
          userId: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role_id === 1 ? "admin" : "user",
        })

        setIsSuccess(true)
        setMessage("Inicio de sesión exitoso")

        // Redirigir al dashboard correspondiente
        const targetDashboard =
          user.role_id === 1 ? "/admin/dashboard" : "/user/dashboard"
        setTimeout(() => {
          router.push(targetDashboard)
        }, 1000)
      } else {
        setIsSuccess(false)
        setMessage("Credenciales inválidas")
      }
    } catch (error) {
      console.error("Error en login:", error)
      setMessage("Error de conexión")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        {/* AuthForm recibe el submit handler */}
        <AuthForm mode="Login" onSubmit={handleLogin} />

        {message && (
          <p
            className={`text-center mt-4 ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        {isLoading && (
          <p className="text-center mt-4 text-blue-500">Iniciando sesión...</p>
        )}

        <div className="text-center mt-4">
          <Link href="/password/signup" className="text-blue-500 hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login

