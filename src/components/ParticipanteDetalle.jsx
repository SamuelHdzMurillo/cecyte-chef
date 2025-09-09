import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./ParticipanteDetalle.css";

const ParticipanteDetalle = ({ participanteId, onBack, embedded = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = participanteId || paramId;
  const [participante, setParticipante] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    fetchParticipante();
  }, [id]);

  const fetchParticipante = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get(`/participantes/${id}`, token);

      if (response.data) {
        setParticipante(response.data);
        setError(null);
      } else {
        setError("No se encontró el participante");
      }
    } catch (err) {
      console.error("Error al obtener participante:", err);
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
      navigate("/dashboard/participantes");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);

      // Crear una copia del participante sin el campo foto_credencial
      const participanteToSave = { ...participante };
      delete participanteToSave.foto_credencial;

      const token = authService.getToken();
      const response = await apiService.put(
        `/participantes/${id}`,
        participanteToSave,
        token
      );

      if (response && response.data) {
        setParticipante(response.data);
        setEditMode(false);
        setSaveMessage({
          type: "success",
          text: "Participante actualizado correctamente",
        });

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveMessage({
        type: "error",
        text: `Error al guardar: ${err.message || "Error desconocido"}`,
      });

      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSaveMessage(null);
    fetchParticipante(); // Recargar datos originales
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
        <p className="mt-3">Cargando detalles del participante...</p>
      </div>
    );
  }

  if (error || !participante) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar participante</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={`equipos-table-container ${embedded ? "embedded" : ""}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-person-circle me-3"></i>
                Detalles del Participante: {participante.nombre_participante}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa y edición del participante
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-light px-4 py-2"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
              {!editMode ? (
                <button
                  className="btn btn-outline-light px-4 py-2"
                  onClick={() => setEditMode(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-success px-4 py-2"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        >
                          <span className="visually-hidden">Guardando...</span>
                        </div>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-secondary px-4 py-2"
                    onClick={handleCancel}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de feedback */}
      {saveMessage && (
        <div
          className={`alert alert-${
            saveMessage.type === "success" ? "success" : "danger"
          } alert-dismissible fade show`}
          role="alert"
        >
          <i
            className={`bi bi-${
              saveMessage.type === "success"
                ? "check-circle"
                : "exclamation-triangle"
            } me-2`}
          ></i>
          {saveMessage.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSaveMessage(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Información General del Participante */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-info-circle me-2"></i>
            Información General del Participante
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Participante
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.nombre_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      nombre_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6 fw-bold text-dark">
                  {participante.nombre_participante}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Matrícula
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.matricula_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      matricula_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  {participante.matricula_participante}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Rol
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={participante.rol_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      rol_participante: e.target.value,
                    })
                  }
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="coordinador">Coordinador</option>
                </select>
              ) : (
                <div>{participante.rol_participante}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Semestre
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={participante.semestre_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      semestre_participante: e.target.value,
                    })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}°
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mb-0 fs-6">
                  {participante.semestre_participante}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información de Contacto */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-person-circle me-2"></i>
            Información de Contacto
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Teléfono
              </label>
              {editMode ? (
                <input
                  type="tel"
                  className="form-control"
                  value={participante.telefono_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      telefono_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  <i className="bi bi-telephone me-1 text-muted"></i>
                  {participante.telefono_participante}
                </p>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Correo Electrónico
              </label>
              {editMode ? (
                <input
                  type="email"
                  className="form-control"
                  value={participante.correo_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      correo_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  <i className="bi bi-envelope me-1 text-muted"></i>
                  {participante.correo_participante}
                </p>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Fecha de Creación
              </label>
              <p className="mb-0 fs-6">{formatDate(participante.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información Académica */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-mortarboard me-2"></i>
            Información Académica
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Plantel
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.plantel_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      plantel_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6 fw-bold text-dark">
                  {participante.plantel_participante}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                CCT
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.plantelcct || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      plantelcct: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  <i className="bi bi-building me-1 text-muted"></i>
                  {participante.plantelcct}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Especialidad
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.especialidad_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      especialidad_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  {participante.especialidad_participante}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Talla
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={participante.talla_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      talla_participante: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">{participante.talla_participante}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información Médica */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-heart-pulse me-2"></i>
            Información Médica
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Tipo de Sangre
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={participante.tipo_sangre_participante || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      tipo_sangre_participante: e.target.value,
                    })
                  }
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <div>{participante.tipo_sangre_participante}</div>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Seguro Facultativo
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={participante.seguro_facultativo ? "true" : "false"}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      seguro_facultativo: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <div>{participante.seguro_facultativo ? "Sí" : "No"}</div>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Alergias
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={participante.alergico ? "true" : "false"}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      alergico: e.target.value === "true",
                    })
                  }
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              ) : (
                <div>{participante.alergico ? "Sí" : "No"}</div>
              )}
            </div>
            {participante.alergico && (
              <div className="col-12">
                <label className="form-label fw-semibold text-dark mb-2">
                  Descripción de Alergias
                </label>
                {editMode ? (
                  <textarea
                    className="form-control"
                    rows="2"
                    value={participante.alergias || ""}
                    onChange={(e) =>
                      setParticipante({
                        ...participante,
                        alergias: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="mb-0 fs-6">
                    {participante.alergias || "No especificado"}
                  </p>
                )}
              </div>
            )}
            <div className="col-12">
              <label className="form-label fw-semibold text-dark mb-2">
                Medicamentos
              </label>
              {editMode ? (
                <textarea
                  className="form-control"
                  rows="2"
                  value={participante.medicamentos || ""}
                  onChange={(e) =>
                    setParticipante({
                      ...participante,
                      medicamentos: e.target.value,
                    })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  {participante.medicamentos || "Ninguno"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Información del Equipo */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-people me-2"></i>
            Equipo Asociado
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Equipo
              </label>
              <p className="mb-0 fs-6 fw-bold text-dark">
                {participante.equipo?.nombre_equipo || "Sin equipo asignado"}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Entidad Federativa
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-geo-alt me-1 text-muted"></i>
                {participante.equipo?.entidad_federativa || "N/A"}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Estatus del Equipo
              </label>
              <div>
                {participante.equipo
                  ? getStatusBadge(participante.equipo.estatus_del_equipo)
                  : "N/A"}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Anfitrión
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-person me-1 text-muted"></i>
                {participante.equipo?.nombre_anfitrion || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipanteDetalle;
