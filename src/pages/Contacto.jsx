import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../components/HomePage.css";

function Contacto({ onLoginClick }) {
  return (
    <div className="cecyte-chef-homepage">
      <Navbar onLoginClick={onLoginClick} />
      
      {/* CTA Section - Contacto */}
      <section className="cecyte-chef-cta-section">
        <div className="cecyte-chef-container">
          <div className="cecyte-chef-cta-content">
            <div className="cecyte-chef-cta-header">
              <span className="cecyte-chef-cta-label">CONTACTO</span>
              <h2 className="cecyte-chef-cta-title">
                ¿Tienes <span className="cecyte-chef-title-highlight">preguntas?</span>
              </h2>
              <p className="cecyte-chef-cta-description">
                Estamos aquí para ayudarte con cualquier duda sobre el concurso CECYTE Chef 2024. 
                No dudes en contactarnos para obtener más información sobre inscripciones, 
                reglamento, hospedaje o cualquier otro tema relacionado.
              </p>
            </div>

            <div className="cecyte-chef-cta-grid">
              {/* Información de contacto */}
              <div className="cecyte-chef-cta-info">
                <div className="cecyte-chef-contact-item">
                  <div className="cecyte-chef-contact-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div className="cecyte-chef-contact-details">
                    <h3>Teléfono</h3>
                    <p>+52 (612) 123-4567</p>
                  </div>
                </div>

                <div className="cecyte-chef-contact-item">
                  <div className="cecyte-chef-contact-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div className="cecyte-chef-contact-details">
                    <h3>Email</h3>
                    <p>info@cecytechef2024.com</p>
                  </div>
                </div>

                <div className="cecyte-chef-contact-item">
                  <div className="cecyte-chef-contact-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div className="cecyte-chef-contact-details">
                    <h3>Dirección</h3>
                    <p>La Paz, Baja California Sur, México</p>
                  </div>
                </div>

                <div className="cecyte-chef-contact-item">
                  <div className="cecyte-chef-contact-icon">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div className="cecyte-chef-contact-details">
                    <h3>Horarios</h3>
                    <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Formulario de contacto */}
              <div className="cecyte-chef-cta-form">
                <form className="cecyte-chef-contact-form">
                  <div className="cecyte-chef-form-group">
                    <label htmlFor="nombre">Nombre completo</label>
                    <input 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      placeholder="Tu nombre completo"
                      required 
                    />
                  </div>

                  <div className="cecyte-chef-form-group">
                    <label htmlFor="email">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      placeholder="tu@email.com"
                      required 
                    />
                  </div>

                  <div className="cecyte-chef-form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input 
                      type="tel" 
                      id="telefono" 
                      name="telefono" 
                      placeholder="+52 (612) 123-4567"
                    />
                  </div>

                  <div className="cecyte-chef-form-group">
                    <label htmlFor="asunto">Asunto</label>
                    <select id="asunto" name="asunto" required>
                      <option value="">Selecciona un asunto</option>
                      <option value="inscripcion">Inscripción al concurso</option>
                      <option value="reglamento">Reglamento y bases</option>
                      <option value="hospedaje">Hospedaje y transporte</option>
                      <option value="programa">Programa de actividades</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="cecyte-chef-form-group">
                    <label htmlFor="mensaje">Mensaje</label>
                    <textarea 
                      id="mensaje" 
                      name="mensaje" 
                      rows="5" 
                      placeholder="Escribe tu mensaje aquí..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="cecyte-chef-btn cecyte-chef-btn-primary">
                    <span>Enviar mensaje</span>
                    <div className="cecyte-chef-btn-icon">
                      <i className="bi bi-send"></i>
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contacto;
