import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import Navbar from "./Navbar";
import CountdownTimer from "./CountdownTimer";
import Footer from "./Footer";
import {
  CUCHILLO,
  SARTEN,
  CAMARON,
  CHILE,
  CUCHARA,
  PILON,
  PITAHAYA,
  PEZ,
  LANGOSTA,
  CUBIERTOS,
  DORADO,
  HACHA,
  PALMERA,
  BALLENA,
  BALANDRA,
  EL_ARCO,
  RUPESTRES,
  TRIANGULOS,
  COLA_DE_LA_BALLENA,
  CECYTE_CHEF_SIN_FONDO_HORIZONTAL,
  PLATILLO_SALMON,
  PLATILLO_CAMARON,
  PLATILLO_NARANJA,
  PLATILLO_NARANJON,
  LUGARES_VISITA,
  HOTELES,
  RESTAURANTE,
} from "../assets/images";

function HomePage({ onLoginClick }) {
  const navigate = useNavigate();
  const parallaxRef = useRef(null);
  const hotelesParallaxRef = useRef(null);
  const restaurantesParallaxRef = useRef(null);

  // Funciones de navegación
  const handleNavigateToPrograma = () => {
    navigate("/programa");
  };

  const handleNavigateToQueVisitar = () => {
    navigate("/que-visitar");
  };

  const handleNavigateToHospedajes = () => {
    navigate("/hospedajes");
  };

  const handleNavigateToRestaurantes = () => {
    navigate("/restaurantes");
  };

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
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + sectionHeight)
          )
        );

        // Parallax para diferentes capas
        const bgLayer = parallaxRef.current.querySelector(
          ".cecyte-chef-bg-layer-1"
        );
        const overlay = parallaxRef.current.querySelector(
          ".cecyte-chef-parallax-overlay"
        );
        const content = parallaxRef.current.querySelector(
          ".cecyte-chef-parallax-content"
        );

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
        const scrollIndicator = parallaxRef.current.querySelector(
          ".cecyte-chef-scroll-indicator"
        );
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
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + sectionHeight)
          )
        );

        // Parallax para diferentes capas
        const bgLayer = hotelesParallaxRef.current.querySelector(
          ".cecyte-chef-bg-layer-1"
        );
        const overlay = hotelesParallaxRef.current.querySelector(
          ".cecyte-chef-parallax-overlay"
        );
        const content = hotelesParallaxRef.current.querySelector(
          ".cecyte-chef-parallax-content"
        );

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
        const scrollIndicator = hotelesParallaxRef.current.querySelector(
          ".cecyte-chef-scroll-indicator"
        );
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
        const progress = Math.max(
          0,
          Math.min(
            1,
            (windowHeight - sectionTop) / (windowHeight + sectionHeight)
          )
        );

        // Parallax para diferentes capas
        const bgLayer = restaurantesParallaxRef.current.querySelector(
          ".cecyte-chef-bg-layer-1"
        );
        const overlay = restaurantesParallaxRef.current.querySelector(
          ".cecyte-chef-parallax-overlay"
        );
        const content = restaurantesParallaxRef.current.querySelector(
          ".cecyte-chef-parallax-content"
        );

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
        const scrollIndicator = restaurantesParallaxRef.current.querySelector(
          ".cecyte-chef-scroll-indicator"
        );
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

    window.addEventListener("scroll", optimizedScroll, { passive: true });
    return () => window.removeEventListener("scroll", optimizedScroll);
  }, []);

  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />

      {/* Global Background SVGs */}
      <div className="cecyte-chef-global-background">
        <div className="cecyte-chef-global-svgs">
          {Array.from({ length: 150 }, (_, index) => {
            const svgOptions = [
              CUCHILLO,
              SARTEN,
              CAMARON,
              CHILE,
              CUCHARA,
              PILON,
              PITAHAYA,
              PEZ,
              LANGOSTA,
              CUBIERTOS,
              DORADO,
              HACHA,
              PALMERA,
              BALLENA,
              BALANDRA,
              EL_ARCO,
              RUPESTRES,
              TRIANGULOS,
              COLA_DE_LA_BALLENA,
            ];
            const randomSvg = svgOptions[index % svgOptions.length];
            const altText = [
              "Cuchillo",
              "Sartén",
              "Camarón",
              "Chile",
              "Cuchara",
              "Pilón",
              "Pitahaya",
              "Pez",
              "Langosta",
              "Cubiertos",
              "Dorado",
              "Hacha",
              "Palmera",
              "Ballena",
              "Balandra",
              "El Arco",
              "Rupestres",
              "Triángulos",
              "Cola de la Ballena",
            ][index % svgOptions.length];

            return (
              <img
                key={index}
                src={randomSvg}
                alt={altText}
                className={`cecyte-chef-global-svg-item cecyte-chef-global-svg-${
                  index + 1
                }`}
                style={{
                  position: "absolute",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${
                    0.3 + Math.random() * 0.4
                  })`,
                  animationDelay: `${Math.random() * 30}s`,
                  animationDuration: `${20 + Math.random() * 15}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Hero Section - SVG Background Design */}
      <section id="inicio" className="cecyte-chef-hero-section">
        {/* SVG Background Pattern - Dense Design */}
        <div className="cecyte-chef-hero-background">
          <div className="cecyte-chef-svg-pattern">
            {/* Generate 200+ SVG elements */}
            {Array.from({ length: 200 }, (_, index) => {
              const svgOptions = [
                CUCHILLO,
                SARTEN,
                CAMARON,
                CHILE,
                CUCHARA,
                PILON,
                PITAHAYA,
                PEZ,
                LANGOSTA,
                CUBIERTOS,
                DORADO,
                HACHA,
                PALMERA,
                BALLENA,
                BALANDRA,
                EL_ARCO,
                RUPESTRES,
                TRIANGULOS,
                COLA_DE_LA_BALLENA,
              ];
              const randomSvg = svgOptions[index % svgOptions.length];
              const altText = [
                "Cuchillo",
                "Sartén",
                "Camarón",
                "Chile",
                "Cuchara",
                "Pilón",
                "Pitahaya",
                "Pez",
                "Langosta",
                "Cubiertos",
                "Dorado",
                "Hacha",
                "Palmera",
                "Ballena",
                "Balandra",
                "El Arco",
                "Rupestres",
                "Triángulos",
                "Cola de la Ballena",
              ][index % svgOptions.length];

              return (
                <img
                  key={index}
                  src={randomSvg}
                  alt={altText}
                  className={`cecyte-chef-svg-item cecyte-chef-svg-${
                    index + 1
                  }`}
                  style={{
                    position: "absolute",
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg) scale(${
                      0.5 + Math.random() * 0.5
                    })`,
                    animationDelay: `${Math.random() * 20}s`,
                    animationDuration: `${15 + Math.random() * 10}s`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <div className="cecyte-chef-container">
          <div className="cecyte-chef-hero-content">
            {/* Logo Container */}
            <div className="cecyte-chef-logo-section">
              <img
                src={CECYTE_CHEF_SIN_FONDO_HORIZONTAL}
                alt="CECYTE CHEF Baja California Sur"
                className="cecyte-chef-main-logo"
              />
            </div>

            {/* Description */}
            <p className="cecyte-chef-hero-description">
              Únete al concurso más prestigioso de gastronomía estudiantil.
              Compite con los mejores chefs del país y vive una experiencia
              única en Baja California Sur.
            </p>

            {/* Action Buttons */}
            <div className="cecyte-chef-hero-actions">
              <button
                className="cecyte-chef-btn cecyte-chef-btn-primary"
                onClick={onLoginClick}
              >
                <span>Participar Ahora</span>
                <i className="bi bi-arrow-right"></i>
              </button>
              <button
                className="cecyte-chef-btn cecyte-chef-btn-secondary"
                onClick={handleNavigateToPrograma}
              >
                <span>Ver Programa</span>
                <i className="bi bi-calendar-event"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Separador 1 - Hero to Objetivo */}
      <div className="cecyte-chef-section-separator">
        <div className="cecyte-chef-separator-line"></div>
        <div className="cecyte-chef-separator-svgs">
          <img
            src={CUCHILLO}
            alt="Cuchillo"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={SARTEN}
            alt="Sartén"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={CAMARON}
            alt="Camarón"
            className="cecyte-chef-separator-svg"
          />
          <img src={CHILE} alt="Chile" className="cecyte-chef-separator-svg" />
          <img
            src={CUCHARA}
            alt="Cuchara"
            className="cecyte-chef-separator-svg"
          />
        </div>
        <div className="cecyte-chef-separator-line"></div>
      </div>

      {/* Objetivo Section */}
      <section className="cecyte-chef-objetivo-section">
        {/* Background SVGs for Objetivo Section */}
        <div className="cecyte-chef-objetivo-background">
          <div className="cecyte-chef-objetivo-svgs">
            {Array.from({ length: 30 }, (_, index) => {
              const svgOptions = [
                CUCHILLO,
                SARTEN,
                CAMARON,
                CHILE,
                CUCHARA,
                PILON,
                PITAHAYA,
                PEZ,
                LANGOSTA,
                CUBIERTOS,
                DORADO,
                HACHA,
                PALMERA,
                BALLENA,
                BALANDRA,
                EL_ARCO,
                RUPESTRES,
                TRIANGULOS,
                COLA_DE_LA_BALLENA,
              ];
              const randomSvg = svgOptions[index % svgOptions.length];
              const altText = [
                "Cuchillo",
                "Sartén",
                "Camarón",
                "Chile",
                "Cuchara",
                "Pilón",
                "Pitahaya",
                "Pez",
                "Langosta",
                "Cubiertos",
                "Dorado",
                "Hacha",
                "Palmera",
                "Ballena",
                "Balandra",
                "El Arco",
                "Rupestres",
                "Triángulos",
                "Cola de la Ballena",
              ][index % svgOptions.length];

              return (
                <img
                  key={index}
                  src={randomSvg}
                  alt={altText}
                  className={`cecyte-chef-objetivo-svg-item cecyte-chef-objetivo-svg-${
                    index + 1
                  }`}
                  style={{
                    position: "absolute",
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg) scale(${
                      0.4 + Math.random() * 0.4
                    })`,
                    animationDelay: `${Math.random() * 20}s`,
                    animationDuration: `${15 + Math.random() * 10}s`,
                  }}
                />
              );
            })}
          </div>
        </div>

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
                <img
                  src={CUCHILLO}
                  alt="Cuchillo"
                  className="cecyte-chef-decorative-element cecyte-chef-element-1"
                />
                <img
                  src={SARTEN}
                  alt="Sartén"
                  className="cecyte-chef-decorative-element cecyte-chef-element-2"
                />
                <img
                  src={CAMARON}
                  alt="Camarón"
                  className="cecyte-chef-decorative-element cecyte-chef-element-3"
                />
                <img
                  src={CHILE}
                  alt="Chile"
                  className="cecyte-chef-decorative-element cecyte-chef-element-4"
                />
                <img
                  src={PITAHAYA}
                  alt="Pitahaya"
                  className="cecyte-chef-decorative-element cecyte-chef-element-5"
                />
                <img
                  src={PEZ}
                  alt="Pez"
                  className="cecyte-chef-decorative-element cecyte-chef-element-6"
                />
                <img
                  src={CUCHARA}
                  alt="Cuchara"
                  className="cecyte-chef-decorative-element cecyte-chef-element-7"
                />
                <img
                  src={PILON}
                  alt="Pilón"
                  className="cecyte-chef-decorative-element cecyte-chef-element-8"
                />
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
                El CECYTE Chef tiene como finalidad demostrar la creatividad,
                originalidad y conocimiento de los estudiantes de la carrera de
                Técnico en Servicios de Hotelería y carreras afines, en el
                manejo de sus competencias para la elaboración de platillos y
                preparación de bebidas.
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

      {/* Separador 2 - Objetivo to Jueces */}
      <div className="cecyte-chef-section-separator">
        <div className="cecyte-chef-separator-line"></div>
        <div className="cecyte-chef-separator-svgs">
          <img src={PILON} alt="Pilón" className="cecyte-chef-separator-svg" />
          <img
            src={PITAHAYA}
            alt="Pitahaya"
            className="cecyte-chef-separator-svg"
          />
          <img src={PEZ} alt="Pez" className="cecyte-chef-separator-svg" />
          <img
            src={LANGOSTA}
            alt="Langosta"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={CUBIERTOS}
            alt="Cubiertos"
            className="cecyte-chef-separator-svg"
          />
        </div>
        <div className="cecyte-chef-separator-line"></div>
      </div>

      {/* Jueces Section - Premium Design */}
      <section className="cecyte-chef-jueces-section">
        {/* Background SVGs for Jueces Section */}
        <div className="cecyte-chef-jueces-background">
          <div className="cecyte-chef-jueces-svgs">
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-1">
              <img src={CUCHILLO} alt="Cuchillo" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-2">
              <img src={SARTEN} alt="Sartén" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-3">
              <img src={CAMARON} alt="Camarón" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-4">
              <img src={CHILE} alt="Chile" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-5">
              <img src={CUCHARA} alt="Cuchara" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-6">
              <img src={PILON} alt="Pilón" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-7">
              <img src={LANGOSTA} alt="Langosta" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-8">
              <img src={CUBIERTOS} alt="Cubiertos" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-9">
              <img src={DORADO} alt="Dorado" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-10">
              <img src={PEZ} alt="Pez" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-11">
              <img src={BALLENA} alt="Ballena" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-12">
              <img src={BALANDRA} alt="Balandra" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-13">
              <img src={PALMERA} alt="Palmera" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-14">
              <img src={PITAHAYA} alt="Pitahaya" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-15">
              <img src={EL_ARCO} alt="El Arco" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-16">
              <img src={RUPESTRES} alt="Rupestres" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-17">
              <img src={HACHA} alt="Hacha" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-18">
              <img src={COLA_DE_LA_BALLENA} alt="Cola de la Ballena" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-19">
              <img src={TRIANGULOS} alt="Triángulos" />
            </div>

            {/* Duplicados y variaciones para crear más elementos */}
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-20">
              <img src={CUCHILLO} alt="Cuchillo" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-21">
              <img src={SARTEN} alt="Sartén" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-22">
              <img src={CAMARON} alt="Camarón" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-23">
              <img src={CHILE} alt="Chile" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-24">
              <img src={CUCHARA} alt="Cuchara" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-25">
              <img src={PILON} alt="Pilón" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-26">
              <img src={LANGOSTA} alt="Langosta" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-27">
              <img src={CUBIERTOS} alt="Cubiertos" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-28">
              <img src={DORADO} alt="Dorado" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-29">
              <img src={PEZ} alt="Pez" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-30">
              <img src={BALLENA} alt="Ballena" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-31">
              <img src={BALANDRA} alt="Balandra" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-32">
              <img src={PALMERA} alt="Palmera" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-33">
              <img src={PITAHAYA} alt="Pitahaya" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-34">
              <img src={EL_ARCO} alt="El Arco" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-35">
              <img src={RUPESTRES} alt="Rupestres" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-36">
              <img src={HACHA} alt="Hacha" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-37">
              <img src={COLA_DE_LA_BALLENA} alt="Cola de la Ballena" />
            </div>
            <div className="cecyte-chef-jueces-svg cecyte-chef-jueces-svg-38">
              <img src={TRIANGULOS} alt="Triángulos" />
            </div>
          </div>
        </div>

        <div className="cecyte-chef-container">
          <div className="cecyte-chef-jueces-header">
            <div className="cecyte-chef-jueces-badge">
              <span>CONOCE A TUS JUECES</span>
            </div>
            <h2 className="cecyte-chef-jueces-title">
              Expertos culinarios que evaluarán tu talento
            </h2>
            <p className="cecyte-chef-jueces-subtitle">
              Nuestros jueces son reconocidos profesionales de la gastronomía
              con años de experiencia
            </p>
          </div>

          <div className="cecyte-chef-jueces-grid">
            {/* Juez 1 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-card-inner">
                <div className="cecyte-chef-juez-image-container">
                  <div className="cecyte-chef-juez-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Chef María González"
                      className="cecyte-chef-juez-image"
                    />
                    <div className="cecyte-chef-juez-image-overlay">
                      <div className="cecyte-chef-juez-quote">
                        "La creatividad y la técnica deben ir de la mano para
                        crear platillos excepcionales"
                      </div>
                    </div>
                  </div>
                  <div className="cecyte-chef-juez-badge">
                    <span>15+ AÑOS</span>
                  </div>
                </div>

                <div className="cecyte-chef-juez-content">
                  <div className="cecyte-chef-juez-header">
                    <h3 className="cecyte-chef-juez-name">
                      Chef María González
                    </h3>
                    <p className="cecyte-chef-juez-title">
                      Chef Ejecutiva - Hotel Marriott
                    </p>
                  </div>

                  <p className="cecyte-chef-juez-description">
                    Con más de 15 años de experiencia en cocina internacional,
                    especialista en gastronomía mediterránea y fusion cuisine.
                    Graduada del Instituto Culinario de México.
                  </p>

                  <div className="cecyte-chef-juez-specialties">
                    <span className="cecyte-chef-juez-specialty">
                      Cocina Internacional
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Fusion Cuisine
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Gastronomía Mediterránea
                    </span>
                  </div>

                  <div className="cecyte-chef-juez-stats">
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">15+</span>
                      <span className="cecyte-chef-juez-stat-label">Años</span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">50+</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Premios
                      </span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">3</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Restaurantes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Juez 2 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-card-inner">
                <div className="cecyte-chef-juez-image-container">
                  <div className="cecyte-chef-juez-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Chef Carlos Mendoza"
                      className="cecyte-chef-juez-image"
                    />
                    <div className="cecyte-chef-juez-image-overlay">
                      <div className="cecyte-chef-juez-quote">
                        "La pasión por los ingredientes locales es la base de
                        una cocina auténtica"
                      </div>
                    </div>
                  </div>
                  <div className="cecyte-chef-juez-badge">
                    <span>12+ AÑOS</span>
                  </div>
                </div>

                <div className="cecyte-chef-juez-content">
                  <div className="cecyte-chef-juez-header">
                    <h3 className="cecyte-chef-juez-name">
                      Chef Carlos Mendoza
                    </h3>
                    <p className="cecyte-chef-juez-title">
                      Propietario - Restaurante El Sabor
                    </p>
                  </div>

                  <p className="cecyte-chef-juez-description">
                    Chef especializado en cocina tradicional mexicana y técnicas
                    ancestrales. Reconocido por su trabajo con ingredientes
                    locales y sostenibilidad culinaria.
                  </p>

                  <div className="cecyte-chef-juez-specialties">
                    <span className="cecyte-chef-juez-specialty">
                      Cocina Tradicional
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Ingredientes Locales
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Sostenibilidad
                    </span>
                  </div>

                  <div className="cecyte-chef-juez-stats">
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">12+</span>
                      <span className="cecyte-chef-juez-stat-label">Años</span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">25+</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Premios
                      </span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">2</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Restaurantes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Juez 3 */}
            <div className="cecyte-chef-juez-card">
              <div className="cecyte-chef-juez-card-inner">
                <div className="cecyte-chef-juez-image-container">
                  <div className="cecyte-chef-juez-image-wrapper">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                      alt="Chef Ana Rodríguez"
                      className="cecyte-chef-juez-image"
                    />
                    <div className="cecyte-chef-juez-image-overlay">
                      <div className="cecyte-chef-juez-quote">
                        "La presentación es tan importante como el sabor para
                        crear una experiencia memorable"
                      </div>
                    </div>
                  </div>
                  <div className="cecyte-chef-juez-badge">
                    <span>10+ AÑOS</span>
                  </div>
                </div>

                <div className="cecyte-chef-juez-content">
                  <div className="cecyte-chef-juez-header">
                    <h3 className="cecyte-chef-juez-name">
                      Chef Ana Rodríguez
                    </h3>
                    <p className="cecyte-chef-juez-title">
                      Instructora - CECYTE Culinary
                    </p>
                  </div>

                  <p className="cecyte-chef-juez-description">
                    Especialista en pastelería y repostería artística. Con
                    formación en Francia, combina técnicas clásicas con
                    innovación moderna en la presentación de platillos.
                  </p>

                  <div className="cecyte-chef-juez-specialties">
                    <span className="cecyte-chef-juez-specialty">
                      Pastelería Artística
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Repostería
                    </span>
                    <span className="cecyte-chef-juez-specialty">
                      Presentación
                    </span>
                  </div>

                  <div className="cecyte-chef-juez-stats">
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">10+</span>
                      <span className="cecyte-chef-juez-stat-label">Años</span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">30+</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Premios
                      </span>
                    </div>
                    <div className="cecyte-chef-juez-stat">
                      <span className="cecyte-chef-juez-stat-number">1</span>
                      <span className="cecyte-chef-juez-stat-label">
                        Academia
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador 3 - Jueces to Lugares */}
      <div className="cecyte-chef-section-separator">
        <div className="cecyte-chef-separator-line"></div>
        <div className="cecyte-chef-separator-svgs">
          <img
            src={DORADO}
            alt="Dorado"
            className="cecyte-chef-separator-svg"
          />
          <img src={HACHA} alt="Hacha" className="cecyte-chef-separator-svg" />
          <img
            src={PALMERA}
            alt="Palmera"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={BALLENA}
            alt="Ballena"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={BALANDRA}
            alt="Balandra"
            className="cecyte-chef-separator-svg"
          />
        </div>
        <div className="cecyte-chef-separator-line"></div>
      </div>

      {/* Lugares de Interés Section - Premium Parallax */}
      <section className="cecyte-chef-lugares-section" ref={parallaxRef}>
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img
              src={LUGARES_VISITA}
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
                  <span className="cecyte-chef-title-line">
                    ¿Qué visitar en
                  </span>
                  <span className="cecyte-chef-title-highlight">La Paz?</span>
                </h1>

                <p className="cecyte-chef-lugares-description">
                  Sumérgete en la belleza natural de Baja California Sur. Desde
                  playas cristalinas hasta sitios históricos únicos, La Paz te
                  ofrece una experiencia que combina aventura, cultura y
                  gastronomía auténtica.
                </p>

                <div className="cecyte-chef-lugares-actions">
                  <button
                    className="cecyte-chef-lugares-button cecyte-chef-btn-primary"
                    onClick={handleNavigateToQueVisitar}
                  >
                    <span>Explorar lugares</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador 4 - Lugares to Hoteles */}
      <div className="cecyte-chef-section-separator">
        <div className="cecyte-chef-separator-line"></div>
        <div className="cecyte-chef-separator-svgs">
          <img
            src={EL_ARCO}
            alt="El Arco"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={RUPESTRES}
            alt="Rupestres"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={TRIANGULOS}
            alt="Triángulos"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={COLA_DE_LA_BALLENA}
            alt="Cola de la Ballena"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={CUCHILLO}
            alt="Cuchillo"
            className="cecyte-chef-separator-svg"
          />
        </div>
        <div className="cecyte-chef-separator-line"></div>
      </div>

      {/* Hoteles Section - Premium Parallax */}
      <section className="cecyte-chef-hoteles-section" ref={hotelesParallaxRef}>
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img
              src={HOTELES}
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
                  <span className="cecyte-chef-title-highlight">
                    hospedarte?
                  </span>
                </h1>

                <p className="cecyte-chef-hoteles-description">
                  Descubre los mejores hoteles y resorts de La Paz, Baja
                  California Sur. Desde lujosos complejos turísticos hasta
                  acogedores hoteles boutique, encuentra el lugar perfecto para
                  tu estadía con vistas espectaculares al mar y comodidades de
                  primera clase.
                </p>

                <div className="cecyte-chef-hoteles-actions">
                  <button
                    className="cecyte-chef-hoteles-button cecyte-chef-btn-primary"
                    onClick={handleNavigateToHospedajes}
                  >
                    <span>Ver hospedajes</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-building"></i>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separador 5 - Hoteles to Restaurantes */}
      <div className="cecyte-chef-section-separator">
        <div className="cecyte-chef-separator-line"></div>
        <div className="cecyte-chef-separator-svgs">
          <img
            src={SARTEN}
            alt="Sartén"
            className="cecyte-chef-separator-svg"
          />
          <img
            src={CAMARON}
            alt="Camarón"
            className="cecyte-chef-separator-svg"
          />
          <img src={CHILE} alt="Chile" className="cecyte-chef-separator-svg" />
          <img
            src={CUCHARA}
            alt="Cuchara"
            className="cecyte-chef-separator-svg"
          />
          <img src={PILON} alt="Pilón" className="cecyte-chef-separator-svg" />
        </div>
        <div className="cecyte-chef-separator-line"></div>
      </div>

      {/* Restaurantes Section - Premium Parallax */}
      <section
        className="cecyte-chef-restaurantes-section"
        ref={restaurantesParallaxRef}
      >
        <div className="cecyte-chef-parallax-container">
          {/* Background Layers for Advanced Parallax */}
          <div className="cecyte-chef-parallax-bg-layer cecyte-chef-bg-layer-1">
            <img
              src={RESTAURANTE}
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
                  única que combina ingredientes frescos del mar con sabores
                  locales.
                </p>

                <div className="cecyte-chef-restaurantes-actions">
                  <button
                    className="cecyte-chef-restaurantes-button cecyte-chef-btn-primary"
                    onClick={handleNavigateToRestaurantes}
                  >
                    <span>Ver restaurantes</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-shop"></i>
                    </div>
                  </button>
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
              Únete a miles de estudiantes que ya están transformando su pasión
              por la cocina en una carrera profesional.
            </p>
            <button className="cecyte-chef-cta-button" onClick={onLoginClick}>
              <i className="bi bi-box-arrow-in-right cecyte-chef-cta-button-icon"></i>
              <span className="cecyte-chef-cta-button-text-desktop">
                Iniciar Sesión Ahora
              </span>
              <span className="cecyte-chef-cta-button-text-mobile">
                Entrar Ahora
              </span>
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
