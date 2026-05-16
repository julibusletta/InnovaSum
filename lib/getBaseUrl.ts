/**
 * Utility to get the correct absolute base URL of the site
 * Prioritizes the custom domain in production
 */
export function getBaseUrl() {
  // If we are in the browser, use the current location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Production Forced Domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://innovasum.com.ar';
  }

  // Environment variables
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  }

  // Default for development
  return 'http://localhost:3000';
}
