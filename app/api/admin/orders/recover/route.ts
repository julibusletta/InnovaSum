import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { mailer } from "@/lib/mailer";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    const adminEmails = ['contacto@innovasum.com.ar', 'ventas@innovasum.com.ar', 'julian.busletta@gmail.com', 'admin'];
    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email || '';

    if (!session || (userRole !== 'ADMIN' && !adminEmails.includes(userEmail))) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 403 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'ID de orden requerido' }, { status: 400 });
    }

    const order = await db.getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, message: 'Orden no encontrada' }, { status: 404 });
    }

    if (!order.userEmail) {
      return NextResponse.json({ success: false, message: 'El cliente no tiene email asociado' }, { status: 400 });
    }

    const result = await mailer.sendAbandonedCartRecovery(
      order.userEmail, 
      order.userName || 'Cliente', 
      order
    );

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Mail de recupero enviado con éxito' });
    } else {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in recovery API:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
