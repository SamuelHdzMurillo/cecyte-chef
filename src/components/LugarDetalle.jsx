import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./LugarDetalle.css";

const LugarDetalle = ({ lugarId, onBack, embedded = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Usar lugarId si viene como prop, sino usar el id de la URL
  const currentId = lugarId || id;

  useEffect(() => {
    if (currentId) {
      fetchLugar();
    }
  }, [currentId]);

  const fetchLugar = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      // Intentar obtener el lugar individual primero
      try {
        const response = await apiService.get(
          `/lugares-interes/${currentId}`,
          token
        );

        if (response && response.id) {
          setLugar(response);
          setError(null);
          return;
        }
      } catch (individualError) {
        console.log("Endpoint individual no disponible, usando lista completa");
      }

      // Fallback: Obtener todos los lugares y filtrar por ID
      const response = await apiService.get("/lugares-interes", token);

      if (response && Array.isArray(response)) {
        const lugarEncontrado = response.find((l) => l.id == currentId);
        if (lugarEncontrado) {
          setLugar(lugarEncontrado);
          setError(null);
        } else {
          setError("No se encontró el lugar de interés");
        }
      } else {
        setError("No se encontró el lugar de interés");
      }
    } catch (err) {
      console.error("Error al obtener lugar de interés:", err);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = authService.getToken();

      // Preparar datos para enviar
      const dataToSend = {
        nombre: lugar.nombre,
        direccion: lugar.direccion,
        web: lugar.web,
        estatus: lugar.estatus,
        descripcion: lugar.descripcion,
      };

      console.log("Datos a enviar para actualizar lugar:", dataToSend);

      const response = await apiService.put(
        `/lugares-interes/${currentId}`,
        dataToSend,
        token
      );

      console.log("Respuesta del servidor:", response);

      // Verificar si la respuesta es exitosa
      if (response && response.id) {
        // La API devuelve directamente el objeto actualizado
        setLugar(response); // Actualizar el estado con la respuesta
        setEditMode(false);
        alert("Lugar de interés actualizado correctamente");
      } else {
        console.log("Respuesta no exitosa:", response);
        alert(
          "Error: No se pudo actualizar el lugar de interés. Respuesta inesperada del servidor."
        );
      }
    } catch (err) {
      console.error("Error al guardar:", err);

      // Manejar errores de validación del servidor (422)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log("Errores de validación:", err.response.data.errors);
        alert(
          `Error de validación: ${Object.values(err.response.data.errors).join(
            ", "
          )}`
        );
      } else if (err.response?.status === 422 && err.response?.data?.message) {
        alert(`Error de validación: ${err.response.data.message}`);
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert(
          "Error al actualizar el lugar de interés. Por favor, intenta de nuevo."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchLugar(); // Recargar datos originales
  };

  const handleInputChange = (field, value) => {
    setLugar((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const getEstatusBadgeColor = (estatus) => {
    switch (estatus) {
      case "activo":
        return "success";
      case "inactivo":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getEstatusDisplayName = (estatus) => {
    switch (estatus) {
      case "activo":
        return "Activo";
      case "inactivo":
        return "Inactivo";
      default:
        return estatus;
    }
  };

  if (loading) {
    return (
      <div className="lugar-detalle-container">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "var(--primary-color)" }}
            role="status"
          >
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles del lugar de interés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lugar-detalle-container">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="text-danger mb-3">
              <i className="bi bi-exclamation-triangle fs-1"></i>
            </div>
            <h5 className="text-danger">{error}</h5>
            <button className="btn btn-primary mt-3" onClick={handleBack}>
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lugar) {
    return (
      <div className="lugar-detalle-container">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="text-muted mb-3">
              <i className="bi bi-question-circle fs-1"></i>
            </div>
            <h5 className="text-muted">Lugar de interés no encontrado</h5>
            <button className="btn btn-primary mt-3" onClick={handleBack}>
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`lugar-detalle-container ${embedded ? 'embedded' : ''}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-geo-alt me-3"></i>
                Detalles del Lugar: {lugar.nombre}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa y edición del lugar de interés
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light px-4 py-2"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
              {!editMode ? (
                <button 
                  className="btn btn-warning px-4 py-2"
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
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
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
                    disabled={saving}
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

      <div className="row">
        {/* Información General */}
        <div className="col-lg-8">
          {/* Información Básica */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-primary">
                <i className="bi bi-info-circle me-2"></i>
                Información Básica
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Nombre del Lugar</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={lugar.nombre || ''}
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
                    />
                  ) : (
                    <p className="mb-0 fs-6 fw-bold text-primary">{lugar.nombre}</p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Dirección</label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="2"
                      value={lugar.direccion || ''}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>
                      {lugar.direccion}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Descripción</label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="3"
                      value={lugar.descripcion || ''}
                      onChange={(e) => handleInputChange('descripcion', e.target.value)}
                      placeholder="Descripción del lugar de interés"
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      {lugar.descripcion || "Sin descripción disponible"}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Estatus</label>
                  {editMode ? (
                    <select
                      className="form-control"
                      value={lugar.estatus || 'activo'}
                      onChange={(e) => handleInputChange('estatus', e.target.value)}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  ) : (
                    <p className="mb-0 fs-6">
                      <span className={`badge bg-${getEstatusBadgeColor(lugar.estatus)}`}>
                        {getEstatusDisplayName(lugar.estatus)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información Web */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-success">
                <i className="bi bi-globe me-2"></i>
                Información Web
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Sitio Web</label>
                  {editMode ? (
                    <input
                      type="url"
                      className="form-control"
                      value={lugar.web || ''}
                      onChange={(e) => handleInputChange('web', e.target.value)}
                      placeholder="https://ejemplo.com"
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      {lugar.web ? (
                        <a
                          href={lugar.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                        >
                          <i className="bi bi-globe me-1 text-muted"></i>
                          {lugar.web}
                        </a>
                      ) : (
                        <span className="text-muted">No disponible</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="col-lg-4">
          {/* Información del Sistema */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-secondary">
                <i className="bi bi-info-square me-2"></i>
                Información del Sistema
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">ID del Lugar</label>
                <p className="mb-0 fs-6">
                  <span className="badge bg-secondary fs-6 px-3 py-2">#{lugar.id}</span>
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">Estatus</label>
                <p className="mb-0 fs-6">
                  <span className={`badge bg-${getEstatusBadgeColor(lugar.estatus)} fs-6 px-3 py-2`}>
                    {getEstatusDisplayName(lugar.estatus)}
                  </span>
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">Fecha de Creación</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-plus me-1 text-muted"></i>
                  {formatDate(lugar.created_at)}
                </p>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Última Actualización</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-check me-1 text-muted"></i>
                  {formatDate(lugar.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LugarDetalle;
