'use client';

import { signIn } from "next-auth/react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const callbackUrl = searchParams.get('callbackUrl') || "/mi-cuenta";

  const handleCredentialsLogin = async () => {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      setError("Por favor, ingresá tus credenciales.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", { 
        email, 
        password, 
        redirect: false 
      });

      if (result?.error) {
        setError("Usuario o contraseña incorrectos.");
        setLoading(false);
      } else {
        // Post-login check for Admin if they went directly to signin or default
        if ((callbackUrl === "/mi-cuenta" || callbackUrl === "/") && email.toLowerCase() === 'admin') {
          router.push("/admin");
        } else {
          router.push(callbackUrl);
        }
        router.refresh();
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8" style={{ paddingTop: '100px' }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
            Registrate para poder continuar con tu compra!
          </h2>
          <p className="mt-4 text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            Ingresá a tu cuenta para gestionar tus pedidos
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
          >
            <FaGoogle className="text-red-500 text-lg" />
            Continuar con Google
          </button>

          <button
            onClick={() => signIn("facebook", { callbackUrl })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-bold text-white hover:bg-[#166fe5] transition-all cursor-pointer disabled:opacity-50"
          >
            <FaFacebookF className="text-lg" />
            Continuar con Facebook
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 uppercase tracking-widest text-[10px] font-bold">O también</span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Correo electrónico o usuario"
            id="email"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-50"
          />
          <input
            type="password"
            placeholder="Contraseña"
            id="password"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm disabled:bg-gray-50"
          />
          <button
            onClick={handleCredentialsLogin}
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-black transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Iniciando sesión..." : "Siguiente"}
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            ¿No tenés cuenta?
            <Link href="/auth/register" className="ml-1 text-blue-600 font-bold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
