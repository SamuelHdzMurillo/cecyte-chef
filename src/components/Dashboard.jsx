import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService.js'
import UsersTable from './UsersTable.jsx'
import EventsTable from './EventsTable.jsx'
import EquiposTable from './EquiposTable.jsx'
import HospedajesTable from './HospedajesTable.jsx'
import ParticipantesTable from './ParticipantesTable.jsx'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener datos del usuario ya que la autenticación la verifica ProtectedRoute
    const userData = authService.getUser()
    setUser(userData)
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Error en logout:', error)
      authService.clearAuthData()
      navigate('/login')
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
    // En móviles, cerrar el sidebar después de seleccionar una sección
    if (window.innerWidth <= 768) {
      setSidebarMobileOpen(false)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const toggleMobileSidebar = () => {
    setSidebarMobileOpen(!sidebarMobileOpen)
  }

  // En móviles, siempre mostrar el sidebar completo
  const isMobile = window.innerWidth <= 768
  const effectiveSidebarCollapsed = isMobile ? false : sidebarCollapsed

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard'
      case 'eventos': return 'Eventos del Sistema'
      case 'equipos': return 'Equipos del Sistema'
      case 'hospedajes': return 'Hospedajes del Sistema'
      case 'usuarios': return 'Usuarios del Sistema'
      case 'participantes': return 'Participantes del Sistema'
      case 'estadisticas': return 'Estadísticas'
      case 'configuracion': return 'Configuración'
      default: return 'Dashboard'
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{backgroundColor: 'var(--primary-color)'}}>
        <div className="container-fluid">
          {/* Botón para móvil */}
          <button 
            className="btn btn-link text-white d-lg-none me-2"
            onClick={toggleMobileSidebar}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          
          {/* Botón para desktop */}
          <button 
            className="btn btn-link text-white d-none d-lg-block me-2"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          
          <span className="navbar-brand">Cecyte Chef Dashboard</span>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button className="btn btn-link nav-link dropdown-toggle text-white" type="button" data-bs-toggle="dropdown">
                {user?.name || 'Usuario'}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${effectiveSidebarCollapsed ? 'collapsed' : ''} ${sidebarMobileOpen ? 'show' : ''}`}>
        <div className="sidebar-sticky">
          <nav className="nav flex-column">
            <a 
              className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleSectionChange('dashboard')}
              href="#"
            >
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'eventos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('eventos')}
              href="#"
            >
              <i className="bi bi-calendar-event"></i>
              <span>Eventos</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'equipos' ? 'active' : ''}`}
              onClick={() => handleSectionChange('equipos')}
              href="#"
            >
              <i className="bi bi-people-fill"></i>
              <span>Equipos</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'hospedajes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('hospedajes')}
              href="#"
            >
              <i className="bi bi-building"></i>
              <span>Hospedajes</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'usuarios' ? 'active' : ''}`}
              onClick={() => handleSectionChange('usuarios')}
              href="#"
            >
              <i className="bi bi-people"></i>
              <span>Usuarios</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'participantes' ? 'active' : ''}`}
              onClick={() => handleSectionChange('participantes')}
              href="#"
            >
              <i className="bi bi-person-check"></i>
              <span>Participantes</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'estadisticas' ? 'active' : ''}`}
              onClick={() => handleSectionChange('estadisticas')}
              href="#"
            >
              <i className="bi bi-graph-up"></i>
              <span>Estadísticas</span>
            </a>
            
            <a 
              className={`nav-link ${activeSection === 'configuracion' ? 'active' : ''}`}
              onClick={() => handleSectionChange('configuracion')}
              href="#"
            >
              <i className="bi bi-gear"></i>
              <span>Configuración</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Overlay para móvil */}
      {sidebarMobileOpen && (
        <div 
          className="sidebar-overlay show" 
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Contenido del Dashboard */}
      <div className={`dashboard-content ${effectiveSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="main-content">
          {/* Título de la sección */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">{getSectionTitle()}</h2>
          </div>

          {/* Contenido del Dashboard */}
          {activeSection === 'dashboard' && (
            <>
              <div className="row">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Eventos
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            <i className="bi bi-calendar-event me-2"></i>
                            Eventos del Sistema
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-calendar-event fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Eventos Activos
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            <i className="bi bi-check-circle me-2"></i>
                            En Curso
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-check-circle fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Total Equipos
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            <i className="bi bi-people me-2"></i>
                            Equipos Registrados
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-people fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Participantes
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            <i className="bi bi-person-check me-2"></i>
                            Total Registrados
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-person-check fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acceso rápido a Eventos */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-left-info shadow h-100 quick-access-card">
                    <div className="card-header bg-info text-white">
                      <h6 className="m-0 font-weight-bold">
                        <i className="bi bi-lightning me-2"></i>
                        Acceso Rápido a Eventos
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="text-info">Gestión de Eventos</h6>
                          <p className="text-muted">Administra todos los eventos del sistema, crea nuevos eventos, gestiona equipos y participantes.</p>
                          <button 
                            className="btn btn-info btn-sm"
                            onClick={() => handleSectionChange('eventos')}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Eventos
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-primary">Gestión de Usuarios</h6>
                          <p className="text-muted">Administra usuarios del sistema, roles, permisos y configuraciones de cuenta.</p>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSectionChange('usuarios')}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Usuarios
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-success">Gestión de Equipos</h6>
                          <p className="text-muted">Administra equipos participantes, sus integrantes, recetas y acompañantes.</p>
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleSectionChange('equipos')}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Equipos
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-info">Gestión de Hospedajes</h6>
                          <p className="text-muted">Administra hoteles y lugares de hospedaje para los participantes del evento.</p>
                          <button 
                            className="btn btn-info btn-sm"
                            onClick={() => handleSectionChange('hospedajes')}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Hospedajes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contenido de Eventos */}
          {activeSection === 'eventos' && (
            <EventsTable />
          )}

          {/* Contenido de Equipos */}
          {activeSection === 'equipos' && (
            <EquiposTable />
          )}

          {/* Contenido de Hospedajes */}
          {activeSection === 'hospedajes' && (
            <HospedajesTable />
          )}

          {/* Contenido de Usuarios */}
          {activeSection === 'usuarios' && (
            <UsersTable />
          )}

          {/* Contenido de Participantes */}
          {activeSection === 'participantes' && (
            <ParticipantesTable />
          )}

          {/* Contenido de Estadísticas */}
          {activeSection === 'estadisticas' && (
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Estadísticas del Sistema</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Actividad de Usuarios</h5>
                    <p>Gráfico de actividad diaria de usuarios</p>
                    <div className="bg-light p-3 rounded text-center">
                      <i className="bi bi-graph-up fs-1 text-primary"></i>
                      <p className="mt-2">Gráfico de Actividad</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Uso del Sistema</h5>
                    <p>Métricas de uso por sección</p>
                    <div className="bg-light p-3 rounded text-center">
                      <i className="bi bi-pie-chart fs-1 text-success"></i>
                      <p className="mt-2">Métricas de Uso</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido de Configuración */}
          {activeSection === 'configuracion' && (
            <div className="card">
              <div className="card-header">
                <h6 className="m-0 font-weight-bold text-primary">Configuración del Sistema</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Configuración General</h5>
                    <div className="mb-3">
                      <label className="form-label">Nombre del Sistema</label>
                      <input type="text" className="form-control" defaultValue="Cecyte Chef" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Versión</label>
                      <input type="text" className="form-control" defaultValue="2.1.0" disabled />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h5>Notificaciones</h5>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                      <label className="form-check-label">Email de notificaciones</label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" defaultChecked />
                      <label className="form-check-label">Notificaciones push</label>
                    </div>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" />
                      <label className="form-check-label">Reportes semanales</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
