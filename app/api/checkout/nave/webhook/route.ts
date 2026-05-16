import { NextResponse } from 'next/server';
import { logToFile } from '@/lib/logger';

/**
 * Webhook for Nave Negocios payment status notifications
 * Nave sends a POST request to this endpoint when a payment status changes
 */

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => { headers[key] = value; });

    const { db } = await import('@/lib/db');

    // 1. Log the webhook to MongoDB (Persistent across Vercel instances)
    await db.logWebhook('NAVE', 'POST', body, headers);
    logToFile('NAVE WEBHOOK RECEIVED (PERSISTED TO DB)');

    const { reference, external_payment_id, status } = body;
    const orderId = reference || external_payment_id;

    if (!orderId) {
      logToFile('NAVE WEBHOOK: Missing order reference');
      return NextResponse.json({ success: false, message: 'Missing reference or external_payment_id' }, { status: 400 });
    }

    // 2. Normalize status
    let rawStatus = (typeof status === 'object' && status !== null ? (status.name || JSON.stringify(status)) : (status?.toString() || ''));
    
    // If status is missing in webhook, try to fetch it from Nave API
    if (!rawStatus) {
      try {
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

        if (NAVE_CLIENT_ID && NAVE_CLIENT_SECRET) {
          logToFile(`NAVE WEBHOOK: Fetching status for ${orderId}...`);
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
          if (authData.access_token) {
            const naveInternalId = body.id || body.payment_id || body.reference;
            const statusResp = await fetch(`${STATUS_URL}/${naveInternalId}`, {
              headers: { 'Authorization': `Bearer ${authData.access_token}` }
            });
            if (statusResp.ok) {
              const naveData = await statusResp.json();
              // Check top-level status or payment object status
              rawStatus = (
                naveData.status?.name || 
                naveData.payment?.status?.name || 
                naveData.status || 
                ''
              ).toString();
              logToFile(`NAVE WEBHOOK: Status fetched: ${rawStatus}`);
            }
          }
        }
      } catch (fetchError: any) {
        logToFile(`NAVE WEBHOOK FETCH ERROR: ${fetchError.message}`);
      }
    }

    let normalizedStatus = rawStatus.toUpperCase();

    // Mapping for Nave payment success statuses
    const successStatuses = ['PAID', 'PAGADO', 'SUCCESS', 'SUCCESS_PROCESSED', 'COMPLETED', 'APPROVED', 'APROBADA'];
    if (successStatuses.includes(normalizedStatus)) {
      normalizedStatus = 'APPROVED';
    } else if (['REJECTED', 'RECHAZADA', 'FAILED', 'FALLIDA'].includes(normalizedStatus)) {
      normalizedStatus = 'REJECTED';
    }

    // 3. Update the database - ONLY if we have a status
    const naveInternalId = body.id || body.payment_id;
    let previousStatus = null;
    
    if (normalizedStatus) {
      const orderPrior = await db.getOrderById(orderId);
      previousStatus = orderPrior?.status;
      
      await db.updateOrderStatus(orderId, normalizedStatus as any, naveInternalId);
    } else {
      logToFile(`NAVE WEBHOOK: Skipping DB update for ${orderId} (empty status)`);
    }
    
    // 4. If payment is approved and was not approved before, send confirmation email
    if (normalizedStatus === 'APPROVED') {
      const order = await db.getOrderById(orderId);
      if (order && previousStatus !== 'APPROVED' && order.userEmail) {
        try {
          const { mailer } = await import('@/lib/mailer');
          await mailer.sendPurchaseConfirmation(order.userEmail, order.userName, order);
          await db.logWebhook('NAVE_EMAIL_SENT', 'POST', { orderId, email: order.userEmail });
        } catch (mailError: any) {
          console.error(`WEBHOOK EMAIL ERROR for ${orderId}:`, mailError.message);
          await db.logWebhook('NAVE_EMAIL_ERROR', 'POST', { orderId, error: mailError.message });
        }
      }
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error: any) {
    console.error('Nave Webhook Fatal Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// If a user hits this via GET (Nave redirecting browser here), redirect to store
import { getBaseUrl } from '@/lib/getBaseUrl';

export async function GET() {
  const baseUrl = getBaseUrl();
  return Response.redirect(`${baseUrl}/mi-cuenta/compras`);
}
