'use client';

import { useState } from 'react';
import { FaTruck, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  type: 'DOMICILIO' | 'SUCURSAL';
}

interface ShippingCalculatorProps {
  productWeight?: string;
  productDimensions?: string;
  quantity?: number;
}

export default function ShippingCalculator({ 
  productWeight = '0.5', 
  productDimensions = '10x10x10',
  quantity = 1 
}: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ShippingOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  const handleCalculate = async () => {
    if (zipCode.length < 4) {
      setError('Código postal inválido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shipping/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipCode,
          items: [{
            weight: productWeight,
            volume: productDimensions, // simplified for now
            quantity: quantity
          }]
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.rates);
      } else {
        setError(data.message || 'Error al calcular el envío');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!showInput) {
    return (
      <button 
        onClick={() => setShowInput(true)}
        className="text-[#0066cc] text-[12px] font-bold cursor-pointer hover:underline uppercase"
      >
        CALCULAR ENVÍO
      </button>
    );
  }

  return (
    <div className="mt-4 p-4 border border-[#e6f0ff] bg-[#fafcff] rounded-md transition-all animate-fadeIn">
      <div className="flex items-center gap-3 mb-3">
        <FaMapMarkerAlt className="text-[#0066cc]" />
        <span className="text-[13px] font-bold text-[#333]">Consulta el envío</span>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Código Postal (ej: 1414)"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').substring(0, 4))}
          onKeyPress={(e) => e.key === 'Enter' && handleCalculate()}
          className="flex-1 border border-[#ccc] px-3 py-2 text-[14px] rounded-sm outline-none focus:border-[#0066cc]"
        />
        <button 
          onClick={handleCalculate}
          disabled={loading || zipCode.length < 4}
          className="bg-[#0066cc] text-white px-4 py-2 text-[13px] font-bold rounded-sm hover:bg-[#0052a3] disabled:bg-gray-300 transition-colors"
        >
          {loading ? <FaSpinner className="animate-spin" /> : 'CALCULAR'}
        </button>
      </div>

      {error && <p className="text-red-500 text-[12px] mb-2">{error}</p>}

      {results && results.length > 0 && (
        <div className="flex flex-col gap-2">
          {results.map((option) => (
            <div key={option.id} className="flex justify-between items-center p-2 bg-white border border-[#eee] rounded-sm">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#333]">{option.name}</span>
                <span className="text-[11px] text-[#666]">Lo recibís en 3-5 días hábiles</span>
              </div>
              <span className="text-[#0066cc] font-bold">
                {option.price === 0 ? 'SIN CARGO' : `$${option.price.toLocaleString('es-AR')}`}
              </span>
            </div>
          ))}
          <button 
            onClick={() => setResults(null)}
            className="text-[11px] text-[#0066cc] mt-1 hover:underline text-left"
          >
            Limpiar consulta
          </button>
        </div>
      )}

      {results && results.length === 0 && !loading && (
        <p className="text-[12px] text-gray-500">No hay servicios de Andreani disponibles para este CP.</p>
      )}

      <button 
        onClick={() => setShowInput(false)}
        className="text-[11px] text-gray-400 mt-2 hover:text-gray-600 block"
      >
        Cancelar
      </button>
    </div>
  );
}
