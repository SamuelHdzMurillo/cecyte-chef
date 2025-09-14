import React, { useState, useEffect } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./LugaresInteresTable.css";

const LugaresInteresTable = ({ onLugarSelect }) => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lugaresPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Estados para el modal de creación
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    web: "",
    estatus: "activo",
    descripcion: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLugares();
  }, []);

  // Efecto para debuggear el estado del modal
  useEffect(() => {
    console.log('Estado del modal:', showModal);
  }, [showModal]);

  const fetchLugares = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      const response = await apiService.get("/lugares-interes", token);

      if (response && Array.isArray(response)) {
        setLugares(response);
        setError(null);
      } else {
        setLugares([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener lugares de interés:", err);
      setLugares([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchLugares();
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

  const filteredLugares = lugares.filter(
    (lugar) =>
      (lugar.nombre &&
        lugar.nombre.toLowerCase().includes(filterText.toLowerCase())) ||
      (lugar.direccion &&
        lugar.direccion.toLowerCase().includes(filterText.toLowerCase())) ||
      (lugar.descripcion &&
        lugar.descripcion.toLowerCase().includes(filterText.toLowerCase()))
  );

  const sortedLugares = [...filteredLugares].sort((a, b) => {
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
  const indexOfLastLugar = currentPage * lugaresPerPage;
  const indexOfFirstLugar = indexOfLastLugar - lugaresPerPage;
  const currentLugares = sortedLugares.slice(
    indexOfFirstLugar,
    indexOfLastLugar
  );
  const totalPages = Math.ceil(sortedLugares.length / lugaresPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  // Funciones para el modal
  const openCreateModal = () => {
    setFormData({
      nombre: "",
      direccion: "",
      web: "",
      estatus: "activo",
      descripcion: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      nombre: "",
      direccion: "",
      web: "",
      estatus: "activo",
      descripcion: "",
    });
    setFormErrors({});
  };

  const forceCloseModal = () => {
    console.log('Forzando cierre del modal...');
    setShowModal(false);
    setFormData({
      nombre: "",
      direccion: "",
      web: "",
      estatus: "activo",
      descripcion: "",
    });
    setFormErrors({});
    setSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es requerido";
    }

    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es requerida";
    }

    if (!formData.estatus) {
      errors.estatus = "El estatus es requerido";
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
      console.log("Enviando datos:", formData);
      const response = await apiService.post(
        "/lugares-interes",
        formData,
        token
      );
      console.log("Respuesta de la API:", response);

      // Verificar diferentes formatos de respuesta
      if (response && (response.success || response.data || response.id)) {
        // Agregar nuevo lugar
        const newLugar = {
          ...formData,
          id: response.data?.id || response.id || Math.max(...lugares.map((l) => l.id)) + 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setLugares((prev) => [...prev, newLugar]);

        // Mostrar mensaje de éxito
        alert("Lugar de interés creado exitosamente");
        
        // Cerrar modal inmediatamente
        forceCloseModal();

        // Respaldo: cerrar modal después de 1 segundo si no se cerró automáticamente
        setTimeout(() => {
          console.log('Verificando estado del modal para cierre de respaldo...');
          forceCloseModal();
        }, 1000);
      } else {
        console.log("Respuesta no válida:", response);
        alert("Error: Respuesta no válida del servidor");
      }
    } catch (error) {
      console.error("Error al guardar lugar de interés:", error);
      alert(
        "Error al guardar el lugar de interés. Por favor, inténtalo de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewLugar = (lugar) => {
    if (onLugarSelect) {
      onLugarSelect(lugar.id);
    }
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
        <p className="mt-3">Cargando lugares de interés...</p>
      </div>
    );
  }

  // Si no hay lugares y no hay error, mostrar mensaje
  if (lugares.length === 0) {
    return (
      <div className="card">
        <div
          className="card-header"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: "white" }}>
              <i className="bi bi-geo-alt me-2"></i>
              Gestión de Lugares de Interés
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
          <i className="bi bi-geo-alt fs-1 text-muted d-block mb-3"></i>
          <p className="text-muted mb-3">
            No hay lugares de interés disponibles
          </p>
          <p className="text-muted small">
            Verifica tu conexión al servidor o contacta al administrador.
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
              <i className="bi bi-geo-alt me-2"></i>
              Gestión de Lugares de Interés
            </h5>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={openCreateModal}>
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Lugar
              </button>
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
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
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
                  placeholder="Buscar lugares por nombre, dirección o descripción..."
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
                Mostrando {currentLugares.length} de {filteredLugares.length}{" "}
                lugares
              </span>
            </div>
          </div>

          {/* Tabla de lugares */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th
                    scope="col"
                    style={{ width: "80px", cursor: "pointer" }}
                    onClick={() => handleSort("id")}
                  >
                    <div className="d-flex align-items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("nombre")}
                  >
                    <div className="d-flex align-items-center">
                      Nombre {getSortIcon("nombre")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("direccion")}
                  >
                    <div className="d-flex align-items-center">
                      Dirección {getSortIcon("direccion")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "120px", cursor: "pointer" }}
                    onClick={() => handleSort("estatus")}
                  >
                    <div className="d-flex align-items-center">
                      Estatus {getSortIcon("estatus")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="d-flex align-items-center">
                      Fecha Creación {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentLugares.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron lugares con la búsqueda actual
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
                  currentLugares.map((lugar) => (
                    <tr key={lugar.id}>
                      <td className="text-center">
                        <span className="badge bg-secondary">{lugar.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="lugar-icon me-3">
                            <i className="bi bi-geo-alt-fill"></i>
                          </div>
                          <div>
                            <div className="fw-bold">{lugar.nombre}</div>
                            <small className="text-muted">ID: {lugar.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{lugar.direccion}</div>
                          {lugar.web && (
                            <small className="text-primary">
                              <i className="bi bi-globe me-1"></i>
                              <a
                                href={lugar.web}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Sitio web
                              </a>
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge bg-${getEstatusBadgeColor(
                            lugar.estatus
                          )}`}
                        >
                          {getEstatusDisplayName(lugar.estatus)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{formatDate(lugar.created_at)}</div>
                          <small className="text-muted">
                            {formatTime(lugar.created_at)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "var(--primary-color)",
                              borderColor: "var(--primary-color)",
                              color: "white",
                            }}
                            title="Ver detalles"
                            onClick={() => handleViewLugar(lugar)}
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

      {/* Modal para crear lugar */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Lugar de Interés
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
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">
                        Nombre <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.nombre ? "is-invalid" : ""
                        }`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre del lugar"
                      />
                      {formErrors.nombre && (
                        <div className="invalid-feedback">
                          {formErrors.nombre}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="estatus" className="form-label">
                        Estatus <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          formErrors.estatus ? "is-invalid" : ""
                        }`}
                        id="estatus"
                        name="estatus"
                        value={formData.estatus}
                        onChange={handleInputChange}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                      {formErrors.estatus && (
                        <div className="invalid-feedback">
                          {formErrors.estatus}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="direccion" className="form-label">
                        Dirección <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.direccion ? "is-invalid" : ""
                        }`}
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        placeholder="Ingresa la dirección del lugar"
                      />
                      {formErrors.direccion && (
                        <div className="invalid-feedback">
                          {formErrors.direccion}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="web" className="form-label">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="web"
                        name="web"
                        value={formData.web}
                        onChange={handleInputChange}
                        placeholder="https://ejemplo.com"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="descripcion" className="form-label">
                        Descripción
                      </label>
                      <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        rows="3"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        placeholder="Ingresa una descripción del lugar"
                      />
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
                        Crear Lugar
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

export default LugaresInteresTable;
