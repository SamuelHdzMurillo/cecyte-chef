import React, { useState, useEffect } from "react";
import authService from "../services/authService.js";

const UserEditEquipo = ({ equipo, onEquipoUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_equipo: "",
    entidad_federativa: "",
    estatus_del_equipo: "activo",
    nombre_anfitrion: "",
    telefono_anfitrion: "",
    correo_anfitrion: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (equipo) {
      setFormData({
        nombre_equipo: equipo.nombre_equipo || "",
        entidad_federativa: equipo.entidad_federativa || "",
        estatus_del_equipo: equipo.estatus_del_equipo || "activo",
        nombre_anfitrion: equipo.nombre_anfitrion || "",
        telefono_anfitrion: equipo.telefono_anfitrion || "",
        correo_anfitrion: equipo.correo_anfitrion || "",
      });
    }
  }, [equipo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = authService.getToken();

      // Enviar datos actualizados
      const response = await fetch(
        `https://chef-api.cecytebcs.edu.mx/public/api/equipos/${equipo.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        onEquipoUpdated();
      } else {
        setError(responseData.message || "Error al actualizar equipo");
      }
    } catch (err) {
      console.error("Error al actualizar equipo:", err);
      setError("Error al actualizar equipo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-pencil-square me-2"></i>
          Editar Información del Equipo
        </h6>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Información General */}
            <div className="col-12">
              <h6 className="fw-bold text-dark mb-3">Información General</h6>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nombre del Equipo *
              </label>
              <input
                type="text"
                className="form-control"
                name="nombre_equipo"
                value={formData.nombre_equipo}
                onChange={handleChange}
                required
                placeholder="Ej: Los Sabores del Norte"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Entidad Federativa *
              </label>
              <input
                type="text"
                className="form-control"
                name="entidad_federativa"
                value={formData.entidad_federativa}
                onChange={handleChange}
                required
                placeholder="Ej: Nuevo León"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Estatus del Equipo *
              </label>
              <select
                className="form-select"
                name="estatus_del_equipo"
                value={formData.estatus_del_equipo}
                onChange={handleChange}
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
                <option value="eliminado">Eliminado</option>
              </select>
            </div>

            {/* Información del Anfitrión */}
            <div className="col-12">
              <h6 className="fw-bold text-dark mb-3 mt-4">
                Información del Anfitrión
              </h6>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nombre del Anfitrión *
              </label>
              <input
                type="text"
                className="form-control"
                name="nombre_anfitrion"
                value={formData.nombre_anfitrion}
                onChange={handleChange}
                required
                placeholder="Ej: María González"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Teléfono *</label>
              <input
                type="tel"
                className="form-control"
                name="telefono_anfitrion"
                value={formData.telefono_anfitrion}
                onChange={handleChange}
                required
                placeholder="Ej: 8181234567"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Correo Electrónico *
              </label>
              <input
                type="email"
                className="form-control"
                name="correo_anfitrion"
                value={formData.correo_anfitrion}
                onChange={handleChange}
                required
                placeholder="Ej: maria.gonzalez@email.com"
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-warning px-4 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Guardar Cambios
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary px-4 py-2"
              onClick={onCancel}
              disabled={loading}
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

export default UserEditEquipo;
