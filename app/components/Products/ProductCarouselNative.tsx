'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight, FaStar, FaRegStar } from 'react-icons/fa';
import { getProductsBySection } from '@/lib/api/productService';
import { useSession } from 'next-auth/react';
import '../../styles/Categories.css';
import '../../styles/ProductCarousel.css';

interface ProductCarouselSectionProps {
  title: string;
  type?: 'section' | 'category';
  value: string;
}

export function ProductCarouselSection({ title, type = 'section', value }: ProductCarouselSectionProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const { data: session } = useSession();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data: any[] = [];
        if (type === 'section') {
           // We can still use the section logic or fallback to a category search if it's not a standard section
           data = await getProductsBySection(value as any);
        } else {
           // Direct category fetch
           const res = await fetch(`/api/products?category=${value}`);
           if (res.ok) data = await res.json();
        }
        if (data.length === 0) {
          data = [
            { id: 'mock1', name: 'Auriculares Inalámbricos Pro Max', price: 45000, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Auriculares', stock: 10, discount: 15 },
            { id: 'mock2', name: 'Cámara de Seguridad WiFi HD', price: 32000, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Camara', stock: 5 },
            { id: 'mock3', name: 'Soporte Articulado de Pared', price: 15000, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Soporte', stock: 20 },
            { id: 'mock4', name: 'Smartwatch Deportivo Serie 8', price: 89000, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Smartwatch', stock: 8, discount: 5 },
            { id: 'mock5', name: 'Funda Protectora Premium', price: 8500, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Funda', stock: 50 },
            { id: 'mock6', name: 'Router WiFi 6 Alta Velocidad', price: 65000, image: 'https://placehold.co/400x400/f3f4f6/6b7280/png?text=Router', stock: 12 }
          ];
        }
        setProducts(data);

        // Fetch favorites
        if (session?.user?.email) {
          const favRes = await fetch('/api/user/favorites');
          const favData = await favRes.json();
          if (favData.success) {
            setUserFavorites(favData.favorites.map((f: any) => f.id));
          }
        }
      } catch (error) {
        console.error(`Error fetching products for ${value}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [type, value, session?.user?.email]);

  const toggleFavorite = async (e: React.MouseEvent, productId: string, productName: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      alert('Inicia sesión para guardar favoritos');
      return;
    }

    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, productName }),
      });
      const data = await res.json();
      if (data.success) {
        setUserFavorites(prev => 
          data.isFavorite ? [...prev, productId] : prev.filter(id => id !== productId)
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const children = scrollRef.current.children;
      if (children.length === 0) return;
      
      const itemWidth = (children[0] as HTMLElement).offsetWidth;
      const scrollAmount = itemWidth;
      
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll Effect
  useEffect(() => {
    if (loading || products.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const children = scrollRef.current.children;
        if (children.length === 0) return;
        
        const itemWidth = (children[0] as HTMLElement).offsetWidth;

        // If at the end, reset to start. Use a small buffer (5px) for safety.
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 4000); // 4 seconds interval for a good pace

    return () => clearInterval(interval);
  }, [loading, products, isPaused]);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const idx = cart.findIndex((p: any) => p.id === product.id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  const sectionId = value.toLowerCase().replace(/\s+/g, '-');

  return (
    <section id={sectionId} className="categories-section visible native-v22-marker" style={{ opacity: 1, transform: 'none', padding: '40px 0' }}>
      <div className="categories-container" style={{ padding: '0 16px' }}>
        <div className="categories-header">
          <div className="categories-title-wrapper">
            <h2 className="main-section-title" style={{ fontWeight: 800 }}>
              {title.split(' ').map((word, i) => i === title.split(' ').length - 1 ? <b key={i} style={{ color: '#002f6c' }}> {word}</b> : word + ' ')}
            </h2>
          </div>
          <div className="categories-arrows hidden md:flex">
            <button onClick={() => handleScroll('left')} className="arrow-btn" aria-label="Anterior">
              <FaChevronLeft size={20} />
            </button>
            <button onClick={() => handleScroll('right')} className="arrow-btn" aria-label="Siguiente">
              <FaChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          {/* Los estilos de variables se mantienen aquí para reactividad rápida en breakpoints */}
          <style dangerouslySetInnerHTML={{ __html: `
            :root { --item-width: 25%; }
            @media (max-width: 1024px) { :root { --item-width: 33.333%; } }
            @media (max-width: 768px) { :root { --item-width: 50%; } }
            @media (max-width: 480px) { :root { --item-width: 100%; } }
          `}} />
          {loading && <p className="text-center py-10">Cargando...</p>}
          {!loading && products.length > 0 && (
            <div 
              ref={scrollRef}
              className="native-carousel-grid no-scrollbar"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {products.map((product, index) => {
                const displayImage = product.image || (product.imageUrls?.[0]) || '/images/placeholder.png';
                const discountPct = product.discount || product.discountPercentage || 0;

                return (
                  <div 
                    key={`${value}-${product.id}-${index}`} 
                    className="product-item-wrapper"
                  >
                    <Link href={`/product/${product.id}`} className="product-link-wrapper">
                      <div className="product-card-white shadow-sm hover:shadow-xl transition-all duration-300">
                        {discountPct > 0 && (
                          <div className="absolute top-3 left-3 bg-[#e60000] text-white text-[10px] sm:text-xs font-black w-10 h-10 sm:w-12 sm:h-12 rounded-full z-20 flex flex-col items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 border-2 border-white leading-none">
                            <span>{Math.round(discountPct)}%</span>
                            <span className="text-[7px] sm:text-[9px]">OFF</span>
                          </div>
                        )}
                        <div className="product-image-fixed relative">
                          {/* Favorite Star Button */}
                          <button
                            onClick={(e) => toggleFavorite(e, product.id, product.name)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-30 transition-all hover:scale-110 active:scale-95 border border-gray-100"
                            style={{ color: userFavorites.includes(product.id) ? '#ffc107' : '#d1d5db' }}
                          >
                            {userFavorites.includes(product.id) ? <FaStar size={16} /> : <FaRegStar size={16} />}
                          </button>
                          
                          <img src={displayImage} alt={product.name} className="max-w-[90%] max-h-[90%] object-contain transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div className="p-4 flex flex-col flex-grow bg-white border-t border-gray-50">
                          <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-800 mb-1 line-clamp-2 min-h-[3rem] uppercase leading-tight">{product.name}</h3>
                          <p className="text-[9px] text-gray-400 mb-3 uppercase font-semibold">SKU: {product.sku || 'N/A'}</p>
                          <div className="mt-auto">
                            <div className="mb-3">
                              <span className="text-[16px] sm:text-[20px] font-black text-gray-900">${product.price?.toLocaleString('es-AR')}</span>
                            </div>
                            <button 
                              onClick={product.stock > 0 ? (e) => handleAddToCart(e, product) : undefined} 
                              disabled={product.stock <= 0}
                              className={`w-full py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all border-none ${product.stock <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : (addedProductId === product.id ? 'bg-green-500 text-white cursor-pointer' : 'bg-gray-900 text-white hover:bg-black cursor-pointer')}`}
                            >
                              {product.stock <= 0 ? 'SIN STOCK' : (addedProductId === product.id ? '✓ AGREGADO' : 'AGREGAR AL CARRITO')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        .native-carousel-grid {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: var(--item-width);
          align-items: stretch;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          ms-overflow-style: none;
          scrollbar-width: none;
          gap: 0;
        }

        .product-item-wrapper {
          scroll-snap-align: start;
          padding: 10px;
          display: flex !important;
          flex-direction: column !important;
        }

        .product-link-wrapper {
          display: flex !important;
          flex-direction: column !important;
          flex-grow: 1 !important;
          text-decoration: none !important;
          height: 100% !important;
        }

        .product-card-white {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          border: 1px solid #f3f4f6;
          display: flex !important;
          flex-direction: column !important;
          flex-grow: 1 !important;
          height: 100% !important;
          position: relative;
        }

        .product-image-fixed {
          height: 260px !important;
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background: white;
          padding: 1.5rem;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .product-image-fixed {
            height: 200px !important;
            padding: 1rem;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

export default function ProductCarousel() {
  const [carousels, setCarousels] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/home-settings');
        const data = await res.json();
        if (data.productCarousels && data.productCarousels.length > 0) {
          setCarousels(data.productCarousels.filter((c: any) => c.active));
        } else {
          // Fallback
          setCarousels([
            { title: "NUESTROS PRODUCTOS", type: 'section', value: 'bombas' },
            { title: "NUEVAS LLEGADAS", type: 'section', value: 'nuevas' }
          ]);
        }
      } catch (err) {
        console.error('Error fetching home carousels:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      {carousels.map((carousel, idx) => (
        <ProductCarouselSection 
          key={`${carousel.value}-${idx}`}
          title={carousel.title} 
          type={carousel.type}
          value={carousel.value} 
        />
      ))}
    </>
  );
}
