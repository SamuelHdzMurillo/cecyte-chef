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
      headers: getAuthHeaders(options.token),
      ...options,
    }

    // Agregar timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      // Manejar respuestas de error
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Intentar parsear JSON, si falla devolver texto
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
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
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      token
    })
  }

  async put(endpoint, data, token = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      token
    })
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
