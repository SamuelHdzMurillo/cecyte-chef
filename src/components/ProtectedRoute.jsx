import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('❌ Usuario no autenticado, redirigiendo al login...')
      navigate('/login')
    }
  }, [isAuthenticated, loading, navigate])

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

  if (!isAuthenticated) {
    return null // No mostrar nada mientras redirige
  }

  return children
}

export default ProtectedRoute
