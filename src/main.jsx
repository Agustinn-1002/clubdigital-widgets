import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';
import ShippingWidget from './ShippingWidget'; // <-- Importamos el nuevo

const targetSelector = '.price-container'; 

// Creamos un componente envoltorio que tenga los dos
const AppWidgets = () => {
  return (
    <>
      <BenefitsList />
      <ShippingWidget />
    </>
  );
};

const inyectarWidget = () => {
  const targetElement = document.querySelector(targetSelector);
  
  if (targetElement && !document.getElementById('widget-beneficios-root')) {
    const widgetRoot = document.createElement('div');
    widgetRoot.id = 'widget-beneficios-root';
    targetElement.insertAdjacentElement('afterend', widgetRoot);
    
    const root = createRoot(widgetRoot);
    root.render(<AppWidgets />); // <-- Dibujamos los dos juntos
    return true; 
  }
  return false; 
};

// ... (El resto del código de inyección y el Observer queda igual que antes) ...
if (!inyectarWidget()) {
  const observer = new MutationObserver(() => {
    if (inyectarWidget()) {
      observer.disconnect(); 
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}