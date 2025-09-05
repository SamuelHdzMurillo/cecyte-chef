import { API_CONFIG, buildApiUrl, getAuthHeaders } from '../config/env.js'

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  // Método genérico para hacer peticiones HTTP
  async request(endpoint, options = {}) {
    const url = buildApiUrl(endpoint)
    const config = {
      method: options.method || 'GET',
      ...options,
    }
    
    // Agregar headers de autenticación
    config.headers = { ...getAuthHeaders(options.token), ...config.headers }

    // Agregar timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // Intentar parsear JSON primero
      let data
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Manejar respuestas de error después de parsear
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`)
        error.response = {
          status: response.status,
          data: data
        }
        throw error
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado tiempo')
      }
      throw error
    }
  }

  // Métodos específicos para diferentes tipos de peticiones
  async get(endpoint, token = null) {
    return this.request(endpoint, { method: 'GET', token })
  }

  async post(endpoint, data, token = null) {
    const options = {
      method: 'POST',
      token
    }
    
    // Si es FormData, enviarlo directamente
    if (data instanceof FormData) {
      options.body = data
    } else {
      // Si es JSON, convertir y agregar header
      options.body = JSON.stringify(data)
      options.headers = { 'Content-Type': 'application/json' }
    }
    
    return this.request(endpoint, options)
  }

  async put(endpoint, data, token = null) {
    const options = {
      method: 'PUT',
      token
    }
    
    // Si es FormData, enviarlo directamente
    if (data instanceof FormData) {
      options.body = data
    } else {
      // Si es JSON, convertir y agregar header
      options.body = JSON.stringify(data)
      options.headers = { 'Content-Type': 'application/json' }
    }
    
    return this.request(endpoint, options)
  }

  async delete(endpoint, token = null) {
    return this.request(endpoint, { method: 'DELETE', token })
  }

  async patch(endpoint, data, token = null) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token
    })
  }
}

// Crear una instancia del servicio
const apiService = new ApiService()

export default apiService
