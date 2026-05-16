import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const WebhookLog = await (db as any).getWebhookLogModel();
    
    // Get latest 100 logs
    const logs = await WebhookLog.find({}).sort({ timestamp: -1 }).limit(100).lean();
    
    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('API Error [webhooks]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
