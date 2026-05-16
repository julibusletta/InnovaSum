'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaTags, 
  FaCog, 
  FaExternalLinkAlt, 
  FaChartLine,
  FaUsers,
  FaTrophy,
  FaSearch,
  FaImage,
  FaHistory
} from 'react-icons/fa';
import '../styles/AdminV2.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  React.useEffect(() => {
    // Marcar este navegador como "Admin" para no contar sus visitas en las estadísticas de la tienda
    localStorage.setItem('jb_no_track', 'true');
  }, []);

  const navGroups = [
    {
      label: 'Resumen',
      items: [
        { label: 'Dashboard', href: '/admin', icon: <FaHome /> },
        { label: 'Analíticas', href: '/admin/analytics', icon: <FaChartLine /> },
      ]
    },
    {
      label: 'Catálogo',
      items: [
        { label: 'Productos', href: '/admin/products', icon: <FaBox /> },
        { label: 'Categorías', href: '/admin/categories', icon: <FaTags /> },
        { label: 'Lista Mayorista', href: '/admin/wholesale', icon: <FaTrophy /> },
      ]
    },
    {
      label: 'Ventas',
      items: [
        { label: 'Pedidos', href: '/admin/orders', icon: <FaShoppingCart /> },
        { label: 'Auditoría de Pagos', href: '/admin/webhooks', icon: <FaHistory /> },
        { label: 'Descuentos', href: '/admin/promotions', icon: <FaTrophy /> },
        { label: 'Cupones', href: '/admin/coupons', icon: <FaTags /> },
      ]
    },
    {
      label: 'Usuarios',
      items: [
        { label: 'Clientes', href: '/admin/customers', icon: <FaUsers /> },
      ]
    },
    {
      label: 'Sitio Web',
      items: [
        { label: 'Inicio / Sliders', href: '/admin/home', icon: <FaImage /> },
      ]
    },
    {
      label: 'Sistema',
      items: [
        { label: 'Configuración', href: '/admin/settings', icon: <FaCog /> },
      ]
    }
  ];

  return (
    <div className="admin-v2-container">
      {/* Sidebar */}
      <aside className="admin-v2-sidebar">
        <div className="admin-v2-logo">
          <span>INNOVASUM</span>
        </div>

        <nav className="admin-v2-nav">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="mb-6">
              <div className="admin-v2-nav-group-label">{group.label}</div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`admin-v2-nav-item ${isActive ? 'active' : ''}`}
                    >
                      <span className="admin-v2-nav-icon">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e1e3e5] space-y-2">
          <Link 
            href="/" 
            className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors group"
          >
            <span className="flex items-center gap-2">
               <FaExternalLinkAlt className="text-gray-400" />
               Ver Tienda
            </span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
          >
            <FaExternalLinkAlt className="rotate-180" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-v2-main">
        <header className="admin-v2-header">
           <div className="flex items-center gap-4 text-gray-400">
              <FaSearch />
              <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-sm text-gray-600 w-64" />
           </div>
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">AD</div>
           </div>
        </header>
        
        <main className="admin-v2-content">
          {children}
        </main>
      </div>
    </div>
  );
}

