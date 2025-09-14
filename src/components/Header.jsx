import React from "react";
import "./Header.css";

function Header({ activeSection, selectedItem, onBack }) {
  const getBreadcrumbItems = () => {
    const items = [
      { label: "Dashboard", path: "dashboard", icon: "bi-speedometer2" }
    ];

    switch (activeSection) {
      case "usuarios":
        items.push({ label: "Usuarios del Sistema", path: "usuarios", icon: "bi-people" });
        break;
      case "buzon":
        items.push({ label: "Buzón de Asistencia", path: "buzon", icon: "bi-inbox" });
        break;
      case "eventos":
        items.push({ label: "Eventos del Sistema", path: "eventos", icon: "bi-calendar-event" });
        break;
      case "comite":
        items.push({ label: "Comité del Sistema", path: "comite", icon: "bi-people-fill" });
        if (selectedItem) {
          items.push({ 
            label: `Detalle del Comité #${selectedItem}`, 
            path: "comite-detail", 
            icon: "bi-eye",
            isDetail: true 
          });
        }
        break;
      case "equipos":
        items.push({ label: "Equipos del Sistema", path: "equipos", icon: "bi-people-fill" });
        if (selectedItem) {
          items.push({ 
            label: `Detalle del Equipo #${selectedItem}`, 
            path: "equipo-detail", 
            icon: "bi-eye",
            isDetail: true 
          });
        }
        break;
      case "participantes":
        items.push({ label: "Participantes del Sistema", path: "participantes", icon: "bi-person-check" });
        break;
      case "restaurantes":
        items.push({ label: "Restaurantes", path: "restaurantes", icon: "bi-cup-hot" });
        if (selectedItem) {
          items.push({ 
            label: `Detalle del Restaurante #${selectedItem}`, 
            path: "restaurante-detail", 
            icon: "bi-eye",
            isDetail: true 
          });
        }
        break;
      case "hospedajes":
        items.push({ label: "Hospedajes del Sistema", path: "hospedajes", icon: "bi-building" });
        if (selectedItem) {
          items.push({ 
            label: `Detalle del Hospedaje #${selectedItem}`, 
            path: "hospedaje-detail", 
            icon: "bi-eye",
            isDetail: true 
          });
        }
        break;
      case "lugares":
        items.push({ label: "Lugares de Interés", path: "lugares", icon: "bi-geo-alt" });
        if (selectedItem) {
          items.push({ 
            label: `Detalle del Lugar #${selectedItem}`, 
            path: "lugar-detail", 
            icon: "bi-eye",
            isDetail: true 
          });
        }
        break;
      default:
        break;
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-title">
          <h1 className="header-main-title">
            {breadcrumbItems[breadcrumbItems.length - 1].label}
          </h1>
          <p className="header-subtitle">
            Sistema de Administración CECyTE Chef
          </p>
        </div>
        
        <nav className="breadcrumb-nav" aria-label="breadcrumb">
          <ol className="breadcrumb">
            {breadcrumbItems.map((item, index) => (
              <li 
                key={item.path} 
                className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? 'active' : ''}`}
              >
                {index === breadcrumbItems.length - 1 ? (
                  <span className="breadcrumb-current">
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.label}
                  </span>
                ) : (
                  <span className="breadcrumb-link">
                    <i className={`bi ${item.icon} me-2`}></i>
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
      
      {selectedItem && onBack && (
        <div className="header-actions">
          <button 
            className="btn btn-outline-primary btn-back"
            onClick={onBack}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Volver
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
