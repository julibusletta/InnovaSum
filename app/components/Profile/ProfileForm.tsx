'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

interface ProfileFormProps {
  user: any;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [fiscalType, setFiscalType] = useState('ConFinal');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      alert('Tus datos fueron actualizados correctamente.');
    }, 1000);
  };

  // Input styling based on reference
  const inputClass = "w-full border-0 border-b border-gray-300 px-2 py-3 text-[15px] focus:outline-none focus:border-blue-500 bg-transparent transition-colors font-sans text-gray-700";
  const labelClass = "block text-[12px] text-gray-400 font-medium mb-2 uppercase tracking-tight";
  const sectionTitleClass = "text-2xl font-normal text-gray-500 mb-2 font-sans";
  const sectionSubTitleClass = "text-[11px] text-gray-400 mb-10 block";
  const boxClass = "bg-white border border-gray-100 p-10 min-h-[400px] shadow-sm flex flex-col";

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-700">
      <h1 className="text-4xl font-light text-gray-600 mb-10 uppercase tracking-tight border-b border-gray-100 pb-4 text-center md:text-left">Mi Cuenta</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Col 1: Datos Personales */}
        <div className={boxClass}>
          <h2 className={sectionTitleClass}>Datos Personales</h2>
          <span className={sectionSubTitleClass}>* Todos los campos son obligatorios</span>
          
          <div className="grid grid-cols-12 gap-x-6 gap-y-10">
            <div className="col-span-4">
              <label className={labelClass}>*ID cliente:</label>
              <input type="text" value={user.id ? user.id.slice(0, 6) : '565930'} disabled className={`${inputClass} bg-gray-50 cursor-not-allowed`} title="ID de cliente asignado automáticamente" />
            </div>
            <div className="col-span-8">
              <label className={labelClass}>*Email:</label>
              <input type="email" value={user.email} disabled className={`${inputClass} bg-gray-50 cursor-not-allowed`} title="El email no puede modificarse" />
            </div>
            
            <div className="col-span-12">
              <label className={labelClass}>*Nombre y Apellido</label>
              <input type="text" defaultValue={user.name} required className={inputClass} />
            </div>
            <div className="col-span-12">
              <label className={labelClass}>*D.N.I:</label>
              <input type="text" defaultValue={user.dni} required className={inputClass} />
            </div>
            
            <div className="col-span-4">
              <label className={labelClass}>*C. Area:</label>
              <input type="text" defaultValue="011" required className={inputClass} />
            </div>
            <div className="col-span-8">
              <label className={labelClass}>*Tel de contacto:</label>
              <input type="text" defaultValue={user.phone || '1123456789'} required className={inputClass} />
            </div>
          </div>
        </div>

        {/* Col 2: Domicilio de Facturación */}
        <div className={boxClass}>
          <h2 className={sectionTitleClass}>Domicilio de Facturación</h2>
          <span className={sectionSubTitleClass}>* Todos los campos son obligatorios</span>
          
          <div className="space-y-10">
            <div>
              <label className={labelClass}>*Dirección fiscal:</label>
              <input type="text" defaultValue={user.address?.street} required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>*Piso / Depto:</label>
                <input type="text" defaultValue={user.address?.apartment || '0'} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>*Cod. postal:</label>
                <input type="text" defaultValue={user.address?.zip} required className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>*Localidad:</label>
                <input type="text" defaultValue={user.address?.city} required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>*Provincia:</label>
                <select defaultValue={user.address?.state || "Buenos Aires"} className={`${inputClass} mt-[-4px]`}>
                  <option value="CABA">CABA</option>
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Chubut">Chubut</option>
                  <option value="Cordoba">Córdoba</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Salta">Salta</option>
                  <option value="San Juan">San Juan</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Santiago Del Estero">Santiago Del Estero</option>
                  <option value="Tierra Del Fuego">Tierra Del Fuego</option>
                  <option value="Tucuman">Tucuman</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Condición Fiscal */}
        <div className={boxClass}>
          <h2 className={sectionTitleClass}>Condición Fiscal</h2>
          <span className={sectionSubTitleClass}>Seleccione el tipo de Factura deseada</span>
          
          <div className="space-y-6 mb-10">
            {[
              { id: 'ConFinal', label: 'Consumidor Final' },
              { id: 'RespInscripto', label: 'Responsable Inscripto' },
              { id: 'RespNoInscripto', label: 'Responsable No Inscripto' },
              { id: 'Monotributo', label: 'Monotributo' },
              { id: 'Exento', label: 'Exento' },
            ].map((option) => (
              <div key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  id={option.id} 
                  name="fiscalType" 
                  value={option.id}
                  checked={fiscalType === option.id}
                  onChange={(e) => setFiscalType(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={option.id} className="text-sm text-gray-600 cursor-pointer">{option.label}</label>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
            {fiscalType === 'ConFinal' ? (
              <>
                <div className="animate-in slide-in-from-left-1 duration-300">
                  <label className={labelClass}>*D.N.I</label>
                  <input type="text" defaultValue={user.dni} className={inputClass} />
                </div>
                <div className="animate-in slide-in-from-right-1 duration-300">
                  <label className={labelClass}>*Nombre y Apellido</label>
                  <input type="text" defaultValue={user.name} className={inputClass} />
                </div>
              </>
            ) : (
              <>
                <div className="animate-in slide-in-from-left-1 duration-300">
                  <label className={labelClass}>*C.U.I.T</label>
                  <input type="text" placeholder="30-XXXXXXXX-X" className={inputClass} />
                </div>
                <div className="animate-in slide-in-from-right-1 duration-300">
                  <label className={labelClass}>*Razón Social</label>
                  <input type="text" placeholder="Empresa S.A." className={inputClass} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="lg:col-span-3 flex flex-col items-end mt-4">
          <button 
            type="submit"
            disabled={isSaving}
            className={`${isSaving ? 'bg-gray-400' : 'bg-[#3b82f6] hover:bg-blue-700'} text-white font-bold py-3 px-8 rounded flex items-center gap-3 transition-all uppercase text-sm border-0 cursor-pointer shadow-lg active:transform active:translate-y-px`}
          >
            {isSaving ? 'Guardando...' : <><FaCheck size={14} /> Guardar datos</>}
          </button>
          <div className="mt-4 text-[11px] text-gray-400">
            Podés <a href="#" className="text-blue-500 hover:underline">cancelar tu cuenta</a> siempre que lo desees.
          </div>
        </div>
      </form>
    </div>
  );
}
