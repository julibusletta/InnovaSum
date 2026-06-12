import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { getBaseUrl } from '@/lib/getBaseUrl';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
});

export async function POST(request: Request) {
  const { db } = await import('@/lib/db');
  let currentOrderId = 'unknown';

  try {
    const body = await request.json();
    const { items, total, orderId, shipping, email, phone, firstName, lastName, dni, paymentMode } = body;
    currentOrderId = orderId || `JB-${Date.now()}`;
    const baseUrl = getBaseUrl();

    await db.logWebhook('MP_CHECKOUT_START', 'POST', { orderId: currentOrderId, total });

    const preference = new Preference(client);

    const mappedItems = items.map((item: any) => ({
      id: item.id || item.productId || 'item',
      title: item.name?.trim() || 'Producto',
      quantity: item.quantity,
      unit_price: Number(item.price.toFixed(2))
    }));

    if (shipping?.cost) {
      mappedItems.push({
        id: 'shipping',
        title: 'Costo de Envío',
        quantity: 1,
        unit_price: Number(shipping.cost.toFixed(2))
      });
    }

    const prefResponse = await preference.create({
      body: {
        items: mappedItems,
        payer: {
          email: email || 'invitado@innovasum.com',
          name: firstName || 'Cliente',
          surname: lastName || 'Invitado',
          phone: { number: phone || '' },
          identification: dni ? { type: 'DNI', number: dni } : undefined
        },
        back_urls: {
          success: `${baseUrl}/mi-cuenta/compras`,
          failure: `${baseUrl}/`,
          pending: `${baseUrl}/mi-cuenta/compras`
        },
        auto_return: 'approved',
        external_reference: currentOrderId,
        notification_url: `${baseUrl}/api/checkout/mercadopago/webhook`
      }
    });

    const userName = `${firstName || ''} ${lastName || ''}`.trim() || 'Cliente Invitado';
    const userEmail = email || 'invitado@innovasum.com';

    await db.saveOrder({
      id: currentOrderId,
      userEmail,
      userName,
      userPhone: phone,
      items: items.map((item: any) => ({ 
        productId: item.id || item.productId,
        name: item.name?.trim() || 'Producto sin nombre', 
        quantity: item.quantity, 
        price: item.price 
      })),
      total,
      status: 'PENDING',
      paymentMethod: 'MERCADOPAGO',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mpPreferenceId: prefResponse.id,
      paymentMode: paymentMode || 'NORMAL',
      dni: dni || '',
      shippingAddress: shipping ? {
        street: `${shipping.address.street} ${shipping.address.number}`,
        city: shipping.address.city,
        state: shipping.address.state,
        zip: shipping.address.zipCode,
        shippingCost: shipping.cost,
        shippingMethod: shipping.method
      } : undefined
    });

    return NextResponse.json({
      success: true,
      url: prefResponse.init_point,
      id: prefResponse.id
    });

  } catch (error: any) {
    console.error('MercadoPago Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
