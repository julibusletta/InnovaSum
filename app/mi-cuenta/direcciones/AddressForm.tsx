'use client';

import { useState } from 'react';
import { FaTimes, FaMapMarkerAlt, FaSave } from 'react-icons/fa';

const PROVINCIAS = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", 
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", 
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", 
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán", "Ciudad Autónoma de Buenos Aires (CABA)"
];

interface AddressFormProps {
  initialData?: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddressForm({ initialData, onClose, onSuccess }: AddressFormProps) {
  const [formData, setFormData] = useState({
    street: initialData?.street || '',
    number: initialData?.number || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zip: initialData?.zip || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: formData })
      });
      const data = await res.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Error al guardar la dirección');
      }
    } catch (err: any) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
              <FaMapMarkerAlt />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Configurar Dirección</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Calle</label>
              <input 
                type="text" 
                required 
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Altura / Número</label>
              <input 
                type="text" 
                required 
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Localidad</label>
              <input 
                type="text" 
                required 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Código Postal</label>
              <input 
                type="text" 
                required 
                value={formData.zip}
                onChange={(e) => setFormData({...formData, zip: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Provincia</label>
              <select 
                required 
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white transition-all font-medium cursor-pointer"
              >
                <option value="" disabled>Seleccioná Provincia</option>
                {PROVINCIAS.sort().map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-[11px]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[11px] disabled:opacity-50"
            >
              {loading ? 'Guardando...' : <><FaSave /> Guardar Dirección</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
