/**
 * Andreani Shipping API Client
 * Handles authentication, rate calculation, and shipment creation.
 */

const ANDREANI_USER = process.env.ANDREANI_USER;
const ANDREANI_PASS = process.env.ANDREANI_PASS;
const ANDREANI_CLIENT_NUMBER = process.env.ANDREANI_CLIENT_NUMBER;
const ANDREANI_ENV = process.env.ANDREANI_ENV || 'production';

const BASE_URL = ANDREANI_ENV === 'production'
  ? 'https://api.andreani.com'
  : 'https://api-qa.andreani.com';

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Gets a valid Andreani authorization token
 */
async function getAndreaniToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  if (!ANDREANI_USER || !ANDREANI_PASS) {
    throw new Error('Andreani credentials not configured');
  }

  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${ANDREANI_USER}:${ANDREANI_PASS}`).toString('base64')}`
      }
    });

    if (!response.ok) {
      throw new Error(`Auth failed with status ${response.status}`);
    }

    const token = response.headers.get('x-authorization-token');
    if (!token) {
      throw new Error('No x-authorization-token found in headers');
    }

    cachedToken = token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // Cache for 23 hours
    return token;
  } catch (error) {
    console.error('Andreani Auth Error:', error);
    throw error;
  }
}

export interface ShippingItem {
  weight: number; // in kg
  volume: number; // in cm3
  quantity: number;
}

export interface RateOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  type: 'DOMICILIO' | 'SUCURSAL';
}

/**
 * Calculates shipping rates for a given ZIP code
 */
export async function calculateRates(zipCode: string, items: ShippingItem[]): Promise<RateOption[]> {
  try {
    const token = await getAndreaniToken();
    
    // Total weight and dimensions
    const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0) || 0.5;

    // Andreani V2 expects specific contract numbers. 
    // Fallback to client number if not specifically provided.
    const body = {
      cpDestino: zipCode,
      contrato: ANDREANI_CLIENT_NUMBER, 
      cliente: ANDREANI_CLIENT_NUMBER,
      bultos: items.map(item => ({
        kilos: item.weight || 0.5,
        valorDeclarado: 1000, // Minimal insurance value
        volumen: item.volume || 1000 
      }))
    };

    const response = await fetch(`${BASE_URL}/v2/tarifas`, {
      method: 'POST',
      headers: {
        'x-authorization-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      console.warn('Andreani Rates API Error:', errorMsg);
      return getDefaultRates();
    }

    const data = await response.json();
    
    return (data.tarifas || []).map((t: any) => ({
      id: t.id_servicio || String(Math.random()),
      name: t.detalle || 'Envío Andreani',
      price: 0, // Force free shipping
      estimatedDays: parseInt(t.dias_entrega) || 3,
      type: t.es_sucursal ? 'SUCURSAL' : 'DOMICILIO'
    }));

  } catch (error) {
    console.error('Andreani calculateRates failed:', error);
    return getDefaultRates();
  }
}

function getDefaultRates(): RateOption[] {
  // Safe fallback to ensure the user can at least see mock rates if API is down
  return [
    { id: 'dom-std', name: 'Envío a Domicilio (Andreani)', price: 0, estimatedDays: 3, type: 'DOMICILIO' },
    { id: 'suc-std', name: 'Retiro en Sucursal (Andreani)', price: 0, estimatedDays: 2, type: 'SUCURSAL' }
  ];
}

/**
 * Fetches Andreani branches for a ZIP code
 */
export async function getAndreaniOffices(zipCode: string) {
  try {
    const token = await getAndreaniToken();
    const response = await fetch(`${BASE_URL}/v2/sucursales?codigoPostal=${zipCode}`, {
      headers: { 'x-authorization-token': token }
    });
    
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Andreani getAndreaniOffices failed:', error);
    return [];
  }
}

