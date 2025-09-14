import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./ComiteDetalle.css";

const ComiteDetalle = ({ comiteId, onBack, embedded = false }) => {
  const navigate = useNavigate();
  const [comite, setComite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [eventos, setEventos] = useState([]);
  const [eventosLoading, setEventosLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    evento_id: "",
    nombre: "",
    rol: "",
    puesto: "",
    telefono: "",
    extension: "",
  });

  useEffect(() => {
    if (comiteId) {
      fetchComiteDetails();
    }
  }, [comiteId]);

  const fetchComiteDetails = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get(`/comites/${comiteId}`, token);

      if (response.data) {
        setComite(response.data);
        setEditForm({
          evento_id: response.data.evento_id || "",
          nombre: response.data.nombre || "",
          rol: response.data.rol || "",
          puesto: response.data.puesto || "",
          telefono: response.data.telefono || "",
          extension: response.data.extension || "",
        });
        setError(null);
      } else {
        setError("No se encontró información del comité");
      }
    } catch (err) {
      console.error("Error al obtener detalles del comité:", err);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/comites");
    }
  };

  const fetchEventos = async () => {
    try {
      setEventosLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/eventos/list", token);

      if (response.data) {
        setEventos(response.data);
      } else {
        setEventos([]);
      }
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setEventos([]);
    } finally {
      setEventosLoading(false);
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
    fetchEventos(); // Cargar eventos cuando se abre el modal
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true);
      const token = authService.getToken();

      const response = await apiService.put(
        `/comites/${comiteId}`,
        editForm,
        token
      );

      if (response.success) {
        // Cerrar el modal primero
        setShowEditModal(false);

        // Volver a cargar los detalles completos del comité para obtener la información actualizada del evento
        await fetchComiteDetails();

        // Mostrar mensaje de éxito
        alert("Miembro del comité actualizado exitosamente");
      }
    } catch (err) {
      console.error("Error al actualizar comité:", err);
      alert("Error al actualizar el comité. Por favor, intenta nuevamente.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    // Restaurar valores originales
    if (comite) {
      setEditForm({
        evento_id: comite.evento_id || "",
        nombre: comite.nombre || "",
        rol: comite.rol || "",
        puesto: comite.puesto || "",
        telefono: comite.telefono || "",
        extension: comite.extension || "",
      });
    }
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
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        <p className="mt-3">Cargando detalles del comité...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar comité</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleBackClick}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  if (!comite) {
    return (
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Comité no encontrado</h4>
        <p>No se encontró información del comité solicitado.</p>
        <button className="btn btn-warning" onClick={handleBackClick}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={`comite-detalle-container ${embedded ? "embedded" : ""}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div
          className="card-header text-white border-0 py-3"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1 fw-bold">
                <i className="bi bi-person-badge me-3"></i>
                Detalles del Comité
              </h3>
              <p className="mb-0 opacity-75">
                Información completa del miembro del comité organizador
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={handleBackClick}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Información Principal */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 mb-3">
            <div
              className="card-header border-0 py-2"
              style={{ backgroundColor: "var(--primary-50)" }}
            >
              <h6 className="mb-0 fw-semibold text-white">
                <i
                  className="bi bi-person-circle me-2"
                  style={{ color: "white" }}
                ></i>
                Información Personal
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Nombre Completo
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-bold text-dark">{comite.nombre}</h6>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Rol en el Comité
                  </label>
                  <div className="p-2 bg-light rounded">
                    {getRolBadge(comite.rol)}
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Puesto Laboral
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-semibold text-dark">
                      {comite.puesto}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    ID del Comité
                  </label>
                  <div className="p-2 bg-light rounded">
                    <span className="badge bg-secondary fs-6 px-2 py-1">
                      #{comite.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="card shadow-sm border-0 mb-3">
            <div
              className="card-header border-0 py-2"
              style={{ backgroundColor: "var(--primary-50)" }}
            >
              <h6 className="mb-0 fw-semibold text-white">
                <i
                  className="bi bi-telephone me-2"
                  style={{ color: "white" }}
                ></i>
                Información de Contacto
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Teléfono
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-semibold text-dark">
                      <i
                        className="bi bi-telephone me-2"
                        style={{ color: "var(--text-primary)" }}
                      ></i>
                      {comite.telefono}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Extensión
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-semibold text-dark">
                      <i className="bi bi-hash me-2 text-info"></i>
                      {comite.extension || "No especificada"}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Evento */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 mb-3">
            <div
              className="card-header border-0 py-2"
              style={{ backgroundColor: "var(--primary-50)" }}
            >
              <h6 className="mb-0 fw-semibold text-white">
                <i
                  className="bi bi-calendar-event me-2"
                  style={{ color: "white" }}
                ></i>
                Evento Asignado
              </h6>
            </div>
            <div className="card-body py-3">
              {comite.evento ? (
                <>
                  <div className="mb-2">
                    <label className="form-label fw-semibold text-muted small">
                      Nombre del Evento
                    </label>
                    <div className="p-2 bg-light rounded">
                      <h6
                        className="mb-0 fw-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {comite.evento.nombre_evento}
                      </h6>
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold text-muted small">
                      Sede
                    </label>
                    <div className="p-2 bg-light rounded">
                      <h6 className="mb-0 fw-semibold text-dark">
                        <i className="bi bi-geo-alt me-2 text-info"></i>
                        {comite.evento.sede_evento}
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-muted small">
                        Fecha de Inicio
                      </label>
                      <div className="p-2 bg-light rounded">
                        <h6 className="mb-0 fw-semibold text-dark small">
                          <i className="bi bi-calendar3 me-2 text-success"></i>
                          {formatDate(comite.evento.inicio_evento)}
                        </h6>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-muted small">
                        Fecha de Fin
                      </label>
                      <div className="p-2 bg-light rounded">
                        <h6 className="mb-0 fw-semibold text-dark small">
                          <i className="bi bi-calendar3 me-2 text-warning"></i>
                          {formatDate(comite.evento.fin_evento)}
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-muted small">
                        Límite de Participantes
                      </label>
                      <div className="p-2 bg-light rounded">
                        <h6 className="mb-0 fw-semibold text-dark small">
                          <i className="bi bi-people me-2 text-info"></i>
                          {comite.evento.lim_de_participantes_evento}
                        </h6>
                      </div>
                    </div>
                    <div className="col-md-6 mb-2">
                      <label className="form-label fw-semibold text-muted small">
                        Estatus del Evento
                      </label>
                      <div className="p-2 bg-light rounded">
                        <span
                          className={`badge ${
                            comite.evento.estatus_evento === "activo"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {comite.evento.estatus_evento}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-calendar-x fs-1 text-muted mb-2"></i>
                  <h6 className="text-muted">No hay evento asignado</h6>
                </div>
              )}
            </div>
          </div>

          {/* Información de Registro */}
          <div className="card shadow-sm border-0">
            <div
              className="card-header border-0 py-2"
              style={{ backgroundColor: "var(--primary-50)" }}
            >
              <h6 className="mb-0 fw-semibold text-white">
                <i className="bi bi-clock me-2" style={{ color: "white" }}></i>
                Información de Registro
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Fecha de Creación
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-semibold text-dark small">
                      <i className="bi bi-calendar-plus me-2 text-success"></i>
                      {formatDate(comite.created_at)}
                    </h6>
                  </div>
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-semibold text-muted small">
                    Última Actualización
                  </label>
                  <div className="p-2 bg-light rounded">
                    <h6 className="mb-0 fw-semibold text-dark small">
                      <i className="bi bi-calendar-check me-2 text-warning"></i>
                      {formatDate(comite.updated_at)}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showEditModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-pencil me-2"></i>
                  Editar Miembro del Comité
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleEditCancel}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person me-2"></i>
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        value={editForm.nombre}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-person-badge me-2"></i>
                        Rol en el Comité *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="rol"
                        value={editForm.rol}
                        onChange={handleEditFormChange}
                        placeholder="Ej: Presidente, Secretario, Coordinador..."
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-briefcase me-2"></i>
                        Puesto Laboral *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="puesto"
                        value={editForm.puesto}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-telephone me-2"></i>
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="telefono"
                        value={editForm.telefono}
                        onChange={handleEditFormChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-hash me-2"></i>
                        Extensión
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="extension"
                        value={editForm.extension}
                        onChange={handleEditFormChange}
                        maxLength="10"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">
                        <i className="bi bi-calendar-event me-2"></i>
                        Evento Asignado
                      </label>
                      <select
                        className="form-select"
                        name="evento_id"
                        value={editForm.evento_id}
                        onChange={handleEditFormChange}
                        disabled={eventosLoading}
                      >
                        <option value="">Seleccionar evento</option>
                        {eventos.map((evento) => (
                          <option key={evento.id} value={evento.id}>
                            {evento.nombre_evento}
                          </option>
                        ))}
                      </select>
                      {eventosLoading && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <i className="bi bi-hourglass-split me-1"></i>
                            Cargando eventos...
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleEditCancel}
                    disabled={editLoading}
                  >
                    <i className="bi bi-x-circle me-2"></i>
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
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Guardar Cambios
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComiteDetalle;
