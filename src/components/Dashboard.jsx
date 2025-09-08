import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import UsersTable from "./UsersTable.jsx";
import EventsTable from "./EventsTable.jsx";
import ComitesTable from "./ComitesTable.jsx";
import ComiteDetalle from "./ComiteDetalle.jsx";
import EquiposTable from "./EquiposTable.jsx";
import EquipoDetalle from "./EquipoDetalle.jsx";
import HospedajesTable from "./HospedajesTable.jsx";
import ParticipantesTable from "./ParticipantesTable.jsx";
import RestaurantesTable from "./RestaurantesTable.jsx";
import RestauranteDetalle from "./RestauranteDetalle.jsx";
import LugaresInteresTable from "./LugaresInteresTable.jsx";
import LugarDetalle from "./LugarDetalle.jsx";
import BuzonAsistenciaTable from "./BuzonAsistenciaTable.jsx";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedEquipoId, setSelectedEquipoId] = useState(null);
  const [selectedRestauranteId, setSelectedRestauranteId] = useState(null);
  const [selectedComiteId, setSelectedComiteId] = useState(null);
  const [selectedLugarId, setSelectedLugarId] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario ya que la autenticación la verifica ProtectedRoute
    const userData = authService.getUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error en logout:", error);
      authService.clearAuthData();
      navigate("/login");
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedEquipoId(null); // Limpiar equipo seleccionado al cambiar sección
    setSelectedRestauranteId(null); // Limpiar restaurante seleccionado al cambiar sección
    setSelectedComiteId(null); // Limpiar comité seleccionado al cambiar sección
    setSelectedLugarId(null); // Limpiar lugar seleccionado al cambiar sección
    // En móviles, cerrar el sidebar después de seleccionar una sección
    if (window.innerWidth <= 768) {
      setSidebarMobileOpen(false);
    }
  };

  const handleEquipoSelect = (equipoId) => {
    setSelectedEquipoId(equipoId);
  };

  const handleBackToEquipos = () => {
    setSelectedEquipoId(null);
  };

  const handleRestauranteSelect = (restauranteId) => {
    setSelectedRestauranteId(restauranteId);
  };

  const handleBackToRestaurantes = () => {
    setSelectedRestauranteId(null);
  };

  const handleComiteSelect = (comiteId) => {
    setSelectedComiteId(comiteId);
  };

  const handleBackToComites = () => {
    setSelectedComiteId(null);
  };

  const handleLugarSelect = (lugarId) => {
    setSelectedLugarId(lugarId);
  };

  const handleBackToLugares = () => {
    setSelectedLugarId(null);
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
        return "Dashboard";
      case "usuarios":
        return "Usuarios del Sistema";
      case "buzon":
        return "Buzón de Asistencia";
      case "eventos":
        return "Eventos del Sistema";
      case "comite":
        return "Comité del Sistema";
      case "equipos":
        return "Equipos del Sistema";
      case "participantes":
        return "Participantes del Sistema";
      case "restaurantes":
        return "Restaurantes";
      case "hospedajes":
        return "Hospedajes del Sistema";
      case "lugares":
        return "Lugares de Interés";
      default:
        return "Dashboard";
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
              <span>Dashboard</span>
            </a>

            {/* Administración */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-gear-fill"></i>
                <span>Administración</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "usuarios" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("usuarios")}
                  href="#"
                >
                  <i className="bi bi-people"></i>
                  <span>Usuarios</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "buzon" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("buzon")}
                  href="#"
                >
                  <i className="bi bi-inbox"></i>
                  <span>Buzón de Asistencia</span>
                </a>
              </div>
            </div>

            {/* Logística */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-clipboard-data"></i>
                <span>Logística</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "eventos" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("eventos")}
                  href="#"
                >
                  <i className="bi bi-calendar-event"></i>
                  <span>Eventos</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "comite" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("comite")}
                  href="#"
                >
                  <i className="bi bi-people-fill"></i>
                  <span>Comité</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "equipos" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("equipos")}
                  href="#"
                >
                  <i className="bi bi-people-fill"></i>
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

            {/* Sitio Público */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-globe"></i>
                <span>Sitio Público</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "restaurantes" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("restaurantes")}
                  href="#"
                >
                  <i className="bi bi-cup-hot"></i>
                  <span>Restaurantes</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "hospedajes" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("hospedajes")}
                  href="#"
                >
                  <i className="bi bi-building"></i>
                  <span>Hospedajes</span>
                </a>

                <a
                  className={`nav-link ${
                    activeSection === "lugares" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("lugares")}
                  href="#"
                >
                  <i className="bi bi-geo-alt"></i>
                  <span>Lugares de Interés</span>
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

          <span className="navbar-brand">Cecyte Chef Dashboard</span>
          <div className="navbar-nav ms-auto">
            <div className="nav-item dropdown">
              <button
                className="btn btn-link nav-link dropdown-toggle text-white"
                type="button"
                data-bs-toggle="dropdown"
              >
                {user?.name || "Usuario"}
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
          {/* Título de la sección */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h3 mb-0">{getSectionTitle()}</h2>
          </div>

          {/* Contenido del Dashboard */}
          {activeSection === "dashboard" && (
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
                          <p className="text-muted">
                            Administra todos los eventos del sistema, crea
                            nuevos eventos, gestiona equipos y participantes.
                          </p>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleSectionChange("eventos")}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Eventos
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-primary">Gestión de Usuarios</h6>
                          <p className="text-muted">
                            Administra usuarios del sistema, roles, permisos y
                            configuraciones de cuenta.
                          </p>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSectionChange("usuarios")}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Usuarios
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-success">Gestión de Equipos</h6>
                          <p className="text-muted">
                            Administra equipos participantes, sus integrantes,
                            recetas y acompañantes.
                          </p>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleSectionChange("equipos")}
                          >
                            <i className="bi bi-arrow-right me-2"></i>
                            Ir a Equipos
                          </button>
                        </div>
                        <div className="col-md-4">
                          <h6 className="text-info">Gestión de Hospedajes</h6>
                          <p className="text-muted">
                            Administra hoteles y lugares de hospedaje para los
                            participantes del evento.
                          </p>
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => handleSectionChange("hospedajes")}
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
          {activeSection === "eventos" && <EventsTable />}

          {/* Contenido de Comités */}
          {activeSection === "comite" && !selectedComiteId && (
            <ComitesTable onComiteSelect={handleComiteSelect} />
          )}

          {/* Detalle del Comité */}
          {activeSection === "comite" && selectedComiteId && (
            <ComiteDetalle
              comiteId={selectedComiteId}
              onBack={handleBackToComites}
              embedded={true}
            />
          )}

          {/* Contenido de Equipos */}
          {activeSection === "equipos" && !selectedEquipoId && (
            <EquiposTable onEquipoSelect={handleEquipoSelect} />
          )}

          {/* Detalle del Equipo */}
          {activeSection === "equipos" && selectedEquipoId && (
            <EquipoDetalle
              equipoId={selectedEquipoId}
              onBack={handleBackToEquipos}
              embedded={true}
            />
          )}

          {/* Contenido de Hospedajes */}
          {activeSection === "hospedajes" && <HospedajesTable />}

          {/* Contenido de Usuarios */}
          {activeSection === "usuarios" && <UsersTable />}

          {/* Contenido de Participantes */}
          {activeSection === "participantes" && <ParticipantesTable />}

          {/* Contenido de Buzón de Asistencia */}
          {activeSection === "buzon" && <BuzonAsistenciaTable />}

          {/* Contenido de Restaurantes */}
          {activeSection === "restaurantes" && !selectedRestauranteId && (
            <RestaurantesTable onRestauranteSelect={handleRestauranteSelect} />
          )}

          {/* Detalle del Restaurante */}
          {activeSection === "restaurantes" && selectedRestauranteId && (
            <RestauranteDetalle
              restauranteId={selectedRestauranteId}
              onBack={handleBackToRestaurantes}
              embedded={true}
            />
          )}

          {/* Contenido de Lugares de Interés */}
          {activeSection === "lugares" && !selectedLugarId && (
            <LugaresInteresTable onLugarSelect={handleLugarSelect} />
          )}

          {/* Detalle del Lugar */}
          {activeSection === "lugares" && selectedLugarId && (
            <LugarDetalle
              lugarId={selectedLugarId}
              onBack={handleBackToLugares}
              embedded={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
