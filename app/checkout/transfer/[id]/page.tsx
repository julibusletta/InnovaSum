'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaCheckCircle, 
  FaInfoCircle, 
  FaUpload, 
  FaHome, 
  FaCopy, 
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaUniversity,
  FaArrowLeft,
  FaSpinner,
  FaCalendarAlt
} from 'react-icons/fa';

export default function TransferPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const BANK_DATA = {
    BANCO: "BANCO GALICIA",
    TITULAR: "JULIAN BUSLETTA",
    CBU: "0070695330004003192534",
    ALIAS: "innovasum.galicia",
    N_CUENTA: "4003192-5 695-3",
    CUIT: "20-37991025-5"
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const resp = await fetch(`/api/checkout/verify/${id}`);
        const data = await resp.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('orderId', id as string);

    try {
      const resp = await fetch('/api/checkout/proof', {
        method: 'POST',
        body: formData
      });
      const data = await resp.json();
      if (data.success) {
        setUploadSuccess(true);
      }
    } catch (err) {
      console.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <FaSpinner className="animate-spin text-blue-600" size={32} />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Validando Operación...</p>
       </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
       <div className="bg-white border border-[#f1f5f9] p-12 text-center max-w-md">
          <FaExclamationTriangle className="text-red-500 mx-auto mb-6" size={40} />
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-4">Orden No Encontrada</h2>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed uppercase tracking-wider">La orden solicitada no existe o no tienes permisos para verla.</p>
          <button onClick={() => router.push('/')} className="px-10 py-4 border border-slate-900 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all">Regresar a Tienda</button>
       </div>
    </div>
  );

  const deadline = new Date(order.createdAt || Date.now());
  deadline.setDate(deadline.getDate() + 2);

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-56 pb-20 px-4 md:px-10 flex flex-col items-center">
      <style jsx global>{`
        @keyframes pulse-soft {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(251, 191, 36, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(251, 191, 36, 0); }
        }
        .animate-pulse-soft {
          animation: pulse-soft 2.5s infinite ease-in-out;
        }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col gap-10">
        
        {/* Main Status Card */}
        <div className="bg-white border border-[#f1f5f9] shadow-sm p-10 md:p-16 flex flex-col items-center text-center">
          
          <div className="w-32 h-32 bg-white border border-amber-100 rounded-full flex items-center justify-center mb-10 animate-pulse-soft">
             <div className="flex flex-col items-center text-amber-500">
                <FaExclamationTriangle size={48} />
                <span className="text-[9px] font-black mt-3 tracking-[0.2em] uppercase">Pendiente</span>
             </div>
          </div>
          
          <div className="max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[1px] bg-amber-200"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Verificación de Reserva</span>
              <div className="w-6 h-[1px] bg-amber-200"></div>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-snug mb-6">
              RESERVA <b className="text-blue-600">{order.id.split('-').pop()?.toUpperCase()}</b> CONFIRMADA.<br />
              <span className="text-slate-500">REALIZA EL PAGO PARA FINALIZAR.</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-[0.1em] mb-12">
              LA RESERVA ESTARÁ ACTIVA HASTA EL <b className="text-slate-900">{deadline.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</b>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className={`cursor-pointer px-10 py-5 bg-transparent border border-blue-600 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                <span>{uploading ? 'Procesando...' : 'SUBIR COMPROBANTE DE PAGO'}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
              </label>
              
              <button 
                onClick={() => router.push('/')}
                className="px-10 py-5 bg-transparent border border-slate-900 text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <FaHome /> VOLVER AL INICIO
              </button>
            </div>

            {uploadSuccess && (
              <div className="mt-10 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4">
                <FaCheckCircle /> Comprobante subido con éxito, validaremos tu pago a la brevedad.
              </div>
            )}
          </div>
        </div>

        {/* Bank Details - Minimalist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           
           {/* Transfer Core Data */}
           <div className="bg-white border border-[#f1f5f9] shadow-sm">
              <div className="bg-[#f8fafc] border-b border-[#f1f5f9] p-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FaUniversity className="text-blue-600" size={20} />
                  <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-slate-900">DATOS BANCARIOS</h3>
                </div>
                <span className="px-3 py-1 bg-white border border-[#f1f5f9] text-[9px] font-black tracking-widest text-slate-400 uppercase">GALICIA</span>
              </div>
              
              <div className="p-10 space-y-10">
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">CBU / CVU</span>
                  <div className="flex items-center justify-between group">
                    <span className="font-mono text-lg font-black tracking-tighter text-slate-900">{BANK_DATA.CBU}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_DATA.CBU, 'cbu')}
                      className={`p-2 transition-all ${copiedField === 'cbu' ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-600'} cursor-pointer bg-transparent border-0`}
                    >
                      {copiedField === 'cbu' ? '¡COPIADO!' : <FaCopy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">ALIAS DE CUENTA</span>
                  <div className="flex items-center justify-between group">
                    <span className="text-lg font-black tracking-tight text-slate-900 uppercase">{BANK_DATA.ALIAS}</span>
                    <button 
                      onClick={() => copyToClipboard(BANK_DATA.ALIAS, 'alias')}
                      className={`p-2 transition-all ${copiedField === 'alias' ? 'text-emerald-500' : 'text-slate-200 hover:text-blue-600'} cursor-pointer bg-transparent border-0`}
                    >
                      {copiedField === 'alias' ? '¡COPIADO!' : <FaCopy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-4 border-t border-slate-50 mt-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">CUIT Titular</span>
                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{BANK_DATA.CUIT}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">Número de Cuenta</span>
                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{BANK_DATA.N_CUENTA}</p>
                  </div>
                </div>
              </div>
           </div>

           {/* Second Column - Payment Details & Total */}
           <div className="flex flex-col gap-8">
              <div className="bg-white border border-[#f1f5f9] shadow-sm flex-1">
                <div className="bg-[#f8fafc] border-b border-[#f1f5f9] p-8">
                  <div className="flex items-center gap-4">
                    <FaFileInvoiceDollar className="text-emerald-500" size={20} />
                    <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-slate-900">Monto del Pago</h3>
                  </div>
                </div>
                <div className="p-10 flex flex-col justify-center h-[calc(100%-80px)]">
                  <div className="space-y-2 text-right">
                    <span className="text-[9px] text-slate-300 font-black uppercase tracking-[0.3em]">IMPORTE TOTAL A ABONAR</span>
                    <p className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                      ${order.total?.toLocaleString('es-AR')}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest pt-2">
                       (Incluye descuento por transferencia)
                    </p>
                  </div>
                </div>
              </div>

              {/* Advice Box */}
              <div className="bg-blue-50/50 border border-blue-100 p-8 flex gap-6">
                <FaInfoCircle className="text-blue-400 shrink-0" size={20} />
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-blue-800 uppercase tracking-[0.2em] leading-none">IMPORTANTE</h4>
                  <p className="text-[10px] text-blue-700/70 font-medium uppercase tracking-[0.05em] leading-relaxed">
                    LAS TRANSFERENCIAS SON INMEDIATAS. SI UTILIZAS UN CAJERO MANUAL, RECUERDA QUE LA ACREDITACIÓN PUEDE DEMORAR HASTA 24HS HÁBILES.
                  </p>
                </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}
