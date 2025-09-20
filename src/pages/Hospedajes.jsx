import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HospedajeCard from "../components/HospedajeCard";
import hospedajesService from "../services/hospedajesService";
import "../components/HomePage.css";
import "../components/HospedajeCard.css";

function Hospedajes({ onLoginClick }) {
  const [hospedajes, setHospedajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHospedajes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hospedajesService.getHospedajes();
        console.log('Respuesta hospedajes:', response);
        
        // Intentar diferentes estructuras de respuesta
        let hospedajesData = [];
        if (Array.isArray(response)) {
          hospedajesData = response;
        } else if (response.data && Array.isArray(response.data)) {
          hospedajesData = response.data;
        } else if (response.hospedajes && Array.isArray(response.hospedajes)) {
          hospedajesData = response.hospedajes;
        }
        
        setHospedajes(hospedajesData);
      } catch (err) {
        console.error('Error al cargar hospedajes:', err);
        setError('Error al cargar los hospedajes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospedajes();
  }, []);

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

      {/* Sección de tarjetas de hospedajes */}
      <section className="cecyte-chef-hospedajes-cards-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-hospedajes-header">
            
            <h2 className="cecyte-chef-hospedajes-title">
              Opciones de <span className="cecyte-chef-title-highlight">Hospedajes</span>
            </h2>
            <p className="cecyte-chef-hospedajes-description">
              Descubre los mejores hoteles y hospedajes disponibles en La Paz, Baja California Sur
            </p>
          </div>

          {/* Estados de carga y error */}
          {loading && (
            <div className="cecyte-chef-loading">
              <div className="cecyte-chef-spinner"></div>
              <p>Cargando hospedajes...</p>
            </div>
          )}

          {error && (
            <div className="cecyte-chef-error">
              <i className="bi bi-exclamation-triangle"></i>
              <p>{error}</p>
              <button 
                className="cecyte-chef-btn cecyte-chef-btn-primary"
                onClick={() => window.location.reload()}
              >
                <span>Reintentar</span>
                <div className="cecyte-chef-btn-icon">
                  <i className="bi bi-arrow-clockwise"></i>
                </div>
              </button>
            </div>
          )}

          {/* Grid de tarjetas de hospedajes */}
          {!loading && !error && hospedajes.length > 0 && (
            <div className="cecyte-chef-hospedajes-grid">
              {hospedajes.map((hospedaje) => (
                <HospedajeCard key={hospedaje.id} hospedaje={hospedaje} />
              ))}
            </div>
          )}

          {!loading && !error && hospedajes.length === 0 && (
            <div className="cecyte-chef-empty">
              <i className="bi bi-building"></i>
              <p>No hay hospedajes disponibles en este momento</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Hospedajes;
