import React, { useState } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";

const UserAddReceta = ({ equipoId, onRecetaAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    tipo_receta: "",
    descripcion: "",
    ingredientes: "",
    preparacion: "",
    observaciones: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = authService.getToken();
      
      // Agregar la receta al equipo
      const response = await apiService.post(
        `/equipos/${equipoId}/recetas`,
        {
          ...formData,
          equipo_id: equipoId,
          creado_por: authService.getUser()?.name || "Usuario",
          fecha_creacion: new Date().toISOString()
        },
        token
      );

      if (response.success || response.data) {
        onRecetaAdded();
        // Limpiar formulario
        setFormData({
          tipo_receta: "",
          descripcion: "",
          ingredientes: "",
          preparacion: "",
          observaciones: ""
        });
      } else {
        setError("Error al agregar receta");
      }
    } catch (err) {
      console.error("Error al agregar receta:", err);
      setError("Error al agregar receta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-warning text-dark">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-journal-plus me-2"></i>
          Agregar Nueva Receta
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
                Tipo de Receta *
              </label>
              <select
                className="form-select"
                name="tipo_receta"
                value={formData.tipo_receta}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar tipo</option>
                <option value="Entrada">Entrada</option>
                <option value="Plato Principal">Plato Principal</option>
                <option value="Postre">Postre</option>
                <option value="Bebida">Bebida</option>
                <option value="Acompañamiento">Acompañamiento</option>
                <option value="Salsa">Salsa</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nombre de la Receta *
              </label>
              <input
                type="text"
                className="form-control"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Ej: Enchiladas Verdes con Pollo"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Ingredientes *
              </label>
              <textarea
                className="form-control"
                name="ingredientes"
                value={formData.ingredientes}
                onChange={handleChange}
                rows="4"
                placeholder="Lista todos los ingredientes necesarios, separados por comas..."
                required
              />
              <div className="form-text">
                Ejemplo: Tortillas de maíz, pollo deshebrado, salsa verde, queso fresco, crema, cebolla, cilantro
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Preparación *
              </label>
              <textarea
                className="form-control"
                name="preparacion"
                value={formData.preparacion}
                onChange={handleChange}
                rows="6"
                placeholder="Describe paso a paso cómo preparar la receta..."
                required
              />
              <div className="form-text">
                Ejemplo: 1. Cocinar el pollo y deshebrarlo\n2. Preparar la salsa verde\n3. Enchilar las tortillas...
              </div>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">
                Observaciones
              </label>
              <textarea
                className="form-control"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows="3"
                placeholder="Información adicional, consejos, variaciones, etc."
              />
            </div>
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-warning"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Agregando...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-lg me-2"></i>
                  Agregar Receta
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

export default UserAddReceta;
