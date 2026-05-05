import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';
import ProductSummary from './ProductSummary';
import PromoSlider from './PromoSlider';

const procesarDescripcion = () => {
  const descElement = document.querySelector('[data-store^="product-description"]');
  if (!descElement || descElement.dataset.procesado === "true") return null;

  const regexResumen = /\[RESUMEN\]:\s*([\s\S]*?)\[\/\]/i;
  const match = descElement.innerHTML.match(regexResumen);
  
  if (match && match[1]) {
    const textoExtraido = match[1].trim();
    descElement.innerHTML = descElement.innerHTML.replace(regexResumen, '');
    descElement.innerHTML = descElement.innerHTML.replace(/<p>\s*<\/p>/g, '');
    descElement.dataset.procesado = "true";
    return textoExtraido;
  }
  
  descElement.dataset.procesado = "true";
  return null;
};

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
  const formCompra = document.querySelector('.js-product-form') || document.querySelector('[data-store="product-form"]');

  if (formCompra && texto && !document.getElementById('widget-resumen-root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'widget-resumen-root';
    rootDiv.style.marginTop = '25px'; 
    formCompra.insertAdjacentElement('beforebegin', rootDiv);
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
    columnaDestino.appendChild(widgetEnviosNativo);
    return true;
  }
  return columnaDestino && columnaDestino.contains(widgetEnviosNativo);
};

const ocultarDescuentosCero = () => {
  const etiquetas = document.querySelectorAll('.js-offer-label');
  etiquetas.forEach(etiqueta => {
    if (etiqueta.innerText.includes('0%')) {
      etiqueta.style.setProperty('display', 'none', 'important');
    }
  });
};

const inyectarSlider = () => {
  const contenedor = document.getElementById('club-digital-slider-root');
  if (contenedor && !contenedor.hasChildNodes()) {
    const root = createRoot(contenedor);
    root.render(<PromoSlider />);
    return true;
  }
  return contenedor ? contenedor.hasChildNodes() : false;
};

let resumenTexto = null;
let state = { benefits: false, shipping: false, resumen: false, columnaDerecha: false, slider: false };

const ejecutarInyecciones = () => {
  if (!resumenTexto) resumenTexto = procesarDescripcion();

  if (!state.benefits) state.benefits = inyectarBenefits();
  if (!state.shipping) state.shipping = inyectarShipping();
  if (!state.resumen && resumenTexto) state.resumen = inyectarResumen(resumenTexto);
  if (!state.columnaDerecha) state.columnaDerecha = inyectarColumnaDerecha();
  if (!state.slider) state.slider = inyectarSlider();

  ocultarDescuentosCero();
  
  return state.benefits && state.shipping && state.columnaDerecha && state.slider;
};

if (!ejecutarInyecciones()) {
  const observer = new MutationObserver(() => {
    if (ejecutarInyecciones()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}