import React, { useState, useEffect } from 'react';
import './PromoSlider.css';

const PromoSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // 1. Buscamos todas las fotos ocultas que nos dejó Tiendanube en el FTP
    const inputsOcultos = document.querySelectorAll('.js-club-image-data');
    
    // 2. Extraemos las URLs y las guardamos en nuestro estado
    const urls = Array.from(inputsOcultos).map(input => input.value);
    setImages(urls);
  }, []);

  // Si por algún motivo el producto no tiene fotos extra, no dibujamos nada
  if (images.length === 0) return null;

  return (
    <div className="promo-slider-wrapper">
      {/* Podés borrar este h3 si no querés que tenga título */}
      <h3 className="slider-title">Galería del Producto</h3> 
      
      <div className="promo-slider-track">
        {images.map((url, index) => (
          <div key={index} className="promo-slide">
            <img src={url} alt={`Vista del producto ${index + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSlider;