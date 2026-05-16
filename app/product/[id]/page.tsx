'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getProductById, getProductsByCategory, Product } from '@/lib/api/productService';
import { getSpecsByProductId, Spec } from '@/lib/api/productSpecifications';
import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';
import { FaRegCommentDots, FaTruck, FaShieldAlt, FaCreditCard, FaRegHeart, FaInfoCircle, FaStar, FaRegStar } from 'react-icons/fa';
import ShippingCalculator from '@/app/components/Shipping/ShippingCalculator';
import { useSession } from 'next-auth/react';

import { trackProductView } from '@/lib/track';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { addToCart } = useCart();
  const { data: session } = useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const foundProduct = await getProductById(id);
        setProduct(foundProduct || null);
        
        if (foundProduct) {
          setMainImage(foundProduct.image);
          // Track view
          trackProductView(foundProduct);

          // Get specs
          const foundSpecs = getSpecsByProductId(id);
          setSpecs(foundSpecs);

          // Get related products from the same category - Get more for the carousel
          const products = await getProductsByCategory(foundProduct.category);
          const related = products.filter((p: Product) => p.id !== id).slice(0, 10);
          setRelatedProducts(related);
          
          // Initialize quantity based on stock
          setQuantity(foundProduct.stock > 0 ? 1 : 0);
        }

        // Load favorites
        if (session?.user?.email) {
          const favRes = await fetch('/api/user/favorites');
          const favData = await favRes.json();
          if (favData.success) {
            setUserFavorites(favData.favorites.map((f: any) => f.id));
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, session?.user?.email]);

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

  // Auto-rotate related products - Only start when not paused
  useEffect(() => {
    if (loading || relatedProducts.length < 2 || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const children = scrollRef.current.children;
        if (children.length === 0) return;
        
        const itemWidth = (children[0] as HTMLElement).offsetWidth;

        // Looping logic
        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [loading, relatedProducts, isPaused]);

  // Handle SEO
  useEffect(() => {
    if (product?.seo) {
      if (product.seo.title) document.title = `${product.seo.title} | Innovasum`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription && product.seo.description) {
        metaDescription.setAttribute('content', product.seo.description);
      }
    } else if (product) {
      document.title = `${product.name} | Innovasum`;
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Ensure we don't add more than available stock
    const finalQuantity = Math.min(quantity, product.stock);
    if (finalQuantity <= 0) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: finalQuantity,
    });
  };

  const handleComprarAhora = () => {
    if (!product) return;
    
    // Ensure we don't add more than available stock
    const finalQuantity = Math.min(quantity, product.stock);
    if (finalQuantity <= 0) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: finalQuantity,
    });
    
    router.push('/cart'); // Or wherever checkout is
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-[#333] mb-4">Producto no encontrado</h1>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#0066cc] text-white rounded-md hover:bg-blue-700"
        >
          Volver atrás
        </button>
      </div>
    );
  }
  
  // Calculated values mimicking Mexx - 60% surcharge for installments display
  const cuotasPrice = Math.round(product.price * 1.6); 
  const sinImpuestos = Math.round(product.price * 0.79);
  
  // Deduplicate images and limit to 8
  const allImages = Array.from(new Set([product.image, ...(product.images || [])].filter(Boolean))).slice(0, 8);

  return (
    <div className="bg-white flex flex-col items-center min-h-screen pt-8">
      
      {/* Breadcrumb Navigation - Centered wrapper */}
      <div className="max-w-[1300px] w-full px-4 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#0066cc]" style={{ marginBottom: '16px' }}>
          <Link href="/" className="hover:underline">Inicio</Link>
          <span className="text-[#666]">›</span>
          <Link href={`/category/${product.category}`} className="hover:underline capitalize">
            {product.category.replace('-', ' ')}
          </Link>
          <span className="text-[#666]">›</span>
          <span className="text-[#666]">{product.name}</span>
        </div>
      </div>

      <main className="max-w-[1300px] w-full px-4 pb-20">
        {/* Top Split Area */}
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column: Image Gallery (Approx 55%) */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <div className="flex-1 bg-white flex items-center justify-center p-4 min-h-[400px] border border-transparent hover:border-gray-100 transition-all rounded-md overflow-hidden relative group">
              {((product.discount && product.discount > 0) || product.category === 'ofertas-semanales') && (
                <div className="absolute top-6 left-6 bg-[#e60000] text-white text-[14px] font-black w-16 h-16 rounded-full z-20 flex flex-col items-center justify-center shadow-2xl border-4 border-white animate-bounce leading-none p-1">
                  {product.discount && product.discount > 0 ? (
                    <>
                      <span>{Math.round(product.discount)}%</span>
                      <span className="text-[9px] font-bold">OFF</span>
                    </>
                  ) : (
                    <span className="text-[12px] font-bold uppercase">Oferta</span>
                  )}
                </div>
              )}
              <img 
                src={mainImage} 
                alt={product.name} 
                className="max-h-[450px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              {allImages.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`w-[80px] h-[80px] border flex items-center justify-center cursor-pointer p-1 rounded-sm transition-all ${mainImage === img ? 'border-[#0066cc] ring-2 ring-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img} alt="thumb" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Info and Buying Box (Approx 45%) */}
          <div className="w-full lg:w-[45%] flex flex-col pt-2">
            
            {product.category === 'ofertas-semanales' && (
              <div className="inline-block bg-[#0066cc] text-white text-[11px] font-black px-3 py-1 rounded-sm mb-3 tracking-wider uppercase animate-pulse">
                Oferta Destacada Semanal
              </div>
            )}

            <h1 className="text-[28px] font-bold text-[#333] leading-[1.2] mb-4">
              {product.name}
            </h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[18px] text-gray-400 line-through font-medium mb-0">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[42px] font-bold text-[#0066cc] leading-none mb-1">
                  ${product.price.toLocaleString()}
                </span>
                <div className="flex flex-col gap-1 text-[11px] text-[#666]">
                  <div className="flex items-center gap-1">
                    Mejor precio en 1 pago <FaInfoCircle className="text-gray-400" />
                  </div>
                  <div className="font-bold text-[#28a745] uppercase">
                    10%OFF ABONANDO POR TRANSFERENCIA
                  </div>
                </div>
              </div>
              
              {product.stock > 0 && (
                <div className="bg-[#4caf50] text-white text-[11px] font-bold px-3 py-1 rounded-sm self-start mt-2 border border-[#3e8e41]">
                  EN STOCK
                </div>
              )}
            </div>

            {/* Installments Box */}
            <div className="flex items-center gap-4 bg-white border border-[#e0e0e0] rounded-md p-4 mb-3">
              <FaCreditCard className="text-[32px] text-[#333]" />
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[18px] text-[#333]">${cuotasPrice.toLocaleString()}</span>
                  <span className="text-[#0066cc] text-[18px] font-bold">¡12 cuotas simples!</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#666]">
                  Precio 12 cuotas <FaInfoCircle className="text-gray-400" />
                </div>
              </div>
              <button
                onClick={(e) => toggleFavorite(e, product.id, product.name)}
                className="flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  color: userFavorites.includes(product.id) ? '#ffc107' : '#0066cc'
                }}
              >
                {userFavorites.includes(product.id) ? <FaStar size={28} /> : <FaRegStar size={28} />}
              </button>
            </div>

            <div className="text-[11px] text-[#888] mb-6">
              Precio sin impuestos nac: ${sinImpuestos.toLocaleString()}
            </div>

            {/* Actions: Quantity & Add to cart */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex gap-3 h-[46px]">
                {/* Quantity */}
                <div className="flex border border-[#ccc] rounded-md overflow-hidden bg-white w-[100px]">
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly
                    className="w-full text-center text-[14px] font-bold text-[#333] border-none outline-none"
                  />
                  <div className="flex flex-col border-l border-[#ccc] w-[30px] bg-[#f5f5f5]">
                    <button 
                      onClick={() => setQuantity(q => (product && q < product.stock) ? q + 1 : q)}
                      disabled={product && quantity >= product.stock}
                      className={`flex-1 flex items-center justify-center border-b border-[#ccc] transition-colors font-bold text-[#555] ${product && quantity >= product.stock ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'hover:bg-[#e0e0e0] cursor-pointer'}`}
                    >+</button>
                    <button 
                      onClick={() => setQuantity(q => Math.max(product && product.stock > 0 ? 1 : 0, q - 1))}
                      className="flex-1 flex items-center justify-center hover:bg-[#e0e0e0] cursor-pointer font-bold text-[#555]"
                    >-</button>
                  </div>
                </div>
                
                {/* Call to Actions */}
                <button 
                  onClick={product.stock > 0 ? handleComprarAhora : undefined}
                  disabled={product.stock <= 0}
                  className={`flex-1 font-bold text-[13px] uppercase rounded-md tracking-wide shadow-sm transition-colors ${product.stock <= 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0066cc] text-white hover:bg-[#0052a3] cursor-pointer'}`}
                >
                  {product.stock <= 0 ? 'SIN STOCK' : 'COMPRAR AHORA'}
                </button>
              </div>

              {/* HERE ARE THE RECUADROS CELESTES! */}
              <button 
                onClick={product.stock > 0 ? handleAddToCart : undefined}
                disabled={product.stock <= 0}
                className={`w-full h-[46px] font-bold text-[13px] uppercase rounded-md tracking-wide transition-colors ${product.stock <= 0 ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-[#e6f0ff] border border-[#b3d4ff] text-[#0066cc] hover:bg-[#d6e8ff] cursor-pointer'}`}
              >
                {product.stock <= 0 ? 'PRODUCTO AGOTADO' : 'AGREGAR AL CARRITO'}
              </button>
            </div>

            {/* Feature List */}
            <div className="flex flex-col gap-4 py-4 border-t border-[#eee] mt-2">
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e6f0ff] rounded-full flex items-center justify-center text-[#0066cc]">
                  <FaRegCommentDots size={18} />
                </div>
                <span className="hover:text-[#0066cc] cursor-pointer transition-colors">Hacer pregunta sobre este Artículo</span>
              </div>
              
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#28a745]">
                  <FaTruck size={18} />
                </div>
                <div className="flex flex-col">
                  <span>Envío a todo el país.</span>
                  <ShippingCalculator 
                    productWeight={product.properties?.weight}
                    productDimensions={product.properties?.dimensions}
                    quantity={quantity}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-[#444] text-[14px]">
                <div className="w-[36px] h-[36px] bg-[#e8f5e9] rounded-full flex items-center justify-center text-[#28a745]">
                  <FaShieldAlt size={18} />
                </div>
                <span>Garantía Oficial 12 meses</span>
              </div>
            </div>

            {/* Brand Logo & Code Info */}
            <div className="mt-auto flex justify-end items-end pt-4">
              <div className="flex flex-col items-center gap-1 border border-[#eee] px-4 py-2 rounded-sm shadow-sm bg-[#fafafa]">
                <div className="text-[12px] font-bold text-[#0066cc]">▣ {product.name.split(' ')[0].toUpperCase()}</div>
                <div className="text-[10px] text-[#666]">CÓDIGO: 10000{product.id}</div>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-[60px]">
          <div className="border-b-2 border-[#eee] mb-8 flex relative">
            <h2 className="text-[24px] font-medium text-[#333] pb-3 border-b-[3px] border-[#0066cc] -mb-[2px] pr-12 z-10 transition-all">
              Especificación
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-16 text-[15px] text-[#444]">
            {/* Custom Specifications from DB */}
            {product.specifications && product.specifications.length > 0 ? (
              product.specifications.map((s, idx) => (
                <div key={idx} className="flex font-sans items-start">
                  <strong className="w-[180px] shrink-0 text-[#333] font-bold">{s.label} :</strong> 
                  <span className="flex-1 text-[#666] font-medium">{s.value}</span>
                </div>
              ))
            ) : specs.length > 0 ? (
              specs.map((s, idx) => (
                <div key={idx} className="flex font-sans items-start">
                  <strong className="w-[180px] shrink-0 text-[#333] font-bold">{s.label} :</strong> 
                  <span className="flex-1 text-[#666] font-medium">{s.value}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex font-sans items-start"><strong className="w-[180px] shrink-0 text-[#333] font-bold">Marca :</strong> <span className="text-[#666] font-medium uppercase">{product.name.split(' ')[0]}</span></div>
                <div className="flex font-sans items-start"><strong className="w-[180px] shrink-0 text-[#333] font-bold">Modelo :</strong> <span className="text-[#666] font-medium">{product.name.split(' ').slice(1, 3).join(' ')}</span></div>
                <div className="flex font-sans items-start"><strong className="w-[180px] shrink-0 text-[#333] font-bold">ID :</strong> <span className="text-[#666] font-medium">{product.id}</span></div>
                <div className="flex font-sans items-start"><strong className="w-[180px] shrink-0 text-[#333] font-bold">Categoría :</strong> <span className="text-[#666] font-medium capitalize">{product.category.replace('-', ' ')}</span></div>
              </>
            )}

            {/* Physical Properties */}
            {product.properties && (
              <>
                {product.properties.weight && (
                  <div className="flex font-sans items-start">
                    <strong className="w-[180px] shrink-0 text-[#333] font-bold">Peso :</strong> 
                    <span className="text-[#666] font-medium">{product.properties.weight}</span>
                  </div>
                )}
                {product.properties.dimensions && (
                  <div className="flex font-sans items-start">
                    <strong className="w-[180px] shrink-0 text-[#333] font-bold">Dimensiones :</strong> 
                    <span className="text-[#666] font-medium">{product.properties.dimensions}</span>
                  </div>
                )}
                {product.properties.color && (
                  <div className="flex font-sans items-start">
                    <strong className="w-[180px] shrink-0 text-[#333] font-bold">Color :</strong> 
                    <span className="text-[#666] font-medium">{product.properties.color}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {['smart-home', 'aspiradoras-robot', 'camaras-seguridad', 'amazon'].includes(product.category) && (
            <div className="mt-8 text-[14px] text-[#444] leading-relaxed max-w-[900px]">
              <strong className="text-[#333] block mb-2">Descripción General:</strong>
              <p className="whitespace-pre-line">
                {product.description || `Este excelente ${product.category.replace('-', ' ')} está pensado para brindar el máximo rendimiento en su gama. Diseño premium, excelente durabilidad y prestaciones de última generación.`}
              </p>
            </div>
          )}
        </div>

        {/* Espaciador garantizado */}
        <div style={{ height: '160px' }} />

        {/* Quienes vieron este producto también compraron */}
        {relatedProducts.length > 0 && (
          <div className="pt-10 border-t border-gray-100">
            <div className="border-b-2 border-[#e0e0e0] mb-8 flex">
              <h2 className="text-[22px] font-normal text-[#333] pb-2 border-b-2 border-[#0066cc] -mb-[2px] pr-8">
                Quienes vieron este producto también compraron
              </h2>
            </div>
            
            <div className="relative w-full overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{ 
                  msOverflowStyle: 'none', 
                  scrollbarWidth: 'none', 
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  gap: '0'
                }}
              >
                {relatedProducts.map(rp => (
                  <div 
                    key={rp.id} 
                    className="flex-none snap-start p-2"
                    style={{ width: 'var(--rel-item-width)' }}
                  >
                    <style dangerouslySetInnerHTML={{ __html: `
                      :root { --rel-item-width: 25%; }
                      @media (max-width: 768px) { :root { --rel-item-width: 50%; } }
                    `}} />
                    <div className="border border-[#e0e0e0] rounded-sm p-4 hover:shadow-lg transition-shadow bg-white flex flex-col items-center text-center relative h-full">
                      {(rp.discount && rp.discount > 0) && (
                        <div className="absolute top-2 left-2 bg-[#e60000] text-white text-[9px] font-black w-10 h-10 rounded-full z-10 flex flex-col items-center justify-center shadow-md border-2 border-white leading-none p-0.5">
                          <span>{Math.round(rp.discount)}%</span>
                          <span className="text-[6px] font-bold">OFF</span>
                        </div>
                      )}
                      <Link href={`/product/${rp.id}`} className="block w-full">
                        <div className="h-[150px] w-full flex items-center justify-center mb-4">
                          <img src={rp.image} alt={rp.name} className="max-h-full object-contain" />
                        </div>
                      </Link>
                      <Link href={`/product/${rp.id}`} className="text-[13px] text-[#555] h-[40px] overflow-hidden hover:text-[#0066cc] transition mb-3 line-clamp-2">
                        {rp.name}
                      </Link>
                      <div className="w-full flex justify-center mb-3">
                        <span className="bg-[#4caf50] text-white text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-tight">
                          En stock
                        </span>
                      </div>
                      <div className="text-[20px] font-bold text-[#333] mb-4 mt-auto">
                        ${rp.price.toLocaleString()} <FaInfoCircle className="inline text-[12px] text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
