import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Admin API for uploading invoices to an order
 * Stores the PDF as a base64 string in the Order document
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file || !orderId) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
       return NextResponse.json({ success: false, message: 'Solo se permiten archivos PDF' }, { status: 400 });
    }

    // 1. Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 2. Update Order
    const { db } = await import('@/lib/db');
    const Order = await db.getOrderModel();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { id: orderId },
      { invoiceUrl: base64File },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Factura subida correctamente' 
    });

  } catch (error: any) {
    console.error('Invoice Upload Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
