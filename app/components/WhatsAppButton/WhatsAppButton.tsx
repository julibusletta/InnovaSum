import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  // Reemplazar con el número real del comercio (agrega código de país sin el símbolo +)
  const phoneNumber = "5491151457720"; 
  const message = "Hola! Vengo de la tienda web y necesito ayuda.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-[18px] rounded-full shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 z-[99]"
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <FaWhatsapp size={44} />
    </a>
  );
};

export default WhatsAppButton;
