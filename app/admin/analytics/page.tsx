'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  FaUsers, FaArrowUp, FaArrowDown, FaGlobe, FaMobileAlt, FaDesktop, FaTabletAlt,
  FaShoppingBag, FaLink, FaCalendarAlt
} from 'react-icons/fa';

interface AnalyticsData {
  success: boolean;
  timeSeries: { date: string, count: number }[];
  totalVisits: number;
  topCities: { name: string, count: number }[];
  topProducts: { id: string, name: string, count: number }[];
  topReferrers: { domain: string, count: number }[];
  deviceTotals: { mobile: number, desktop: number, tablet: number };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/analytics');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        No se pudieron cargar las analíticas o no hay datos suficientes.
      </div>
    );
  }

  // Prep device data for pie chart
  const deviceData = [
    { name: 'Móvil', value: data.deviceTotals.mobile, color: '#3b82f6' },
    { name: 'Desktop', value: data.deviceTotals.desktop, color: '#10b981' },
    { name: 'Tablet', value: data.deviceTotals.tablet, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Analíticas</h1>
          <p className="text-gray-500 text-sm">Resumen del tráfico y comportamiento en los últimos 30 días</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2 text-sm text-gray-600">
          <FaCalendarAlt className="text-blue-500" />
          <span>Últimos 30 días</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Visitas Totales" 
          value={data.totalVisits.toLocaleString()} 
          icon={<FaUsers />} 
          color="blue"
          trend="+12%" 
        />
        <StatCard 
          title="Mejor Ciudad" 
          value={data.topCities[0]?.name || 'N/A'} 
          icon={<FaGlobe />} 
          color="green"
        />
        <StatCard 
          title="Producto Más Visto" 
          value={data.topProducts[0]?.name?.split(' ')[0] || 'N/A'} 
          icon={<FaShoppingBag />} 
          color="purple"
        />
        <StatCard 
          title="Principal Referente" 
          value={data.topReferrers[0]?.domain || 'Directo'} 
          icon={<FaLink />} 
          color="orange"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800">Tráfico Cronológico</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="text-[10px] text-gray-500 uppercase font-bold">Visitas Diarias</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8' }}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorVisits)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6">Dispositivos</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            {deviceData.length > 0 ? (
              <>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full mt-6 space-y-3">
                  {deviceData.map((d, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-gray-600">{d.name}</span>
                      </div>
                      <span className="font-bold">{Math.round((d.value / deviceData.reduce((a,b)=>a+b.value,0)) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm italic">Sin datos de dispositivos</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Top Productos Visitados</h3>
            <button className="text-xs text-blue-500 font-bold hover:underline">Ver todos</button>
          </div>
          <div className="divide-y divide-gray-50">
            {data.topProducts.map((p, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                  #{i+1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400 uppercase tracking-tight">{p.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{p.count}</p>
                  <p className="text-[10px] text-gray-400">Vistas</p>
                </div>
              </div>
            ))}
            {data.topProducts.length === 0 && (
              <div className="p-8 text-center text-gray-400 italic text-sm">No hay registros de productos aún</div>
            )}
          </div>
        </div>

        {/* Top Referrers & Cities */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Fuentes de Tráfico</h3>
            <div className="space-y-4">
              {data.topReferrers.map((r, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-gray-600">{r.domain}</span>
                    <span className="text-gray-400">{r.count} visitas</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${(r.count / (data.topReferrers[0]?.count || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {data.topReferrers.length === 0 && (
                <div className="text-gray-400 text-sm italic">Directo / Otros</div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Geografía (Top 5)</h3>
            <div className="grid grid-cols-2 gap-4">
              {data.topCities.slice(0, 6).map((c, i) => (
                <div key={i} className="flex flex-col p-3 rounded-xl bg-gray-50 border border-gray-200/50">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{c.name}</span>
                  <span className="text-lg font-bold text-blue-600">{c.count}</span>
                </div>
              ))}
              {data.topCities.length === 0 && (
                <div className="col-span-2 text-gray-400 text-sm italic">Sin datos de ubicación</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, trend }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className={`p-3 rounded-xl w-fit mb-4 transition-transform group-hover:scale-110 ${colorMap[color] || colorMap.blue}`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <FaArrowUp size={8} />
          {trend}
          <span className="text-gray-400 font-normal ml-1">vs mes pasado</span>
        </div>
      )}
    </div>
  );
}
