import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService.js'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    // Obtener datos del usuario
    const userData = authService.getUser()
    setUser(userData)
  }, [])

  useEffect(() => {
    // Detectar cambios en el tamaño de la ventana
    const handleResize = () => {
      if (window.innerWidth <= 768 && !sidebarCollapsed) {
        setSidebarCollapsed(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarCollapsed])

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/')
    } catch (error) {
      console.error('Error en logout:', error)
      // Forzar logout local
      authService.clearAuthData()
      navigate('/')
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section)
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // En móviles, siempre mostrar el sidebar completo
  const isMobile = window.innerWidth <= 768
  const effectiveSidebarCollapsed = isMobile ? false : sidebarCollapsed

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'dashboard': return 'Dashboard'
      case 'cursos': return 'Mis Cursos'
      case 'recetas': return 'Recetas'
      case 'progreso': return 'Mi Progreso'
      case 'comunidad': return 'Comunidad'
      default: return 'Dashboard'
    }
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <>
                          {renderSectionContent()}
          </>
        )
      
      case 'cursos':
        return (
          <div className="row">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Mis Cursos</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="bi bi-book fs-1 text-primary mb-3"></i>
                          <h5 className="card-title">Cocina Básica</h5>
                          <p className="card-text">Fundamentos de la cocina profesional</p>
                          <div className="progress mb-3">
                            <div className="progress-bar" style={{width: '75%'}}>75%</div>
                          </div>
                          <button className="btn btn-primary btn-sm">Continuar</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="bi bi-award fs-1 text-success mb-3"></i>
                          <h5 className="card-title">Salsas del Mundo</h5>
                          <p className="card-text">Técnicas avanzadas de salsas</p>
                          <div className="progress mb-3">
                            <div className="progress-bar bg-success" style={{width: '100%'}}>100%</div>
                          </div>
                          <span className="badge bg-success">Completado</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-body text-center">
                          <i className="bi bi-egg-fried fs-1 text-warning mb-3"></i>
                          <h5 className="card-title">Panadería Artesanal</h5>
                          <p className="card-text">El arte del pan casero</p>
                          <div className="progress mb-3">
                            <div className="progress-bar bg-warning" style={{width: '45%'}}>45%</div>
                          </div>
                          <button className="btn btn-warning btn-sm">Continuar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'recetas':
        return (
          <div className="row">
            <div className="col-12">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Recetas Favoritas</h6>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <img src="https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Pasta+Carbonara" className="card-img-top" alt="Pasta Carbonara" />
                        <div className="card-body">
                          <h5 className="card-title">Pasta Carbonara</h5>
                          <p className="card-text">Clásica receta italiana con huevos y queso</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-primary">Italiana</span>
                            <small className="text-muted">30 min</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <img src="https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Paella" className="card-img-top" alt="Paella" />
                        <div className="card-body">
                          <h5 className="card-title">Paella Valenciana</h5>
                          <p className="card-text">Arroz español con mariscos y azafrán</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-success">Española</span>
                            <small className="text-muted">45 min</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <img src="https://via.placeholder.com/300x200/45b7d1/ffffff?text=Tiramisu" className="card-img-top" alt="Tiramisu" />
                        <div className="card-body">
                          <h5 className="card-title">Tiramisú</h5>
                          <p className="card-text">Postre italiano con café y mascarpone</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="badge bg-warning">Postre</span>
                            <small className="text-muted">20 min</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'progreso':
        return (
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Progreso General</h6>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <h6>Cocina Básica</h6>
                    <div className="progress mb-2">
                      <div className="progress-bar" style={{width: '75%'}}>75%</div>
                    </div>
                    <small className="text-muted">15 de 20 lecciones completadas</small>
                  </div>
                  <div className="mb-4">
                    <h6>Salsas del Mundo</h6>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-success" style={{width: '100%'}}>100%</div>
                    </div>
                    <small className="text-muted">20 de 20 lecciones completadas</small>
                  </div>
                  <div className="mb-4">
                    <h6>Panadería Artesanal</h6>
                    <div className="progress mb-2">
                      <div className="progress-bar bg-warning" style={{width: '45%'}}>45%</div>
                    </div>
                    <small className="text-muted">9 de 20 lecciones completadas</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Estadísticas</h6>
                </div>
                <div className="card-body">
                  <div className="text-center">
                    <div className="display-4 text-primary mb-2">68%</div>
                    <p className="text-muted">Progreso Total</p>
                    <div className="row text-center">
                      <div className="col-6">
                        <div className="h4 text-success">3</div>
                        <small>Cursos Iniciados</small>
                      </div>
                      <div className="col-6">
                        <div className="h4 text-info">24h</div>
                        <small>Tiempo Total</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'comunidad':
        return (
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Foro de Discusión</h6>
                </div>
                <div className="card-body">
                  <div className="list-group list-group-flush">
                    <div className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">¿Cómo mejorar mi técnica de corte?</h6>
                        <small className="text-muted">Hace 2 horas</small>
                      </div>
                      <p className="mb-1">Estoy practicando con cebollas pero no me salen bien los cortes...</p>
                      <small className="text-muted">Por: Chef María</small>
                    </div>
                    <div className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">Receta de pan sin gluten</h6>
                        <small className="text-muted">Ayer</small>
                      </div>
                      <p className="mb-1">Alguien tiene una buena receta de pan sin gluten?</p>
                      <small className="text-muted">Por: Juan Pérez</small>
                    </div>
                    <div className="list-group-item">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">Consejos para salsas espesas</h6>
                        <small className="text-muted">Hace 3 días</small>
                      </div>
                      <p className="mb-1">¿Cuál es la mejor manera de espesar una salsa?</p>
                      <small className="text-muted">Por: Ana García</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card shadow">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Chefs Destacados</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <img src="https://via.placeholder.com/50x50/ff6b6b/ffffff?text=CM" className="rounded-circle me-3" alt="Chef María" />
                    <div>
                      <h6 className="mb-0">Chef María</h6>
                      <small className="text-muted">Especialista en Pastelería</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <img src="https://via.placeholder.com/50x50/4ecdc4/ffffff?text=JP" className="rounded-circle me-3" alt="Juan Pérez" />
                    <div>
                      <h6 className="mb-0">Juan Pérez</h6>
                      <small className="text-muted">Chef de Cocina</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <img src="https://via.placeholder.com/50x50/45b7d1/ffffff?text=AG" className="rounded-circle me-3" alt="Ana García" />
                    <div>
                      <h6 className="mb-0">Ana García</h6>
                      <small className="text-muted">Especialista en Salsas</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }



  return (
    <div className="dashboard-container">
      {/* Navbar del Dashboard */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container-fluid">
          <button 
            className="btn btn-link text-white me-3 d-md-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list fs-4"></i>
          </button>
          
          <button 
            className="btn btn-link text-white me-3 d-none d-md-block"
            onClick={toggleSidebar}
          >
            <i className={`bi ${effectiveSidebarCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'} fs-4`}></i>
          </button>
          
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-egg-fried me-2"></i>
            {!effectiveSidebarCollapsed && <span>CecyteChef Dashboard</span>}
          </a>
          
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle me-2"></i>
                {user?.name || user?.email || 'Usuario'}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Mi Perfil</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Configuración</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay para móvil */}
      <div className={`sidebar-overlay ${!effectiveSidebarCollapsed ? 'show' : ''}`} onClick={toggleSidebar}></div>
      
      {/* Contenido principal */}
      <div className={`dashboard-content ${effectiveSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className={`sidebar ${effectiveSidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                      onClick={() => handleSectionChange('dashboard')}
                    >
                      <i className="bi bi-speedometer2"></i>
                      {!effectiveSidebarCollapsed && <span className="ms-2">Dashboard</span>}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeSection === 'cursos' ? 'active' : ''}`}
                      onClick={() => handleSectionChange('cursos')}
                    >
                      <i className="bi bi-book"></i>
                      {!effectiveSidebarCollapsed && <span className="ms-2">Mis Cursos</span>}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeSection === 'recetas' ? 'active' : ''}`}
                      onClick={() => handleSectionChange('recetas')}
                    >
                      <i className="bi bi-journal-text"></i>
                      {!effectiveSidebarCollapsed && <span className="ms-2">Recetas</span>}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeSection === 'progreso' ? 'active' : ''}`}
                      onClick={() => handleSectionChange('progreso')}
                    >
                      <i className="bi bi-graph-up"></i>
                      {!effectiveSidebarCollapsed && <span className="ms-2">Mi Progreso</span>}
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeSection === 'comunidad' ? 'active' : ''}`}
                      onClick={() => handleSectionChange('comunidad')}
                    >
                      <i className="bi bi-people"></i>
                      {!effectiveSidebarCollapsed && <span className="ms-2">Comunidad</span>}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contenido principal */}
            <main className="main-content">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{getSectionTitle()}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                  <div className="btn-group me-2">
                    <button type="button" className="btn btn-sm btn-outline-secondary">Compartir</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary">Exportar</button>
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                    <i className="bi bi-calendar3 me-1"></i>
                    Esta semana
                  </button>
                </div>
              </div>

              {/* Tarjetas de estadísticas */}
              <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Cursos Completados
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">3</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-check-circle-fill fa-2x text-success"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-success shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            En Progreso
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">2</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-play-circle-fill fa-2x text-primary"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-info shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                            Horas de Estudio
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">24</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-clock-fill fa-2x text-info"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            Certificados
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">1</div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-award-fill fa-2x text-warning"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido del dashboard */}
              <div className="row">
                <div className="col-lg-8">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Próximas Lecciones</h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Técnicas de Corte Avanzadas</h6>
                            <small className="text-muted">Curso: Cocina Profesional</small>
                          </div>
                          <span className="badge bg-primary rounded-pill">Hoy</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Salsas Clásicas Francesas</h6>
                            <small className="text-muted">Curso: Salsas del Mundo</small>
                          </div>
                          <span className="badge bg-info rounded-pill">Mañana</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Pan Artesanal</h6>
                            <small className="text-muted">Curso: Panadería Básica</small>
                          </div>
                          <span className="badge bg-secondary rounded-pill">Próxima semana</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card shadow mb-4">
                    <div className="card-header py-3">
                      <h6 className="m-0 font-weight-bold text-primary">Actividad Reciente</h6>
                    </div>
                    <div className="card-body">
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-marker bg-success"></div>
                          <div className="timeline-content">
                            <h6 className="timeline-title">Completaste "Cuchillos Básicos"</h6>
                            <p className="timeline-text">Hace 2 horas</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-marker bg-primary"></div>
                          <div className="timeline-content">
                            <h6 className="timeline-title">Iniciaste "Salsas del Mundo"</h6>
                            <p className="timeline-text">Ayer</p>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-marker bg-warning"></div>
                          <div className="timeline-content">
                            <h6 className="timeline-title">Obtuviste certificado</h6>
                            <p className="timeline-text">Hace 3 días</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
