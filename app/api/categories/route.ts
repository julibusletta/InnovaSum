import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CategoryModel from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await CategoryModel.find({}).lean();
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
