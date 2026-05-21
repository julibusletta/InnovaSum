import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const product = await ProductModel.findOne({ id }).lean();
    
    if (!product || product.published === false) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { costPrice } = body;

    if (typeof costPrice !== 'number') {
      return NextResponse.json({ error: 'Invalid cost price' }, { status: 400 });
    }

    await dbConnect();
    const product = await ProductModel.findOne({ id });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product cost price
    product.costPrice = costPrice;
    await product.save();

    return NextResponse.json({ 
      success: true, 
      product: {
        id: product.id,
        name: product.name,
        costPrice: product.costPrice,
        price: product.price
      }
    });
  } catch (error: any) {
    console.error('Error updating product price:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
