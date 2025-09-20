import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";
import {
  CUCHILLO,
  SARTEN,
  CAMARON,
  CHILE,
  CUCHARA,
  PILON,
  PITAHAYA,
  PEZ
} from "../assets/images";

function Programa({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Objetivo Section */}
      <section className="cecyte-chef-objetivo-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-objetivo-grid">
            {/* Imagen central del chef */}
            <div className="cecyte-chef-chef-image-container">
              <div className="cecyte-chef-chef-circle">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Chef CECYTE preparando platillos"
                  className="cecyte-chef-chef-image"
                />
              </div>
              
              {/* Elementos decorativos alrededor del chef */}
              <div className="cecyte-chef-decorative-elements">
                <img src={CUCHILLO} alt="Cuchillo" className="cecyte-chef-decorative-element cecyte-chef-element-1" />
                <img src={SARTEN} alt="Sartén" className="cecyte-chef-decorative-element cecyte-chef-element-2" />
                <img src={CAMARON} alt="Camarón" className="cecyte-chef-decorative-element cecyte-chef-element-3" />
                <img src={CHILE} alt="Chile" className="cecyte-chef-decorative-element cecyte-chef-element-4" />
                <img src={PITAHAYA} alt="Pitahaya" className="cecyte-chef-decorative-element cecyte-chef-element-5" />
                <img src={PEZ} alt="Pez" className="cecyte-chef-decorative-element cecyte-chef-element-6" />
                <img src={CUCHARA} alt="Cuchara" className="cecyte-chef-decorative-element cecyte-chef-element-7" />
                <img src={PILON} alt="Pilón" className="cecyte-chef-decorative-element cecyte-chef-element-8" />
              </div>
            </div>

            {/* Contenido de texto */}
            <div className="cecyte-chef-objetivo-content">
              <div className="cecyte-chef-objetivo-header">
                <span className="cecyte-chef-objetivo-label">PROGRAMA</span>
                <h2 className="cecyte-chef-objetivo-title">
                  Sobre el concurso y participación
                </h2>
              </div>
              
              <p className="cecyte-chef-objetivo-description">
                El CECYTE Chef tiene como finalidad demostrar la creatividad, originalidad y conocimiento 
                de los estudiantes de la carrera de Técnico en Servicios de Hotelería y carreras afines, 
                en el manejo de sus competencias para la elaboración de platillos y preparación de bebidas.
              </p>
              
              <div className="cecyte-chef-objetivo-buttons">
                <button className="cecyte-chef-btn cecyte-chef-btn-primary">
                  <span>Ver programa completo</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-calendar-event"></i>
                  </div>
                </button>
                
                <button className="cecyte-chef-btn cecyte-chef-btn-secondary">
                  <span>Reglamento</span>
                  <div className="cecyte-chef-btn-icon">
                    <i className="bi bi-file-text"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jueces Section */}
      <section className="cecyte-chef-jueces-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-jueces-header">
            <span className="cecyte-chef-jueces-label">JURADO</span>
            <h2 className="cecyte-chef-jueces-title">
              Conoce a nuestros <span className="cecyte-chef-title-highlight">jueces expertos</span>
            </h2>
            <p className="cecyte-chef-jueces-description">
              Un panel de reconocidos chefs y expertos en gastronomía evaluará 
              cada platillo con criterios profesionales y experiencia culinaria.
            </p>
          </div>

          <div className="cecyte-chef-jueces-grid">
            {/* Juez 1 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" 
                  alt="Chef Principal" 
                />
                <div className="cecyte-chef-juez-badge">
                  <i className="bi bi-award"></i>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef Principal</h3>
                <p className="cecyte-chef-juez-title">Juez Principal</p>
                <p className="cecyte-chef-juez-description">
                  Experto en gastronomía regional con más de 15 años de experiencia.
                </p>
              </div>
            </div>

            {/* Juez 2 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" 
                  alt="Chef Especialista" 
                />
                <div className="cecyte-chef-juez-badge">
                  <i className="bi bi-star"></i>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef Especialista</h3>
                <p className="cecyte-chef-juez-title">Juez Especialista</p>
                <p className="cecyte-chef-juez-description">
                  Especialista en técnicas culinarias modernas y presentación.
                </p>
              </div>
            </div>

            {/* Juez 3 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face" 
                  alt="Chef Evaluadora" 
                />
                <div className="cecyte-chef-juez-badge">
                  <i className="bi bi-trophy"></i>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef Evaluadora</h3>
                <p className="cecyte-chef-juez-title">Juez Evaluadora</p>
                <p className="cecyte-chef-juez-description">
                  Experta en evaluación de competencias culinarias estudiantiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Programa;
