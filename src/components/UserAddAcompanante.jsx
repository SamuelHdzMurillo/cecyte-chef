import React, { useState } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";

const UserAddAcompanante = ({ equipoId, onAcompananteAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_acompanante: "",
    rol: "",
    puesto: "",
    talla: "M",
    telefono: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = authService.getToken();

      // Agregar el acompañante al equipo
      const response = await fetch(
        "https://chef-api.cecytebcs.edu.mx/public/api/acompanantes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            equipo_id: equipoId,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        onAcompananteAdded();
        // Limpiar formulario
        setFormData({
          nombre_acompanante: "",
          rol: "",
          puesto: "",
          talla: "M",
          telefono: "",
          email: "",
        });
      } else {
        setError(responseData.message || "Error al agregar acompañante");
      }
    } catch (err) {
      console.error("Error al agregar acompañante:", err);
      setError("Error al agregar acompañante. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-info text-white">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-person-badge-plus me-2"></i>
          Agregar Nuevo Acompañante
        </h6>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nombre Completo *
              </label>
              <input
                type="text"
                className="form-control"
                name="nombre_acompanante"
                value={formData.nombre_acompanante}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Rol *</label>
              <select
                className="form-select"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="Asesor Académico">Asesor Académico</option>
                <option value="Coordinador">Coordinador</option>
                <option value="Docente">Docente</option>
                <option value="Director">Director</option>
                <option value="Subdirector">Subdirector</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Puesto *</label>
              <input
                type="text"
                className="form-control"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                placeholder="Ej: Profesor Titular, Coordinador de Eventos"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Talla</label>
              <select
                className="form-select"
                name="talla"
                value={formData.talla}
                onChange={handleChange}
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Teléfono *</label>
              <input
                type="tel"
                className="form-control"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Correo Electrónico *
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-info" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Agregando...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-2"></i>
                  Agregar Acompañante
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              <i className="bi bi-x-lg me-2"></i>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAddAcompanante;
