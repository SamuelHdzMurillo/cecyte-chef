import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './HospedajeDetalle.css'

const HospedajeDetalle = ({ hospedajeId, onBack, embedded = false }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hospedaje, setHospedaje] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)

  // Usar hospedajeId si viene como prop, sino usar el id de la URL
  const currentId = hospedajeId || id

  useEffect(() => {
    if (currentId) {
      fetchHospedaje()
    }
  }, [currentId])

  const fetchHospedaje = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get(`/hospedajes/${currentId}`, token)
      
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
      navigate('/dashboard')
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
        correo: hospedaje.correo
      }
      
      console.log('Datos a enviar para actualizar hospedaje:', dataToSend)
      
      const response = await apiService.put(`/hospedajes/${currentId}`, dataToSend, token)
      
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

  const handleInputChange = (field, value) => {
    setHospedaje(prev => ({
      ...prev,
      [field]: value
    }))
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
    <div className={embedded ? "hospedaje-detalle-embedded" : "container-fluid py-4"}>
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1 fw-bold text-primary">
                <i className="bi bi-building me-2"></i>
                {hospedaje.nombre}
              </h2>
              <p className="text-muted mb-0">Información completa del hospedaje</p>
            </div>
            <div className="d-flex gap-2">
              {!editMode && (
                <button 
                  className="btn btn-primary px-4 py-2"
                  onClick={() => setEditMode(true)}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
              )}
              {editMode && (
                <>
                  <button 
                    className="btn btn-success px-4 py-2"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
                      onChange={(e) => handleInputChange('nombre', e.target.value)}
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
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-geo-alt me-1 text-muted"></i>
                      {hospedaje.direccion}
                    </p>
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
                      onChange={(e) => handleInputChange('numero_telefonico', e.target.value)}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-telephone me-1 text-muted"></i>
                      <a 
                        href={`tel:${hospedaje.numero_telefonico}`}
                        className="text-decoration-none"
                      >
                        {hospedaje.numero_telefonico}
                      </a>
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
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                    />
                  ) : (
                    <p className="mb-0 fs-6">
                      <i className="bi bi-envelope me-1 text-muted"></i>
                      <a 
                        href={`mailto:${hospedaje.correo}`}
                        className="text-decoration-none"
                      >
                        {hospedaje.correo}
                      </a>
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
              <div className="row g-2">
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-1">ID del Hospedaje</label>
                  <p className="mb-2 fs-6">
                    <span className="badge bg-secondary">#{hospedaje.id}</span>
                  </p>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-1">Fecha de Registro</label>
                  <p className="mb-2 fs-6">
                    <i className="bi bi-calendar-plus me-1 text-muted"></i>
                    {formatDate(hospedaje.created_at)}
                  </p>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark mb-1">Última Actualización</label>
                  <p className="mb-0 fs-6">
                    <i className="bi bi-calendar-check me-1 text-muted"></i>
                    {formatDate(hospedaje.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="card mb-3 shadow-sm border-0">
            <div className="card-header bg-light border-0 py-2">
              <h6 className="mb-0 fw-bold text-info">
                <i className="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h6>
            </div>
            <div className="card-body py-3">
              <div className="d-grid gap-2">
                <a 
                  href={`tel:${hospedaje.numero_telefonico}`}
                  className="btn btn-success btn-sm"
                >
                  <i className="bi bi-telephone me-2"></i>
                  Llamar
                </a>
                <a 
                  href={`mailto:${hospedaje.correo}`}
                  className="btn btn-info btn-sm"
                >
                  <i className="bi bi-envelope me-2"></i>
                  Enviar Email
                </a>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleBack}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Volver al Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HospedajeDetalle
