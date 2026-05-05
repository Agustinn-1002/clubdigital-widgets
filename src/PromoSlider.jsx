import React from 'react';
import './PromoSlider.css';

const PromoSlider = ({ images }) => {
  if (!images || images.length === 0) return null;

  // TRUCO MAESTRO: Triplicamos el array de imágenes. 
  // Esto asegura que la pista sea lo suficientemente larga para crear un loop infinito sin cortes.
  const infiniteImages = [...images, ...images, ...images];

  return (
    <div className="promo-slider-wrapper">
      <h3 className="slider-title">Producto en Acción</h3> 
      
      {/* El contenedor ahora tiene la clase continuous-track */}
      <div className="promo-slider-track continuous-track">
        {infiniteImages.map((url, index) => (
          <div key={index} className="promo-slide">
            <img src={url} alt={`Acción ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;