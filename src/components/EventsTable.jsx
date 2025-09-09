import React, { useState, useEffect } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./EventsTable.css";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Estados para el modal de edición/creación
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    nombre_evento: "",
    inicio_evento: "",
    fin_evento: "",
    sede_evento: "",
    lim_de_participantes_evento: "",
    estatus_evento: "activo",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Estados para el modal de detalles del evento
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Filtros adicionales
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/eventos", token);

      if (response.success && response.data) {
        setEvents(response.data);
        setError(null);
      } else {
        setEvents([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setEvents([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchEvents();
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

  const filteredEvents = events.filter((event) => {
    const matchesText =
      event.nombre_evento?.toLowerCase().includes(filterText.toLowerCase()) ||
      event.sede_evento?.toLowerCase().includes(filterText.toLowerCase()) ||
      event.estatus_evento?.toLowerCase().includes(filterText.toLowerCase());

    const matchesStatus =
      !statusFilter || event.estatus_evento === statusFilter;
    const matchesDate =
      !dateFilter ||
      event.inicio_evento?.startsWith(dateFilter) ||
      event.fin_evento?.startsWith(dateFilter);

    return matchesText && matchesStatus && matchesDate;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (
      sortField === "inicio_evento" ||
      sortField === "fin_evento" ||
      sortField === "created_at"
    ) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "activo":
        return "success";
      case "inactivo":
        return "secondary";
      case "cancelado":
        return "danger";
      case "finalizado":
        return "info";
      default:
        return "secondary";
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "activo":
        return "Activo";
      case "inactivo":
        return "Inactivo";
      case "cancelado":
        return "Cancelado";
      case "finalizado":
        return "Finalizado";
      default:
        return status;
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

  // Funciones para el modal
  const openCreateModal = () => {
    setIsCreating(true);
    setEditingEvent(null);
    setFormData({
      nombre_evento: "",
      inicio_evento: "",
      fin_evento: "",
      sede_evento: "",
      lim_de_participantes_evento: "",
      estatus_evento: "activo",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setIsCreating(false);
    setEditingEvent(event);
    setFormData({
      nombre_evento: event.nombre_evento,
      inicio_evento: event.inicio_evento?.split("T")[0],
      fin_evento: event.fin_evento?.split("T")[0],
      sede_evento: event.sede_evento,
      lim_de_participantes_evento: event.lim_de_participantes_evento,
      estatus_evento: event.estatus_evento,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setIsCreating(false);
    setFormData({
      nombre_evento: "",
      inicio_evento: "",
      fin_evento: "",
      sede_evento: "",
      lim_de_participantes_evento: "",
      estatus_evento: "activo",
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre_evento.trim()) {
      errors.nombre_evento = "El nombre del evento es requerido";
    }

    if (!formData.inicio_evento) {
      errors.inicio_evento = "La fecha de inicio es requerida";
    }

    if (!formData.fin_evento) {
      errors.fin_evento = "La fecha de fin es requerida";
    }

    if (formData.inicio_evento && formData.fin_evento) {
      if (new Date(formData.inicio_evento) >= new Date(formData.fin_evento)) {
        errors.fin_evento =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    if (!formData.sede_evento.trim()) {
      errors.sede_evento = "La sede del evento es requerida";
    }

    if (
      !formData.lim_de_participantes_evento ||
      formData.lim_de_participantes_evento < 1
    ) {
      errors.lim_de_participantes_evento =
        "El límite de participantes debe ser mayor a 0";
    }

    if (!formData.estatus_evento) {
      errors.estatus_evento = "El estatus del evento es requerido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = authService.getToken();
      const endpoint = isCreating ? "/eventos" : `/eventos/${editingEvent.id}`;
      const method = isCreating ? "post" : "put";

      // Preparar datos para enviar
      const dataToSend = { ...formData };

      // Convertir fechas a formato ISO
      if (dataToSend.inicio_evento) {
        dataToSend.inicio_evento = new Date(
          dataToSend.inicio_evento
        ).toISOString();
      }
      if (dataToSend.fin_evento) {
        dataToSend.fin_evento = new Date(dataToSend.fin_evento).toISOString();
      }

      const response = await apiService[method](endpoint, dataToSend, token);

      if (response.success || response.data) {
        if (isCreating) {
          const newEvent = {
            ...formData,
            id: response.data?.id || Math.max(...events.map((e) => e.id)) + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            equipos: [],
          };
          setEvents((prev) => [...prev, newEvent]);
        } else {
          setEvents((prev) =>
            prev.map((event) =>
              event.id === editingEvent.id
                ? {
                    ...event,
                    ...formData,
                    updated_at: new Date().toISOString(),
                  }
                : event
            )
          );
        }

        closeModal();
        alert(
          isCreating
            ? "Evento creado exitosamente"
            : "Evento actualizado exitosamente"
        );
      }
    } catch (error) {
      console.error("Error al guardar evento:", error);
      alert("Error al guardar el evento. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  const handleEditEvent = (event) => {
    openEditModal(event);
  };

  const handleDeleteEvent = async (event) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el evento "${event.nombre_evento}"?`
      )
    ) {
      try {
        setLoading(true);
        const token = authService.getToken();

        const response = await apiService.delete(`/eventos/${event.id}`, token);

        if (response.success || response.data) {
          setEvents((prev) => prev.filter((e) => e.id !== event.id));
          alert("Evento eliminado exitosamente");
        } else {
          alert("Error al eliminar el evento. Por favor, inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error al eliminar evento:", error);
        alert("Error al eliminar el evento. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Estadísticas
  const totalEvents = events.length;
  const activeEvents = events.filter(
    (e) => e.estatus_evento === "activo"
  ).length;
  const totalTeams = events.reduce(
    (sum, event) => sum + (event.equipos?.length || 0),
    0
  );
  const totalParticipants = events.reduce(
    (sum, event) => sum + (event.lim_de_participantes_evento || 0),
    0
  );

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
        <p className="mt-3">Cargando eventos...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-calendar-event me-2"></i>
              Gestión de Eventos
            </h5>
            <button
              className="btn"
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
                color: "white",
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
          <i className="bi bi-calendar-event fs-1 text-muted d-block mb-3"></i>
          <p className="text-muted mb-3">No hay eventos disponibles</p>
          <p className="text-muted small">
            Verifica tu conexión al servidor o contacta al administrador.
          </p>
        </div>
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
              <i className="bi bi-calendar-event me-2"></i>
              Gestión de Eventos
            </h5>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light"
                onClick={openCreateModal}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Evento
              </button>
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
        </div>

        <div className="card-body p-4">
          {/* Estadísticas */}
          <div className="event-stats">
            <div className="stat-card">
              <div className="stat-number">{totalEvents}</div>
              <div className="stat-label">Total Eventos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{activeEvents}</div>
              <div className="stat-label">Eventos Activos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalTeams}</div>
              <div className="stat-label">Total Equipos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalParticipants}</div>
              <div className="stat-label">Participantes</div>
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
                  placeholder="Buscar por nombre, sede o estatus..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="statusFilter">Estatus</label>
                <select
                  id="statusFilter"
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos los estatus</option>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </div>
              <div className="filter-group">
                <label htmlFor="dateFilter">Fecha</label>
                <input
                  type="date"
                  id="dateFilter"
                  className="form-control"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabla de eventos */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th
                    scope="col"
                    style={{ width: "60px", cursor: "pointer" }}
                    onClick={() => handleSort("id")}
                  >
                    <div className="d-flex align-items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "200px", cursor: "pointer" }}
                    onClick={() => handleSort("nombre_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Evento {getSortIcon("nombre_evento")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "120px", cursor: "pointer" }}
                    onClick={() => handleSort("inicio_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Inicio {getSortIcon("inicio_evento")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "120px", cursor: "pointer" }}
                    onClick={() => handleSort("fin_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Fin {getSortIcon("fin_evento")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleSort("sede_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Sede {getSortIcon("sede_evento")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "100px", cursor: "pointer" }}
                    onClick={() => handleSort("lim_de_participantes_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Participantes {getSortIcon("lim_de_participantes_evento")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "80px", cursor: "pointer" }}
                    onClick={() => handleSort("estatus_evento")}
                  >
                    <div className="d-flex align-items-center">
                      Estatus {getSortIcon("estatus_evento")}
                    </div>
                  </th>
                  <th scope="col" style={{ width: "80px" }}>
                    Equipos
                  </th>
                  <th scope="col" style={{ width: "100px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEvents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron eventos con los filtros actuales
                      </p>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => {
                          setFilterText("");
                          setStatusFilter("");
                          setDateFilter("");
                        }}
                      >
                        Limpiar filtros
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentEvents.map((event) => (
                    <tr key={event.id}>
                      <td className="text-center">
                        <span className="badge bg-secondary">{event.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="bi bi-calendar-event fs-5 text-primary"></i>
                          </div>
                          <div>
                            <div
                              className="fw-bold text-truncate event-name"
                              style={{ maxWidth: "180px" }}
                              title={event.nombre_evento}
                            >
                              {event.nombre_evento}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="event-dates">
                          <div>{formatDate(event.inicio_evento)}</div>
                          <small className="text-muted">
                            {formatTime(event.inicio_evento)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="event-dates">
                          <div>{formatDate(event.fin_evento)}</div>
                          <small className="text-muted">
                            {formatTime(event.fin_evento)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div
                          className="event-location text-truncate"
                          style={{ maxWidth: "130px" }}
                          title={event.sede_evento}
                        >
                          <i className="bi bi-geo-alt me-1"></i>
                          {event.sede_evento}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="event-participants">
                          {event.lim_de_participantes_evento}
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge bg-${getStatusBadgeColor(
                            event.estatus_evento
                          )} event-status-badge`}
                        >
                          {getStatusDisplayName(event.estatus_evento)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="event-teams-count">
                          {event.equipos?.length || 0}
                        </span>
                      </td>
                      <td>
                        <div className="event-actions">
                          <button
                            className="btn btn-sm"
                            title="Ver detalles"
                            onClick={() => handleViewEvent(event)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            title="Editar evento"
                            onClick={() => handleEditEvent(event)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            title="Eliminar evento"
                            onClick={() => handleDeleteEvent(event)}
                          >
                            <i className="bi bi-trash"></i>
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

      {/* Modal para crear/editar evento */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i
                    className={`bi ${
                      isCreating ? "bi-plus-circle" : "bi-pencil-square"
                    } me-2`}
                  ></i>
                  {isCreating ? "Crear Nuevo Evento" : "Editar Evento"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label htmlFor="nombre_evento" className="form-label">
                        Nombre del Evento <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.nombre_evento ? "is-invalid" : ""
                        }`}
                        id="nombre_evento"
                        name="nombre_evento"
                        value={formData.nombre_evento}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre del evento"
                      />
                      {formErrors.nombre_evento && (
                        <div className="invalid-feedback">
                          {formErrors.nombre_evento}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="inicio_evento" className="form-label">
                        Fecha de Inicio <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          formErrors.inicio_evento ? "is-invalid" : ""
                        }`}
                        id="inicio_evento"
                        name="inicio_evento"
                        value={formData.inicio_evento}
                        onChange={handleInputChange}
                      />
                      {formErrors.inicio_evento && (
                        <div className="invalid-feedback">
                          {formErrors.inicio_evento}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="fin_evento" className="form-label">
                        Fecha de Fin <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          formErrors.fin_evento ? "is-invalid" : ""
                        }`}
                        id="fin_evento"
                        name="fin_evento"
                        value={formData.fin_evento}
                        onChange={handleInputChange}
                      />
                      {formErrors.fin_evento && (
                        <div className="invalid-feedback">
                          {formErrors.fin_evento}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="sede_evento" className="form-label">
                        Sede del Evento <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.sede_evento ? "is-invalid" : ""
                        }`}
                        id="sede_evento"
                        name="sede_evento"
                        value={formData.sede_evento}
                        onChange={handleInputChange}
                        placeholder="Ingresa la sede del evento"
                      />
                      {formErrors.sede_evento && (
                        <div className="invalid-feedback">
                          {formErrors.sede_evento}
                        </div>
                      )}
                    </div>

                    <div className="col-md-4 mb-3">
                      <label
                        htmlFor="lim_de_participantes_evento"
                        className="form-label"
                      >
                        Límite de Participantes{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${
                          formErrors.lim_de_participantes_evento
                            ? "is-invalid"
                            : ""
                        }`}
                        id="lim_de_participantes_evento"
                        name="lim_de_participantes_evento"
                        value={formData.lim_de_participantes_evento}
                        onChange={handleInputChange}
                        placeholder="200"
                        min="1"
                      />
                      {formErrors.lim_de_participantes_evento && (
                        <div className="invalid-feedback">
                          {formErrors.lim_de_participantes_evento}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="estatus_evento" className="form-label">
                        Estatus del Evento{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          formErrors.estatus_evento ? "is-invalid" : ""
                        }`}
                        id="estatus_evento"
                        name="estatus_evento"
                        value={formData.estatus_evento}
                        onChange={handleInputChange}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="finalizado">Finalizado</option>
                      </select>
                      {formErrors.estatus_evento && (
                        <div className="invalid-feedback">
                          {formErrors.estatus_evento}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      borderColor: "var(--secondary-color)",
                      color: "white",
                    }}
                    onClick={closeModal}
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
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isCreating ? "Crear Evento" : "Guardar Cambios"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del evento */}
      {showDetailsModal && selectedEvent && (
        <div
          className="modal fade show d-block event-details-modal"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Detalles del Evento: {selectedEvent.nombre_evento}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="event-info-grid">
                  <div className="event-info-item">
                    <h6>Información General</h6>
                    <p>
                      <strong>ID:</strong> {selectedEvent.id}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {selectedEvent.nombre_evento}
                    </p>
                    <p>
                      <strong>Sede:</strong> {selectedEvent.sede_evento}
                    </p>
                    <p>
                      <strong>Estatus:</strong>
                      <span
                        className={`badge bg-${getStatusBadgeColor(
                          selectedEvent.estatus_evento
                        )} ms-2`}
                      >
                        {getStatusDisplayName(selectedEvent.estatus_evento)}
                      </span>
                    </p>
                  </div>

                  <div className="event-info-item">
                    <h6>Fechas y Participantes</h6>
                    <p>
                      <strong>Inicio:</strong>{" "}
                      {formatDateTime(selectedEvent.inicio_evento)}
                    </p>
                    <p>
                      <strong>Fin:</strong>{" "}
                      {formatDateTime(selectedEvent.fin_evento)}
                    </p>
                    <p>
                      <strong>Límite de Participantes:</strong>{" "}
                      {selectedEvent.lim_de_participantes_evento}
                    </p>
                    <p>
                      <strong>Equipos Registrados:</strong>{" "}
                      {selectedEvent.equipos?.length || 0}
                    </p>
                  </div>
                </div>

                {selectedEvent.equipos && selectedEvent.equipos.length > 0 && (
                  <div className="event-teams-section">
                    <h6>Equipos Registrados</h6>
                    {selectedEvent.equipos.map((team) => (
                      <div key={team.id} className="team-card">
                        <div className="team-header">
                          <span className="team-name">
                            {team.nombre_equipo}
                          </span>
                          <span
                            className={`badge bg-${
                              team.estatus_del_equipo === "activo"
                                ? "success"
                                : "secondary"
                            } team-status`}
                          >
                            {team.estatus_del_equipo === "activo"
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </div>
                        <div className="team-details">
                          <p>
                            <strong>Entidad Federativa:</strong>{" "}
                            {team.entidad_federativa}
                          </p>
                          <p>
                            <strong>Anfitrión:</strong> {team.nombre_anfitrion}
                          </p>
                          <p>
                            <strong>Teléfono:</strong> {team.telefono_anfitrion}
                          </p>
                          <p>
                            <strong>Correo:</strong> {team.correo_anfitrion}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="event-info-item">
                  <h6>Información del Sistema</h6>
                  <p>
                    <strong>Creado:</strong>{" "}
                    {formatDateTime(selectedEvent.created_at)}
                  </p>
                  <p>
                    <strong>Actualizado:</strong>{" "}
                    {formatDateTime(selectedEvent.updated_at)}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn me-2"
                  style={{
                    backgroundColor: "var(--warning-color)",
                    borderColor: "var(--warning-color)",
                    color: "var(--text-primary)",
                  }}
                  onClick={() => {
                    setShowDetailsModal(false);
                    openEditModal(selectedEvent);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Evento
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    borderColor: "var(--secondary-color)",
                    color: "white",
                  }}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTable;
