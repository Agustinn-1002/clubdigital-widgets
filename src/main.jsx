import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';
import ProductSummary from './ProductSummary'; // <-- Importamos el nuevo

console.log("🚀 [Widgets] Iniciando inyección múltiple...");

// Función para extraer la data oculta de la descripción
const extraerMetadatos = () => {
  const descElement = document.querySelector('[data-store^="product-description"]');
  if (!descElement) return null;

  // Expresión regular para buscar "[RESUMEN]: texto"
  const regexResumen = /\[RESUMEN\]:\s*(.*?)(<\/?p>|<br>|$)/i;
  const match = descElement.innerHTML.match(regexResumen);
  
  let resumen = null;
  
  if (match && match[1]) {
    resumen = match[1].trim();
    // Borramos la etiqueta de la descripción para que el cliente no vea el "código"
    descElement.innerHTML = descElement.innerHTML.replace(regexResumen, '');
  }

  return { resumen };
};

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

// Inyección 2: El Envío (Arriba de la descripción)
const inyectarShipping = () => {
  const target = document.querySelector('[data-store^="product-description"]');
  if (target && !document.getElementById('widget-shipping-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-shipping-root';
    target.insertAdjacentElement('afterbegin', rootDiv);
    createRoot(rootDiv).render(<ShippingWidget />);
    return true;
  }
  return false;
};

// Inyección 3: El Mini Resumen (Arriba del precio)
const inyectarResumen = () => {
  const target = document.querySelector('.font-smallest');
  // Extraemos el texto en tiempo real
  const metadatos = extraerMetadatos();
  
  if (target && metadatos && metadatos.resumen && !document.getElementById('widget-resumen-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-resumen-root';
    
    // Lo inyectamos ANTES del contenedor del precio
    target.insertAdjacentElement('afterend', rootDiv);
    createRoot(rootDiv).render(<ProductSummary texto={metadatos.resumen} />);
    return true;
  }
  return false; // Retorna false si no cargó el DOM o si el producto no tiene la etiqueta [RESUMEN]:
};

let benefitsOk = inyectarBenefits();
let shippingOk = inyectarShipping();
let resumenOk = inyectarResumen();

if (!benefitsOk || !shippingOk || !resumenOk) {
  const observer = new MutationObserver(() => {
    if (!benefitsOk) benefitsOk = inyectarBenefits();
    if (!shippingOk) shippingOk = inyectarShipping();
    
    // El resumen solo lo intentamos inyectar una vez que el DOM está listo, 
    // pero si no hay etiqueta [RESUMEN], lo dejamos pasar (no bloquea al resto).
    if (!document.getElementById('widget-resumen-root')) {
      inyectarResumen(); 
    }
    
    if (benefitsOk && shippingOk) {
      observer.disconnect(); 
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}