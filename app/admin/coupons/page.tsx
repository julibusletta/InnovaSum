'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import '../../styles/AdminV2.css';

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: 'PERCENTAGE' | 'FIXED';
  isActive: boolean;
  currentUses: number;
  maxUses?: number;
  createdAt: string;
}

export default function CouponsAdminPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: code.toUpperCase(), 
          discount: Number(discount), 
          type 
        })
      });
      setShowModal(false);
      setCode('');
      setDiscount('');
      fetchCoupons();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este cupón permanentemente?')) return;
    try {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      fetchCoupons();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Cargando cupones...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cupones de Descuento</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona códigos promocionales para los clientes.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <FaPlus /> Nuevo Cupón
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-black text-slate-500 tracking-widest">
              <th className="p-4">Código</th>
              <th className="p-4">Descuento</th>
              <th className="p-4">Tipo</th>
              <th className="p-4 text-center">Usos</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(coupon => (
              <tr key={coupon._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{coupon.code}</td>
                <td className="p-4">${coupon.discount}</td>
                <td className="p-4 text-xs font-bold text-slate-500">
                  {coupon.type === 'PERCENTAGE' ? 'Porcentaje (%)' : 'Monto Fijo ($)'}
                </td>
                <td className="p-4 text-center text-xs text-slate-500">{coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : ''}</td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No hay cupones creados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-800">Crear Cupón</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-800 text-xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Código (Ej: JB10)</label>
                <input 
                  type="text" 
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black uppercase"
                  placeholder="NAVIDAD2026"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Tipo de Descuento</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black"
                >
                  <option value="PERCENTAGE">Porcentaje (%)</option>
                  <option value="FIXED">Monto Fijo ($AR)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-2">Valor de Descuento</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-black"
                  placeholder="10"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black text-white font-bold uppercase tracking-widest text-xs py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 flex justify-center items-center"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : 'Guardar Cupón'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
