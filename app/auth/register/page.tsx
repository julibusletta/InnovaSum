'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaIdCard, FaEnvelope, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

const PROVINCIAS = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", 
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", 
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis", 
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán", "Ciudad Autónoma de Buenos Aires (CABA)"
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    street: '',
    number: '',
    city: '',
    state: '',
    zip: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        router.push('/auth/signin?registered=true');
      } else {
        let errorMessage = data.message || 'Error al registrarse';
        if (data.debug) {
          errorMessage += ` (Debug: ${data.debug})`;
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      setError('Ocurrió un error inesperado: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4" style={{ paddingTop: '200px', paddingBottom: '100px' }}>
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Crear Cuenta</h2>
          <p className="text-gray-500 mt-3 text-lg">Unite a Innovasum y gestioná tus pedidos</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl text-center font-semibold animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Datos Personales */}
          <div>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-blue-600 rounded-full"></span>
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="firstName" placeholder="Nombre" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="lastName" placeholder="Apellido" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group overflow-hidden">
                <div className="w-16 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors border-r border-gray-100 flex-shrink-0">
                  <FaIdCard size={22} />
                </div>
                <input type="text" name="dni" placeholder="DNI" required onChange={handleChange} className="flex-1 px-5 py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent min-w-0" />
              </div>

              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group overflow-hidden">
                <div className="w-16 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors border-r border-gray-100 flex-shrink-0">
                  <FaEnvelope size={20} />
                </div>
                <input type="email" name="email" placeholder="Correo Electrónico" required onChange={handleChange} className="flex-1 px-5 py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent min-w-0" />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-blue-600 rounded-full"></span>
              Dirección de Envío
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-2 flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="street" placeholder="Calle" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="number" placeholder="Altura/Nro" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="city" placeholder="Localidad" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <input type="text" name="zip" placeholder="Cód. Postal" required onChange={handleChange} className="w-full py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all px-6">
                <select 
                  name="state" 
                  required 
                  onChange={handleChange} 
                  className="w-full py-6 outline-none text-gray-900 font-medium bg-transparent cursor-pointer appearance-none"
                  value={formData.state}
                >
                  <option value="" disabled>Seleccioná Provincia</option>
                  {PROVINCIAS.sort().map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div>
            <h3 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <span className="w-10 h-[2px] bg-blue-600 rounded-full"></span>
              Seguridad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group overflow-hidden">
                <div className="w-16 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors border-r border-gray-100 flex-shrink-0">
                  <FaLock size={20} />
                </div>
                <input type="password" name="password" placeholder="Contraseña" required onChange={handleChange} className="flex-1 px-5 py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent min-w-0" />
              </div>
              <div className="flex items-center bg-gray-50/50 border border-gray-200 rounded-2xl focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500 transition-all group overflow-hidden">
                <div className="w-16 flex items-center justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors border-r border-gray-100 flex-shrink-0">
                  <FaLock size={20} />
                </div>
                <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" required onChange={handleChange} className="flex-1 px-5 py-6 outline-none text-gray-900 placeholder-gray-400 font-medium bg-transparent min-w-0" />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 px-10 rounded-2xl shadow-2xl text-white font-black text-xl transition-all tracking-tight ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40 active:scale-[0.97] cursor-pointer'}`}
            >
              {loading ? 'Procesando registro...' : 'Crear mi cuenta'}
            </button>
          </div>
        </form>

        <div className="text-center mt-12 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-medium">
            ¿Ya tenés cuenta? 
            <Link href="/auth/signin" className="ml-2 text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
