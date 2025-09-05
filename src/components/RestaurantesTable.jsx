import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './RestaurantesTable.css'

const RestaurantesTable = ({ onRestauranteSelect }) => {
  const [restaurantes, setRestaurantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [restaurantesPerPage] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  // Filtros adicionales
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchRestaurantes()
  }, [])

  const fetchRestaurantes = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get('/restaurantes', token)
      
      if (response.data) {
        setRestaurantes(response.data)
        setError(null)
      } else {
        setRestaurantes([])
        setError(null)
      }
    } catch (err) {
      console.error('Error al obtener restaurantes:', err)
      setRestaurantes([])
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchRestaurantes()
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

  const filteredRestaurantes = restaurantes.filter(restaurante => {
    const matchesText = 
      restaurante.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
      restaurante.direccion?.toLowerCase().includes(filterText.toLowerCase()) ||
      restaurante.correo_electronico?.toLowerCase().includes(filterText.toLowerCase()) ||
      restaurante.telefono?.toLowerCase().includes(filterText.toLowerCase())
    
    const matchesStatus = !statusFilter || restaurante.estatus === statusFilter
    
    return matchesText && matchesStatus
  })

  // Ordenar restaurantes
  const sortedRestaurantes = [...filteredRestaurantes].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Paginación
  const indexOfLastRestaurante = currentPage * restaurantesPerPage
  const indexOfFirstRestaurante = indexOfLastRestaurante - restaurantesPerPage
  const currentRestaurantes = sortedRestaurantes.slice(indexOfFirstRestaurante, indexOfLastRestaurante)
  const totalPages = Math.ceil(sortedRestaurantes.length / restaurantesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
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
        <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando restaurantes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error al cargar restaurantes</h4>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={handleRefresh}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="restaurantes-table-container">
      {/* Header principal del componente */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-header text-white border-0 py-2" style={{backgroundColor: 'var(--primary-color)'}}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1 fw-bold">
                <i className="bi bi-cup-hot me-3"></i>
                Gestión de Restaurantes
              </h4>
              <p className="mb-0 opacity-75">
                Administra restaurantes participantes y sus promociones
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
        <div className="card-body py-2" style={{backgroundColor: 'var(--primary-50)'}}>
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle me-2 fs-5" style={{color: 'var(--primary-color)'}}></i>
                <span className="text-muted">
                  Total: <strong className="text-dark">{restaurantes.length}</strong> restaurantes registrados
                </span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <span className="badge fs-6 px-3 py-2" style={{backgroundColor: 'var(--success-color)'}}>
                <i className="bi bi-check-circle me-1"></i>
                Sistema Operativo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-header border-0 py-2" style={{backgroundColor: 'var(--primary-50)'}}>
          <h6 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-funnel me-2" style={{color: 'var(--primary-color)'}}></i>
            Filtros de Búsqueda
          </h6>
        </div>
        <div className="card-body py-3">
          <div className="row g-4">
            <div className="col-lg-6 col-md-6">
              <label className="form-label fw-semibold text-dark mb-2">
                <i className="bi bi-search me-2 text-muted"></i>
                Buscar
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Buscar por nombre, dirección, teléfono..."
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
            <div className="col-lg-3 col-md-6 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100 py-2 px-3"
                onClick={() => {
                  setFilterText('')
                  setStatusFilter('')
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de restaurantes */}
      <div className="card shadow-sm border-0">
        <div className="card-header border-0 py-2" style={{backgroundColor: 'var(--bg-primary)'}}>
          <h6 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-table me-2" style={{color: 'var(--primary-color)'}}></i>
            Lista de Restaurantes
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{overflowX: 'auto', minHeight: '400px'}}>
            <table className="table table-hover mb-0 align-middle" style={{minWidth: '1200px'}}>
              <thead className="table-light">
                <tr>
                  <th 
                    className="cursor-pointer border-0 py-3 px-2"
                    onClick={() => handleSort('id')}
                    style={{width: '80px', minWidth: '80px'}}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">ID</span>
                      {getSortIcon('id')}
                    </div>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-2"
                    onClick={() => handleSort('nombre')}
                    style={{width: '200px', minWidth: '200px'}}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Nombre</span>
                      {getSortIcon('nombre')}
                    </div>
                  </th>
                  <th 
                    className="border-0 py-3 px-2"
                    style={{width: '250px', minWidth: '250px'}}
                  >
                    <span className="fw-semibold text-dark">Dirección</span>
                  </th>
                  <th 
                    className="border-0 py-3 px-2"
                    style={{width: '200px', minWidth: '200px'}}
                  >
                    <span className="fw-semibold text-dark">Contacto</span>
                  </th>
                  <th 
                    className="cursor-pointer border-0 py-3 px-2"
                    onClick={() => handleSort('estatus')}
                    style={{width: '120px', minWidth: '120px'}}
                  >
                    <div className="d-flex align-items-center">
                      <span className="fw-semibold text-dark">Estatus</span>
                      {getSortIcon('estatus')}
                    </div>
                  </th>
                  <th 
                    className="border-0 py-3 px-2"
                    style={{width: '200px', minWidth: '200px'}}
                  >
                    <span className="fw-semibold text-dark">Promoción</span>
                  </th>
                  <th 
                    className="border-0 py-3 px-2"
                    style={{width: '150px', minWidth: '150px'}}
                  >
                    <span className="fw-semibold text-dark">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentRestaurantes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="text-muted">
                        <i className="bi bi-cup-hot fs-1 d-block mb-3 opacity-50"></i>
                        <h6 className="mb-2">No se encontraron restaurantes</h6>
                        <p className="mb-0">Intenta ajustar los filtros de búsqueda</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRestaurantes.map((restaurante) => (
                    <tr key={restaurante.id} className="border-bottom">
                      <td className="py-3 px-2" style={{width: '80px', minWidth: '80px'}}>
                        <span className="badge bg-secondary fs-6 px-2 py-1">#{restaurante.id}</span>
                      </td>
                      <td className="py-3 px-2" style={{width: '200px', minWidth: '200px'}}>
                        <div>
                          <h6 className="mb-1 fw-bold text-dark" style={{fontSize: '0.9rem', lineHeight: '1.2'}}>
                            {restaurante.nombre}
                          </h6>
                          {restaurante.pagina_web && (
                            <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>
                              <i className="bi bi-globe me-1"></i>
                              <a href={restaurante.pagina_web} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                Sitio Web
                              </a>
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{width: '250px', minWidth: '250px'}}>
                        <div>
                          <p className="mb-0 text-dark" style={{fontSize: '0.85rem', lineHeight: '1.3'}}>
                            <i className="bi bi-geo-alt me-1 text-muted"></i>
                            {restaurante.direccion}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{width: '200px', minWidth: '200px'}}>
                        <div>
                          <p className="mb-1 text-dark" style={{fontSize: '0.85rem'}}>
                            <i className="bi bi-telephone me-1 text-muted"></i>
                            {restaurante.telefono}
                          </p>
                          <small className="text-muted d-block" style={{fontSize: '0.75rem', wordBreak: 'break-all'}}>
                            <i className="bi bi-envelope me-1"></i>
                            {restaurante.correo_electronico}
                          </small>
                        </div>
                      </td>
                      <td className="py-3 px-2" style={{width: '120px', minWidth: '120px'}}>
                        {getStatusBadge(restaurante.estatus)}
                      </td>
                      <td className="py-3 px-2" style={{width: '200px', minWidth: '200px'}}>
                        {restaurante.codigo_promocional ? (
                          <div>
                            <span className="badge bg-warning fs-6 px-2 py-1 mb-1 d-block" style={{fontSize: '0.75rem'}}>
                              <i className="bi bi-tag me-1"></i>
                              {restaurante.codigo_promocional}
                            </span>
                            <small className="text-muted d-block" style={{fontSize: '0.7rem', lineHeight: '1.2'}}>
                              {restaurante.descripcion_codigo_promocional}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted" style={{fontSize: '0.8rem'}}>Sin promoción</span>
                        )}
                      </td>
                      <td className="py-3 px-2" style={{width: '150px', minWidth: '150px'}}>
                        <div className="d-flex flex-column gap-1">
                          <button
                            className="btn btn-outline-primary btn-sm px-2 py-1"
                            title="Ver detalles"
                            style={{fontSize: '0.75rem'}}
                            onClick={() => onRestauranteSelect ? onRestauranteSelect(restaurante.id) : null}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm px-2 py-1"
                            title="Editar restaurante"
                            style={{fontSize: '0.75rem'}}
                            onClick={() => onRestauranteSelect ? onRestauranteSelect(restaurante.id) : null}
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Editar
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
    </div>
  )
}

export default RestaurantesTable
