import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Fecha del evento: 20 de noviembre de 2025
    const eventDate = new Date('2025-11-20T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="cecyte-chef-countdown-section">
      <div className="cecyte-chef-countdown-container">
        {/* Background SVG Elements */}
        <div className="cecyte-chef-countdown-bg">
          <img src="/src/assets/svg/CUBIERTOS.png" alt="Cubiertos" className="cecyte-chef-countdown-svg cecyte-chef-svg-1" />
          <img src="/src/assets/svg/SARTEN.png" alt="Sartén" className="cecyte-chef-countdown-svg cecyte-chef-svg-2" />
          <img src="/src/assets/svg/CUCHILLO.png" alt="Cuchillo" className="cecyte-chef-countdown-svg cecyte-chef-svg-3" />
          <img src="/src/assets/svg/CUCHARA.png" alt="Cuchara" className="cecyte-chef-countdown-svg cecyte-chef-svg-4" />
          <img src="/src/assets/svg/PILON.png" alt="Pilón" className="cecyte-chef-countdown-svg cecyte-chef-svg-5" />
          <img src="/src/assets/svg/CHILE.png" alt="Chile" className="cecyte-chef-countdown-svg cecyte-chef-svg-6" />
          <img src="/src/assets/svg/CAMARON.png" alt="Camarón" className="cecyte-chef-countdown-svg cecyte-chef-svg-7" />
          <img src="/src/assets/svg/LANGOSTA.png" alt="Langosta" className="cecyte-chef-countdown-svg cecyte-chef-svg-8" />
        </div>

        {/* Overlay */}
        <div className="cecyte-chef-countdown-overlay"></div>

        {/* Content */}
        <div className="cecyte-chef-countdown-content">
          <div className="cecyte-chef-countdown-header">
            <div className="cecyte-chef-countdown-badge">
              <span className="cecyte-chef-countdown-badge-text">¡Próximamente!</span>
            </div>
            <h2 className="cecyte-chef-countdown-title">
              <span className="cecyte-chef-countdown-title-main">CecyteChef</span>
              <span className="cecyte-chef-countdown-title-sub">20 de Noviembre</span>
            </h2>
            <p className="cecyte-chef-countdown-description">
              El evento gastronómico más esperado del año está por comenzar. 
              ¡Prepárate para una experiencia culinaria única en La Paz!
            </p>
          </div>

          <div className="cecyte-chef-countdown-timer">
            <div className="cecyte-chef-countdown-item">
              <div className="cecyte-chef-countdown-number">{timeLeft.days}</div>
              <div className="cecyte-chef-countdown-label">Días</div>
            </div>
            <div className="cecyte-chef-countdown-separator">:</div>
            <div className="cecyte-chef-countdown-item">
              <div className="cecyte-chef-countdown-number">{timeLeft.hours}</div>
              <div className="cecyte-chef-countdown-label">Horas</div>
            </div>
            <div className="cecyte-chef-countdown-separator">:</div>
            <div className="cecyte-chef-countdown-item">
              <div className="cecyte-chef-countdown-number">{timeLeft.minutes}</div>
              <div className="cecyte-chef-countdown-label">Minutos</div>
            </div>
            <div className="cecyte-chef-countdown-separator">:</div>
            <div className="cecyte-chef-countdown-item">
              <div className="cecyte-chef-countdown-number">{timeLeft.seconds}</div>
              <div className="cecyte-chef-countdown-label">Segundos</div>
            </div>
          </div>

          <div className="cecyte-chef-countdown-actions">
            <button className="cecyte-chef-countdown-button cecyte-chef-countdown-button-primary">
              <span className="cecyte-chef-countdown-button-text">Registrarse</span>
              <div className="cecyte-chef-countdown-button-glow"></div>
            </button>
            <button className="cecyte-chef-countdown-button cecyte-chef-countdown-button-secondary">
              <span className="cecyte-chef-countdown-button-text">Más Información</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CountdownTimer;
