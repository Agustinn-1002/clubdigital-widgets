import React from 'react';
import './BenefitsList.css';

const BenefitsList = () => {
  // Acá es donde React se conecta con Tiendanube
  const config = window.ClubDigitalWidgetConfig || {
    activo: true, 
    beneficio1: 'Envío no cargado',
    beneficio2: 'Pago no cargado',
    beneficio3: 'Garantía no cargada'
  };

  if (config.activo === false || config.activo === 'false') {
    return null;
  }

  return (
    <div className="wb-container">
      <ul className="wb-list">
        <li className="wb-item">
          <svg className="wb-icon" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span>{config.beneficio1}</span>
        </li>
        <li className="wb-item">
          <svg className="wb-icon" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>{config.beneficio2}</span>
        </li>
        <li className="wb-item">
          <svg className="wb-icon" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>{config.beneficio3}</span>
        </li>
      </ul>
    </div>
  );
};

export default BenefitsList;