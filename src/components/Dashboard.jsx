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
import HospedajeDetalle from "./HospedajeDetalle.jsx";
import ParticipantesTable from "./ParticipantesTable.jsx";
import RestaurantesTable from "./RestaurantesTable.jsx";
import RestauranteDetalle from "./RestauranteDetalle.jsx";
import LugaresInteresTable from "./LugaresInteresTable.jsx";
import LugarDetalle from "./LugarDetalle.jsx";
import BuzonAsistenciaTable from "./BuzonAsistenciaTable.jsx";
import Header from "./Header.jsx";
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
  const [selectedHospedajeId, setSelectedHospedajeId] = useState(null);
  const [selectedComiteId, setSelectedComiteId] = useState(null);
  const [selectedLugarId, setSelectedLugarId] = useState(null);

  // Estados para las estadísticas del dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalEquipos: 0,
    totalParticipantes: 0,
    totalAcompanantes: 0,
    totalRecetas: 0,
    loading: true,
    error: null,
  });

  // Estados para el buzón de asistencia
  const [buzonMensajes, setBuzonMensajes] = useState({
    mensajes: [],
    loading: true,
    error: null,
  });

  // Estados para usuarios no admin
  const [usuariosNoAdmin, setUsuariosNoAdmin] = useState({
    usuarios: [],
    loading: true,
    error: null,
  });

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
        // Estructura: { success: true, data: [...] }
        equipos = responseData.data;
      } else if (Array.isArray(responseData)) {
        // Estructura: [...] (array directo)
        equipos = responseData;
      } else if (responseData && typeof responseData === "object") {
        // Si es un objeto individual, lo convertimos a array
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

  // Función para obtener mensajes pendientes del buzón de asistencia
  const fetchBuzonMensajes = async () => {
    try {
      setBuzonMensajes((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch(
        "http://127.0.0.1:8000/api/buzon-asistencia"
      );
      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Verificar la estructura de la respuesta
      let mensajes;
      if (responseData.success && Array.isArray(responseData.data)) {
        mensajes = responseData.data;
      } else if (Array.isArray(responseData)) {
        mensajes = responseData;
      } else {
        mensajes = [];
      }

      // Filtrar solo los mensajes pendientes
      const mensajesPendientes = mensajes.filter(
        (mensaje) => mensaje.estado === "pendiente"
      );

      setBuzonMensajes({
        mensajes: mensajesPendientes,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error al obtener mensajes del buzón:", error);
      setBuzonMensajes((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  // Función para obtener usuarios no admin
  const fetchUsuariosNoAdmin = async () => {
    try {
      setUsuariosNoAdmin((prev) => ({ ...prev, loading: true, error: null }));

      const response = await fetch("http://127.0.0.1:8000/api/admin/users");
      if (!response.ok) {
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();

      // Verificar la estructura de la respuesta
      let usuarios;
      if (responseData.success && Array.isArray(responseData.data)) {
        usuarios = responseData.data;
      } else if (Array.isArray(responseData)) {
        usuarios = responseData;
      } else {
        usuarios = [];
      }

      // Filtrar solo usuarios que no sean admin
      const usuariosFiltrados = usuarios.filter(
        (usuario) => usuario.role !== "admin"
      );

      setUsuariosNoAdmin({
        usuarios: usuariosFiltrados,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setUsuariosNoAdmin((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    // Obtener datos del usuario ya que la autenticación la verifica ProtectedRoute
    const userData = authService.getUser();
    setUser(userData);
    setLoading(false);

    // Obtener estadísticas de equipos
    fetchEquiposStats();

    // Obtener mensajes pendientes del buzón
    fetchBuzonMensajes();

    // Obtener usuarios no admin
    fetchUsuariosNoAdmin();
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
    setSelectedHospedajeId(null); // Limpiar hospedaje seleccionado al cambiar sección
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

  const handleHospedajeSelect = (hospedajeId) => {
    setSelectedHospedajeId(hospedajeId);
  };

  const handleBackToHospedajes = () => {
    setSelectedHospedajeId(null);
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
                className="btn btn-link nav-link dropdown-toggle text-white d-flex flex-column align-items-start"
                type="button"
                data-bs-toggle="dropdown"
                style={{ minWidth: "150px", textAlign: "left" }}
              >
                <div className="fw-bold">{user?.name || "Usuario"}</div>
                <small className="opacity-75">
                  {user?.role === "admin" || user?.role === "administrador" 
                    ? "Administrador" 
                    : "Usuario"}
                </small>
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
            selectedItem={
              selectedEquipoId || 
              selectedRestauranteId || 
              selectedHospedajeId || 
              selectedComiteId || 
              selectedLugarId
            }
            onBack={
              selectedEquipoId ? handleBackToEquipos :
              selectedRestauranteId ? handleBackToRestaurantes :
              selectedHospedajeId ? handleBackToHospedajes :
              selectedComiteId ? handleBackToComites :
              selectedLugarId ? handleBackToLugares :
              null
            }
          />

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
                        <div className="col mr-2">
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
              </div>

              {/* Mensaje de error si hay problemas con la API */}
              {dashboardStats.error && (
                <div className="row">
                  <div className="col-12">
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Error al cargar estadísticas:</strong>{" "}
                      {dashboardStats.error}
                      <button
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={fetchEquiposStats}
                      >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Reintentar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabla de Buzón de Asistencia - Mensajes Pendientes */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-left-primary shadow h-100">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                      <h6 className="m-0 font-weight-bold">
                        <i className="bi bi-inbox me-2"></i>
                        Buzón de Asistencia - Mensajes Pendientes
                      </h6>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleSectionChange("buzon")}
                      >
                        <i className="bi bi-arrow-right me-1"></i>
                        Ver Todos
                      </button>
                    </div>
                    <div className="card-body">
                      {buzonMensajes.loading ? (
                        <div className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="mt-2 text-muted">
                            Cargando mensajes...
                          </p>
                        </div>
                      ) : buzonMensajes.error ? (
                        <div className="alert alert-danger" role="alert">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          <strong>Error:</strong> {buzonMensajes.error}
                          <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={fetchBuzonMensajes}
                          >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Reintentar
                          </button>
                        </div>
                      ) : buzonMensajes.mensajes.length === 0 ? (
                        <div className="text-center py-4">
                          <i
                            className="bi bi-check-circle text-success"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <p className="mt-2 text-muted">
                            No hay mensajes pendientes
                          </p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th
                                  className="text-center"
                                  style={{ width: "80px" }}
                                >
                                  ID
                                </th>
                                <th>Nombre/Email</th>
                                <th>Mensaje</th>
                                <th
                                  className="text-center"
                                  style={{ width: "120px" }}
                                >
                                  Fecha
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {buzonMensajes.mensajes
                                .slice(0, 5)
                                .map((mensaje) => (
                                  <tr key={mensaje.id}>
                                    <td className="text-center">
                                      <span className="badge bg-secondary text-white">
                                        {mensaje.id}
                                      </span>
                                    </td>
                                    <td>
                                      <div>
                                        <div className="fw-bold">
                                          {mensaje.correo_electronico}
                                        </div>
                                        {mensaje.telefono && (
                                          <small className="text-muted">
                                            <i className="bi bi-telephone me-1"></i>
                                            {mensaje.telefono}
                                          </small>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="mensaje-preview">
                                        {mensaje.mensaje.length > 80
                                          ? `${mensaje.mensaje.substring(
                                              0,
                                              80
                                            )}...`
                                          : mensaje.mensaje}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <small className="text-muted">
                                        {new Date(
                                          mensaje.created_at
                                        ).toLocaleDateString("es-ES", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "2-digit",
                                        })}
                                      </small>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {buzonMensajes.mensajes.length > 5 && (
                            <div className="text-center mt-3">
                              <small className="text-muted">
                                Mostrando 5 de {buzonMensajes.mensajes.length}{" "}
                                mensajes pendientes
                              </small>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabla de Usuarios No Admin */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-left-primary shadow h-100">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                      <h6 className="m-0 font-weight-bold">
                        <i className="bi bi-people me-2"></i>
                        Usuarios del Sistema (No Admin)
                      </h6>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => handleSectionChange("usuarios")}
                      >
                        <i className="bi bi-arrow-right me-1"></i>
                        Ver Todos
                      </button>
                    </div>
                    <div className="card-body">
                      {usuariosNoAdmin.loading ? (
                        <div className="text-center py-4">
                          <div
                            className="spinner-border text-primary"
                            role="status"
                          >
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="mt-2 text-muted">
                            Cargando usuarios...
                          </p>
                        </div>
                      ) : usuariosNoAdmin.error ? (
                        <div className="alert alert-danger" role="alert">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          <strong>Error:</strong> {usuariosNoAdmin.error}
                          <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={fetchUsuariosNoAdmin}
                          >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            Reintentar
                          </button>
                        </div>
                      ) : usuariosNoAdmin.usuarios.length === 0 ? (
                        <div className="text-center py-4">
                          <i
                            className="bi bi-person-x text-muted"
                            style={{ fontSize: "3rem" }}
                          ></i>
                          <p className="mt-2 text-muted">
                            No hay usuarios registrados
                          </p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead className="table-light">
                              <tr>
                                <th
                                  className="text-center"
                                  style={{ width: "80px" }}
                                >
                                  ID
                                </th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th
                                  className="text-center"
                                  style={{ width: "120px" }}
                                >
                                  Rol
                                </th>
                                <th
                                  className="text-center"
                                  style={{ width: "120px" }}
                                >
                                  Estado
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {usuariosNoAdmin.usuarios
                                .slice(0, 5)
                                .map((usuario) => (
                                  <tr key={usuario.id}>
                                    <td className="text-center">
                                      <span className="badge bg-secondary text-white">
                                        {usuario.id}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="d-flex align-items-center">
                                        
                                        <div>
                                          <div className="fw-bold">
                                            {usuario.name}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div>
                                        <div>{usuario.email}</div>
                                        {usuario.email_verified_at && (
                                          <small className="text-success">
                                            <i className="bi bi-check-circle-fill me-1"></i>
                                            Verificado
                                          </small>
                                        )}
                                      </div>
                                    </td>
                                    <td className="text-center">
                                      <span className="badge bg-secondary text-white">
                                        {usuario.role === "usuario"
                                          ? "Usuario"
                                          : usuario.role}
                                      </span>
                                    </td>
                                    <td className="text-center">
                                      {usuario.email_verified_at ? (
                                        <span className="badge bg-success text-white">
                                          <i className="bi bi-check-circle me-1"></i>
                                          Activo
                                        </span>
                                      ) : (
                                        <span className="badge bg-warning text-dark">
                                          <i className="bi bi-clock me-1"></i>
                                          Pendiente
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {usuariosNoAdmin.usuarios.length > 5 && (
                            <div className="text-center mt-3">
                              <small className="text-muted">
                                Mostrando 5 de {usuariosNoAdmin.usuarios.length}{" "}
                                usuarios
                              </small>
                            </div>
                          )}
                        </div>
                      )}
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
          {activeSection === "hospedajes" && !selectedHospedajeId && (
            <HospedajesTable onHospedajeSelect={handleHospedajeSelect} />
          )}

          {/* Detalle del Hospedaje */}
          {activeSection === "hospedajes" && selectedHospedajeId && (
            <HospedajeDetalle
              hospedajeId={selectedHospedajeId}
              onBack={handleBackToHospedajes}
              embedded={true}
            />
          )}

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
