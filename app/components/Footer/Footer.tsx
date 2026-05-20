'use client';

import { FaInstagram, FaWhatsapp, FaEnvelope, FaComments } from 'react-icons/fa';
import Link from 'next/link';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <>
      <footer id="footer" className="w-full bg-[#0a192f] text-white py-16 md:py-20 px-4 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="content mb-8">
            <div className="flex flex-wrap gap-6 md:gap-8 mb-5">
              {/* Información Útil */}
              <div className="flex-1 min-w-44">
                <h5 className="text-base font-bold uppercase mb-4 letter-spacing-wide text-white">
                  INFORMACIÓN ÚTIL
                </h5>
                <ul className="list-none m-0 p-0">
                  <li className="mb-2.5">
                    <Link href="/preguntas" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Preguntas frecuentes
                    </Link>
                  </li>
                  <li className="mb-2.5">
                    <Link href="/pago" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Formas de pago
                    </Link>
                  </li>

                  <li className="mb-2.5">
                    <Link href="/terminos" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li className="mb-2.5">
                    <a href="https://buenosaires.gob.ar/gcaba_historico/gobierno/atencion-ciudadana/defensa-al-consumidor" target="_blank" rel="noopener noreferrer" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Defensa al Consumidor
                    </a>
                  </li>
                </ul>
              </div>

              {/* Acerca de Innovasum */}
              <div className="flex-1 min-w-44">
                <h5 className="text-base font-bold uppercase mb-4 letter-spacing-wide text-white">
                  ACERCA DE INNOVASUM
                </h5>
                <ul className="list-none m-0 p-0">
                  <li className="mb-2.5">
                    <Link href="/quienes-somos" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Quiénes somos
                    </Link>
                  </li>
                  <li className="mb-2.5">
                    <Link href="/contacto" className="text-gray-400 text-sm md:text-base no-underline transition-colors hover:text-white">
                      Contacto
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contáctenos */}
              <div className="flex-1 min-w-56 text-left">
                <h5 className="text-base font-bold uppercase mb-4 letter-spacing-wide text-white">
                  CONTÁCTENOS
                </h5>
                <p className="text-sm md:text-base opacity-90 m-0 leading-loose">
                  <Link href="/contacto" className="text-gray-400 no-underline transition-colors hover:text-white inline-flex items-center gap-2">
                    <FaComments size={15} />
                    Quiero preguntar
                  </Link>
                  <br />
                  <a
                    href="mailto:info@innovasum.com"
                    className="text-gray-400 no-underline transition-colors hover:text-white inline-flex items-center gap-2"
                  >
                    <FaEnvelope size={15} />
                    contacto@innovasum.com.ar
                  </a>
                  <br />
                  <span className="opacity-70 text-xs md:text-sm">
                    Lunes a Viernes de 9:00 a 20:00hs. Sábados y domingos de 11:00 a 18:00hs.
                  </span>
                </p>
              </div>

              {/* Redes Sociales */}
              <div className="flex-1 min-w-56">
                <h5 className="text-base font-bold uppercase mb-4 letter-spacing-wide text-white">
                  REDES
                </h5>
                <p className="text-xs md:text-sm opacity-70 uppercase m-0 mt-3">
                  Seguinos en nuestras Redes Sociales
                </p>
                <div className="flex gap-2.5 mt-4" id="socialiconfooter">
                  <a
                    href="https://www.instagram.com/innovasumarg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600"
                  >
                    <FaInstagram size={22} />
                  </a>
                  <a
                    href="https://wa.me/5491151457720"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white transition-all hover:bg-green-500"
                  >
                    <FaWhatsapp size={22} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator and text taking full footer width minus padding */}
        <div className="w-full flex flex-col items-center mt-12 md:mt-16">
          <div className="w-[95%] h-px bg-gray-700 opacity-50 mb-8 md:mb-10"></div>
          <p className="text-center opacity-80 text-sm md:text-base w-full m-0 pb-2">
            Todos los derechos reservados © 2026 Innovasum
          </p>
        </div>
      </footer>

      {/* Footer Badges Section */}
      <div className="footer-badges-section w-full bg-gray-100 flex flex-col items-center justify-center py-5 px-4 border-t border-gray-300">
        <div className="badges-container flex gap-5 items-center justify-center flex-wrap mb-3 w-full">
          <img
            src="/images/nave.jpg"
            alt="Nave Logo"
            className="badge-img w-12 h-12 md:w-20 md:h-20 flex-shrink-0 object-contain"
          />
          <img
            src="/images/compra_segura_footer.png"
            alt="Compra Segura"
            className="badge-img w-12 h-12 md:w-20 md:h-20 flex-shrink-0 object-contain"
          />
          <Link href="/">
                <img
                  src="/images/DATAWEBARCA.jpg"
                  alt="DataweBarca Logo"
                  className="badge-img w-12 h-12 md:w-20 md:h-20 flex-shrink-0 object-contain cursor-pointer hover:scale-110 transition-transform"
                />
          </Link>
          <img
            src="/images/png-transparent-cyber-monday-logo-cace-ecommerce-trade-chamber-of-commerce-argentina-blue-text.png"
            alt="Cyber Monday CACE"
            className="badge-img w-12 h-12 md:w-20 md:h-20 flex-shrink-0 object-contain"
          />
        </div>
        <p className="badge-label text-gray-600 text-xs font-normal m-0"></p>
      </div>
    </>
  );
}
