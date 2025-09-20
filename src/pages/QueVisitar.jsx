import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LugarInteresCard from "../components/LugarInteresCard";
import lugaresInteresService from "../services/lugaresInteresService";
import "../components/HomePage.css";
import "../components/LugarInteresCard.css";

function QueVisitar({ onLoginClick }) {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Iniciando petición a lugares de interés...');
        const response = await lugaresInteresService.getLugaresInteres();
        console.log('Respuesta recibida:', response);
        
        // Intentar diferentes estructuras de respuesta
        let lugaresData = [];
        if (Array.isArray(response)) {
          lugaresData = response;
        } else if (response.data && Array.isArray(response.data)) {
          lugaresData = response.data;
        } else if (response.lugares && Array.isArray(response.lugares)) {
          lugaresData = response.lugares;
        }
        
        setLugares(lugaresData);
        console.log('Lugares establecidos:', lugaresData);
      } catch (err) {
        console.error('Error al cargar lugares de interés:', err);
        setError('Error al cargar los lugares de interés. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, []);

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

      {/* Sección de tarjetas de lugares de interés */}
      <section className="cecyte-chef-lugares-cards-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-lugares-header">
            
            <h2 className="cecyte-chef-lugares-title">
              Lugares de <span className="cecyte-chef-title-highlight">interés</span>
            </h2>
            <p className="cecyte-chef-lugares-description">
              Descubre los atractivos turísticos más importantes de La Paz, Baja California Sur
            </p>
          </div>

          {/* Estados de carga y error */}
          {loading && (
            <div className="cecyte-chef-loading">
              <div className="cecyte-chef-spinner"></div>
              <p>Cargando lugares de interés...</p>
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

          {/* Grid de tarjetas de lugares de interés */}
          {!loading && !error && lugares.length > 0 && (
            <div className="cecyte-chef-lugares-grid">
              {console.log('Renderizando lugares:', lugares)}
              {lugares.map((lugar) => (
                <LugarInteresCard key={lugar.id} lugar={lugar} />
              ))}
            </div>
          )}

          

          {!loading && !error && lugares.length === 0 && (
            <div className="cecyte-chef-empty">
              <i className="bi bi-geo-alt"></i>
              <p>No hay lugares de interés disponibles en este momento</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default QueVisitar;
