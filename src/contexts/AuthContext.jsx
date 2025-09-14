import React, { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService.js'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const checkAuth = () => {
      try {
        const userData = authService.getUser()
        const isAuthenticated = authService.isAuthenticated()
        
        if (isAuthenticated && userData) {
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      const userData = authService.getUser()
      
      if (userData) {
        setUser(userData)
        return { success: true, user: userData }
      } else {
        throw new Error('No se pudieron obtener los datos del usuario')
      }
    } catch (error) {
      console.error('Error en login:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Error en logout:', error)
    } finally {
      setUser(null)
    }
  }

  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'administrador')
  }

  const isUser = () => {
    return user && user.role === 'usuario'
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
