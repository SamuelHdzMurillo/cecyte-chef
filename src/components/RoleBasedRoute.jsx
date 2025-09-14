import React from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import AdminDashboard from './Dashboard.jsx'
import UserDashboard from './UserDashboard.jsx'

const RoleBasedRoute = () => {
  const { user, loading, isAdmin, isUser } = useAuth()

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div
          className="spinner-border"
          style={{ color: "var(--primary-color)" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Verificando permisos...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Error:</strong> No se pudo verificar la autenticación del usuario.
        </div>
      </div>
    )
  }

  // Mostrar dashboard de administrador
  if (isAdmin()) {
    return <AdminDashboard />
  }

  // Mostrar dashboard de usuario regular
  if (isUser()) {
    return <UserDashboard />
  }

  // Si el rol no es reconocido, mostrar mensaje de error
  return (
    <div className="dashboard-loading">
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <strong>Advertencia:</strong> Tu rol de usuario no está reconocido. 
        Contacta al administrador del sistema.
        <br />
        <small className="text-muted">Rol actual: {user.role || 'No definido'}</small>
      </div>
    </div>
  )
}

export default RoleBasedRoute
