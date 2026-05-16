import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { put } from '@vercel/blob';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with .webp extension
    const filename = `banners/banner-${uuidv4().substring(0, 8)}.webp`;
    
    // Process image with Sharp: Resize to max 1920 width, optimize and convert to webp
    console.log(`Procesando imagen: ${file.name}`);
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, null, { withoutEnlargement: true }) // No agrandar si es pequeña
      .webp({ quality: 80 })
      .toBuffer();

    console.log(`Subiendo banner optimizado a Vercel Blob...`);
    
    // Upload exactly to Vercel Blob
    const blob = await put(filename, optimizedBuffer, {
      access: 'public',
      contentType: 'image/webp'
    });

    console.log(`Banner guardado exitosamente en Vercel Blob: ${blob.url}`);

    // Publicly accessible URL (provided explicitly by Blob)
    const blobUrl = blob.url;

    return NextResponse.json({ 
      success: true, 
      url: blobUrl 
    });
  } catch (error: any) {
    console.error('Error en upload-banner (sharp):', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
