import React from 'react';
import './BenefitsList.css';

// Un diccionario visual con nuestros SVGs
const renderIcon = (iconName) => {
  const baseProps = {
    className: "wb-icon",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor", // Usa el color que le digamos por CSS
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };

  switch (iconName) {
    case 'truck':
      return (
        <svg {...baseProps} style={{ color: "#4F46E5" }}>
          <rect x="1" y="3" width="15" height="13"></rect>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
          <circle cx="5.5" cy="18.5" r="2.5"></circle>
          <circle cx="18.5" cy="18.5" r="2.5"></circle>
        </svg>
      );
    case 'lock':
      return (
        <svg {...baseProps} style={{ color: "#F59E0B" }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      );
    case 'shield':
      return (
        <svg {...baseProps} style={{ color: "#10B981" }}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      );
    case 'card':
      return (
        <svg {...baseProps} style={{ color: "#8B5CF6" }}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      );
    case 'box':
      return (
        <svg {...baseProps} style={{ color: "#EC4899" }}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
      );
    case 'star':
      return (
        <svg {...baseProps} style={{ color: "#EAB308" }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      );
    default:
      // Fallback por si hay un error, devolvemos un check
      return (
        <svg {...baseProps} style={{ color: "#6B7280" }}>
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      );
  }
};

const BenefitsList = () => {
  const config = window.ClubDigitalWidgetConfig || {
    activo: true, 
    icono1: 'truck', beneficio1: 'Cargando...',
    icono2: 'lock', beneficio2: 'Cargando...',
    icono3: 'shield', beneficio3: 'Cargando...'
  };

  if (config.activo === false || config.activo === 'false') {
    return null;
  }

  return (
    <div className="wb-container">
      <ul className="wb-list">
        <li className="wb-item">
          {renderIcon(config.icono1)}
          <span>{config.beneficio1}</span>
        </li>
        <li className="wb-item">
          {renderIcon(config.icono2)}
          <span>{config.beneficio2}</span>
        </li>
        <li className="wb-item">
          {renderIcon(config.icono3)}
          <span>{config.beneficio3}</span>
        </li>
      </ul>
    </div>
  );
};

export default BenefitsList;