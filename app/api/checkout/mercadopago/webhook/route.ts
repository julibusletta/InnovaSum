import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-0000000000000000-000000-00000000000000000000000000000000-000000000'
});

export async function POST(request: Request) {
  const { db } = await import('@/lib/db');
  
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || url.searchParams.get('topic');
    const dataId = url.searchParams.get('data.id') || url.searchParams.get('id');

    if (type === 'payment' && dataId) {
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: dataId });
      
      const orderId = paymentData.external_reference;
      
      if (orderId) {
        if (paymentData.status === 'approved') {
          await db.updateOrderStatus(orderId, 'PAID');
          await db.logWebhook('MP_WEBHOOK_APPROVED', 'POST', { orderId, paymentId: dataId });
        } else {
          await db.logWebhook('MP_WEBHOOK_OTHER_STATUS', 'POST', { orderId, status: paymentData.status });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('MercadoPago Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
