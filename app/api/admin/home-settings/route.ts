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
    let settings = await HomeSettings.findOne().sort({ updatedAt: -1 });
    if (!settings) {
       // Si no existe, lo creamos vacío para editar
       settings = await HomeSettings.create({
         heroSlides: [],
         productCarousels: []
       });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    let settings = await HomeSettings.findOne().sort({ updatedAt: -1 });
    
    if (settings) {
      settings.heroSlides = data.heroSlides || settings.heroSlides;
      settings.productCarousels = data.productCarousels || settings.productCarousels;
      settings.updatedAt = new Date();
      await settings.save();
    } else {
      settings = await HomeSettings.create({
        heroSlides: data.heroSlides || [],
        productCarousels: data.productCarousels || [],
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error in POST /api/admin/home-settings:', error);
    return NextResponse.json({ success: false, error: 'Database Error' }, { status: 500 });
  }
}
