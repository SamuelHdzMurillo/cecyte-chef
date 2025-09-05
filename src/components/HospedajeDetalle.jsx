import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './HospedajeDetalle.css'

const HospedajeDetalle = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospedaje, setHospedaje] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchHospedaje()
  }, [id])

  const fetchHospedaje = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get(`/hospedajes/${id}`, token)
      
      if (response.data) {
        setHospedaje(response.data)
        setError(null)
      } else {
        setError('No se encontró el hospedaje')
      }
    } catch (err) {
      console.error('Error al obtener hospedaje:', err)
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/dashboard')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'Fecha inválida'
    }
  }

  if (loading) {
    return (
      <div className="hospedaje-detalle-container">
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles del hospedaje...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="hospedaje-detalle-container">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="text-danger mb-3">
              <i className="bi bi-exclamation-triangle fs-1"></i>
            </div>
            <h5 className="text-danger">{error}</h5>
            <button 
              className="btn btn-primary mt-3"
              onClick={handleBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!hospedaje) {
    return (
      <div className="hospedaje-detalle-container">
        <div className="card">
          <div className="card-body text-center py-5">
            <div className="text-muted mb-3">
              <i className="bi bi-question-circle fs-1"></i>
            </div>
            <h5 className="text-muted">Hospedaje no encontrado</h5>
            <button 
              className="btn btn-primary mt-3"
              onClick={handleBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hospedaje-detalle-container">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <i className="bi bi-building me-2"></i>
                Detalles del Hospedaje
              </h4>
              <p className="mb-0">Información completa del establecimiento</p>
            </div>
            <button 
              className="btn btn-light btn-sm"
              onClick={handleBack}
              title="Volver al Dashboard"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            {/* Imagen del hospedaje */}
            <div className="col-md-4 mb-4">
              <div className="text-center">
                {hospedaje.img ? (
                  <img 
                    src={hospedaje.img} 
                    alt={hospedaje.nombre}
                    className="img-fluid rounded shadow"
                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                {!hospedaje.img && (
                  <div 
                    className="bg-light rounded d-flex align-items-center justify-content-center"
                    style={{ width: '100%', height: '300px' }}
                  >
                    <i className="bi bi-building text-muted" style={{ fontSize: '4rem', color: 'var(--text-muted)' }}></i>
                  </div>
                )}
              </div>
            </div>

            {/* Información del hospedaje */}
            <div className="col-md-8">
              <div className="row">
                <div className="col-12 mb-3">
                  <h3 className="text-primary">{hospedaje.nombre}</h3>
                  <span className="badge bg-secondary">ID: #{hospedaje.id}</span>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted text-uppercase">
                    <i className="bi bi-geo-alt me-2"></i>
                    Dirección
                  </h6>
                  <p className="mb-0">{hospedaje.direccion}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted text-uppercase">
                    <i className="bi bi-telephone me-2"></i>
                    Teléfono
                  </h6>
                  <p className="mb-0">
                    <a 
                      href={`tel:${hospedaje.numero_telefonico}`}
                      className="text-decoration-none"
                    >
                      {hospedaje.numero_telefonico}
                    </a>
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted text-uppercase">
                    <i className="bi bi-envelope me-2"></i>
                    Correo Electrónico
                  </h6>
                  <p className="mb-0">
                    <a 
                      href={`mailto:${hospedaje.correo}`}
                      className="text-decoration-none"
                    >
                      {hospedaje.correo}
                    </a>
                  </p>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted text-uppercase">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Fecha de Registro
                  </h6>
                  <p className="mb-0">{formatDate(hospedaje.created_at)}</p>
                </div>

                <div className="col-md-6 mb-3">
                  <h6 className="text-muted text-uppercase">
                    <i className="bi bi-calendar-check me-2"></i>
                    Última Actualización
                  </h6>
                  <p className="mb-0">{formatDate(hospedaje.updated_at)}</p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="d-flex gap-2">
                    <a 
                      href={`tel:${hospedaje.numero_telefonico}`}
                      className="btn btn-success"
                    >
                      <i className="bi bi-telephone me-2"></i>
                      Llamar
                    </a>
                    <a 
                      href={`mailto:${hospedaje.correo}`}
                      className="btn btn-info"
                    >
                      <i className="bi bi-envelope me-2"></i>
                      Enviar Email
                    </a>
                    <button 
                      className="btn btn-secondary"
                      onClick={handleBack}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Volver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospedajeDetalle
