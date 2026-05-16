'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTrash, FaShoppingCart, FaStar, FaChevronRight } from 'react-icons/fa';
import { useCart } from '@/app/context/CartContext';

export default function FavoritosPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user/favorites');
      const data = await res.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        setFavorites(prev => prev.filter(f => f.id !== productId));
      }
    } catch (error) {
       console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    alert('¡Producto agregado al carrito!');
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-400 font-bold animate-pulse">Cargando tus favoritos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 uppercase tracking-widest font-black">
        <Link href="/mi-cuenta" className="hover:text-blue-600">Mi Cuenta</Link>
        <FaChevronRight size={8} />
        <span className="text-gray-900">Mis Favoritos</span>
      </div>

      <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
        <div>
           <h1 className="text-3xl font-black text-gray-900 mb-1">MIS FAVORITOS</h1>
           <p className="text-sm text-gray-500 font-medium">Productos que guardaste para comprar después</p>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">
           <FaStar className="text-amber-500" />
           <span className="text-blue-700 font-bold text-sm">{favorites.length} Ítems</span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
           <FaStar size={40} className="mx-auto text-gray-200 mb-4" />
           <h3 className="text-lg font-bold text-gray-900 mb-2">No tienes favoritos aún</h3>
           <p className="text-sm text-gray-500 mb-6">Explora nuestro catálogo y marca con una estrella lo que más te guste.</p>
           <Link href="/" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
              Ir a la tienda
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-lg transition-all group overflow-hidden relative">
              {/* Product Image */}
              <Link href={`/product/${product.id}`} className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-500">
                <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
              </Link>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-center">
                <Link href={`/product/${product.id}`} className="text-sm font-black text-gray-900 mb-1 hover:text-blue-600 line-clamp-1 uppercase leading-tight">
                  {product.name}
                </Link>
                <div className="text-xl font-black text-blue-600 mb-3">
                  ${product.price.toLocaleString('es-AR')}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                  >
                    <FaShoppingCart size={12} /> Comprar
                  </button>
                  <button 
                    onClick={() => removeFavorite(product.id)}
                    className="w-10 h-10 flex items-center justify-center border border-gray-100 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar de favoritos"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        div { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
}
