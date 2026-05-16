'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

interface AccordionItem {
  title: string;
  content: string;
  question?: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: AccordionItem[] = [
    {
      title: 'Realizar un pedido',
      question: '¿Cómo realizo un pedido?',
      content: '¡Comprar en nuestra web es muy fácil! Primero, sumá al carrito todos los productos que querés. Luego, elegí si preferís envío a domicilio o retirarlo en un punto de entrega. Indicá si necesitás factura A o factura B. Después, seleccioná el medio de pago que más te convenga. Revisá todos los detalles y confirmá tu compra. ¡Listo, ya tenés tu pedido realizado! Te enviamos toda la info y número de pedido al mail que tengas registrado en tu cuenta.'
    },
    {
      title: 'Precio',
      question: '¿El precio que figura en la web es el precio final?',
      content: 'Todos los precios en la web incluyen el IVA, y se encuentran expresados en pesos argentinos.'
    },
    {
      title: 'Formas de pago',
      question: '¿Cuáles son las formas de pago?',
      content: 'Contás con varias opciones para abonar tu pedido: Podés elegir entre depósito o transferencia bancaria (abonando el precio especial), tarjetas de crédito (en hasta 18 cuotas fijas) o billeteras virtuales, como Mercado Pago y MODO (con QR y hasta 2 tarjetas de crédito en simultáneo).'
    },
    {
      title: 'Códigos de descuento',
      question: '¿Cómo puedo aplicar un código de descuento en mi compra?',
      content: 'Si tenés un código de descuento, deberás agregar todos los productos que desees a tu carrito y completar los pasos de Envíos, Facturación y Forma de Pago. Al momento de la revisión, verás un campo de "¿Tenés un código de descuento?", seleccionalo e ingresá tu código. Una vez aplicado, verás los descuentos aplicados y ya podés confirmar tu compra ¡Importante! Sólo se permite un código por compra.'
    },
    {
      title: 'Mercado Pago',
      question: '¿Cómo puedo abonar a través de Mercado Pago?',
      content: 'Para pagar con Mercado Pago, al momento de elegir la forma de pago en el carrito, elegí “Billetera virtual” y seleccioná "Mercado Pago". Luego, vas a poder seleccionar la cantidad de cuotas. Confirmá tu reserva y vas a ver el link para pagar desde la App. Seguí las instrucciones y ¡listo! Con Mercado Pago podés abonar con hasta 2 tarjetas o con dinero en cuenta de Mercado Pago.'
    },
    {
      title: 'MODO',
      question: '¿Cómo puedo abonar a través de MODO?',
      content: 'Para pagar con MODO, al momento de elegir la forma de pago en el carrito, elegí “Billetera virtual” y seleccioná MODO. Confirmá tu pedido y continuá: si estás desde una PC, en la pantalla de confirmación —o desde Mi Cuenta > Mis pedidos— hacé clic en “Pagar con MODO” para generar el QR y escanearlo con tu app; si estás en el celular, ese botón abrirá tu app MODO para completar el pago.'
    },
    {
      title: 'Depósito - Transferencia bancaria',
      question: '¿Cómo abono a través de depósito/transferencia?',
      content: 'Una vez que realizás tu pedido, te enviamos los datos bancarios para hacer el depósito o la transferencia. Para informar el pago, ingresá a tu perfil, buscá el pedido y hacé clic en “Cargar comprobante”. Subí el comprobante (el archivo debe ser en formato JPG, PDF o BMP). Seleccioná el tipo de comprobante (si es depósito, transferencia o retención) e indicá el monto, el DNI o CUIT del titular del pago y el número de comprobante.'
    },
    {
      title: 'Tarjetas de crédito',
      question: '¿Cómo abonar con tarjeta de crédito?',
      content: 'En el paso de "Forma de pago" en el carrito, deberás seleccionar la opción "Tarjeta de crédito" y completar con los datos de tu tarjeta. Luego, deberás seleccionar la cantidad de cuotas e indicar los datos del titular de la tarjeta. Podés pagar tu pedido con tarjetas de crédito en hasta 24 cuotas fijas.'
    },
    {
      title: 'Facturación',
      question: '¿Cómo tramito la factura de mi compra?',
      content: 'En todas las compras efectuadas en la web, brindamos sin excepción alguna, la factura de compra. Una vez que realiza y abona el pedido, enviamos a tu dirección de correo electrónico la factura correspondiente. Por supuesto, también podés descargarla desde la sección Mi cuenta < Mis facturas. En caso de que precises factura A, solo debes ingresar tu CUIT al cargar el pedido.'
    },
    {
      title: 'Garantías',
      question: '¿Cómo utilizo el servicio de PosVenta y garantías?',
      content: 'Para realizar consultas/reclamos relacionadas con la garantía o devolución de alguna de tus compras, contamos con canales oficiales donde debes exponer tu caso y uno de nuestros representantes te ofrecerá la información correspondiente sobre cómo proceder.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-32 px-4 md:px-0 flex flex-col items-center w-full">
      <div className="w-full max-w-6xl px-4 md:px-10">
        
        {/* Professional Header Section */}
        <section className="flex items-center gap-6 mb-12 px-2">
          <Link 
            href="/" 
            className="group flex items-center justify-center w-12 h-12 bg-white rounded-xl border border-slate-100 text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all no-underline shadow-sm hover:shadow-md"
          >
            <FaChevronLeft size={18} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-slate-900 m-0 tracking-tight">Preguntas Frecuentes</h1>
            <p className="text-slate-400 text-sm mt-1">Encontrá respuestas rápidas a tus consultas</p>
          </div>
        </section>

        {/* Categories List (Refined CompraGamer Style) */}
        <div className="space-y-4 mb-20 px-2">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`group bg-white rounded-xl border border-slate-100 transition-all duration-300 ${openIndex === index ? 'shadow-xl shadow-slate-200/40 scale-[1.01] border-blue-100' : 'hover:shadow-md hover:border-slate-200'}`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-7 text-left bg-transparent border-0 cursor-pointer rounded-xl transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className={`text-base md:text-lg font-medium transition-colors ${openIndex === index ? 'text-blue-600 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
                  {faq.title}
                </span>
                <FaChevronDown 
                  size={14} 
                  className={`text-blue-600 transition-transform duration-500 ease-out ${openIndex === index ? 'rotate-180' : 'opacity-60 group-hover:opacity-100'}`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="px-8 pb-10 pt-2 text-slate-600">
                  <div className="w-12 h-1 bg-blue-100 mb-6 rounded-full"></div>
                  <p className="text-slate-900 font-bold text-lg mb-4 leading-tight">{faq.question}</p>
                  <p className="text-sm md:text-base leading-relaxed mb-0 font-normal opacity-90">
                    {faq.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Professional Help Section (Refined & Less Invasive) */}
        <div className="px-2 mt-28">
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-10 md:p-14 transition-all hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <FaShieldAlt size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 m-0">Servicio postventa y garantías</h2>
            </div>
            
            <div className="space-y-6 max-w-5xl">
              <p className="text-slate-600 text-base md:text-lg leading-relaxed m-0">
                ¿Tu producto presenta alguna falla? No te preocupes. Contamos con un equipo especializado en soporte para ayudarte de forma rápida y profesional.
              </p>
              
              <div className="p-6 bg-white border border-slate-100 rounded-xl inline-block">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Contacto Directo</p>
                <a 
                  href="mailto:soporte@innovasum.com.ar" 
                  className="text-lg md:text-xl font-black text-blue-600 no-underline hover:text-slate-900 transition-colors tracking-tight"
                >
                  soporte@innovasum.com.ar
                </a>
              </div>

              <p className="text-slate-400 text-xs italic leading-relaxed m-0">
                Nuestro equipo técnico revisará tu caso y se pondrá en contacto a la brevedad para indicarte los pasos a seguir.
              </p>
            </div>
          </div>
        </div>

        {/* Elegant Footer Signature */}
        <div className="mt-32 pb-20 text-center">
          <div className="bg-slate-200 h-px w-16 mx-auto mb-10"></div>
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.5em] mb-2">Innovasum</p>
          <p className="text-[10px] text-slate-400 font-medium tracking-wide">Excelencia en tecnología & soporte oficial</p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          background-color: #fafafa;
        }
      `}</style>
    </div>
  );
}
