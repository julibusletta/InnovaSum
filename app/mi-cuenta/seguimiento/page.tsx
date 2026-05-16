import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FaTruck, FaBox, FaCheckCircle, FaMapMarkerAlt, FaCircle, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';

export default async function SeguimientoPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  const userOrders = await db.getOrdersByEmail(session.user.email);
  const activeOrder = userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const orderDate = new Date(activeOrder?.createdAt || Date.now());
  const formatDate = (date: Date) => date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  const estimatedArrival = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000);

  const steps = [
    { label: 'Pedido Realizado', date: formatDate(orderDate), status: 'completed' },
    { label: 'Procesando Pago', date: formatDate(orderDate), status: 'completed' },
    { label: 'En Preparación', date: formatDate(orderDate), status: 'current' },
    { label: 'Enviado', date: '-', status: 'pending' },
    { label: 'Entregado', date: '-', status: 'pending' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-[2px] bg-blue-600"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Logística de Envíos</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase m-0">Estado de Seguimiento</h1>
        <p className="text-slate-500 text-[11px] mt-2 font-bold uppercase tracking-[0.1em] opacity-40">Rastreo en tiempo real y detalles del despacho.</p>
      </div>

      {activeOrder ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
          
          {/* Tracking Status Card */}
          <div className="xl:col-span-2 space-y-10">
            <div className="bg-white border border-[#f1f5f9] p-10 shadow-sm">
               
               <div className="flex items-center gap-6 mb-12 pb-8 border-b border-[#f1f5f9]">
                   <div className="w-14 h-14 bg-[#f8fafc] text-blue-600 rounded-full flex items-center justify-center border border-blue-50">
                     <FaTruck size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Estado: En Preparación</h3>
                     <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] mt-2">Llegada estimada aproximada: <span className="text-blue-600 font-black ml-1 uppercase">{formatDate(estimatedArrival)}</span></p>
                   </div>
               </div>

               {/* Timeline Stepper - Minimalist */}
               <div className="relative pl-4 mt-8">
                  {/* Vertical Line */}
                  <div className="absolute left-[23px] top-6 bottom-6 w-[1px] bg-[#f1f5f9]" />
                  
                  <div className="space-y-24">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-8 relative z-10 transition-all">
                        {/* Dot Container */}
                        <div className="shrink-0 flex items-center justify-center">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                             step.status === 'completed' ? 'bg-emerald-500 text-white' : 
                             step.status === 'current' ? 'bg-blue-600 text-white ring-8 ring-blue-100/30' : 
                             'bg-white border border-slate-200 text-slate-200'
                           }`}>
                             {step.status === 'completed' ? <FaCheckCircle size={12} /> : <FaCircle size={6} />}
                           </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <p className={`font-black text-[13px] uppercase tracking-wider ${step.status === 'pending' ? 'text-slate-300' : 'text-slate-900'}`}>{step.label}</p>
                          <p className={`text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 border border-transparent ${
                            step.status === 'pending' ? 'text-slate-200' : 'text-slate-400 bg-[#f8fafc] border-[#f1f5f9]'
                          }`}>{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Details Sidebar - With More Spacing ("Aire") */}
          <div className="space-y-10">
             <div className="bg-white border border-[#f1f5f9] p-10 shadow-sm space-y-14">
                
                {/* Official Guide Tag */}
                <div className="py-6 px-8 bg-slate-50 border-l-4 border-blue-600">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 opacity-60">ID de Seguimiento</p>
                   <p className="text-[14px] font-black text-slate-900 uppercase tracking-widest select-all">JB-{activeOrder.id.substring(0, 8).toUpperCase()}</p>
                </div>

                <div className="space-y-16">
                   {/* Product Section */}
                   <div className="pb-2">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-5 flex items-center gap-3">
                         <FaBox className="text-blue-600" size={14} /> Contenido del Envío
                      </h4>
                      <div className="pl-7">
                        <p className="text-[15px] font-medium text-slate-600 uppercase leading-relaxed tracking-tight">
                          {activeOrder.items[0]?.name || 'Producto en proceso'}
                        </p>
                        {activeOrder.items.length > 1 && (
                          <p className="text-[10px] text-slate-400 font-medium mt-2 uppercase tracking-widest">+ {activeOrder.items.length - 1} producto(s) adicionales</p>
                        )}
                      </div>
                   </div>

                   {/* Delivery Point */}
                   <div className="pt-2">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-5 flex items-center gap-3">
                         <FaMapMarkerAlt className="text-blue-600" size={14} /> Punto de Entrega
                      </h4>
                      <div className="pl-7">
                        <p className="text-[15px] font-medium text-slate-600 uppercase tracking-tight leading-relaxed">
                          {(session.user as any).address?.street} {(session.user as any).address?.number}
                        </p>
                        <p className="text-[11px] mt-2 text-slate-400 font-medium uppercase tracking-[0.1em]">
                          {(session.user as any).address?.city}, {(session.user as any).address?.state}
                        </p>
                        <p className="text-[12px] mt-4 text-blue-600 font-bold tracking-widest">C.P. {(session.user as any).address?.zip}</p>
                      </div>
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#f1f5f9]">
                   <div className="flex items-center gap-3 text-slate-400">
                      <FaInfoCircle size={12} />
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] m-0">Sincronizado hace unos instantes</p>
                   </div>
                </div>
             </div>

             <div className="bg-[#f8fafc] border border-[#f1f5f9] p-8 flex items-center gap-6">
                <FaCalendarAlt size={20} className="text-slate-200" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
                  Recuerda presentar tu DNI al momento de la entrega o retiro en sucursal.
                </p>
             </div>
          </div>

        </div>
      ) : (
        <div className="bg-[#f8fafc] border border-dashed border-[#e2e8f0] p-24 text-center">
            <div className="w-16 h-16 bg-white border border-[#f1f5f9] rounded-full flex items-center justify-center text-slate-200 mx-auto mb-8 shadow-sm">
              <FaTruck size={24} />
            </div>
            <h3 className="text-slate-900 font-black text-xl mb-4 uppercase tracking-tighter">Sin envíos activos</h3>
            <p className="text-slate-400 text-[11px] max-w-xs mx-auto mb-8 font-bold uppercase tracking-widest opacity-40">Tu historial de seguimiento aparecerá aquí una vez que el pedido sea despachado.</p>
        </div>
      )}
    </div>
  );
}
