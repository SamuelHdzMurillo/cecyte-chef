import React, { useState, useEffect } from "react";
import apiService from "../services/apiService.js";
import authService from "../services/authService.js";
import "./UsersTable.css";

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  // Estados para el modal de edición/creación
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "usuario",
    evento_id: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Estados para el modal de detalles del usuario
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para los eventos
  const [eventos, setEventos] = useState([]);
  const [loadingEventos, setLoadingEventos] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchEventos();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = authService.getToken();

      // Solo obtener usuarios de la API
      const response = await apiService.get("/admin/users", token);

      if (response.data) {
        setUsers(response.data);
        setError(null);
      } else {
        setUsers([]);
        setError(null);
      }
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      // Si la API no responde, no mostrar nada
      setUsers([]);
      setError(
        "No se pudo conectar con el servidor. Por favor, verifica tu conexión."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchEventos = async () => {
    try {
      setLoadingEventos(true);
      const token = authService.getToken();

      const response = await apiService.get("/eventos/list", token);

      if (response.success && response.data) {
        setEventos(response.data);
      } else {
        console.error("Error en la respuesta de eventos:", response);
        setEventos([]);
      }
    } catch (err) {
      console.error("Error al obtener eventos:", err);
      setEventos([]);
    } finally {
      setLoadingEventos(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <i className="bi bi-arrow-down-up text-muted"></i>;
    }
    return sortDirection === "asc" ? (
      <i className="bi bi-arrow-up text-primary"></i>
    ) : (
      <i className="bi bi-arrow-down text-primary"></i>
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(filterText.toLowerCase()))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "created_at") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
      case "administrador":
        return "danger";
      case "usuario":
      case "user":
        return "primary";
      default:
        return "secondary";
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
      case "administrador":
        return "Administrador";
      case "usuario":
      case "user":
        return "Usuario";
      default:
        return role;
    }
  };

  const getEventoName = (eventoId) => {
    if (!eventoId) return "N/A";
    const evento = eventos.find((e) => e.id === eventoId);
    return evento ? evento.nombre_evento : `ID: ${eventoId}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Funciones para el modal
  const openCreateModal = () => {
    setIsCreating(true);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "usuario",
      evento_id: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsCreating(false);
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      evento_id: user.evento_id || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setIsCreating(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "usuario",
      evento_id: "",
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      errors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "El email no es válido";
    }

    // Validar contraseña solo si es creación o si se está editando y se ingresó una
    if (isCreating && !formData.password.trim()) {
      errors.password = "La contraseña es requerida para nuevos usuarios";
    } else if (
      !isCreating &&
      formData.password.trim() &&
      formData.password.length < 6
    ) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.role) {
      errors.role = "El rol es requerido";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const token = authService.getToken();
      const endpoint = isCreating
        ? "/admin/users"
        : `/admin/users/${editingUser.id}`;
      const method = isCreating ? "post" : "put";

      // Preparar datos para enviar
      const dataToSend = { ...formData };

      // Si es edición y no se ingresó contraseña, no enviar el campo password
      if (!isCreating && !dataToSend.password.trim()) {
        delete dataToSend.password;
      }

      const response = await apiService[method](endpoint, dataToSend, token);

      if (response.success || response.data) {
        // Actualizar la lista de usuarios
        if (isCreating) {
          // Agregar nuevo usuario
          const newUser = {
            ...formData,
            id: response.data?.id || Math.max(...users.map((u) => u.id)) + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            email_verified_at: null,
          };
          setUsers((prev) => [...prev, newUser]);
        } else {
          // Actualizar usuario existente
          setUsers((prev) =>
            prev.map((user) =>
              user.id === editingUser.id
                ? { ...user, ...formData, updated_at: new Date().toISOString() }
                : user
            )
          );
        }

        closeModal();
        // Mostrar mensaje de éxito
        alert(
          isCreating
            ? "Usuario creado exitosamente"
            : "Usuario actualizado exitosamente"
        );
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar el usuario. Por favor, inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewUser = (user) => {
    console.log("Ver usuario:", user);
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const handleEditUser = (user) => {
    openEditModal(user);
  };

  const handleDeleteUser = async (user) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario "${user.name}"?`
      )
    ) {
      try {
        setLoading(true);
        const token = authService.getToken();

        // Llamar a la API para eliminar el usuario
        const response = await apiService.delete(
          `/admin/users/${user.id}`,
          token
        );

        if (response.success || response.data) {
          // Remover el usuario de la lista local
          setUsers((prev) => prev.filter((u) => u.id !== user.id));

          // Mostrar mensaje de éxito
          alert("Usuario eliminado exitosamente");
        } else {
          alert("Error al eliminar el usuario. Por favor, inténtalo de nuevo.");
        }
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Error al eliminar el usuario. Por favor, inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button
          className="btn btn-sm ms-3"
          style={{
            backgroundColor: "var(--danger-color)",
            borderColor: "var(--danger-color)",
            color: "white",
          }}
          onClick={handleRefresh}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary-color)" }}
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando usuarios...</p>
      </div>
    );
  }

  // Si no hay usuarios y no hay error, mostrar mensaje
  if (users.length === 0) {
    return (
      <div className="card">
        <div
          className="card-header"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: "white" }}>
              <i className="bi bi-people me-2"></i>
              Gestión de Usuarios
            </h5>
            <button
              className="btn"
              style={{
                backgroundColor: "white",
                borderColor: "white",
                color: "var(--primary-color)",
              }}
              onClick={handleRefresh}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>
        </div>
        <div className="card-body text-center py-5">
          <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
          <p className="text-muted mb-3">No hay usuarios disponibles</p>
          <p className="text-muted small">
            Verifica tu conexión al servidor o contacta al administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div
          className="card-header"
          style={{ backgroundColor: "var(--primary-color)", color: "white" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0" style={{ color: "white" }}>
              <i className="bi bi-people me-2"></i>
              Gestión de Usuarios
            </h5>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={openCreateModal}>
                <i className="bi bi-plus-circle me-2"></i>
                Nuevo Usuario
              </button>
              <button
                className="btn"
                style={{
                  backgroundColor: "white",
                  borderColor: "white",
                  color: "var(--primary-color)",
                }}
                onClick={handleRefresh}
                disabled={loading}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                {loading ? "Cargando..." : "Actualizar"}
              </button>
            </div>
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
                    className="btn"
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      borderColor: "var(--secondary-color)",
                      color: "white",
                    }}
                    type="button"
                    onClick={() => setFilterText("")}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6 text-end">
              <span className="text-muted">
                Mostrando {currentUsers.length} de {filteredUsers.length}{" "}
                usuarios
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
                    style={{ width: "80px", cursor: "pointer" }}
                    onClick={() => handleSort("id")}
                  >
                    <div className="d-flex align-items-center">
                      ID {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("name")}
                  >
                    <div className="d-flex align-items-center">
                      Nombre {getSortIcon("name")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSort("email")}
                  >
                    <div className="d-flex align-items-center">
                      Email {getSortIcon("email")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "120px", cursor: "pointer" }}
                    onClick={() => handleSort("role")}
                  >
                    <div className="d-flex align-items-center">
                      Rol {getSortIcon("role")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleSort("evento_id")}
                  >
                    <div className="d-flex align-items-center">
                      Evento {getSortIcon("evento_id")}
                    </div>
                  </th>
                  <th
                    scope="col"
                    style={{ width: "150px", cursor: "pointer" }}
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="d-flex align-items-center">
                      Fecha Creación {getSortIcon("created_at")}
                    </div>
                  </th>
                  <th scope="col" style={{ width: "120px" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <i className="bi bi-search fs-1 text-muted d-block mb-3"></i>
                      <p className="text-muted mb-3">
                        No se encontraron usuarios con la búsqueda actual
                      </p>
                      <button
                        className="btn btn-sm"
                        style={{
                          backgroundColor: "var(--secondary-color)",
                          borderColor: "var(--secondary-color)",
                          color: "white",
                        }}
                        onClick={() => setFilterText("")}
                      >
                        Limpiar búsqueda
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
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
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
                        <span
                          className={`badge bg-${getRoleBadgeColor(user.role)}`}
                        >
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className="badge bg-info"
                          title={user.evento_id ? `ID: ${user.evento_id}` : ""}
                        >
                          {getEventoName(user.evento_id)}
                        </span>
                      </td>
                      <td>
                        <div>
                          <div>{formatDate(user.created_at)}</div>
                          <small className="text-muted">
                            {formatTime(user.created_at)}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "var(--primary-color)",
                              borderColor: "var(--primary-color)",
                              color: "white",
                            }}
                            title="Ver detalles"
                            onClick={() => handleViewUser(user)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "var(--warning-color)",
                              borderColor: "var(--warning-color)",
                              color: "var(--text-primary)",
                            }}
                            title="Editar usuario"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm"
                            style={{
                              backgroundColor: "var(--danger-color)",
                              borderColor: "var(--danger-color)",
                              color: "white",
                            }}
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
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <li
                      key={number}
                      className={`page-item ${
                        currentPage === number ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </button>
                    </li>
                  )
                )}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
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

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i
                    className={`bi ${
                      isCreating ? "bi-plus-circle" : "bi-pencil-square"
                    } me-2`}
                  ></i>
                  {isCreating ? "Crear Nuevo Usuario" : "Editar Usuario"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        Nombre completo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          formErrors.name ? "is-invalid" : ""
                        }`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ingresa el nombre completo"
                      />
                      {formErrors.name && (
                        <div className="invalid-feedback">
                          {formErrors.name}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          formErrors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="usuario@ejemplo.com"
                      />
                      {formErrors.email && (
                        <div className="invalid-feedback">
                          {formErrors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña{" "}
                        {isCreating ? (
                          <span className="text-danger">*</span>
                        ) : (
                          <span className="text-muted">(opcional)</span>
                        )}
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          formErrors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={
                          isCreating
                            ? "Ingresa la contraseña"
                            : "Deja vacío para mantener la actual"
                        }
                      />
                      {formErrors.password && (
                        <div className="invalid-feedback">
                          {formErrors.password}
                        </div>
                      )}
                      {!isCreating && (
                        <small className="form-text text-muted">
                          Solo llena este campo si quieres cambiar la contraseña
                        </small>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="role" className="form-label">
                        Rol <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          formErrors.role ? "is-invalid" : ""
                        }`}
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                      {formErrors.role && (
                        <div className="invalid-feedback">
                          {formErrors.role}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="evento_id" className="form-label">
                        Evento
                      </label>
                      <select
                        className="form-select"
                        id="evento_id"
                        name="evento_id"
                        value={formData.evento_id}
                        onChange={handleInputChange}
                        disabled={loadingEventos}
                      >
                        <option value="">Seleccionar evento (opcional)</option>
                        {eventos.map((evento) => (
                          <option key={evento.id} value={evento.id}>
                            {evento.nombre_evento}
                          </option>
                        ))}
                      </select>
                      {loadingEventos && (
                        <div className="form-text">
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            style={{ color: "var(--primary-color)" }}
                            role="status"
                          ></span>
                          Cargando eventos...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn"
                    style={{
                      backgroundColor: "var(--secondary-color)",
                      borderColor: "var(--secondary-color)",
                      color: "white",
                    }}
                    onClick={closeModal}
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "var(--primary-color)",
                      borderColor: "var(--primary-color)",
                      color: "white",
                    }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          style={{ color: "white" }}
                          role="status"
                        ></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {isCreating ? "Crear Usuario" : "Guardar Cambios"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del usuario */}
      {showDetailsModal && selectedUser && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Detalles del Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Información General</h6>
                    <p>
                      <strong>ID:</strong> {selectedUser.id}
                    </p>
                    <p>
                      <strong>Nombre:</strong> {selectedUser.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser.email}
                    </p>
                    <p>
                      <strong>Rol:</strong>{" "}
                      {getRoleDisplayName(selectedUser.role)}
                    </p>
                    <p>
                      <strong>Evento:</strong>{" "}
                      {getEventoName(selectedUser.evento_id)}
                    </p>
                    <p>
                      <strong>Verificado:</strong>{" "}
                      {selectedUser.email_verified_at ? "Sí" : "No"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>Detalles de Creación</h6>
                    <p>
                      <strong>Fecha de Creación:</strong>{" "}
                      {formatDate(selectedUser.created_at)}
                    </p>
                    <p>
                      <strong>Hora de Creación:</strong>{" "}
                      {formatTime(selectedUser.created_at)}
                    </p>
                    <p>
                      <strong>Fecha de Actualización:</strong>{" "}
                      {formatDate(selectedUser.updated_at)}
                    </p>
                    <p>
                      <strong>Hora de Actualización:</strong>{" "}
                      {formatTime(selectedUser.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{
                    backgroundColor: "var(--secondary-color)",
                    borderColor: "var(--secondary-color)",
                    color: "white",
                  }}
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTable;
