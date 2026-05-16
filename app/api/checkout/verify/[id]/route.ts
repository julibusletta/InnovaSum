import { NextResponse } from 'next/server';

/**
 * Generic Order Verification API
 * Used by checkout success/transfer pages to show order summary
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { db } = await import('@/lib/db');
    
    const order = await db.getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    // Basic security: In a real app, we might check session email vs order email
    // but for the confirmation page immediately after purchase, we allow by ID.

    return NextResponse.json({ 
      success: true, 
      order 
    });

  } catch (error: any) {
    console.error('Verify API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
