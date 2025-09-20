import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CountdownTimer from "../components/CountdownTimer";
import "../components/HomePage.css";

function Inicio({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Hero Section - Clean & Modern Design */}
      <section id="inicio" className="cecyte-chef-hero-section">
        {/* Clean Background */}
        <div className="cecyte-chef-hero-background">
          <div className="cecyte-chef-hero-pattern"></div>
          
          {/* Minimalist Icons */}
          <div className="cecyte-chef-minimal-icons">
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-1">
              <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-2">
              <img src="/src/assets/svg/SARTEN.png" alt="Sartén" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-3">
              <img src="/src/assets/svg/CAMARON.png" alt="Camarón" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-4">
              <img src="/src/assets/svg/CHILE.png" alt="Chile" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-5">
              <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-6">
              <img src="/src/assets/svg/PILON.png" alt="Pilón" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-7">
              <img src="/src/assets/svg/PITAHAYA.png" alt="Pitahaya" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-8">
              <img src="/src/assets/svg/PEZ.png" alt="Pez" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-9">
              <img src="/src/assets/svg/LANGOSTA.png" alt="Langosta" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-10">
              <img src="/src/assets/svg/CUBIERTOS.png" alt="Cubiertos" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-11">
              <img src="/src/assets/svg/DORADO.png" alt="Dorado" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-12">
              <img src="/src/assets/svg/HACHA.png" alt="Hacha" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-13">
              <img src="/src/assets/svg/PALMERA.png" alt="Palmera" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-14">
              <img src="/src/assets/svg/BALLENA.png" alt="Ballena" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-15">
              <img src="/src/assets/svg/BALANDRA.png" alt="Balandra" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-16">
              <img src="/src/assets/svg/EL ARCO.png" alt="El Arco" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-17">
              <img src="/src/assets/svg/RUPESTRES.png" alt="Rupestres" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-18">
              <img src="/src/assets/svg/TRIANGULOS.png" alt="Triángulos" />
            </div>
            <div className="cecyte-chef-minimal-icon cecyte-chef-minimal-19">
              <img src="/src/assets/svg/COLA DE LA BALLENA.png" alt="Cola de la Ballena" />
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="cecyte-chef-hero-content">
          <div className="cecyte-chef-container">
            <div className="cecyte-chef-hero-grid">
              {/* Logo y título principal */}
              <div className="cecyte-chef-hero-main">
                <div className="cecyte-chef-logo-container">
                  <img 
                    src="/src/assets/cecyte_chef_sin_fondo_horizontal.png" 
                    alt="CECYTE Chef Logo" 
                    className="cecyte-chef-logo"
                  />
                </div>
                
                <h1 className="cecyte-chef-hero-title">
                  <span className="cecyte-chef-title-line">Concurso</span>
                  <span className="cecyte-chef-title-highlight">CECYTE Chef</span>
                  <span className="cecyte-chef-title-line">2024</span>
                </h1>
                
                <p className="cecyte-chef-hero-subtitle">
                  La Paz, Baja California Sur
                </p>
                
                <div className="cecyte-chef-hero-description">
                  <p>
                    Demuestra tu creatividad culinaria en el concurso más importante 
                    de gastronomía estudiantil de Baja California Sur. 
                    <strong> ¡Tu talento en la cocina te llevará a la victoria!</strong>
                  </p>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="cecyte-chef-hero-countdown">
                <CountdownTimer />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="cecyte-chef-scroll-indicator">
          <div className="cecyte-chef-scroll-line"></div>
          <span>Desplázate para descubrir</span>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Inicio;
