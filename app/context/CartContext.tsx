'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  weight?: number;
}

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, quantity?: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('innovasum_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
          setCartCount(parsed.reduce((acc, item) => acc + (item.quantity || 1), 0));
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('innovasum_cart', JSON.stringify(cartItems));
      } catch (e) {
        console.warn('Failed to save cart to localStorage', e);
      }
    }
  }, [cartItems, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCartCount((prev) => prev + item.quantity);
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      
      return [...prevItems, item];
    });
  };

  const removeFromCart = (id: string, quantity = 1) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (!item) return prevItems;

      setCartCount((prev) => Math.max(0, prev - quantity));

      if (item.quantity <= quantity) {
        return prevItems.filter((i) => i.id !== id);
      }

      return prevItems.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity - quantity }
          : i
      );
    });
  };

  const clearCart = () => {
    setCartCount(0);
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, total, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
