'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../../styles/Hero.css';

export default function Hero() {
  const [heroSlides, setHeroSlides] = useState<any[]>([
    {
      image: 'https://placehold.co/1920x600/000000/FFFFFF/png?text=EJEMPLO+1',
      alt: 'EJEMPLO 1',
    },
    {
      image: 'https://placehold.co/1920x600/333333/FFFFFF/png?text=EJEMPLO+2',
      alt: 'EJEMPLO 2',
    },
    {
      image: 'https://placehold.co/1920x600/666666/FFFFFF/png?text=EJEMPLO+3',
      alt: 'EJEMPLO 3',
    },
    {
      image: 'https://placehold.co/1920x600/999999/FFFFFF/png?text=EJEMPLO+4',
      alt: 'EJEMPLO 4',
    },
    {
      image: 'https://placehold.co/1920x600/CCCCCC/000000/png?text=EJEMPLO+5',
      alt: 'EJEMPLO 5',
    },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showText, setShowText] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/home-settings');
        const data = await res.json();
        if (data.heroSlides && data.heroSlides.length > 0) {
          // setHeroSlides(data.heroSlides); // Comentado temporalmente para forzar las imágenes de ejemplo
        }
      } catch (err) {
        console.error('Error fetching hero slides:', err);
      }
    };
    fetchSlides();
  }, []);

  // Fade-up effect
  useEffect(() => {
    if (!isTyping) return;

    // Trigger fade up animation shortly after mount
    setTimeout(() => {
      setShowText(true);
    }, 100);

    // Pause for 4 seconds after showing text before hiding it and showing slider
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isTyping]);

  // Auto-rotate slides - Only start when typing is finished
  useEffect(() => {
    if (isTyping) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isTyping]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section id="home" className="hero relative overflow-hidden visible">
      {/* Hero Content */}
      <div className={`hero-content max-w-4xl w-full opacity-100 transition-opacity duration-700 text-center z-10 ${!isTyping ? 'fade-out' : ''}`}>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-2 md:mb-8 letter-spacing-tight min-h-0 md:min-h-64 text-gray-900">
          <span className={`inline-block transition-all duration-700 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-black" style={{ fontFamily: 'var(--font-orbitron)' }}>
              I
            </span>
            <span className="text-[#0066cc]" style={{ fontFamily: 'var(--font-orbitron)' }}>
              nnovasum
            </span>
          </span>
          <br />
          <span className={`inline-block mt-2 transition-all duration-700 delay-300 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-black">
              Insumos&nbsp;
            </span>
          </span>
          <span className={`inline-block mt-2 transition-all duration-700 delay-700 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-black">
              tecnológicos
            </span>
          </span>
        </h1>
      </div>

      {/* Hero Slider */}
      <div className={`hero-slider flex items-center justify-center ${!isTyping ? 'active' : ''}`}>
        <div className="slider-container overflow-hidden relative">
          <div 
            className="slider-track"
            style={{ 
              display: 'flex', 
              width: `${heroSlides.length * 100}%`,
              transform: `translateX(-${currentSlide * (100 / heroSlides.length)}%)`,
              transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              height: '100%'
            }}
          >
            {heroSlides.map((slide, index) => {
              const SlideContent = (
                <>
                  <img
                    src={slide.image}
                    alt={slide.alt}
                  />
                  {slide.isCustom && (
                    <div className="slide-custom-overlay">
                      <div className="promo-text-container">
                        <div className="promo-badge">
                          <span className="promo-title-1">{slide.title1}</span>
                          <span className="promo-title-2">{slide.title2}</span>
                        </div>
                        <div className="promo-shipping">
                          {slide.showShippingIcon !== false && (
                            <img src="/images/andreani.png" alt="Envío" className="shipping-icon" />
                          )}
                          <span className="shipping-text text-center">{slide.subtitle}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );

              return (
                <div
                  key={index}
                  className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{ width: `${100 / heroSlides.length}%`, height: '100%', position: 'relative' }}
                >
                  {slide.link ? (
                    <Link href={slide.link} className="block w-full h-full">
                      {SlideContent}
                    </Link>
                  ) : (
                    SlideContent
                  )}
                </div>
              );
            })}
          </div>

          {/* Slider Dots */}
          <div className="slider-dots absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all transform cursor-pointer ${index === currentSlide
                    ? 'bg-orange-500 scale-125'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-80'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
