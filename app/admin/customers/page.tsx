'use client';

import React, { useState, useEffect } from 'react';
import { FaUsers, FaSearch, FaEnvelope, FaPhone, FaWhatsapp, FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';

interface Customer {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dni?: string;
  type: 'REGISTRADO' | 'INVITADO';
  orderCount: number;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin/customers');
      const data = await resp.json();
      if (data.success) {
        setCustomers(data.customers);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm)
  );

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400 animate-pulse font-medium">Cargando clientes...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="admin-v2-page-title mb-1">Clientes</h1>
            <p className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
               Base de datos de usuarios registrados y compradores
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase leading-none">Total Clientes</p>
                <p className="text-xl font-black text-gray-900 leading-none mt-1">{customers.length}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <FaUsers size={20} />
             </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-v2-card p-6">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm transition focus:border-[#058c8c] focus:bg-white font-medium"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="admin-v2-card overflow-hidden mb-20 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/80 text-gray-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-gray-100">
                  <th className="px-6 py-5">Cliente</th>
                  <th className="px-6 py-5">Contacto</th>
                  <th className="px-6 py-5">DNI</th>
                  <th className="px-6 py-5">Pedidos</th>
                  <th className="px-6 py-5">Registro</th>
                  <th className="px-6 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50/30 transition-all group">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-black text-xs uppercase">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="text-[11px] font-black text-gray-900 uppercase tracking-tight">{customer.firstName} {customer.lastName}</span>
                             <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black ${customer.type === 'REGISTRADO' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
                                {customer.type}
                             </span>
                          </div>
                          <span className="text-[10px] font-medium text-gray-400">{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                          <FaEnvelope className="text-gray-300" size={10} />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-2">
                               <FaPhone className="text-gray-300" size={10} />
                               {customer.phone}
                             </span>
                             <a 
                                href={`https://wa.me/${customer.phone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                className="text-emerald-500 hover:text-emerald-600 transition-colors"
                                title="Enviar WhatsApp"
                             >
                                <FaWhatsapp size={14} />
                             </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{customer.dni || '---'}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${customer.orderCount > 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                          {customer.orderCount}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Pedidos</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          {new Date(customer.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium lowercase">hace {Math.floor((new Date().getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))} días</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                       <button className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-400 rounded text-[9px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all active:scale-95">
                          Ver Perfil
                       </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center text-gray-300 font-black uppercase tracking-[0.4em] text-[10px]">
                      No se encontraron clientes.
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
