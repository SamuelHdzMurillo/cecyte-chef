import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './HospedajeDetalle.css'

const HospedajeDetalle = ({ hospedajeId, onBack, embedded = false }) => {
  const [hospedaje, setHospedaje] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (hospedajeId) {
      fetchHospedaje()
    }
  }, [hospedajeId])

  const fetchHospedaje = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get(`/hospedajes/${hospedajeId}`, token)
      
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
    if (embedded && onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = authService.getToken()
      
      // Preparar datos para enviar (como JSON, igual que los otros formularios)
      const dataToSend = {
        nombre: hospedaje.nombre,
        direccion: hospedaje.direccion,
        numero_telefonico: hospedaje.numero_telefonico,
        correo: hospedaje.correo,
        img: hospedaje.img
      }
      
      console.log('Datos a enviar para actualizar hospedaje:', dataToSend)
      
      const response = await apiService.put(`/hospedajes/${hospedajeId}`, dataToSend, token)
      
      console.log('Respuesta del servidor:', response)
      
      // Verificar si la respuesta es exitosa
      if (response && (response.status === 200 || response.success)) {
        setEditMode(false)
        fetchHospedaje() // Recargar datos
        alert('Hospedaje actualizado correctamente')
      } else if (response && response.data && response.data.success) {
        setEditMode(false)
        fetchHospedaje()
        alert('Hospedaje actualizado correctamente')
      } else if (response && response.data) {
        setEditMode(false)
        fetchHospedaje()
        alert('Hospedaje actualizado correctamente')
      } else {
        console.log('Respuesta no exitosa:', response)
        alert('Error: No se pudo actualizar el hospedaje. Respuesta inesperada del servidor.')
      }
    } catch (err) {
      console.error('Error al guardar:', err)
      
      // Manejar errores de validación del servidor (422)
      if (err.response?.status === 422 && err.response?.data?.errors) {
        console.log('Errores de validación:', err.response.data.errors)
        alert(`Error de validación: ${Object.values(err.response.data.errors).join(', ')}`)
      } else if (err.response?.status === 422 && err.response?.data?.message) {
        alert(`Error de validación: ${err.response.data.message}`)
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`)
      } else {
        alert('Error al actualizar el hospedaje. Por favor, intenta de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    fetchHospedaje() // Recargar datos originales
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando detalles del hospedaje...</p>
      </div>
    )
  }

  if (error || !hospedaje) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar hospedaje</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className={`hospedaje-detalle-container ${embedded ? 'embedded' : ''}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-building me-3"></i>
                Detalles del Hospedaje: {hospedaje.nombre}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa y edición del hospedaje
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light px-4 py-2"
                onClick={handleBack}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver
              </button>
              {!editMode ? (
                <button 
                  className="btn btn-warning px-4 py-2"
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
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Guardar
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-secondary px-4 py-2"
                    onClick={handleCancel}
                    disabled={saving}
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

      <div className="row">
        {/* Información General */}
        <div className="col-lg-8">
          {/* Información Básica */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-primary">
                <i className="bi bi-info-circle me-2"></i>
                Información Básica
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Nombre del Hospedaje</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={hospedaje.nombre || ''}
                      onChange={(e) => setHospedaje({...hospedaje, nombre: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6 fw-bold text-primary">{hospedaje.nombre}</p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Dirección</label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="2"
                      value={hospedaje.direccion || ''}
                      onChange={(e) => setHospedaje({...hospedaje, direccion: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>
                      {hospedaje.direccion}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Imagen del Hospedaje</label>
                  {editMode ? (
                    <div>
                      <input
                        type="url"
                        className="form-control mb-2"
                        value={hospedaje.img || ''}
                        onChange={(e) => setHospedaje({...hospedaje, img: e.target.value})}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <div className="form-text">
                        Ingresa la URL de una imagen representativa del hospedaje
                      </div>
                    </div>
                  ) : (
                    <div>
                      {hospedaje.img ? (
                        <div className="text-center">
                          <img
                            src={hospedaje.img}
                            alt={hospedaje.nombre}
                            className="img-fluid rounded shadow-sm"
                            style={{
                              maxWidth: "300px",
                              maxHeight: "200px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                          <div
                            className="d-flex align-items-center justify-content-center bg-light rounded"
                            style={{
                              width: "300px",
                              height: "200px",
                              margin: "0 auto",
                              display: "none",
                            }}
                          >
                            <div className="text-center">
                              <i className="bi bi-image fs-1 text-muted"></i>
                              <p className="text-muted mt-2">Imagen no disponible</p>
                            </div>
                          </div>
                          <p className="mt-2 mb-0">
                            <small className="text-muted">
                              <i className="bi bi-link-45deg me-1"></i>
                              <a href={hospedaje.img} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                Ver imagen original
                              </a>
                            </small>
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-light rounded">
                          <i className="bi bi-image fs-1 text-muted"></i>
                          <p className="text-muted mt-2 mb-0">No hay imagen disponible</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-success">
                <i className="bi bi-telephone me-2"></i>
                Información de Contacto
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Teléfono</label>
                  {editMode ? (
                    <input
                      type="tel"
                      className="form-control"
                      value={hospedaje.numero_telefonico || ''}
                      onChange={(e) => setHospedaje({...hospedaje, numero_telefonico: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-telephone me-1 text-muted"></i>
                      {hospedaje.numero_telefonico}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Correo Electrónico</label>
                  {editMode ? (
                    <input
                      type="email"
                      className="form-control"
                      value={hospedaje.correo || ''}
                      onChange={(e) => setHospedaje({...hospedaje, correo: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-envelope me-1 text-muted"></i>
                      {hospedaje.correo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="col-lg-4">
          {/* Información del Sistema */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-secondary">
                <i className="bi bi-info-square me-2"></i>
                Información del Sistema
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">ID del Hospedaje</label>
                <p className="mb-0 fs-6">
                  <span className="badge bg-secondary fs-6 px-3 py-2">#{hospedaje.id}</span>
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">Fecha de Creación</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-plus me-1 text-muted"></i>
                  {formatDate(hospedaje.created_at)}
                </p>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Última Actualización</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-check me-1 text-muted"></i>
                  {formatDate(hospedaje.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospedajeDetalle
