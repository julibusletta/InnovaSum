'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPrint, FaArrowLeft, FaWhatsapp, FaInstagram, FaDownload, FaCheckSquare, FaSquare, FaPercent, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Product } from '@/lib/api/productService';
import * as XLSX from 'xlsx';

interface CategoryConfig {
  discount: number;
  visible: boolean;
}

export default function WholesalePage() {
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);
  const [globalDiscount, setGlobalDiscount] = useState(15);
  const [categoryConfigs, setCategoryConfigs] = useState<Record<string, CategoryConfig>>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const resp = await fetch('/api/admin');
      const data = await resp.json();
      const fetchedProducts = data.products || {};
      
      // Sort products by price (lowest to highest) within each category
      const sorted: Record<string, Product[]> = {};
      Object.keys(fetchedProducts).forEach(cat => {
        sorted[cat] = [...fetchedProducts[cat]].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      });

      setProducts(sorted);
      
      // Initialize category configs
      const configs: Record<string, CategoryConfig> = {};
      Object.keys(fetchedProducts).forEach(cat => {
        configs[cat] = { discount: 15, visible: true };
      });
      setCategoryConfigs(configs);

    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateGlobalDiscount = (val: number) => {
    setGlobalDiscount(val);
    const updated = { ...categoryConfigs };
    Object.keys(updated).forEach(cat => {
      updated[cat].discount = val;
    });
    setCategoryConfigs(updated);
  };

  const toggleCategoryVisibility = (cat: string) => {
    setCategoryConfigs(prev => ({
      ...prev,
      [cat]: { ...prev[cat], visible: !prev[cat].visible }
    }));
  };

  const updateCategoryDiscount = (cat: string, val: number) => {
    setCategoryConfigs(prev => ({
      ...prev,
      [cat]: { ...prev[cat], discount: val }
    }));
  };

  const toggleAllVisibility = (visible: boolean) => {
    const updated = { ...categoryConfigs };
    Object.keys(updated).forEach(cat => {
      updated[cat].visible = visible;
    });
    setCategoryConfigs(updated);
  };

  const calculateWholesale = (price: number, cat: string) => {
    const disc = categoryConfigs[cat]?.discount ?? globalDiscount;
    return Math.round(price * (1 - disc / 100));
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToExcel = () => {
    const flatData: any[] = [];
    Object.entries(products).forEach(([category, items]) => {
      const config = categoryConfigs[category];
      if (!config?.visible) return;

      const sortedItems = [...items].sort((a, b) => a.price - b.price);

      sortedItems.forEach(p => {
        const isPublished = p.published !== false;
        const hasStock = p.stock > 0;
        
        if (isPublished && hasStock) {
          flatData.push({
            'Categoría': category.toUpperCase(),
            'Código': p.id,
            'Producto': p.name,
            'Precio Retail': p.price,
            'Descuento %': config.discount,
            'Precio Mayorista': calculateWholesale(p.price, category)
          });
        }
      });
    });

    const ws = XLSX.utils.json_to_sheet(flatData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lista Mayorista');
    XLSX.writeFile(wb, `Lista_Mayorista_Innovasum_${new Date().toLocaleDateString()}.xlsx`);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-400 animate-pulse">Cargando catálogo...</div>;

  return (
    <div className="wholesale-container p-4 md:p-10 bg-[#f8fafb] min-h-screen">
      
      {/* HEADER - HIDDEN IN PRINT */}
      <div className="no-print mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Generador de Lista Mayorista</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Configura márgenes por categoría y genera tu PDF</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* GLOBAL PRESET */}
           <div className="bg-white border border-[#e1e3e5] rounded-lg p-3 flex items-center gap-4 shadow-sm">
             <span className="text-[10px] font-black uppercase text-gray-400">Descuento Global:</span>
             <div className="flex items-center gap-2">
               <input 
                 type="number" 
                 value={globalDiscount}
                 onChange={(e) => updateGlobalDiscount(Number(e.target.value))}
                 className="w-16 bg-gray-50 border-b-2 border-[#058c8c] text-center font-black text-gray-900 outline-none p-1"
               />
               <span className="font-bold text-[#058c8c]">%</span>
             </div>
           </div>

           <button 
             onClick={handlePrint}
             className="px-6 py-3 bg-[#058c8c] text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-[#047a7a] transition-all flex items-center gap-3"
           >
             <FaPrint /> Imprimir / PDF
           </button>

           <button 
             onClick={exportToExcel}
             className="px-6 py-3 bg-gray-900 text-white rounded font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all flex items-center gap-3"
           >
             <FaDownload /> Excel
           </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR PANEL */}
      <div className="no-print mb-8 bg-white p-6 rounded-2xl shadow-sm border border-[#e1e3e5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-1">Seleccionar Categorías para el PDF</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Selecciona qué secciones quieres incluir en el documento final</p>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => toggleAllVisibility(true)}
               className="text-[10px] font-black uppercase text-[#058c8c] hover:text-[#047a7a] transition-colors flex items-center gap-1"
             >
               <FaCheckSquare className="text-xs" /> Seleccionar Todo
             </button>
             <button 
               onClick={() => toggleAllVisibility(false)}
               className="text-[10px] font-black uppercase text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
             >
               <FaSquare className="text-xs" /> Deseleccionar Todo
             </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(products).sort().map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategoryVisibility(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                categoryConfigs[cat]?.visible 
                  ? 'bg-[#058c8c] text-white border-[#058c8c] shadow-md shadow-[#058c8c]/20' 
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FILTER CONTROLS - HIDDEN IN PRINT */}
      <div className="no-print mb-10">
        <input
          type="text"
          placeholder="Buscar producto por nombre o descripción..."
          className="w-full max-w-md px-6 py-4 bg-white border border-[#e1e3e5] rounded-xl shadow-sm outline-none focus:border-[#058c8c] transition-all font-medium text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* PRINTABLE AREA */}
      <div className="print-only-container bg-white p-0 md:p-8 rounded-2xl shadow-sm border border-[#e1e3e5]">
        
        {/* PDF HEADER - ONLY VISIBLE IN PRINT */}
        <div className="print-header hidden mb-12 items-center justify-between border-b-4 border-black pb-12">
           <div className="flex items-center gap-6">
              <img src="/images/logotest9.png" alt="Innovasum" className="h-16 w-auto object-contain" />
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Lista de Precios Mayorista</p>
              </div>
           </div>
           <div className="text-right space-y-1">
              <div className="flex items-center justify-end gap-2 text-sm font-black text-black">
                <FaWhatsapp className="text-green-600" /> +54 9 11 5145-7720
              </div>
              <div className="flex items-center justify-end gap-2 text-sm font-black text-black">
                <FaInstagram className="text-pink-600" /> @innovasumarg
              </div>
              <div className="text-[9px] font-bold text-gray-400 mt-2 italic">Fecha: {new Date().toLocaleDateString()}</div>
           </div>
        </div>

        {/* CATEGORIES SECTION */}
        <div className="space-y-12">
          {Object.entries(products).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => {
            const config = categoryConfigs[category] || { discount: globalDiscount, visible: true };
            
            // Only hide category if not printing (in print, filter out of JSX)
            const isVisible = config.visible;

            const filteredItems = items.filter(p => {
              const isPublished = p.published !== false;
              const hasStock = p.stock > 0;
              const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.id.toLowerCase().includes(searchTerm.toLowerCase());
              
              return isPublished && hasStock && matchesSearch;
            });

            const sortedItems = Array.from(filteredItems).sort((a, b) => {
               const pA = Number(a.price) || 0;
               const pB = Number(b.price) || 0;
               return pA - pB;
            });

            if (sortedItems.length === 0) return null;

            return (
              <div 
                key={category} 
                className={`category-block break-inside-avoid ${!isVisible ? 'no-print opacity-40 grayscale' : ''}`}
              >
                {/* CATEGORY HEADER WITH CONTROLS (Hidden in print) */}
                <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded no-print">
                   <div className="flex items-center gap-4">
                      <button 
                        onClick={() => toggleCategoryVisibility(category)}
                        className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isVisible ? 'bg-[#058c8c] text-white' : 'bg-gray-200 text-gray-400'}`}
                        title={isVisible ? 'Ocultar categoría del PDF' : 'Mostrar categoría en el PDF'}
                      >
                         {isVisible ? <FaEye /> : <FaEyeSlash />}
                      </button>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900">
                        {category}
                      </h3>
                   </div>

                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Dto Cat:</span>
                      <div className="flex items-center bg-white border border-gray-200 rounded px-2">
                        <input 
                           type="number"
                           className="w-12 py-1 text-xs font-black text-center outline-none bg-transparent"
                           value={config.discount}
                           onChange={(e) => updateCategoryDiscount(category, Number(e.target.value))}
                        />
                        <span className="text-[10px] font-bold text-[#058c8c]">%</span>
                      </div>
                   </div>
                </div>

                {/* PDF CATEGORY TITLE (Only visible in print) */}
                <h3 className="print-only-header hidden text-xs font-black uppercase tracking-[0.3em] bg-black text-white px-6 py-2 mb-4 inline-block">
                  {category}
                </h3>

                <div className={`overflow-x-auto ${!isVisible ? 'hidden' : ''}`}>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-[10px] font-black uppercase text-gray-400">Producto</th>
                        <th className="px-4 py-3 text-right text-[10px] font-black uppercase text-gray-400 w-32">P. Mayorista</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sortedItems.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-xs font-black text-gray-800">{p.name}</td>
                          <td className="px-4 py-3 text-right text-sm font-black text-black">
                            ${calculateWholesale(p.price, category).toLocaleString('es-AR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* PRINT FOOTER */}
        <div className="print-footer hidden mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
            Precios sujetos a cambios sin previo aviso • Innovasum 2026
          </p>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .admin-v2-sidebar, .admin-v2-header {
            display: none !important;
          }
          .admin-v2-main, .admin-v2-content {
             padding: 0 !important;
             margin: 0 !important;
             background: white !important;
          }
          .admin-v2-container {
             display: block !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .wholesale-container {
            padding: 0 !important;
            background: white !important;
          }
          .print-only-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .print-header {
            display: flex !important;
          }
          .print-footer {
            display: block !important;
          }
          .print-only-header {
             display: inline-block !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          .category-block {
            page-break-inside: avoid;
            margin-bottom: 2rem;
          }
          @page {
            margin: 2cm;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
