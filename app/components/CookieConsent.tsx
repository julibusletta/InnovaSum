'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('jbi_cookie_consent');
    if (!consent) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (level: 'all' | 'essential') => {
    localStorage.setItem('jbi_cookie_consent', level);
    setShow(false);
    // Reload tracking scripts
    window.location.reload();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none p-4 md:p-12">
      <div 
        className="w-full max-w-4xl bg-white border border-gray-200 shadow-[0_30px_70px_rgba(0,0,0,0.3)] pointer-events-auto animate-in slide-in-from-bottom-10 duration-500 rounded-sm"
        style={{ padding: '2.5rem' }}
      >
        
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-8 font-sans tracking-tight">
          Acerca de las cookies de este sitio
        </h1>
        
        <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed mb-8">
          Este sitio utiliza cookies esenciales y no esenciales para mejorar su experiencia online, 
          poder compartir contenido en redes sociales, medir el tráfico en este sitio web y 
          mostrarle anuncios personalizados basados en su actividad de navegación.
          <br /><br />
          Al hacer clic en ACEPTAR, aceptas el{' '}
          <Link href="/terminos" className="text-blue-600 hover:underline font-medium">
            uso de cookies
          </Link>{' '}
          de Innovasum y de sus socios. Para obtener más información sobre las cookies utilizadas, 
          consulta la{' '}
          <Link href="/terminos" className="text-blue-600 hover:underline font-medium">
            Política de Privacidad
          </Link>.
        </p>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-6 border-t border-gray-100 pt-12">
          <button 
            id="reject_prompt_submit"
            onClick={() => handleConsent('essential')}
            className="w-full sm:w-auto px-10 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 bg-gray-50 hover:bg-gray-100 transition duration-300 rounded-sm order-2 sm:order-1"
          >
            Rechazar
          </button>
          <button 
            id="consent_prompt_submit"
            onClick={() => handleConsent('all')}
            className="w-full sm:w-auto px-12 py-3 bg-[#1a1a1a] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition duration-300 shadow-xl rounded-sm order-1 sm:order-2"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
