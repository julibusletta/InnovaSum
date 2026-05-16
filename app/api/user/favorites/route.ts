import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { db } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import { mailer } from '@/lib/mailer';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'No autenticado' }, { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Fetch full product details for favorites
    const favorites = await Product.find({ id: { $in: user.favorites } });

    return NextResponse.json({ success: true, favorites });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Inicia sesión para guardar favoritos' }, { status: 401 });
    }

    const { productId, productName } = await request.json();
    if (!productId) {
      return NextResponse.json({ success: false, message: 'ID de producto requerido' }, { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    const isFavorite = user.favorites.includes(productId);
    let message = '';

    if (isFavorite) {
      user.favorites = user.favorites.filter((id: string) => id !== productId);
      message = 'Eliminado de favoritos';
    } else {
      user.favorites.push(productId);
      message = 'Agregado a favoritos';
      
      // Notify admin
      try {
        await mailer.notifyAdminFavoriteAdded(
          session.user.name || 'Usuario', 
          session.user.email, 
          { id: productId, name: productName || 'Producto' }
        );
      } catch (mailErr) {
        console.error('Error sending favorite notification:', mailErr);
      }
    }

    await user.save();

    return NextResponse.json({ 
      success: true, 
      message, 
      isFavorite: !isFavorite 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
