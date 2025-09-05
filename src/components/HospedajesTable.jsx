import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './HospedajesTable.css'

const HospedajesTable = () => {
  const navigate = useNavigate()
  const [hospedajes, setHospedajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hospedajesPerPage] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    numero_telefonico: '',
    correo: '',
    img: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchHospedajes()
  }, [])

  // Efecto para cerrar el modal cuando se complete exitosamente la operación
  useEffect(() => {
    if (!isSubmitting && showModal) {
      // Si no se está enviando y el modal está abierto, verificar si se completó
      console.log('Estado del modal:', { showModal, isSubmitting })
    }
  }, [isSubmitting, showModal])

  const fetchHospedajes = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      const response = await apiService.get('/hospedajes', token)
      
      if (response.data) {
        setHospedajes(response.data)
        setError(null)
      } else {
        setHospedajes([])
        setError(null)
      }
    } catch (err) {
      console.error('Error al obtener hospedajes:', err)
      setHospedajes([])
      setError('No se pudo conectar con el servidor. Por favor, verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchHospedajes()
  }

  const handleShowModal = () => {
    setShowModal(true)
    setFormData({
      nombre: '',
      direccion: '',
      numero_telefonico: '',
      correo: '',
      img: ''
    })
    setFormErrors({})
  }

  const handleCloseModal = () => {
    console.log('Cerrando modal...') // Para debugging
    setShowModal(false)
    setFormData({
      nombre: '',
      direccion: '',
      numero_telefonico: '',
      correo: '',
      img: ''
    })
    setFormErrors({})
    setIsSubmitting(false) // Asegurar que se resetee el estado de envío
  }

  const forceCloseModal = () => {
    console.log('Forzando cierre del modal...')
    setShowModal(false)
    setFormData({
      nombre: '',
      direccion: '',
      numero_telefonico: '',
      correo: '',
      img: ''
    })
    setFormErrors({})
    setIsSubmitting(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 255) {
      errors.nombre = 'El nombre no puede exceder 255 caracteres'
    }
    
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es requerida'
    }
    
    if (!formData.numero_telefonico.trim()) {
      errors.numero_telefonico = 'El número de teléfono es requerido'
    } else if (formData.numero_telefonico.length > 20) {
      errors.numero_telefonico = 'El número de teléfono no puede exceder 20 caracteres'
    }
    
    if (!formData.correo.trim()) {
      errors.correo = 'El correo electrónico es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'El correo electrónico no es válido'
    } else if (formData.correo.length > 255) {
      errors.correo = 'El correo electrónico no puede exceder 255 caracteres'
    }
    
    if (formData.img && formData.img.length > 255) {
      errors.img = 'La URL de la imagen no puede exceder 255 caracteres'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    try {
      setIsSubmitting(true)
      const token = authService.getToken()
      
      const response = await apiService.post('/hospedajes', formData, token)
      
      console.log('Respuesta de la API:', response) // Para debugging
      
      // Verificar si la respuesta es exitosa (código 201 o 200)
      if (response && (response.status === 201 || response.status === 200 || response.success)) {
        // Cerrar modal y refrescar la lista
        console.log('Respuesta exitosa por status, cerrando modal...')
        handleCloseModal()
        fetchHospedajes()
        
        // Mostrar mensaje de éxito
        alert('Hospedaje creado exitosamente')
        return // Salir de la función
      } else if (response && response.data && response.data.success) {
        // Cerrar modal y refrescar la lista
        console.log('Respuesta exitosa por data.success, cerrando modal...')
        handleCloseModal()
        fetchHospedajes()
        
        // Mostrar mensaje de éxito
        alert('Hospedaje creado exitosamente')
        return // Salir de la función
      } else if (response && response.data) {
        // Si hay datos en la respuesta, asumir que fue exitoso
        console.log('Respuesta con datos, cerrando modal...')
        handleCloseModal()
        fetchHospedajes()
        alert('Hospedaje creado exitosamente')
        return // Salir de la función
      } else {
        // Si no hay respuesta exitosa, mostrar error
        console.log('Respuesta no exitosa:', response)
        alert('Error: No se pudo crear el hospedaje. Respuesta inesperada del servidor.')
      }

      // Respaldo: cerrar modal después de 2 segundos si no se cerró automáticamente
      setTimeout(() => {
        if (showModal) {
          console.log('Cierre automático de respaldo...')
          forceCloseModal()
        }
      }, 2000)
    } catch (err) {
      console.error('Error al crear hospedaje:', err)
      
      if (err.response && err.response.data && err.response.data.errors) {
        // Errores de validación del servidor
        setFormErrors(err.response.data.errors)
      } else {
        // Error general
        alert('Error al crear el hospedaje. Por favor, intenta de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
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

  const handleViewDetails = (hospedajeId) => {
    navigate(`/hospedajes/${hospedajeId}`)
  }

  const filteredHospedajes = hospedajes.filter(hospedaje => {
    const matchesText = 
      hospedaje.nombre?.toLowerCase().includes(filterText.toLowerCase()) ||
      hospedaje.direccion?.toLowerCase().includes(filterText.toLowerCase()) ||
      hospedaje.correo?.toLowerCase().includes(filterText.toLowerCase()) ||
      hospedaje.numero_telefonico?.toLowerCase().includes(filterText.toLowerCase())
    
    return matchesText
  })

  // Ordenar hospedajes
  const sortedHospedajes = [...filteredHospedajes].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1
    }
    return 0
  })

  // Calcular paginación
  const indexOfLastHospedaje = currentPage * hospedajesPerPage
  const indexOfFirstHospedaje = indexOfLastHospedaje - hospedajesPerPage
  const currentHospedajes = sortedHospedajes.slice(indexOfFirstHospedaje, indexOfLastHospedaje)
  const totalPages = Math.ceil(sortedHospedajes.length / hospedajesPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
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
      <div className="hospedajes-table-container">
        <div className="text-center py-5">
          <div className="spinner-border" style={{color: 'var(--primary-color)'}} role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando hospedajes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hospedajes-table-container">
      <div className="card">
        <div className="card-header bg-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-1">
                <i className="bi bi-building me-2"></i>
                Hospedajes del Sistema
              </h4>
              <p className="mb-0">Gestiona y visualiza todos los hospedajes registrados</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-success btn-sm"
                onClick={handleShowModal}
                title="Agregar nuevo hospedaje"
              >
                <i className="bi bi-plus-lg me-1"></i>
                Nuevo Hospedaje
              </button>
              <button 
                className="btn btn-light btn-sm"
                onClick={handleRefresh}
                title="Actualizar datos"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="card-body bg-light">
          {/* Filtros */}
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre, dirección, correo o teléfono..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Total: <strong>{filteredHospedajes.length}</strong> hospedajes
              </span>
            </div>
          </div>

          {/* Tabla */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    ID {getSortIcon('id')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('nombre')}
                  >
                    Nombre {getSortIcon('nombre')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('direccion')}
                  >
                    Dirección {getSortIcon('direccion')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('numero_telefonico')}
                  >
                    Teléfono {getSortIcon('numero_telefonico')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('correo')}
                  >
                    Correo {getSortIcon('correo')}
                  </th>
                  <th 
                    className="cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Fecha Creación {getSortIcon('created_at')}
                  </th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentHospedajes.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {error ? (
                        <div className="text-danger">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {error}
                        </div>
                      ) : filterText ? (
                        <div className="text-muted">
                          <i className="bi bi-search me-2"></i>
                          No se encontraron hospedajes que coincidan con "{filterText}"
                        </div>
                      ) : (
                        <div className="text-muted">
                          <i className="bi bi-inbox me-2"></i>
                          No hay hospedajes registrados
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  currentHospedajes.map((hospedaje) => (
                    <tr key={hospedaje.id}>
                      <td>
                        <span className="badge bg-secondary">#{hospedaje.id}</span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {hospedaje.img && (
                            <img 
                              src={hospedaje.img} 
                              alt={hospedaje.nombre}
                              className="rounded me-2"
                              style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          )}
                          <div>
                            <strong>{hospedaje.nombre}</strong>
                          </div>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">
                          <i className="bi bi-geo-alt me-1"></i>
                          {hospedaje.direccion}
                        </small>
                      </td>
                      <td>
                        <a 
                          href={`tel:${hospedaje.numero_telefonico}`}
                          className="text-decoration-none"
                        >
                          <i className="bi bi-telephone me-1"></i>
                          {hospedaje.numero_telefonico}
                        </a>
                      </td>
                      <td>
                        <a 
                          href={`mailto:${hospedaje.correo}`}
                          className="text-decoration-none"
                        >
                          <i className="bi bi-envelope me-1"></i>
                          {hospedaje.correo}
                        </a>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatDate(hospedaje.created_at)}
                        </small>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleViewDetails(hospedaje.id)}
                            title="Ver detalles"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Modal para agregar nuevo hospedaje */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="bi bi-building me-2"></i>
                  Agregar Nuevo Hospedaje
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="nombre" className="form-label">
                        Nombre del Establecimiento <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        placeholder="Ej: Hotel Plaza Central"
                        maxLength="255"
                      />
                      {formErrors.nombre && (
                        <div className="invalid-feedback">{formErrors.nombre}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="numero_telefonico" className="form-label">
                        Número de Teléfono <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${formErrors.numero_telefonico ? 'is-invalid' : ''}`}
                        id="numero_telefonico"
                        name="numero_telefonico"
                        value={formData.numero_telefonico}
                        onChange={handleInputChange}
                        placeholder="Ej: +52 555-123-4567"
                        maxLength="20"
                      />
                      {formErrors.numero_telefonico && (
                        <div className="invalid-feedback">{formErrors.numero_telefonico}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control ${formErrors.direccion ? 'is-invalid' : ''}`}
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Ej: Av. Principal 123, Centro Histórico, Ciudad"
                      rows="3"
                    ></textarea>
                    {formErrors.direccion && (
                      <div className="invalid-feedback">{formErrors.direccion}</div>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="correo" className="form-label">
                        Correo Electrónico <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${formErrors.correo ? 'is-invalid' : ''}`}
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleInputChange}
                        placeholder="Ej: reservas@plazacentral.com"
                        maxLength="255"
                      />
                      {formErrors.correo && (
                        <div className="invalid-feedback">{formErrors.correo}</div>
                      )}
                    </div>
                    
                    <div className="col-md-4 mb-3">
                      <label htmlFor="img" className="form-label">
                        URL de la Imagen
                      </label>
                      <input
                        type="url"
                        className={`form-control ${formErrors.img ? 'is-invalid' : ''}`}
                        id="img"
                        name="img"
                        value={formData.img}
                        onChange={handleInputChange}
                        placeholder="Ej: https://ejemplo.com/imagen.jpg"
                        maxLength="255"
                      />
                      {formErrors.img && (
                        <div className="invalid-feedback">{formErrors.img}</div>
                      )}
                      <small className="form-text text-muted">
                        Opcional. URL de la imagen del establecimiento.
                      </small>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" style={{color: 'white'}} role="status" aria-hidden="true"></span>
                        Creando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Crear Hospedaje
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HospedajesTable
