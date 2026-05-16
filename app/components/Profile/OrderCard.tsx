'use client';

import { useState } from 'react';
import { FaShoppingBag, FaChevronRight, FaRegEye, FaCreditCard, FaTruck, FaSpinner, FaUpload, FaMapMarkerAlt, FaCircle, FaHistory } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface OrderCardProps {
  order: Order;
  onViewDetail?: () => void;
}

export default function OrderCard({ order, onViewDetail }: OrderCardProps) {
  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);

  const handleAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (order.paymentMethod === 'TRANSFERENCIA') {
      router.push(`/checkout/transfer/${order.id}`);
      return;
    }

    try {
      setIsPaying(true);
      const response = await fetch('/api/checkout/nave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          items: order.items,
          total: order.total,
          shipping: {
            cost: order.shippingAddress?.shippingCost || 0,
            method: order.shippingAddress?.shippingMethod || 'Estándar',
            address: {
              street: order.shippingAddress?.street?.split(' ')[0] || '',
              number: order.shippingAddress?.street?.split(' ')[1] || '',
              city: order.shippingAddress?.city || '',
              state: order.shippingAddress?.state || '',
              zipCode: order.shippingAddress?.zip || ''
            }
          }
        }),
      });

      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago: ' + data.message);
      }
    } catch (error) {
      console.error('Error restarting payment:', error);
      alert('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
    } finally {
      setIsPaying(false);
    }
  };

  const handleViewDetail = () => {
    if (onViewDetail) {
      onViewDetail();
    } else {
      router.push('/mi-cuenta/compras');
    }
  };

  const isPending = order.status === 'PENDING';
  const isReview = order.status === 'PENDING_REVIEW';
  const isApprovedOrShipped = ['APPROVED', 'SHIPPED'].includes(order.status);

  // Subtle Status Styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'SHIPPED':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING_REVIEW':
        return 'bg-blue-50 text-blue-500 border-blue-100';
      case 'CANCELLED':
        return 'bg-red-50 text-red-400 border-red-100';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Pago Aprobado';
      case 'SHIPPED': return 'Pedido Enviado';
      case 'PENDING_REVIEW': return 'En Revisión';
      case 'CANCELLED': return 'Cancelado';
      default: return 'Pendiente de Pago';
    }
  };

  return (
    <div 
      className="bg-white border border-[#f1f5f9] transition-all hover:bg-[#fcfdff] group cursor-pointer"
      onClick={handleViewDetail}
    >
      <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Order Identification */}
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full border border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-center text-slate-300">
            <FaShoppingBag size={18} />
          </div>
          <div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black tracking-[0.2em] text-slate-900 uppercase">
                #{order.id.substring(0, 8).toUpperCase()}
              </span>
              <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusStyles(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <p className="text-[9px] font-black uppercase mt-2 tracking-[0.15em] text-slate-400 opacity-60">
              {new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center md:justify-end gap-10 w-full md:w-auto">
          
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-1">Monto Total</span>
            <span className="text-lg font-black tracking-tight text-slate-900">${order.total.toLocaleString('es-AR')}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Conditional Action Button */}
            {(isPending || isReview) && (
              <button 
                onClick={handleAction}
                disabled={isPaying}
                className="flex items-center gap-3 px-8 py-3.5 bg-transparent border border-blue-600 text-blue-600 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
              >
                {isPaying ? <FaSpinner className="animate-spin" size={12} /> : (order.paymentMethod === 'TRANSFERENCIA' ? <FaUpload size={12} /> : <FaCreditCard size={12} />)}
                <span>
                  {isPaying ? '...' : 
                   isReview ? 'Ver Comprobante' : 
                   order.paymentMethod === 'TRANSFERENCIA' ? 'Subir comprobante de pago' : 'Pagar Ahora'}
                </span>
              </button>
            )}

            {isApprovedOrShipped && (
              <Link 
                href={`/mi-cuenta/seguimiento?orderId=${order.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 px-8 py-3.5 bg-transparent border border-slate-900 text-slate-900 font-black text-[9px] uppercase tracking-[0.3em] hover:bg-slate-900 hover:text-white transition-all no-underline"
              >
                <FaTruck size={12} />
                <span>Seguir Envío</span>
              </Link>
            )}

            <div className="w-10 h-10 flex items-center justify-center text-slate-200 group-hover:text-blue-600 transition-all">
              <FaChevronRight size={14} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
