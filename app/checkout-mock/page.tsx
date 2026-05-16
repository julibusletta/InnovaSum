'use client';

import { useEffect, useState, Suspense } from 'react';
import { FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useSearchParams, useRouter } from 'next/navigation';

function CheckoutMockContent() {
  const [status, setStatus] = useState<'loading' | 'payment' | 'processing' | 'success'>('loading');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const timer = setTimeout(() => setStatus('payment'), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSimulatePayment = async () => {
    setStatus('processing');
    
    try {
      // Use absolute URL to be extra safe
      const apiUrl = `${window.location.origin}/api/checkout/nave/webhook`;
      console.log('Fetching:', apiUrl);

      // Call our webhook to simulate approval
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: paymentId,
          reference: orderId,
          status: 'APPROVED',
          amount: 0
        })
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          router.push('/mi-cuenta/compras');
        }, 2000);
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Error desconocido' }));
        alert(`Error al simular el pago: ${res.status} - ${errorData.message}`);
        console.error('Webhook failed:', errorData);
        setStatus('payment');
      }
    } catch (err: any) {
      console.error('Network error:', err);
      alert(`Error de red: ${err.message || 'No se pudo conectar con el servidor'}`);
      setStatus('payment');
    }
  };

  const [showDebug, setShowDebug] = useState(false);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f4f7f9', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'flex-start',
      paddingTop: '180px',
      fontFamily: 'sans-serif',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '40px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        overflow: 'hidden'
      }}>
        {/* Header Nave Style */}
        <div style={{ background: '#000', padding: '20px', textAlign: 'center' }}>
          <img src="/images/nave.jpg" alt="Nave" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ color: 'white', fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
            <FaLock style={{ marginRight: '5px' }} /> Pago Seguro con Nave
          </div>
        </div>

        <div style={{ padding: '30px', textAlign: 'center' }}>
          {status === 'loading' || status === 'processing' ? (
            <div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #f3f3f3', 
                borderTop: '3px solid #000', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
              <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                {status === 'loading' ? 'Conectando con Nave...' : 'Procesando pago...'}
              </h2>
              <p style={{ color: '#666' }}>
                {status === 'loading' ? 'Estamos preparando tu entorno de pago seguro.' : 'Estamos confirmando la transacción con el banco.'}
              </p>
            </div>
          ) : status === 'success' ? (
            <div className="animate-fadeInUp">
              <FaCheckCircle style={{ color: '#4caf50', fontSize: '60px', marginBottom: '20px' }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#2e7d32' }}>¡PAGO APROBADO!</h2>
              <p style={{ color: '#666' }}>Tu pedido ha sido confirmado. Redirigiendo a tus compras...</p>
            </div>
          ) : (
            <div className="animate-fadeInUp">
              <div style={{ background: '#fff9c4', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #fbc02d' }}>
                <FaExclamationTriangle style={{ color: '#fbc02d', fontSize: '24px', marginBottom: '10px' }} />
                <h3 style={{ fontSize: '1rem', color: '#856404' }}>MODO SIMULACIÓN</h3>
                <p style={{ fontSize: '0.85rem', color: '#856404' }}>
                  Este es un entorno de prueba. 
                  Una vez que integres tus llaves reales, aquí aparecerá la pasarela oficial.
                </p>
              </div>

              <div style={{ textAlign: 'left', marginBottom: '25px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Comercio: Innovasum</p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Pedido: {orderId || 'SIN ID'}</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Simular aprobación de pago</p>
              </div>

              <button 
                onClick={handleSimulatePayment}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: '#000', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                Simular Pago Aprobado
              </button>
              
              <button 
                onClick={() => router.push('/')}
                style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '15px' }}
              >
                Cancelar y volver
              </button>

              <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
                <button 
                  onClick={() => setShowDebug(!showDebug)} 
                  style={{ background: 'none', border: 'none', color: '#007bff', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {showDebug ? 'Ocultar info técnica' : 'Ver info técnica de depuración'}
                </button>
                {showDebug && (
                  <div style={{ textAlign: 'left', fontSize: '0.7rem', color: '#888', background: '#fafafa', padding: '10px', marginTop: '5px', borderRadius: '4px' }}>
                    <p><strong>Payment ID:</strong> {paymentId || 'null'}</p>
                    <p><strong>Order ID:</strong> {orderId || 'null'}</p>
                    <p><strong>Actual Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'unknown'}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ background: '#fafafa', padding: '15px', textAlign: 'center', fontSize: '0.75rem', color: '#999', borderTop: '1px solid #eee' }}>
          Powered by Nave & Antigravity AI
        </div>
      </div>
    </div>
  );
}

export default function CheckoutMock() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutMockContent />
    </Suspense>
  );
}
