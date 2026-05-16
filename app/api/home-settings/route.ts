import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import HomeSettings from '@/models/HomeSettings';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI!);
}

export async function GET() {
  try {
    await connectDB();
    const settings = await HomeSettings.findOne().sort({ updatedAt: -1 });
    
    if (!settings) {
      // Retornar configuración por defecto si no existe en la DB
      return NextResponse.json({
        heroSlides: [
          { image: '/images/bannerof1.png', alt: 'iPhone Premium', order: 0 },
          { image: '/images/DC_20260306150520_9z1vjiMY.jpg', alt: 'Tecnología', order: 1 }
        ],
        productCarousels: [
          { title: "BOMBAS EN INNOVASUM", type: 'section', value: 'bombas', order: 0, active: true },
          { title: "NUEVAS LLEGADAS", type: 'section', value: 'nuevas', order: 1, active: true }
        ],
        weeklyOffers: [
          { productId: "378", title: "JBL CHARGE 6", subtitle: "* 10% de descuento abonando por transferencia", link: "/product/378", active: true },
          { productId: "1339", title: "XIAOMI SMART", subtitle: "ROBOT S40C", link: "/product/1339", active: true }
        ]
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error in GET /api/home-settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
