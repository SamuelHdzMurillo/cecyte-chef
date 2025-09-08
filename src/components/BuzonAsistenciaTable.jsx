import React, { useState, useEffect } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./BuzonAsistenciaTable.css";

const BuzonAsistenciaTable = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mensajesPerPage] = useState(10);
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Estados para el modal de detalles
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMensaje, setSelectedMensaje] = useState(null);

  // Estados para el modal de cambio de estado
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    estado: "atendido",
    atendido: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/buzon-asistencia", token);

      if (response.data) {
        setMensajes(response.data);
        setError(null);
      } else {
        setMensajes([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener mensajes del buzón:", err);
      setMensajes([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchMensajes();
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
      <i
        className="bi bi-arrow-up"
        style={{ color: "var(--primary-color)" }}
      ></i>
    ) : (
      <i
        className="bi bi-arrow-down"
        style={{ color: "var(--primary-color)" }}
      ></i>
    );
  };

  const filteredMensajes = mensajes.filter(
    (mensaje) =>
      (mensaje.correo_electronico &&
        mensaje.correo_electronico
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (mensaje.mensaje &&
        mensaje.mensaje.toLowerCase().includes(filterText.toLowerCase())) ||
      (mensaje.evento?.nombre_evento &&
        mensaje.evento.nombre_evento
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (mensaje.estado &&
        mensaje.estado.toLowerCase().includes(filterText.toLowerCase()))
  );

  const sortedMensajes = [...filteredMensajes].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "created_at" || sortField === "updated_at") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastMensaje = currentPage * mensajesPerPage;
  const indexOfFirstMensaje = indexOfLastMensaje - mensajesPerPage;
  const currentMensajes = sortedMensajes.slice(
    indexOfFirstMensaje,
    indexOfLastMensaje
  );
  const totalPages = Math.ceil(sortedMensajes.length / mensajesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getEstadoBadgeColor = (estado) => {
    switch (estado) {
      case "en_proceso":
        return "warning";
      case "resuelto":
        return "success";
      case "pendiente":
        return "info";
      case "cancelado":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getEstadoDisplayName = (estado) => {
    switch (estado) {
      case "en_proceso":
        return "En Proceso";
      case "resuelto":
        return "Resuelto";
      case "pendiente":
        return "Pendiente";
      case "cancelado":
        return "Cancelado";
      default:
        return estado;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewMensaje = (mensaje) => {
    setSelectedMensaje(mensaje);
    setShowDetailsModal(true);
  };

  const handleCambiarEstado = (mensaje) => {
    setSelectedMensaje(mensaje);
    setStatusData({
      estado: mensaje.estado,
      atendido: mensaje.atendido,
    });
    setShowStatusModal(true);
  };

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target;
    const newStatusData = {
      ...statusData,
      [name]: value,
    };

    // Actualizar el campo atendido basado en el estado seleccionado
    if (name === "estado") {
      newStatusData.atendido = value === "resuelto";
    }

    setStatusData(newStatusData);
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const token = authService.getToken();

      // Llamar a la API para actualizar el estado
      const response = await apiService.put(
        `/buzon-asistencia/${selectedMensaje.id}`,
        {
          estado: statusData.estado,
          atendido: statusData.atendido,
        },
        token
      );

      if (response.success) {
        // Actualizar la lista local con los datos del servidor
        const updatedMensajes = mensajes.map((mensaje) =>
          mensaje.id === selectedMensaje.id
            ? {
                ...mensaje,
                estado: statusData.estado,
                atendido: statusData.atendido,
                updated_at: new Date().toISOString(),
              }
            : mensaje
        );

        setMensajes(updatedMensajes);
        setShowStatusModal(false);
        setSelectedMensaje(null);

        alert("Estado actualizado exitosamente");
      } else {
        alert("Error al actualizar el estado. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert("Error al actualizar el estado. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMensaje(null);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedMensaje(null);
    setStatusData({
      estado: "atendido",
      atendido: true,
    });
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button
          className="btn btn-sm ms-3"
          style={{
            backgroundColor: "var(--danger-color)",
            borderColor: "var(--danger-color)",
            color: "white",
          }}
          onClick={handleRefresh}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary-color)" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando buzón de asistencia...</p>
      </div>
    );
  }

  // Si no hay mensajes y no hay error, mostrar mensaje
  if (mensajes.length === 0) {
    return (
      <div className="card">
        <div
          className="card-header"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: "white" }}>
              <i className="bi bi-inbox me-2"></i>
              Buzón de Asistencia
            </h5>
            <button
              className="btn"
              style={{
                backgroundColor: "white",
                borderColor: "white",
                color: "var(--primary-color)",
              }}
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>
        </div>
        <div className="card-body text-center py-5">
          <i className="bi bi-inbox fs-1 text-muted d-block mb-3"></i>
          <p className="text-muted mb-3">No hay mensajes en el buzón</p>
          <p className="text-muted small">
            Los mensajes de asistencia aparecerán aquí cuando los usuarios los
            envíen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div
          className="card-header"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: "white" }}>
              <i className="bi bi-inbox me-2"></i>
              Buzón de Asistencia
            </h5>
            <button
              className="btn btn-outline-light"
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* Barra de búsqueda */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por email, mensaje, evento o estado..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
                {filterText && (
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      borderColor: "var(--secondary-color)",
                      color: "white",
                    }}
                    type="button"
                    onClick={() => setFilterText("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Mostrando {currentMensajes.length} de {filteredMensajes.length}{" "}
                mensajes
              </span>
            </div>
          </div>

          {/* Tabla de mensajes */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th
                    scope="col"
                    style={{ width: "70px", cursor: "pointer" }}
                    onClick={() => handleSort("id")}
                  >
                    <div className="d-flex align-items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("correo_electronico")}
                  >
                    <div className="d-flex align-items-center">
                      Email {getSortIcon("correo_electronico")}
                    </div>
                  </th>
                  <th scope="col" style={{ width: "200px" }}>
                    Evento
                  </th>
                  <th scope="col" style={{ width: "300px" }}>
                    Mensaje
                  </th>
                  <th
                    scope="col"
                    style={{ width: "120px", cursor: "pointer" }}
                    onClick={() => handleSort("estado")}
                  >
                    <div className="d-flex align-items-center">
                      Estado {getSortIcon("estado")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="d-flex align-items-center">
                      Fecha {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th scope="col" style={{ width: "150px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentMensajes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron mensajes con la búsqueda actual
                      </p>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "var(--secondary-color)",
                          borderColor: "var(--secondary-color)",
                          color: "white",
                        }}
                        onClick={() => setFilterText("")}
                      >
                        Limpiar búsqueda
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentMensajes.map((mensaje) => (
                    <tr key={mensaje.id}>
                      <td className="text-center">
                        <span className="badge bg-light text-dark">
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
                        <div>
                          <div
                            className="fw-bold"
                            style={{ color: "var(--primary-color)" }}
                          >
                            {mensaje.evento?.nombre_evento || "N/A"}
                          </div>
                          {mensaje.evento?.sede_evento && (
                            <small className="text-muted">
                              <i className="bi bi-geo-alt me-1"></i>
                              {mensaje.evento.sede_evento}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="mensaje-preview">
                          {mensaje.mensaje.length > 100
                            ? `${mensaje.mensaje.substring(0, 100)}...`
                            : mensaje.mensaje}
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge bg-${getEstadoBadgeColor(
                            mensaje.estado
                          )}`}
                        >
                          {getEstadoDisplayName(mensaje.estado)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">
                            {formatDate(mensaje.created_at)}
                          </div>
                          <small className="text-muted">
                            {formatTime(mensaje.created_at)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Ver detalles"
                            onClick={() => handleViewMensaje(mensaje)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "var(--primary-color)",
                              borderColor: "var(--primary-color)",
                              color: "white",
                            }}
                            title="Cambiar Estado"
                            onClick={() => handleCambiarEstado(mensaje)}
                          >
                            <i className="bi bi-gear"></i>
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

      {/* Modal de detalles del mensaje */}
      {showDetailsModal && selectedMensaje && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Detalles del Mensaje
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDetailsModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 style={{ color: "var(--primary-color)" }}>
                      Información del Contacto
                    </h6>
                    <p>
                      <strong>ID:</strong> {selectedMensaje.id}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedMensaje.correo_electronico}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {selectedMensaje.telefono || "N/A"}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`badge bg-${getEstadoBadgeColor(
                          selectedMensaje.estado
                        )}`}
                      >
                        {getEstadoDisplayName(selectedMensaje.estado)}
                      </span>
                    </p>
                    <p>
                      <strong>Atendido:</strong>{" "}
                      {selectedMensaje.atendido ? "Sí" : "No"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 style={{ color: "var(--primary-color)" }}>
                      Información del Evento
                    </h6>
                    <p>
                      <strong>Evento:</strong>{" "}
                      {selectedMensaje.evento?.nombre_evento || "N/A"}
                    </p>
                    <p>
                      <strong>Sede:</strong>{" "}
                      {selectedMensaje.evento?.sede_evento || "N/A"}
                    </p>
                    <p>
                      <strong>Equipo ID:</strong>{" "}
                      {selectedMensaje.equipo_id || "N/A"}
                    </p>
                    <p>
                      <strong>Fecha de Creación:</strong>{" "}
                      {formatDateTime(selectedMensaje.created_at)}
                    </p>
                    <p>
                      <strong>Última Actualización:</strong>{" "}
                      {formatDateTime(selectedMensaje.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-12">
                    <h6 style={{ color: "var(--primary-color)" }}>
                      Mensaje Completo
                    </h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0">{selectedMensaje.mensaje}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeDetailsModal}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    borderColor: "var(--primary-color)",
                    color: "white",
                  }}
                  onClick={() => {
                    closeDetailsModal();
                    handleCambiarEstado(selectedMensaje);
                  }}
                >
                  <i className="bi bi-gear me-2"></i>
                  Cambiar Estado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cambio de estado */}
      {showStatusModal && selectedMensaje && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-gear me-2"></i>
                  Cambiar Estado del Mensaje
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeStatusModal}
                ></button>
              </div>

              <form onSubmit={handleSubmitStatus}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-12">
                      <h6 style={{ color: "var(--primary-color)" }}>
                        Información del Mensaje
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1">
                          <strong>Email:</strong>{" "}
                          {selectedMensaje.correo_electronico}
                        </p>
                        <p className="mb-1">
                          <strong>Evento:</strong>{" "}
                          {selectedMensaje.evento?.nombre_evento || "N/A"}
                        </p>
                        <p className="mb-0">
                          <strong>Estado Actual:</strong>{" "}
                          <span
                            className={`badge bg-${getEstadoBadgeColor(
                              selectedMensaje.estado
                            )}`}
                          >
                            {getEstadoDisplayName(selectedMensaje.estado)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-12">
                      <h6 style={{ color: "var(--primary-color)" }}>
                        Mensaje Original
                      </h6>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-0">{selectedMensaje.mensaje}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label htmlFor="estado" className="form-label">
                        Nuevo Estado <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        id="estado"
                        name="estado"
                        value={statusData.estado}
                        onChange={handleStatusInputChange}
                        required
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="resuelto">Resuelto</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="atendido" className="form-label">
                        Atendido
                      </label>
                      <select
                        className="form-select"
                        id="atendido"
                        name="atendido"
                        value={statusData.atendido}
                        onChange={handleStatusInputChange}
                      >
                        <option value={true}>Sí</option>
                        <option value={false}>No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeStatusModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "var(--primary-color)",
                      borderColor: "var(--primary-color)",
                      color: "white",
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          style={{ color: "white" }}
                          role="status"
                        ></span>
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Actualizar Estado
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuzonAsistenciaTable;
