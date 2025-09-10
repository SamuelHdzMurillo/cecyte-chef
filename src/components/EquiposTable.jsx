import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./EquiposTable.css";

const EquiposTable = ({ onEquipoSelect }) => {
  const navigate = useNavigate();
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [equiposPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filtros adicionales
  const [statusFilter, setStatusFilter] = useState("");
  const [entidadFilter, setEntidadFilter] = useState("");

  useEffect(() => {
    fetchEquipos();
  }, []);

  const fetchEquipos = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/equipos", token);

      if (response.data) {
        setEquipos(response.data);
        setError(null);
      } else {
        setEquipos([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener equipos:", err);
      setEquipos([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchEquipos();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted"></i>;
    }
    return sortDirection === "asc" ? (
      <i className="bi bi-arrow-up text-primary"></i>
    ) : (
      <i className="bi bi-arrow-down text-primary"></i>
    );
  };

  const handleViewDetails = (equipoId) => {
    if (onEquipoSelect) {
      onEquipoSelect(equipoId);
    } else {
      navigate(`/equipos/${equipoId}`);
    }
  };

  const filteredEquipos = equipos.filter((equipo) => {
    const matchesText =
      equipo.nombre_equipo?.toLowerCase().includes(filterText.toLowerCase()) ||
      equipo.nombre_anfitrion
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||
      equipo.entidad_federativa
        ?.toLowerCase()
        .includes(filterText.toLowerCase()) ||
      equipo.evento?.nombre_evento
        ?.toLowerCase()
        .includes(filterText.toLowerCase());

    const matchesStatus =
      !statusFilter || equipo.estatus_del_equipo === statusFilter;
    const matchesEntidad =
      !entidadFilter || equipo.entidad_federativa === entidadFilter;

    return matchesText && matchesStatus && matchesEntidad;
  });

  // Ordenar equipos
  const sortedEquipos = [...filteredEquipos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Manejar campos anidados
    if (sortField === "evento") {
      aValue = a.evento?.nombre_evento || "";
      bValue = b.evento?.nombre_evento || "";
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastEquipo = currentPage * equiposPerPage;
  const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage;
  const currentEquipos = sortedEquipos.slice(
    indexOfFirstEquipo,
    indexOfLastEquipo
  );
  const totalPages = Math.ceil(sortedEquipos.length / equiposPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      activo: "badge bg-success",
      inactivo: "badge bg-secondary",
      suspendido: "badge bg-warning",
      eliminado: "badge bg-danger",
    };
    return (
      <span className={statusClasses[status] || "badge bg-secondary"}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary-color)" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando equipos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar equipos</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="equipos-table-container">
      {/* Header principal del componente */}
      <div className="card border-0 shadow-sm mb-3">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-people-fill me-3"></i>
                Gestión de Equipos
              </h4>
              <p className="mb-0 opacity-75">
                Administra equipos participantes, sus integrantes, recetas y
                acompañantes
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={handleRefresh}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar
              </button>
            </div>
          </div>
        </div>
        <div
          className="card-body py-2"
          style={{ backgroundColor: "var(--primary-50)" }}
        >
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-info-circle me-2 fs-5"
                  style={{ color: "var(--primary-color)" }}
                ></i>
                <span className="text-muted">
                  Total: <strong className="text-dark">{equipos.length}</strong>{" "}
                  equipos registrados
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span
                className="badge fs-6 px-3 py-2"
                style={{ backgroundColor: "var(--success-color)" }}
              >
                <i className="bi bi-check-circle me-1"></i>
                Sistema Operativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header border-0 py-2"
          style={{ backgroundColor: "var(--primary-50)" }}
        >
          <h6 className="mb-0 fw-semibold text-white">
            <i className="bi bi-funnel me-2" style={{ color: "white" }}></i>
            Filtros de Búsqueda
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-search me-2 text-muted"></i>
                Buscar
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, anfitrión, entidad..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-flag me-2 text-muted"></i>
                Estatus
              </label>
              <select
                className="form-select form-select-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estatus</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
                <option value="eliminado">Eliminado</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                Entidad Federativa
              </label>
              <select
                className="form-select form-select-lg"
                value={entidadFilter}
                onChange={(e) => setEntidadFilter(e.target.value)}
              >
                <option value="">Todas las entidades</option>
                {Array.from(
                  new Set(equipos.map((e) => e.entidad_federativa))
                ).map((entidad) => (
                  <option key={entidad} value={entidad}>
                    {entidad}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100 py-2 px-3"
                onClick={() => {
                  setFilterText("");
                  setStatusFilter("");
                  setEntidadFilter("");
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header border-0 py-2"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <h6 className="mb-0 fw-semibold text-white">
            <i className="bi bi-table me-2" style={{ color: "white" }}></i>
            Lista de Equipos
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "200px" }}>
                    Nombre del Equipo
                  </th>
                  <th scope="col" style={{ width: "180px" }}>
                    Contacto
                  </th>
                  <th scope="col" style={{ width: "100px" }}>
                    Estatus
                  </th>
                  <th scope="col" style={{ width: "80px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEquipos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron equipos con los filtros actuales
                      </p>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setFilterText("");
                          setStatusFilter("");
                          setEntidadFilter("");
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentEquipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td>
                        <div
                          className="fw-bold text-truncate"
                          style={{ maxWidth: "150px" }}
                          title={equipo.nombre_equipo}
                        >
                          {equipo.nombre_equipo}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{equipo.nombre_anfitrion}</div>
                          <small
                            className="text-muted text-truncate d-block"
                            style={{ maxWidth: "160px" }}
                            title={equipo.entidad_federativa}
                          >
                            {equipo.entidad_federativa}
                          </small>
                        </div>
                      </td>
                      <td>{getStatusBadge(equipo.estatus_del_equipo)}</td>
                      <td>
                        <div className="event-actions">
                          <button
                            className="btn btn-sm"
                            title="Ver detalles"
                            onClick={() => handleViewDetails(equipo.id)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav aria-label="Navegación de páginas">
            <ul className="pagination pagination-lg">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link px-4 py-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Anterior
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <li
                    key={page}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link px-4 py-2"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link px-4 py-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default EquiposTable;
