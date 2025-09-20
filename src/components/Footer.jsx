import React from 'react';
import './Footer.css';
import { CECYTE_CHEF_SIN_FONDO, CINTILLA_INFERIOR_SVG } from '../assets/images';

const Footer = () => {
  return (
    <footer className="cecyte-chef-footer">
      {/* Sección principal del footer */}
      <div className="cecyte-chef-footer-main">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-footer-content">
            
            {/* Logo y información principal */}
            <div className="cecyte-chef-footer-brand">
              <div className="cecyte-chef-footer-logo-container">
                <img
                  src={CECYTE_CHEF_SIN_FONDO}
                  alt="CECYTE CHEF - II Concurso Nacional"
                  className="cecyte-chef-footer-logo"
                />
              </div>
              <div className="cecyte-chef-footer-brand-info">
                <h3 className="cecyte-chef-footer-title">CECYTE CHEF</h3>
                <p className="cecyte-chef-footer-subtitle">II Concurso Nacional</p>
                <p className="cecyte-chef-footer-location">Baja California Sur</p>
              </div>
            </div>

            {/* Enlaces de navegación */}
            <div className="cecyte-chef-footer-links">
              <div className="cecyte-chef-footer-column">
                <h4 className="cecyte-chef-footer-column-title">Concurso</h4>
                <ul className="cecyte-chef-footer-list">
                  <li><a href="#inicio" className="cecyte-chef-footer-link">Inicio</a></li>
                  <li><a href="#objetivo" className="cecyte-chef-footer-link">Objetivo</a></li>
                  <li><a href="#jueces" className="cecyte-chef-footer-link">Jueces</a></li>
                  <li><a href="#lugar" className="cecyte-chef-footer-link">Lugar</a></li>
                </ul>
              </div>
              
              <div className="cecyte-chef-footer-column">
                <h4 className="cecyte-chef-footer-column-title">Servicios</h4>
                <ul className="cecyte-chef-footer-list">
                  <li><a href="#hospedaje" className="cecyte-chef-footer-link">Hospedaje</a></li>
                  <li><a href="#restaurantes" className="cecyte-chef-footer-link">Restaurantes</a></li>
                  <li><a href="#lugares" className="cecyte-chef-footer-link">Lugares de Interés</a></li>
                  <li><a href="#transporte" className="cecyte-chef-footer-link">Transporte</a></li>
                </ul>
              </div>
              
              <div className="cecyte-chef-footer-column">
                <h4 className="cecyte-chef-footer-column-title">Contacto</h4>
                <ul className="cecyte-chef-footer-list">
                  <li className="cecyte-chef-footer-contact-item">
                    <i className="bi bi-geo-alt-fill"></i>
                    <span>La Paz, Baja California Sur</span>
                  </li>
                  <li className="cecyte-chef-footer-contact-item">
                    <i className="bi bi-telephone-fill"></i>
                    <span>+52 (612) 123-4567</span>
                  </li>
                  <li className="cecyte-chef-footer-contact-item">
                    <i className="bi bi-envelope-fill"></i>
                    <span>info@cecytechef.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="cecyte-chef-footer-social">
              <h4 className="cecyte-chef-footer-column-title">Síguenos</h4>
              <div className="cecyte-chef-social-links">
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram"></i>
                </a>
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="Twitter"
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="cecyte-chef-social-link"
                  aria-label="YouTube"
                >
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cintilla inferior */}
      <div className="cecyte-chef-footer-bottom">
        <div className="cecyte-chef-footer-bottom-content">
          <div className="cecyte-chef-footer-copyright">
            <p>&copy; 2024 CECYTE CHEF. Todos los derechos reservados.</p>
            <p>Desarrollado con ❤️ para la comunidad estudiantil</p>
          </div>
        </div>
      </div>
      
      {/* Cintilla SVG - Pie de página completo */}
      <div className="cecyte-chef-footer-cintilla-container">
        <img
          src={CINTILLA_INFERIOR_SVG}
          alt="Cintilla decorativa CECYTE CHEF"
          className="cecyte-chef-cintilla-svg"
        />
      </div>
    </footer>
  );
};

export default Footer;
