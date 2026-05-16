'use client';

import { useState } from 'react';
import { FaCheckCircle, FaTimes, FaExternalLinkAlt, FaFileDownload, FaSpinner } from 'react-icons/fa';

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
  invoiceUrl?: string;
  trackingCode?: string;
}

interface InvoicesManagerProps {
  orders: Order[];
}

export default function InvoicesManager({ orders }: InvoicesManagerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'SHIPPED':
      case 'DELIVERED':
        return '#009052'; // Green
      case 'CANCELLED':
      case 'REJECTED':
        return '#FD0002'; // Red
      default:
        return '#FFB400'; // Orange
    }
  };

  const getStatusLabelShort = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Aprobado';
      case 'SHIPPED': return 'Enviado';
      case 'CANCELLED': return 'Cancelado';
      case 'REJECTED': return 'Rechazado';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="w-full">
      {/* Table Container */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">N° Compra</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Fecha</th>
              <th className="py-8 px-4 text-right text-sm font-bold text-gray-700 uppercase tracking-tight">Total</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Estado</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Pago</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Detalle</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Correo</th>
              <th className="py-8 px-4 text-center text-sm font-bold text-gray-700 uppercase tracking-tight">Factura</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusColor = getStatusColor(order.status);
              
              return (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-10 px-4 text-center text-sm text-gray-600 font-medium font-sans">
                    {order.id.slice(0, 8).toUpperCase()}
                  </td>
                  <td className="py-10 px-4 text-center text-sm text-gray-600 font-sans">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </td>
                  <td className="py-10 px-4 text-right text-sm text-gray-800 font-bold font-sans">
                    ${order.total.toLocaleString('es-AR')}
                  </td>
                  <td className="py-10 px-4 text-center">
                    <span 
                      className="px-6 py-2.5 text-[11px] font-bold text-white uppercase rounded-md inline-block shadow-sm"
                      style={{ backgroundColor: statusColor }}
                    >
                      {getStatusLabelShort(order.status)}
                    </span>
                  </td>
                  <td className="py-10 px-4 text-center">
                    {order.status === 'APPROVED' || order.status === 'SHIPPED' || order.status === 'DELIVERED' ? (
                      <FaCheckCircle style={{ color: statusColor }} size={24} className="inline-block" />
                    ) : (
                      <span className="font-bold text-[11px] uppercase" style={{ color: '#FFB400' }}>PENDIENTE</span>
                    )}
                  </td>
                  <td className="py-10 px-4 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-2.5 text-[11px] font-bold text-white uppercase rounded-md transition-all bg-[#405D99] border-0 cursor-pointer shadow-sm hover:brightness-110"
                    >
                      Ver pedido
                    </button>
                  </td>
                  <td className="py-10 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <img src="/images/andreani.png" alt="Andreani" className="h-14 w-auto object-contain" />
                    </div>
                  </td>
                  <td className="py-10 px-4 text-center">
                    {order.invoiceUrl ? (
                      <a 
                        href={order.invoiceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 text-[11px] font-bold text-white uppercase rounded-md transition-all bg-emerald-600 border-0 cursor-pointer shadow-sm hover:bg-emerald-700 inline-flex items-center gap-2 no-underline"
                      >
                        <FaFileDownload size={14} />
                        Descargar
                      </a>
                    ) : (
                      <span className="text-gray-300 font-bold text-[10px] uppercase italic tracking-widest">Pendiente</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 m-0 uppercase flex-1">DETALLE DEL PEDIDO</h2>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 bg-transparent border-0 cursor-pointer"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {/* Order Info Box */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] mb-8">
                <p className="text-sm text-gray-600 mb-1">N°: <span className="font-bold text-black">{selectedOrder.id.slice(0, 8).toUpperCase()}</span></p>
                <p className="text-sm text-gray-600 m-0">Fecha: <span className="font-bold text-black">{new Date(selectedOrder.createdAt).toLocaleDateString('es-AR')}</span></p>
              </div>

              {/* Products */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 mb-2 font-sans">Productos:</h3>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="text-sm text-gray-600 leading-relaxed transition-colors hover:text-blue-600">
                    {item.name} X {item.quantity} = <span className="font-bold text-black font-sans">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-lg font-bold text-gray-800 mb-1 font-sans">Total Precio Especial: ${selectedOrder.total.toLocaleString('es-AR')}</p>
                <p className="text-[11px] text-gray-400 italic m-0">*Precios vigentes al día de la fecha.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex justify-center">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-10 py-3 bg-gray-400 hover:bg-gray-500 text-white font-bold rounded shadow-sm transition-all border-0 cursor-pointer uppercase text-xs"
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {orders.length === 0 && (
        <div className="py-20 text-center text-gray-400 font-medium uppercase tracking-widest text-sm">
          No hay facturas disponibles por el momento.
        </div>
      )}
    </div>
  );
}
