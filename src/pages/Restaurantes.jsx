import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";

function Restaurantes({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Restaurantes Section - Premium Parallax */}
      <section className="cecyte-chef-restaurantes-section">
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img 
              src="/src/assets/fondos/restaurante.png" 
              alt="Restaurantes en La Paz" 
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
              <div className="cecyte-chef-restaurantes-hero">
                <div className="cecyte-chef-restaurantes-badge">
                  <span>Gastronomía</span>
                </div>
                
                <h1 className="cecyte-chef-restaurantes-title">
                  <span className="cecyte-chef-title-line">¿Dónde</span>
                  <span className="cecyte-chef-title-highlight">comer?</span>
                </h1>
                
                <p className="cecyte-chef-restaurantes-description">
                  Descubre la rica gastronomía de La Paz, Baja California Sur. 
                  Desde mariscos frescos del Mar de Cortés hasta platillos tradicionales mexicanos, 
                  los restaurantes locales ofrecen una experiencia culinaria única que complementa 
                  perfectamente tu participación en el concurso.
                </p>
                
                <div className="cecyte-chef-restaurantes-actions">
                  <button className="cecyte-chef-restaurantes-button cecyte-chef-btn-primary">
                    <span>Ver restaurantes</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-utensils"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Descubre la gastronomía local</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información adicional sobre restaurantes */}
      <section className="cecyte-chef-objetivo-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-objetivo-grid">
            <div className="cecyte-chef-objetivo-content">
              <div className="cecyte-chef-objetivo-header">
                <span className="cecyte-chef-objetivo-label">RESTAURANTES</span>
                <h2 className="cecyte-chef-objetivo-title">
                  Sabores únicos de Baja California Sur
                </h2>
              </div>
              
              <p className="cecyte-chef-objetivo-description">
                La Paz es famosa por su gastronomía marina y sus sabores únicos. 
                Los restaurantes locales ofrecen desde ceviches frescos y tacos de pescado 
                hasta platillos gourmet con ingredientes locales. Una experiencia culinaria 
                que inspirará tu creatividad en el concurso.
              </p>
              
              <div className="cecyte-chef-objetivo-buttons">
                <button className="cecyte-chef-btn cecyte-chef-btn-primary">
                  <span>Restaurantes recomendados</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-utensils"></i>
                  </div>
                </button>
                
                <button className="cecyte-chef-btn cecyte-chef-btn-secondary">
                  <span>Menús especiales</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-menu-button-wide"></i>
                  </div>
                </button>
              </div>
            </div>

            {/* Imagen de restaurante */}
            <div className="cecyte-chef-chef-image-container">
              <div className="cecyte-chef-chef-circle">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop"
                  alt="Restaurante en La Paz"
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

export default Restaurantes;
