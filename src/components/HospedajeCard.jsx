import React from 'react'
import './HospedajeCard.css'
import { HOTELES } from '../assets/images'

function HospedajeCard({ hospedaje }) {
  const handleContactar = () => {
    // Abrir WhatsApp con el número de teléfono
    const telefono = hospedaje.numero_telefonico.replace(/\s/g, '')
    const mensaje = `Hola, me interesa obtener información sobre ${hospedaje.nombre}`
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  const handleEmail = () => {
    // Abrir cliente de email
    const asunto = `Consulta sobre ${hospedaje.nombre}`
    const url = `mailto:${hospedaje.correo}?subject=${encodeURIComponent(asunto)}`
    window.open(url)
  }

  return (
    <div className="hospedaje-card">
      <div className="hospedaje-card-image">
        <img 
          src={hospedaje.img || HOTELES} 
          alt={hospedaje.nombre}
          onError={(e) => {
            e.target.src = HOTELES
          }}
        />
        <div className="hospedaje-card-overlay">
          <div className="hospedaje-card-badge">
            <i className="bi bi-building"></i>
          </div>
        </div>
      </div>

      <div className="hospedaje-card-content">
        <div className="hospedaje-card-header">
          <h3 className="hospedaje-card-title">{hospedaje.nombre}</h3>
          <div className="hospedaje-card-rating">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star"></i>
          </div>
        </div>

        <div className="hospedaje-card-info">
          <div className="hospedaje-card-location">
            <i className="bi bi-geo-alt"></i>
            <span>{hospedaje.direccion}</span>
          </div>

          <div className="hospedaje-card-contact">
            <div className="hospedaje-card-phone">
              <i className="bi bi-telephone"></i>
              <span>{hospedaje.numero_telefonico}</span>
            </div>

            <div className="hospedaje-card-email">
              <i className="bi bi-envelope"></i>
              <span>{hospedaje.correo}</span>
            </div>
          </div>
        </div>

        <div className="hospedaje-card-actions">
          <button 
            className="hospedaje-card-btn hospedaje-card-btn-primary"
            onClick={handleContactar}
          >
            <i className="bi bi-whatsapp"></i>
            <span>Contactar</span>
          </button>
          
          <button 
            className="hospedaje-card-btn hospedaje-card-btn-secondary"
            onClick={handleEmail}
          >
            <i className="bi bi-envelope"></i>
            <span>Email</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HospedajeCard
