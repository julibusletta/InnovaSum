'use client';

import { useState, useEffect, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaChevronLeft, 
  FaCheckCircle, 
  FaLock,
  FaCreditCard,
  FaSpinner,
  FaShieldAlt,
  FaStore,
  FaMoneyBillWave,
  FaChevronRight
} from 'react-icons/fa';
import ShippingModal from '../components/Checkout/ShippingModal';
import '../styles/Checkout.css';

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  type: 'DOMICILIO' | 'SUCURSAL';
  image: string;
}

const ANDREANI_OPTIONS: ShippingOption[] = [
  {
    id: 'andreani-domicilio',
    name: 'Andreani a Domicilio',
    price: 0,
    estimatedDays: '3 a 5',
    type: 'DOMICILIO',
    image: '/images/andreani.png'
  },
  {
    id: 'andreani-sucursal',
    name: 'Retiro en Sucursal Andreani',
    price: 0,
    estimatedDays: '3 a 5',
    type: 'SUCURSAL',
    image: '/images/andreani.png'
  }
];

function CheckoutContent() {
  const { cartItems, total: cartTotal } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRate, setSelectedRate] = useState<ShippingOption | null>(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dni: '',
    street: '',
    number: '',
    floor: '',
    city: '',
    state: 'Buenos Aires',
    zipCode: '',
    phone: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'nave' | 'transfer'>('nave');
  const [error, setError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, discount: number, type: 'PERCENTAGE' | 'FIXED' } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Pre-fill user data from session
  useEffect(() => {
    if (session?.user) {
      const u = session.user as any;
      const names = u.name?.split(' ') || [];
      setFormData(prev => ({
        ...prev,
        email: u.email || prev.email,
        firstName: names[0] || prev.firstName,
        lastName: names.slice(1).join(' ') || prev.lastName,
        dni: u.dni || prev.dni,
        street: u.address?.street || prev.street,
        number: u.address?.number || prev.number,
        city: u.address?.city || prev.city,
        state: u.address?.state || prev.state,
        zipCode: u.address?.zip || prev.zipCode,
        phone: u.phone || prev.phone
      }));
    }
  }, [session]);

  const handleApplyCoupon = async () => {
    setCouponError(null);
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await response.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode('');
      } else {
        setCouponError(data.message || 'Cupón inválido');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Error al validar el cupón');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      couponDiscountAmount = cartTotal * (appliedCoupon.discount / 100);
    } else {
      couponDiscountAmount = appliedCoupon.discount;
    }
  }

  const subtotalAfterCoupon = Math.max(0, cartTotal - couponDiscountAmount);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (formData.zipCode.length < 4) {
        setError('Por favor ingresa un código postal válido');
        return;
      }
      setError(null);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedRate) {
        setError('Por favor selecciona un método de envío');
        return;
      }
      if (!formData.street || !formData.firstName) {
        setIsShippingModalOpen(true);
        return;
      }
      setError(null);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleShippingRateSelect = (rate: ShippingOption) => {
    setSelectedRate(rate);
    setIsShippingModalOpen(true);
  };

  const handleShippingConfirm = (updatedData: any) => {
    setFormData(updatedData);
    setIsShippingModalOpen(false);
    setCurrentStep(3);
  };

  const handleFinalPayment = async () => {
    setLoading(true);
    setError(null);

    const subtotalWithShipping = subtotalAfterCoupon + (selectedRate?.price || 0);
    let finalTotal = subtotalWithShipping;
    if (paymentMethod === 'transfer') {
      finalTotal = subtotalWithShipping * 0.9;
    }

    const endpoint = paymentMethod.startsWith('nave') ? '/api/checkout/nave' : '/api/checkout/transfer';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total: finalTotal,
          orderId: `JB-${Date.now()}`,
          email: formData.email,
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          dni: formData.dni,
          paymentMode: 'NORMAL',
          shipping: {
            method: selectedRate?.name,
            cost: 0, // Siempre sin cargo según pedido
            address: {
              street: formData.street,
              number: formData.number,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            }
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (paymentMethod.startsWith('nave') && data.url) {
          window.location.href = data.url;
        } else if (paymentMethod === 'transfer') {
          router.push(`/checkout/transfer/${data.orderId}`);
        } else {
          setError(data.message || 'Error al procesar el pago');
        }
      } else {
        setError(data.message || 'Error al procesar el pago');
      }
    } catch (err) {
      setError('Error de conexión con el servidor de pagos');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FaTruck className="text-gray-200 text-6xl mb-4" />
        <h2 className="text-xl font-bold mb-4">Tu carrito está vacío</h2>
        <button onClick={() => router.push('/')} className="bg-[#0066cc] text-white px-6 py-2 rounded-md border-0 cursor-pointer">
          Volver a la tienda
        </button>
      </div>
    );
  }

  const steps = [
    { id: 1, label: 'Ingresá CP' },
    { id: 2, label: 'Envío' },
    { id: 3, label: 'Forma de Pago' },
    { id: 4, label: 'Pagar' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full flex flex-col items-center" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
      <div className="w-full max-w-[1200px] px-6">
        
        {/* Stepper UI */}
        <div className="checkout-stepper">
          <div className="stepper-progress">
            <div 
              className="stepper-progress-bar" 
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'done' : ''}`}
            >
              <div className="step-circle">{step.id}</div>
              <div className="step-label">{step.label}</div>
            </div>
          ))}
        </div>

        <div className="checkout-grid mt-12">
          
          {/* Left Column: Interactive Form */}
          <div className="checkout-card">
            
            {/* STEP 1: ZIP CODE */}
            {currentStep === 1 && (
              <fieldset className="form-fieldset">
                <h2 className="checkout-title">Información de Envío</h2>
                <p className="text-sm font-bold text-slate-500 mb-8 uppercase tracking-widest leading-loose">Ingresá tu Código Postal para continuar</p>
                <div className="checkout-input-group max-w-xs mx-auto text-center">
                  <input 
                    type="text" 
                    className="checkout-input text-center text-2xl tracking-[0.5em]"
                    maxLength={4}
                    value={formData.zipCode}
                    onChange={(e) => setFormData({...formData, zipCode: e.target.value.replace(/\D/g, '')})}
                    placeholder="CP"
                  />
                </div>
                {error && <p className="text-red-500 text-[10px] font-bold text-center mt-2 uppercase">{error}</p>}
                <button 
                  onClick={handleNextStep}
                  className="checkout-btn-next"
                >
                  Continuar <FaChevronRight size={12} />
                </button>
              </fieldset>
            )}

            {/* STEP 2: SHIPPING METHODS */}
            {currentStep === 2 && (
              <fieldset className="form-fieldset">
                <h2 className="checkout-title">Método de Envío</h2>
                <div className="shipping-options-grid mt-8">
                  {ANDREANI_OPTIONS.map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleShippingRateSelect(option)}
                      className={`shipping-card ${selectedRate?.id === option.id ? 'selected' : ''}`}
                    >
                      <img src={option.image} alt={option.name} />
                      <span className="shipping-name">{option.name}</span>
                      <span className="shipping-desc">Lo recibís en 3-5 días hábiles</span>
                      <span className="shipping-price">SIN CARGO</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleBackStep}
                  className="checkout-btn-back"
                >
                  ← Cambiar mi CP
                </button>
              </fieldset>
            )}

            {/* STEP 3: PAYMENT METHODS */}
            {currentStep === 3 && (
              <fieldset className="form-fieldset">
                <h2 className="checkout-title">Forma de Pago</h2>
                <div className="payment-list mt-8">
                  
                  {/* Tarjeta 1 Pago */}
                  <div 
                    className={`payment-card ${paymentMethod === 'nave' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('nave')}
                  >
                    <div className="payment-radio" />
                    <FaCreditCard className="payment-icon text-xl" />
                    <div className="payment-info">
                      <span className="payment-name uppercase">Tarjeta Crédito / Débito</span>
                    </div>
                    <span className="payment-price-tag">${(subtotalAfterCoupon).toLocaleString('es-AR')}</span>
                  </div>

                  {/* Transferencia */}
                  <div 
                    className={`payment-card ${paymentMethod === 'transfer' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <div className="payment-radio" />
                    <FaMoneyBillWave className="payment-icon text-xl" />
                    <div className="payment-info">
                      <span className="payment-name">Transferencia Bancaria</span>
                      <span className="payment-badge">10% OFF</span>
                    </div>
                    <span className="payment-price-tag">${(subtotalAfterCoupon * 0.9).toLocaleString('es-AR')}</span>
                  </div>



                </div>
                <button 
                  onClick={handleNextStep}
                  className="checkout-btn-next mt-10"
                >
                  Continuar al Resumen <FaChevronRight size={12} />
                </button>
                <button 
                  onClick={handleBackStep}
                  className="checkout-btn-back"
                >
                  ← Cambiar método de envío
                </button>
              </fieldset>
            )}

            {/* STEP 4: FINAL SUMMARY & PAY */}
            {currentStep === 4 && (
              <fieldset className="form-fieldset">
                <h2 className="checkout-title">Confirmar Pedido</h2>
                <div className="space-y-6 bg-slate-50 p-6 border border-slate-100 mb-8">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Destinatario</label>
                    <p className="font-bold text-slate-900 uppercase">{formData.firstName} {formData.lastName}</p>
                    <p className="text-xs text-slate-500 mt-1">DNI: {formData.dni}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Domicilio</label>
                    <p className="font-bold text-slate-900 uppercase">{formData.street} {formData.number} {formData.floor && `, ${formData.floor}`}</p>
                    <p className="text-xs text-slate-500 mt-1">{formData.city}, {formData.state} ({formData.zipCode})</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Método de Pago</label>
                    <p className="font-bold text-slate-900 uppercase">
                      {paymentMethod === 'nave' ? 'Tarjeta Crédito / Débito' : 'Transferencia Bancaria'}
                    </p>
                  </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold uppercase mb-6 border-l-4 border-red-600">{error}</div>}

                <button 
                  onClick={handleFinalPayment}
                  disabled={loading}
                  className="checkout-btn-next !bg-blue-600"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <>Finalizar Pedido <FaLock size={12} /></>}
                </button>
                <button 
                  onClick={handleBackStep}
                  className="checkout-btn-back"
                >
                  ← Cambiar forma de pago
                </button>
              </fieldset>
            )}

          </div>

          {/* Right Column: Order Summary Sidecard */}
          <div className="checkout-card lg:sticky lg:top-[160px]">
            <h2 className="checkout-title">Resumen de Compra</h2>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-row">
                  <img src={item.image} alt={item.name} className="summary-img" />
                  <div className="summary-details">
                    <h4 className="summary-name uppercase tracking-tight">{item.name}</h4>
                    <div className="summary-meta">Cantidad: {item.quantity}</div>
                  </div>
                  <div className="summary-price">${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 mb-4 border-b border-slate-100 pb-4">
              {!appliedCoupon ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Código de Descuento</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      className="checkout-input !text-sm !p-2 flex-1 m-0"
                      placeholder="Ingresá tu cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="bg-[#0066cc] text-white px-4 text-xs font-bold uppercase rounded-md flex items-center justify-center disabled:opacity-50"
                    >
                      {isApplyingCoupon ? <FaSpinner className="animate-spin" /> : 'Aplicar'}
                    </button>
                  </div>
                  {couponError && <span className="text-red-500 text-[10px] font-bold uppercase mt-1">{couponError}</span>}
                </div>
              ) : (
                <div className="bg-green-50 p-3 rounded-md flex justify-between items-center border border-green-200">
                  <div className="flex flex-col">
                     <span className="text-green-700 text-[10px] font-black uppercase tracking-widest">Cupón Aplicado</span>
                     <span className="text-green-800 font-bold uppercase">{appliedCoupon.code}</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Quitar</button>
                </div>
              )}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">${cartTotal.toLocaleString('es-AR')}</span>
              </div>
              {appliedCoupon && (
                <div className="total-row">
                  <span className="total-label text-green-600">
                    Cupón ({appliedCoupon.code})
                    {appliedCoupon.type === 'PERCENTAGE' && ` ${appliedCoupon.discount}%`}
                  </span>
                  <span className="total-value text-green-600">-${couponDiscountAmount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="total-row">
                <span className="total-label">Costo de Envío</span>
                <span className="total-value text-green-600">SIN CARGO</span>
              </div>
              {paymentMethod === 'transfer' && (
                <div className="total-row">
                  <span className="total-label text-red-600">Descuento Transferencia (10%)</span>
                  <span className="total-value text-red-600">-${(subtotalAfterCoupon * 0.1).toLocaleString('es-AR')}</span>
                </div>
              )}
              
              <div className="final-total-row">
                <span className="final-total-label">Total Final</span>
                <span className="final-total-value">
                  ${(paymentMethod === 'transfer' ? subtotalAfterCoupon * 0.9 : subtotalAfterCoupon).toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
              <div className="flex gap-4 grayscale opacity-40">
                <FaShieldAlt size={24} />
                <FaCreditCard size={24} />
                <FaLock size={24} />
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Nave Negocios Powered by Banco Galicia</p>
            </div>
          </div>

        </div>
      </div>

      <ShippingModal 
        isOpen={isShippingModalOpen}
        onClose={() => setIsShippingModalOpen(false)}
        initialData={formData}
        onConfirm={handleShippingConfirm}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando Pago...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
