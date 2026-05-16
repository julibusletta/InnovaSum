'use client';

import { FaRobot, FaHeadset, FaCreditCard, FaTruck, FaFileInvoice, FaShieldAlt, FaGamepad, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function AyudaPage() {
  const helpOptions = [
    { key: 'A', label: 'Contactanos', icon: <FaHeadset /> },
    { key: 'B', label: 'Formas de Pago', icon: <FaCreditCard /> },
    { key: 'C', label: 'Envíos', icon: <FaTruck /> },
    { key: 'D', label: 'Facturación', icon: <FaFileInvoice /> },
    { key: 'E', label: 'Post Venta y Garantías', icon: <FaShieldAlt /> },
    { key: 'F', label: 'Canje de Juegos', icon: <FaGamepad /> },
  ];

  return (
    <div className="animate-in fade-in duration-700 max-w-2xl mx-auto">
      <div className="mb-10 border-b border-slate-100 pb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Centro de Ayuda</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Estamos para asistirte en lo que necesites.</p>
      </div>

      <div className="space-y-8">
        {/* Chatbot Style Message */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-bounce-subtle">
            <FaRobot size={24} />
          </div>
          <div className="bg-white border border-slate-200 rounded-3xl rounded-tl-none p-6 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative">
            <p className="text-slate-900 font-bold text-lg mb-4">
              ¡Hola! <span className="font-normal text-slate-500 text-base block mt-1">¿En qué podemos ayudarte hoy? Seleccioná una opción para empezar:</span>
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {helpOptions.map((option) => (
                <button 
                  key={option.key}
                  className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-900 transition-all duration-300 text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:bg-slate-800 group-hover:text-blue-400 shadow-sm transition-colors font-bold text-sm">
                    {option.key}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-white transition-colors">{option.label}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-center">
              <Link 
                href="/preguntas-frecuentes" 
                className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
              >
                Ver todas las preguntas <FaExternalLinkAlt size={10} />
              </Link>
            </div>
          </div>
        </div>

        {/* User prompt placeholder */}
        <div className="flex flex-col items-end gap-2 pr-2">
            <div className="px-5 py-3 bg-slate-100 text-slate-400 rounded-2xl rounded-tr-none text-xs font-bold uppercase tracking-widest italic border border-slate-200 opacity-50">
                Esperando tu selección...
            </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
