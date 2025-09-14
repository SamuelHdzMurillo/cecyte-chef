import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import UserAddParticipante from "./UserAddParticipante.jsx";
import UserAddAcompanante from "./UserAddAcompanante.jsx";
import UserAddReceta from "./UserAddReceta.jsx";
import "./EquipoDetalle.css";

const UserEquipoDetalle = ({ equipoId, onBack, embedded = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = equipoId || paramId;
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddParticipante, setShowAddParticipante] = useState(false);
  const [showAddAcompanante, setShowAddAcompanante] = useState(false);
  const [showAddReceta, setShowAddReceta] = useState(false);

  useEffect(() => {
    fetchEquipo();
  }, [id]);

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

  const handleParticipanteAdded = () => {
    setShowAddParticipante(false);
    fetchEquipo(); // Recargar datos del equipo
  };

  const handleAcompananteAdded = () => {
    setShowAddAcompanante(false);
    fetchEquipo(); // Recargar datos del equipo
  };

  const handleRecetaAdded = () => {
    setShowAddReceta(false);
    fetchEquipo(); // Recargar datos del equipo
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
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-people-fill me-3"></i>
                Detalles del Equipo: {equipo.nombre_equipo}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa del equipo
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
            </div>
          </div>
        </div>
      </div>

      {/* Información General del Equipo */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-info-circle me-2"></i>
            Información General
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Equipo
              </label>
              <p className="mb-0 fs-6 fw-bold text-dark">
                {equipo.nombre_equipo}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Entidad Federativa
              </label>
              <p className="mb-0 fs-6">{equipo.entidad_federativa}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Estatus
              </label>
              <div>{getStatusBadge(equipo.estatus_del_equipo)}</div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Fecha de Creación
              </label>
              <p className="mb-0 fs-6">{formatDate(equipo.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Anfitrión */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-person-circle me-2"></i>
            Información del Anfitrión
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Anfitrión
              </label>
              <p className="mb-0 fs-6 fw-bold text-dark">
                {equipo.nombre_anfitrion}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Teléfono
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-telephone me-1 text-muted"></i>
                {equipo.telefono_anfitrion}
              </p>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Correo Electrónico
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-envelope me-1 text-muted"></i>
                {equipo.correo_anfitrion}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Información del Evento */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-calendar-event me-2"></i>
            Evento Asociado
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Evento
              </label>
              <p className="mb-0 fs-6 fw-bold text-dark">
                {equipo.evento?.nombre_evento}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Sede del Evento
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-geo-alt me-1 text-muted"></i>
                {equipo.evento?.sede_evento}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Fecha de Inicio
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-calendar-plus me-1 text-muted"></i>
                {formatDate(equipo.evento?.inicio_evento)}
              </p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Fecha de Fin
              </label>
              <p className="mb-0 fs-6">
                <i className="bi bi-calendar-check me-1 text-muted"></i>
                {formatDate(equipo.evento?.fin_evento)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participantes */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-people me-2"></i>
              Participantes ({equipo.participantes?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowAddParticipante(true)}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar Participante
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.participantes && equipo.participantes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 py-2 px-3">Nombre</th>
                    <th className="border-0 py-2 px-3">Rol</th>
                    <th className="border-0 py-2 px-3">Plantel</th>
                    <th className="border-0 py-2 px-3">Especialidad</th>
                    <th className="border-0 py-2 px-3">Semestre</th>
                    <th className="border-0 py-2 px-3">Matrícula</th>
                  </tr>
                </thead>
                <tbody>
                  {equipo.participantes.map((participante) => (
                    <tr key={participante.id}>
                      <td className="py-2 px-3">
                        <strong>{participante.nombre_participante}</strong>
                      </td>
                      <td className="py-2 px-3">
                        <span>{participante.rol_participante}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span>{participante.plantel_participante}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span>{participante.especialidad_participante}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span>{participante.semestre_participante}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="badge bg-secondary">
                          {participante.matricula_participante}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-people fs-1 text-muted mb-3 d-block opacity-50"></i>
              <p className="text-muted mb-0">
                No hay participantes registrados
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Acompañantes */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-person-badge me-2"></i>
              Acompañantes ({equipo.acompanantes?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowAddAcompanante(true)}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar Acompañante
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.acompanantes && equipo.acompanantes.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 py-2 px-3">Nombre</th>
                    <th className="border-0 py-2 px-3">Rol</th>
                    <th className="border-0 py-2 px-3">Puesto</th>
                    <th className="border-0 py-2 px-3">Teléfono</th>
                    <th className="border-0 py-2 px-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {equipo.acompanantes.map((acompanante) => (
                    <tr key={acompanante.id}>
                      <td className="py-2 px-3">
                        <strong>{acompanante.nombre_acompanante}</strong>
                      </td>
                      <td className="py-2 px-3">
                        <span>{acompanante.rol}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span>{acompanante.puesto}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span>
                          <i className="bi bi-telephone me-1 text-muted"></i>
                          {acompanante.telefono}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span>
                          <i className="bi bi-envelope me-1 text-muted"></i>
                          {acompanante.email}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-person-badge fs-1 text-muted mb-3 d-block opacity-50"></i>
              <p className="text-muted mb-0">No hay acompañantes registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Recetas */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-journal-text me-2"></i>
              Recetas ({equipo.recetas?.length || 0})
            </h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowAddReceta(true)}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Agregar Receta
            </button>
          </div>
        </div>
        <div className="card-body py-3">
          {equipo.recetas && equipo.recetas.length > 0 ? (
            <div className="row g-3">
              {equipo.recetas.map((receta) => (
                <div key={receta.id} className="col-lg-6 col-md-12">
                  <div className="card border-0 shadow-sm h-100">
                    <div
                      className="card-header text-white border-0 py-2"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    >
                      <strong className="fs-6">
                        <i className="bi bi-tag me-2"></i>
                        {receta.tipo_receta}
                      </strong>
                    </div>
                    <div className="card-body">
                      <h6 className="card-title fw-bold text-dark mb-3">
                        {receta.descripcion}
                      </h6>
                      <div className="mb-3">
                        <h6 className="fw-semibold text-dark mb-2">
                          <i className="bi bi-list-ul me-2"></i>
                          Ingredientes:
                        </h6>
                        <p className="text-muted small mb-0">
                          {receta.ingredientes}
                        </p>
                      </div>
                      <div className="mb-3">
                        <h6 className="fw-semibold text-dark mb-2">
                          <i className="bi bi-list-ol me-2"></i>
                          Preparación:
                        </h6>
                        <p className="text-muted small mb-0">
                          {receta.preparacion?.replace(/\\n/g, '\n')}
                        </p>
                      </div>
                      {receta.observaciones && (
                        <div className="mb-3">
                          <h6 className="fw-semibold text-dark mb-2">
                            <i className="bi bi-chat-square-text me-2"></i>
                            Observaciones:
                          </h6>
                          <p className="text-muted small mb-0">
                            {receta.observaciones}
                          </p>
                        </div>
                      )}
                      <div className="mt-auto">
                        <small className="text-muted">
                          <i className="bi bi-person me-1"></i>
                          Creado por: {receta.creado_por}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <i className="bi bi-journal-text fs-1 text-muted mb-3 d-block opacity-50"></i>
              <p className="text-muted mb-0">No hay recetas registradas</p>
            </div>
          )}
        </div>
      </div>

      {/* Cédulas de Registro */}
      {equipo.cedulas_registro && equipo.cedulas_registro.length > 0 && (
        <div className="card mb-3 shadow-sm border-0">
          <div
            className="card-header text-white border-0 py-2"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-file-text me-2"></i>
              Cédulas de Registro ({equipo.cedulas_registro.length})
            </h6>
          </div>
          <div className="card-body py-3">
            <div className="row g-3">
              {equipo.cedulas_registro.map((cedula) => (
                <div key={cedula.id} className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="fw-semibold text-dark mb-2">
                            <i className="bi bi-people me-2"></i>
                            Participantes:
                          </h6>
                          <ul className="list-unstyled">
                            {cedula.participantes.map((participante, index) => (
                              <li key={index} className="mb-1">
                                <i className="bi bi-person me-2 text-muted"></i>
                                {participante}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-semibold text-dark mb-2">
                            <i className="bi bi-person-badge me-2"></i>
                            Asesores:
                          </h6>
                          <ul className="list-unstyled">
                            {cedula.asesores.map((asesor, index) => (
                              <li key={index} className="mb-1">
                                <i className="bi bi-person-check me-2 text-muted"></i>
                                {asesor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`badge ${
                          cedula.estado === 'aprobada' ? 'bg-success' : 
                          cedula.estado === 'pendiente' ? 'bg-warning' : 'bg-secondary'
                        }`}>
                          <i className="bi bi-check-circle me-1"></i>
                          Estado: {cedula.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modales para agregar elementos */}
      {showAddParticipante && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <UserAddParticipante
                equipoId={equipo.id}
                onParticipanteAdded={handleParticipanteAdded}
                onCancel={() => setShowAddParticipante(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showAddAcompanante && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <UserAddAcompanante
                equipoId={equipo.id}
                onAcompananteAdded={handleAcompananteAdded}
                onCancel={() => setShowAddAcompanante(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showAddReceta && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <UserAddReceta
                equipoId={equipo.id}
                onRecetaAdded={handleRecetaAdded}
                onCancel={() => setShowAddReceta(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEquipoDetalle;
