import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const orders = await db.getOrders();
    const User = await (db as any).getUserModel();
    
    // Enrich orders with user phone numbers if missing
    const enrichedOrders = await Promise.all(orders.map(async (order: any) => {
      if (!order.userPhone && order.userEmail) {
        const user = await User.findOne({ email: order.userEmail.toLowerCase() }).select('phone').lean();
        if (user && user.phone) {
          return { ...order, userPhone: user.phone };
        }
      }
      return order;
    }));

    return NextResponse.json({ success: true, orders: enrichedOrders });
  } catch (error: any) {
    console.error('API Error [Orders GET]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId, status, trackingCode } = body;

    if (action === 'update_status') {
      await db.updateOrderStatus(orderId, status);

      // Si el administrador lo marca manualmente como APROBADO, le enviamos su comprobante.
      if (status === 'APPROVED') {
        const order = await db.getOrderById(orderId);
        if (order && order.userEmail) {
          try {
            const { mailer } = await import('@/lib/mailer');
            await mailer.sendPurchaseConfirmation(order.userEmail, order.userName || 'Cliente', order);
          } catch (e) {
            console.error('Error enviando mail de confirmación manual:', e);
          }
        }
      }

      return NextResponse.json({ success: true, message: 'Estado del pedido actualizado' });
    }

    if (action === 'update_tracking') {
      await db.updateOrderTracking(orderId, trackingCode);
      return NextResponse.json({ success: true, message: 'Seguimiento actualizado' });
    }

    if (action === 'delete_order') {
      await db.deleteOrder(orderId);
      return NextResponse.json({ success: true, message: 'Pedido eliminado físicamente de la base de datos' });
    }

    return NextResponse.json({ success: false, message: 'Acción no válida' }, { status: 400 });
  } catch (error: any) {
    console.error('API Error [Orders POST]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
