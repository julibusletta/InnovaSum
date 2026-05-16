import { NextResponse } from 'next/server';
import { getAndreaniOffices } from '@/lib/shipping/andreani';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const zipCode = searchParams.get('zipCode');

    if (!zipCode) {
      return NextResponse.json({ success: false, message: 'Código postal requerido' }, { status: 400 });
    }

    const branches = await getAndreaniOffices(zipCode);

    return NextResponse.json({
      success: true,
      branches
    });

  } catch (error: any) {
    console.error('Branches API Error:', error.message);
    return NextResponse.json({ 
      success: false, 
      message: 'Error al obtener sucursales' 
    }, { status: 500 });
  }
}
