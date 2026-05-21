import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import GlobalSettings from '@/models/GlobalSettings';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await db.getGlobalSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { exchangeRate } = data;

    if (typeof exchangeRate !== 'number' || exchangeRate <= 0) {
      return NextResponse.json({ error: 'Invalid exchange rate' }, { status: 400 });
    }

    await dbConnect();
    
    // Update settings
    await GlobalSettings.findOneAndUpdate(
      {},
      { exchangeRate, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Tasa actualizada.' 
    });
  } catch (error: any) {
    console.error('Error in Settings API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
