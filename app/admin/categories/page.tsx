'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTags, FaPlus, FaSave, FaPercentage, FaDollarSign, FaInfoCircle, FaTimesCircle, FaChevronRight, FaCheck } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  markupPercent?: number;
  markupFixed?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingProducts, setViewingProducts] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1500);
  const [updatingCostId, setUpdatingCostId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin');
      const data = await resp.json();
      setCategories(data.categories || []);
      setAllProducts(data.products || {});
      
      const settingsResp = await fetch('/api/admin/settings');
      const settingsData = await settingsResp.json();
      if (settingsData.success) {
        setExchangeRate(settingsData.settings.exchangeRate);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (cat: Category) => {
    setIsSaving(true);
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'save_category', data: { category: cat } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage(res.message || 'Categoría guardada con éxito');
        setEditingCategory(null);
        fetchData();
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (err) {
      alert('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCostUpdate = async (productId: string, categorySlug: string, newCost: number) => {
    setUpdatingCostId(productId);
    try {
      const resp = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ costPrice: newCost })
      });
      const data = await resp.json();
      if (data.success) {
        // Update local state
        setAllProducts(prev => {
           const updated = { ...prev };
           updated[categorySlug] = updated[categorySlug].map(p => 
             p.id === productId ? { ...p, costPrice: newCost, price: data.product.price } : p
           );
           return updated;
        });
      }
    } catch (err) {
      console.error('Error updating cost:', err);
    } finally {
      setUpdatingCostId(null);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando taxonomía...</div>;

  return (
    <div className="animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Márgenes y Ganancias</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Configuración</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-[#058c8c]/10 text-[#058c8c] rounded text-[10px] font-black uppercase tracking-widest hover:bg-[#058c8c]/20 transition flex items-center gap-2">
            <FaInfoCircle /> Ver fórmulas históricas
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 mb-10 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-3 animate-slideDown shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-bold">{message}</span>
        </div>
      )}

      {/* Info Card */}
      <div className="admin-v2-card p-8 mb-10 border-l-4 border-l-[#058c8c] bg-[#058c8c]/[0.02]">
         <div className="flex gap-6 items-start">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#058c8c] border border-gray-100 animate-pulse">
               <FaInfoCircle size={20} />
            </div>
            <div>
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Recordatorio de Cálculo de Precios</h3>
               <p className="text-xs text-gray-500 leading-relaxed max-w-2xl font-medium">
                  Los precios se calculan según el costo en USD: <br />
                  <span className="text-[#058c8c] font-black">Menos de $500:</span> (USD + Ajuste) × 1500 × (1 + %) <br />
                  <span className="text-[#058c8c] font-black">Más de $500:</span> (USD × 1.10) × 1500 × (1 + %)
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat: Category) => (
          <div key={cat.id} className="admin-v2-card group overflow-hidden hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-[#058c8c]/20">
             <div className="h-40 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                <img src={cat.image} alt={cat.name} className="w-2/3 h-2/3 object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                   <div className="bg-white/90 backdrop-blur-sm shadow-sm px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter text-[#058c8c] border border-gray-100">
                      {cat.slug}
                   </div>
                   <div className="bg-[#058c8c] text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">
                      {cat.productCount || 0} ITEMS
                   </div>
                </div>
             </div>
             
             <div className="p-8">
                <h3 className="font-black text-gray-900 text-sm uppercase tracking-[0.1em] mb-6 group-hover:text-[#058c8c] transition-colors flex items-center justify-between">
                   {cat.name}
                   <FaChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#058c8c]" size={10} />
                </h3>
                
                {/* Markup Section */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-5 h-5 bg-white rounded shadow-sm flex items-center justify-center"><FaPercentage size={10} className="text-[#058c8c]" /></div> Margen %
                      </div>
                      <div className="text-sm font-black text-gray-900">{cat.markupPercent || 0}%</div>
                   </div>
                   
                   <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-transparent group-hover:border-gray-100 transition-all">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                         <div className="w-5 h-5 bg-white rounded shadow-sm flex items-center justify-center"><FaDollarSign size={10} className="text-[#058c8c]" /></div> Ajuste Fijo
                      </div>
                      <div className="text-[10px] font-bold text-gray-600">{cat.markupFixed || 'Sin ajuste'}</div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                   <button 
                     onClick={() => setEditingCategory(cat)}
                     className="py-3.5 bg-gray-100 text-gray-700 rounded text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
                   >
                      Márgenes
                   </button>
                   <button 
                     onClick={() => setViewingProducts(cat)}
                     className="py-3.5 bg-gray-900 text-white rounded text-[9px] font-black uppercase tracking-widest hover:bg-[#058c8c] shadow-lg shadow-gray-200 hover:shadow-[#058c8c]/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                   >
                      Ver Productos <FaChevronRight size={8} />
                   </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideDown border border-gray-100">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                 <div>
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Editar Margen</h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Categoría: {editingCategory.name}</p>
                 </div>
                 <button onClick={() => setEditingCategory(null)} className="text-gray-300 hover:text-gray-600 transition p-2">
                    <FaTimesCircle size={20} />
                 </button>
              </div>
              
              <div className="p-8 space-y-8">
                 <div>
                    <label className="block text-[10px] font-black text-[#058c8c] uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FaPercentage /> Porcentaje de Ganancia (%)
                    </label>
                    <div className="relative group">
                       <input 
                         type="number"
                         value={editingCategory.markupPercent || ''}
                         onChange={e => setEditingCategory({...editingCategory, markupPercent: Number(e.target.value)})}
                         className="w-full px-5 py-4 bg-gray-50 border border-[#e1e3e5] rounded-xl outline-none text-base font-black focus:border-[#058c8c] focus:bg-white transition-all shadow-sm group-hover:border-gray-300"
                         placeholder="Ej: 30"
                       />
                       <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xl">%</span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-[#058c8c] uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FaDollarSign /> Ajuste Fijo / Nota de Cálculo
                    </label>
                    <div className="relative group">
                       <input 
                         type="text"
                         value={editingCategory.markupFixed || ''}
                         onChange={e => setEditingCategory({...editingCategory, markupFixed: e.target.value})}
                         className="w-full px-5 py-4 bg-gray-50 border border-[#e1e3e5] rounded-xl outline-none text-sm font-bold focus:border-[#058c8c] focus:bg-white transition-all shadow-sm group-hover:border-gray-300"
                         placeholder="Ej: +$10,000 ARS o +$30 USD"
                       />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-dashed border-gray-200">
                       <p className="text-[9px] text-gray-500 leading-relaxed font-medium uppercase tracking-tight">
                          * Este valor se utiliza como referencia histórica para saber cuánto se sumó originalmente en esta categoría. No afecta cálculos automáticos, es netamente informativo.
                       </p>
                    </div>
                 </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-4">
                 <button 
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition active:scale-95"
                 >
                    Cancelar
                 </button>
                 <button 
                  onClick={() => handleSave(editingCategory)}
                  disabled={isSaving}
                  className="flex-1 py-4 bg-[#058c8c] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#058c8c]/30 hover:scale-[1.03] transition-all transform active:scale-95 disabled:opacity-50"
                 >
                    {isSaving ? 'Guardando...' : 'Aplicar Cambios'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Products Slide-over */}
      {viewingProducts && (
        <>
          <div className="fixed inset-0 z-[200] bg-gray-900/40 backdrop-blur-sm animate-fadeIn" onClick={() => setViewingProducts(null)}></div>
          <div className="fixed inset-y-0 right-0 z-[201] w-full max-w-2xl bg-white shadow-2xl flex flex-col animate-slideInRight">
             <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div className="flex-1">
                   <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{viewingProducts.name}</h2>
                   <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-bold text-[#058c8c] uppercase tracking-widest">
                         {allProducts[viewingProducts.slug]?.length || 0} Productos
                      </p>
                      <Link 
                        href={`/admin/products?new=true&category=${viewingProducts.slug}`}
                        className="text-[9px] font-black bg-gray-900 text-white px-3 py-1 rounded-full uppercase tracking-tighter hover:bg-[#058c8c] transition-all flex items-center gap-1.5"
                      >
                        <FaPlus size={8} /> Nuevo Producto
                      </Link>
                   </div>
                </div>
                <button onClick={() => setViewingProducts(null)} className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition">
                   <FaTimesCircle size={20} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {allProducts[viewingProducts.slug]?.map((p: any, idx: number) => {
                   // Estimate cost (Logic simplified for display)
                   const margin = viewingProducts.markupPercent || 30;
                   const finalPrice = p.price;
                   // reverse: ARS / 1.3 / 1500 = approximate cost
                   const estimatedCost = Math.round(finalPrice / (1 + margin/100) / 1500);

                   return (
                      <div key={p.id} className="p-5 border border-[#e1e3e5] rounded-2xl hover:border-[#058c8c]/30 transition-all group">
                         <div className="flex gap-5 items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                               <img src={p.image} className="w-full h-full object-contain p-2" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-wider truncate mb-1">{p.name}</h4>
                               <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-[#058c8c]">${finalPrice.toLocaleString()} ARS</span>
                                  {p.costPrice && (
                                     <span className="bg-gray-100 text-[9px] font-black text-gray-400 px-2 py-0.5 rounded uppercase leading-none">Real</span>
                                  )}
                               </div>
                            </div>
                         </div>

                         <div className="mt-5 pt-5 border-t border-gray-50 grid grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-gray-50 text-[10px] items-center justify-center flex flex-col rounded-xl relative group-hover:bg-blue-50/50 transition-colors">
                               <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Costo (USD)</span>
                                <div className="flex items-center gap-1 w-full px-1">
                                   <input 
                                     type="number"
                                     id={`cost-input-${p.id}`}
                                     defaultValue={p.costPrice || estimatedCost}
                                     onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                       if (e.key === 'Enter') {
                                         handleCostUpdate(p.id, viewingProducts.slug, Number(e.currentTarget.value));
                                       }
                                     }}
                                     className="w-full bg-transparent text-center font-black text-gray-900 outline-none transition-all text-xs"
                                   />
                                   <button 
                                     onClick={() => {
                                       const input = document.getElementById(`cost-input-${p.id}`) as HTMLInputElement;
                                       if (input) handleCostUpdate(p.id, viewingProducts.slug, Number(input.value));
                                     }}
                                     className="w-5 h-5 flex-shrink-0 bg-[#058c8c] text-white rounded flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                                   >
                                      <FaCheck size={8} />
                                   </button>
                                </div>
                               {updatingCostId === p.id && (
                                 <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center animate-fadeIn rounded-xl z-20">
                                    <div className="w-4 h-4 border-2 border-[#058c8c] border-t-transparent rounded-full animate-spin"></div>
                                 </div>
                               )}
                            </div>
                            <div className="text-center p-3 bg-[#058c8c]/[0.03] text-[10px] items-center justify-center flex flex-col rounded-xl border border-[#058c8c]/10">
                               <span className="text-[8px] font-black text-[#058c8c] uppercase tracking-tighter mb-1">Ajuste</span>
                               <span className="font-black text-[#058c8c] text-[9px] uppercase tracking-tighter">{viewingProducts.markupFixed?.split('|')[1]?.trim() || '+ $20 USD'}</span>
                            </div>
                            <div className="text-center p-3 bg-gray-50 text-[10px] items-center justify-center flex flex-col rounded-xl">
                               <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-1">Tasa</span>
                               <span className="font-black text-gray-900">{exchangeRate.toLocaleString()}</span>
                            </div>
                            <div className="text-center p-3 bg-[#058c8c]/[0.03] text-[10px] items-center justify-center flex flex-col rounded-xl border border-[#058c8c]/10">
                               <span className="text-[8px] font-black text-[#058c8c] uppercase tracking-tighter mb-1">Margen</span>
                               <span className="font-black text-[#058c8c]">{margin}%</span>
                            </div>
                         </div>

                         <div className="mt-4 flex items-center justify-center gap-2">
                            <div className="h-px bg-gray-100 flex-1"></div>
                            <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                               Fórmula Aplicada <FaChevronRight size={6} />
                            </div>
                            <div className="h-px bg-gray-100 flex-1"></div>
                         </div>
                      </div>
                   );
                })}

                {!allProducts[viewingProducts.slug]?.length && (
                   <div className="p-20 text-center flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                         <FaTags size={24} />
                      </div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sin productos en esta sección</p>
                   </div>
                )}
             </div>

             <div className="p-8 bg-gray-50 border-t border-gray-100">
                <p className="text-[9px] text-gray-500 font-medium italic leading-relaxed">
                   * El "Costo Estimado" se calcula automáticamente revirtiendo la fórmula de la categoría. Es una aproximación para ayudarte a gestionar tus precios rápidamente.
                </p>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
