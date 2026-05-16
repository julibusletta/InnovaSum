import { Product } from "./api/productService";

/**
 * Utility to track events and page views
 */
export async function trackEvent(options: { 
  productId?: string, 
  productName?: string 
}) {
  try {
    // We use a POST request to our track API
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
      keepalive: true // Important for tracking before page unload
    });
  } catch (error) {
    console.error('Tracking failed:', error);
  }
}

/**
 * Track a product view specifically
 */
export function trackProductView(product: Product) {
  return trackEvent({
    productId: product.id,
    productName: product.name
  });
}
