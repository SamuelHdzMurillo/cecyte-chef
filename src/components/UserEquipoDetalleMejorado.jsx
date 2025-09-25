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
    medida_gas_propano: "",
  });

  useEffect(() => {
    fetchEquipo();
  }, [id]);

  useEffect(() => {
    if (equipo) {
      console.log("=== DATOS COMPLETOS DEL EQUIPO ===");
      console.log("Equipo completo:", JSON.stringify(equipo, null, 2));
      console.log("=== CAMPOS ESPECÍFICOS ===");
      console.log("medida_gas_propano:", equipo.medida_gas_propano);
      console.log("gas_propano_medida:", equipo.gas_propano_medida);
      console.log(
        "gas_propano_personalizada:",
        equipo.gas_propano_personalizada
      );
      console.log("=== PARTICIPANTES ===");
      console.log("Participantes:", equipo.participantes);
      console.log("=== ACOMPAÑANTES ===");
      console.log("Acompañantes:", equipo.acompanantes);
      console.log("=== RECETAS ===");
      console.log("Recetas:", equipo.recetas);
      console.log("=== EVENTO ===");
      console.log("Evento:", equipo.evento);
      console.log("=== FECHAS ===");
      console.log("created_at:", equipo.created_at);
      console.log("updated_at:", equipo.updated_at);
      console.log("=====================================");

      setFormData({
        nombre_equipo: equipo.nombre_equipo || "",
        entidad_federativa: equipo.entidad_federativa || "",
        nombre_anfitrion: equipo.nombre_anfitrion || "",
        telefono_anfitrion: equipo.telefono_anfitrion || "",
        correo_anfitrion: equipo.correo_anfitrion || "",
        gas_propano_medida: equipo.gas_propano_medida || "",
        gas_propano_personalizada: equipo.gas_propano_personalizada || "",
        medida_gas_propano: equipo.medida_gas_propano || "",
      });
    }
  }, [equipo]);

  const fetchEquipo = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get(`/equipos/${id}`, token);

      console.log("=== RESPUESTA COMPLETA DEL SERVIDOR ===");
      console.log("Response completa:", JSON.stringify(response, null, 2));
      console.log("Response.data:", JSON.stringify(response.data, null, 2));
      console.log("==========================================");

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
        medida_gas_propano: equipo.medida_gas_propano || "",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Si se está editando la medida personalizada, guardar en medida_gas_propano
    if (name === "gas_propano_personalizada") {
      setFormData((prev) => ({
        ...prev,
        medida_gas_propano: value,
        gas_propano_personalizada: value,
      }));
    } else if (name === "gas_propano_medida" && value !== "otro") {
      // Si se selecciona una medida predefinida, limpiar la personalizada
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        gas_propano_personalizada: "",
        medida_gas_propano: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      medida_gas_propano: equipo.medida_gas_propano || "",
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
                      ? formData.medida_gas_propano &&
                        formData.medida_gas_propano !== ""
                        ? "otro"
                        : formData.gas_propano_medida
                      : equipo.medida_gas_propano &&
                        equipo.medida_gas_propano !== ""
                      ? "otro"
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
                      ? formData.medida_gas_propano || ""
                      : equipo.medida_gas_propano || ""
                  }
                  onChange={handleInputChange}
                  readOnly={
                    !isEditing ||
                    (isEditing
                      ? formData.medida_gas_propano &&
                        formData.medida_gas_propano !== ""
                        ? "otro"
                        : formData.gas_propano_medida
                      : equipo.medida_gas_propano &&
                        equipo.medida_gas_propano !== ""
                      ? "otro"
                      : equipo.gas_propano_medida) !== "otro"
                  }
                  placeholder="Especificar medida personalizada"
                  disabled={
                    !isEditing ||
                    (isEditing
                      ? formData.medida_gas_propano &&
                        formData.medida_gas_propano !== ""
                        ? "otro"
                        : formData.gas_propano_medida
                      : equipo.medida_gas_propano &&
                        equipo.medida_gas_propano !== ""
                      ? "otro"
                      : equipo.gas_propano_medida) !== "otro"
                  }
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="info-item">
                <label className="form-label fw-bold text-dark mb-2">
                  <i className="bi bi-tag me-1 text-primary"></i>
                  Estatus del Equipo
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={equipo.estatus_del_equipo || ""}
                  readOnly
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

      {/* Información del Evento */}
      {equipo.evento && (
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-primary text-white border-0 py-3">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-calendar-event me-2"></i>
              Información del Evento
            </h6>
          </div>
          <div className="card-body py-4">
            <div className="row g-4">
              <div className="col-lg-6 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-calendar me-1 text-primary"></i>
                    Fecha de Inicio
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatDate(equipo.evento.inicio_evento)}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-calendar-check me-1 text-primary"></i>
                    Fecha de Fin
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={formatDate(equipo.evento.fin_evento)}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-geo-alt me-1 text-primary"></i>
                    Sede del Evento
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={equipo.evento.sede_evento || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-people me-1 text-primary"></i>
                    Límite de Participantes
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={equipo.evento.lim_de_participantes_evento || ""}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="info-item">
                  <label className="form-label fw-bold text-dark mb-2">
                    <i className="bi bi-check-circle me-1 text-primary"></i>
                    Estatus del Evento
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={equipo.evento.estatus_evento || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
                          <i className="bi bi-person-circle fs-2 text-dark"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {participante.nombre_participante}
                          </h6>
                          <div className="row g-2">
                            <div className="col-md-6">
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
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-card-text me-1 text-primary"></i>
                                <strong>Matrícula:</strong>
                                <span className="badge bg-primary ms-1">
                                  {participante.matricula_participante}
                                </span>
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-telephone me-1 text-primary"></i>
                                <strong>Teléfono:</strong>{" "}
                                {participante.telefono_participante}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-envelope me-1 text-primary"></i>
                                <strong>Correo:</strong>{" "}
                                {participante.correo_participante}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-rulers me-1 text-primary"></i>
                                <strong>Talla:</strong>{" "}
                                {participante.talla_participante}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-building me-1 text-primary"></i>
                                <strong>CCT:</strong> {participante.plantelcct}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-shield-check me-1 text-primary"></i>
                                <strong>Seguro:</strong>{" "}
                                {participante.seguro_facultativo ? "Sí" : "No"}
                              </p>
                            </div>
                          </div>
                          <div className="row g-2 mt-2">
                            <div className="col-md-6">
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-pill me-1 text-primary"></i>
                                <strong>Medicamentos:</strong>{" "}
                                {participante.medicamentos}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-heart-pulse me-1 text-primary"></i>
                                <strong>Tipo de Sangre:</strong>{" "}
                                {participante.tipo_sangre_participante}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-exclamation-triangle me-1 text-primary"></i>
                                <strong>Alérgico:</strong>{" "}
                                {participante.alergico ? "Sí" : "No"}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-person-badge me-1 text-primary"></i>
                                <strong>Contacto Emergencia:</strong>{" "}
                                {participante.nombre_contacto_emergencia}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-telephone-fill me-1 text-primary"></i>
                                <strong>Tel. Emergencia:</strong>{" "}
                                {participante.telefono_contacto_emergencia}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-shield me-1 text-primary"></i>
                                <strong>NSS:</strong>{" "}
                                {participante.numero_seguro_social}
                              </p>
                            </div>
                          </div>
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
                          <i className="bi bi-person-badge fs-2 text-dark"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {acompanante.nombre_acompanante}
                          </h6>
                          <div className="row g-2">
                            <div className="col-md-6">
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
                                <strong>Teléfono:</strong>{" "}
                                {acompanante.telefono}
                              </p>
                            </div>
                            <div className="col-md-6">
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-envelope me-1 text-primary"></i>
                                <strong>Email:</strong> {acompanante.email}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-rulers me-1 text-primary"></i>
                                <strong>Talla:</strong> {acompanante.talla}
                              </p>
                            </div>
                          </div>
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
                          <i className="bi bi-journal-text fs-2 text-dark"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            {receta.descripcion}
                          </h6>
                          <div className="row g-2">
                            <div className="col-md-6">
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-tag me-1 text-primary"></i>
                                <strong>Tipo:</strong> {receta.tipo_receta}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-person me-1 text-primary"></i>
                                <strong>Creado por:</strong> {receta.creado_por}
                              </p>
                              <p className="mb-1 text-dark small">
                                <i className="bi bi-calendar me-1 text-primary"></i>
                                <strong>Fecha:</strong>{" "}
                                {formatDate(receta.fecha_creacion)}
                              </p>
                            </div>
                          </div>
                          {receta.ingredientes && (
                            <div className="mt-2">
                              <p className="mb-1 text-dark small fw-bold">
                                <i className="bi bi-list-ul me-1 text-primary"></i>
                                Ingredientes:
                              </p>
                              <div className="bg-light p-2 rounded small text-dark">
                                {receta.ingredientes}
                              </div>
                            </div>
                          )}
                          {receta.preparacion && (
                            <div className="mt-2">
                              <p className="mb-1 text-dark small fw-bold">
                                <i className="bi bi-list-ol me-1 text-primary"></i>
                                Preparación:
                              </p>
                              <div className="bg-light p-2 rounded small text-dark">
                                {receta.preparacion}
                              </div>
                            </div>
                          )}
                          {receta.observaciones && (
                            <div className="mt-2">
                              <p className="mb-1 text-dark small fw-bold">
                                <i className="bi bi-chat-text me-1 text-primary"></i>
                                Observaciones:
                              </p>
                              <div className="bg-light p-2 rounded small text-dark">
                                {receta.observaciones}
                              </div>
                            </div>
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

      {/* Cédulas de Registro */}
      {equipo.cedulas_registro && equipo.cedulas_registro.length > 0 && (
        <div className="card mb-4 shadow-sm border-0">
          <div className="card-header bg-primary text-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-file-earmark-text me-2"></i>
                Cédulas de Registro ({equipo.cedulas_registro.length})
              </h6>
            </div>
          </div>
          <div className="card-body py-3">
            <div className="row g-3">
              {equipo.cedulas_registro.map((cedula) => (
                <div key={cedula.id} className="col-lg-6 col-md-12">
                  <div className="card border-0 bg-light h-100">
                    <div className="card-body py-3">
                      <div className="d-flex align-items-start">
                        <div className="flex-shrink-0">
                          <i className="bi bi-file-earmark-text fs-2 text-dark"></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1 fw-bold text-dark">
                            Cédula #{cedula.id}
                          </h6>
                          <p className="mb-1 text-dark small">
                            <i className="bi bi-calendar me-1 text-primary"></i>
                            <strong>Fecha:</strong>{" "}
                            {formatDate(cedula.created_at)}
                          </p>
                          {cedula.tipo && (
                            <p className="mb-1 text-dark small">
                              <i className="bi bi-tag me-1 text-primary"></i>
                              <strong>Tipo:</strong> {cedula.tipo}
                            </p>
                          )}
                          {cedula.estado && (
                            <p className="mb-0 text-dark small">
                              <i className="bi bi-check-circle me-1 text-primary"></i>
                              <strong>Estado:</strong> {cedula.estado}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEquipoDetalleMejorado;
