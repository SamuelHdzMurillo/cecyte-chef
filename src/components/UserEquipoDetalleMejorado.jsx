import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./EquipoDetalle.css";

const UserEquipoDetalleMejorado = ({
  equipoId,
  onBack,
  embedded = false,
  onNavigateToForm,
}) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = equipoId || paramId;
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditEquipo, setShowEditEquipo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gas_propano_medida: "",
    gas_propano_personalizada: "",
  });

  useEffect(() => {
    fetchEquipo();
  }, [id]);

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre_equipo: equipo.nombre_equipo || "",
        entidad_federativa: equipo.entidad_federativa || "",
        nombre_anfitrion: equipo.nombre_anfitrion || "",
        telefono_anfitrion: equipo.telefono_anfitrion || "",
        correo_anfitrion: equipo.correo_anfitrion || "",
        gas_propano_medida: equipo.gas_propano_medida || "",
        gas_propano_personalizada: equipo.gas_propano_personalizada || "",
      });
    }
  }, [equipo]);

  const fetchEquipo = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get(`/equipos/${id}`, token);

      if (response.data) {
        setEquipo(response.data);
        setError(null);
      } else {
        setError("No se encontró el equipo");
      }
    } catch (err) {
      console.error("Error al obtener equipo:", err);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (embedded && onBack) {
      onBack();
    } else {
      navigate("/dashboard");
    }
  };

  const handleNavigateToForm = (formType) => {
    if (onNavigateToForm) {
      onNavigateToForm(formType);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setFormData({
        nombre_equipo: equipo.nombre_equipo || "",
        entidad_federativa: equipo.entidad_federativa || "",
        nombre_anfitrion: equipo.nombre_anfitrion || "",
        telefono_anfitrion: equipo.telefono_anfitrion || "",
        correo_anfitrion: equipo.correo_anfitrion || "",
        gas_propano_medida: equipo.gas_propano_medida || "",
        gas_propano_personalizada: equipo.gas_propano_personalizada || "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = authService.getToken();
      const response = await apiService.put(
        `/equipos/${equipo.id}`,
        formData,
        token
      );

      if (response.success) {
        setIsEditing(false);
        fetchEquipo();
        alert("Equipo actualizado correctamente");
      } else {
        alert("Error al actualizar el equipo");
      }
    } catch (error) {
      console.error("Error al actualizar equipo:", error);
      alert("Error al actualizar el equipo");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nombre_equipo: equipo.nombre_equipo || "",
      entidad_federativa: equipo.entidad_federativa || "",
      nombre_anfitrion: equipo.nombre_anfitrion || "",
      telefono_anfitrion: equipo.telefono_anfitrion || "",
      correo_anfitrion: equipo.correo_anfitrion || "",
      gas_propano_medida: equipo.gas_propano_medida || "",
      gas_propano_personalizada: equipo.gas_propano_personalizada || "",
    });
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
        <p className="mt-3">Cargando información del equipo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          <strong>Error:</strong> {error}
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Información:</strong> No se encontró información del equipo.
        </div>
        <button className="btn btn-primary" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={`equipos-table-container ${embedded ? "embedded" : ""}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-primary text-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-people-fill me-3"></i>
                {equipo.nombre_equipo}
              </h4>
              <p className="mb-0 opacity-75">
                <i className="bi bi-geo-alt me-1"></i>
                {equipo.entidad_federativa} • {equipo.evento?.nombre_evento}
              </p>
              {equipo.created_at && (
                <p className="mb-0 opacity-75 small">
                  <i className="bi bi-calendar-plus me-1"></i>
                  Creado: {formatDate(equipo.created_at)}
                </p>
              )}
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-warning px-4 py-2"
                onClick={handleEditToggle}
              >
                <i className="bi bi-pencil-square me-2"></i>
                {isEditing ? "Cancelar" : "Editar"}
              </button>
              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Equipo - Diseño mejorado */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-primary text-white border-0 py-3">
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-info-circle me-2"></i>
            Información del Equipo
          </h6>
        </div>
        <div className="card-body py-4">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-building me-1 text-primary"></i>
                  Entidad Federativa
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="entidad_federativa"
                  value={
                    isEditing
                      ? formData.entidad_federativa
                      : equipo.entidad_federativa || ""
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-person me-1 text-primary"></i>
                  Anfitrión
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nombre_anfitrion"
                  value={
                    isEditing
                      ? formData.nombre_anfitrion
                      : equipo.nombre_anfitrion || ""
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-telephone me-1 text-primary"></i>
                  Teléfono
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="telefono_anfitrion"
                  value={
                    isEditing
                      ? formData.telefono_anfitrion
                      : equipo.telefono_anfitrion || ""
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-envelope me-1 text-primary"></i>
                  Correo
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="correo_anfitrion"
                  value={
                    isEditing
                      ? formData.correo_anfitrion
                      : equipo.correo_anfitrion || ""
                  }
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-fire me-1 text-primary"></i>
                  Gas Propano
                </label>
                <select
                  className="form-select"
                  name="gas_propano_medida"
                  value={
                    isEditing
                      ? formData.gas_propano_medida
                      : equipo.gas_propano_medida || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="">Seleccionar medida</option>
                  <option value="1/2">1/2</option>
                  <option value="1/4">1/4</option>
                  <option value="16.4">16.4</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-tools me-1 text-primary"></i>
                  Medida Personalizada
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="gas_propano_personalizada"
                  value={
                    isEditing
                      ? formData.gas_propano_personalizada
                      : equipo.gas_propano_personalizada || ""
                  }
                  onChange={handleInputChange}
                  readOnly={
                    !isEditing ||
                    (isEditing
                      ? formData.gas_propano_medida
                      : equipo.gas_propano_medida) !== "otro"
                  }
                  placeholder="Especificar medida personalizada"
                  disabled={
                    !isEditing ||
                    (isEditing
                      ? formData.gas_propano_medida
                      : equipo.gas_propano_medida) !== "otro"
                  }
                />
              </div>
            </div>
            {equipo.updated_at && (
              <div className="col-lg-4 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-clock me-1 text-primary"></i>
                    Última Actualización
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatDate(equipo.updated_at)}
                    readOnly
                  />
                </div>
              </div>
            )}
            {equipo.evento && (
              <div className="col-lg-4 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-calendar-event me-1 text-primary"></i>
                    Evento
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={equipo.evento.nombre_evento || ""}
                    readOnly
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción cuando está editando */}
          {isEditing && (
            <div className="row mt-4">
              <div className="col-12 text-center">
                <div className="d-flex gap-3 justify-content-center">
                  <button
                    className="btn btn-success px-4 py-2"
                    onClick={handleSave}
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Guardar Cambios
                  </button>
                  <button
                    className="btn btn-secondary px-4 py-2"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Participantes - Vista simplificada */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-primary text-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-people me-2"></i>
              Participantes ({equipo.participantes?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => handleNavigateToForm("participante")}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.participantes && equipo.participantes.length > 0 ? (
            <div className="row g-3">
              {equipo.participantes.map((participante) => (
                <div key={participante.id} className="col-lg-6 col-md-12">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="bi bi-person-circle fs-2 text-primary"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {participante.nombre_participante}
                          </h6>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-mortarboard me-1 text-primary"></i>
                            <strong>Rol:</strong>{" "}
                            {participante.rol_participante}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-building me-1 text-primary"></i>
                            <strong>Plantel:</strong>{" "}
                            {participante.plantel_participante}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-book me-1 text-primary"></i>
                            <strong>Especialidad:</strong>{" "}
                            {participante.especialidad_participante}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-calendar me-1 text-primary"></i>
                            <strong>Semestre:</strong>{" "}
                            {participante.semestre_participante}
                          </p>
                          <p className="mb-0 text-dark small">
                            <i className="bi bi-card-text me-1 text-primary"></i>
                            <strong>Matrícula:</strong>
                            <span className="badge bg-primary ms-1">
                              {participante.matricula_participante}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-people fs-1 text-primary mb-3 d-block"></i>
              <p className="text-dark mb-3 fw-semibold">
                No hay participantes registrados
              </p>
              <button
                className="btn btn-primary"
                onClick={() => handleNavigateToForm("participante")}
              >
                <i className="bi bi-person-plus me-2"></i>
                Agregar Primer Participante
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Acompañantes - Vista simplificada */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-primary text-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-person-badge me-2"></i>
              Acompañantes ({equipo.acompanantes?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => handleNavigateToForm("acompanante")}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.acompanantes && equipo.acompanantes.length > 0 ? (
            <div className="row g-3">
              {equipo.acompanantes.map((acompanante) => (
                <div key={acompanante.id} className="col-lg-6 col-md-12">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className="bi bi-person-badge fs-2 text-info"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {acompanante.nombre_acompanante}
                          </h6>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-briefcase me-1 text-primary"></i>
                            <strong>Rol:</strong> {acompanante.rol}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-building me-1 text-primary"></i>
                            <strong>Puesto:</strong> {acompanante.puesto}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-telephone me-1 text-primary"></i>
                            <strong>Teléfono:</strong> {acompanante.telefono}
                          </p>
                          <p className="mb-0 text-dark small">
                            <i className="bi bi-envelope me-1 text-primary"></i>
                            <strong>Email:</strong> {acompanante.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-person-badge fs-1 text-primary mb-3 d-block"></i>
              <p className="text-dark mb-3 fw-semibold">
                No hay acompañantes registrados
              </p>
              <button
                className="btn btn-info"
                onClick={() => handleNavigateToForm("acompanante")}
              >
                <i className="bi bi-person-badge-plus me-2"></i>
                Agregar Primer Acompañante
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recetas - Vista simplificada */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-header bg-primary text-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-journal-text me-2"></i>
              Recetas ({equipo.recetas?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => handleNavigateToForm("receta")}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.recetas && equipo.recetas.length > 0 ? (
            <div className="row g-3">
              {equipo.recetas.map((receta) => (
                <div key={receta.id} className="col-lg-6 col-md-12">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <i className="bi bi-journal-text fs-2 text-warning"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {receta.descripcion}
                          </h6>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-tag me-1 text-primary"></i>
                            <strong>Tipo:</strong> {receta.tipo_receta}
                          </p>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-person me-1 text-primary"></i>
                            <strong>Creado por:</strong> {receta.creado_por}
                          </p>
                          {receta.ingredientes && (
                            <p className="mb-1 text-dark small">
                              <i className="bi bi-list-ul me-1 text-primary"></i>
                              <strong>Ingredientes:</strong>{" "}
                              {receta.ingredientes.length > 50
                                ? `${receta.ingredientes.substring(0, 50)}...`
                                : receta.ingredientes}
                            </p>
                          )}
                          {receta.preparacion && (
                            <p className="mb-1 text-dark small">
                              <i className="bi bi-list-ol me-1 text-primary"></i>
                              <strong>Preparación:</strong>{" "}
                              {receta.preparacion.length > 50
                                ? `${receta.preparacion.substring(0, 50)}...`
                                : receta.preparacion}
                            </p>
                          )}
                          {receta.observaciones && (
                            <p className="mb-0 text-dark small">
                              <i className="bi bi-chat-text me-1 text-primary"></i>
                              <strong>Observaciones:</strong>{" "}
                              {receta.observaciones.length > 50
                                ? `${receta.observaciones.substring(0, 50)}...`
                                : receta.observaciones}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-journal-text fs-1 text-primary mb-3 d-block"></i>
              <p className="text-dark mb-3 fw-semibold">
                No hay recetas registradas
              </p>
              <button
                className="btn btn-warning"
                onClick={() => handleNavigateToForm("receta")}
              >
                <i className="bi bi-journal-plus me-2"></i>
                Agregar Primera Receta
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEquipoDetalleMejorado;
