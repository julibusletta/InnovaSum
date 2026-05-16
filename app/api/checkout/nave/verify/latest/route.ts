
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function GET(request: Request) {
  const { db } = await import('@/lib/db');
  await db.logWebhook('NAVE_VERIFY_REQUEST', 'GET', { url: request.url });

  const session = await getServerSession(authOptions);
  
  // For guests, we might not have a session, so this specific "latest" check 
  // works best for logged-in users. 
  // But we can ALSO look for the latest order by IP or similar, but for now let's focus on session.
  
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'No session' }, { status: 401 });
  }

  try {
    // 1. Find the latest PENDING order for this user (created in last 30 mins)
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const userOrders = await db.getOrdersByEmail(session.user.email);
    const latestPending = userOrders.find(o => 
      (o.status === 'PENDING' || (!o.status && o.navePaymentId)) && 
      new Date(o.createdAt) > thirtyMinsAgo
    );

    if (!latestPending) {
      return NextResponse.json({ success: false, message: 'No recent pending orders' });
    }

    const orderId = latestPending.id;
    await db.logWebhook('NAVE_VERIFY_AUTO', 'GET', { orderId, email: session.user.email });

    // 2. Authenticate with Nave
    if (!NAVE_CLIENT_ID || !NAVE_CLIENT_SECRET) {
       return NextResponse.json({ success: false, message: 'Nave credentials not configured' });
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
      return NextResponse.json({ success: false, message: 'Nave auth failed' });
    }

    // 3. Check status in Nave
    const lookupId = latestPending.navePaymentId || orderId;
    const NaveStatusUrl = `${STATUS_URL}/${lookupId}`;
    
    await db.logWebhook('NAVE_VERIFY_LOOKUP', 'GET', { orderId, lookupId, url: NaveStatusUrl });

    let statusResp = await fetch(NaveStatusUrl, {
      headers: { 'Authorization': `Bearer ${authData.access_token}` }
    });

    if (!statusResp.ok) {
       const errorData = await statusResp.json().catch(() => ({}));
       await db.logWebhook('NAVE_VERIFY_ERROR', 'GET', { orderId, errorData, statusCode: statusResp.status });
       return NextResponse.json({ success: false, message: 'Nave order not found or error' });
    }

    const naveData = await statusResp.json();
    await db.logWebhook('NAVE_VERIFY_RESPONSE', 'GET', { orderId, naveData });
    
    const rawStatus = (
      naveData.status?.name || 
      naveData.payment?.status?.name || 
      naveData.status || 
      ''
    ).toString();
    let normalizedStatus = rawStatus.toUpperCase();

    if (['PAID', 'PAGADO', 'SUCCESS', 'SUCCESS_PROCESSED', 'COMPLETED', 'APPROVED', 'APROBADA'].includes(normalizedStatus)) {
      normalizedStatus = 'APPROVED';
    }

    // 4. Update and Email
    if (normalizedStatus === 'APPROVED' && latestPending.status !== 'APPROVED') {
      await db.updateOrderStatus(orderId, 'APPROVED', naveData.id);
      try {
        await mailer.sendPurchaseConfirmation(latestPending.userEmail, latestPending.userName, latestPending);
      } catch (e) {
        console.error('Auto-verify mail error:', e);
      }
      return NextResponse.json({ success: true, status: 'APPROVED', updated: true });
    }

    return NextResponse.json({ success: true, status: normalizedStatus, updated: false });

  } catch (error: any) {
    await db.logWebhook('NAVE_VERIFY_EXCEPTION', 'ERROR', { message: error.message, stack: error.stack });
    return NextResponse.json({ success: false, message: error.message });
  }
}
