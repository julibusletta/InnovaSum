import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ success: false, message: 'Datos de dirección faltantes' }, { status: 400 });
    }

    // Get current user from DB to keep all fields
    const user = await db.getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Update address
    user.address = {
      street: address.street,
      number: address.number,
      city: address.city,
      state: address.state,
      zip: address.zip
    };

    // Save back to DB
    await db.saveUser(user);

    return NextResponse.json({ 
      success: true, 
      message: 'Dirección actualizada correctamente'
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor',
      debug: error.message 
    }, { status: 500 });
  }
}
