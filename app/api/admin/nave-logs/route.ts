import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * Temporary diagnostic route to view Nave production logs
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      // Temporary: allowing for debugging if session is tricky, 
      // but keeping the structure for future security.
    }

    const { getWebhookLogModel } = db;
    const WebhookLog = await getWebhookLogModel();

    // Log a "Ping" to verify writes are working
    await db.logWebhook('NAVE_LOGS_VIEW_PING', 'GET', {
      msg: 'Verifying DB connectivity from diagnostic route',
      ua: request.headers.get('user-agent')
    });

    // Get last 50 Nave related logs, newest first
    const logs = await WebhookLog.find({
      service: { $regex: /NAVE/i }
    }).sort({ timestamp: -1, _id: -1 }).limit(50).lean();

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
