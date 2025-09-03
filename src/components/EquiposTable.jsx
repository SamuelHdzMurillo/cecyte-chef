import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './EquiposTable.css'

const EquiposTable = () => {
  const [equipos, setEquipos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [equiposPerPage] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  
  // Estados para el modal de detalles del equipo
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedEquipo, setSelectedEquipo] = useState(null)

  // Filtros adicionales
  const [statusFilter, setStatusFilter] = useState('')
  const [entidadFilter, setEntidadFilter] = useState('')

  useEffect(() => {
    fetchEquipos()
  }, [])

  const fetchEquipos = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get('/equipos', token)
      
      if (response.data) {
        setEquipos(response.data)
        setError(null)
      } else {
        setEquipos([])
        setError(null)
      }
    } catch (err) {
      console.error('Error al obtener equipos:', err)
      setEquipos([])
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchEquipos()
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted"></i>
    }
    return sortDirection === 'asc' 
      ? <i className="bi bi-arrow-up text-primary"></i>
      : <i className="bi bi-arrow-down text-primary"></i>
  }

  const filteredEquipos = equipos.filter(equipo => {
    const matchesText = 
      equipo.nombre_equipo?.toLowerCase().includes(filterText.toLowerCase()) ||
      equipo.nombre_anfitrion?.toLowerCase().includes(filterText.toLowerCase()) ||
      equipo.entidad_federativa?.toLowerCase().includes(filterText.toLowerCase()) ||
      equipo.evento?.nombre_evento?.toLowerCase().includes(filterText.toLowerCase())
    
    const matchesStatus = !statusFilter || equipo.estatus_del_equipo === statusFilter
    const matchesEntidad = !entidadFilter || equipo.entidad_federativa === entidadFilter
    
    return matchesText && matchesStatus && matchesEntidad
  })

  // Ordenar equipos
  const sortedEquipos = [...filteredEquipos].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    // Manejar campos anidados
    if (sortField === 'evento') {
      aValue = a.evento?.nombre_evento || ''
      bValue = b.evento?.nombre_evento || ''
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Paginación
  const indexOfLastEquipo = currentPage * equiposPerPage
  const indexOfFirstEquipo = indexOfLastEquipo - equiposPerPage
  const currentEquipos = sortedEquipos.slice(indexOfFirstEquipo, indexOfLastEquipo)
  const totalPages = Math.ceil(sortedEquipos.length / equiposPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleShowDetails = (equipo) => {
    setSelectedEquipo(equipo)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedEquipo(null)
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      'activo': 'badge bg-success',
      'inactivo': 'badge bg-secondary',
      'suspendido': 'badge bg-warning',
      'eliminado': 'badge bg-danger'
    }
    return <span className={statusClasses[status] || 'badge bg-secondary'}>{status}</span>
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando equipos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar equipos</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="equipos-table-container">
      {/* Header principal del componente */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-people-fill me-3"></i>
                Gestión de Equipos
              </h4>
              <p className="mb-0 opacity-75">
                Administra equipos participantes, sus integrantes, recetas y acompañantes
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light px-4 py-2"
                onClick={handleRefresh}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Actualizar
              </button>
            </div>
          </div>
        </div>
        <div className="card-body bg-light py-2">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle text-primary me-2 fs-5"></i>
                <span className="text-muted">
                  Total: <strong className="text-dark">{equipos.length}</strong> equipos registrados
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="badge bg-success fs-6 px-3 py-2">
                <i className="bi bi-check-circle me-1"></i>
                Sistema Operativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-header bg-light border-0 py-2">
          <h6 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-funnel me-2 text-primary"></i>
            Filtros de Búsqueda
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-search me-2 text-muted"></i>
                Buscar
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, anfitrión, entidad..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-flag me-2 text-muted"></i>
                Estatus
              </label>
              <select
                className="form-select form-select-lg"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estatus</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
                <option value="eliminado">Eliminado</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                Entidad Federativa
              </label>
              <select
                className="form-select form-select-lg"
                value={entidadFilter}
                onChange={(e) => setEntidadFilter(e.target.value)}
              >
                <option value="">Todas las entidades</option>
                {Array.from(new Set(equipos.map(e => e.entidad_federativa))).map(entidad => (
                  <option key={entidad} value={entidad}>{entidad}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100 py-2 px-3"
                onClick={() => {
                  setFilterText('')
                  setStatusFilter('')
                  setEntidadFilter('')
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de equipos */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-2">
          <h6 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-table me-2 text-primary"></i>
            Lista de Equipos
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('id')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">ID</span>
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('nombre_equipo')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Nombre del Equipo</span>
                      {getSortIcon('nombre_equipo')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('evento')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Evento</span>
                      {getSortIcon('evento')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('entidad_federativa')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Entidad</span>
                      {getSortIcon('entidad_federativa')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('estatus_del_equipo')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Estatus</span>
                      {getSortIcon('estatus_del_equipo')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-3"
                    onClick={() => handleSort('nombre_anfitrion')}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Anfitrión</span>
                      {getSortIcon('nombre_anfitrion')}
                    </div>
                  </th>
                  <th className="border-0 py-3 px-3">
                    <span className="fw-semibold text-dark">Participantes</span>
                  </th>
                  <th className="border-0 py-3 px-3">
                    <span className="fw-semibold text-dark">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentEquipos.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
                        <h6 className="mb-2">No se encontraron equipos</h6>
                        <p className="mb-0">Intenta ajustar los filtros de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentEquipos.map((equipo) => (
                    <tr key={equipo.id} className="border-bottom">
                      <td className="py-3 px-3">
                        <span className="badge bg-secondary fs-6 px-3 py-2">#{equipo.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">{equipo.nombre_equipo}</h6>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-bold text-primary">{equipo.evento?.nombre_evento}</h6>
                          <small className="text-muted d-block">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatDate(equipo.evento?.inicio_evento)} - {formatDate(equipo.evento?.fin_evento)}
                          </small>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="badge bg-info fs-6 px-3 py-2">
                          <i className="bi bi-geo-alt me-1"></i>
                          {equipo.entidad_federativa}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {getStatusBadge(equipo.estatus_del_equipo)}
                      </td>
                      <td className="py-3 px-3">
                        <div>
                          <h6 className="mb-1 fw-semibold text-dark">{equipo.nombre_anfitrion}</h6>
                          <small className="text-muted d-block">
                            <i className="bi bi-envelope me-1"></i>
                            {equipo.correo_anfitrion}
                          </small>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="d-flex flex-column gap-2">
                          <span className="badge bg-primary fs-6 px-3 py-2">
                            <i className="bi bi-people me-1"></i>
                            {equipo.participantes?.length || 0} participantes
                          </span>
                          <span className="badge bg-warning fs-6 px-3 py-2">
                            <i className="bi bi-person-badge me-1"></i>
                            {equipo.acompanantes?.length || 0} acompañantes
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary px-3 py-2"
                            onClick={() => handleShowDetails(equipo)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <nav aria-label="Navegación de páginas">
            <ul className="pagination pagination-lg">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link px-4 py-2"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Anterior
                </button>
              </li>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link px-4 py-2"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link px-4 py-2"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Modal de detalles del equipo */}
      {showDetailsModal && selectedEquipo && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0 py-3">
                <h4 className="modal-title fw-bold">
                  <i className="bi bi-people-fill me-3"></i>
                  Detalles del Equipo: {selectedEquipo.nombre_equipo}
                </h4>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeDetailsModal}
                ></button>
              </div>
              
              <div className="modal-body p-2">
                <div className="row g-3">
                  {/* Información básica del equipo y anfitrión en una sola fila */}
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-primary">
                          <i className="bi bi-info-circle me-2"></i>
                          Información General
                        </h6>
                      </div>
                      <div className="card-body py-2">
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label fw-semibold text-muted mb-1 small">Nombre del Equipo</label>
                            <p className="mb-0 fs-6 fw-bold text-primary">{selectedEquipo.nombre_equipo}</p>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-semibold text-muted mb-1 small">Entidad</label>
                            <p className="mb-0 fs-6">{selectedEquipo.entidad_federativa}</p>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-semibold text-muted mb-1 small">Estatus</label>
                            <div>{getStatusBadge(selectedEquipo.estatus_del_equipo)}</div>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-semibold text-muted mb-1 small">Fecha Creación</label>
                            <p className="mb-0 fs-6">{formatDate(selectedEquipo.created_at)}</p>
                          </div>
                        </div>
                        <hr className="my-3" />
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-muted mb-1 small">Anfitrión</label>
                            <p className="mb-0 fs-6 fw-bold text-success">{selectedEquipo.nombre_anfitrion}</p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-muted mb-1 small">Teléfono</label>
                            <p className="mb-0 fs-6">
                              <i className="bi bi-telephone me-1 text-muted"></i>
                              {selectedEquipo.telefono_anfitrion}
                            </p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label fw-semibold text-muted mb-1 small">Correo</label>
                            <p className="mb-0 fs-6">
                              <i className="bi bi-envelope me-1 text-muted"></i>
                              {selectedEquipo.correo_anfitrion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Información del evento */}
                  <div className="mt-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-info">
                          <i className="bi bi-calendar-event me-2"></i>
                          Evento Asociado
                        </h6>
                      </div>
                      <div className="card-body py-2">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted mb-1 small">Nombre del Evento</label>
                            <p className="mb-0 fs-6 fw-bold text-info">{selectedEquipo.evento?.nombre_evento}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted mb-1 small">Sede</label>
                            <p className="mb-0 fs-6">
                              <i className="bi bi-geo-alt me-1 text-muted"></i>
                              {selectedEquipo.evento?.sede_evento}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted mb-1 small">Fecha de Inicio</label>
                            <p className="mb-0 fs-6">
                              <i className="bi bi-calendar-plus me-1 text-muted"></i>
                              {formatDate(selectedEquipo.evento?.inicio_evento)}
                            </p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-semibold text-muted mb-1 small">Fecha de Fin</label>
                            <p className="mb-0 fs-6">
                              <i className="bi bi-calendar-check me-1 text-muted"></i>
                              {formatDate(selectedEquipo.evento?.fin_evento)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Participantes */}
                  <div className="mt-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-warning">
                          <i className="bi bi-people me-2"></i>
                          Participantes ({selectedEquipo.participantes?.length || 0})
                        </h6>
                      </div>
                      <div className="card-body py-2">
                        {selectedEquipo.participantes && selectedEquipo.participantes.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm table-hover mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th className="border-0 py-1 px-2 small">Nombre</th>
                                  <th className="border-0 py-1 px-2 small">Rol</th>
                                  <th className="border-0 py-1 px-2 small">Plantel</th>
                                  <th className="border-0 py-1 px-2 small">Especialidad</th>
                                  <th className="border-0 py-1 px-2 small">Semestre</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedEquipo.participantes.map((participante) => (
                                  <tr key={participante.id}>
                                    <td className="py-1 px-2">
                                      <strong className="small">{participante.nombre_participante}</strong>
                                    </td>
                                    <td className="py-1 px-2">
                                      <span className="badge bg-primary fs-6 px-2 py-1">{participante.rol_participante}</span>
                                    </td>
                                    <td className="py-1 px-2 small">{participante.plantel_participante}</td>
                                    <td className="py-1 px-2 small">{participante.especialidad_participante}</td>
                                    <td className="py-1 px-2">
                                      <span className="badge bg-info fs-6 px-2 py-1">{participante.semestre_participante}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <i className="bi bi-people fs-2 text-muted mb-2 d-block opacity-50"></i>
                            <p className="text-muted mb-0 small">No hay participantes registrados</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acompañantes */}
                  <div className="mt-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-secondary">
                          <i className="bi bi-person-badge me-2"></i>
                          Acompañantes ({selectedEquipo.acompanantes?.length || 0})
                        </h6>
                      </div>
                      <div className="card-body py-2">
                        {selectedEquipo.acompanantes && selectedEquipo.acompanantes.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table table-sm table-hover mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th className="border-0 py-1 px-2 small">Nombre</th>
                                  <th className="border-0 py-1 px-2 small">Rol</th>
                                  <th className="border-0 py-1 px-2 small">Puesto</th>
                                  <th className="border-0 py-1 px-2 small">Contacto</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedEquipo.acompanantes.map((acompanante) => (
                                  <tr key={acompanante.id}>
                                    <td className="py-1 px-2">
                                      <strong className="small">{acompanante.nombre_acompanante}</strong>
                                    </td>
                                    <td className="py-1 px-2">
                                      <span className="badge bg-info fs-6 px-2 py-1">{acompanante.rol}</span>
                                    </td>
                                    <td className="py-1 px-2 small">{acompanante.puesto}</td>
                                    <td className="py-1 px-2">
                                      <div>
                                        <div className="mb-1">
                                          <i className="bi bi-telephone me-1 text-muted"></i>
                                          <small>{acompanante.telefono}</small>
                                        </div>
                                        <small className="text-muted">
                                          <i className="bi bi-envelope me-1"></i>
                                          {acompanante.email}
                                        </small>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <i className="bi bi-person-badge fs-2 text-muted mb-2 d-block opacity-50"></i>
                            <p className="text-muted mb-0 small">No hay acompañantes registrados</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recetas */}
                  <div className="mt-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-light border-0 py-2">
                        <h6 className="mb-0 fw-bold text-danger">
                          <i className="bi bi-journal-text me-2"></i>
                          Recetas ({selectedEquipo.recetas?.length || 0})
                        </h6>
                      </div>
                      <div className="card-body py-2">
                        {selectedEquipo.recetas && selectedEquipo.recetas.length > 0 ? (
                          <div className="row g-3">
                            {selectedEquipo.recetas.map((receta) => (
                              <div key={receta.id} className="col-lg-6 col-md-12">
                                <div className="card border-0 shadow-sm h-100">
                                  <div className="card-header bg-danger text-white border-0 py-2">
                                    <strong className="fs-6">
                                      <i className="bi bi-tag me-2"></i>
                                      {receta.tipo_receta}
                                    </strong>
                                  </div>
                                  <div className="card-body py-2">
                                    <h6 className="fw-bold text-dark mb-2 small">{receta.descripcion}</h6>
                                    {receta.observaciones && (
                                      <div className="mb-2">
                                        <label className="form-label fw-semibold text-muted mb-1 small">Observaciones</label>
                                        <p className="text-muted small mb-0">{receta.observaciones}</p>
                                      </div>
                                    )}
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-person-circle me-1 text-muted"></i>
                                      <small className="text-muted">
                                        Creado por: <strong>{receta.creado_por}</strong>
                                      </small>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3">
                            <i className="bi bi-journal-text fs-2 text-muted mb-2 d-block opacity-50"></i>
                            <p className="text-muted mb-0 small">No hay recetas registradas</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer bg-light border-0 py-2">
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2"
                  onClick={closeDetailsModal}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EquiposTable
