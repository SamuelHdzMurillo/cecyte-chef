import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService.js'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      
      if (!authenticated) {
        console.log('❌ Usuario no autenticado, redirigiendo al login')
        navigate('/login', { replace: true })
        return
      }
      
      setIsAuthenticated(true)
      setLoading(false)
    }

    checkAuth()
  }, [navigate])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Verificando autenticación...</span>
          </div>
          <p className="mt-3">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : null
}

export default ProtectedRoute
