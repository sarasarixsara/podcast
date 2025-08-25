"use client"

import React, { useState } from "react"
import AuthForm from "@/components/AuthForm"
import Link from "next/link"
import { useRouter } from "next/navigation"

const Login: React.FC = () => {
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      setMessage(result.message)

      if (res.ok) {
        setIsSuccess(true)
        // Redirigir al dashboard correspondiente
        const user = result.user
        const targetDashboard =
          user.role_id === 1 ? "/admin/dashboard" : "/user/dashboard"

        setTimeout(() => {
          router.push(targetDashboard)
        }, 1000)
      } else {
        setIsSuccess(false)
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
