import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  // Asegurarnos de que el secret esté disponible, si no, lo manejamos sin explotar.
  const secret = process.env.NEXTAUTH_SECRET;

  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      const token = await getToken({ req, secret });
      
      // Si no hay token o no es ADMIN, redirigir al login
      if (!token || token.role !== 'ADMIN') {
        const url = req.nextUrl.clone();
        url.pathname = '/auth/signin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.error('Middleware auth error:', error);
      // En caso de error crítico con NextAuth, redirigir al inicio en lugar de tirar error 500
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], 
};
