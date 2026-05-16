'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaHome, FaBriefcase, FaEllipsisV, FaSpinner } from 'react-icons/fa';
import AddressForm from "./AddressForm";

export default function DireccionesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <FaSpinner className="animate-spin text-slate-300 mb-4" size={30} />
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Cargando direcciones...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const userAddress = (session?.user as any)?.address;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Direcciones</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Gestioná tus domicilios de entrega y facturación.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <FaPlus />
          {userAddress ? 'Editar Dirección' : 'Nueva Dirección'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAddress && userAddress.street ? (
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-7 relative group shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                  <FaHome size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 block">Predeterminada</span>
                  <p className="font-bold text-slate-900 uppercase tracking-tight text-sm">Principal</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xl font-bold text-slate-900 leading-tight">
                {userAddress.street} {userAddress.number}
              </p>
              <p className="text-slate-500 font-medium text-sm">
                {userAddress.city}, {userAddress.state}
              </p>
              <p className="text-slate-400 text-[11px] font-bold tracking-widest mt-2 uppercase">CP {userAddress.zip}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex gap-4">
              <button 
                onClick={() => setShowForm(true)}
                className="flex-1 py-3 bg-slate-50 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                Editar
              </button>
              <button className="px-4 py-3 bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100 hover:text-red-500 hover:bg-red-50 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4 shadow-sm">
              <FaMapMarkerAlt size={24} />
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">Sin direcciones registradas</p>
            <button 
              onClick={() => setShowForm(true)}
              className="text-blue-600 text-[10px] font-black uppercase tracking-[0.15em] hover:underline"
            >
              Agregar dirección ahora
            </button>
          </div>
        )}

        {/* Placeholder for Trabajo address */}
        <div className="bg-slate-50/50 border border-slate-200 border-dashed rounded-2xl p-7 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-200 mb-3 shadow-sm">
              <FaBriefcase size={20} />
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1 leading-none">¿Dirección en el trabajo?</p>
            <p className="text-[10px] text-slate-300 font-medium italic">Próximamente...</p>
        </div>
      </div>

      {showForm && (
        <AddressForm 
          initialData={userAddress}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            window.location.reload(); // Refresh session data
          }}
        />
      )}
    </div>
  );
}
