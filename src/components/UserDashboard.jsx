import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import Header from "./Header.jsx";
import EquiposTable from "./EquiposTable.jsx";
import UserEquipoDetalle from "./UserEquipoDetalle.jsx";
import UserBuzonAsistencia from "./UserBuzonAsistencia.jsx";
import UserAgregarAutoridad from "./UserAgregarAutoridad.jsx";
import UserAddParticipante from "./UserAddParticipante.jsx";
import UserAddAcompanante from "./UserAddAcompanante.jsx";
import UserAddReceta from "./UserAddReceta.jsx";
import "./Dashboard.css";
import { CECYTE_CHEF_SIN_FONDO } from "../assets/images";

function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("perfil");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
        const response = await fetch(
          `https://chef-api.cecytebcs.edu.mx/public/api/equipos/${user.equipo_id}`
        );
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
        throw new Error(
          `Error HTTP ${response.status}: ${response.statusText}`
        );
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
      const userEquipo = equipos.find(
        (equipo) =>
          equipo.participantes &&
          equipo.participantes.some(
            (participante) =>
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
          error: "No se encontró un equipo asociado a tu usuario",
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

  useEffect(() => {
    setLoading(false);
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
      case "perfil":
        return "Mi Perfil";
      case "equipos":
        return "Mis Equipos";
      case "buzon":
        return "Buzón de Asistencia";
      case "autoridad":
        return "Agregar Autoridad";
      case "participante":
        return "Agregar Participante";
      case "acompanante":
        return "Agregar Acompañante";
      case "receta":
        return "Agregar Receta";
      default:
        return "Mi Perfil";
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
                  src={CECYTE_CHEF_SIN_FONDO}
                  alt="CECyTE Chef Logo"
                  className="logo-image"
                />
              </div>
            </div>
          </div>

          <nav className="nav flex-column">
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
              </div>
            </div>

            {/* Gestión de Equipo */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-gear"></i>
                <span>Gestión de Equipo</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "participante" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("participante")}
                  href="#"
                >
                  <i className="bi bi-person-plus"></i>
                  <span>Agregar Participante</span>
                </a>
                <a
                  className={`nav-link ${
                    activeSection === "acompanante" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("acompanante")}
                  href="#"
                >
                  <i className="bi bi-person-plus"></i>
                  <span>Agregar Acompañante</span>
                </a>
                <a
                  className={`nav-link ${
                    activeSection === "receta" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("receta")}
                  href="#"
                >
                  <i className="bi bi-journal-plus"></i>
                  <span>Agregar Receta</span>
                </a>
              </div>
            </div>

            {/* Soporte y Asistencia */}
            <div className="nav-category">
              <div className="nav-category-header">
                <i className="bi bi-headset"></i>
                <span>Soporte</span>
              </div>
              <div className="nav-category-items">
                <a
                  className={`nav-link ${
                    activeSection === "buzon" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("buzon")}
                  href="#"
                >
                  <i className="bi bi-envelope"></i>
                  <span>Buzón de Asistencia</span>
                </a>
                <a
                  className={`nav-link ${
                    activeSection === "autoridad" ? "active" : ""
                  }`}
                  onClick={() => handleSectionChange("autoridad")}
                  href="#"
                >
                  <i className="bi bi-person-badge"></i>
                  <span>Agregar Autoridad</span>
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
          <Header activeSection={activeSection} />

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
                          <i
                            className="bi bi-person-circle"
                            style={{ fontSize: "5rem", color: "#6c757d" }}
                          ></i>
                        </div>
                        <h5>{user?.name || "Usuario"}</h5>
                        <p className="text-muted">Usuario del Sistema</p>
                      </div>
                      <div className="col-md-8">
                        <h6>Información Personal</h6>
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td>
                                <strong>Nombre:</strong>
                              </td>
                              <td>{user?.name || "No disponible"}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Email:</strong>
                              </td>
                              <td>{user?.email || "No disponible"}</td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Rol:</strong>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  Usuario
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <strong>Estado:</strong>
                              </td>
                              <td>
                                <span className="badge bg-success">Activo</span>
                              </td>
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
                          Si crees que esto es un error, contacta al
                          administrador.
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

          {/* Contenido de Buzón de Asistencia */}
          {activeSection === "buzon" && (
            <div className="row">
              <div className="col-12">
                <UserBuzonAsistencia />
              </div>
            </div>
          )}

          {/* Contenido de Agregar Autoridad */}
          {activeSection === "autoridad" && (
            <div className="row">
              <div className="col-12">
                <UserAgregarAutoridad />
              </div>
            </div>
          )}

          {/* Contenido de Agregar Participante */}
          {activeSection === "participante" && (
            <div className="row">
              <div className="col-12">
                <UserAddParticipante
                  equipoId={userEquipo.equipo?.id || null}
                  onParticipanteAdded={() => {
                    // Recargar datos del equipo si es necesario
                    fetchUserEquipo();
                  }}
                  onCancel={() => setActiveSection("equipos")}
                />
              </div>
            </div>
          )}

          {/* Contenido de Agregar Acompañante */}
          {activeSection === "acompanante" && (
            <div className="row">
              <div className="col-12">
                <UserAddAcompanante
                  equipoId={userEquipo.equipo?.id || null}
                  onAcompananteAdded={() => {
                    // Recargar datos del equipo si es necesario
                    fetchUserEquipo();
                  }}
                  onCancel={() => setActiveSection("equipos")}
                />
              </div>
            </div>
          )}

          {/* Contenido de Agregar Receta */}
          {activeSection === "receta" && (
            <div className="row">
              <div className="col-12">
                <UserAddReceta
                  equipoId={userEquipo.equipo?.id || null}
                  onRecetaAdded={() => {
                    // Recargar datos del equipo si es necesario
                    fetchUserEquipo();
                  }}
                  onCancel={() => setActiveSection("equipos")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
