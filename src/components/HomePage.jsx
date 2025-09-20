import React from "react";
import "./HomePage.css";
import Navbar from "./Navbar";

function HomePage({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Hero Section */}
      <section id="inicio" className="cecyte-chef-hero-section">
        <div className="cecyte-chef-hero-background">
          <div className="cecyte-chef-hero-pattern"></div>
        </div>
        
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-hero-grid">
            {/* Contenido principal - Logo */}
            <div className="cecyte-chef-hero-content">
              <div className="cecyte-chef-logo-wrapper">
                <div className="cecyte-chef-logo-container">
                  <img
                    src="/src/assets/cecyte_chef_sin_fondo_horizontal.png"
                    alt="II Concurso Nacional CECYTE CHEF Baja California Sur"
                    className="cecyte-chef-main-logo"
                  />
                </div>
                <div className="cecyte-chef-logo-glow"></div>
                
                <div className="cecyte-chef-invitation-text">
                  <h1 className="cecyte-chef-invitation-title">
                    ¡Te invitamos al concurso CECYTE CHEF!
                  </h1>
                  <p className="cecyte-chef-invitation-subtitle">
                    Será un evento increíble donde podrás demostrar tus habilidades culinarias
                    y competir con los mejores chefs estudiantiles del país.
                  </p>
                </div>
              </div>
            </div>

            {/* Galería de platillos */}
            <div className="cecyte-chef-hero-gallery">
              <div className="cecyte-chef-gallery-container">
                <div className="cecyte-chef-gallery-grid">
                  {/* Cuadro perfecto 2x2 */}
                  <div className="cecyte-chef-gallery-item">
                    <div className="cecyte-chef-gallery-image-wrapper">
                      <img
                        src="/src/assets/platillos/platillo_salmon.webp"
                        alt="Platillo de Salmón"
                        className="cecyte-chef-gallery-image"
                      />
                    </div>
                    <div className="cecyte-chef-gallery-overlay">
                      <span className="cecyte-chef-gallery-label">Salmón Premium</span>
                    </div>
                  </div>
                  
                  <div className="cecyte-chef-gallery-item">
                    <div className="cecyte-chef-gallery-image-wrapper">
                      <img
                        src="/src/assets/platillos/platillo_camaron.webp"
                        alt="Platillo de Camarón"
                        className="cecyte-chef-gallery-image"
                      />
                    </div>
                    <div className="cecyte-chef-gallery-overlay">
                      <span className="cecyte-chef-gallery-label">Camarones</span>
                    </div>
                  </div>
                  
                  <div className="cecyte-chef-gallery-item">
                    <div className="cecyte-chef-gallery-image-wrapper">
                      <img
                        src="/src/assets/platillos/platillo_naranja.webp"
                        alt="Platillo Naranja"
                        className="cecyte-chef-gallery-image"
                      />
                    </div>
                    <div className="cecyte-chef-gallery-overlay">
                      <span className="cecyte-chef-gallery-label">Especialidad</span>
                    </div>
                  </div>
                  
                  <div className="cecyte-chef-gallery-item">
                    <div className="cecyte-chef-gallery-image-wrapper">
                      <img
                        src="/src/assets/platillos/platillo_naranjon.webp"
                        alt="Platillo Naranjón"
                        className="cecyte-chef-gallery-image"
                      />
                    </div>
                    <div className="cecyte-chef-gallery-overlay">
                      <span className="cecyte-chef-gallery-label">Creación Chef</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="cecyte-chef-features-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-features-header">
            <h2 className="cecyte-chef-features-title">
              ¿Por qué elegir CecyteChef?
            </h2>
            <p className="cecyte-chef-features-subtitle">
              Descubre todas las ventajas de nuestra plataforma
            </p>
          </div>
          
          <div className="cecyte-chef-features-grid">
            <div className="cecyte-chef-feature-card">
              <div className="cecyte-chef-feature-card-content">
                <div className="cecyte-chef-feature-icon cecyte-chef-feature-icon-primary">
                  <i className="bi bi-book"></i>
                </div>
                <h5 className="cecyte-chef-feature-title">
                  Aprendizaje Interactivo
                </h5>
                <p className="cecyte-chef-feature-description">
                  Contenido multimedia con videos, imágenes y explicaciones
                  paso a paso para un aprendizaje efectivo.
                </p>
              </div>
            </div>
            
            <div className="cecyte-chef-feature-card">
              <div className="cecyte-chef-feature-card-content">
                <div className="cecyte-chef-feature-icon cecyte-chef-feature-icon-secondary">
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="cecyte-chef-feature-title">Comunidad Activa</h5>
                <p className="cecyte-chef-feature-description">
                  Conecta con otros estudiantes y chefs profesionales.
                  Comparte experiencias y recetas.
                </p>
              </div>
            </div>
            
            <div className="cecyte-chef-feature-card">
              <div className="cecyte-chef-feature-card-content">
                <div className="cecyte-chef-feature-icon cecyte-chef-feature-icon-tertiary">
                  <i className="bi bi-award"></i>
                </div>
                <h5 className="cecyte-chef-feature-title">Certificaciones</h5>
                <p className="cecyte-chef-feature-description">
                  Obtén certificados reconocidos al completar nuestros cursos
                  y módulos especializados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cecyte-chef-cta-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-cta-content">
            <h3 className="cecyte-chef-cta-title">
              ¿Listo para comenzar tu viaje culinario?
            </h3>
            <p className="cecyte-chef-cta-description">
              Únete a miles de estudiantes que ya están transformando su
              pasión por la cocina en una carrera profesional.
            </p>
            <button
              className="cecyte-chef-cta-button"
              onClick={onLoginClick}
            >
              <i className="bi bi-box-arrow-in-right cecyte-chef-cta-button-icon"></i>
              <span className="cecyte-chef-cta-button-text-desktop">Iniciar Sesión Ahora</span>
              <span className="cecyte-chef-cta-button-text-mobile">Entrar Ahora</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="cecyte-chef-footer">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-footer-content">
            <div className="cecyte-chef-footer-copyright">
              <p className="cecyte-chef-footer-copyright-text">
                &copy; 2024 CecyteChef. Todos los derechos reservados.
              </p>
            </div>
            <div className="cecyte-chef-footer-social">
              <div className="cecyte-chef-social-links">
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Twitter"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
