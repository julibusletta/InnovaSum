import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role?.toUpperCase();
    
    if (!session) {
      return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
    }

    await dbConnect();
    const User = await (db as any).getUserModel();
    const Order = await (db as any).getOrderModel();
    
    // 1. Get all registered users
    const registeredUsers = await User.find({ role: { $ne: 'ADMIN' } }).sort({ createdAt: -1 }).lean();
    
    // 2. Get all unique emails from orders to find "Guests"
    const orderEmails = await Order.distinct('userEmail');
    
    // 3. Merge and deduplicate
    const allCustomersMap = new Map();
    
    // Add registered users first
    registeredUsers.forEach((u: any) => {
      allCustomersMap.set(u.email.toLowerCase(), {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        dni: u.dni,
        type: 'REGISTRADO',
        createdAt: u.createdAt
      });
    });
    
    // Add missing guest emails from orders
    const orders = await Order.find({ userEmail: { $in: orderEmails } }).sort({ createdAt: -1 }).lean();
    
    orders.forEach((o: any) => {
      const email = o.userEmail.toLowerCase();
      if (!allCustomersMap.has(email)) {
        allCustomersMap.set(email, {
          email: o.userEmail,
          firstName: o.userName?.split(' ')[0] || 'Cliente',
          lastName: o.userName?.split(' ').slice(1).join(' ') || 'Invitado',
          phone: o.userPhone || '',
          dni: o.dni || '',
          type: 'INVITADO',
          createdAt: o.createdAt
        });
      }
    });

    const finalCustomers = Array.from(allCustomersMap.values());
    
    // Enrich with order count
    const enrichedCustomers = await Promise.all(finalCustomers.map(async (customer: any) => {
      const orderCount = await Order.countDocuments({ userEmail: new RegExp(`^${customer.email}$`, 'i') });
      return {
        ...customer,
        orderCount
      };
    }));
    
    return NextResponse.json({ success: true, customers: enrichedCustomers });
  } catch (error: any) {
    console.error('API Error [customers]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
