// Utility para manejar rutas de API con basePath
export function getApiUrl(path: string): string {
  // En desarrollo local, las APIs están disponibles directamente
  if (process.env.NODE_ENV === 'development') {
    return path
  }
  
  // En producción, agregar el basePath
  return `/podcast${path}`
}

// Wrapper para fetch que maneja el basePath automáticamente
export async function apiRequest(path: string, options: RequestInit = {}) {
  const url = getApiUrl(path)
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
}
