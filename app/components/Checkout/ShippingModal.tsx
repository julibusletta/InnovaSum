'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaUser, FaPhone, FaIdCard } from 'react-icons/fa';

interface ShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  initialData: any;
}

export default function ShippingModal({ isOpen, onClose, onConfirm, initialData }: ShippingModalProps) {
  const [formData, setFormData] = useState(initialData);

  // Sync state when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Confirming shipping data:', formData);
    onConfirm(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-header-title">
            <FaMapMarkerAlt style={{ color: '#3b82f6' }} /> Datos de Entrega y Contacto
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="modal-content">
          <div className="modal-section-title">
            <FaUser size={10} /> Información Personal
          </div>
          
          <div className="modal-grid">
            <div className="modal-col-2">
              <label className="checkout-label">Nombre</label>
              <input 
                type="text" 
                required 
                className="checkout-input"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="modal-col-2">
              <label className="checkout-label">Apellido</label>
              <input 
                type="text" 
                required 
                className="checkout-input"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <div className="modal-col-4">
              <label className="checkout-label">D.N.I.</label>
              <input 
                type="text" 
                required 
                placeholder="Documento Nacional de Identidad"
                className="checkout-input"
                value={formData.dni || ''}
                onChange={(e) => setFormData({...formData, dni: e.target.value})}
              />
            </div>
          </div>

          <div className="modal-section-title">
            <FaMapMarkerAlt size={10} /> Domicilio de Entrega
          </div>
          
          <div className="modal-grid">
            <div className="modal-col-2">
              <label className="checkout-label">Calle</label>
              <input 
                type="text" 
                required 
                className="checkout-input"
                value={formData.street || ''}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
              />
            </div>
            <div className="modal-col-1">
              <label className="checkout-label">Número</label>
              <input 
                type="text" 
                required 
                className="checkout-input"
                value={formData.number || ''}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
              />
            </div>
            <div className="modal-col-1">
              <label className="checkout-label">Piso/Depto</label>
              <input 
                type="text" 
                className="checkout-input"
                value={formData.floor || ''}
                onChange={(e) => setFormData({...formData, floor: e.target.value})}
              />
            </div>
            <div className="modal-col-2">
              <label className="checkout-label">Localidad</label>
              <input 
                type="text" 
                required 
                className="checkout-input"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
            <div className="modal-col-2">
              <label className="checkout-label">Provincia</label>
              <select 
                className="checkout-input"
                value={formData.state || 'Buenos Aires'}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
              >
                <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                <option value="Buenos Aires">Buenos Aires</option>
                <option value="Córdoba">Córdoba</option>
                <option value="Santa Fe">Santa Fe</option>
                <option value="Mendoza">Mendoza</option>
                <option value="Tucumán">Tucumán</option>
                <option value="Salta">Salta</option>
                <option value="Misiones">Misiones</option>
                <option value="Chaco">Chaco</option>
                <option value="Corrientes">Corrientes</option>
                <option value="San Juan">San Juan</option>
                <option value="Jujuy">Jujuy</option>
                <option value="Santiago del Estero">Santiago del Estero</option>
                <option value="Entre Ríos">Entre Ríos</option>
                <option value="Neuquén">Neuquén</option>
                <option value="Chubut">Chubut</option>
                <option value="San Luis">San Luis</option>
                <option value="Catamarca">Catamarca</option>
                <option value="La Rioja">La Rioja</option>
                <option value="La Pampa">La Pampa</option>
                <option value="Santa Cruz">Santa Cruz</option>
                <option value="Río Negro">Río Negro</option>
                <option value="Tierra del Fuego">Tierra del Fuego</option>
                <option value="Formosa">Formosa</option>
              </select>
            </div>
          </div>

          <div className="modal-section-title">
            <FaPhone size={10} /> Contacto
          </div>
          
          <div className="modal-grid">
            <div className="modal-col-4">
              <label className="checkout-label">Teléfono / WhatsApp</label>
              <input 
                type="tel" 
                required 
                placeholder="Ej: 11 1234 5678"
                className="checkout-input"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <input type="submit" style={{ display: 'none' }} id="hidden-submit" />
        </form>

        {/* Footer */}
        <div className="modal-footer">
          <button 
            type="button"
            onClick={() => document.getElementById('hidden-submit')?.click()}
            className="modal-btn-confirm"
          >
            Confirmar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
