'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { Product } from '@/lib/api/productService';
import { Spec } from '@/lib/api/productSpecifications';
import Link from 'next/link';
import { FaUpload, FaSave, FaInfoCircle, FaSearch, FaTable, FaTimesCircle, FaTags, FaBoxOpen, FaCogs, FaGlobe, FaPlus, FaTrash, FaExclamationTriangle, FaPercentage } from 'react-icons/fa';
import { useCallback } from 'react';



export default function ProductsPage() {
  const [products, setProducts] = useState<{ [key: string]: Product[] }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, Spec[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'media' | 'specs' | 'seo'>('general');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'no-image' | 'no-description' | 'low-stock'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(1500);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch('/api/admin');
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || 'Error al cargar datos');
      }
      const data = await resp.json();
      setProducts(data.products || {});
      setCategories(data.categories || []);
      setSpecifications(data.specifications || {});
      
      const settingsResp = await fetch('/api/admin/settings');
      const settingsData = await settingsResp.json();
      if (settingsData.success) {
        setExchangeRate(settingsData.settings.exchangeRate);
      }
      
      setLoading(false);
      setIsDataLoaded(true);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStockChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    if (updated[category]) {
      const p = updated[category].find(x => x.id === id);
      if (p) p.stock = newValue;
    }
    setProducts(updated);
  };

  const handlePriceChange = (category: string, id: string, newValue: number) => {
    const updated = { ...products };
    if (updated[category]) {
      const p = updated[category].find(x => x.id === id);
      if (p) p.price = newValue;
    }
    setProducts(updated);
  };

  const handleProductChange = <K extends keyof Product>(id: string, category: string, field: K, value: Product[K]) => {
    setProducts(prevProducts => {
      const updated = { ...prevProducts };
      if (!updated[category]) updated[category] = [];
      
      const exists = updated[category].some(p => p.id === id);
      if (exists) {
        updated[category] = updated[category].map(p => {
          if (p.id === id) {
             const newP = { ...p, [field]: value };
             if (field === 'images' && Array.isArray(value)) {
               newP.image = (value[0] as string) || '/images/placeholder.jpg';
             }
             return newP;
          }
          return p;
        });
      } else {
        const newProduct: any = { 
          id, category, name: '', price: 0, image: '/images/placeholder.jpg', stock: 0, [field]: value 
        };
        updated[category].push(newProduct);
      }
      return updated;
    });

    setEditingProduct(prev => {
      if (prev?.id === id) {
        const newP = { ...prev, [field]: value };
        if (field === 'discount') {
          const disc = Number(value);
          const base = newP.originalPrice || newP.price;
          if (disc > 0) {
            newP.originalPrice = base;
            newP.price = Math.round(base * (1 - disc / 100));
          } else {
            newP.price = newP.originalPrice || newP.price;
            newP.originalPrice = undefined;
          }
          
          setTimeout(() => {
            setProducts(prevProducts => {
              const updated = { ...prevProducts };
              if (updated[category]) {
                updated[category] = updated[category].map(item => item.id === id ? { ...item, price: newP.price, originalPrice: newP.originalPrice } : item);
              }
              return updated;
            });
          }, 0);
        }

        if (field === 'originalPrice') {
          const orig = Number(value);
          if (newP.discount && newP.discount > 0) {
            newP.price = Math.round(orig * (1 - newP.discount / 100));
          }
           setTimeout(() => {
            setProducts(prevProducts => {
              const updated = { ...prevProducts };
              if (updated[category]) {
                updated[category] = updated[category].map(item => item.id === id ? { ...item, price: newP.price, originalPrice: newP.originalPrice } : item);
              }
              return updated;
            });
          }, 0);
        }

        return newP;
      }
      return prev;
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file || !editingProduct) return;
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const resp = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const res = await resp.json();
      if (res.success) {
        const newImages = [...(editingProduct.images || [])];
        newImages[index] = res.url;
        const cleanImages = newImages.filter(Boolean);
        handleProductChange(editingProduct.id, editingProduct.category, 'images', cleanImages);
        // Auto-guardar inmediatamente tras subir la imagen
        await autoSaveProductImages(editingProduct.id, editingProduct.category, cleanImages);
      } else {
        alert(res.message || 'Error al subir archivo');
      }
    } catch (err) {
      alert('Error de conexión al subir');
    } finally {
      setUploadingIndex(null);
    }
  };

  const saveProducts = async (shouldCloseEditor = false) => {
    setMessage('Guardando cambios...');
    setIsSaving(true);

    if (editingProduct) {
      const p = editingProduct;
      const errors = [];
      if (!p.name?.trim()) errors.push('Nombre');
      if (!p.price || p.price <= 0) errors.push('Precio');
      if (!p.category || p.category === 'general') errors.push('Categoría');
      
      const validSpecs = (p.specifications || []).filter(s => s.label?.trim() && s.value?.trim());
      if (validSpecs.length === 0) errors.push('Al menos una especificación (con etiqueta y valor)');

      if (errors.length > 0) {
        setMessage(`Error: Faltan campos requeridos: ${errors.join(', ')}`);
        setIsSaving(false);
        return;
      }
    }

    const allProducts = Object.values(products).flat() as Product[];
    const invalidProduct = allProducts.find((p) => !p.name || p.name.trim() === '');
    if (invalidProduct) {
      setMessage(`Error: El producto con ID ${invalidProduct.id} no tiene nombre.`);
      setIsSaving(false);
      return;
    }

    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'save_products', data: products }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage('¡Cambios guardados con éxito!');
        if (shouldCloseEditor) {
          setEditingProduct(null);
          fetchData(); // Refresh list to show changes
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`Error: ${res.message}`);
      }
    } catch (err) {
      setMessage('Error de conexión al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-guarda las imágenes de un producto específico inmediatamente en MongoDB
  const autoSaveProductImages = async (productId: string, category: string, updatedImages: string[]) => {
    try {
      const updatedData: { [key: string]: Product[] } = {};
      for (const [cat, items] of Object.entries(products)) {
        updatedData[cat] = (items as Product[]).map((p: Product) =>
          p.id === productId && cat === category
            ? { ...p, images: updatedImages, image: updatedImages[0] || p.image }
            : p
        );
      }
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'save_products', data: updatedData }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage('✓ Imagen guardada automáticamente');
        setTimeout(() => setMessage(''), 2500);
      }
    } catch (err) {
      console.error('Error en autoguardado de imágenes:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente?')) return;
    setDeletingId(productId);
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'delete_product', data: { productId } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage('Producto eliminado con éxito');
        setEditingProduct(null);
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddNewProduct = useCallback((categoryOverride?: string) => {
    const newId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: newId,
      name: '',
      price: 0,
      costPrice: 0,
      image: '/images/placeholder.jpg',
      images: ['/images/placeholder.jpg'],
      category: categoryOverride || 'general',
      stock: 0,
      description: '',
      specifications: [{ label: '', value: '' }],
      published: true
    };
    const cat = categoryOverride || 'general';
    setProducts(prev => ({
      ...prev,
      [cat]: [...(prev[cat] || []), newProduct]
    }));
    setEditingProduct(newProduct);
    setActiveTab('general');
    setMessage('Nuevo producto inicializado. Completa los datos y guarda.');
    setTimeout(() => setMessage(''), 3000);
  }, []);

  const toggleSelectProduct = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAllInCategory = (categoryItems: Product[]) => {
    const allIds = categoryItems.map(p => p.id);
    const allSelected = allIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allIds])]);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${selectedIds.length} productos permanentemente?`)) return;
    setIsSaving(true);
    try {
      const resp = await fetch('/api/admin', {
        method: 'POST',
        body: JSON.stringify({ action: 'bulk_delete', data: { productIds: selectedIds } }),
        headers: { 'Content-Type': 'application/json' }
      });
      const res = await resp.json();
      if (res.success) {
        setMessage(`${selectedIds.length} productos eliminados con éxito`);
        setSelectedIds([]);
        fetchData();
        setTimeout(() => setMessage(''), 3000);
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err) {
      alert('Error de conexión al eliminar');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage('Procesando archivo Excel...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);
        const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
        const getVal = (row: any, ...keys: string[]) => {
          const rowKeys = Object.keys(row);
          const normalizedTargetKeys = keys.map(normalize);
          const match = rowKeys.find(rk => normalizedTargetKeys.includes(normalize(rk)));
          return match !== undefined ? row[match] : undefined;
        };
        const resolveCategory = (raw: string, productName: string = ''): string => {
          const s = raw.toLowerCase();
          const p = productName.toLowerCase();
          if (s.includes('iphone')) return 'iphone';
          if (s.includes('celular')) return 'celulares';
          if (s.includes('parlante')) return 'parlantes';
          if (s.includes('auricular')) return 'auriculares';
          if (s.includes('macbook')) return 'macbook';
          if (s.includes('watch')) return 'watch';
          if (s.includes('notebook')) return 'notebooks';
          if (p.includes('jbl')) {
            if (['boombox', 'charge', 'flip', 'go', 'clip', 'xtreme', 'party box'].some(k => p.includes(k))) return 'parlantes';
            if (['fone', 'tune', 'sense', 'live', 'quantum', 'reflect', 'wave', 'buds'].some(k => p.includes(k))) return 'auriculares';
          }
          if (p.includes('samsung')) return 'samsung';
          if (p.includes('motorola')) return 'motorola';
          if (p.includes('xiaomi')) {
            if (p.includes('vacuum') || p.includes('robot')) return 'aspiradoras-robot';
            return 'xiaomi';
          }
          return s.split(',')[0].trim() || 'general';
        };

        const mappedProducts = json.map((row: any) => {
          const rawId = getVal(row, 'ID', 'id', 'codigo');
          const rawName = getVal(row, 'Nombre', 'name', 'producto');
          if (!rawId || !rawName) return null;
          const priceOriginal = Number(getVal(row, 'Precio', 'price') || 0);
          const priceDiscount = getVal(row, 'Descuento', 'oferta');
          const finalPrice = priceDiscount ? Number(priceDiscount) : priceOriginal;
          const imagesRaw = String(getVal(row, 'Imágenes', 'imagen', 'image') || '');
          const allImages = imagesRaw.split(/[,\s+]/).map(s => s.trim()).filter(Boolean).slice(0, 8);
          const firstImage = allImages[0] || '/images/placeholder.jpg';
          const rawCategory = String(getVal(row, 'Categoría', 'category') || 'general');
          return {
            id: String(rawId).trim(),
            name: String(rawName).trim(),
            price: finalPrice,
            image: firstImage,
            images: allImages,
            category: resolveCategory(rawCategory, rawName),
            description: String(getVal(row, 'Descripción', 'description') || ''),
            stock: Number(getVal(row, 'Cantidad', 'stock') || 0)
          };
        }).filter(Boolean);

        const resp = await fetch('/api/admin', {
          method: 'POST',
          body: JSON.stringify({ action: 'import_excel', data: { products: mappedProducts } }),
          headers: { 'Content-Type': 'application/json' }
        });
        const res = await resp.json();
        if (res.success) {
          setMessage(`¡Éxito! ${mappedProducts.length} productos importados.`);
          fetchData();
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        setMessage(`Error: ${err.message}`);
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
      <ProductsContent 
        {...{
          products, setProducts, categories, setCategories, specifications, setSpecifications,
          loading, setLoading, isDataLoaded, setIsDataLoaded, error, setError, message, setMessage,
          searchTerm, setSearchTerm, editingProduct, setEditingProduct, activeTab, setActiveTab,
          uploadingIndex, setUploadingIndex, isSaving, setIsSaving, filterType, setFilterType,
          categoryFilter, setCategoryFilter,
          deletingId, setDeletingId, selectedIds, setSelectedIds, exchangeRate, setExchangeRate,
          fetchData, handleStockChange, handlePriceChange, handleProductChange, handleFileUpload,
          saveProducts, autoSaveProductImages, handleDeleteProduct, handleAddNewProduct, toggleSelectProduct,
          toggleSelectAllInCategory, handleBulkDelete, handleExcelImport
        }} 
      />
    </Suspense>
  );
}

function ProductsContent({
  products, loading, isDataLoaded, message, searchTerm, setSearchTerm, editingProduct,
  setEditingProduct, activeTab, setActiveTab, uploadingIndex, isSaving, filterType,
  setFilterType, categoryFilter, setCategoryFilter, deletingId, selectedIds, setSelectedIds,
  exchangeRate, fetchData, handleStockChange,
  handlePriceChange, handleProductChange, handleFileUpload, saveProducts, autoSaveProductImages,
  handleDeleteProduct,
  handleAddNewProduct, toggleSelectProduct, toggleSelectAllInCategory, handleBulkDelete,
  handleExcelImport, setProducts
}: any) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (isDataLoaded && searchParams.get('new') === 'true') {
      const category = searchParams.get('category') || undefined;
      handleAddNewProduct(category);
      router.replace('/admin/products');
    }
  }, [isDataLoaded, searchParams, handleAddNewProduct, router]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-gray-500 animate-pulse font-medium">Cargando inventario...</div>;

  const allFlatProducts = products ? (Object.values(products).flat().filter(Boolean) as Product[]) : [];

  return (
    <div className="animate-fadeIn pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="admin-v2-page-title mb-1">Productos</h1>
          <nav className="text-[10px] items-center gap-2 text-gray-400 font-bold uppercase tracking-widest flex">
            <Link href="/admin" className="hover:text-[#058c8c]">Home</Link>
            <span className="opacity-30">/</span>
            <span className="text-gray-900">Catálogo</span>
          </nav>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => handleAddNewProduct()}
            className="flex-1 sm:flex-none px-10 py-5 bg-[#058c8c] text-white rounded-2xl shadow-2xl shadow-[#058c8c]/30 hover:bg-[#047a7a] hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-black text-sm uppercase tracking-[0.2em] animate-pulse-subtle z-50 border-4 border-white"
          >
            <FaPlus size={16} /> NUEVO PRODUCTO
          </button>
          <button
            onClick={saveProducts}
            className="flex-1 sm:flex-none px-8 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200/50"
          >
            <FaSave /> Guardar Cambios Globales
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="admin-v2-card p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl"><FaBoxOpen /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Total Items</div>
             <div className="text-xl font-black text-gray-900">{allFlatProducts.length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-red-500">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-xl"><FaExclamationTriangle /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Stock Crítico</div>
             <div className="text-xl font-black text-gray-900">{allFlatProducts.filter((p: any) => p.stock <= 5).length}</div>
          </div>
        </div>
        <div className="admin-v2-card p-6 flex items-center gap-5 border-l-4 border-l-orange-400">
           <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center text-xl"><FaTable /></div>
          <div>
             <div className="text-[10px] font-bold text-gray-400 uppercase">Faltantes</div>
             <div className="text-xl font-black text-gray-900">
               {allFlatProducts.filter((p: any) => !p.image || p.image.includes('placeholder') || p.image.includes('default')).length}
             </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 items-center">
        {(['all', 'no-image', 'no-description', 'low-stock'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterType === tab ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
          >
            {tab === 'all' ? 'Todos' : tab === 'no-image' ? 'Sin Foto' : tab === 'no-description' ? 'Sin Desc.' : 'Stock Bajo'}
          </button>
        ))}
        <div className="ml-auto flex-shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-gray-200 bg-white text-gray-600 outline-none cursor-pointer hover:border-gray-400 transition-all appearance-none pr-8"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b7280'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            <option value="all">📂 Todas las categorías</option>
            <option value="promociones">🏷️ TODAS LAS PROMOCIONES (CON DESCUENTO)</option>
            <option value="ofertas-semanales">🔥 Ofertas Semanales (Categoría)</option>
            {products && Object.keys(products).sort().filter(c => c !== 'ofertas-semanales').map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-v2-card mb-10 overflow-hidden">
        <div className="p-6 bg-gray-50/50 flex flex-wrap gap-10 items-center justify-between">
          <div className="flex gap-6 items-center flex-1">
             <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center text-gray-400"><FaSearch /></div>
             <input
               type="text"
               placeholder="Buscar por ID o nombre..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-900 w-full"
             />
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pr-4 border-r border-gray-200">Importar Excel</span>
             <input type="file" accept=".xlsx, .xls" onChange={handleExcelImport} className="text-xs text-gray-400 cursor-pointer" />
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-8 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-slideDown ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {message}
        </div>
      )}

      <div className="space-y-12">
        {products && Object.entries(products)
          .filter(([category, items]) => {
            if (categoryFilter === 'all') return true;
            if (categoryFilter === 'promociones') {
               // Special case: show this category group if ANY item in it has a discount
               return (items as Product[]).some(p => (p.discount && p.discount > 0) || (p.originalPrice && p.originalPrice > p.price));
            }
            return category === categoryFilter;
          })
          .map(([category, items]: [any, any]) => {
          const filteredItems = items.filter((p: Product) => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (categoryFilter === 'promociones') {
              const hasDiscount = (p.discount && p.discount > 0) || (p.originalPrice && p.originalPrice > p.price);
              if (!hasDiscount) return false;
            }

            if (filterType === 'no-image') return !p.image || p.image.includes('placeholder');
            if (filterType === 'low-stock') return p.stock <= 5;
            return true;
          });
          if (filteredItems.length === 0 && searchTerm) return null;

          return (
            <div key={category} className="admin-v2-card overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/20 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">{category}</h3>
                <input 
                  type="checkbox" 
                  checked={filteredItems.length > 0 && filteredItems.every((p: any) => selectedIds.includes(p.id))}
                  onChange={() => toggleSelectAllInCategory(filteredItems)}
                  className="w-4 h-4 rounded border-gray-200"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-gray-50">
                    {filteredItems.map((p: Product) => (
                      <tr key={p.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(p.id) ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4 w-12"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelectProduct(p.id)} /></td>
                        <td className="px-6 py-4 w-16 text-[10px] font-bold text-gray-300">#{p.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setEditingProduct(p)}>
                            <div className="w-10 h-10 bg-white rounded border border-gray-100 overflow-hidden group-hover:border-[#058c8c] transition-colors">
                              <img src={p.image} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-gray-900 text-xs group-hover:text-[#058c8c] transition-colors">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 w-40">
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-gray-400">$</span>
                             <input type="number" value={p.price} onChange={(e) => handlePriceChange(category, p.id, Number(e.target.value))} className="w-24 bg-transparent border-b border-transparent hover:border-gray-100 focus:border-[#058c8c] outline-none text-xs font-black" />
                          </div>
                        </td>
                        <td className="px-6 py-4 w-28 text-center">
                           <input type="number" value={p.stock} onChange={(e) => handleStockChange(category, p.id, Number(e.target.value))} className={`w-12 bg-transparent text-center font-bold text-xs ${p.stock <= 5 ? 'text-red-500' : 'text-gray-900'}`} />
                        </td>
                        <td className="px-6 py-4 w-20 text-center">
                           <label className="relative inline-flex items-center cursor-pointer">
                             <input
                               type="checkbox"
                               className="sr-only peer"
                               checked={p.published !== false}
                               onChange={(e) => handleProductChange(p.id, category, 'published', e.target.checked)}
                             />
                             <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#058c8c]"></div>
                           </label>
                        </td>
                        <td className="px-6 py-4 w-16 text-right">
                           <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-200 hover:text-red-500 transition-colors"><FaTrash size={12} /></button>
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

      {/* Product Editor Full-Screen Overlay */}
      {editingProduct && (
        <div className="fixed top-0 right-0 bottom-0 left-[250px] z-[100] bg-[#f8fafb] flex flex-col animate-fadeIn border-l border-[#e1e3e5] shadow-2xl">
          {(() => {
            const p = editingProduct;
            return (
              <>
                {/* Header */}
                <div className="bg-white border-b border-[#e1e3e5] px-8 py-4 flex items-center justify-between z-10 shrink-0">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-gray-400 font-bold"
                    >
                      <FaTimesCircle size={20} />
                    </button>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{p.name || 'Nuevo Producto'}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded uppercase tracking-widest">{p.category}</span>
                        <span className="text-[9px] text-gray-300 font-bold">#{p.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-8 py-2 bg-gray-100 text-gray-700 rounded h-10 font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-sm"
                    >
                      Cerrar editor
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <aside className="w-64 bg-white border-r border-[#e1e3e5] flex flex-col p-6 gap-1 shrink-0">
                    <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Navegación</h4>
                    {[
                      { id: 'general', label: 'Información', icon: <FaTags />, desc: 'Básicos y Precio' },
                      { id: 'media', label: 'Imágenes', icon: <FaBoxOpen />, desc: 'Galería visual' },
                      { id: 'specs', label: 'Ficha Técnica', icon: <FaCogs />, desc: 'Especificaciones' },
                      { id: 'seo', label: 'SEO', icon: <FaGlobe />, desc: 'Meta y Búsqueda' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex flex-col items-start gap-0.5 p-3 rounded transition-all text-left ${activeTab === tab.id ? 'bg-[#edeeef] text-[#058c8c]' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{tab.icon}</span>
                          <span className="text-xs font-bold leading-none">{tab.label}</span>
                        </div>
                        <span className="text-[10px] opacity-60 font-medium ml-7">{tab.desc}</span>
                      </button>
                    ))}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                      <div className="bg-gray-50 rounded p-4 border border-gray-100">
                        <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Cambios Locales</h5>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Recuerda guardar los cambios al final.</p>
                      </div>
                    </div>
                  </aside>

                  <main className="flex-1 overflow-y-auto bg-gray-50/30 p-12">
                    <div className="max-w-4xl mx-auto admin-v2-card bg-white p-10">
                      {activeTab === 'general' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Información General</h4>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="col-span-2">
                              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Nombre</label>
                              <input
                                type="text"
                                value={p.name}
                                onChange={(e) => handleProductChange(p.id, p.category, 'name', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold text-gray-900 focus:border-[#058c8c] focus:bg-white transition"
                              />
                            </div>
                            
                            <div className="col-span-2 bg-[#058c8c]/[0.02] p-8 border border-[#058c8c]/10 rounded-2xl flex items-center justify-start">
                               <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Minorista (ARS)</label>
                                 <div className="flex items-center justify-start gap-2 text-[#058c8c]">
                                   <span className="text-2xl font-black">$</span>
                                   <input
                                     type="number"
                                     value={p.price || 0}
                                     onChange={(e) => handleProductChange(p.id, p.category, 'price', Number(e.target.value))}
                                     className="bg-transparent text-2xl font-black text-left outline-none w-48 border-b-2 border-transparent focus:border-[#058c8c] transition-all"
                                   />
                                 </div>
                                 <p className="text-[10px] text-gray-400 font-bold mt-1 italic uppercase tracking-tighter">
                                    Precio establecido manualmente
                                 </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Stock Actual</label>
                              <input
                                type="number"
                                value={p.stock}
                                onChange={(e) => handleProductChange(p.id, p.category, 'stock', Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold"
                              />
                            </div>
                            <div>
                               <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Categoría</label>
                               <select
                                 value={p.category}
                                 onChange={(e) => handleProductChange(p.id, p.category, 'category', e.target.value)}
                                 className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold text-gray-600 focus:border-[#058c8c] focus:bg-white transition appearance-none"
                               >
                                 <option value="general">General</option>
                                 {categories.map((cat: any) => (
                                   cat.slug !== 'general' && <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                                 ))}
                               </select>
                            </div>
                             <div className="col-span-2 bg-orange-50/30 p-8 border border-orange-100 rounded-2xl flex items-center justify-between">
                               <div>
                                  <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2">Descuento (%)</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="number"
                                      value={p.discount || 0}
                                      onChange={(e) => handleProductChange(p.id, p.category, 'discount', Number(e.target.value))}
                                      className="bg-transparent text-2xl font-black text-gray-900 outline-none w-20 border-b-2 border-transparent focus:border-orange-500 transition-all"
                                    />
                                    <FaPercentage className="text-orange-400" />
                                  </div>
                               </div>
                                <div className="text-right">
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio de Lista (Original)</label>
                                  <div className="flex items-center justify-end gap-2 text-gray-400">
                                    <span className="text-2xl font-black">$</span>
                                    <input
                                      type="number"
                                      value={p.originalPrice || 0}
                                      onChange={(e) => handleProductChange(p.id, p.category, 'originalPrice', Number(e.target.value))}
                                      className="bg-transparent text-2xl font-black text-right outline-none w-48 border-b-2 border-transparent focus:border-gray-300 transition-all line-through"
                                      placeholder="-"
                                    />
                                  </div>
                                  <p className="text-[10px] text-orange-500 font-bold mt-1 italic uppercase tracking-tighter">
                                    {p.discount && p.discount > 0 ? `Este producto aparecerá en sección Ofertas` : 'Sin descuento activo'}
                                  </p>
                               </div>
                             </div>

                             <div className="flex items-center justify-between p-4 bg-gray-50 border border-[#e1e3e5] rounded">
                               <div>
                                 <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Visibilidad</label>
                                 <p className="text-[10px] text-gray-400 font-medium">{p.published !== false ? 'Público en el catálogo' : 'Oculto (Borrador)'}</p>
                               </div>
                               <label className="relative inline-flex items-center cursor-pointer">
                                 <input
                                   type="checkbox"
                                   className="sr-only peer"
                                   checked={p.published !== false}
                                   onChange={(e) => handleProductChange(p.id, p.category, 'published', e.target.checked)}
                                 />
                                 <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#058c8c]"></div>
                               </label>
                             </div>
                          </div>
                          <div>
                            <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Descripción</label>
                            <textarea
                              rows={5}
                              value={p.description || ''}
                              onChange={(e) => handleProductChange(p.id, p.category, 'description', e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm text-gray-600 leading-relaxed"
                            />
                          </div>
                        </div>
                      )}

                      {activeTab === 'media' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Galería de Imágenes</h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                              const currentImg = (p.images || [])[index] || '';
                              return (
                                <div key={index} className="space-y-3">
                                  <div className="aspect-square bg-gray-50 rounded border-2 border-dashed border-[#e1e3e5] overflow-hidden flex items-center justify-center relative group">
                                     {currentImg ? (
                                       <img src={currentImg} alt="" className="w-full h-full object-contain p-2" />
                                     ) : (
                                       <FaUpload className="text-gray-200" size={24} />
                                     )}
                                     <input 
                                       type="file" 
                                       className="absolute inset-0 opacity-0 cursor-pointer" 
                                       onChange={(e) => handleFileUpload(e, index)} 
                                     />
                                     {uploadingIndex === index && (
                                       <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                          <div className="w-5 h-5 border-2 border-[#058c8c] border-t-transparent rounded-full animate-spin"></div>
                                       </div>
                                     )}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="URL"
                                    value={currentImg}
                                    onChange={(e) => {
                                      const newImgs = [...(p.images || [])];
                                      newImgs[index] = e.target.value;
                                      handleProductChange(p.id, p.category, 'images', newImgs.filter(Boolean));
                                    }}
                                     onBlur={(e) => {
                                       const newImgs = [...(p.images || [])];
                                       newImgs[index] = e.currentTarget.value;
                                       const imgs = newImgs.filter(Boolean);
                                       if (imgs.length > 0) autoSaveProductImages(p.id, p.category, imgs);
                                     }}
                                    className="w-full text-[10px] px-2 py-1 bg-white border border-[#e1e3e5] rounded outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeTab === 'specs' && (
                        <div className="space-y-8 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Especificaciones</h4>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                const newSpecs = [...(p.specifications || [])];
                                newSpecs.push({ label: '', value: '' });
                                handleProductChange(p.id, p.category, 'specifications', newSpecs);
                              }}
                              className="px-6 py-2.5 bg-[#058c8c] text-white rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#047a7a] transition-all flex items-center gap-2"
                            >
                              <FaPlus size={12} /> Añadir Especificación
                            </button>
                          </div>
                          <div className="space-y-3">
                            {(p.specifications || []).length === 0 && (
                              <div className="text-center py-6 bg-gray-50 border border-dashed border-gray-200 rounded">
                                <p className="text-xs text-gray-400 font-medium mb-4">No hay especificaciones agregadas.</p>
                                <button
                                  onClick={() => handleProductChange(p.id, p.category, 'specifications', [{ label: '', value: '' }])}
                                  className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition"
                                >
                                  Agregar Primer Campo
                                </button>
                              </div>
                            )}
                            {(p.specifications || []).map((spec: any, idx: number) => (
                              <div key={idx} className="flex gap-4 p-4 bg-gray-50 border border-[#e1e3e5] rounded items-center">
                                <input
                                  type="text"
                                  placeholder="Etiqueta (ej: Pantalla)"
                                  value={spec.label}
                                  onChange={(e) => {
                                    const newSpecs = [...(p.specifications || [])];
                                    newSpecs[idx].label = e.target.value;
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="w-1/3 px-3 py-2 bg-white border border-[#e1e3e5] rounded text-xs font-bold outline-none focus:border-[#058c8c]"
                                />
                                <input
                                  type="text"
                                  placeholder="Valor (ej: 6.5 pulgadas)"
                                  value={spec.value}
                                  onChange={(e) => {
                                    const newSpecs = [...(p.specifications || [])];
                                    newSpecs[idx].value = e.target.value;
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="flex-1 px-3 py-2 bg-white border border-[#e1e3e5] rounded text-xs outline-none focus:border-[#058c8c]"
                                />
                                <button
                                  onClick={() => {
                                    const newSpecs = (p.specifications || []).filter((_: any, i: number) => i !== idx);
                                    handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                  }}
                                  className="text-gray-300 hover:text-red-500 transition"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          {(p.specifications || []).length > 0 && (
                            <div className="mt-6 flex justify-center">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  const newSpecs = [...(p.specifications || [])];
                                  newSpecs.push({ label: '', value: '' });
                                  handleProductChange(p.id, p.category, 'specifications', newSpecs);
                                }}
                                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all border-2 border-dashed border-gray-300 flex items-center gap-2"
                              >
                                <FaPlus size={12} /> Agregar otra especificación
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'seo' && (
                        <div className="space-y-8 animate-fadeIn">
                          <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">SEO y Logística</h4>
                          <div className="grid grid-cols-2 gap-8">
                            <div>
                               <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Peso (kg)</label>
                               <input
                                 type="text"
                                 value={p.properties?.weight || ''}
                                 onChange={(e) => handleProductChange(p.id, p.category, 'properties', { ...p.properties, weight: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold"
                               />
                            </div>
                            <div>
                               <label className="block text-[9px] font-black text-gray-400 uppercase mb-2">Dimensiones</label>
                               <input
                                 type="text"
                                 value={p.properties?.dimensions || ''}
                                 onChange={(e) => handleProductChange(p.id, p.category, 'properties', { ...p.properties, dimensions: e.target.value })}
                                 className="w-full px-4 py-3 bg-gray-50 border border-[#e1e3e5] rounded outline-none text-sm font-bold"
                               />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DELETE AND SAVE BUTTONS AT THE BOTTOM */}
                      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          disabled={deletingId === p.id}
                          className="flex items-center gap-2 text-red-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest transition-colors px-4 py-2 rounded hover:bg-red-50"
                        >
                          <FaTrash size={12} />
                          {deletingId === p.id ? 'Eliminando...' : 'Eliminar Producto'}
                        </button>
                        
                        <div className="flex gap-4">
                          <button
                            onClick={() => setEditingProduct(null)}
                            className="px-6 py-3 text-gray-400 font-bold text-[10px] uppercase tracking-widest hover:text-gray-600 transition"
                          >
                            Cancelar
                          </button>
                        <button
                          onClick={() => saveProducts(true)}
                          disabled={isSaving}
                          className={`px-10 py-3 bg-[#058c8c] text-white rounded font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#047a7a] transition-all flex items-center gap-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        >
                          {isSaving ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Guardando...
                            </>
                          ) : (
                            <>
                              <FaSave size={14} />
                              Guardar cambios del producto
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-gray-900 text-white px-8 py-4 rounded-full shadow-2xl border border-gray-800 flex items-center gap-10 animate-slideUp">
           <div className="flex items-center gap-4 border-r border-gray-700 pr-10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Seleccionados</span>
              <span className="text-xl font-black">{selectedIds.length}</span>
           </div>
           
           <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedIds([])}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-gray-400 transition"
              >
                Cancelar
              </button>
              
              <button
                onClick={handleBulkDelete}
                disabled={isSaving}
                className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                <FaTrash size={12} />
                Eliminar Seleccionados
              </button>
           </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        @keyframes slideUp {
          from { transform: translate(-50%, 20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
