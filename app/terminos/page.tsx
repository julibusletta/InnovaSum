'use client';

import React from 'react';
import '../styles/Terms.css';

export default function TerminosYCondiciones() {
    return (
        <div className="terms-page">
            <div className="terms-container">
                <header className="terms-header">
                    <h1>Términos y Condiciones</h1>
                    <p>Última actualización: Marzo 2026</p>
                </header>

                <div className="terms-body">
                    <section className="terms-section">
                        <h2><span>01.</span> Aceptación de los Términos</h2>
                        <p>
                            El acceso y uso del sitio web innovasum.com.ar (en adelante, el "Sitio") se rige por los presentes Términos y Condiciones. 
                            Al utilizar el Sitio, el usuario acepta de manera plena y sin reservas todas y cada una de las disposiciones incluidas en este documento. 
                            Si no está de acuerdo con estos términos, le solicitamos que se abstenga de utilizar el Sitio.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>02.</span> Capacidad Legal</h2>
                        <p>
                            Los servicios ofrecidos en el Sitio solo están disponibles para personas que tengan capacidad legal para contratar. 
                            No podrán utilizar los servicios las personas que no tengan dicha capacidad ni los menores de edad.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>03.</span> Registro y Seguridad</h2>
                        <p>
                            Para realizar compras, el usuario puede registrarse proporcionando información veraz y precisa. 
                            Es responsabilidad del usuario mantener la confidencialidad de su cuenta y contraseña. 
                            Innovasum no se responsabiliza por el uso indebido de las cuentas por parte de terceros.
                        </p>
                    </section>

                    <div className="arrepentimiento-box">
                        <h3>Botón de Arrepentimiento</h3>
                        <p>
                            De acuerdo con la Resolución 424/2020 de la Secretaría de Comercio Interior, usted tiene derecho a revocar la aceptación del producto dentro de los 10 (diez) días corridos contados a partir de la entrega del mismo o de la celebración del contrato, lo que ocurra último, sin responsabilidad alguna. El producto debe ser devuelto en las mismas condiciones en que fue recibido.
                        </p>
                    </div>

                    <section className="terms-section">
                        <h2><span>04.</span> Proceso de Compra</h2>
                        <p>
                            Toda compra realizada en el Sitio está sujeta a la disponibilidad de stock y a la validación de los datos de pago proporcionados. 
                            Innovasum se reserva el derecho de cancelar cualquier pedido en caso de errores en el precio, falta de stock o sospecha de fraude, 
                            reintegrando el monto total abonado por el usuario.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>05.</span> Medios de Pago</h2>
                        <p>
                            Aceptamos tarjetas de crédito y débito a través de plataformas seguras como Nave Negocios. 
                            Ofrecemos promociones de 3 y 6 cuotas sin interés según disponibilidad vigente. 
                            También aceptamos transferencias bancarias, previa validación del comprobante.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>06.</span> Envíos y Entregas</h2>
                        <p>
                            Realizamos envíos a todo el país exclusivamente a través de <strong>Andreani</strong>, garantizando el máximo profesionalismo y seguridad en cada entrega. 
                            El plazo de entrega estimado para cualquier destino y tipo de envío es de <strong>3 a 5 días hábiles</strong>.
                        </p>
                        <p>El costo del envío será informado durante el proceso de compra.</p>
                    </section>

                    <section className="terms-section">
                        <h2><span>07.</span> Garantía de Productos</h2>
                        <p>
                            Todos nuestros productos son nuevos y cuentan con garantía. Según el tipo de producto, la garantía puede ser otorgada por:
                        </p>
                        <ul>
                            <li>Fábrica u Oficial: El usuario debe contactar al servicio técnico oficial de la marca.</li>
                            <li>Innovasum: En casos específicos, brindamos una garantía propia de 6 meses contra defectos de fabricación.</li>
                        </ul>
                    </section>

                    <section className="terms-section">
                        <h2><span>08.</span> Cambios y Devoluciones</h2>
                        <p>
                            Para solicitar un cambio, el producto debe estar en perfectas condiciones, con su empaque original cerrado y sin señales de uso. 
                            El plazo para solicitar cambios es de 30 días corridos desde la recepción.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>09.</span> Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido del Sitio, incluyendo textos, logotipos, imágenes y software, es propiedad exclusiva de Innovasum o de sus proveedores de contenido 
                            y está protegido por las leyes de propiedad intelectual internacionales y de la República Argentina.
                        </p>
                    </section>

                    <section className="terms-section">
                        <h2><span>10.</span> Jurisdicción y Ley Aplicable</h2>
                        <p>
                            Estos Términos y Condiciones se rigen por las leyes de la República Argentina. Cualquier controversia será sometida 
                            a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.
                        </p>
                    </section>
                </div>
            </div>
            
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
            `}</style>
        </div>
    );
}
