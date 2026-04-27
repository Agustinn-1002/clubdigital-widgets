import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';
import ProductSummary from './ProductSummary';

// 1. Función de limpieza pura (solo extrae y limpia el texto una vez)
const procesarDescripcion = () => {
  const descElement = document.querySelector('[data-store^="product-description"]');
  if (!descElement || descElement.dataset.procesado === "true") return null;

  const regexResumen = /\[RESUMEN\]:\s*([\s\S]*?)(?=\[|<div|<section|$)/i;
  const match = descElement.innerHTML.match(regexResumen);
  
  if (match && match[1]) {
    const textoExtraido = match[1].trim();
    // Limpiamos la descripción ANTES de inyectar nada
    descElement.innerHTML = descElement.innerHTML.replace(regexResumen, '');
    descElement.innerHTML = descElement.innerHTML.replace(/<p>\s*<\/p>/g, '');
    
    // Marcamos como procesado para que el Observer no entre en bucle
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
  const target = document.querySelector('.price-container');
  if (target && texto && !document.getElementById('widget-resumen-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-resumen-root';
    target.insertAdjacentElement('beforebegin', rootDiv);
    createRoot(rootDiv).render(<ProductSummary texto={texto} />);
    return true;
  }
  return false;
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

  // Si ya cargamos lo básico, podemos desconectar el observer
  return state.benefits && state.shipping;
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