import React, { useState, useEffect } from 'react';
import './ShippingWidget.css';

const ShippingWidget = () => {
  const [entregaTexto, setEntregaTexto] = useState('Calculando...');

  const getShippingDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const hour = now.getHours();
    
    let isToday = false;
    let dispatchDate = new Date();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour < 14) {
      isToday = true; 
    } else if (dayOfWeek >= 1 && dayOfWeek <= 4 && hour >= 14) {
      dispatchDate.setDate(now.getDate() + 1); 
    } else if (dayOfWeek === 5 && hour >= 14) {
      dispatchDate.setDate(now.getDate() + 3); 
    } else if (dayOfWeek === 6) {
      dispatchDate.setDate(now.getDate() + 2); 
    } else if (dayOfWeek === 0) {
      dispatchDate.setDate(now.getDate() + 1); 
    }

    let deliveryFallback = new Date(dispatchDate);
    deliveryFallback.setDate(dispatchDate.getDate() + 3);
    const formatOptions = { day: 'numeric', month: 'short' };
    
    return {
      compraText: "Hoy",
      badgeText: isToday ? "ANTES 14HS" : null,
      envioText: isToday ? "Hoy" : dispatchDate.toLocaleDateString('es-AR', formatOptions),
      entregaTextFallback: `Aprox. ${deliveryFallback.toLocaleDateString('es-AR', formatOptions)}`
    };
  };

  const dates = getShippingDates();

  useEffect(() => {
    setEntregaTexto(dates.entregaTextFallback);

    const buscarFechaAndreani = () => {
      // ACÁ ESTÁ LA MAGIA USANDO TU CAPTURA DE PANTALLA:
      const fechaElement = document.querySelector('[data-component="option.date"]');
      
      if (fechaElement) {
        let texto = fechaElement.innerText || '';
        if (texto.includes('Llega el') || texto.includes('Llega entre')) {
          // Limpiamos para que quede "lunes 27/04"
          let fechaLimpia = texto.replace('Llega el', '').replace('Llega entre', '').trim();
          // Capitalizamos la primera letra: "Lunes 27/04"
          fechaLimpia = fechaLimpia.charAt(0).toUpperCase() + fechaLimpia.slice(1);
          
          setEntregaTexto(fechaLimpia);
        }
      }
    };

    const intervalo = setInterval(buscarFechaAndreani, 800);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="shipping-widget-wrapper">
      <div className="shipping-pill">
        
        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <div className="shipping-text-group">
            <span className="shipping-title">Compra {dates.badgeText && <span className="shipping-badge">{dates.badgeText}</span>}</span>
            <span className="shipping-date">{dates.compraText}</span>
          </div>
        </div>

        <div className="shipping-connector"></div>

        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <div className="shipping-text-group">
            <span className="shipping-title">Despacho</span>
            <span className="shipping-date">{dates.envioText}</span>
          </div>
        </div>

        <div className="shipping-connector"></div>

        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div className="shipping-text-group">
            <span className="shipping-title">Entrega</span>
            <span className="shipping-date">{entregaTexto}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ShippingWidget;