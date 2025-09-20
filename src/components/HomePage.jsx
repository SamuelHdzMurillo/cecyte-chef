import React, { useEffect, useRef } from "react";
import "./HomePage.css";
import Navbar from "./Navbar";
import CountdownTimer from "./CountdownTimer";
import Footer from "./Footer";

function HomePage({ onLoginClick }) {
  const parallaxRef = useRef(null);
  const hotelesParallaxRef = useRef(null);
  const restaurantesParallaxRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Parallax para sección de lugares
      if (parallaxRef.current) {
        const rect = parallaxRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Calcular el progreso de la sección (0 a 1)
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        // Parallax para diferentes capas
        const bgLayer = parallaxRef.current.querySelector('.cecyte-chef-bg-layer-1');
        const overlay = parallaxRef.current.querySelector('.cecyte-chef-parallax-overlay');
        const content = parallaxRef.current.querySelector('.cecyte-chef-parallax-content');
        
        if (bgLayer) {
          const bgSpeed = 0.4;
          const bgY = -(scrolled * bgSpeed);
          bgLayer.style.transform = `translateY(${bgY}px) scale(1.1)`;
        }
        
        if (overlay) {
          const overlaySpeed = 0.2;
          const overlayY = -(scrolled * overlaySpeed);
          overlay.style.transform = `translateY(${overlayY}px)`;
        }
        
        if (content) {
          const contentSpeed = 0.1;
          const contentY = -(scrolled * contentSpeed);
          content.style.transform = `translateY(${contentY}px)`;
          
          // Efecto de fade basado en el progreso
          const opacity = Math.max(0.3, 1 - progress * 0.7);
          content.style.opacity = opacity;
        }
        
        // Efecto de parallax en el scroll indicator
        const scrollIndicator = parallaxRef.current.querySelector('.cecyte-chef-scroll-indicator');
        if (scrollIndicator) {
          const indicatorOpacity = Math.max(0, 1 - progress * 3);
          scrollIndicator.style.opacity = indicatorOpacity;
        }
      }

      // Parallax para sección de hoteles
      if (hotelesParallaxRef.current) {
        const rect = hotelesParallaxRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Calcular el progreso de la sección (0 a 1)
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        // Parallax para diferentes capas
        const bgLayer = hotelesParallaxRef.current.querySelector('.cecyte-chef-bg-layer-1');
        const overlay = hotelesParallaxRef.current.querySelector('.cecyte-chef-parallax-overlay');
        const content = hotelesParallaxRef.current.querySelector('.cecyte-chef-parallax-content');
        
        if (bgLayer) {
          const bgSpeed = 0.4;
          const bgY = -(scrolled * bgSpeed);
          bgLayer.style.transform = `translateY(${bgY}px) scale(1.1)`;
        }
        
        if (overlay) {
          const overlaySpeed = 0.2;
          const overlayY = -(scrolled * overlaySpeed);
          overlay.style.transform = `translateY(${overlayY}px)`;
        }
        
        if (content) {
          const contentSpeed = 0.1;
          const contentY = -(scrolled * contentSpeed);
          content.style.transform = `translateY(${contentY}px)`;
          
          // Efecto de fade basado en el progreso
          const opacity = Math.max(0.3, 1 - progress * 0.7);
          content.style.opacity = opacity;
        }
        
        // Efecto de parallax en el scroll indicator
        const scrollIndicator = hotelesParallaxRef.current.querySelector('.cecyte-chef-scroll-indicator');
        if (scrollIndicator) {
          const indicatorOpacity = Math.max(0, 1 - progress * 3);
          scrollIndicator.style.opacity = indicatorOpacity;
        }
      }

      // Parallax para sección de restaurantes
      if (restaurantesParallaxRef.current) {
        const rect = restaurantesParallaxRef.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Calcular el progreso de la sección (0 a 1)
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
        
        // Parallax para diferentes capas
        const bgLayer = restaurantesParallaxRef.current.querySelector('.cecyte-chef-bg-layer-1');
        const overlay = restaurantesParallaxRef.current.querySelector('.cecyte-chef-parallax-overlay');
        const content = restaurantesParallaxRef.current.querySelector('.cecyte-chef-parallax-content');
        
        if (bgLayer) {
          const bgSpeed = 0.4;
          const bgY = -(scrolled * bgSpeed);
          bgLayer.style.transform = `translateY(${bgY}px) scale(1.1)`;
        }
        
        if (overlay) {
          const overlaySpeed = 0.2;
          const overlayY = -(scrolled * overlaySpeed);
          overlay.style.transform = `translateY(${overlayY}px)`;
        }
        
        if (content) {
          const contentSpeed = 0.1;
          const contentY = -(scrolled * contentSpeed);
          content.style.transform = `translateY(${contentY}px)`;
          
          // Efecto de fade basado en el progreso
          const opacity = Math.max(0.3, 1 - progress * 0.7);
          content.style.opacity = opacity;
        }
        
        // Efecto de parallax en el scroll indicator
        const scrollIndicator = restaurantesParallaxRef.current.querySelector('.cecyte-chef-scroll-indicator');
        if (scrollIndicator) {
          const indicatorOpacity = Math.max(0, 1 - progress * 3);
          scrollIndicator.style.opacity = indicatorOpacity;
        }
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const optimizedScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', optimizedScroll, { passive: true });
    return () => window.removeEventListener('scroll', optimizedScroll);
  }, []);

  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* Hero Section */}
      <section id="inicio" className="cecyte-chef-hero-section">
        <div className="cecyte-chef-hero-background">
          <div className="cecyte-chef-hero-pattern"></div>
          <div className="cecyte-chef-paper-texture"></div>
          
          {/* SVGs decorativos */}
          <div className="cecyte-chef-svg-decorations">
            <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo" className="cecyte-chef-svg-decoration cecyte-chef-svg-cuchillo" />
            <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara" className="cecyte-chef-svg-decoration cecyte-chef-svg-cuchara" />
            <img src="/src/assets/svg/SARTEN.png" alt="Sartén" className="cecyte-chef-svg-decoration cecyte-chef-svg-sarten" />
            <img src="/src/assets/svg/PILON.png" alt="Pilón" className="cecyte-chef-svg-decoration cecyte-chef-svg-pilon" />
            <img src="/src/assets/svg/CAMARON.png" alt="Camarón" className="cecyte-chef-svg-decoration cecyte-chef-svg-camaron" />
            <img src="/src/assets/svg/CHILE.png" alt="Chile" className="cecyte-chef-svg-decoration cecyte-chef-svg-chile" />
            <img src="/src/assets/svg/PITAHAYA.png" alt="Pitahaya" className="cecyte-chef-svg-decoration cecyte-chef-svg-pitahaya" />
            <img src="/src/assets/svg/PEZ.png" alt="Pez" className="cecyte-chef-svg-decoration cecyte-chef-svg-pez" />
            
            {/* SVGs adicionales */}
            <img src="/src/assets/svg/CUBIERTOS.png" alt="Cubiertos" className="cecyte-chef-svg-decoration cecyte-chef-svg-cubiertos" />
            <img src="/src/assets/svg/HACHA.png" alt="Hacha" className="cecyte-chef-svg-decoration cecyte-chef-svg-hacha" />
            <img src="/src/assets/svg/LANGOSTA.png" alt="Langosta" className="cecyte-chef-svg-decoration cecyte-chef-svg-langosta" />
            <img src="/src/assets/svg/PALMERA.png" alt="Palmera" className="cecyte-chef-svg-decoration cecyte-chef-svg-palmera" />
            <img src="/src/assets/svg/DORADO.png" alt="Dorado" className="cecyte-chef-svg-decoration cecyte-chef-svg-dorado" />
            <img src="/src/assets/svg/EL ARCO.png" alt="El Arco" className="cecyte-chef-svg-decoration cecyte-chef-svg-arco" />
            <img src="/src/assets/svg/BALLENA.png" alt="Ballena" className="cecyte-chef-svg-decoration cecyte-chef-svg-ballena" />
            <img src="/src/assets/svg/BALANDRA.png" alt="Balandra" className="cecyte-chef-svg-decoration cecyte-chef-svg-balandra" />
            
            {/* SVGs extra (5% más) */}
            <img src="/src/assets/svg/TRIANGULOS.png" alt="Triángulos" className="cecyte-chef-svg-decoration cecyte-chef-svg-triangulos" />
            <img src="/src/assets/svg/RUPESTRES.png" alt="Rupestres" className="cecyte-chef-svg-decoration cecyte-chef-svg-rupestres" />
            <img src="/src/assets/svg/COLA DE LA BALLENA.png" alt="Cola de la Ballena" className="cecyte-chef-svg-decoration cecyte-chef-svg-cola-ballena" />
            
            {/* SVGs adicionales (5% más) para llenar espacios */}
            <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-cuchillo-2" />
            <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-cuchara-2" />
            <img src="/src/assets/svg/SARTEN.png" alt="Sartén 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-sarten-2" />
            <img src="/src/assets/svg/PILON.png" alt="Pilón 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-pilon-2" />
            <img src="/src/assets/svg/CAMARON.png" alt="Camarón 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-camaron-2" />
            <img src="/src/assets/svg/CHILE.png" alt="Chile 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-chile-2" />
            <img src="/src/assets/svg/PITAHAYA.png" alt="Pitahaya 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-pitahaya-2" />
            <img src="/src/assets/svg/PEZ.png" alt="Pez 2" className="cecyte-chef-svg-decoration cecyte-chef-svg-pez-2" />
          </div>
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
                <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo" className="cecyte-chef-decorative-element cecyte-chef-element-1" />
                <img src="/src/assets/svg/SARTEN.png" alt="Sartén" className="cecyte-chef-decorative-element cecyte-chef-element-2" />
                <img src="/src/assets/svg/CAMARON.png" alt="Camarón" className="cecyte-chef-decorative-element cecyte-chef-element-3" />
                <img src="/src/assets/svg/CHILE.png" alt="Chile" className="cecyte-chef-decorative-element cecyte-chef-element-4" />
                <img src="/src/assets/svg/PITAHAYA.png" alt="Pitahaya" className="cecyte-chef-decorative-element cecyte-chef-element-5" />
                <img src="/src/assets/svg/PEZ.png" alt="Pez" className="cecyte-chef-decorative-element cecyte-chef-element-6" />
                <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara" className="cecyte-chef-decorative-element cecyte-chef-element-7" />
                <img src="/src/assets/svg/PILON.png" alt="Pilón" className="cecyte-chef-decorative-element cecyte-chef-element-8" />
              </div>
            </div>

            {/* Contenido de texto */}
            <div className="cecyte-chef-objetivo-content">
              <div className="cecyte-chef-objetivo-header">
                <span className="cecyte-chef-objetivo-label">OBJETIVO</span>
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
                <button className="cecyte-chef-objetivo-button">
                  <span>VER CONVOCATORIA</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
                <button className="cecyte-chef-objetivo-button">
                  <span>VER EVALUACIÓN</span>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider 1 - Objetivo to Jueces */}
      <div className="cecyte-chef-divider cecyte-chef-divider-svg">
        <div className="cecyte-chef-divider-content">
          <div className="cecyte-chef-divider-svg-elements">
            <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/SARTEN.png" alt="Sartén" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/CAMARON.png" alt="Camarón" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/CHILE.png" alt="Chile" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/PITAHAYA.png" alt="Pitahaya" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/PEZ.png" alt="Pez" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara" className="cecyte-chef-divider-svg-item" />
            <img src="/src/assets/svg/PILON.png" alt="Pilón" className="cecyte-chef-divider-svg-item" />
          </div>
        </div>
      </div>

      {/* Jueces Section */}
      <section className="cecyte-chef-jueces-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-jueces-header">
            <span className="cecyte-chef-jueces-label">CONOCE A TUS JUECES</span>
            <h2 className="cecyte-chef-jueces-title">
              Expertos culinarios que evaluarán tu talento
            </h2>
            <p className="cecyte-chef-jueces-subtitle">
              Nuestros jueces son reconocidos profesionales de la gastronomía con años de experiencia
            </p>
          </div>

          <div className="cecyte-chef-jueces-grid">
            {/* Juez 1 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image-container">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Chef María González"
                  className="cecyte-chef-juez-image"
                />
                <div className="cecyte-chef-juez-overlay">
                  <div className="cecyte-chef-juez-quote">
                    "La creatividad y la técnica deben ir de la mano para crear platillos excepcionales"
                  </div>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef María González</h3>
                <p className="cecyte-chef-juez-title">Chef Ejecutiva - Hotel Marriott</p>
                <p className="cecyte-chef-juez-description">
                  Con más de 15 años de experiencia en cocina internacional, especialista en 
                  gastronomía mediterránea y fusion cuisine. Graduada del Instituto Culinario de México.
                </p>
                <div className="cecyte-chef-juez-experience">
                  <span className="cecyte-chef-juez-years">15+ años</span>
                  <span className="cecyte-chef-juez-specialty">Cocina Internacional</span>
                </div>
              </div>
            </div>

            {/* Juez 2 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image-container">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Chef Carlos Mendoza"
                  className="cecyte-chef-juez-image"
                />
                <div className="cecyte-chef-juez-overlay">
                  <div className="cecyte-chef-juez-quote">
                    "La pasión por los ingredientes locales es la base de una cocina auténtica"
                  </div>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef Carlos Mendoza</h3>
                <p className="cecyte-chef-juez-title">Propietario - Restaurante El Sabor</p>
                <p className="cecyte-chef-juez-description">
                  Chef especializado en cocina tradicional mexicana y técnicas ancestrales. 
                  Reconocido por su trabajo con ingredientes locales y sostenibilidad culinaria.
                </p>
                <div className="cecyte-chef-juez-experience">
                  <span className="cecyte-chef-juez-years">12+ años</span>
                  <span className="cecyte-chef-juez-specialty">Cocina Tradicional</span>
                </div>
              </div>
            </div>

            {/* Juez 3 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-image-container">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Chef Ana Rodríguez"
                  className="cecyte-chef-juez-image"
                />
                <div className="cecyte-chef-juez-overlay">
                  <div className="cecyte-chef-juez-quote">
                    "La presentación es tan importante como el sabor para crear una experiencia memorable"
                  </div>
                </div>
              </div>
              <div className="cecyte-chef-juez-info">
                <h3 className="cecyte-chef-juez-name">Chef Ana Rodríguez</h3>
                <p className="cecyte-chef-juez-title">Instructora - CECYTE Culinary</p>
                <p className="cecyte-chef-juez-description">
                  Especialista en pastelería y repostería artística. Con formación en Francia, 
                  combina técnicas clásicas con innovación moderna en la presentación de platillos.
                </p>
                <div className="cecyte-chef-juez-experience">
                  <span className="cecyte-chef-juez-years">10+ años</span>
                  <span className="cecyte-chef-juez-specialty">Pastelería Artística</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Lugares de Interés Section - Premium Parallax */}
      <section className="cecyte-chef-lugares-section" ref={parallaxRef}>
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img 
              src="/src/assets/fondos/LugaresVisita.png" 
              alt="Lugares de interés en La Paz" 
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
                  <span>Descubre</span>
                </div>
                
                <h1 className="cecyte-chef-lugares-title">
                  <span className="cecyte-chef-title-line">¿Qué visitar en</span>
                  <span className="cecyte-chef-title-highlight">La Paz?</span>
                </h1>
                
                <p className="cecyte-chef-lugares-description">
                  Sumérgete en la belleza natural de Baja California Sur. 
                  Desde playas cristalinas hasta sitios históricos únicos, 
                  La Paz te ofrece una experiencia que combina aventura, 
                  cultura y gastronomía auténtica.
                </p>
                
                <div className="cecyte-chef-lugares-actions">
                  <button className="cecyte-chef-lugares-button cecyte-chef-btn-primary">
                    <span>Explorar lugares</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </button>
                  
                  <button className="cecyte-chef-lugares-button cecyte-chef-btn-secondary">
                    <span>Ver galería</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-images"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Desplázate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Hoteles Section - Premium Parallax */}
      <section className="cecyte-chef-hoteles-section" ref={hotelesParallaxRef}>
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
                  
                  <button className="cecyte-chef-hoteles-button cecyte-chef-btn-secondary">
                    <span>Reservar ahora</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Desplázate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurantes Section - Premium Parallax */}
      <section className="cecyte-chef-restaurantes-section" ref={restaurantesParallaxRef}>
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img 
              src="/src/assets/fondos/restaurante.png" 
              alt="Restaurantes y gastronomía en La Paz" 
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
                  Saborea la auténtica cocina de La Paz, Baja California Sur. 
                  Desde elegantes restaurantes con vista al mar hasta acogedores 
                  locales tradicionales, descubre una experiencia gastronómica 
                  única que combina ingredientes frescos del mar con sabores locales.
                </p>
                
                <div className="cecyte-chef-restaurantes-actions">
                  <button className="cecyte-chef-restaurantes-button cecyte-chef-btn-primary">
                    <span>Ver restaurantes</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-utensils"></i>
                    </div>
                  </button>
                  
                  <button className="cecyte-chef-restaurantes-button cecyte-chef-btn-secondary">
                    <span>Menú del día</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-menu-button-wide"></i>
                    </div>
                  </button>
                </div>
                
                {/* Scroll indicator */}
                <div className="cecyte-chef-scroll-indicator">
                  <div className="cecyte-chef-scroll-line"></div>
                  <span>Desplázate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Timer Section */}
      <CountdownTimer />

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
      <Footer />
    </div>
  );
}

export default HomePage;
