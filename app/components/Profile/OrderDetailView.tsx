'use client';

import { FaArrowLeft, FaShoppingBag, FaTruck, FaCreditCard, FaMapMarkerAlt, FaCircle, FaBoxOpen, FaHistory, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    shippingCost?: number;
    shippingMethod?: string;
  };
  paymentMethod?: 'NAVE' | 'TRANSFERENCIA';
}

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
  onAction: () => void;
  isPaying: boolean;
}

export default function OrderDetailView({ order, onBack, onAction, isPaying }: OrderDetailViewProps) {
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = order.shippingAddress?.shippingCost || 0;

  const isPending = order.status === 'PENDING';
  const isReview = order.status === 'PENDING_REVIEW';
  const isApprovedOrShipped = ['APPROVED', 'SHIPPED'].includes(order.status);

  // Status UI logic
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { 
          icon: <FaCheckCircle size={24} />, 
          label: 'Pago Aprobado con Éxito', 
          color: 'text-emerald-600', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-100' 
        };
      case 'SHIPPED':
        return { 
          icon: <FaTruck size={24} />, 
          label: 'Pedido en Camino a Destino', 
          color: 'text-blue-600', 
          bg: 'bg-blue-50', 
          border: 'border-blue-100' 
        };
      case 'PENDING_REVIEW':
        return { 
          icon: <FaHistory size={24} />, 
          label: 'Esperando Confirmación de Pago', 
          color: 'text-amber-600', 
          bg: 'bg-amber-50', 
          border: 'border-amber-100' 
        };
      case 'CANCELLED':
        return { 
          icon: <FaExclamationCircle size={24} />, 
          label: 'Operación Cancelada', 
          color: 'text-red-500', 
          bg: 'bg-red-50', 
          border: 'border-red-100' 
        };
      default:
        return { 
          icon: <FaCreditCard size={24} />, 
          label: 'Pendiente de Gestión de Pago', 
          color: 'text-slate-500', 
          bg: 'bg-slate-50', 
          border: 'border-slate-100' 
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="animate-in slide-in-from-right-2 duration-500 pb-20">
      
      {/* Header with Back Button */}
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white hover:bg-slate-900 hover:text-white transition-all rounded-full flex items-center justify-center cursor-pointer border border-[#f1f5f9] group shadow-sm shadow-slate-100"
          >
            <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase m-0">Detalle de Operación</h2>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2">ID: {order.id.substring(0, 16).toUpperCase()}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
           {isApprovedOrShipped && (
              <Link 
                href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                className="px-8 py-4 bg-transparent border border-slate-900 text-slate-900 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-slate-900 hover:text-white transition-all no-underline text-center"
              >
                Seguir Envío
              </Link>
           )}
           {(isPending || isReview) && (
              <button 
                onClick={onAction}
                disabled={isPaying}
                className="px-8 py-4 bg-transparent border border-blue-600 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {order.paymentMethod === 'TRANSFERENCIA' ? 'Subir comprobante de pago' : 'Pagar pedido ahora'}
              </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        
        {/* Main Content Side */}
        <div className="xl:col-span-2 space-y-12">
          
          {/* Status Section - Professional Cards */}
          <div className={`border ${statusConfig.border} ${statusConfig.bg} p-8 flex flex-col md:flex-row justify-between items-center gap-8`}>
            <div className="flex items-center gap-6">
               <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white border border-[#f1f5f9] ${statusConfig.color}`}>
                  {statusConfig.icon}
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Situación de Orden</p>
                  <h3 className={`text-lg font-black uppercase tracking-tight ${statusConfig.color}`}>
                    {statusConfig.label}
                  </h3>
               </div>
            </div>
            <div className="md:text-right border-l md:border-l-0 md:border-r border-slate-200 md:pr-10 pl-10 md:pl-0 py-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1 opacity-60">Fecha Procesada</p>
               <p className="text-base font-bold text-slate-900 tracking-tight">
                 {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
               </p>
            </div>
          </div>

          {/* Items Section - Checkout List Style */}
          <div className="bg-white border border-[#f1f5f9] shadow-sm">
            <h3 className="text-[11px] font-black text-slate-900 bg-[#f8fafc] p-6 uppercase tracking-[0.4em] m-0 border-b border-[#f1f5f9]">
               Productos vinculados
            </h3>
            <div className="p-8">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-slate-50 last:border-0 hover:bg-[#fafbfc] transition-all px-4 -mx-4 group">
                  <div className="flex items-center gap-8">
                    <div className="w-10 h-10 bg-white border border-[#f1f5f9] rounded-full flex items-center justify-center text-[11px] font-black text-slate-400 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                      {item.quantity}x
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900 m-0 uppercase leading-none tracking-normal group-hover:text-blue-600 transition-colors">{item.name}</p>
                      <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-[0.1em]">Unitario: <span className="text-slate-400 font-black ml-1">${item.price.toLocaleString('es-AR')}</span></p>
                    </div>
                  </div>
                  <p className="text-base font-black text-slate-900 tracking-tight mt-6 sm:mt-0">${(item.price * item.quantity).toLocaleString('es-AR')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Summary */}
          {order.shippingAddress && (
            <div className="bg-white border border-[#f1f5f9] shadow-sm">
              <h3 className="text-[11px] font-black text-slate-900 bg-[#f8fafc] p-6 uppercase tracking-[0.4em] m-0 border-b border-[#f1f5f9] flex items-center gap-3">
                <FaTruck size={14} className="text-blue-600" /> Datos de Envío
              </h3>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Dirección de Entrega</p>
                  <p className="text-[15px] font-black tracking-tight text-slate-900 uppercase">
                    {order.shippingAddress.street}
                  </p>
                  <p className="text-[11px] mt-1 text-slate-400 font-bold uppercase tracking-[0.1em]">
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3">Método & Código Postal</p>
                   <p className="text-[13px] font-black text-slate-900 uppercase">
                     {order.shippingAddress.shippingMethod || 'Logística Andréani'}
                   </p>
                   <p className="text-[13px] mt-2 text-blue-600 font-black">C.P. {order.shippingAddress.zip}</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Totals Summary Sidebar Style */}
        <div className="space-y-8">
           <div className="bg-white border border-[#f1f5f9] shadow-sm p-8">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 flex items-center justify-between">
                <span>Resumen Económico</span>
                <FaCreditCard size={14} className="text-slate-200" />
              </h4>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</span>
                  <span className="text-[13px] font-black text-slate-900">${subtotal.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logística</span>
                  <span className="text-[13px] font-black text-emerald-600">{shippingCost === 0 ? 'SIN CARGO' : `$${shippingCost.toLocaleString('es-AR')}`}</span>
                </div>
                
                <div className="pt-8 mt-8 border-t border-[#f1f5f9] flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2 uppercase">Total Final</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">${order.total.toLocaleString('es-AR')}</span>
                </div>
              </div>
              
              <div className="mt-12 bg-slate-50 p-6 flex items-center gap-4">
                <FaHistory className="text-slate-300" size={14} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                  Esta es una liquidación confirmada. Para dudas, contactar vía soporte con el ID de orden.
                </p>
              </div>
           </div>
           
           <button 
             onClick={onBack}
             className="w-full py-5 bg-white border border-[#f1f5f9] text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-[0.4em] cursor-pointer"
           >
             Volver al Historial
           </button>
        </div>
        
      </div>
    </div>
  );
}
