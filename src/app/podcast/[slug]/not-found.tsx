import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-gray-400 mb-6">
          <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.071-2.334C3.73 9.955 3 7.59 3 5c0-.552.448-1 1-1h.01c.552 0 1 .448 1 1 0 1.97.515 3.83 1.416 5.415" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Creador no encontrado
        </h2>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, el creador de podcasts que buscas no existe o ha sido movido.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            Ver todos los creadores
          </Link>
          
          <Link
            href="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors duration-200"
          >
            Ir al inicio
          </Link>
        </div>
        
        <div className="mt-8">
          <p className="text-sm text-gray-500">
            © 2024 RecTelevision
          </p>
        </div>
      </div>
    </div>
  )
}
