'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaShoppingCart, 
  FaBoxOpen, 
  FaUsers, 
  FaDollarSign, 
  FaExclamationTriangle,
  FaArrowUp,
  FaClock,
  FaTags,
  FaChartLine,
  FaEllipsisH,
  FaTrophy
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalSales: 0,
    totalClients: 0,
    recentOrders: [] as any[],
    visitsLast7: [] as { label: string, count: number }[],
    totalVisitsToday: 0,
    topRegions: [] as { name: string, count: number }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [prodResp, ordersResp] = await Promise.all([
          fetch('/api/admin'),
          fetch('/api/admin/orders')
        ]);
        const prodData = await prodResp.json();
        const ordersData = await ordersResp.json();
        
        const allProducts = Object.values(prodData.products || {}).flat() as any[];
        const lowStockCount = allProducts.filter((p: any) => p.stock <= 5).length;

        let fetchedOrders = [];
        let totalSalesVal = 0;
        let pendingCount = 0;
        let uniqueClients = new Set();
        
        if (ordersData.success && Array.isArray(ordersData.orders)) {
          fetchedOrders = ordersData.orders;
          fetchedOrders.forEach((o: any) => {
             if (o.status === 'APPROVED' || o.status === 'SHIPPED') {
                totalSalesVal += o.total || 0;
             }
             if (o.status === 'PENDING' || o.status === 'PENDING_REVIEW') {
                pendingCount++;
             }
             if (o.userEmail) {
                uniqueClients.add(o.userEmail);
             }
          });
        }

        // Process Visits
        const rawVisits = prodData.visits || [];
        const chartData = [];
        let todayVisits = 0;
        
        // Pad to 7 days
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          
          const found = rawVisits.find((v: any) => v.dateStr === dateStr);
          const count = found ? found.count : 0;
          
          if (i === 0) todayVisits = count;
          
          chartData.push({
            label: d.toLocaleDateString('es-AR', { weekday: 'short' }),
            count
          });
        }

        // Process Top Regions (aggregate from all recent visits)
        const regionMap: Record<string, number> = {};
        rawVisits.forEach((v: any) => {
          if (v.cities && Array.isArray(v.cities)) {
            v.cities.forEach((c: any) => {
              regionMap[c.name] = (regionMap[c.name] || 0) + c.count;
            });
          }
        });
        const topRegions = Object.entries(regionMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          totalProducts: allProducts.length,
          lowStock: lowStockCount,
          totalOrders: fetchedOrders.length,
          pendingOrders: pendingCount,
          totalSales: totalSalesVal,
          totalClients: uniqueClients.size,
          recentOrders: fetchedOrders.slice(0, 5),
          visitsLast7: chartData,
          totalVisitsToday: todayVisits,
          topRegions
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { 
      label: 'Ventas Aprobadas', 
      value: `$${stats.totalSales.toLocaleString()}`, 
      icon: <FaDollarSign />, 
      trend: 'Recibidas',
      trendUp: true
    },
    { 
      label: 'Pedidos Totales', 
      value: stats.totalOrders.toString(), 
      icon: <FaShoppingCart />, 
      trend: stats.pendingOrders > 0 ? `${stats.pendingOrders} pendientes` : 'Al día',
      trendUp: stats.pendingOrders === 0
    },
    { 
      label: 'Clientes', 
      value: stats.totalClients.toString(), 
      icon: <FaUsers />, 
      trend: 'Únicos',
      trendUp: true
    },
    { 
      label: 'Stock Crítico', 
      value: stats.lowStock.toString(), 
      icon: <FaExclamationTriangle />, 
      trend: stats.lowStock > 0 ? 'Atención' : 'OK',
      trendUp: stats.lowStock === 0
    }
  ];

  if (loading) return <div className="flex items-center justify-center min-h-[400px] text-gray-400 font-medium animate-pulse">Cargando...</div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <h1 className="admin-v2-page-title mb-0">Dashboard</h1>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white border border-[#e1e3e5] rounded text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Exportar</button>
           <button className="px-4 py-2 bg-[#058c8c] text-white rounded text-sm font-bold hover:shadow-lg hover:bg-[#047a7a] transition">Nueva Venta</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="admin-v2-card p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-lg text-[#058c8c] text-lg">
                {card.icon}
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${card.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</div>
              <div className="text-2xl font-black text-gray-900">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Sales Chart Placeholder */}
          <div className="admin-v2-card">
            <div className="p-6 border-b border-[#e1e3e5] flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Visitas Diarias</h3>
              <div className="text-xs font-bold text-[#058c8c] bg-[#058c8c]/10 px-3 py-1 rounded-full">
                Hoy: {stats.totalVisitsToday} Visitas
              </div>
            </div>
            <div className="p-10 h-80 flex flex-col justify-end gap-2">
               <div className="flex items-end justify-between h-full gap-2">
                  {stats.visitsLast7.map((item, i) => {
                    const maxCount = Math.max(...stats.visitsLast7.map(v => v.count), 1); // Avoid div by 0
                    const heightPercent = Math.max((item.count / maxCount) * 100, 5); // At least 5% bar height visually
                    
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-gray-50 rounded-t-lg relative overflow-hidden h-full">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-[#058c8c]/20 group-hover:bg-[#058c8c]/40 transition-all rounded-t-lg flex items-end justify-center pb-1 text-[9px] font-bold text-[#058c8c]/70" 
                            style={{ height: `${heightPercent}%` }}
                          >
                            {item.count > 0 ? item.count : ''}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 capitalize">{item.label}</span>
                      </div>
                    );
                  })}
               </div>
            </div>
          </div>

          {/* Recent Orders Table Placeholder */}
          <div className="admin-v2-card">
            <div className="p-6 border-b border-[#e1e3e5] flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Pedidos Recientes</h3>
              <Link href="/admin/orders" className="text-xs font-bold text-[#058c8c] hover:underline">Ver todos</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e1e3e5]">
                  {stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">Sin pedidos</td>
                    </tr>
                  ) : stats.recentOrders.map((order, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold text-gray-900">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-6 py-4 text-gray-600">{order.userName || order.userEmail}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'PENDING' || order.status === 'PENDING_REVIEW' ? 'bg-amber-50 text-amber-600' : 
                          order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600' : 
                          order.status === 'CANCELLED' || order.status === 'REJECTED' ? 'bg-red-50 text-red-600' :
                          'bg-green-50 text-green-600'
                        }`}>
                          {order.status === 'PENDING' ? 'Pendiente' : 
                           order.status === 'APPROVED' ? 'Aprobado' : 
                           order.status === 'SHIPPED' ? 'Enviado' : 
                           order.status === 'PENDING_REVIEW' ? 'Revisión' : 
                           order.status === 'CANCELLED' ? 'Cancelado' : 
                           order.status === 'REJECTED' ? 'Rechazado' : order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">${(order.total || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards */}
        <div className="space-y-8">
            <div className="admin-v2-card bg-[#1a1c1d] text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <FaTrophy className="text-6xl rotate-12" />
              </div>
              <h4 className="font-bold mb-2">Ofertas Activas</h4>
              <p className="text-xs text-gray-400 mb-6 leading-relaxed">Tienes 3 promociones de temporada activas que vencen este viernes.</p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-bold transition">Gestionar Ofertas</button>
           </div>

           <div className="admin-v2-card p-6">
              <h4 className="font-bold text-gray-900 mb-4">Top Tráfico Geográfico</h4>
              <div className="space-y-4">
                 {stats.topRegions.length > 0 ? stats.topRegions.map((region, i) => (
                   <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-end">
                         <span className="text-[11px] font-bold text-gray-700 uppercase tracking-tight">{region.name}</span>
                         <span className="text-[10px] font-black text-[#058c8c]">{region.count}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-[#058c8c] rounded-full" 
                           style={{ width: `${Math.min((region.count / Math.max(...stats.topRegions.map(r => r.count), 1)) * 100, 100)}%` }}
                         ></div>
                      </div>
                   </div>
                 )) : (
                   <div className="py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Calculando datos...</div>
                 )}
              </div>
           </div>

           <div className="admin-v2-card p-6">
              <h4 className="font-bold text-gray-900 mb-4">Actividad del Sistema</h4>
              <div className="space-y-6">
                 {[
                   { title: 'Base de Datos', desc: 'Sincronizado con MongoDB Atlas', status: 'online' },
                   { title: 'Pagos Nave', desc: 'Webhook configurado correctamente', status: 'online' },
                   { title: 'Inventario', desc: 'Sincronizado con el catálogo', status: 'online' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-3">
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                         <div className="text-xs font-bold text-gray-900">{item.title}</div>
                         <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


