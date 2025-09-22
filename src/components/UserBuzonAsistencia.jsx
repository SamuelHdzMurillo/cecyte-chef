import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import buzonAsistenciaService from "../services/buzonAsistenciaService.js";
import "./UserBuzonAsistencia.css";

function UserBuzonAsistencia() {
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    correo_electronico: user?.email || "",
    telefono: "",
    mensaje: "",
    estado: "pendiente",
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

    if (!formData.mensaje.trim()) {
      setError("El mensaje es obligatorio");
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

      // Preparar datos del mensaje
      const datosMensaje = {
        ...formData,
        evento_id: datosUsuario.evento_id,
        equipo_id: datosUsuario.equipo_id,
      };

      console.log("Enviando mensaje con datos:", datosMensaje);

      const response = await buzonAsistenciaService.crearMensaje(datosMensaje);

      if (response.success) {
        setSubmitSuccess(true);
        setFormData({
          correo_electronico: user?.email || "",
          telefono: "",
          mensaje: "",
          estado: "pendiente",
        });

        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => {
          setSubmitSuccess(false);
        }, 3000);
      } else {
        setError("Error al enviar el mensaje. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setError(
        "Error al enviar el mensaje. Verifica los datos e intenta nuevamente."
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
    <div className="user-buzon-asistencia">
      {/* Header */}
      <div className="mb-4">
        <h4 className="mb-1">
          <i className="bi bi-envelope me-2"></i>
          Buzón de Asistencia
        </h4>
        <p className="text-muted mb-0">
          Envía tus consultas y recibe asistencia del equipo organizador
        </p>
      </div>

      {/* Mensaje de éxito */}
      {submitSuccess && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="bi bi-check-circle me-2"></i>
          <strong>¡Mensaje enviado!</strong> Tu consulta ha sido enviada
          exitosamente. Te contactaremos pronto.
          <button
            type="button"
            className="btn-close"
            onClick={() => setSubmitSuccess(false)}
          ></button>
        </div>
      )}

      {/* Formulario de mensaje */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h6 className="m-0">
            <i className="bi bi-pencil-square me-2"></i>
            Enviar Mensaje
          </h6>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="correo_electronico" className="form-label">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="correo_electronico"
                  name="correo_electronico"
                  value={formData.correo_electronico}
                  onChange={handleInputChange}
                  required
                  disabled
                />
                <div className="form-text">
                  Tu correo registrado en el sistema
                </div>
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
            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">
                Mensaje *
              </label>
              <textarea
                className="form-control"
                id="mensaje"
                name="mensaje"
                rows="4"
                value={formData.mensaje}
                onChange={handleInputChange}
                placeholder="Describe tu consulta o problema..."
                required
              ></textarea>
              <div className="form-text">
                Sé específico para poder ayudarte mejor
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
                    <i className="bi bi-send me-2"></i>
                    Enviar Mensaje
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

export default UserBuzonAsistencia;
