import React, { useState } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";

const UserAddParticipante = ({ equipoId, onParticipanteAdded, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_participante: "",
    rol_participante: "estudiante",
    talla_participante: "M",
    telefono_participante: "",
    matricula_participante: "",
    correo_participante: "",
    plantel_participante: "",
    plantelcct: "",
    medicamentos: "Ninguno",
    semestre_participante: "1",
    especialidad_participante: "",
    seguro_facultativo: true,
    tipo_sangre_participante: "O+",
    alergico: false,
    alergias: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = authService.getToken();
      
      // Agregar el participante al equipo
      const response = await apiService.post(
        `/equipos/${equipoId}/participantes`,
        {
          ...formData,
          equipo_id: equipoId
        },
        token
      );

      if (response.success || response.data) {
        onParticipanteAdded();
        // Limpiar formulario
        setFormData({
          nombre_participante: "",
          rol_participante: "estudiante",
          talla_participante: "M",
          telefono_participante: "",
          matricula_participante: "",
          correo_participante: "",
          plantel_participante: "",
          plantelcct: "",
          medicamentos: "Ninguno",
          semestre_participante: "1",
          especialidad_participante: "",
          seguro_facultativo: true,
          tipo_sangre_participante: "O+",
          alergico: false,
          alergias: ""
        });
      } else {
        setError("Error al agregar participante");
      }
    } catch (err) {
      console.error("Error al agregar participante:", err);
      setError("Error al agregar participante. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-success text-white">
        <h6 className="mb-0 fw-bold">
          <i className="bi bi-person-plus me-2"></i>
          Agregar Nuevo Participante
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
            {/* Información Personal */}
            <div className="col-12">
              <h6 className="fw-bold text-dark mb-3">Información Personal</h6>
            </div>
            
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nombre Completo *
              </label>
              <input
                type="text"
                className="form-control"
                name="nombre_participante"
                value={formData.nombre_participante}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Rol *
              </label>
              <select
                className="form-select"
                name="rol_participante"
                value={formData.rol_participante}
                onChange={handleChange}
                required
              >
                <option value="estudiante">Estudiante</option>
                <option value="chef_principal">Chef Principal</option>
                <option value="sous_chef">Sous Chef</option>
                <option value="docente">Docente</option>
                <option value="coordinador">Coordinador</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Teléfono *
              </label>
              <input
                type="tel"
                className="form-control"
                name="telefono_participante"
                value={formData.telefono_participante}
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
                name="correo_participante"
                value={formData.correo_participante}
                onChange={handleChange}
                required
              />
            </div>

            {/* Información Académica */}
            <div className="col-12">
              <h6 className="fw-bold text-dark mb-3 mt-4">Información Académica</h6>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Matrícula *
              </label>
              <input
                type="text"
                className="form-control"
                name="matricula_participante"
                value={formData.matricula_participante}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Plantel *
              </label>
              <input
                type="text"
                className="form-control"
                name="plantel_participante"
                value={formData.plantel_participante}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                CCT del Plantel
              </label>
              <input
                type="text"
                className="form-control"
                name="plantelcct"
                value={formData.plantelcct}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Semestre *
              </label>
              <select
                className="form-select"
                name="semestre_participante"
                value={formData.semestre_participante}
                onChange={handleChange}
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(sem => (
                  <option key={sem} value={sem}>{sem}° Semestre</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Especialidad
              </label>
              <input
                type="text"
                className="form-control"
                name="especialidad_participante"
                value={formData.especialidad_participante}
                onChange={handleChange}
                placeholder="Ej: Cocina Internacional, Repostería"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Talla
              </label>
              <select
                className="form-select"
                name="talla_participante"
                value={formData.talla_participante}
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

            {/* Información Médica */}
            <div className="col-12">
              <h6 className="fw-bold text-dark mb-3 mt-4">Información Médica</h6>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Tipo de Sangre
              </label>
              <select
                className="form-select"
                name="tipo_sangre_participante"
                value={formData.tipo_sangre_participante}
                onChange={handleChange}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Medicamentos
              </label>
              <input
                type="text"
                className="form-control"
                name="medicamentos"
                value={formData.medicamentos}
                onChange={handleChange}
                placeholder="Ninguno"
              />
            </div>

            <div className="col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="seguro_facultativo"
                  checked={formData.seguro_facultativo}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold">
                  Tiene Seguro Facultativo
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="alergico"
                  checked={formData.alergico}
                  onChange={handleChange}
                />
                <label className="form-check-label fw-semibold">
                  Es Alérgico
                </label>
              </div>
            </div>

            {formData.alergico && (
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Alergias
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Especifica las alergias"
                />
              </div>
            )}
          </div>

          <div className="d-flex gap-2 mt-4">
            <button
              type="submit"
              className="btn btn-success"
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
                  Agregar Participante
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

export default UserAddParticipante;
