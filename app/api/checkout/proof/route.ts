import { NextResponse } from 'next/server';

/**
 * API for uploading proof of payment (Bank Transfer)
 * Stores the file as a base64 string in the Order document (MongoDB)
 * This is a 'zero-infrastructure' approach suitable for receipts/small files on Vercel
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;

    if (!file || !orderId) {
      return NextResponse.json({ success: false, message: 'Faltan datos' }, { status: 400 });
    }

    // 1. Convert file to base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString('base64')}`;

    // 2. Update Order
    const { db } = await import('@/lib/db');
    const Order = await db.getOrderModel();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { id: orderId },
      { 
        proofUrl: base64File, 
        proofUploadedAt: new Date(),
        status: 'PENDING_REVIEW' // Custom status for manual verification
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    // 3. Notify Admins (New)
    try {
      const { mailer } = await import('@/lib/mailer');
      await mailer.notifyAdminProofUploaded(orderId, updatedOrder.userName || 'Cliente');
    } catch (mailError) {
      console.error('Failed to notify admins of proof upload:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Comprobante subido correctamente' 
    });

  } catch (error: any) {
    console.error('Proof Upload Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
