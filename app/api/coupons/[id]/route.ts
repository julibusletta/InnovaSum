import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CouponModel from '@/models/Coupon';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.code) {
      body.code = body.code.toUpperCase().trim();
    }
    
    await dbConnect();
    const updated = await CouponModel.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    await CouponModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
