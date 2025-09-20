import React from 'react'
import './LugarInteresCard.css'

function LugarInteresCard({ lugar }) {
  const handleWeb = () => {
    // Abrir página web
    if (lugar.web) {
      window.open(lugar.web, '_blank')
    }
  }

  const handleVerMas = () => {
    // Mostrar más información del lugar
    alert(`Descripción completa:\n\n${lugar.descripcion}`)
  }

  return (
    <div className="lugar-interes-card">
      <div className="lugar-interes-card-image">
        <img 
          src={lugar.img || "/src/assets/fondos/LugaresVisita.png"} 
          alt={lugar.nombre}
          onError={(e) => {
            e.target.src = '/src/assets/fondos/LugaresVisita.png'
          }}
        />
        <div className="lugar-interes-card-overlay">
          <div className="lugar-interes-card-badge">
            <i className="bi bi-geo-alt"></i>
          </div>
        </div>
      </div>

      <div className="lugar-interes-card-content">
        <div className="lugar-interes-card-header">
          <h3 className="lugar-interes-card-title">{lugar.nombre}</h3>
          <div className="lugar-interes-card-status">
            <span className={`lugar-interes-status-badge ${lugar.estatus}`}>
              {lugar.estatus === 'activo' ? 'Disponible' : 'No disponible'}
            </span>
          </div>
        </div>

        <div className="lugar-interes-card-info">
          <div className="lugar-interes-card-location">
            <i className="bi bi-geo-alt"></i>
            <span>{lugar.direccion}</span>
          </div>

          <div className="lugar-interes-card-description">
            <p>{lugar.descripcion}</p>
          </div>

          {lugar.web && (
            <div className="lugar-interes-card-website">
              <i className="bi bi-globe"></i>
              <span>Página web disponible</span>
            </div>
          )}
        </div>

        <div className="lugar-interes-card-actions">
          <button 
            className="lugar-interes-card-btn lugar-interes-card-btn-primary"
            onClick={handleVerMas}
          >
            <i className="bi bi-info-circle"></i>
            <span>Ver más</span>
          </button>
          
          {lugar.web && (
            <button 
              className="lugar-interes-card-btn lugar-interes-card-btn-secondary"
              onClick={handleWeb}
            >
              <i className="bi bi-globe"></i>
              <span>Visitar web</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LugarInteresCard
