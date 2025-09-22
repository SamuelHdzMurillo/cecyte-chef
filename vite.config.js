import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Configuración de la base URL para producción
  base: "/cecyteChef/",

  // Configuración para variables de entorno
  define: {
    // Hacer que las variables de entorno estén disponibles en el cliente
    "process.env": {},
  },

  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    host: true,
    // Proxy deshabilitado para usar la API de producción
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8000',
    //     changeOrigin: true,
    //     secure: false,
    //   }
    // }
  },

  // Configuración para el build
  build: {
    // Asegurar que los assets se copien correctamente
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // Mantener la estructura de directorios para los assets
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
  },

  // Configuración para assets públicos
  publicDir: "public",
});
