import React from 'react';
import './ShippingWidget.css';

const ShippingWidget = () => {
  const getShippingDates = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const hour = now.getHours();
    
    let isToday = false;
    let dispatchDate = new Date();
    
    // Lógica del horario de corte (14:00 hs)
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour < 14) {
      isToday = true; // Lunes a Viernes antes de las 14:00 -> Despacha hoy
    } else if (dayOfWeek >= 1 && dayOfWeek <= 4 && hour >= 14) {
      dispatchDate.setDate(now.getDate() + 1); // Lunes a Jueves post 14:00 -> Mañana
    } else if (dayOfWeek === 5 && hour >= 14) {
      dispatchDate.setDate(now.getDate() + 3); // Viernes post 14:00 -> Lunes
    } else if (dayOfWeek === 6) {
      dispatchDate.setDate(now.getDate() + 2); // Sábado -> Lunes
    } else if (dayOfWeek === 0) {
      dispatchDate.setDate(now.getDate() + 1); // Domingo -> Lunes
    }

    // Calculamos una entrega estimada sumando 2 a 3 días hábiles desde el despacho
    let deliveryStart = new Date(dispatchDate);
    deliveryStart.setDate(dispatchDate.getDate() + 2);
    if (deliveryStart.getDay() === 6) deliveryStart.setDate(deliveryStart.getDate() + 2);
    if (deliveryStart.getDay() === 0) deliveryStart.setDate(deliveryStart.getDate() + 1);

    let deliveryEnd = new Date(deliveryStart);
    deliveryEnd.setDate(deliveryStart.getDate() + 1);
    if (deliveryEnd.getDay() === 6) deliveryEnd.setDate(deliveryEnd.getDate() + 2);

    const formatOptions = { day: 'numeric', month: 'short' };
    
    return {
      compraText: "Hoy",
      badgeText: isToday ? "ANTES DE LAS 14:00" : null,
      envioText: isToday ? "Hoy" : dispatchDate.toLocaleDateString('es-AR', formatOptions),
      entregaText: `${deliveryStart.toLocaleDateString('es-AR', formatOptions)} - ${deliveryEnd.toLocaleDateString('es-AR', formatOptions)}`
    };
  };

  const dates = getShippingDates();

  return (
    <div className="shipping-widget-container">
      <div className="shipping-steps">
        <div className="shipping-connector"></div>
        
        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span className="shipping-title">Compra</span>
          <span className="shipping-date">{dates.compraText}</span>
          {dates.badgeText && <span className="shipping-badge">{dates.badgeText}</span>}
        </div>

        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.5">
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span className="shipping-title">Envío</span>
          <span className="shipping-date">{dates.envioText}</span>
        </div>

        <div className="shipping-step">
          <svg className="shipping-icon" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="1.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span className="shipping-title">Entrega</span>
          <span className="shipping-date">{dates.entregaText}</span>
        </div>
      </div>
    </div>
  );
};

export default ShippingWidget;