'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FaGoogle, FaFacebookF, FaTimes, FaSpinner, FaChevronRight } from 'react-icons/fa';
import { useAuthModal } from '../../context/AuthModalContext';
import '../../styles/AuthModal.css';

export default function AuthModal() {
  const { isOpen, view, callbackUrl, closeModal, setView } = useAuthModal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDni, setRegDni] = useState('');
  const [regAreaCode, setRegAreaCode] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regAccept, setRegAccept] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: loginEmail,
        password: loginPass,
        callbackUrl
      });

      if (result?.error) {
        setError('Credenciales inválidas. Por favor, revisa tu email y contraseña.');
      } else {
        closeModal();
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regAccept) {
      setError('Debes aceptar los Términos y Condiciones.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const names = regName.trim().split(' ');
      const firstName = names[0];
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '-';

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: regEmail,
          password: regPass,
          firstName,
          lastName,
          dni: regDni,
          phone: `${regAreaCode} ${regPhone}`,
          // Default address data if needed by API
          street: '-',
          number: '-',
          city: '-',
          state: '-',
          zip: '-'
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Automatically login after registration
        const result = await signIn('credentials', {
          redirect: false,
          email: regEmail,
          password: regPass,
          callbackUrl
        });

        if (result?.error) {
          setView('login');
          setLoginEmail(regEmail);
          setError('Registro exitoso. Por favor ingresa tus datos.');
        } else {
          closeModal();
          window.location.href = callbackUrl;
        }
      } else {
        setError(data.message || 'Error al registrar usuario.');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado durante el registro.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="auth-modal-overlay" onClick={closeModal}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeModal}>
          <FaTimes size={20} />
        </button>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${view === 'login' ? 'active' : ''}`}
            onClick={() => setView('login')}
          >
            Ingresar
          </button>
          <button 
            className={`auth-tab ${view === 'register' ? 'active' : ''}`}
            onClick={() => setView('register')}
          >
            Registrarme
          </button>
        </div>

        <div className="auth-form-container">
          {error && <div className="auth-error">{error}</div>}

          {view === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="auth-input-group">
                <label>Tu email</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="auth-input-group">
                <div className="flex justify-between items-center mb-2">
                  <label className="mb-0">Tu contraseña</label>
                  <span className="auth-link text-[9px]">Olvidé mi contraseña</span>
                </div>
                <input 
                  type="password" 
                  className="auth-input" 
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn flex items-center justify-center gap-4"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : <>Ingresar <FaChevronRight size={10} /></>}
              </button>

              <div className="auth-footer-text">
                ¿Aún no tenés cuenta? <span className="auth-link" onClick={() => setView('register')}>Registrate</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="auth-input-group">
                <label>Nombre y Apellido</label>
                <input 
                  type="text" 
                  className="auth-input" 
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required 
                />
              </div>
              <div className="auth-input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  className="auth-input" 
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="grid grid-cols-3 gap-2 auth-input-group">
                <div className="col-span-1">
                  <label>Cod. Área</label>
                  <input 
                    type="number" 
                    className="auth-input" 
                    placeholder="11"
                    value={regAreaCode}
                    onChange={(e) => setRegAreaCode(e.target.value)}
                    required 
                  />
                </div>
                <div className="col-span-2">
                  <label>Teléfono</label>
                  <input 
                    type="number" 
                    className="auth-input" 
                    placeholder="12345678"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required 
                  />
                </div>
              </div>
              <div className="auth-input-group">
                <label>D.N.I./C.U.I.T.</label>
                <input 
                  type="number" 
                  className="auth-input" 
                  value={regDni}
                  onChange={(e) => setRegDni(e.target.value)}
                  required 
                />
              </div>
              <div className="auth-input-group">
                <label>Tu contraseña</label>
                <input 
                  type="password" 
                  className="auth-input" 
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  required 
                />
              </div>

              <div className="flex items-start gap-4 mb-8">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1"
                  checked={regAccept}
                  onChange={(e) => setRegAccept(e.target.checked)}
                />
                <label htmlFor="terms" className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-relaxed cursor-pointer">
                  Acepto los <span className="auth-link">Términos y Condiciones</span>
                </label>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn flex items-center justify-center gap-4"
                disabled={loading}
              >
                {loading ? <FaSpinner className="animate-spin" /> : <>Registrarme <FaChevronRight size={10} /></>}
              </button>

              <div className="auth-footer-text">
                ¿Ya tenés cuenta? <span className="auth-link" onClick={() => setView('login')}>Ingresar</span>
              </div>
            </form>
          )}

          <div className="auth-social-container">
            <button className="auth-social-btn" onClick={() => handleSocialSignIn('google')}>
              <FaGoogle className="text-red-500" /> Continuar con Google
            </button>
            <button className="auth-social-btn facebook" onClick={() => handleSocialSignIn('facebook')}>
              <FaFacebookF /> Continuar con Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
