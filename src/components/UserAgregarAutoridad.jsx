import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import "./UserAgregarAutoridad.css";

function UserAgregarAutoridad() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    rol: "",
    puesto: "",
    telefono: "",
    extension: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Obtener datos del equipo del usuario
  const obtenerDatosUsuario = async () => {
    try {
      // Intentar obtener el equipo del usuario desde la API
      if (user?.equipo_id) {
        const response = await fetch(
          `https://chef-api.cecytebcs.edu.mx/public/api/equipos/${user.equipo_id}`
        );
        if (response.ok) {
          const data = await response.json();
          return {
            equipo_id: user.equipo_id,
            evento_id: data.data?.evento_id || 1,
          };
        }
      }

      // Si no tiene equipo_id, usar valores por defecto
      return {
        equipo_id: null,
        evento_id: 1, // Evento por defecto
      };
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return {
        equipo_id: null,
        evento_id: 1,
      };
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!formData.rol.trim()) {
      setError("El rol es obligatorio");
      return;
    }

    if (!formData.puesto.trim()) {
      setError("El puesto es obligatorio");
      return;
    }

    if (!formData.telefono.trim()) {
      setError("El teléfono es obligatorio");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Obtener datos del equipo y evento del usuario
      const datosUsuario = await obtenerDatosUsuario();

      // Preparar datos del comité
      const datosComite = {
        ...formData,
        evento_id: datosUsuario.evento_id,
      };

      console.log("Enviando comité con datos:", datosComite);

      // Llamada al servicio para crear el comité
      const response = await fetch(
        "https://chef-api.cecytebcs.edu.mx/public/api/comites",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(datosComite),
        }
      );

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          nombre: "",
          rol: "",
          puesto: "",
          telefono: "",
          extension: "",
        });

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError("Error al enviar el comité. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar comité:", error);
      setError(
        "Error al enviar el comité. Verifica los datos e intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="user-agregar-autoridad">
      {/* Header */}
      <div className="mb-4">
        <h4 className="mb-1">
          <i className="bi bi-person-badge me-2"></i>
          Agregar Autoridad
        </h4>
        <p className="text-muted mb-0">
          Registra información de miembros para el comité organizador
        </p>
      </div>

      {/* Mensaje de éxito */}
      {submitSuccess && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-check-circle me-2"></i>
          <strong>¡Miembro del comité registrado!</strong> La información ha
          sido enviada exitosamente para su revisión.
          <button
            type="button"
            className="btn-close"
            onClick={() => setSubmitSuccess(false)}
          ></button>
        </div>
      )}

      {/* Formulario de autoridad */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h6 className="m-0">
            <i className="bi bi-person-plus me-2"></i>
            Registrar Nuevo Miembro del Comité
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre completo del miembro"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="rol" className="form-label">
                  Rol *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  placeholder="Ej: Presidente, Secretario, Coordinador..."
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="puesto" className="form-label">
                  Puesto *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="puesto"
                  name="puesto"
                  value={formData.puesto}
                  onChange={handleInputChange}
                  placeholder="Puesto o cargo"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="+52 55 1234 5678"
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="extension" className="form-label">
                  Extensión
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="extension"
                  name="extension"
                  value={formData.extension}
                  onChange={handleInputChange}
                  placeholder="Extensión telefónica"
                />
                <div className="form-text">Opcional - Extensión telefónica</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Registrar Miembro del Comité
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}
    </div>
  );
}

export default UserAgregarAutoridad;
