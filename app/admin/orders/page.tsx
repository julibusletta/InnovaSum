'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheckCircle, 
  FaClock, 
  FaTruck,
  FaTimesCircle,
  FaFileInvoiceDollar,
  FaTrash,
  FaPaperPlane,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';

interface Order {
  id: string;
  userEmail: string;
  userName?: string;
  userPhone?: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
  paymentMethod?: string;
  proofUrl?: string;
  proofUploadedAt?: string;
  invoiceUrl?: string;
  navePaymentId?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    shippingCost?: number;
    shippingMethod?: string;
  };
  trackingCode?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUploadingInvoice, setIsUploadingInvoice] = useState(false);
  const [isRecoveringEmail, setIsRecoveringEmail] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin/orders');
      const data = await resp.json();
      if (data.success) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const resp = await fetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'update_status', orderId, status: newStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const updateTrackingCode = async (orderId: string, trackingCode: string) => {
    try {
      const resp = await fetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'update_tracking', orderId, trackingCode }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        alert('Código de seguimiento actualizado');
        fetchOrders(); // Refresh table to keep data in sync
      } else {
        alert('Error al actualizar el seguimiento');
      }
    } catch (err) {
      console.error('Error updating tracking code:', err);
    }
  };

  const handleSendRecoveryEmail = async (orderId: string) => {
    if (!confirm('¿Deseas enviar el mail de recuperación a este cliente?')) return;
    
    try {
      setIsRecoveringEmail(true);
      const res = await fetch('/api/admin/orders/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Mail de recuperación enviado con éxito.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error sending recovery email:', error);
      alert('Error técnico al intentar enviar el mail.');
    } finally {
      setIsRecoveringEmail(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('¿Estás seguro que deseas ELIMINAR FÍSICAMENTE esta orden? Esta acción NO se puede deshacer.')) return;
    
    try {
      const resp = await fetch('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_order', orderId }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (resp.ok) {
        fetchOrders();
      } else {
        alert('Hubo un error al eliminar el pedido.');
      }
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5 w-fit";
    const s = (status || 'pending').toLowerCase();
    
    if (s === 'pagado' || s === 'approved' || s === 'paid') 
      return <span className={`${base} bg-emerald-50 text-emerald-600`}>Aprobado</span>;
    if (s === 'pendiente' || s === 'pending') 
      return <span className={`${base} bg-slate-50 text-slate-400`}>Pendiente</span>;
    if (s === 'pending_review' || s === 'revisión') 
      return <span className={`${base} bg-amber-50 text-amber-600`}>En Revisión</span>;
    if (s === 'enviado' || s === 'shipped') 
      return <span className={`${base} bg-blue-50 text-blue-600`}>Enviado</span>;
    if (s === 'cancelado' || s === 'cancelled') 
      return <span className={`${base} bg-red-50 text-red-600`}>Cancelado</span>;
    
    return <span className={`${base} bg-gray-50 text-gray-400`}>{status}</span>;
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.id || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (o.userEmail || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.userName && o.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    if (filterStatus !== 'todos') {
      const s = (o.status || "").toLowerCase();
      if (filterStatus === 'pendiente') matchesFilter = (s === 'pendiente' || s === 'pending');
      else if (filterStatus === 'revision') matchesFilter = (s === 'pending_review');
      else if (filterStatus === 'pagado') matchesFilter = (s === 'pagado' || s === 'approved' || s === 'paid');
      else matchesFilter = s === filterStatus;
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse font-medium">Cargando pedidos...</div>;

  return (
    <div className="animate-fadeIn relative">
      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                 <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 leading-none">Orden #{selectedOrder.id?.slice(-8).toUpperCase() || '---'}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-widest">Detalle Operativo del Pedido</p>
                    <p className="text-[9px] font-bold text-[#058c8c] uppercase mt-1.5 tracking-[0.15em]">
                       Realizado el: {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '---'} HS
                    </p>
                 </div>
                 <button 
                   onClick={() => setSelectedOrder(null)}
                   className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 transition-all bg-white rounded-full border border-gray-100 shadow-sm cursor-pointer"
                 >
                   <FaTimesCircle size={24} />
                 </button>
              </div>

              {/* Modal Body - Stacked Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white" style={{ minHeight: '350px' }}>
                 <div className="flex flex-col gap-6">
                    
                    {/* Bloque 1: Cliente y Pago */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                       <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-200 pb-2">Información de Venta</h4>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                          <div className="flex flex-col">
                             <span className="text-[8px] text-gray-500 font-bold uppercase mb-0.5">Cliente:</span>
                             <span className="text-sm font-black text-gray-800">{selectedOrder.userName || 'No especificado'}</span>
                             <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium text-[#058c8c]">{selectedOrder.userEmail || 'Sin email'}</span>
                                {selectedOrder.userPhone && (
                                   <a 
                                      href={`https://wa.me/${selectedOrder.userPhone.replace(/\D/g, '')}`} 
                                      target="_blank" 
                                      className="flex items-center gap-1.5 bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter hover:bg-emerald-200 transition-colors no-underline"
                                   >
                                      <FaWhatsapp size={10} />
                                      WhatsApp
                                   </a>
                                )}
                             </div>
                             {selectedOrder.userPhone && (
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Tel: {selectedOrder.userPhone}</span>
                             )}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] text-gray-500 font-bold uppercase mb-0.5">Medio de Pago:</span>
                             <span className="text-sm font-black text-gray-800 uppercase">{selectedOrder.paymentMethod || 'NAVE'}</span>
                             {selectedOrder.navePaymentId && (
                                <span className="text-[9px] font-mono text-gray-400 break-all leading-tight mt-1">ID: {selectedOrder.navePaymentId}</span>
                             )}
                          </div>
                       </div>
                    </div>

                    {/* Bloque 2: Logística */}
                    <div className="bg-amber-50/40 rounded-xl p-5 border border-amber-100">
                       <h4 className="text-[9px] font-black text-amber-600/80 uppercase tracking-[0.2em] mb-4 border-b border-amber-200/40 pb-2">Envío / Entrega</h4>
                       {selectedOrder.shippingAddress ? (
                          <div className="space-y-3">
                             <div>
                                <p className="text-sm font-black text-gray-800 uppercase m-0 leading-tight">{selectedOrder.shippingAddress?.street || 'Sin dirección registrada'}</p>
                                <p className="text-[11px] font-bold text-gray-500 uppercase mt-1">
                                   {selectedOrder.shippingAddress?.city || '---'}, {selectedOrder.shippingAddress?.state || '---'} ({selectedOrder.shippingAddress?.zip || '---'})
                                </p>
                             </div>
                             <div className="flex justify-between items-center pt-3 border-t border-amber-200/60 mt-3">
                                <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{selectedOrder.shippingAddress?.shippingMethod || 'ENVÍO'}</span>
                                <span className="text-sm font-black text-gray-800">
                                   {typeof selectedOrder.shippingAddress?.shippingCost === 'number' 
                                      ? (selectedOrder.shippingAddress.shippingCost === 0 ? 'GRATIS' : `$${selectedOrder.shippingAddress.shippingCost.toLocaleString()}`) 
                                      : '---'}
                                </span>
                             </div>
                          </div>
                       ) : (
                          <p className="text-[10px] text-gray-400 font-bold italic uppercase m-0">No se especificó dirección de envío.</p>
                       )}
                    </div>

                    {/* Bloque 3: Productos */}
                    <div>
                       <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-100 pb-2">Artículos y Totales</h4>
                       <div className="space-y-1.5 mb-5">
                          {selectedOrder.items?.map((item: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-3 rounded border border-gray-100 group transition-colors hover:bg-gray-100/50">
                                <div className="flex-1">
                                   <p className="text-[11px] font-black text-gray-900 uppercase leading-none mb-1.5">{item?.name || 'Item Desconocido'}</p>
                                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">CANTIDAD: {item?.quantity || 1} • PRECIO: ${item?.price?.toLocaleString() || '0'}</span>
                                </div>
                                <span className="text-xs font-black text-gray-900">${((item?.price || 0) * (item?.quantity || 1)).toLocaleString()}</span>
                             </div>
                          ))}
                          {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                            <p className="text-[10px] text-gray-300 italic text-center py-4 uppercase font-bold tracking-widest">Sin productos registrados</p>
                          )}
                       </div>
                       
                       <div className="bg-[#058c8c] p-5 text-white rounded-xl shadow-xl shadow-[#058c8c]/20 flex justify-between items-center border border-[#047777]">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total de la Orden</span>
                          <span className="text-3xl font-black tracking-tighter leading-none">${(selectedOrder.total || 0).toLocaleString()}</span>
                       </div>
                    </div>

                    {/* Bloque 4: Comprobante (Si existe) */}
                    {selectedOrder.proofUrl && (
                       <div className="mt-4">
                          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 border-b border-gray-100 pb-2">Comprobante de Pago</h4>
                          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group h-64 border-dashed border-2">
                             <img src={selectedOrder.proofUrl} className="w-full h-full object-contain" alt="Comprobante" />
                             <a 
                                href={selectedOrder.proofUrl} 
                                target="_blank" 
                                className="absolute bottom-4 right-4 px-5 py-2.5 bg-black text-white font-black text-[9px] uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-2xl hover:scale-105"
                             >
                                Ver Pantalla Completa
                             </a>
                          </div>
                       </div>
                    )}

                    {/* Bloque 5: Envío y Seguimiento */}
                    <div className="bg-blue-50/40 rounded-xl p-5 border border-blue-100 mt-4">
                       <h4 className="text-[9px] font-black text-blue-600/80 uppercase tracking-[0.2em] mb-4 border-b border-blue-200/40 pb-2 flex items-center gap-2">
                          <FaTruck /> Código de Seguimiento
                       </h4>
                       <div className="flex gap-3">
                          <input 
                             type="text"
                             placeholder="Ej: AR123456789"
                             className="flex-1 px-4 py-2 bg-white border border-gray-200 rounded text-xs font-bold uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                             value={selectedOrder.trackingCode || ''}
                             onChange={(e) => {
                                const val = e.target.value;
                                setSelectedOrder({ ...selectedOrder, trackingCode: val });
                             }}
                          />
                          <button 
                             onClick={() => updateTrackingCode(selectedOrder.id, selectedOrder.trackingCode || '')}
                             className="px-4 py-2 bg-blue-600 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100"
                          >
                             Guardar
                          </button>
                       </div>
                       <p className="text-[8px] text-gray-400 font-bold uppercase mt-2 italic">* Este código se mostrará al cliente en su sección "Mis Compras".</p>
                    </div>
                 </div>
              </div>

              {/* Modal Footer - Actions */}
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center justify-between">
                 <div className="flex gap-3">
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'APPROVED')}
                      className="px-6 py-3 bg-emerald-600 text-white rounded font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition active:scale-95"
                    >
                      Aprobar Pago
                    </button>
                    {(selectedOrder.status?.toLowerCase() === 'pending' || selectedOrder.status?.toLowerCase() === 'pending_review' || selectedOrder.status?.toLowerCase() === 'pendiente') && (
                      <button 
                        onClick={() => handleSendRecoveryEmail(selectedOrder.id)}
                        disabled={isRecoveringEmail}
                        className="px-6 py-3 bg-[#405D99] text-white rounded font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 hover:bg-[#344e82] transition flex items-center gap-2 disabled:opacity-50 active:scale-95"
                      >
                        <FaEnvelope size={12} />
                        {isRecoveringEmail ? 'ENVIANDO...' : 'ENVIAR RECORDATORIO'}
                      </button>
                    )}
                    <button 
                      onClick={() => updateStatus(selectedOrder.id, 'CANCELLED')}
                      className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition active:scale-95"
                    >
                      Cancelar
                    </button>
                 </div>
                 
                 <div className="min-w-[150px]">
                    <select 
                      value={selectedOrder.status?.toLowerCase()}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded font-bold text-[10px] uppercase tracking-widest text-gray-600 focus:border-[#058c8c] outline-none shadow-sm transition-all"
                    >
                       <option value="pending">Pendiente</option>
                       <option value="pending_review">En Revisión</option>
                       <option value="approved">Aprobado</option>
                       <option value="shipped">Enviado</option>
                       <option value="cancelled">Cancelado</option>
                    </select>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header Wrapper */}
      <div className="flex flex-col gap-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="admin-v2-page-title mb-1">Pedidos</h1>
            <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
              <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
              <span>/</span>
              <span className="text-gray-900">Ventas</span>
            </nav>
          </div>
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded text-xs font-bold hover:shadow-lg transition flex items-center gap-2 uppercase tracking-widest border-0 cursor-pointer">
            <FaFileInvoiceDollar /> Exportar CSV
          </button>
        </div>

        {/* Search and Filters */}
        <div className="admin-v2-card p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Buscar por ID, Email o Nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm transition focus:border-[#058c8c] focus:bg-white font-medium"
            />
          </div>
          <div className="w-full md:w-64 relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2.8 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-xs font-bold text-gray-600 appearance-none cursor-pointer focus:border-[#058c8c] uppercase tracking-widest"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="revision">En Revisión</option>
              <option value="pagado">Pagados / Aprobados</option>
              <option value="enviado">Enviados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-v2-card overflow-hidden mb-20 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-6 py-5">Pedido / Fecha</th>
                  <th className="px-6 py-5">Cliente</th>
                  <th className="px-6 py-5 w-40">Total</th>
                  <th className="px-6 py-5 w-40">Estado</th>
                  <th className="px-6 py-5 w-24 text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-gray-900 tracking-tight">#{order.id?.slice(-8).toUpperCase() || '---'}</span>
                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }) : '---'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-black text-gray-800 uppercase leading-none mb-1.5">{order.userName || 'No especificado'}</span>
                         <span className="text-[10px] font-medium text-[#058c8c] lowercase">{order.userEmail || '---'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-gray-900 tracking-tighter">${order.total?.toLocaleString() || '0'}</span>
                    </td>
                    <td className="px-6 py-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-6 text-center">
                        <div className="flex justify-center gap-2.5">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-300 rounded-lg hover:border-emerald-500 hover:text-emerald-500 transition-all cursor-pointer shadow-sm active:scale-95" title="Ver detalle">
                            <FaEye size={16} />
                          </button>
                          <button 
                            onClick={() => deleteOrder(order.id)}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer shadow-sm active:scale-95" title="Eliminar definitivamente">
                            <FaTrash size={14} />
                          </button>
                        </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-24 text-center text-gray-300 font-black uppercase tracking-[0.4em] text-[10px]">
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
