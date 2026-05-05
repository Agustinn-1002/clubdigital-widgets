import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget';
import ProductSummary from './ProductSummary';
import PromoSlider from './PromoSlider';

// 1. EL EXTRACTOR MAESTRO (Ahora saca Resumen y Galería)
const procesarDescripcion = () => {
  const descElement = document.querySelector('[data-store^="product-description"]');
  if (!descElement || descElement.dataset.procesado === "true") return { resumen: null, galeria: [], procesado: true };

  let textoResumen = null;
  let urlsGaleria = [];

  // A. Buscar y sacar el [RESUMEN]: ... [/]
  const regexResumen = /\[RESUMEN\]:\s*([\s\S]*?)\[\/\]/i;
  const matchResumen = descElement.innerHTML.match(regexResumen);
  if (matchResumen && matchResumen[1]) {
    textoResumen = matchResumen[1].trim();
    descElement.innerHTML = descElement.innerHTML.replace(regexResumen, '');
  }

  // B. Buscar y sacar la [GALERIA] ... [/GALERIA]
  const regexGaleria = /\[GALERIA\]([\s\S]*?)\[\/GALERIA\]/i;
  const matchGaleria = descElement.innerHTML.match(regexGaleria);
  if (matchGaleria && matchGaleria[1]) {
    // Armamos un div falso temporal para extraer las URLs de las fotos que pusiste en Tiendanube
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = matchGaleria[1];
    const imgs = tempDiv.querySelectorAll('img');
    urlsGaleria = Array.from(imgs).map(img => img.src);
    
    descElement.innerHTML = descElement.innerHTML.replace(regexGaleria, '');
  }

  descElement.innerHTML = descElement.innerHTML.replace(/<p>\s*<\/p>/g, '');
  descElement.dataset.procesado = "true";
  
  return { resumen: textoResumen, galeria: urlsGaleria, procesado: true };
};

// 2. INYECTORES
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
    if (etiqueta.innerText.includes('0%')) etiqueta.style.setProperty('display', 'none', 'important');
  });
};

// El inyector del slider ahora recibe la lista de URLs
const inyectarSlider = (urls) => {
  const contenedor = document.getElementById('club-digital-slider-root');
  if (contenedor && !contenedor.hasChildNodes()) {
    const root = createRoot(contenedor);
    root.render(<PromoSlider images={urls} />);
    return true;
  }
  return contenedor ? contenedor.hasChildNodes() : false;
};

// 3. ORQUESTADOR PRINCIPAL
let datosExtraidos = { resumen: null, galeria: [], procesado: false };
let state = { benefits: false, shipping: false, resumen: false, columnaDerecha: false, slider: false };

const ejecutarInyecciones = () => {
  if (!datosExtraidos.procesado) datosExtraidos = procesarDescripcion();

  if (!state.benefits) state.benefits = inyectarBenefits();
  if (!state.shipping) state.shipping = inyectarShipping();
  if (!state.columnaDerecha) state.columnaDerecha = inyectarColumnaDerecha();
  
  // Ejecutamos Resumen si hay, si no lo damos por completado
  if (!state.resumen) {
    state.resumen = datosExtraidos.resumen ? inyectarResumen(datosExtraidos.resumen) : true;
  }
  
  // Ejecutamos Slider si hay fotos, si no lo damos por completado
  if (!state.slider) {
    state.slider = datosExtraidos.galeria.length > 0 ? inyectarSlider(datosExtraidos.galeria) : true;
  }

  ocultarDescuentosCero();
  
  return state.benefits && state.shipping && state.columnaDerecha && state.resumen && state.slider;
};

if (!ejecutarInyecciones()) {
  const observer = new MutationObserver(() => {
    if (ejecutarInyecciones()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}