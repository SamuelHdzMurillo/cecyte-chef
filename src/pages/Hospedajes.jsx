import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";

function Hospedajes({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Hoteles Section - Premium Parallax */}
      <section className="cecyte-chef-hoteles-section">
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img 
              src="/src/assets/fondos/Hoteles.png" 
              alt="Hoteles y hospedaje en La Paz" 
              className="cecyte-chef-parallax-image"
            />
          </div>
          
          {/* Overlay with gradient and texture */}
          <div className="cecyte-chef-parallax-overlay">
            <div className="cecyte-chef-overlay-gradient"></div>
            <div className="cecyte-chef-overlay-texture"></div>
          </div>
          
          {/* Content Layer */}
          <div className="cecyte-chef-parallax-content">
            <div className="cecyte-chef-container">
              <div className="cecyte-chef-hoteles-hero">
                <div className="cecyte-chef-hoteles-badge">
                  <span>Hospedaje</span>
                </div>
                
                <h1 className="cecyte-chef-hoteles-title">
                  <span className="cecyte-chef-title-line">¿Dónde</span>
                  <span className="cecyte-chef-title-highlight">hospedarte?</span>
                </h1>
                
                <p className="cecyte-chef-hoteles-description">
                  Descubre los mejores hoteles y resorts de La Paz, Baja California Sur. 
                  Desde lujosos complejos turísticos hasta acogedores hoteles boutique, 
                  encuentra el lugar perfecto para tu estadía con vistas espectaculares 
                  al mar y comodidades de primera clase.
                </p>
                
                <div className="cecyte-chef-hoteles-actions">
                  <button className="cecyte-chef-hoteles-button cecyte-chef-btn-primary">
                    <span>Ver hospedajes</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-building"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Explora las opciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información adicional sobre hospedajes */}
      <section className="cecyte-chef-objetivo-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-objetivo-grid">
            <div className="cecyte-chef-objetivo-content">
              <div className="cecyte-chef-objetivo-header">
                <span className="cecyte-chef-objetivo-label">HOSPEDAJE</span>
                <h2 className="cecyte-chef-objetivo-title">
                  Opciones de alojamiento en La Paz
                </h2>
              </div>
              
              <p className="cecyte-chef-objetivo-description">
                La Paz ofrece una amplia variedad de opciones de hospedaje para todos los gustos y presupuestos. 
                Desde hoteles de lujo con vista al mar hasta hostales económicos en el centro histórico, 
                encontrarás el lugar perfecto para tu estadía durante el concurso.
              </p>
              
              <div className="cecyte-chef-objetivo-buttons">
                <button className="cecyte-chef-btn cecyte-chef-btn-primary">
                  <span>Hoteles recomendados</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-building"></i>
                  </div>
                </button>
                
                <button className="cecyte-chef-btn cecyte-chef-btn-secondary">
                  <span>Reservar ahora</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                </button>
              </div>
            </div>

            {/* Imagen de hotel */}
            <div className="cecyte-chef-chef-image-container">
              <div className="cecyte-chef-chef-circle">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop"
                  alt="Hotel en La Paz"
                  className="cecyte-chef-chef-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Hospedajes;
