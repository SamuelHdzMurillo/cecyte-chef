import React, { useState } from 'react'
import './Login.css'

function Login({ onBackClick }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí irá la lógica de autenticación
    console.log('Datos del formulario:', formData)
    alert('Función de login implementada')
  }

  return (
    <div className="login-container">
      {/* Fondo decorativo */}
      <div className="login-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Botón de regreso */}
      <button 
        className="btn btn-outline-light back-button" 
        onClick={onBackClick}
        aria-label="Volver al inicio"
      >
        <i className="bi bi-arrow-left me-2"></i>
        Volver al Inicio
      </button>

      {/* Contenedor principal */}
      <div className="login-main">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
              
              {/* Card de login */}
              <div className="login-card">
                <div className="login-card-body">
                  
                  {/* Header con logo */}
                  <div className="text-center mb-4">
                    <div className="logo-container mb-3">
                      <div className="logo-placeholder">
                        <i className="bi bi-egg-fried fs-1 text-warning"></i>
                        <span className="logo-text">Logo</span>
                      </div>
                    </div>
                    <h2 className="login-title">Bienvenido de Vuelta</h2>
                    <p className="login-subtitle text-muted">
                      Inicia sesión en tu cuenta para continuar
                    </p>
                  </div>

                  {/* Formulario */}
                  <form onSubmit={handleSubmit} className="login-form">
                    
                    {/* Campo Email */}
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label">
                        <i className="bi bi-envelope me-2"></i>
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    {/* Campo Contraseña */}
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label">
                        <i className="bi bi-lock me-2"></i>
                        Contraseña
                      </label>
                      <div className="password-input-group">
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          required
                        />
                        <button 
                          type="button" 
                          className="password-toggle"
                          onClick={() => {
                            const input = document.getElementById('password')
                            input.type = input.type === 'password' ? 'text' : 'password'
                          }}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>

                    {/* Opciones adicionales */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          name="rememberMe"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="rememberMe">
                          Recordarme
                        </label>
                      </div>
                      <a href="#" className="forgot-password">
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    {/* Botón de login */}
                    <button type="submit" className="btn btn-primary btn-lg w-100 mb-3">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Iniciar Sesión
                    </button>

                    {/* Separador */}
                    <div className="text-center mb-3">
                      <span className="separator-text">o</span>
                    </div>

                    {/* Botones sociales */}
                    <div className="row g-2 mb-4">
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-dark w-100">
                          <i className="bi bi-google me-2"></i>
                          Google
                        </button>
                      </div>
                      <div className="col-6">
                        <button type="button" className="btn btn-outline-primary w-100">
                          <i className="bi bi-facebook me-2"></i>
                          Facebook
                        </button>
                      </div>
                    </div>

                    {/* Enlace de registro */}
                    <div className="text-center">
                      <span className="text-muted">¿No tienes una cuenta? </span>
                      <a href="#" className="register-link">Regístrate aquí</a>
                    </div>

                  </form>

                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-muted small">
                  &copy; 2024 CecyteChef. Todos los derechos reservados.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
