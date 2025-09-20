import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './RestauranteDetalle.css'

const RestauranteDetalle = ({ restauranteId, onBack, embedded = false }) => {
  const [restaurante, setRestaurante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (restauranteId) {
      fetchRestaurante()
    }
  }, [restauranteId])

  const fetchRestaurante = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get(`/restaurantes/${restauranteId}`, token)
      
      if (response.data) {
        setRestaurante(response.data)
        setError(null)
      } else {
        setError('No se encontró el restaurante')
      }
    } catch (err) {
      console.error('Error al obtener restaurante:', err)
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
        nombre: restaurante.nombre,
        estatus: restaurante.estatus,
        direccion: restaurante.direccion,
        telefono: restaurante.telefono,
        correo_electronico: restaurante.correo_electronico,
        pagina_web: restaurante.pagina_web || null,
        codigo_promocional: restaurante.codigo_promocional || null,
        descripcion_codigo_promocional: restaurante.descripcion_codigo_promocional || null,
        img: restaurante.img || null
      }
      
      console.log('Datos a enviar para actualizar:', dataToSend)
      
      const response = await apiService.put(`/restaurantes/${restauranteId}`, dataToSend, token)
      
      console.log('Respuesta del servidor:', response)
      
      // Verificar si la respuesta es exitosa
      if (response && (response.status === 200 || response.success)) {
        setEditMode(false)
        fetchRestaurante() // Recargar datos
        alert('Restaurante actualizado correctamente')
      } else if (response && response.data && response.data.success) {
        setEditMode(false)
        fetchRestaurante()
        alert('Restaurante actualizado correctamente')
      } else if (response && response.data) {
        setEditMode(false)
        fetchRestaurante()
        alert('Restaurante actualizado correctamente')
      } else {
        console.log('Respuesta no exitosa:', response)
        alert('Error: No se pudo actualizar el restaurante. Respuesta inesperada del servidor.')
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
        alert('Error al actualizar el restaurante. Por favor, intenta de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditMode(false)
    fetchRestaurante() // Recargar datos originales
  }


  const getStatusBadge = (status) => {
    const statusClasses = {
      'activo': 'badge bg-success',
      'inactivo': 'badge bg-secondary',
      'cerrado': 'badge bg-danger'
    }
    return <span className={statusClasses[status] || 'badge bg-secondary'}>{status}</span>
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
        <p className="mt-3">Cargando detalles del restaurante...</p>
      </div>
    )
  }

  if (error || !restaurante) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar restaurante</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleBack}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className={`restaurante-detalle-container ${embedded ? 'embedded' : ''}`}>
      {/* Header principal */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-cup-hot me-3"></i>
                Detalles del Restaurante: {restaurante.nombre}
              </h4>
              <p className="mb-0 opacity-75">
                Información completa y edición del restaurante
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
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Nombre del Restaurante</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={restaurante.nombre || ''}
                      onChange={(e) => setRestaurante({...restaurante, nombre: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6 fw-bold text-primary">{restaurante.nombre}</p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Estatus</label>
                  {editMode ? (
                    <select
                      className="form-select"
                      value={restaurante.estatus || ''}
                      onChange={(e) => setRestaurante({...restaurante, estatus: e.target.value})}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                      <option value="cerrado">Cerrado</option>
                    </select>
                  ) : (
                    <div>{getStatusBadge(restaurante.estatus)}</div>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Dirección</label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="2"
                      value={restaurante.direccion || ''}
                      onChange={(e) => setRestaurante({...restaurante, direccion: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>
                      {restaurante.direccion}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Imagen del Restaurante</label>
                  {editMode ? (
                    <div>
                      <input
                        type="url"
                        className="form-control mb-2"
                        value={restaurante.img || ''}
                        onChange={(e) => setRestaurante({...restaurante, img: e.target.value})}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                      <div className="form-text">
                        Ingresa la URL de una imagen representativa del restaurante
                      </div>
                    </div>
                  ) : (
                    <div>
                      {restaurante.img ? (
                        <div className="text-center">
                          <img
                            src={restaurante.img}
                            alt={restaurante.nombre}
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
                              <a href={restaurante.img} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
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
                      value={restaurante.telefono || ''}
                      onChange={(e) => setRestaurante({...restaurante, telefono: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-telephone me-1 text-muted"></i>
                      {restaurante.telefono}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Correo Electrónico</label>
                  {editMode ? (
                    <input
                      type="email"
                      className="form-control"
                      value={restaurante.correo_electronico || ''}
                      onChange={(e) => setRestaurante({...restaurante, correo_electronico: e.target.value})}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-envelope me-1 text-muted"></i>
                      {restaurante.correo_electronico}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Página Web</label>
                  {editMode ? (
                    <input
                      type="url"
                      className="form-control"
                      value={restaurante.pagina_web || ''}
                      onChange={(e) => setRestaurante({...restaurante, pagina_web: e.target.value})}
                      placeholder="https://ejemplo.com"
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      {restaurante.pagina_web ? (
                        <a href={restaurante.pagina_web} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          <i className="bi bi-globe me-1 text-muted"></i>
                          {restaurante.pagina_web}
                        </a>
                      ) : (
                        <span className="text-muted">No especificada</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Promociones */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-warning">
                <i className="bi bi-tag me-2"></i>
                Información de Promociones
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark mb-2">Código Promocional</label>
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      value={restaurante.codigo_promocional || ''}
                      onChange={(e) => setRestaurante({...restaurante, codigo_promocional: e.target.value})}
                      placeholder="Ej: DESCUENTO20"
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      {restaurante.codigo_promocional ? (
                        <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                          <i className="bi bi-tag me-1"></i>
                          {restaurante.codigo_promocional}
                        </span>
                      ) : (
                        <span className="text-muted">Sin código promocional</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-2">Descripción del Código Promocional</label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="3"
                      value={restaurante.descripcion_codigo_promocional || ''}
                      onChange={(e) => setRestaurante({...restaurante, descripcion_codigo_promocional: e.target.value})}
                      placeholder="Describe la promoción..."
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      {restaurante.descripcion_codigo_promocional || (
                        <span className="text-muted">Sin descripción</span>
                      )}
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
                <label className="form-label fw-semibold text-dark mb-1">ID del Restaurante</label>
                <p className="mb-0 fs-6">
                  <span className="badge bg-secondary fs-6 px-3 py-2">#{restaurante.id}</span>
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark mb-1">Fecha de Creación</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-plus me-1 text-muted"></i>
                  {formatDate(restaurante.created_at)}
                </p>
              </div>
              <div>
                <label className="form-label fw-semibold text-dark mb-1">Última Actualización</label>
                <p className="mb-0 fs-6">
                  <i className="bi bi-calendar-check me-1 text-muted"></i>
                  {formatDate(restaurante.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestauranteDetalle
