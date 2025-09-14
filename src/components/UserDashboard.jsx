import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Header from "./Header.jsx";
import EquiposTable from "./EquiposTable.jsx";
import UserEquipoDetalle from "./UserEquipoDetalle.jsx";
import "./Dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para las estadísticas del dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalEquipos: 0,
    totalParticipantes: 0,
    totalAcompanantes: 0,
    totalRecetas: 0,
    loading: true,
    error: null,
  });

  // Estados para el equipo del usuario
  const [userEquipo, setUserEquipo] = useState({
    equipo: null,
    loading: true,
    error: null,
  });

  // Función para obtener el equipo del usuario
  const fetchUserEquipo = async () => {
    try {
      setUserEquipo((prev) => ({ ...prev, loading: true, error: null }));

      // Primero intentar con equipo_id directo
      if (user?.equipo_id) {
        const response = await fetch(`http://127.0.0.1:8000/api/equipos/${user.equipo_id}`);
        if (response.ok) {
          const responseData = await response.json();
          let equipo;
          if (responseData.success && responseData.data) {
            equipo = responseData.data;
          } else if (responseData) {
            equipo = responseData;
          }
          
          if (equipo) {
            setUserEquipo({
              equipo: equipo,
              loading: false,
              error: null,
            });
            return;
          }
        }
      }

      // Si no tiene equipo_id o no se encontró, buscar por email en participantes
      const response = await fetch("http://127.0.0.1:8000/api/equipos");
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      let equipos;
      if (responseData.success && Array.isArray(responseData.data)) {
        equipos = responseData.data;
      } else if (Array.isArray(responseData)) {
        equipos = responseData;
      } else {
        throw new Error("Formato de respuesta inesperado");
      }

      // Buscar el equipo donde el usuario sea participante
      const userEquipo = equipos.find(equipo => 
        equipo.participantes && equipo.participantes.some(participante => 
          participante.correo_participante === user?.email ||
          participante.nombre_participante === user?.name
        )
      );

      if (userEquipo) {
        setUserEquipo({
          equipo: userEquipo,
          loading: false,
          error: null,
        });
      } else {
        setUserEquipo({
          equipo: null,
          loading: false,
          error: "No se encontró un equipo asociado a tu usuario"
        });
      }
    } catch (error) {
      console.error("Error al obtener equipo del usuario:", error);
      setUserEquipo({
        equipo: null,
        loading: false,
        error: error.message,
      });
    }
  };

  // Función para obtener estadísticas de equipos
  const fetchEquiposStats = async () => {
    try {
      setDashboardStats((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("http://127.0.0.1:8000/api/equipos");
      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Verificar la estructura de la respuesta
      let equipos;
      if (responseData.success && Array.isArray(responseData.data)) {
        equipos = responseData.data;
      } else if (Array.isArray(responseData)) {
        equipos = responseData;
      } else if (responseData && typeof responseData === "object") {
        equipos = [responseData];
      } else {
        throw new Error("Formato de respuesta inesperado");
      }

      // Calcular estadísticas
      const totalEquipos = equipos.length;
      const totalParticipantes = equipos.reduce(
        (acc, equipo) => acc + (equipo.participantes?.length || 0),
        0
      );
      const totalAcompanantes = equipos.reduce(
        (acc, equipo) => acc + (equipo.acompanantes?.length || 0),
        0
      );
      const totalRecetas = equipos.reduce(
        (acc, equipo) => acc + (equipo.recetas?.length || 0),
        0
      );

      setDashboardStats({
        totalEquipos,
        totalParticipantes,
        totalAcompanantes,
        totalRecetas,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      setDashboardStats((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    setLoading(false);
    fetchEquiposStats();
    fetchUserEquipo();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error en logout:", error);
      navigate("/login");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedEquipoId(null); // Limpiar equipo seleccionado al cambiar sección
    // En móviles, cerrar el sidebar después de seleccionar una sección
    if (window.innerWidth <= 768) {
      setSidebarMobileOpen(false);
    }
  };



  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarMobileOpen(!sidebarMobileOpen);
  };

  // En móviles, siempre mostrar el sidebar completo
  const isMobile = window.innerWidth <= 768;
  const effectiveSidebarCollapsed = isMobile ? false : sidebarCollapsed;

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Mi Dashboard";
      case "perfil":
        return "Mi Perfil";
      case "equipos":
        return "Mis Equipos";
      case "participantes":
        return "Participantes";
      default:
        return "Mi Dashboard";
    }
  };

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
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div
        className={`sidebar ${effectiveSidebarCollapsed ? "collapsed" : ""} ${
          sidebarMobileOpen ? "show" : ""
        }`}
      >
        <div className="sidebar-sticky">
          {/* Logo del sistema */}
          <div className="sidebar-logo">
            <div className="logo-container">
              <div className="logo-icon">
                <img
                  src="/src/assets/cecyte_chef_sin fondo.png"
                  alt="CECyTE Chef Logo"
                  className="logo-image"
                />
              </div>
            </div>
          </div>

          <nav className="nav flex-column">
            <a
              className={`nav-link ${
                activeSection === "dashboard" ? "active" : ""
              }`}
              onClick={() => handleSectionChange("dashboard")}
              href="#"
            >
              <i className="bi bi-speedometer2"></i>
              <span>Mi Dashboard</span>
            </a>

            {/* Perfil de Usuario */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-person"></i>
                <span>Mi Cuenta</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "perfil" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("perfil")}
                  href="#"
                >
                  <i className="bi bi-person-circle"></i>
                  <span>Mi Perfil</span>
                </a>
              </div>
            </div>

            {/* Información del Evento */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-info-circle"></i>
                <span>Información</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "equipos" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("equipos")}
                  href="#"
                >
                  <i className="bi bi-people"></i>
                  <span>Equipos</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "participantes" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("participantes")}
                  href="#"
                >
                  <i className="bi bi-person-check"></i>
                  <span>Participantes</span>
                </a>
              </div>
            </div>

          </nav>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className={`navbar navbar-expand-lg navbar-dark ${
          effectiveSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
        style={{ backgroundColor: "var(--primary-color)" }}
      >
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

          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle text-white d-flex flex-column align-items-start"
                type="button"
                data-bs-toggle="dropdown"
                style={{ minWidth: "150px", textAlign: "left" }}
              >
                <div className="fw-bold">{user?.name || "Usuario"}</div>
                <small className="opacity-75">Usuario</small>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay para móvil */}
      {sidebarMobileOpen && (
        <div
          className="sidebar-overlay show"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Contenido del Dashboard */}
      <div
        className={`dashboard-content ${
          effectiveSidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >
        <div className="main-content">
          {/* Header con breadcrumb */}
          <Header 
            activeSection={activeSection}
          />

          {/* Contenido del Dashboard */}
          {activeSection === "dashboard" && (
            <>
              <div className="row">
                <div className="col-12">
                  <div className="card border-left-primary shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Bienvenido, {user?.name || "Usuario"}
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            Panel de Usuario - CecyteChef
                          </div>
                          <p className="text-muted mt-2">
                            Aquí puedes ver información general del evento y acceder a las diferentes secciones disponibles.
                          </p>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-person-circle fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-primary shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            Total Equipos
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {dashboardStats.loading ? (
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Cargando...
                                </span>
                              </div>
                            ) : dashboardStats.error ? (
                              <span className="text-danger">
                                Error: {dashboardStats.error}
                              </span>
                            ) : (
                              dashboardStats.totalEquipos
                            )}
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
                  <div className="card border-left-success shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="col mr-2">
                          <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                            Total Participantes
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {dashboardStats.loading ? (
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Cargando...
                                </span>
                              </div>
                            ) : dashboardStats.error ? (
                              <span className="text-danger">Error</span>
                            ) : (
                              dashboardStats.totalParticipantes
                            )}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-person-check fa-2x text-gray-300"></i>
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
                            Total Acompañantes
                          </div>
                          <div className="h5 mb-0 font-weight-bold text-gray-800">
                            {dashboardStats.loading ? (
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Cargando...
                                </span>
                              </div>
                            ) : dashboardStats.error ? (
                              <span className="text-danger">Error</span>
                            ) : (
                              dashboardStats.totalAcompanantes
                            )}
                          </div>
                        </div>
                        <div className="col-auto">
                          <i className="bi bi-people-fill fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                  <div className="card border-left-warning shadow h-100 py-2 dashboard-card">
                    <div className="card-body">
                      <div className="row no-gutters align-items-center">
                        <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                          Total Recetas
                        </div>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {dashboardStats.loading ? (
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Cargando...
                              </span>
                            </div>
                          ) : dashboardStats.error ? (
                            <span className="text-danger">Error</span>
                          ) : (
                            dashboardStats.totalRecetas
                          )}
                        </div>
                      </div>
                      <div className="col-auto">
                        <i className="bi bi-book fa-2x text-gray-300"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información adicional para usuarios */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-left-info shadow h-100">
                    <div className="card-header bg-info text-white">
                      <h6 className="m-0 font-weight-bold">
                        <i className="bi bi-info-circle me-2"></i>
                        Información del Usuario
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Datos de tu cuenta:</h6>
                          <ul className="list-unstyled">
                            <li><strong>Nombre:</strong> {user?.name || "No disponible"}</li>
                            <li><strong>Email:</strong> {user?.email || "No disponible"}</li>
                            <li><strong>Rol:</strong> Usuario</li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6>Funciones disponibles:</h6>
                          <ul className="list-unstyled">
                            <li><i className="bi bi-check text-success me-2"></i>Ver información de equipos</li>
                            <li><i className="bi bi-check text-success me-2"></i>Consultar participantes</li>
                            <li><i className="bi bi-check text-success me-2"></i>Ver estadísticas del evento</li>
                            <li><i className="bi bi-check text-success me-2"></i>Gestionar perfil personal</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Contenido de Perfil */}
          {activeSection === "perfil" && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary text-white">
                    <h6 className="m-0 font-weight-bold">
                      <i className="bi bi-person-circle me-2"></i>
                      Mi Perfil
                    </h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 text-center">
                        <div className="mb-3">
                          <i className="bi bi-person-circle" style={{ fontSize: "5rem", color: "#6c757d" }}></i>
                        </div>
                        <h5>{user?.name || "Usuario"}</h5>
                        <p className="text-muted">Usuario del Sistema</p>
                      </div>
                      <div className="col-md-8">
                        <h6>Información Personal</h6>
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td><strong>Nombre:</strong></td>
                              <td>{user?.name || "No disponible"}</td>
                            </tr>
                            <tr>
                              <td><strong>Email:</strong></td>
                              <td>{user?.email || "No disponible"}</td>
                            </tr>
                            <tr>
                              <td><strong>Rol:</strong></td>
                              <td><span className="badge bg-secondary">Usuario</span></td>
                            </tr>
                            <tr>
                              <td><strong>Estado:</strong></td>
                              <td><span className="badge bg-success">Activo</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contenido de Equipos */}
          {activeSection === "equipos" && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary text-white">
                    <h6 className="m-0 font-weight-bold">
                      <i className="bi bi-people me-2"></i>
                      Mi Equipo
                    </h6>
                  </div>
                  <div className="card-body">
                    {userEquipo.loading ? (
                      <div className="text-center py-4">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2 text-muted">
                          Cargando información del equipo...
                        </p>
                      </div>
                    ) : userEquipo.error ? (
                      <div className="alert alert-warning" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <strong>Información:</strong> {userEquipo.error}
                        <br />
                        <small className="text-muted">
                          Si crees que esto es un error, contacta al administrador.
                        </small>
                      </div>
                    ) : userEquipo.equipo ? (
                      <UserEquipoDetalle
                        equipoId={userEquipo.equipo.id}
                        onBack={() => setActiveSection("dashboard")}
                        embedded={true}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <i className="bi bi-people fs-1 text-muted mb-3 d-block opacity-50"></i>
                        <p className="text-muted mb-0">
                          No se encontró información del equipo
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Contenido de Participantes */}
          {activeSection === "participantes" && (
            <div className="row">
              <div className="col-12">
                <div className="card shadow">
                  <div className="card-header bg-primary text-white">
                    <h6 className="m-0 font-weight-bold">
                      <i className="bi bi-person-check me-2"></i>
                      Participantes del Evento
                    </h6>
                  </div>
                  <div className="card-body">
                    <p className="text-muted">
                      Aquí puedes ver información sobre los participantes del evento.
                      Esta funcionalidad estará disponible próximamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
