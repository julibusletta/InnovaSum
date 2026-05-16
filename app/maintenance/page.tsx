'use client';

import { FaInstagram, FaWhatsapp, FaEnvelope, FaClock, FaTools } from 'react-icons/fa';

export default function MaintenancePage() {
  return (
    <div className="relative min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-x-hidden">
      <style jsx global>{`
        body, html { 
          background: #050505 !important; 
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Content */}
      <div className="max-w-3xl w-full text-center z-10 flex flex-col items-center space-y-12">
        {/* Animated Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white/5 backdrop-blur-xl p-8 rounded-none border border-white/10 shadow-2xl animate-bounce-slow">
            <FaTools className="text-white text-6xl" />
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-6 w-full flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none text-center">
            MUY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-500">PRONTO</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl font-medium max-w-xl leading-relaxed text-center px-4">
            Estamos renovando <span className="text-white font-bold">Innovasum</span> para ofrecerte la mejor tecnología con una experiencia de compra superior.
          </p>
        </div>

        {/* Progress Bar placeholder */}
        <div className="max-w-md w-full mx-auto space-y-3 px-6">
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 w-[85%] animate-shimmer"></div>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>Configurando Servidores</span>
            <span>85% Completado</span>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-8 w-full px-4">
          <a 
            href="https://wa.me/5491151457720" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 md:px-10 md:py-5 bg-white/5 border border-white/10 text-white font-black rounded-none flex items-center gap-3 hover:bg-white/10 hover:scale-[1.05] transition-all shadow-xl active:scale-95 text-sm md:text-base"
          >
            <FaWhatsapp size={22} className="text-[#25D366]" />
            <span className="whitespace-nowrap">CONSULTAS POR WHATSAPP</span>
          </a>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.instagram.com/innovasumarg/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-5 bg-white/5 border border-white/10 rounded-none text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaInstagram size={24} />
            </a>
            <a 
              href="mailto:contacto@innovasum.com.ar" 
              className="p-5 bg-white/5 border border-white/10 rounded-none text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <FaEnvelope size={24} />
            </a>
          </div>
        </div>

        {/* Footer Section */}
        <div className="pt-20 flex flex-col items-center gap-6">
          <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.4em]">INNOVASUM &copy; 2026</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        .animate-bounce-slow {
          animation: bounce 4s infinite ease-in-out;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
