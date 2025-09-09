import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import "./ParticipantesTable.css";

function ParticipantesTable() {
  const navigate = useNavigate();
  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRol, setFilterRol] = useState("");
  const [filterPlantel, setFilterPlantel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const fetchParticipantes = async () => {
    try {
      setLoading(true);

      const response = await apiService.get("/participantes");

      // La API devuelve { "data": [...] }
      const data = response.data || response;

      if (Array.isArray(data)) {
        setParticipantes(data);
        setError(null);
      } else {
        console.error("Los datos no son un array:", data);
        setError("Formato de datos incorrecto");
        setParticipantes([]);
      }
    } catch (err) {
      console.error("Error al obtener participantes:", err);
      setError(`Error al cargar los participantes: ${err.message}`);
      setParticipantes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (participanteId) => {
    navigate(`/dashboard/participantes/${participanteId}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterRol = (e) => {
    setFilterRol(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterPlantel = (e) => {
    setFilterPlantel(e.target.value);
    setCurrentPage(1);
  };

  // Filtrar participantes
  const filteredParticipantes = participantes.filter((participante) => {
    const matchesSearch =
      participante.nombre_participante
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participante.matricula_participante
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participante.correo_participante
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRol =
      filterRol === "" || participante.rol_participante === filterRol;
    const matchesPlantel =
      filterPlantel === "" ||
      participante.plantel_participante === filterPlantel;

    return matchesSearch && matchesRol && matchesPlantel;
  });

  // Obtener roles únicos para el filtro
  const rolesUnicos = [
    ...new Set(participantes.map((p) => p.rol_participante)),
  ];

  // Obtener planteles únicos para el filtro
  const plantelesUnicos = [
    ...new Set(participantes.map((p) => p.plantel_participante)),
  ];

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipantes = filteredParticipantes.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredParticipantes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <p className="mt-3">Cargando participantes...</p>
        <small className="text-muted">Verificando conexión con la API...</small>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar participantes</h4>
        <p>{error}</p>
        <hr />
        <div className="mb-3">
          <small className="text-muted">
            <strong>Información de depuración:</strong>
            <br />• Estado de carga: {loading ? "Cargando" : "Completado"}
            <br />• Participantes cargados: {participantes.length}
            <br />• Última actualización: {new Date().toLocaleTimeString()}
          </small>
        </div>
        <button className="btn btn-outline-danger" onClick={fetchParticipantes}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    );
  }

  // Verificar si no hay participantes
  if (!loading && !error && participantes.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-people fs-1 text-muted mb-3"></i>
        <h4 className="text-muted">No hay participantes registrados</h4>
        <p className="text-muted">
          No se encontraron participantes en el sistema.
        </p>
        <button className="btn btn-primary" onClick={fetchParticipantes}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <div className="events-table">
      <div className="card shadow-sm">
        <div
          className="card-header text-white"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 text-white">
              <i className="bi bi-person-badge-fill me-2"></i>
              Gestión de Participantes
            </h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light"
                onClick={fetchParticipantes}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {/* Estadísticas */}
          <div className="event-stats">
            <div className="stat-card">
              <div className="stat-number">{participantes.length}</div>
              <div className="stat-label">Total Participantes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {participantes.filter((p) => p.seguro_facultativo).length}
              </div>
              <div className="stat-label">Con Seguro</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {participantes.filter((p) => p.alergico).length}
              </div>
              <div className="stat-label">Con Alergias</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {[...new Set(participantes.map((p) => p.equipo_id))].length}
              </div>
              <div className="stat-label">Equipos Activos</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="event-filters">
            <div className="filter-row">
              <div className="filter-group">
                <label htmlFor="searchFilter">Buscar</label>
                <input
                  type="text"
                  id="searchFilter"
                  className="form-control"
                  placeholder="Buscar por nombre, matrícula o correo..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="rolFilter">Rol</label>
                <select
                  id="rolFilter"
                  className="form-select"
                  value={filterRol}
                  onChange={handleFilterRol}
                >
                  <option value="">Todos los roles</option>
                  {rolesUnicos.map((rol) => (
                    <option key={rol} value={rol}>
                      {rol}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="plantelFilter">Plantel</label>
                <select
                  id="plantelFilter"
                  className="form-select"
                  value={filterPlantel}
                  onChange={handleFilterPlantel}
                >
                  <option value="">Todos los planteles</option>
                  {plantelesUnicos.map((plantel) => (
                    <option key={plantel} value={plantel}>
                      {plantel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de participantes */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: "200px" }}>
                    Participante
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    Equipo
                  </th>
                  <th scope="col" style={{ width: "100px" }}>
                    Rol
                  </th>
                  <th scope="col" style={{ width: "150px" }}>
                    Plantel
                  </th>
                  <th scope="col" style={{ width: "180px" }}>
                    Contacto
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    Estado
                  </th>
                  <th scope="col" style={{ width: "80px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentParticipantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron participantes con los filtros actuales
                      </p>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setSearchTerm("");
                          setFilterRol("");
                          setFilterPlantel("");
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentParticipantes.map((participante) => (
                    <tr key={participante.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <div className="avatar-placeholder">
                              {participante.foto_credencial ? (
                                <img
                                  src={`/uploads/${participante.foto_credencial}`}
                                  alt={participante.nombre_participante}
                                  className="avatar-img"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display =
                                      "block";
                                  }}
                                />
                              ) : null}
                              <div
                                className="avatar-fallback"
                                style={{
                                  display: participante.foto_credencial
                                    ? "none"
                                    : "block",
                                }}
                              >
                                {participante.nombre_participante
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div
                              className="fw-bold text-truncate"
                              style={{ maxWidth: "150px" }}
                              title={participante.nombre_participante}
                            >
                              {participante.nombre_participante}
                            </div>
                            <small className="text-muted">
                              {participante.matricula_participante}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">
                          {participante.equipo?.nombre_equipo || "Sin equipo"}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info">
                          {participante.rol_participante}
                        </span>
                      </td>
                      <td>
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "130px" }}
                          title={participante.plantel_participante}
                        >
                          <div className="fw-bold">
                            {participante.plantel_participante}
                          </div>
                          <small className="text-muted">
                            {participante.plantelcct}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{participante.telefono_participante}</div>
                          <small
                            className="text-muted text-truncate d-block"
                            style={{ maxWidth: "160px" }}
                            title={participante.correo_participante}
                          >
                            {participante.correo_participante}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {participante.seguro_facultativo && (
                            <span className="badge bg-success">Seguro</span>
                          )}
                          {participante.alergico && (
                            <span className="badge bg-warning text-dark">
                              Alergias
                            </span>
                          )}
                          <span className="badge bg-secondary">
                            {participante.semestre_participante}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="event-actions">
                          <button
                            className="btn btn-sm"
                            title="Ver detalles"
                            onClick={() => handleVerDetalle(participante.id)}
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

          {/* Paginación */}
          {totalPages > 1 && (
            <nav aria-label="Navegación de páginas">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(number)}
                      >
                        {number}
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
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default ParticipantesTable;
