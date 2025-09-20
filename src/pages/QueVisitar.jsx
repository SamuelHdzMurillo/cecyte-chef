import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";

function QueVisitar({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Lugares Section - Premium Parallax */}
      <section className="cecyte-chef-lugares-section">
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img 
              src="/src/assets/fondos/LugaresVisita.png" 
              alt="Lugares para visitar en La Paz" 
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
              <div className="cecyte-chef-lugares-hero">
                <div className="cecyte-chef-lugares-badge">
                  <span>Turismo</span>
                </div>
                
                <h1 className="cecyte-chef-lugares-title">
                  <span className="cecyte-chef-title-line">¿Qué</span>
                  <span className="cecyte-chef-title-highlight">visitar?</span>
                </h1>
                
                <p className="cecyte-chef-lugares-description">
                  Descubre los lugares más emblemáticos de La Paz, Baja California Sur. 
                  Desde playas paradisíacas hasta sitios históricos y naturales únicos, 
                  La Paz ofrece una experiencia turística incomparable que complementará 
                  tu participación en el concurso culinario.
                </p>
                
                <div className="cecyte-chef-lugares-actions">
                  <button className="cecyte-chef-lugares-button cecyte-chef-btn-primary">
                    <span>Ver lugares</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-geo-alt"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Explora La Paz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información adicional sobre lugares de interés */}
      <section className="cecyte-chef-objetivo-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-objetivo-grid">
            <div className="cecyte-chef-objetivo-content">
              <div className="cecyte-chef-objetivo-header">
                <span className="cecyte-chef-objetivo-label">TURISMO</span>
                <h2 className="cecyte-chef-objetivo-title">
                  Atrativos turísticos de La Paz
                </h2>
              </div>
              
              <p className="cecyte-chef-objetivo-description">
                La Paz es una ciudad llena de atractivos naturales y culturales. 
                Desde el famoso malecón con sus atardeceres espectaculares hasta 
                las playas de arena blanca y aguas cristalinas, cada lugar tiene 
                una historia que contar y una belleza única que admirar.
              </p>
              
              <div className="cecyte-chef-objetivo-buttons">
                <button className="cecyte-chef-btn cecyte-chef-btn-primary">
                  <span>Lugares recomendados</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                </button>
                
                <button className="cecyte-chef-btn cecyte-chef-btn-secondary">
                  <span>Rutas turísticas</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-map"></i>
                  </div>
                </button>
              </div>
            </div>

            {/* Imagen de lugar turístico */}
            <div className="cecyte-chef-chef-image-container">
              <div className="cecyte-chef-chef-circle">
                <img
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
                  alt="La Paz, Baja California Sur"
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

export default QueVisitar;
