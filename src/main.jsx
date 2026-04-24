import React from 'react';
import { createRoot } from 'react-dom/client';
import BenefitsList from './BenefitsList';

const targetSelector = '.price-container'; 
console.log("🚀 [Widget] Iniciando script. Buscando anclaje:", targetSelector);

const initWidget = () => {
  const targetElement = document.querySelector(targetSelector);
  console.log("📍 [Widget] Elemento encontrado en el DOM:", targetElement);

  if (targetElement && !document.getElementById('widget-beneficios-root')) {
    console.log("✅ [Widget] Inyectando componente React...");
    
    const widgetRoot = document.createElement('div');
    widgetRoot.id = 'widget-beneficios-root';
    
    targetElement.insertAdjacentElement('afterend', widgetRoot);
    
    const root = createRoot(widgetRoot);
    root.render(<BenefitsList />);
  } else {
    console.warn("⚠️ [Widget] No se inyectó. ¿Existe el anclaje?", !!targetElement, "¿Ya estaba inyectado?", !!document.getElementById('widget-beneficios-root'));
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWidget);
} else {
  initWidget();
}