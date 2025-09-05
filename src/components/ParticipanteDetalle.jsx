import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import apiService from '../services/apiService.js'
import './ParticipanteDetalle.css'

function ParticipanteDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [participante, setParticipante] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchParticipante()
  }, [id])

  const fetchParticipante = async () => {
    try {
      setLoading(true)
      
      const response = await apiService.get(`/participantes/${id}`)
      
      // La API devuelve { "data": {...} }
      const data = response.data || response
      
      if (data && data.id) {
        setParticipante(data)
        setError(null)
      } else {
        console.error('Datos de participante inválidos:', data)
        setError('Formato de datos incorrecto')
        setParticipante(null)
      }
    } catch (err) {
      console.error('Error al obtener participante:', err)
      setError(`Error al cargar los datos del participante: ${err.message}`)
      setParticipante(null)
    } finally {
      setLoading(false)
    }
  }

  const handleVolver = () => {
    navigate('/dashboard/participantes')
  }

  const handleEditar = () => {
    // TODO: Implementar edición
    console.log('Editar participante:', id)
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando datos del participante...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar participante</h4>
        <p>{error}</p>
        <hr />
        <div className="mb-3">
          <small className="text-muted">
            <strong>Información de depuración:</strong><br />
            • ID solicitado: {id}<br />
            • Estado de carga: {loading ? 'Cargando' : 'Completado'}<br />
            • Participante cargado: {participante ? 'Sí' : 'No'}<br />
            • Última actualización: {new Date().toLocaleTimeString()}
          </small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={fetchParticipante}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reintentar
          </button>
          <button className="btn btn-outline-secondary" onClick={handleVolver}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  if (!participante) {
    return (
      <div className="alert alert-warning" role="alert">
        <h4 className="alert-heading">Participante no encontrado</h4>
        <p>No se pudo encontrar el participante con ID: <strong>{id}</strong></p>
        <hr />
        <div className="mb-3">
          <small className="text-muted">
            <strong>Posibles causas:</strong><br />
            • El participante no existe en la base de datos<br />
            • Error en la conexión con la API<br />
            • ID inválido en la URL
          </small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-warning" onClick={fetchParticipante}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reintentar
          </button>
          <button className="btn btn-outline-secondary" onClick={handleVolver}>
            <i className="bi bi-arrow-left me-2"></i>
            Volver a la lista
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="participante-detalle-container">
      {/* Header con información del participante */}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-light me-3"
                onClick={handleVolver}
                title="Volver a la lista"
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <div>
                <h2 className="h4 mb-1 text-white">
                  <i className="bi bi-person-circle me-2"></i>
                  {participante.nombre_participante}
                </h2>
                <p className="mb-0 text-white-50">
                  {participante.rol_participante} • {participante.plantel_participante}
                </p>
              </div>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-light text-dark fs-6">
                ID: {participante.id}
              </span>
              <button 
                className="btn btn-light"
                onClick={handleEditar}
                title="Editar participante"
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Información principal */}
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-person me-2"></i>
                Información Personal
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Nombre Completo</label>
                  <p className="form-control-plaintext">{participante.nombre_participante}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Matrícula</label>
                  <p className="form-control-plaintext">{participante.matricula_participante}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Rol en el Equipo</label>
                  <span className="badge bg-info fs-6">{participante.rol_participante}</span>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Semestre</label>
                  <p className="form-control-plaintext">{participante.semestre_participante}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Especialidad</label>
                  <p className="form-control-plaintext">{participante.especialidad_participante}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Talla</label>
                  <p className="form-control-plaintext">{participante.talla_participante}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-telephone me-2"></i>
                Información de Contacto
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Teléfono</label>
                  <p className="form-control-plaintext">
                    <i className="bi bi-telephone me-2"></i>
                    {participante.telefono_participante}
                  </p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Correo Electrónico</label>
                  <p className="form-control-plaintext">
                    <i className="bi bi-envelope me-2"></i>
                    {participante.correo_participante}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información académica */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-mortarboard me-2"></i>
                Información Académica
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Plantel</label>
                  <p className="form-control-plaintext">{participante.plantel_participante}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">CCT</label>
                  <p className="form-control-plaintext">{participante.plantelcct}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información médica */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-heart-pulse me-2"></i>
                Información Médica
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Tipo de Sangre</label>
                  <p className="form-control-plaintext">
                    <span className="badge bg-danger">{participante.tipo_sangre_participante}</span>
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Seguro Facultativo</label>
                  <p className="form-control-plaintext">
                    {participante.seguro_facultativo ? (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Sí
                      </span>
                    ) : (
                      <span className="badge bg-warning">
                        <i className="bi bi-x-circle me-1"></i>
                        No
                      </span>
                    )}
                  </p>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-bold">Alergias</label>
                  <p className="form-control-plaintext">
                    {participante.alergico ? (
                      <span className="badge bg-warning">
                        <i className="bi bi-exclamation-triangle me-1"></i>
                        Sí
                      </span>
                    ) : (
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        No
                      </span>
                    )}
                  </p>
                </div>
                {participante.alergico && participante.alergias && (
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Descripción de Alergias</label>
                    <p className="form-control-plaintext">{participante.alergias}</p>
                  </div>
                )}
                <div className="col-12 mb-3">
                  <label className="form-label fw-bold">Medicamentos</label>
                  <p className="form-control-plaintext">
                    {participante.medicamentos || 'Ninguno'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar con información adicional */}
        <div className="col-lg-4">
          {/* Foto del participante */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-camera me-2"></i>
                Foto de Credencial
              </h5>
            </div>
            <div className="card-body text-center">
              {participante.foto_credencial ? (
                <img
                  src={`/uploads/${participante.foto_credencial}`}
                  alt={participante.nombre_participante}
                  className="img-fluid rounded"
                  style={{ maxWidth: '200px', maxHeight: '250px' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'block'
                  }}
                />
              ) : null}
              <div 
                className="avatar-placeholder-large mx-auto" 
                style={{ 
                  display: participante.foto_credencial ? 'none' : 'block',
                  width: '200px',
                  height: '250px',
                  fontSize: '4rem'
                }}
              >
                {participante.nombre_participante.charAt(0).toUpperCase()}
              </div>
              <p className="text-muted mt-2">
                {participante.foto_credencial ? 'Foto de credencial' : 'Sin foto'}
              </p>
            </div>
          </div>

          {/* Información del equipo */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-people me-2"></i>
                Información del Equipo
              </h5>
            </div>
            <div className="card-body">
              {participante.equipo ? (
                <>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre del Equipo</label>
                    <p className="form-control-plaintext">{participante.equipo.nombre_equipo}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Entidad Federativa</label>
                    <p className="form-control-plaintext">{participante.equipo.entidad_federativa}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Estatus</label>
                    <span className={`badge ${participante.equipo.estatus_del_equipo === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                      {participante.equipo.estatus_del_equipo}
                    </span>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Anfitrión</label>
                    <p className="form-control-plaintext">{participante.equipo.nombre_anfitrion}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Contacto Anfitrión</label>
                    <p className="form-control-plaintext">
                      <small>
                        <i className="bi bi-telephone me-1"></i>
                        {participante.equipo.telefono_anfitrion}
                      </small>
                      <br />
                      <small>
                        <i className="bi bi-envelope me-1"></i>
                        {participante.equipo.correo_anfitrion}
                      </small>
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-muted">No está asignado a ningún equipo</p>
              )}
            </div>
          </div>

          {/* Fechas de registro */}
          <div className="card">
            <div className="card-header">
              <h5 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-calendar me-2"></i>
                Fechas de Registro
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Fecha de Creación</label>
                <p className="form-control-plaintext">
                  {new Date(participante.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">Última Actualización</label>
                <p className="form-control-plaintext">
                  {new Date(participante.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParticipanteDetalle
