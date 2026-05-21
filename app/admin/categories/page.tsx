'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTags, FaPlus, FaSave, FaTimesCircle, FaChevronRight, FaTrash, FaEdit, FaImage, FaFolder, FaFolderOpen } from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  
  // For Create / Edit
  const [editingCategory, setEditingCategory] = useState<Category | Partial<Category> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Upload image state
  const [uploadingImage, setUploadingImage] = useState(false);

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
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (cat: Category | Partial<Category>) => {
    if (!cat.name || !cat.slug || !cat.image) {
      alert("Por favor completá nombre, slug e imagen.");
      return;
    }

    setIsSaving(true);
    try {
      const categoryData = {
        ...cat,
        id: cat.id || `cat-${Date.now()}`
      };

      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'save_category', data: { category: categoryData } }),
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

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`¿Estás seguro de eliminar la categoría "${cat.name}"? Esta acción no se puede deshacer.`)) return;
    
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_category', data: { categoryIdOrSlug: cat.slug || cat.id } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage(res.message || 'Categoría eliminada con éxito');
        if (editingCategory && (editingCategory as Category).id === cat.id) {
            setEditingCategory(null);
        }
        fetchData();
        setTimeout(() => setMessage(''), 5000);
      } else {
        alert(res.message || 'Error al eliminar');
      }
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const res = await resp.json();
      if (res.success) {
        setEditingCategory({ ...editingCategory, image: res.url });
      } else {
        alert('Error al subir la imagen');
      }
    } catch (err) {
      alert('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const openNewCategoryModal = () => {
    setIsNew(true);
    setEditingCategory({
        name: '',
        slug: '',
        image: '/images/placeholder.jpg',
        description: '',
        parentId: ''
    });
  };

  const openEditCategoryModal = (cat: Category) => {
    setIsNew(false);
    setEditingCategory({ ...cat, parentId: cat.parentId || '' });
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando taxonomía...</div>;

  // Separate parent and children categories
  const parentCategories = categories.filter(c => !c.parentId);
  
  return (
    <div className="animate-fadeIn pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Categorías</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span>/</span>
            <span className="text-gray-900">Catálogo</span>
          </nav>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openNewCategoryModal}
            className="px-6 py-3 bg-[#058c8c] text-white rounded shadow-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
          >
            <FaPlus /> Nueva Categoría
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
               <FaFolderOpen size={20} />
            </div>
            <div>
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Organización del Menú</h3>
               <p className="text-xs text-gray-500 leading-relaxed max-w-2xl font-medium">
                  Crea categorías principales y subcategorías. Esta estructura se reflejará dinámicamente en el botón "Productos" del menú de navegación.
               </p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {parentCategories.map((cat: Category) => {
            const subcategories = categories.filter(c => c.parentId === cat.slug || c.parentId === cat.id);
            return (
              <div key={cat.id} className="admin-v2-card group overflow-hidden border border-gray-100 p-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center p-2 border border-gray-200">
                           <img src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-lg uppercase tracking-[0.1em]">{cat.name}</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Slug: {cat.slug}</p>
                            <div className="mt-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest inline-block shadow-sm">
                               {cat.productCount || 0} PRODUCTOS DIRECTOS
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => openEditCategoryModal(cat)}
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#058c8c] hover:bg-blue-50 transition-colors"
                            title="Editar Categoría"
                        >
                            <FaEdit size={14} />
                        </button>
                        <button 
                            onClick={() => handleDelete(cat)}
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Eliminar Categoría"
                        >
                            <FaTrash size={14} />
                        </button>
                    </div>
                 </div>

                 {/* Subcategories list */}
                 {subcategories.length > 0 && (
                     <div className="mt-6 ml-24 pl-6 border-l-2 border-gray-100 space-y-4">
                         <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Subcategorías</h4>
                         {subcategories.map(sub => (
                            <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-transparent hover:border-[#058c8c]/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center p-1 border border-gray-200">
                                       <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{sub.name}</h4>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Slug: {sub.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white text-gray-500 border border-gray-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-sm">
                                       {sub.productCount || 0} ITEMS
                                    </div>
                                    <button onClick={() => openEditCategoryModal(sub)} className="text-gray-400 hover:text-[#058c8c] transition-colors"><FaEdit size={12}/></button>
                                    <button onClick={() => handleDelete(sub)} className="text-gray-400 hover:text-red-500 transition-colors"><FaTrash size={12}/></button>
                                </div>
                            </div>
                         ))}
                     </div>
                 )}
              </div>
            );
        })}
      </div>

      {/* Edit/Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-md animate-fadeIn">
           <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slideDown border border-gray-100 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                 <div>
                    <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                        {isNew ? 'Nueva Categoría' : 'Editar Categoría'}
                    </h2>
                 </div>
                 <button onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-gray-600 transition p-2 bg-white rounded-full shadow-sm">
                    <FaTimesCircle size={20} />
                 </button>
              </div>
              
              <div className="p-8 space-y-6 overflow-y-auto flex-1">
                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Nombre</label>
                    <input 
                        type="text"
                        value={editingCategory.name || ''}
                        onChange={e => {
                           const newName = e.target.value;
                           const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                           setEditingCategory({
                               ...editingCategory, 
                               name: newName,
                               ...(isNew ? { slug } : {})
                           });
                        }}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold focus:border-[#058c8c] transition-all"
                        placeholder="Ej: Auriculares"
                    />
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Slug (URL)</label>
                    <input 
                        type="text"
                        value={editingCategory.slug || ''}
                        onChange={e => setEditingCategory({...editingCategory, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold focus:border-[#058c8c] transition-all"
                        placeholder="Ej: auriculares"
                    />
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Identificador único en minúsculas y sin espacios.</p>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Categoría Padre (Opcional)</label>
                    <select
                        value={editingCategory.parentId || ''}
                        onChange={e => setEditingCategory({...editingCategory, parentId: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none text-sm font-bold text-gray-700 focus:border-[#058c8c] transition-all cursor-pointer"
                    >
                        <option value="">-- Ninguna (Es categoría principal) --</option>
                        {parentCategories
                            .filter(c => c.id !== editingCategory.id && c.slug !== editingCategory.slug)
                            .map(c => (
                               <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                    </select>
                    <p className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Seleccioná si esta es una subcategoría.</p>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Imagen</label>
                    <div className="flex gap-4 items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-2">
                           <img src={editingCategory.image || '/images/placeholder.jpg'} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <label className="cursor-pointer bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded text-xs font-bold flex items-center gap-2 justify-center hover:bg-gray-50 transition w-full">
                                {uploadingImage ? 'Subiendo...' : <><FaImage /> Cambiar Imagen</>}
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                            </label>
                            <input 
                                type="text"
                                value={editingCategory.image || ''}
                                onChange={e => setEditingCategory({...editingCategory, image: e.target.value})}
                                className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded outline-none text-xs text-gray-500 focus:border-[#058c8c] transition-all"
                                placeholder="/images/tu-imagen.png"
                            />
                        </div>
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
                    <textarea 
                        value={editingCategory.description || ''}
                        onChange={e => setEditingCategory({...editingCategory, description: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg outline-none text-sm text-gray-700 focus:border-[#058c8c] transition-all resize-none h-20"
                        placeholder="Breve descripción de la categoría..."
                    />
                 </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-4 bg-gray-50/50">
                 <button 
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 text-xs font-black text-gray-500 uppercase tracking-widest hover:text-gray-800 transition active:scale-95 bg-white border border-gray-200 rounded-xl shadow-sm"
                 >
                    Cancelar
                 </button>
                 <button 
                  onClick={() => handleSave(editingCategory)}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-[#058c8c] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-[#058c8c]/30 hover:bg-[#047a7a] hover:scale-[1.02] transition-all transform active:scale-95 disabled:opacity-50"
                 >
                    {isSaving ? 'Guardando...' : 'Guardar Categoría'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
