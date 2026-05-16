'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { getAllPublic } from '@/lib/api/productService';
import { useCart } from '@/app/context/CartContext';
import type { Product } from '@/lib/api/productService';
import Link from 'next/link';
import { FaShoppingCart, FaEye, FaSearch } from 'react-icons/fa';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const loadResults = async () => {
      try {
        setLoading(true);
        if (query) {
          const { items } = await getAllPublic(query, 1, 50);
          setProducts(items);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Error searching products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Buscando productos...</div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col items-center min-h-screen pt-4">
      <div className="max-w-[1300px] w-full px-4 pb-12 flex flex-col">
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px', display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>Inicio</Link>
          <span>›</span>
          <span style={{ color: '#333' }}>Búsqueda</span>
        </div>

        {/* Search Title */}
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#222', marginBottom: '8px' }}>
          RESULTADOS PARA: <span className="text-blue-600 font-extrabold">"{query}"</span>
        </h1>
        <p className="text-gray-500 mb-8">{products.length} productos encontrados</p>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50">
            <div className="bg-white p-6 rounded-full shadow-sm mb-6">
              <FaSearch size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No encontramos lo que buscas</h2>
            <p className="text-gray-500 mb-8 text-center max-w-md px-4">
              Intentá con otras palabras o navegá por nuestras categorías para encontrar el producto ideal.
            </p>
            <Link 
              href="/" 
              className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg"
            >
              VOLVER AL INICIO
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <div
                key={product.id}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
              >
                {/* Product Image */}
                <Link href={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 p-6 overflow-hidden">
                  <img
                    src={product.image || (product.imageUrls && product.imageUrls[0]) || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  {(product.discountBase || (product.discount && product.discount > 0)) && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm">
                      OFERTA 🔥
                    </div>
                  )}
                </Link>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-2">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{product.brand}</div>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-gray-800 font-bold text-base line-clamp-2 leading-snug hover:text-blue-600 transition-colors h-[2.6rem]"
                  >
                    {product.name}
                  </Link>
                  
                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="flex items-end gap-2">
                       <span className="text-2xl font-black text-gray-900">${product.price.toLocaleString()}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Link
                        href={`/product/${product.id}`}
                        className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-xs font-bold hover:bg-gray-50 transition-colors"
                      >
                        <FaEye size={12} /> VER
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                          addedToCart[product.id] 
                          ? 'bg-green-600 text-white' 
                          : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-100'
                        }`}
                      >
                        <FaShoppingCart size={12} /> {addedToCart[product.id] ? '¡LISTO!' : 'COMPRAR'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 text-sm">Cargando buscador...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
