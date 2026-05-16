import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Solo requiere ser ADMIN para entrar a /admin
        return token?.role === "ADMIN";
      },
    },
    pages: {
      signIn: "/auth/signin", // Redirigir aquí si no está autorizado
    }
  }
);

export const config = {
  matcher: ["/admin/:path*"], 
};
