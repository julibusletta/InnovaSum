
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function StatusChecker() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verifyId = searchParams.get('verify');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      if (verifyId) {
        verifyPayment(verifyId);
      } else {
        verifyLatest();
      }
    }
  }, [verifyId]);

  const verifyLatest = async () => {
    try {
      // Quietly check for latest pending order
      const resp = await fetch('/api/checkout/nave/verify/latest');
      const data = await resp.json();
      if (data.success && data.updated) {
        setStatus('success');
        setMessage('¡Pago Detectado y Aprobado!');
        router.refresh();
      }
    } catch (err) {
      // Fail silently for automatic check
    }
  };

  const verifyPayment = async (id: string) => {
    setStatus('loading');
    setMessage('Verificando estado del pago...');

    try {
      const resp = await fetch(`/api/checkout/nave/verify/${id}`);
      const data = await resp.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.status === 'APPROVED' ? '¡Pago Aprobado! Ya enviamos tu confirmación.' : 'Pago en proceso.');
        
        // Refresh the page data if it was approved to show updated status in list
        if (data.status === 'APPROVED') {
          router.refresh();
        }

        // Clean up URL after 3 seconds
        setTimeout(() => {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.delete('verify');
          router.replace(`/mi-cuenta/compras?${newParams.toString()}`);
        }, 3000);

      } else {
        setStatus('error');
        setMessage(data.message || 'Error al verificar el pago.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error de conexión.');
    }
  };

  if (!verifyId) return null;

  return (
    <div className={`mb-6 p-4 rounded-xl flex items-center gap-4 animate-in slide-in-from-top duration-500 border ${
      status === 'loading' ? 'bg-blue-50 border-blue-100 text-blue-700' :
      status === 'success' ? 'bg-green-50 border-green-100 text-green-700' :
      'bg-red-50 border-red-100 text-red-700'
    }`}>
      {status === 'loading' && <FaSpinner className="animate-spin" />}
      {status === 'success' && <FaCheckCircle className="text-green-500" />}
      {status === 'error' && <FaExclamationCircle className="text-red-500" />}
      <span className="text-sm font-bold uppercase tracking-tight">{message}</span>
    </div>
  );
}
