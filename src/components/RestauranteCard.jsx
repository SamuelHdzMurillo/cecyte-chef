import React from 'react'
import './RestauranteCard.css'

function RestauranteCard({ restaurante }) {
  const handleContactar = () => {
    // Abrir WhatsApp con el número de teléfono
    const telefono = restaurante.telefono.replace(/\s/g, '')
    const mensaje = `Hola, me interesa obtener información sobre ${restaurante.nombre}`
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  const handleEmail = () => {
    // Abrir cliente de email
    const asunto = `Consulta sobre ${restaurante.nombre}`
    const url = `mailto:${restaurante.correo_electronico}?subject=${encodeURIComponent(asunto)}`
    window.open(url)
  }

  const handleWeb = () => {
    // Abrir página web
    if (restaurante.pagina_web) {
      window.open(restaurante.pagina_web, '_blank')
    }
  }

  return (
    <div className="restaurante-card">
      <div className="restaurante-card-image">
        <img 
          src={restaurante.imagen || '/src/assets/fondos/restaurante.png'} 
          alt={restaurante.nombre}
          onError={(e) => {
            e.target.src = '/src/assets/fondos/restaurante.png'
          }}
        />
        <div className="restaurante-card-overlay">
          <div className="restaurante-card-badge">
            <i className="bi bi-utensils"></i>
          </div>
        </div>
      </div>

      <div className="restaurante-card-content">
        <div className="restaurante-card-header">
          <h3 className="restaurante-card-title">{restaurante.nombre}</h3>
          <div className="restaurante-card-rating">
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star-fill"></i>
            <i className="bi bi-star"></i>
          </div>
        </div>

        <div className="restaurante-card-info">
          <div className="restaurante-card-location">
            <i className="bi bi-geo-alt"></i>
            <span>{restaurante.direccion}</span>
          </div>

          <div className="restaurante-card-contact">
            <div className="restaurante-card-phone">
              <i className="bi bi-telephone"></i>
              <span>{restaurante.telefono}</span>
            </div>

            <div className="restaurante-card-email">
              <i className="bi bi-envelope"></i>
              <span>{restaurante.correo_electronico}</span>
            </div>

            {restaurante.pagina_web && (
              <div className="restaurante-card-website">
                <i className="bi bi-globe"></i>
                <span>Página web disponible</span>
              </div>
            )}

            {restaurante.codigo_promocional && (
              <div className="restaurante-card-promo">
                <i className="bi bi-tag"></i>
                <span>Código: {restaurante.codigo_promocional}</span>
              </div>
            )}
          </div>
        </div>

        <div className="restaurante-card-actions">
          <button 
            className="restaurante-card-btn restaurante-card-btn-primary"
            onClick={handleContactar}
          >
            <i className="bi bi-whatsapp"></i>
            <span>Contactar</span>
          </button>
          
          <button 
            className="restaurante-card-btn restaurante-card-btn-secondary"
            onClick={handleEmail}
          >
            <i className="bi bi-envelope"></i>
            <span>Email</span>
          </button>

          {restaurante.pagina_web && (
            <button 
              className="restaurante-card-btn restaurante-card-btn-tertiary"
              onClick={handleWeb}
            >
              <i className="bi bi-globe"></i>
              <span>Web</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestauranteCard
