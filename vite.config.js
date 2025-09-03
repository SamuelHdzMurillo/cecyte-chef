import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración para variables de entorno
  define: {
    // Hacer que las variables de entorno estén disponibles en el cliente
    'process.env': {}
  },
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
    // Configurar proxy para desarrollo si es necesario
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
