import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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

    // Generate unique filename
    const extension = file.name.split('.').pop();
    const filename = `products/${uuidv4()}.${extension}`;

    console.log(`Subiendo imagen de producto a Vercel Blob: ${filename}`);

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: file.type || 'image/jpeg'
    });

    console.log(`Archivo guardado exitosamente en Vercel Blob: ${blob.url}`);

    return NextResponse.json({ 
      success: true, 
      url: blob.url 
    });
  } catch (error: any) {
    console.error('Error en upload:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
