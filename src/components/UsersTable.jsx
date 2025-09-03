

import React, { useState, useEffect } from 'react'
import apiService from '../services/apiService.js'
import authService from '../services/authService.js'
import './UsersTable.css'

const UsersTable = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterText, setFilterText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')

  // Datos de ejemplo para mostrar mientras se conecta a la API
  const sampleUsers = [
    {
      id: 1,
      name: "Administrador",
      email: "admin@eventos.com",
      role: "admin",
      evento_id: 1,
      email_verified_at: "2025-01-15T10:30:00.000000Z",
      created_at: "2025-01-15T10:30:00.000000Z",
      updated_at: "2025-01-15T10:30:00.000000Z"
    },
    {
      id: 2,
      name: "María González",
      email: "maria.gonzalez@cecyte.edu.mx",
      role: "profesor",
      evento_id: 2,
      email_verified_at: "2025-01-14T14:20:00.000000Z",
      created_at: "2025-01-14T14:20:00.000000Z",
      updated_at: "2025-01-14T14:20:00.000000Z"
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@cecyte.edu.mx",
      role: "estudiante",
      evento_id: 3,
      email_verified_at: null,
      created_at: "2025-01-13T09:15:00.000000Z",
      updated_at: "2025-01-13T09:15:00.000000Z"
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana.martinez@cecyte.edu.mx",
      role: "coordinador",
      evento_id: 1,
      email_verified_at: "2025-01-12T16:45:00.000000Z",
      created_at: "2025-01-12T16:45:00.000000Z",
      updated_at: "2025-01-12T16:45:00.000000Z"
    },
    {
      id: 5,
      name: "Luis Fernández",
      email: "luis.fernandez@cecyte.edu.mx",
      role: "profesor",
      evento_id: 2,
      email_verified_at: "2025-01-11T11:30:00.000000Z",
      created_at: "2025-01-11T11:30:00.000000Z",
      updated_at: "2025-01-11T11:30:00.000000Z"
    }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = authService.getToken()
      
      // Intentar obtener usuarios de la API
      try {
        const response = await apiService.get('/admin/users', token)
        
        if (response.data) {
          setUsers(response.data)
        } else {
          setUsers([])
        }
        setError(null)
      } catch (apiError) {
        console.log('API no disponible, usando datos de ejemplo:', apiError.message)
        // Si la API no está disponible, usar datos de ejemplo
        setUsers(sampleUsers)
        setError(null)
      }
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      // En caso de error, usar datos de ejemplo
      setUsers(sampleUsers)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchUsers()
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

  const filteredUsers = users.filter(
    user => 
      user.name && user.name.toLowerCase().includes(filterText.toLowerCase()) ||
      user.email && user.email.toLowerCase().includes(filterText.toLowerCase()) ||
      user.role && user.role.toLowerCase().includes(filterText.toLowerCase())
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    
    if (sortField === 'created_at') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'danger'
      case 'profesor':
        return 'primary'
      case 'estudiante':
        return 'success'
      case 'coordinador':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'profesor':
        return 'Profesor'
      case 'estudiante':
        return 'Estudiante'
      case 'coordinador':
        return 'Coordinador'
      default:
        return role
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewUser = (user) => {
    console.log('Ver usuario:', user)
    // Aquí puedes implementar la lógica para mostrar detalles del usuario
  }

  const handleEditUser = (user) => {
    console.log('Editar usuario:', user)
    // Aquí puedes implementar la lógica para editar el usuario
  }

  const handleDeleteUser = (user) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`)) {
      console.log('Eliminar usuario:', user)
      // Aquí puedes implementar la lógica para eliminar el usuario
    }
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button 
          className="btn btn-outline-danger btn-sm ms-3"
          onClick={handleRefresh}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando usuarios...</p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-people me-2"></i>
            Gestión de Usuarios
          </h5>
          <button
            className="btn btn-primary"
            onClick={handleRefresh}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {/* Barra de búsqueda */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar usuarios por nombre, email o rol..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              {filterText && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setFilterText('')}
                >
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>
          <div className="col-md-6 text-end">
            <span className="text-muted">
              Mostrando {currentUsers.length} de {filteredUsers.length} usuarios
            </span>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th 
                  scope="col" 
                  style={{ width: '80px', cursor: 'pointer' }}
                  onClick={() => handleSort('id')}
                >
                  <div className="d-flex align-items-center">
                    ID {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  <div className="d-flex align-items-center">
                    Nombre {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('email')}
                >
                  <div className="d-flex align-items-center">
                    Email {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  style={{ width: '120px', cursor: 'pointer' }}
                  onClick={() => handleSort('role')}
                >
                  <div className="d-flex align-items-center">
                    Rol {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => handleSort('evento_id')}
                >
                  <div className="d-flex align-items-center">
                    Evento ID {getSortIcon('evento_id')}
                  </div>
                </th>
                <th 
                  scope="col" 
                  style={{ width: '150px', cursor: 'pointer' }}
                  onClick={() => handleSort('created_at')}
                >
                  <div className="d-flex align-items-center">
                    Fecha Creación {getSortIcon('created_at')}
                  </div>
                </th>
                <th scope="col" style={{ width: '120px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
                    <p className="text-muted mb-3">No se encontraron usuarios</p>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={handleRefresh}
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="text-center">
                      <span className="badge bg-secondary">{user.id}</span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-3">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold">{user.name}</div>
                          <small className="text-muted">ID: {user.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{user.email}</div>
                        {user.email_verified_at && (
                          <small className="text-success">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Verificado
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className={`badge bg-${getRoleBadgeColor(user.role)}`}>
                        {getRoleDisplayName(user.role)}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-info">
                        {user.evento_id || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div>{formatDate(user.created_at)}</div>
                        <small className="text-muted">{formatTime(user.created_at)}</small>
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="Ver detalles"
                          onClick={() => handleViewUser(user)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          title="Editar usuario"
                          onClick={() => handleEditUser(user)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Eliminar usuario"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <i className="bi bi-trash"></i>
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
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}

export default UsersTable
