import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';

console.log("🚀 [Widgets] Iniciando inyección dual...");

// Inyección 1: Los Beneficios (Debajo del precio)
const inyectarBenefits = () => {
  const target = document.querySelector('.price-container'); 
  if (target && !document.getElementById('widget-beneficios-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-beneficios-root';
    target.insertAdjacentElement('afterend', rootDiv);
    createRoot(rootDiv).render(<BenefitsList />);
    return true;
  }
  return false;
};

// Inyección 2: El Envío (Adentro del contenedor de Descripción, bien arriba)
const inyectarShipping = () => {
  // Usamos un selector dinámico (empieza con...) porque el ID de la descripción cambia por producto
  const target = document.querySelector('[data-store^="product-description"]');
  if (target && !document.getElementById('widget-shipping-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-shipping-root';
    
    // Lo inyectamos justo al principio del contenedor de la descripción (afterbegin)
    // Así respeta los márgenes del bloque azul que mostraste en tu captura.
    target.insertAdjacentElement('afterbegin', rootDiv);
    createRoot(rootDiv).render(<ShippingWidget />);
    return true;
  }
  return false;
};

let benefitsOk = inyectarBenefits();
let shippingOk = inyectarShipping();

// Si alguno no cargó aún, nos quedamos vigilando
if (!benefitsOk || !shippingOk) {
  const observer = new MutationObserver(() => {
    if (!benefitsOk) benefitsOk = inyectarBenefits();
    if (!shippingOk) shippingOk = inyectarShipping();
    
    if (benefitsOk && shippingOk) {
      console.log("✅ [Widgets] Ambos widgets inyectados con éxito.");
      observer.disconnect(); 
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}