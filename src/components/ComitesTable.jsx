import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./ComitesTable.css";

const ComitesTable = ({ onComiteSelect }) => {
  const navigate = useNavigate();
  const [comites, setComites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [comitesPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filtros adicionales
  const [rolFilter, setRolFilter] = useState("");
  const [eventoFilter, setEventoFilter] = useState("");

  useEffect(() => {
    fetchComites();
  }, []);

  const fetchComites = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/comites", token);

      if (response.data) {
        setComites(response.data);
        setError(null);
      } else {
        setComites([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener comités:", err);
      setComites([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchComites();
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

  const handleViewDetails = (comiteId) => {
    if (onComiteSelect) {
      onComiteSelect(comiteId);
    } else {
      navigate(`/comites/${comiteId}`);
    }
  };

  const filteredComites = comites.filter((comite) => {
    const matchesText =
      comite.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
      comite.rol?.toLowerCase().includes(filterText.toLowerCase()) ||
      comite.puesto?.toLowerCase().includes(filterText.toLowerCase()) ||
      comite.telefono?.toLowerCase().includes(filterText.toLowerCase()) ||
      comite.evento?.nombre_evento
        ?.toLowerCase()
        .includes(filterText.toLowerCase());

    const matchesRol = !rolFilter || comite.rol === rolFilter;
    const matchesEvento =
      !eventoFilter || comite.evento?.nombre_evento === eventoFilter;

    return matchesText && matchesRol && matchesEvento;
  });

  // Ordenar comités
  const sortedComites = [...filteredComites].sort((a, b) => {
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
  const indexOfLastComite = currentPage * comitesPerPage;
  const indexOfFirstComite = indexOfLastComite - comitesPerPage;
  const currentComites = sortedComites.slice(
    indexOfFirstComite,
    indexOfLastComite
  );
  const totalPages = Math.ceil(sortedComites.length / comitesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getRolBadge = (rol) => {
    const rolClasses = {
      Presidente: "badge bg-primary",
      Vicepresidente: "badge bg-info",
      Secretario: "badge bg-success",
      Tesorero: "badge bg-warning",
      Vocal: "badge bg-secondary",
      Coordinador: "badge bg-dark",
    };
    return (
      <span className={rolClasses[rol] || "badge bg-secondary"}>{rol}</span>
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
        <p className="mt-3">Cargando comités...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar comités</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="comites-table-container">
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
                Gestión de Comités
              </h4>
              <p className="mb-0 opacity-75">
                Administra los miembros del comité organizador, sus roles y
                responsabilidades
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
                  Total: <strong className="text-dark">{comites.length}</strong>{" "}
                  miembros del comité
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
                placeholder="Buscar por nombre, rol, puesto, teléfono..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-person-badge me-2 text-muted"></i>
                Rol
              </label>
              <select
                className="form-select form-select-lg"
                value={rolFilter}
                onChange={(e) => setRolFilter(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="Presidente">Presidente</option>
                <option value="Vicepresidente">Vicepresidente</option>
                <option value="Secretario">Secretario</option>
                <option value="Tesorero">Tesorero</option>
                <option value="Vocal">Vocal</option>
                <option value="Coordinador">Coordinador</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-calendar-event me-2 text-muted"></i>
                Evento
              </label>
              <select
                className="form-select form-select-lg"
                value={eventoFilter}
                onChange={(e) => setEventoFilter(e.target.value)}
              >
                <option value="">Todos los eventos</option>
                {Array.from(
                  new Set(comites.map((c) => c.evento?.nombre_evento))
                ).map((evento) => (
                  <option key={evento} value={evento}>
                    {evento}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100 py-2 px-3"
                onClick={() => {
                  setFilterText("");
                  setRolFilter("");
                  setEventoFilter("");
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de comités */}
      <div className="card shadow-sm border-0">
        <div
          className="card-header border-0 py-2"
          style={{ backgroundColor: "var(--bg-primary)" }}
        >
          <h6 className="mb-0 fw-semibold text-white">
            <i className="bi bi-table me-2" style={{ color: "white" }}></i>
            Lista de Comités
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort("id")}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Nombre</span>
                      {getSortIcon("nombre")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort("rol")}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Rol</span>
                      {getSortIcon("rol")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort("puesto")}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Puesto</span>
                      {getSortIcon("puesto")}
                    </div>
                  </th>
                  <th
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort("evento")}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Evento</span>
                      {getSortIcon("evento")}
                    </div>
                  </th>
                  <th className="border-0 py-3 px-3">
                    <span className="fw-semibold text-dark">Contacto</span>
                  </th>
                  <th className="border-0 py-3 px-3">
                    <span className="fw-semibold text-dark">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentComites.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
                        <h6 className="mb-2">No se encontraron comités</h6>
                        <p className="mb-0">
                          Intenta ajustar los filtros de búsqueda
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentComites.map((comite) => (
                    <tr key={comite.id} className="border-bottom">
                      <td className="py-3 px-3">
                        <span className="badge bg-secondary fs-6 px-3 py-2">
                          #{comite.id}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">
                            {comite.nombre}
                          </h6>
                        </div>
                      </td>
                      <td className="py-3 px-3">{getRolBadge(comite.rol)}</td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-semibold text-dark">
                            {comite.puesto}
                          </h6>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6
                            className="mb-1 fw-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {comite.evento?.nombre_evento}
                          </h6>
                          <small className="text-muted d-block">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(comite.evento?.inicio_evento)} -{" "}
                            {formatDate(comite.evento?.fin_evento)}
                          </small>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-semibold text-dark">
                            <i className="bi bi-telephone me-1"></i>
                            {comite.telefono}
                          </h6>
                          {comite.extension && (
                            <small className="text-muted d-block">
                              <i className="bi bi-hash me-1"></i>
                              Ext. {comite.extension}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary px-3 py-2"
                            onClick={() => handleViewDetails(comite.id)}
                            title="Ver detalles y editar"
                            style={{
                              color: "var(--text-primary)",
                              borderColor: "var(--text-primary)",
                            }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver
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

export default ComitesTable;
