
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { mailer } from '@/lib/mailer';

const NAVE_ENV = process.env.NAVE_ENV || 'sandbox';
const NAVE_CLIENT_ID = process.env.NAVE_CLIENT_ID;
const NAVE_CLIENT_SECRET = process.env.NAVE_CLIENT_SECRET;

const AUTH_URL = NAVE_ENV === 'production' 
  ? 'https://services.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms' 
  : 'https://homoservices.apinaranja.com/security-ms/api/security/auth0/b2b/m2ms';

const STATUS_URL = NAVE_ENV === 'production'
  ? 'https://api.ranty.io/api/payment_requests'
  : 'https://api-sandbox.ranty.io/api/payment_requests';

const NAVE_AUDIENCE = 'https://naranja.com/ranty/merchants/api';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params;
  const { db } = await import('@/lib/db');

  try {
    // Log the verification attempt
    await db.logWebhook('NAVE_VERIFY', 'GET', { orderId });
    // 1. Check if order is already APPROVED in our DB
    const order = await db.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    if (order.status === 'APPROVED') {
      return NextResponse.json({ success: true, status: 'APPROVED', alreadyProcessed: true });
    }

    // 2. Authenticate with Nave
    if (!NAVE_CLIENT_ID || !NAVE_CLIENT_SECRET) {
       return NextResponse.json({ success: false, message: 'Credenciales de Nave no configuradas' }, { status: 500 });
    }

    const authResp = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: NAVE_CLIENT_ID,
        client_secret: NAVE_CLIENT_SECRET,
        audience: NAVE_AUDIENCE,
        grant_type: 'client_credentials'
      })
    });

    const authData = await authResp.json();
    if (!authData.access_token) {
      return NextResponse.json({ success: false, message: 'Error de autenticación con Nave' }, { status: 500 });
    }

    // 3. Check status in Nave using the Nave Payment ID
    const NaveStatusUrl = `${STATUS_URL}/${order.navePaymentId || orderId}`;
    const statusResp = await fetch(NaveStatusUrl, {
      headers: { 'Authorization': `Bearer ${authData.access_token}` }
    });

    if (!statusResp.ok) {
       const errorData = await statusResp.json();
       return NextResponse.json({ success: false, message: 'Nave no reconoce esta orden', error: errorData });
    }

    const naveData = await statusResp.json();
    const rawStatus = (
      naveData.status?.name || 
      naveData.payment?.status?.name || 
      naveData.status || 
      ''
    ).toString();
    let normalizedStatus = rawStatus.toUpperCase();

    // Mapping success statuses
    if (['PAID', 'PAGADO', 'SUCCESS', 'SUCCESS_PROCESSED', 'COMPLETED', 'APPROVED', 'APROBADA'].includes(normalizedStatus)) {
      normalizedStatus = 'APPROVED';
    }

    // 4. Update DB and send email if just approved
    if (normalizedStatus === 'APPROVED' && order.status !== 'APPROVED') {
      await db.updateOrderStatus(orderId, 'APPROVED', naveData.id);
      
      // Send confirmation email
      try {
        await mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order);
      } catch (mailErr) {
        console.error('VERIFY MAIL ERROR:', mailErr);
      }

      return NextResponse.json({ 
        success: true, 
        status: 'APPROVED', 
        message: 'Estado actualizado y mail enviado' 
      });
    }

    return NextResponse.json({ 
      success: true, 
      status: normalizedStatus, 
      message: 'Estado verificado' 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
