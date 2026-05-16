'use client';

import { useState, useEffect } from 'react';
import { FaCreditCard, FaTruck, FaShieldAlt } from 'react-icons/fa';
import Slider from 'react-slick';
import '../../styles/Benefits.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Benefits() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
    swipeToSlide: true,
    draggable: true,
    touchMove: true
  };

  const benefitsData = [
    {
      icon: <FaCreditCard size={32} />,
      title: "Todos los medios de pago",
      subtitle: <p>Tarjeta de crédito, debito, efectivo o transferencia</p>,
      logos: null
    },
    {
      icon: <FaTruck size={32} />,
      title: "Envíos rápidos a todo el país",
      subtitle: null
    },
    {
      icon: <FaShieldAlt size={32} />,
      title: "Garantía oficial",
      subtitle: null
    }
  ];

  if (!isMobile) {
    return (
      <section id="benefits" className="benefits-section visible in-view">
        <div className="benefits-wrapper">
          <div className="benefits-container desktop-static">
            {benefitsData.map((benefit, index) => (
              <div key={index} className="benefit-item-wrapper">
                <div className="benefit-item">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <div className="benefit-text">
                    <h2>{benefit.title}</h2>
                    {benefit.subtitle}
                    {benefit.logos}
                  </div>
                </div>
                {index < benefitsData.length - 1 && (
                  <div className="divider-wrapper">
                    <div className="vertical-divider"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="benefits" className="benefits-section visible in-view">
      <div className="benefits-wrapper">
        <div className="slider-container-benefits mobile-only">
          <Slider {...settings}>
            {benefitsData.map((benefit, index) => (
              <div key={index} className="benefit-item-wrapper">
                <div className="benefit-item">
                  <div className="benefit-icon">{benefit.icon}</div>
                  <div className="benefit-text">
                    <h2>{benefit.title}</h2>
                    {benefit.subtitle}
                    {benefit.logos}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}
