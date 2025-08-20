"use client"

import { useState } from "react"
import UserAvatar from "@/components/UserAvatar"

interface Podcast {
  id: number
  name: string
  description: string
  url: string
  createdAt: Date
}

interface User {
  id: number
  name: string
  image: string | null
  podcasts: Podcast[]
}

interface UserPodcastClientProps {
  user: User
}

export default function UserPodcastClient({ user }: UserPodcastClientProps) {
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(
    user.podcasts.length > 0 ? user.podcasts[0] : null
  )

  // Función para convertir URL de YouTube a formato embebido
  const getEmbedUrl = (url: string) => {
    // Detectar diferentes formatos de YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    
    if (match) {
      const videoId = match[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Si ya es una URL de embed, devolverla tal como está
    if (url.includes('embed')) {
      return url
    }
    
    // Para otros tipos de video (Vimeo, etc.)
    const vimeoRegex = /vimeo\.com\/(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Si no es un video reconocido, devolver la URL original
    return url
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Superior con Imagen del Usuario */}
      <div 
        className="relative h-80 overflow-hidden"
        style={{
          backgroundImage: user.image 
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${user.image})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-2">{user.name}</h1>
            <p className="text-xl opacity-90">Creador de Podcasts</p>
            <p className="text-lg opacity-75 mt-2">
              {user.podcasts.length} podcast{user.podcasts.length !== 1 ? 's' : ''} disponible{user.podcasts.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Branding en el banner */}
          <div className="absolute top-6 right-6 text-white text-right">
            <p className="text-sm opacity-75">Powered by</p>
            <p className="text-2xl font-bold">RecTelevision</p>
          </div>
        </div>
      </div>

      {/* Contenido Principal - Dos Columnas */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {user.podcasts.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-12 text-center">
            <div className="text-gray-400 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No hay podcasts disponibles
            </h3>
            <p className="text-gray-600 text-lg">
              {user.name} aún no ha publicado ningún podcast. ¡Vuelve pronto para ver el contenido!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna Izquierda - Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                  {selectedPodcast ? (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedPodcast.name}
                      </h2>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {selectedPodcast.description}
                      </p>
                      
                      {/* Video Player */}
                      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                        <iframe
                          src={getEmbedUrl(selectedPodcast.url)}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          title={selectedPodcast.name}
                        />
                      </div>
                      
                      {/* Información adicional */}
                      <div className="flex items-center justify-between border-t pt-4">
                        <span className="text-sm text-gray-500">
                          Publicado el {new Date(selectedPodcast.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <a
                          href={selectedPodcast.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Ver Original
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Selecciona un podcast para reproducir</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Lista de Podcasts */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Lista de Podcasts
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {user.podcasts.map((podcast) => (
                    <div
                      key={podcast.id}
                      onClick={() => setSelectedPodcast(podcast)}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                        selectedPodcast?.id === podcast.id 
                          ? 'bg-indigo-50 border-indigo-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <h4 className={`font-semibold mb-2 ${
                        selectedPodcast?.id === podcast.id 
                          ? 'text-indigo-900' 
                          : 'text-gray-900'
                      }`}>
                        {podcast.name}
                      </h4>
                      <p className={`text-sm leading-relaxed ${
                        selectedPodcast?.id === podcast.id 
                          ? 'text-indigo-700' 
                          : 'text-gray-600'
                      }`}>
                        {podcast.description.length > 100 
                          ? `${podcast.description.substring(0, 100)}...` 
                          : podcast.description
                        }
                      </p>
                      <div className="mt-2 flex items-center">
                        {selectedPodcast?.id === podcast.id && (
                          <div className="flex items-center text-indigo-600">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-medium">Reproduciendo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 RecTelevision. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  )
}
