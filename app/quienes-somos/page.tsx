'use client';

import React from 'react';
import '../styles/About.css';

export default function QuienesSomos() {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1>Quiénes Somos</h1>
          <div className="title-line"></div>
        </header>

        <section className="about-content">
          <p>
            <span className="dropcap">E</span>n <strong>Innovasum</strong>, llevamos más de 5 años transformando la forma en que los argentinos acceden a la última tecnología. 
            Nacimos con una misión clara: democratizar el acceso a productos de alta gama, eliminando intermediarios innecesarios y 
            garantizando siempre el mejor precio del mercado.
          </p>

          <p>
            No solo vendemos tecnología, brindamos soluciones respaldadas por la experiencia. Cada producto que sale de nuestras manos 
            ha pasado por un riguroso control de calidad y cuenta con nuestra garantía oficial. Creemos que la tecnología debe ser una 
            herramienta de crecimiento y disfrute, accesible para todos los que buscan excelencia.
          </p>

          <p>
            Nuestra trayectoria está construida sobre la confianza de miles de clientes que nos eligen día a día a través de nuestra 
            plataforma digital e Instagram, valorando nuestra transparencia, nuestro envío seguro a todo el país y, por sobre todo, 
            nuestro asesoramiento experto. 
          </p>

          <div className="about-values">
            <div className="value-item">
              <h3>Directo de Fábrica</h3>
              <p>Importación directa para asegurar los precios más competitivos de Argentina.</p>
            </div>
            <div className="value-item">
              <h3>Garantía Real</h3>
              <p>Respaldo total en cada compra con servicio post-venta especializado.</p>
            </div>
            <div className="value-item">
              <h3>Pasión Tech</h3>
              <p>Somos expertos en lo que hacemos y te asesoramos para que elijas lo mejor.</p>
            </div>
          </div>

          <p>
            Gracias por confiar en Innovasum para equipar tu vida digital. Estamos aquí para asegurarnos de que tu próxima 
            experiencia tecnológica sea simplemente la mejor.
          </p>
        </section>

        <footer className="about-signature">
          <div className="signature-text">Julian Busletta</div>
          <div className="signature-name">Fundador - Innovasum</div>
        </footer>
      </div>
      
      {/* Import font for signature */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&family=Inter:wght@400;700;800&display=swap');
      `}</style>
    </div>
  );
}
