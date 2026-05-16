import { NextResponse } from 'next/server';
import { calculateRates, ShippingItem } from '@/lib/shipping/andreani';

export async function POST(request: Request) {
  try {
    const { zipCode, items } = await request.json();

    if (!zipCode || !items || !Array.isArray(items)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Código postal y lista de productos requeridos' 
      }, { status: 400 });
    }

    const shippingItems: ShippingItem[] = items.map((item: any) => ({
      weight: parseFloat(item.weight) || 0.5,
      volume: parseFloat(item.volume) || 1000,
      quantity: item.quantity || 1
    }));

    const rates = await calculateRates(zipCode, shippingItems);

    return NextResponse.json({
      success: true,
      rates
    });

  } catch (error: any) {
    console.error('Shipping API Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al calcular el envío' 
    }, { status: 500 });
  }
}
