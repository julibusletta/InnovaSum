import { Product } from "./api/productService";

declare global {
  interface Window {
    fbq?: any;
  }
}

/**
 * Helper to safely call Meta Pixel if initialized
 */
export function trackMetaEvent(eventName: string, data?: any) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, data);
  }
}

/**
 * Utility to track events and page views to our internal API
 */
export async function trackEvent(options: { 
  productId?: string, 
  productName?: string 
}) {
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
      keepalive: true
    });
  } catch (error) {
    console.error('Tracking failed:', error);
  }
}

/**
 * Track a product view specifically (Internal API + Meta Pixel)
 */
export function trackProductView(product: Product) {
  // Fire Meta Pixel Event
  trackMetaEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'ARS' // Ajusta si la moneda es otra
  });

  // Internal Tracking
  return trackEvent({
    productId: product.id,
    productName: product.name
  });
}

/**
 * Track Add To Cart (Meta Pixel)
 */
export function trackAddToCart(item: { id: string, name: string, price: number, quantity: number }) {
  trackMetaEvent('AddToCart', {
    content_ids: [item.id],
    content_name: item.name,
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'ARS'
  });
}

/**
 * Track Purchase / Pago Completado (Meta Pixel)
 */
export function trackPurchase(items: { id: string }[], totalValue: number) {
  trackMetaEvent('Purchase', {
    content_ids: items.map(i => i.id),
    content_type: 'product',
    value: totalValue,
    currency: 'ARS'
  });
}

/**
 * Track Search (Meta Pixel)
 */
export function trackSearch(query: string) {
  trackMetaEvent('Search', {
    search_string: query
  });
}
