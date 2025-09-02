import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  // Solo aplicar basePath en producción
  ...(isDevelopment ? {} : {
    basePath: "/podcast",
    assetPrefix: "/podcast",
    output: 'export'  // Restauramos esta opción para generar la carpeta out
  }),
  
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: true, // Añadimos esta opción para exportación estática
  },
};

export default nextConfig;
