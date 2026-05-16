import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CouponModel from '@/models/Coupon';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ success: false, message: 'Código requerido' }, { status: 400 });
    }

    await dbConnect();
    
    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ success: false, message: 'Cupón no encontrado' }, { status: 404 });
    }

    if (!coupon.isActive) {
      return NextResponse.json({ success: false, message: 'Cupón inactivo' }, { status: 400 });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: 'Cupón expirado' }, { status: 400 });
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return NextResponse.json({ success: false, message: 'Límite de usos alcanzado' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        type: coupon.type
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
