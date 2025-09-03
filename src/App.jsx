import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Login from './Login.jsx'
import './App.css'

function LandingPage({ onLoginClick }) {
  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <i className="bi bi-egg-fried me-2"></i>
            <span className="d-none d-sm-inline">CecyteChef</span>
            <span className="d-inline d-sm-none">CC</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#inicio">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#caracteristicas">Características</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contacto">Contacto</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-primary ms-2 w-100 w-lg-auto" onClick={onLoginClick}>
                  <span className="d-none d-md-inline">Iniciar Sesión</span>
                  <span className="d-inline d-md-none">Entrar</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="hero-section d-flex align-items-center min-vh-100">
        <div className="container text-center text-white">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 col-xl-7">
              <h1 className="display-3 fw-bold mb-4">
                Bienvenido a <span className="text-warning">CecyteChef</span>
              </h1>
              <p className="lead mb-5 fs-5">
                Descubre el arte de la cocina con nuestra plataforma educativa. 
                Aprende técnicas culinarias, recetas exclusivas y conviértete en un chef profesional.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap flex-column flex-sm-row">
                <button className="btn btn-warning btn-lg px-4 py-3 fw-bold" onClick={() => alert('Función de registro')}>
                  <i className="bi bi-person-plus me-2"></i>
                  <span className="d-none d-sm-inline">Registrarse</span>
                  <span className="d-inline d-sm-none">Registro</span>
                </button>
                <button className="btn btn-outline-light btn-lg px-4 py-3 fw-bold" onClick={onLoginClick}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  <span className="d-none d-sm-inline">Iniciar Sesión</span>
                  <span className="d-inline d-sm-none">Entrar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold text-dark mb-3">¿Por qué elegir CecyteChef?</h2>
              <p className="lead text-muted">Descubre todas las ventajas de nuestra plataforma</p>
            </div>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-book fs-1"></i>
                  </div>
                  <h5 className="card-title fw-bold">Aprendizaje Interactivo</h5>
                  <p className="card-text text-muted">
                    Contenido multimedia con videos, imágenes y explicaciones paso a paso para un aprendizaje efectivo.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-success bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-people fs-1"></i>
                  </div>
                  <h5 className="card-title fw-bold">Comunidad Activa</h5>
                  <p className="card-text text-muted">
                    Conecta con otros estudiantes y chefs profesionales. Comparte experiencias y recetas.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="bg-warning bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                    <i className="bi bi-award fs-1"></i>
                  </div>
                  <h5 className="card-title fw-bold">Certificaciones</h5>
                  <p className="card-text text-muted">
                    Obtén certificados reconocidos al completar nuestros cursos y módulos especializados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-dark text-white">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 col-xl-7">
              <h3 className="display-6 fw-bold mb-4">¿Listo para comenzar tu viaje culinario?</h3>
              <p className="lead mb-4">
                Únete a miles de estudiantes que ya están transformando su pasión por la cocina en una carrera profesional.
              </p>
              <button className="btn btn-warning btn-lg px-5 py-3 fw-bold w-100 w-sm-auto" onClick={onLoginClick}>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                <span className="d-none d-sm-inline">Iniciar Sesión Ahora</span>
                <span className="d-inline d-sm-none">Entrar Ahora</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-light py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0 text-muted">&copy; 2024 CecyteChef. Todos los derechos reservados.</p>
            </div>
            <div className="col-12 col-md-6 text-center text-md-end">
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                <a href="#" className="text-muted text-decoration-none" aria-label="Facebook">
                  <i className="bi bi-facebook fs-5"></i>
                </a>
                <a href="#" className="text-muted text-decoration-none" aria-label="Twitter">
                  <i className="bi bi-twitter fs-5"></i>
                </a>
                <a href="#" className="text-muted text-decoration-none" aria-label="Instagram">
                  <i className="bi bi-instagram fs-5"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  const navigate = useNavigate()

  const handleLoginClick = () => {
    navigate('/login')
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoginClick={handleLoginClick} />} />
      <Route path="/login" element={<Login onBackClick={handleBackToHome} />} />
    </Routes>
  )
}

export default App
