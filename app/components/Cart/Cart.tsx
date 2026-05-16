'use client';

import { useSession } from 'next-auth/react';
import { useCart, CartItem } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/app/context/AuthModalContext';
import '../../styles/Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart, addToCart, total } = useCart();
  const { status } = useSession();
  const router = useRouter();
  const { openLogin } = useAuthModal();

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      const currentItem = cartItems.find((item) => item.id === id);
      if (currentItem) {
        removeFromCart(id, currentItem.quantity);
        addToCart({ ...currentItem, quantity: newQuantity });
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    if (status === 'unauthenticated') {
      openLogin('/checkout');
      return;
    }
    
    router.push('/checkout');
  };

  if (cartItems.length === 0) {
// ... (rest of the empty state JSX)
    return (
      <div className="cart-container">
        <h1>Mi carrito</h1>
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <a href="/" className="btn-continue">
            Ver más productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Mi carrito</h1>

      <div className="cart-layout">
        {/* Productos */}
        <div className="cart-items">
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
              </div>

              <div className="item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  className="qty-input"
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <div className="item-price">
                <div className="price-info">
                  <span className="unit-price">${item.price.toLocaleString('es-AR')}</span>
                  <span className="subtotal">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id, item.quantity)}
                title="Eliminar producto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary">
          <h2>RESUMEN</h2>

          <div className="summary-content">
            <div className="summary-row">
              <span>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>

            <div className="summary-note">
              <p>Si tenés un cupón, podrás ingresarlo en el último paso.</p>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${total.toLocaleString('es-AR')}</span>
            </div>

            <div className="payment-methods">
              <p>*Precio abonando con depósito o transferencia.</p>
            </div>


            <div className="cart-actions">
              <button 
                className="btn-checkout"
                onClick={handleCheckout}
              >
                Iniciar compra
              </button>
              <a href="/" className="btn-continue">
                Ver más productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
