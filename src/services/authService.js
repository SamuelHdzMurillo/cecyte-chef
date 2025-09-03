import apiService from './apiService.js'
import { API_CONFIG } from '../config/env.js'

class AuthService {
  // Login del usuario
  async login(credentials) {
    try {
      console.log('🔐 Intentando login con credenciales:', { email: credentials.email })
      
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      )
      
      console.log('📡 Respuesta de la API:', response)
      
      // Buscar el token en diferentes estructuras de respuesta posibles
      let token = null
      let user = null
      
      // Estructura 1: response.token
      if (response.token) {
        token = response.token
        user = response.user
        console.log('✅ Token encontrado en response.token')
      }
      // Estructura 2: response.data.token
      else if (response.data && response.data.token) {
        token = response.data.token
        user = response.data.user
        console.log('✅ Token encontrado en response.data.token')
      }
      // Estructura 3: response.access_token
      else if (response.access_token) {
        token = response.access_token
        user = response.user
        console.log('✅ Token encontrado en response.access_token')
      }
      // Estructura 4: response.data.access_token
      else if (response.data && response.data.access_token) {
        token = response.data.access_token
        user = response.data.user
        console.log('✅ Token encontrado en response.data.access_token')
      }
      // Estructura 5: response.jwt
      else if (response.jwt) {
        token = response.jwt
        user = response.user
        console.log('✅ Token encontrado en response.jwt')
      }
      // Estructura 6: response.data.jwt
      else if (response.data && response.data.jwt) {
        token = response.data.jwt
        user = response.data.user
        console.log('✅ Token encontrado en response.data.jwt')
      }
      
      if (token) {
        localStorage.setItem('authToken', token)
        console.log('💾 Token guardado en localStorage')
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user))
          console.log('👤 Datos del usuario guardados en localStorage')
        }
        
        // Verificar que se guardó correctamente
        const savedToken = localStorage.getItem('authToken')
        console.log('🔍 Token verificado en localStorage:', savedToken ? '✅ Guardado' : '❌ No guardado')
      } else {
        console.warn('⚠️ No se encontró token en la respuesta de la API')
        console.log('🔍 Estructura completa de la respuesta:', JSON.stringify(response, null, 2))
      }
      
      return response
    } catch (error) {
      console.error('❌ Error en login:', error)
      throw error
    }
  }

  // Logout del usuario
  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {}, token)
      }
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      // Limpiar datos locales independientemente del resultado
      this.clearAuthData()
    }
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        userData
      )
      return response
    } catch (error) {
      console.error('Error en registro:', error)
      throw error
    }
  }

  // Refrescar token
  async refreshToken() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No hay token para refrescar')
      }

      const response = await apiService.post(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        {},
        token
      )

      if (response.token) {
        localStorage.setItem('authToken', response.token)
      }

      return response
    } catch (error) {
      console.error('Error al refrescar token:', error)
      this.clearAuthData()
      throw error
    }
  }

  // Obtener perfil del usuario
  async getUserProfile() {
    try {
      const token = this.getToken()
      if (!token) {
        throw new Error('No hay token de autenticación')
      }

      const response = await apiService.get(
        API_CONFIG.ENDPOINTS.USER.PROFILE,
        token
      )
      return response
    } catch (error) {
      console.error('Error al obtener perfil:', error)
      throw error
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    const token = this.getToken()
    const hasToken = !!token
    
    console.log('🔍 Verificando autenticación:', {
      hasToken,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'N/A'
    })
    
    return hasToken
  }
  
  // Método para debug del localStorage
  debugLocalStorage() {
    console.log('🔍 Debug del localStorage:')
    console.log('  - authToken:', localStorage.getItem('authToken') ? '✅ Presente' : '❌ Ausente')
    console.log('  - user:', localStorage.getItem('user') ? '✅ Presente' : '❌ Ausente')
    
    const token = localStorage.getItem('authToken')
    if (token) {
      console.log('  - Token preview:', `${token.substring(0, 20)}...`)
      console.log('  - Token length:', token.length)
    }
    
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        console.log('  - User data:', userData)
      } catch (e) {
        console.log('  - User data: Error al parsear JSON')
      }
    }
  }

  // Obtener token del localStorage
  getToken() {
    return localStorage.getItem('authToken')
  }

  // Obtener datos del usuario del localStorage
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }

  // Limpiar datos de autenticación
  clearAuthData() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  // Verificar si el token ha expirado (opcional)
  isTokenExpired() {
    const token = this.getToken()
    if (!token) return true

    try {
      // Decodificar JWT token (solo la parte del payload)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error al verificar expiración del token:', error)
      return true
    }
  }
}

// Crear una instancia del servicio
const authService = new AuthService()

export default authService
