'use client';

import React from 'react';
import '../styles/Pago.css';
import { FaCreditCard, FaQrcode, FaUniversity, FaShieldAlt } from 'react-icons/fa';

export default function MediosDePago() {
  return (
    <div className="pago-page">
      <div className="pago-container">
        <header className="pago-header">
          <h1>Medios de Pago</h1>
          <div className="title-line"></div>
        </header>

        <section className="pago-content text-left">
          <p className="lead-text font-bold text-xl text-slate-900 border-l-4 border-blue-600 pl-6 mb-8 mt-10">
            En Innovasum, tu seguridad es nuestra prioridad. Por eso elegimos la tecnología de cobro más robusta del mercado.
          </p>

          <p>
            Para garantizar que cada una de tus transacciones sea 100% segura, profesional y transparente, 
            hemos integrado <strong>Nave Negocios</strong>, la plataforma de pagos de última generación que cuenta con el 
            respaldo institucional del <strong>Banco Galicia</strong>.
          </p>

          <p>
            Esta alianza nos permite ofrecerte un entorno de compra protegido por los más altos estándares de 
            seguridad bancaria, brindándote la tranquilidad de que tus datos y tu inversión tecnológica 
            están en las mejores manos desde el inicio hasta el final del proceso.
          </p>

          <h2 className="text-2xl font-black text-slate-950 mt-16 mb-8 uppercase tracking-tight">Opciones de Pago Flexibles</h2>
          <p>
            A través de nuestra integración con Nave, podés abonar tus pedidos utilizando una amplia variedad de métodos:
          </p>

          <div className="payment-methods">
            <div className="method-item shadow-sm border border-slate-100">
              <div className="flex justify-center mb-4 text-blue-600">
                <FaCreditCard size={32} />
              </div>
              <h4>Tarjetas de Crédito y Débito</h4>
              <p>Aceptamos todas las tarjetas de todos los bancos: Visa, Mastercard, American Express, Cabal y más.</p>
            </div>

            <div className="method-item shadow-sm border border-slate-100">
              <div className="flex justify-center mb-4 text-orange-500">
                <FaQrcode size={32} />
              </div>
              <h4>Pagos con QR</h4>
              <p>Escaneá y pagá al instante utilizando tu billetera virtual de preferencia (Modo, Mercado Pago, etc).</p>
            </div>

            <div className="method-item shadow-sm border border-slate-100">
              <div className="flex justify-center mb-4 text-green-600">
                <FaUniversity size={32} />
              </div>
              <h4>Transferencias</h4>
              <p>Realizá transferencias bancarias directas con acreditación y verificación ágil.</p>
            </div>
          </div>

          <div className="trust-banner mt-20">
            <img 
              src="/images/nave-galicia.png" 
              alt="Respaldo Nave Negocios y Banco Galicia" 
              className="mx-auto"
            />
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-6">
              <FaShieldAlt className="inline mr-2" /> Transacción Protegida por Estándares Bancarios
            </p>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
