'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  
  // Usamos try/catch o un guard para evitar errores en el build de Vercel
  // cuando el SessionProvider no está totalmente inicializado en páginas estáticas
  let session: any = null;
  try {
    const sessionRes = useSession();
    session = sessionRes?.data;
  } catch (e) {
    // Si falla el hook (ej: fuera de contexto durante prerender), session queda null
  }

  useEffect(() => {
    // 1. Ignorar rutas de administrador
    if (pathname && pathname.startsWith('/admin')) return;
    
    // 2. Ignorar si el usuario está logueado como ADMIN
    if (session?.user && (session.user as any).role?.toUpperCase() === 'ADMIN') {
      return;
    }

    // 3. Ignorar si este navegador tiene la marca de "No Track"
    if (typeof window !== 'undefined' && localStorage.getItem('jb_no_track') === 'true') {
      return;
    }

    // Track page view
    fetch('/api/track', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true 
    }).catch(() => {});
    
  }, [pathname, session]);

  return null;
}
