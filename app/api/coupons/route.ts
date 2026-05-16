import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CouponModel from '@/models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    if (body.code) {
      body.code = body.code.toUpperCase().trim();
    }
    
    const coupon = await CouponModel.create(body);
    return NextResponse.json(coupon);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
