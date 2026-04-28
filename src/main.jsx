import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';
import ProductSummary from './ProductSummary';

// 1. Función de limpieza pura (solo extrae y limpia el texto una vez)
const procesarDescripcion = () => {
  const descElement = document.querySelector('[data-store^="product-description"]');
  if (!descElement || descElement.dataset.procesado === "true") return null;

  // BUSQUEDA QUIRÚRGICA: Captura todo entre las dos etiquetas
  const regexResumen = /\[RESUMEN\]:\s*([\s\S]*?)\[\/\]/i;
  const match = descElement.innerHTML.match(regexResumen);
  
  if (match && match[1]) {
    const textoExtraido = match[1].trim();
    
    // Borramos el bloque completo (incluyendo las etiquetas) de la descripción
    descElement.innerHTML = descElement.innerHTML.replace(regexResumen, '');
    
    // Limpieza de párrafos vacíos sobrantes
    descElement.innerHTML = descElement.innerHTML.replace(/<p>\s*<\/p>/g, '');
    
    descElement.dataset.procesado = "true";
    return textoExtraido;
  }
  
  descElement.dataset.procesado = "true";
  return null;
};

// 2. Inyectores individuales
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

const inyectarResumen = (texto) => {
  // Ubicamos los dos precios
  const priceNormal = document.querySelector('.price-container');
  const priceTachado = document.querySelector('#compare_price_display');
  
  if (priceNormal && texto && !document.getElementById('widget-resumen-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-resumen-root';
    
    // MAGIA ESTRUCTURAL:
    // Si hay precio tachado, subimos un nivel a su "padre" (el span) y nos ponemos antes
    if (priceTachado && priceTachado.parentElement) {
      priceTachado.parentElement.insertAdjacentElement('beforebegin', rootDiv);
    } else {
      // Si el producto no está en oferta, apuntamos directo al precio normal
      priceNormal.insertAdjacentElement('beforebegin', rootDiv);
    }
    
    createRoot(rootDiv).render(<ProductSummary texto={texto} />);
    return true;
  }
  return false;
};

const inyectarColumnaDerecha = () => {
  const columnaDestino = document.getElementById('columna-derecha-clubdigital');
  const inputPostal = document.querySelector('.js-shipping-input');
  const widgetEnviosNativo = inputPostal ? inputPostal.closest('div.mb-4') : null;

  if (columnaDestino && widgetEnviosNativo && !columnaDestino.contains(widgetEnviosNativo)) {
    // Solo mudamos el envío
    columnaDestino.appendChild(widgetEnviosNativo);
    return true;
  }
  // Si ya está mudado, devolvemos true para que el orquestador no lo intente de nuevo
  return columnaDestino && columnaDestino.contains(widgetEnviosNativo);
};

// 3. Orquestador principal
let resumenTexto = null;
let state = { benefits: false, shipping: false, resumen: false };

const ejecutarInyecciones = () => {
  // Primero procesamos la descripción si no se hizo
  if (!resumenTexto) {
    resumenTexto = procesarDescripcion();
  }

  if (!state.benefits) state.benefits = inyectarBenefits();
  if (!state.shipping) state.shipping = inyectarShipping();
  if (!state.resumen && resumenTexto) state.resumen = inyectarResumen(resumenTexto);
  // Ejecutamos la mudanza a la nueva columna
  if (!state.columnaDerecha) state.columnaDerecha = inyectarColumnaDerecha(resumenTexto);
  

  // Si ya cargamos lo básico, podemos desconectar el observer
  return state.benefits && state.shipping && state.columnaDerecha;
};

// Ejecución inicial y Observer
if (!ejecutarInyecciones()) {
  const observer = new MutationObserver(() => {
    if (ejecutarInyecciones()) {
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}