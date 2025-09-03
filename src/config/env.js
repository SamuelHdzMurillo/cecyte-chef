// Configuración de variables de entorno para la API
export const API_CONFIG = {
  // URL base de la API - cambiar según el entorno
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  
  // Configuración de timeout para las peticiones
  TIMEOUT: 10000,
  
  // Headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Endpoints específicos
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login',
      LOGOUT: '/logout',
      REGISTER: '/register',
      REFRESH: '/auth/refresh',
    },
    USER: {
      PROFILE: '/user/profile',
      UPDATE: '/user/update',
    },
    // Agregar más endpoints según necesites
  }
}

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Función helper para obtener headers con token de autenticación
export const getAuthHeaders = (token = null) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}
