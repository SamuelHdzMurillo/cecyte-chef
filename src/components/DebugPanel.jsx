import React, { useState, useEffect } from 'react'
import authService from '../services/authService.js'

function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  const updateDebugInfo = () => {
    const token = localStorage.getItem('authToken')
    const user = localStorage.getItem('user')
    
    setDebugInfo({
      token: {
        exists: !!token,
        length: token ? token.length : 0,
        preview: token ? `${token.substring(0, 20)}...` : 'N/A',
        full: token || 'N/A'
      },
      user: {
        exists: !!user,
        data: user ? JSON.parse(user) : null
      },
      isAuthenticated: authService.isAuthenticated()
    })
  }

  useEffect(() => {
    updateDebugInfo()
    // Actualizar cada 2 segundos
    const interval = setInterval(updateDebugInfo, 2000)
    return () => clearInterval(interval)
  }, [])

  const clearStorage = () => {
    authService.clearAuthData()
    updateDebugInfo()
    alert('LocalStorage limpiado')
  }

  const testAuth = () => {
    authService.debugLocalStorage()
  }

  if (!isVisible) {
    return (
      <button
        className="btn btn-outline-info position-fixed"
        style={{ top: '20px', right: '20px', zIndex: 9999 }}
        onClick={() => setIsVisible(true)}
      >
        🐛 Debug
      </button>
    )
  }

  return (
    <div className="position-fixed" style={{ top: '20px', right: '20px', zIndex: 9999, maxWidth: '400px' }}>
      <div className="card bg-dark text-light">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="mb-0">🐛 Panel de Debug</h6>
          <button
            className="btn-close btn-close-white"
            onClick={() => setIsVisible(false)}
          ></button>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <h6>🔐 Token:</h6>
            <div className="small">
              <div>Estado: {debugInfo.token?.exists ? '✅ Presente' : '❌ Ausente'}</div>
              <div>Longitud: {debugInfo.token?.length}</div>
              <div>Preview: {debugInfo.token?.preview}</div>
            </div>
          </div>
          
          <div className="mb-3">
            <h6>👤 Usuario:</h6>
            <div className="small">
              <div>Estado: {debugInfo.user?.exists ? '✅ Presente' : '❌ Ausente'}</div>
              {debugInfo.user?.data && (
                <div>Datos: {JSON.stringify(debugInfo.user.data, null, 2)}</div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <h6>🔍 Autenticación:</h6>
            <div className="small">
              Estado: {debugInfo.isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
            </div>
          </div>
          
          <div className="d-grid gap-2">
            <button className="btn btn-sm btn-outline-warning" onClick={testAuth}>
              🔍 Verificar Auth
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={clearStorage}>
              🗑️ Limpiar Storage
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={updateDebugInfo}>
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugPanel
