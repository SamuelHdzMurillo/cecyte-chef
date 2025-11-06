import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./EquipoDetalle.css";

const EquipoDetalle = ({ equipoId, onBack, embedded = false }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = equipoId || paramId;
  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  const handleSave = async () => {
    try {
      const token = authService.getToken();

      // Validar estatus válido según el backend (activo, inactivo, eliminado)
      const validStatuses = ["activo", "inactivo", "eliminado"];
      const currentStatus = equipo.estatus_del_equipo || "activo";
      const validStatus = validStatuses.includes(currentStatus)
        ? currentStatus
        : "activo";

      // Preparar solo los campos que acepta el backend según la validación
      const dataToSave = {
        nombre_equipo: equipo.nombre_equipo || "",
        entidad_federativa: equipo.entidad_federativa || "",
        nombre_anfitrion: equipo.nombre_anfitrion || "",
        telefono_anfitrion: equipo.telefono_anfitrion || "",
        correo_anfitrion: equipo.correo_anfitrion || "",
        estatus_del_equipo: validStatus,
      };

      // medida_gas_propano debe ser numérico (nullable) según validación: 'nullable|numeric|min:0|max:999999.99'
      if (
        equipo.medida_gas_propano !== null &&
        equipo.medida_gas_propano !== undefined &&
        equipo.medida_gas_propano !== ""
      ) {
        const medidaNum = parseFloat(equipo.medida_gas_propano);
        if (!isNaN(medidaNum) && medidaNum >= 0 && medidaNum <= 999999.99) {
          dataToSave.medida_gas_propano = medidaNum;
        }
      } else {
        // Si está vacío, enviar null para que sea nullable
        dataToSave.medida_gas_propano = null;
      }

      const response = await apiService.put(
        `/equipos/${id}`,
        dataToSave,
        token
      );

      if (response.success !== false) {
        setEditMode(false);
        fetchEquipo(); // Recargar datos actualizados
        alert("Equipo actualizado correctamente");
      } else {
        console.error("Error en la respuesta:", response);
        alert(response.message || "Error al actualizar el equipo");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al actualizar el equipo";
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    fetchEquipo(); // Recargar datos originales
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      activo: "badge bg-success",
      inactivo: "badge bg-secondary",
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
        <p className="mt-3">Cargando detalles del equipo...</p>
      </div>
    );
  }

  if (error || !equipo) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar equipo</h4>
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
                <i className="bi bi-people-fill me-3"></i>
                Detalles del Equipo: {equipo.nombre_equipo}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa y edición del equipo
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
                  >
                    <i className="bi bi-check-lg me-2"></i>
                    Guardar
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

      {/* Información General del Equipo */}
      <div className="card mb-3 shadow-sm border-0">
        <div
          className="card-header text-white border-0 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          <h6 className="mb-0 fw-bold">
            <i className="bi bi-info-circle me-2"></i>
            Información General del Equipo
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Nombre del Equipo
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={equipo.nombre_equipo || ""}
                  onChange={(e) =>
                    setEquipo({ ...equipo, nombre_equipo: e.target.value })
                  }
                />
              ) : (
                <p className="mb-0 fs-6 fw-bold text-dark">
                  {equipo.nombre_equipo}
                </p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Entidad Federativa
              </label>
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={equipo.entidad_federativa || ""}
                  onChange={(e) =>
                    setEquipo({ ...equipo, entidad_federativa: e.target.value })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">{equipo.entidad_federativa}</p>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Estatus
              </label>
              {editMode ? (
                <select
                  className="form-select"
                  value={equipo.estatus_del_equipo || "activo"}
                  onChange={(e) =>
                    setEquipo({ ...equipo, estatus_del_equipo: e.target.value })
                  }
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="eliminado">Eliminado</option>
                </select>
              ) : (
                <div>{getStatusBadge(equipo.estatus_del_equipo)}</div>
              )}
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                Fecha de Creación
              </label>
              <p className="mb-0 fs-6">{formatDate(equipo.created_at)}</p>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-fire me-1 text-primary"></i>
                Medida de Tanque de Gas (kg)
              </label>
              {editMode ? (
                <div>
                  <select
                    className="form-select mb-2"
                    value={
                      equipo.medida_gas_propano === 0.5
                        ? "1/2"
                        : equipo.medida_gas_propano === 0.25
                        ? "1/4"
                        : equipo.medida_gas_propano === 16.4
                        ? "16.4"
                        : equipo.medida_gas_propano !== null &&
                          equipo.medida_gas_propano !== undefined &&
                          equipo.medida_gas_propano !== ""
                        ? "otro"
                        : ""
                    }
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === "") {
                        setEquipo({
                          ...equipo,
                          medida_gas_propano: null,
                        });
                      } else if (selectedValue === "1/2") {
                        setEquipo({
                          ...equipo,
                          medida_gas_propano: 0.5,
                        });
                      } else if (selectedValue === "1/4") {
                        setEquipo({
                          ...equipo,
                          medida_gas_propano: 0.25,
                        });
                      } else if (selectedValue === "16.4") {
                        setEquipo({
                          ...equipo,
                          medida_gas_propano: 16.4,
                        });
                      } else if (selectedValue === "otro") {
                        // Mantener el valor actual si existe y no es una opción predefinida
                        const currentValue = equipo.medida_gas_propano;
                        if (
                          currentValue !== null &&
                          currentValue !== undefined &&
                          currentValue !== 0.5 &&
                          currentValue !== 0.25 &&
                          currentValue !== 16.4
                        ) {
                          // Mantener el valor actual
                        } else {
                          setEquipo({
                            ...equipo,
                            medida_gas_propano: null,
                          });
                        }
                      }
                    }}
                  >
                    <option value="">Seleccionar medida</option>
                    <option value="1/2">1/2 kg</option>
                    <option value="1/4">1/4 kg</option>
                    <option value="16.4">16.4 kg</option>
                    <option value="otro">Otro (especificar)</option>
                  </select>
                  {/* Mostrar input manual si el valor no es una opción predefinida */}
                  {(() => {
                    const currentValue = equipo.medida_gas_propano;
                    const isPredefined =
                      currentValue === 0.5 ||
                      currentValue === 0.25 ||
                      currentValue === 16.4;
                    const showManualInput =
                      currentValue === null ||
                      currentValue === undefined ||
                      !isPredefined;

                    return showManualInput ? (
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Especificar medida personalizada (kg)"
                        min="0"
                        max="999999.99"
                        step="0.01"
                        value={
                          currentValue !== null &&
                          currentValue !== undefined &&
                          !isPredefined
                            ? currentValue
                            : ""
                        }
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const value =
                            inputValue === "" || inputValue === null
                              ? null
                              : parseFloat(inputValue);
                          setEquipo({
                            ...equipo,
                            medida_gas_propano: isNaN(value) ? null : value,
                          });
                        }}
                      />
                    ) : null;
                  })()}
                </div>
              ) : (
                <p className="mb-0 fs-6 fw-bold text-dark">
                  {equipo.medida_gas_propano !== null &&
                  equipo.medida_gas_propano !== undefined &&
                  equipo.medida_gas_propano !== ""
                    ? `${equipo.medida_gas_propano} kg`
                    : "No especificado"}
                </p>
              )}
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
              {editMode ? (
                <input
                  type="text"
                  className="form-control"
                  value={equipo.nombre_anfitrion || ""}
                  onChange={(e) =>
                    setEquipo({ ...equipo, nombre_anfitrion: e.target.value })
                  }
                />
              ) : (
                <p className="mb-0 fs-6 fw-bold text-dark">
                  {equipo.nombre_anfitrion}
                </p>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold text-dark mb-2">
                Teléfono
              </label>
              {editMode ? (
                <input
                  type="tel"
                  className="form-control"
                  value={equipo.telefono_anfitrion || ""}
                  onChange={(e) =>
                    setEquipo({ ...equipo, telefono_anfitrion: e.target.value })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  <i className="bi bi-telephone me-1 text-muted"></i>
                  {equipo.telefono_anfitrion}
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
                  value={equipo.correo_anfitrion || ""}
                  onChange={(e) =>
                    setEquipo({ ...equipo, correo_anfitrion: e.target.value })
                  }
                />
              ) : (
                <p className="mb-0 fs-6">
                  <i className="bi bi-envelope me-1 text-muted"></i>
                  {equipo.correo_anfitrion}
                </p>
              )}
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
            {editMode && (
              <button className="btn btn-sm btn-outline-light">
                <i className="bi bi-plus-lg me-1"></i>
                Agregar Participante
              </button>
            )}
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
                    {editMode && (
                      <th className="border-0 py-2 px-3">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {equipo.participantes.map((participante) => (
                    <tr key={participante.id}>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={participante.nombre_participante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar participante
                            }}
                          />
                        ) : (
                          <strong>{participante.nombre_participante}</strong>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <select
                            className="form-select form-select-sm"
                            value={participante.rol_participante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar rol
                            }}
                          >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="coordinador">Coordinador</option>
                          </select>
                        ) : (
                          <span>{participante.rol_participante}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={participante.plantel_participante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar plantel
                            }}
                          />
                        ) : (
                          <span>{participante.plantel_participante}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={participante.especialidad_participante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar especialidad
                            }}
                          />
                        ) : (
                          <span>{participante.especialidad_participante}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <select
                            className="form-select form-select-sm"
                            value={participante.semestre_participante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar semestre
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(
                              (sem) => (
                                <option key={sem} value={sem}>
                                  {sem}°
                                </option>
                              )
                            )}
                          </select>
                        ) : (
                          <span>{participante.semestre_participante}</span>
                        )}
                      </td>
                      {editMode && (
                        <td className="py-2 px-3">
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      )}
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
            {editMode && (
              <button className="btn btn-sm btn-outline-light">
                <i className="bi bi-plus-lg me-1"></i>
                Agregar Acompañante
              </button>
            )}
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
                    {editMode && (
                      <th className="border-0 py-2 px-3">Acciones</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {equipo.acompanantes.map((acompanante) => (
                    <tr key={acompanante.id}>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={acompanante.nombre_acompanante || ""}
                            onChange={(e) => {
                              // Lógica para actualizar acompañante
                            }}
                          />
                        ) : (
                          <strong>{acompanante.nombre_acompanante}</strong>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={acompanante.rol || ""}
                            onChange={(e) => {
                              // Lógica para actualizar rol
                            }}
                          />
                        ) : (
                          <span>{acompanante.rol}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={acompanante.puesto || ""}
                            onChange={(e) => {
                              // Lógica para actualizar puesto
                            }}
                          />
                        ) : (
                          <span>{acompanante.puesto}</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="tel"
                            className="form-control form-control-sm"
                            value={acompanante.telefono || ""}
                            onChange={(e) => {
                              // Lógica para actualizar teléfono
                            }}
                          />
                        ) : (
                          <span>
                            <i className="bi bi-telephone me-1 text-muted"></i>
                            {acompanante.telefono}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {editMode ? (
                          <input
                            type="email"
                            className="form-control form-control-sm"
                            value={acompanante.email || ""}
                            onChange={(e) => {
                              // Lógica para actualizar email
                            }}
                          />
                        ) : (
                          <span>
                            <i className="bi bi-envelope me-1 text-muted"></i>
                            {acompanante.email}
                          </span>
                        )}
                      </td>
                      {editMode && (
                        <td className="py-2 px-3">
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      )}
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
            {editMode && (
              <button className="btn btn-sm btn-outline-light">
                <i className="bi bi-plus-lg me-1"></i>
                Agregar Receta
              </button>
            )}
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
                      {editMode ? (
                        <input
                          type="text"
                          className="form-control form-control-sm bg-transparent text-white border-0"
                          value={receta.tipo_receta || ""}
                          placeholder="Tipo de receta"
                          onChange={(e) => {
                            // Lógica para actualizar tipo de receta
                          }}
                        />
                      ) : (
                        <strong className="fs-6">
                          <i className="bi bi-tag me-2"></i>
                          {receta.tipo_receta}
                        </strong>
                      )}
                    </div>
                    <div className="card-body py-3">
                      {editMode ? (
                        <>
                          <textarea
                            className="form-control mb-2"
                            rows="2"
                            value={receta.descripcion || ""}
                            placeholder="Descripción de la receta"
                            onChange={(e) => {
                              // Lógica para actualizar descripción
                            }}
                          />
                          <textarea
                            className="form-control mb-2"
                            rows="3"
                            value={receta.ingredientes || ""}
                            placeholder="Ingredientes"
                            onChange={(e) => {
                              // Lógica para actualizar ingredientes
                            }}
                          />
                          <textarea
                            className="form-control mb-2"
                            rows="4"
                            value={receta.preparacion || ""}
                            placeholder="Preparación"
                            onChange={(e) => {
                              // Lógica para actualizar preparación
                            }}
                          />
                          <textarea
                            className="form-control mb-2"
                            rows="2"
                            value={receta.observaciones || ""}
                            placeholder="Observaciones (opcional)"
                            onChange={(e) => {
                              // Lógica para actualizar observaciones
                            }}
                          />
                        </>
                      ) : (
                        <>
                          {receta.descripcion && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                                <i className="bi bi-journal-text me-2 text-primary"></i>
                                Descripción
                              </h6>
                              <p
                                className="mb-0 text-dark"
                                style={{
                                  whiteSpace: "pre-line",
                                  lineHeight: "1.6",
                                }}
                              >
                                {receta.descripcion}
                              </p>
                            </div>
                          )}

                          {receta.ingredientes && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                                <i className="bi bi-list-ul me-2 text-success"></i>
                                Ingredientes
                              </h6>
                              <div className="bg-light p-3 rounded border-start border-success border-4">
                                <div
                                  className="text-dark"
                                  style={{
                                    whiteSpace: "pre-line",
                                    lineHeight: "1.6",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {receta.ingredientes}
                                </div>
                              </div>
                            </div>
                          )}

                          {receta.preparacion && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-dark mb-2 d-flex align-items-center">
                                <i className="bi bi-list-ol me-2 text-info"></i>
                                Preparación
                              </h6>
                              <div className="bg-light p-3 rounded border-start border-info border-4">
                                <div
                                  className="text-dark"
                                  style={{
                                    whiteSpace: "pre-line",
                                    lineHeight: "1.6",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {receta.preparacion?.replace(/\\n/g, "\n")}
                                </div>
                              </div>
                            </div>
                          )}

                          {receta.observaciones && (
                            <div className="mb-3">
                              <h6 className="fw-semibold text-muted mb-2 d-flex align-items-center">
                                <i className="bi bi-chat-text me-2 text-warning"></i>
                                Observaciones
                              </h6>
                              <div className="bg-light p-3 rounded border-start border-warning border-4">
                                <p
                                  className="text-muted mb-0"
                                  style={{
                                    whiteSpace: "pre-line",
                                    lineHeight: "1.6",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  {receta.observaciones}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="d-flex align-items-center mt-3 pt-3 border-top">
                        <i className="bi bi-person-circle me-1 text-muted"></i>
                        <small className="text-muted">
                          Creado por: <strong>{receta.creado_por}</strong>
                        </small>
                      </div>

                      {editMode && (
                        <div className="mt-2">
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash me-1"></i>
                            Eliminar
                          </button>
                        </div>
                      )}
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
    </div>
  );
};

export default EquipoDetalle;
