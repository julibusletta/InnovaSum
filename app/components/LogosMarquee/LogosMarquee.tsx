'use client';

import '../../styles/LogosMarquee.css';

const appleSvg = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path d='M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.3 48.6-.9 91.5-86.4 101.4-133.4-48.4-20.7-60.6-47-60.5-77.2zm-58.8-193.3c23.6-28.7 34.2-64.9 30.1-101.3-33.3 1.3-71 21.6-96.2 52-21 25.2-34.9 62.9-29.6 100 37.8 2.5 72.1-22 95.7-50.7z'/></svg>";

const logos = [
  { id: 1, src: appleSvg, alt: 'Apple' },
  { id: 2, src: '/images/jbl-2-logo-png-transparent.webp', alt: 'JBL' },
  { id: 3, src: '/images/5699546321769097351706x1280.webp', alt: 'Samsung' },
  { id: 4, src: '/images/images.webp', alt: 'Sony' },
  { id: 5, src: '/images/logorealme.png', alt: 'Realme' },
  { id: 6, src: '/images/66964.webp', alt: 'ASUS' },
  { id: 7, src: '/images/starlink_logo.png', alt: 'Starlink' },
  { id: 8, src: '/images/amazon_logo.png', alt: 'Amazon' },
  { id: 9, src: '/images/tplink_logo.jpg', alt: 'TP-LINK' },
];

import { useEffect, useState } from 'react';

export default function LogosMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section id="logos" className="logos-marquee w-full py-10 bg-white border-t border-b border-gray-200 overflow-hidden" data-aos="fadeInUp" suppressHydrationWarning>
        <div className="marquee-container w-full overflow-hidden" suppressHydrationWarning>
          <div className="marquee-track flex" style={{ width: 'calc(200px * 12)' }}></div>
        </div>
      </section>
    );
  }
  return (
    <section id="logos" className="logos-marquee w-full py-10 bg-white border-t border-b border-gray-200 overflow-hidden" data-aos="fadeInUp" suppressHydrationWarning>
      <div className="marquee-container w-full overflow-hidden" suppressHydrationWarning>
        <div className="marquee-track flex" style={{ width: 'max-content' }}>
          {/* Duplicate set 4 times for seamless loop on wide screens */}
          {[...logos, ...logos, ...logos, ...logos].map((logo, index) => {
            // Apply specific tweaks for better visibility based on logo shape
            const specificStyle = logo.alt === 'Starlink' ? { transform: 'scale(1.05)' } :
                                  logo.alt === 'TP-LINK' ? { transform: 'scale(0.9)' } : 
                                  {};
            
            return (
              <div
                key={`${logo.id}-${index}`}
                className="logo-item flex-shrink-0"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="logo-image object-contain filter grayscale transition-all duration-300 hover:grayscale-0"
                  style={{ ...specificStyle, mixBlendMode: 'multiply' }}
                />
              </div>
            );
          })}
        </div>
      </div>


    </section>
  );
}
