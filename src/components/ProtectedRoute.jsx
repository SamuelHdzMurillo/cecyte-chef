import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService.js'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si el usuario está autenticado
        if (!authService.isAuthenticated()) {
          console.log('❌ Usuario no autenticado, redirigiendo al login...')
          navigate('/login')
          return
        }
        
        console.log('✅ Usuario autenticado, permitiendo acceso al dashboard')
        setLoading(false)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        navigate('/login')
      }
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
        <p className="mt-3">Verificando autenticación...</p>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
