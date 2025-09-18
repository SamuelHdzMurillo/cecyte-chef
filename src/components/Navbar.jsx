import React, { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Cerrar menú al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  // Cerrar menú al redimensionar ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav className="main-navbar">
        <div className="main-navbar-container">
          {/* Menú de navegación */}
          <div className={`main-navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <a href="#inicio" className="main-navbar-link" onClick={closeMenu}>
              INICIO
            </a>
            <a
              href="#programa"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              PROGRAMA
            </a>
            <a
              href="#hospedajes"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              HOSPEDAJES
            </a>
            <a
              href="#restaurantes"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              RESTAURANTES
            </a>
            <a
              href="#que-visitar"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              ¿QUÉ VISITAR?
            </a>
            <a
              href="#directorio"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              DIRECTORIO
            </a>
            <a
              href="#servicios-medicos"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              SERV. MÉDICOS
            </a>
            <a
              href="#contacto"
              className="main-navbar-link"
              onClick={closeMenu}
            >
              CONTACTO
            </a>

            {/* Botón de Iniciar Sesión */}
            <button
              className="main-navbar-button"
              onClick={() => {
                closeMenu();
                onLoginClick();
              }}
            >
              INICIAR SESIÓN
            </button>
          </div>

          {/* Botón hamburguesa */}
          <button
            className={`main-navbar-toggle ${isMenuOpen ? "active" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Overlay para móvil */}
      {isMenuOpen && (
        <div className="main-navbar-overlay active" onClick={closeMenu}></div>
      )}
    </>
  );
}

export default Navbar;
