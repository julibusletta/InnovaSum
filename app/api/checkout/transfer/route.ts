import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const { items, total, orderId, shipping, email, phone, firstName, lastName } = await request.json();
    const { db } = await import('@/lib/db');
    const session = await getServerSession(authOptions);

    // 1. Validation
    if (!total || total <= 0) {
      return NextResponse.json({ success: false, message: 'Monto inválido' }, { status: 400 });
    }

    const currentOrderId = orderId || `JB-${Date.now()}`;

    // 2. Persistence: Save the order as PENDING with paymentMethod: TRANSFERENCIA
    const userName = `${firstName || ''} ${lastName || ''}`.trim() || session?.user?.name || 'Cliente Invitado';
    const userEmail = email || session?.user?.email || 'invitado@innovasum.com';

    const orderData = {
      id: currentOrderId,
      userEmail,
      userName,
      items: items.map((item: any) => ({
        productId: item.id || item.productId,
        name: item.name?.trim() || 'Producto sin nombre',
        quantity: item.quantity,
        price: item.price
      })),
      userPhone: phone,
      total,
      status: 'PENDING',
      paymentMethod: 'TRANSFERENCIA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shippingAddress: shipping ? {
        street: `${shipping.address.street} ${shipping.address.number}`,
        city: shipping.address.city,
        state: shipping.address.state,
        zip: shipping.address.zipCode,
        shippingCost: shipping.cost,
        shippingMethod: shipping.method
      } : undefined
    };

    await db.saveOrder(orderData);

    // 3. Send Confirmation Email (New)
    try {
      const { mailer } = await import('@/lib/mailer');
      await mailer.sendTransferOrderReceived(userEmail, userName, orderData);
    } catch (mailError) {
      console.error('Failed to send transfer confirmation email:', mailError);
    }

    return NextResponse.json({ 
      success: true, 
      orderId: currentOrderId
    });

  } catch (error: any) {
    console.error('Transfer Integration Error:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
