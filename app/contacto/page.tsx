'use client';

import React from 'react';
import { FaWhatsapp, FaInstagram, FaEnvelope, FaClock, FaChevronRight } from 'react-icons/fa';

export default function ContactoPage() {
  const contactMethods = [
    {
      title: 'WhatsApp',
      value: '+54 9 11 5145-7720',
      description: 'Atención inmediata para ventas y consultas de stock.',
      link: 'https://wa.me/5491151457720',
      icon: <FaWhatsapp className="text-green-500" size={24} />,
      label: 'Enviar mensaje'
    },
    {
      title: 'Instagram',
      value: '@innovasumarg',
      description: 'Seguinos para ver las últimas novedades y ofertas.',
      link: 'https://www.instagram.com/innovasumarg',
      icon: <FaInstagram className="text-purple-600" size={24} />,
      label: 'Ver perfil'
    }
  ];

  const emailMethods = [
    {
      title: 'Consultas Generales',
      value: 'contacto@innovasum.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    },
    {
      title: 'Ventas y Pedidos',
      value: 'ventas@innovasum.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    },
    {
      title: 'Soporte Técnico',
      value: 'soporte@innovasum.com.ar',
      icon: <FaEnvelope className="text-slate-400" size={18} />
    }
  ];

  return (
    <div className="bg-white pt-32 pb-0 flex flex-col items-center w-full">
      <div className="w-full max-w-6xl px-6">
        {/* Header */}
        <header className="mb-24 text-center flex flex-col items-center w-full">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-6">Canales Oficiales</p>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter m-0">Contacto</h1>
          <div className="w-16 h-1.5 bg-slate-900 mt-8 md:mt-10"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-32 w-full mb-20">
          {/* Direct Channels */}
          <section className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Atención Directa</h2>
            <div className="space-y-10">
              {contactMethods.map((method) => (
                <a 
                  key={method.title}
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-10 border border-slate-100 bg-white shadow-sm transition-all hover:border-slate-900 hover:shadow-xl no-underline"
                >
                  <div className="flex items-center justify-between mb-6">
                    {method.icon}
                    <FaChevronRight size={12} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 m-0 mb-2 tracking-tight">{method.title}</h3>
                  <p className="text-blue-600 font-bold text-sm mb-6 tracking-wide">{method.value}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-0">{method.description}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Email and Hours */}
          <div className="space-y-20">
            <section className="flex flex-col">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Casillas de Correo</h2>
              <div className="space-y-6">
                {emailMethods.map((email) => (
                  <div key={email.title} className="p-8 border border-slate-100 flex items-center gap-8 group hover:border-slate-200 transition-all">
                    <div className="w-12 h-12 bg-slate-50 flex items-center justify-center">
                      {email.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{email.title}</p>
                      <a href={`mailto:${email.value}`} className="text-base font-bold text-slate-900 no-underline hover:text-blue-600 transition-colors tracking-tight">{email.value}</a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-12 bg-slate-50 border border-slate-100 text-slate-900">
              <div className="flex items-center gap-4 mb-10">
                <FaClock className="text-blue-600" size={20} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] m-0">Horarios de Atención</h2>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Lunes a Viernes</p>
                  <p className="text-xl font-black tracking-tight">09:00 — 20:00 HS</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Sábados y Domingos</p>
                  <p className="text-xl font-black tracking-tight">11:00 — 18:00 HS</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Note Section (Full Width) */}
      <div className="w-full py-10 border-t border-slate-100 text-center bg-white mb-10">
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed w-full px-6 m-0">
          Todas nuestras comunicaciones oficiales se realizan a través de los canales listados en esta página. 
          No compartas información sensible fuera de estos medios.
        </p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
