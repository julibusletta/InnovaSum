import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role?.toUpperCase();
    
    // Auth check
    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    // Get analytics for the last 30 days
    const visits = await db.getRecentVisits(30);
    
    // Calculate aggregates across all days
    const totalVisits = visits.reduce((acc, v) => acc + (v.count || 0), 0);
    
    // Aggressive reduction for cities, products and referrers
    const cityMap: Record<string, number> = {};
    const productMap: Record<string, { name: string, count: number }> = {};
    const referrerMap: Record<string, number> = {};
    const deviceTotals = { mobile: 0, desktop: 0, tablet: 0 };

    visits.forEach(day => {
      // Cities
      (day.cities || []).forEach((c: any) => {
        cityMap[c.name] = (cityMap[c.name] || 0) + c.count;
      });
      
      // Products
      (day.products || []).forEach((p: any) => {
        if (!productMap[p.productId]) {
          productMap[p.productId] = { name: p.name, count: 0 };
        }
        productMap[p.productId].count += p.count;
      });
      
      // Referrers
      (day.referrers || []).forEach((r: any) => {
        referrerMap[r.domain] = (referrerMap[r.domain] || 0) + r.count;
      });

      // Devices
      if (day.devices) {
        deviceTotals.mobile += (day.devices.mobile || 0);
        deviceTotals.desktop += (day.devices.desktop || 0);
        deviceTotals.tablet += (day.devices.tablet || 0);
      }
    });

    // Formatting for display
    const topCities = Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topProducts = Object.entries(productMap)
      .map(([id, data]) => ({ id, name: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topReferrers = Object.entries(referrerMap)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({
      success: true,
      timeSeries: visits.map(v => ({ date: v.dateStr, count: v.count })),
      totalVisits,
      topCities,
      topProducts,
      topReferrers,
      deviceTotals
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
