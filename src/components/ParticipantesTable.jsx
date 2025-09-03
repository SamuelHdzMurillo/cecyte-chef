import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/apiService.js'
import './ParticipantesTable.css'

function ParticipantesTable() {
  const navigate = useNavigate()
  const [participantes, setParticipantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRol, setFilterRol] = useState('')
  const [filterPlantel, setFilterPlantel] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    fetchParticipantes()
  }, [])

  const fetchParticipantes = async () => {
    try {
      setLoading(true)
      
      const response = await apiService.get('/participantes')
      
      // La API devuelve { "data": [...] }
      const data = response.data || response
      
      if (Array.isArray(data)) {
        setParticipantes(data)
        setError(null)
      } else {
        console.error('Los datos no son un array:', data)
        setError('Formato de datos incorrecto')
        setParticipantes([])
      }
    } catch (err) {
      console.error('Error al obtener participantes:', err)
      setError(`Error al cargar los participantes: ${err.message}`)
      setParticipantes([])
    } finally {
      setLoading(false)
    }
  }

  const handleVerDetalle = (participanteId) => {
    navigate(`/dashboard/participantes/${participanteId}`)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterRol = (e) => {
    setFilterRol(e.target.value)
    setCurrentPage(1)
  }

  const handleFilterPlantel = (e) => {
    setFilterPlantel(e.target.value)
    setCurrentPage(1)
  }

  // Filtrar participantes
  const filteredParticipantes = participantes.filter(participante => {
    const matchesSearch = 
      participante.nombre_participante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participante.matricula_participante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participante.correo_participante.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRol = filterRol === '' || participante.rol_participante === filterRol
    const matchesPlantel = filterPlantel === '' || participante.plantel_participante === filterPlantel
    
    return matchesSearch && matchesRol && matchesPlantel
  })

  // Obtener roles únicos para el filtro
  const rolesUnicos = [...new Set(participantes.map(p => p.rol_participante))]
  
  // Obtener planteles únicos para el filtro
  const plantelesUnicos = [...new Set(participantes.map(p => p.plantel_participante))]

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentParticipantes = filteredParticipantes.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredParticipantes.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando participantes...</p>
        <small className="text-muted">Verificando conexión con la API...</small>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar participantes</h4>
        <p>{error}</p>
        <hr />
        <div className="mb-3">
          <small className="text-muted">
            <strong>Información de depuración:</strong><br />
            • Estado de carga: {loading ? 'Cargando' : 'Completado'}<br />
            • Participantes cargados: {participantes.length}<br />
            • Última actualización: {new Date().toLocaleTimeString()}
          </small>
        </div>
        <button className="btn btn-outline-danger" onClick={fetchParticipantes}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    )
  }

  // Verificar si no hay participantes
  if (!loading && !error && participantes.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-people fs-1 text-muted mb-3"></i>
        <h4 className="text-muted">No hay participantes registrados</h4>
        <p className="text-muted">No se encontraron participantes en el sistema.</p>
        <button className="btn btn-primary" onClick={fetchParticipantes}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>
    )
  }

  return (
    <div className="participantes-table-container">
      {/* Header principal del componente */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-primary text-white border-0 py-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-person-badge-fill me-3"></i>
                Gestión de Participantes
              </h4>
              <p className="mb-0 opacity-75">
                Administra participantes, sus perfiles, equipos y información personal
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-light px-4 py-2"
                onClick={fetchParticipantes}
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
                  Total: <strong className="text-dark">{participantes.length}</strong> participantes registrados
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="d-flex align-items-center justify-content-end">
                <i className="bi bi-funnel text-primary me-2 fs-5"></i>
                <span className="text-muted">
                  Filtrados: <strong className="text-dark">{filteredParticipantes.length}</strong> participantes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header con estadísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Participantes</h5>
              <h2 className="mb-0">{participantes.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Con Seguro</h5>
              <h2 className="mb-0">{participantes.filter(p => p.seguro_facultativo).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5 className="card-title">Con Alergias</h5>
              <h2 className="mb-0">{participantes.filter(p => p.alergico).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">Equipos Activos</h5>
              <h2 className="mb-0">{[...new Set(participantes.map(p => p.equipo_id))].length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="card mb-4">
        <div className="card-header">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="bi bi-funnel me-2"></i>
            Filtros y Búsqueda
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nombre, matrícula o correo..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Rol</label>
              <select
                className="form-select"
                value={filterRol}
                onChange={handleFilterRol}
              >
                <option value="">Todos los roles</option>
                {rolesUnicos.map(rol => (
                  <option key={rol} value={rol}>{rol}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Plantel</label>
              <select
                className="form-select"
                value={filterPlantel}
                onChange={handleFilterPlantel}
              >
                <option value="">Todos los planteles</option>
                {plantelesUnicos.map(plantel => (
                  <option key={plantel} value={plantel}>{plantel}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('')
                  setFilterRol('')
                  setFilterPlantel('')
                  setCurrentPage(1)
                }}
              >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de participantes */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">
            <i className="bi bi-people me-2"></i>
            Lista de Participantes ({filteredParticipantes.length})
          </h6>
          <button
            className="btn btn-primary btn-sm"
            onClick={fetchParticipantes}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Actualizar
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Participante</th>
                  <th>Equipo</th>
                  <th>Rol</th>
                  <th>Plantel</th>
                  <th>Contacto</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentParticipantes.map((participante) => (
                  <tr key={participante.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="avatar-placeholder me-2">
                          {participante.foto_credencial ? (
                            <img
                              src={`/uploads/${participante.foto_credencial}`}
                              alt={participante.nombre_participante}
                              className="avatar-img"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'block'
                              }}
                            />
                          ) : null}
                          <div className="avatar-fallback" style={{ display: participante.foto_credencial ? 'none' : 'block' }}>
                            {participante.nombre_participante.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold">{participante.nombre_participante}</div>
                          <small className="text-muted">{participante.matricula_participante}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {participante.equipo?.nombre_equipo || 'Sin equipo'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info">{participante.rol_participante}</span>
                    </td>
                    <td>
                      <div>
                        <div className="fw-bold">{participante.plantel_participante}</div>
                        <small className="text-muted">{participante.plantelcct}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{participante.telefono_participante}</div>
                        <small className="text-muted">{participante.correo_participante}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {participante.seguro_facultativo && (
                          <span className="badge bg-success">Seguro</span>
                        )}
                        {participante.alergico && (
                          <span className="badge bg-warning">Alergias</span>
                        )}
                        <span className="badge bg-secondary">{participante.semestre_participante}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleVerDetalle(participante.id)}
                        title="Ver detalle"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <nav aria-label="Navegación de páginas">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          )}

          {filteredParticipantes.length === 0 && (
            <div className="text-center py-4">
              <i className="bi bi-search fs-1 text-muted"></i>
              <p className="mt-2 text-muted">No se encontraron participantes con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ParticipantesTable
