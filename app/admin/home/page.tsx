'use client';

import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaImage, FaList, FaArrowsAltV, FaCheckCircle, FaTimesCircle, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';

export default function HomeAdminPage() {
  const [activeTab, setActiveTab] = useState<'slider' | 'carousels' | 'offers'>('slider');
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [productCarousels, setProductCarousels] = useState<any[]>([]);
  const [weeklyOffers, setWeeklyOffers] = useState<any[]>([
    { productId: '', title: '', subtitle: '', link: '', image: '', active: true },
    { productId: '', title: '', subtitle: '', link: '', image: '', active: true }
  ]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/home-settings');
      const data = await res.json();
      setHeroSlides(data.heroSlides || []);
      setProductCarousels(data.productCarousels || []);
      if (data.weeklyOffers && data.weeklyOffers.length > 0) {
        setWeeklyOffers(data.weeklyOffers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching home settings:', error);
      setLoading(false);
    }
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload-banner', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        updateSlide(index, 'image', data.url);
      } else {
        alert('Error al subir la imagen: ' + data.message);
      }
    } catch (error) {
      alert('Error de conexión al subir la imagen');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('Guardando cambios...');
    try {
      const res = await fetch('/api/admin/home-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ heroSlides, productCarousels, weeklyOffers })
      });
      const result = await res.json();
      if (result.success) {
        setMessage('¡Configuración guardada con éxito!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error al guardar');
      }
    } catch (error) {
       setMessage('Error de conexión');
    } finally {
      setIsSaving(false);
    }
  };

  const addSlide = () => {
    setHeroSlides([...heroSlides, { image: '', alt: '', link: '', order: heroSlides.length }]);
  };

  const removeSlide = (index: number) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  const updateSlide = (index: number, field: string, value: any) => {
    const updated = [...heroSlides];
    updated[index][field] = value;
    setHeroSlides(updated);
  };

  const addCarousel = () => {
    setProductCarousels([...productCarousels, { title: '', type: 'section', value: 'nuevas', order: productCarousels.length, active: true }]);
  };

  const removeCarousel = (index: number) => {
    setProductCarousels(productCarousels.filter((_, i) => i !== index));
  };

  const updateCarousel = (index: number, field: string, value: any) => {
    const updated = [...productCarousels];
    updated[index][field] = value;
    setProductCarousels(updated);
  };

  const updateOffer = (index: number, field: string, value: any) => {
    const updated = [...weeklyOffers];
    updated[index][field] = value;
    setWeeklyOffers(updated);
  };

  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-gray-400">Cargando configuración de la Home...</div>;

  return (
    <div className="animate-fadeIn pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="admin-v2-page-title mb-1">Gestor de Inicio</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Configuración Sitio</span>
          </nav>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 bg-[#058c8c] text-white rounded text-sm font-bold hover:shadow-lg hover:bg-[#047a7a] transition flex items-center gap-2"
        >
          {isSaving ? 'Guardando...' : <><FaSave /> Guardar Todo</>}
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl text-sm font-semibold flex items-center gap-3 animate-slideDown ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 bg-white p-1 rounded-xl border border-gray-100 w-fit">
        <button
          onClick={() => setActiveTab('slider')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'slider' ? 'bg-[#058c8c] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <FaImage /> Slider Principal (Hero)
        </button>
        <button
          onClick={() => setActiveTab('carousels')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'carousels' ? 'bg-[#058c8c] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <FaList /> Carruseles de Productos
        </button>
        <button
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'offers' ? 'bg-[#058c8c] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <FaTrophy /> Ofertas Semanales
        </button>
      </div>

      <div className="admin-v2-card p-8 min-h-[400px]">
        {activeTab === 'slider' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Gestionar Banners del Hero</h3>
              <button onClick={addSlide} className="px-4 py-2 bg-gray-900 text-white rounded text-[10px] font-black uppercase tracking-widest">+ Añadir Slide</button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {heroSlides.map((slide, idx) => (
                <div key={idx} className="p-6 bg-gray-50 border border-gray-200 rounded-xl relative group">
                  <button 
                    onClick={() => removeSlide(idx)}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white text-red-500 rounded-full shadow-md flex items-center justify-center hover:bg-red-50 border border-red-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FaTrash size={12} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="aspect-video bg-white rounded border border-gray-200 overflow-hidden flex items-center justify-center p-2 mb-3">
                         {slide.image ? <img src={slide.image} className="w-full h-full object-contain" alt="" /> : <FaImage size={30} className="text-gray-200" />}
                      </div>
                      <div className="flex justify-between items-end mb-1.5 px-1">
                        <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">URL de Imagen</label>
                        <div className="relative">
                          <input 
                            type="file" 
                            id={`file-upload-${idx}`}
                            className="hidden" 
                            onChange={(e) => handleImageUpload(idx, e)}
                            accept="image/*"
                          />
                          <label 
                            htmlFor={`file-upload-${idx}`}
                            className={`text-[8px] font-black uppercase tracking-widest cursor-pointer hover:text-[#058c8c] transition-colors ${isUploading === idx ? 'animate-pulse text-amber-500' : 'text-blue-500'}`}
                          >
                            {isUploading === idx ? 'Subiendo...' : '📂 Subir Archivo'}
                          </label>
                        </div>
                      </div>
                      <input 
                        type="text" 
                        value={slide.image} 
                        onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                        placeholder="/images/banner1.png"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded outline-none font-medium text-gray-600"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Texto Alternativo (SEO)</label>
                        <input 
                          type="text" 
                          value={slide.alt} 
                          onChange={(e) => updateSlide(idx, 'alt', e.target.value)}
                          className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Link de Destino</label>
                        <input 
                          type="text" 
                          value={slide.link} 
                          onChange={(e) => updateSlide(idx, 'link', e.target.value)}
                          placeholder="/category/celulares"
                          className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={slide.isCustom}
                            onChange={(e) => updateSlide(idx, 'isCustom', e.target.checked)}
                            className="w-4 h-4 rounded text-[#058c8c]"
                          />
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Slide con Texto (Custom)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {heroSlides.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest">
                   No hay slides configurados. El sistema usará los valores por defecto.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'carousels' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Configuración de Secciones en Home</h3>
              <button onClick={addCarousel} className="px-4 py-2 bg-gray-900 text-white rounded text-[10px] font-black uppercase tracking-widest">+ Añadir Sección</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {productCarousels.map((carousel, idx) => (
                 <div key={idx} className="p-6 bg-gray-50 border border-gray-200 rounded-xl flex flex-col md:flex-row items-center gap-6 relative group">
                    <button 
                      onClick={() => removeCarousel(idx)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-white text-red-500 rounded-full shadow flex items-center justify-center hover:bg-red-50 border border-red-100 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <FaTrash size={10} />
                    </button>
                    <div className="w-8 h-8 bg-white border border-gray-200 rounded flex items-center justify-center text-gray-300 font-black text-xs">
                       {idx + 1}
                    </div>
                    <div className="flex-1 space-y-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Título de la Sección</label>
                            <input 
                              type="text" 
                              value={carousel.title}
                              onChange={(e) => updateCarousel(idx, 'title', e.target.value)}
                              className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded outline-none font-bold text-gray-800"
                              placeholder="Ej: NUEVAS LLEGADAS"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Tipo de Filtrado</label>
                            <select
                              value={carousel.type}
                              onChange={(e) => updateCarousel(idx, 'type', e.target.value)}
                              className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded outline-none font-bold"
                            >
                               <option value="section">Por Sección (Badge)</option>
                               <option value="category">Por Categoría</option>
                            </select>
                          </div>
                       </div>
                       <div>
                          <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Valor del Filtro (Slug)</label>
                          <input 
                            type="text" 
                            value={carousel.value}
                            onChange={(e) => updateCarousel(idx, 'value', e.target.value)}
                            className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded outline-none text-gray-500"
                            placeholder="Ej: bombas, nuevas, celulares, smart-home"
                          />
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={carousel.active}
                            onChange={(e) => updateCarousel(idx, 'active', e.target.checked)}
                            className="w-4 h-4 rounded text-[#058c8c]"
                          />
                          <span className="text-[10px] font-bold text-gray-600 uppercase">Activo</span>
                        </label>
                    </div>
                 </div>
               ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-4">
               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <FaArrowsAltV />
               </div>
               <div>
                  <h4 className="text-xs font-bold text-blue-800 mb-1">Orden de aparición</h4>
                  <p className="text-[10px] text-blue-600 leading-relaxed font-medium">Las secciones se mostrarán en la Home en el mismo orden que aparecen en esta lista. Asegúrate de que las categorías correspondan con lo definido en el mapeo de la API.</p>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-black text-gray-900 uppercase tracking-widest text-sm">Gestionar Ofertas Semanales (Banners)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {weeklyOffers.map((offer, idx) => (
                <div key={idx} className={`p-8 rounded-2xl border-2 ${idx === 0 ? 'bg-blue-50/30 border-blue-100' : 'bg-green-50/30 border-green-100'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                      Banner {idx + 1}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={offer.active}
                        onChange={(e) => updateOffer(idx, 'active', e.target.checked)}
                        className="w-4 h-4 rounded text-[#058c8c]"
                      />
                      <span className="text-[10px] font-bold text-gray-600 uppercase">Activo</span>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">ID del Producto (Base para Precio/Link)</label>
                      <input 
                        type="text" 
                        value={offer.productId}
                        onChange={(e) => updateOffer(idx, 'productId', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none font-bold"
                        placeholder="Ej: 378"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Título Personalizado</label>
                      <input 
                        type="text" 
                        value={offer.title}
                        onChange={(e) => updateOffer(idx, 'title', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none font-bold"
                        placeholder="Ej: JBL CHARGE 6"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Subtítulo / Promo Detalle</label>
                      <input 
                        type="text" 
                        value={offer.subtitle}
                        onChange={(e) => updateOffer(idx, 'subtitle', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none"
                        placeholder="Ej: * 10% de descuento abonando por transferencia"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Link de Destino</label>
                      <input 
                        type="text" 
                        value={offer.link}
                        onChange={(e) => updateOffer(idx, 'link', e.target.value)}
                        className="w-full px-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl outline-none text-gray-500"
                        placeholder="Ej: /product/378"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-1.5 px-1">Enlace de la Imagen (O subir imagen)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={offer.image || ''}
                          onChange={(e) => updateOffer(idx, 'image', e.target.value)}
                          className="w-full px-4 py-2 text-xs bg-white border border-gray-200 rounded-xl outline-none"
                          placeholder="/images/productos/mi-oferta.png"
                        />
                        <div className="relative shrink-0 flex items-center">
                          <input 
                            type="file" 
                            id={`offer-upload-${idx}`}
                            className="hidden" 
                            onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               setIsUploading(100 + idx);
                               const formData = new FormData();
                               formData.append('file', file);
                               try {
                                 const res = await fetch('/api/admin/upload-banner', { method: 'POST', body: formData });
                                 const data = await res.json();
                                 if (data.success) {
                                   updateOffer(idx, 'image', data.url);
                                 } else {
                                   alert('Error al subir: ' + data.message);
                                 }
                               } catch (err) { alert('Error de red'); } finally { setIsUploading(null); }
                            }}
                            accept="image/*"
                          />
                          <label 
                            htmlFor={`offer-upload-${idx}`}
                            className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold cursor-pointer hover:bg-gray-200 whitespace-nowrap"
                          >
                             {isUploading === 100 + idx ? 'Subiendo...' : '📁 Subir'}
                          </label>
                        </div>
                      </div>
                      {offer.image && (
                        <div className="mt-4 w-full max-w-[150px] aspect-[4/3] bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-2">
                          <img src={offer.image} alt="Preview" className="max-w-full max-h-full object-contain drop-shadow" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <FaTrophy />
              </div>
              <div>
                <h4 className="text-xs font-bold text-orange-800 mb-1">Información Importante</h4>
                <p className="text-[10px] text-orange-600 leading-relaxed font-medium">
                  Los banners de ofertas semanales están optimizados para productos específicos. 
                  El Banner 1 tiene fondo azul y el Banner 2 fondo verde para conservar el diseño actual.
                  Si dejas el campo de "Link" vacío, el sistema usará /product/[ID] automáticamente.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
