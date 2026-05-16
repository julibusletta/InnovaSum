'use client';

import React, { useState, useEffect } from 'react';
import { FaCog, FaLock, FaUser, FaBell, FaGlobe, FaDollarSign, FaSave } from 'react-icons/fa';

export default function SettingsPage() {
  const [exchangeRate, setExchangeRate] = useState<number>(1500);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setExchangeRate(data.settings.exchangeRate);
        }
      });
  }, []);

  const handleSaveRate = async () => {
    setLoading(true);
    setSuccess('');
    setError('');
    
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exchangeRate: Number(exchangeRate) }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message || 'Configuración guardada correctamente.');
      } else {
        setError(data.error || 'Error al guardar.');
      }
    } catch (err) {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const settingsGroups = [
    { title: 'Perfil', icon: <FaUser />, desc: 'Administra tus datos de acceso.' },
    { title: 'Seguridad', icon: <FaLock />, desc: 'Cambia tu contraseña y autenticación.' },
    { title: 'Notificaciones', icon: <FaBell />, desc: 'Configura avisos de nuevos pedidos.' },
  ];

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Ajusta las preferencias globales de la tienda.</p>
      </div>

      {/* Dolar Blue Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-xl">
            <FaDollarSign />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Dólar Blue</h3>
            <p className="text-sm text-slate-400">Tasa de cambio aplicada automáticamente a todos los precios.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Valor Actual (ARS)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-8 pr-4 text-slate-700 font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                placeholder="1500"
              />
            </div>
          </div>
          
          <button 
            onClick={handleSaveRate}
            disabled={loading}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300'
            }`}
          >
            {loading ? 'Procesando...' : (
              <>
                <FaSave />
                Actualizar Todo
              </>
            )}
          </button>
        </div>

        {success && (
          <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-medium border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            {success}
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-medium border border-rose-100">
            {error}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <p className="text-xs text-blue-600 leading-relaxed font-medium">
            <span className="font-bold">Nota:</span> Al cambiar este valor, el sistema recalculará automáticamente los precios de venta de <b>todos</b> los productos basándose en sus precios de costo y márgenes por categoría.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
        {settingsGroups.map((group, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm cursor-not-allowed">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-xl">
                {group.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{group.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{group.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
